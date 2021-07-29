import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useCallback, useReducer } from 'react'
import { ADD_IN_PRODUCT, CREATE_NEW_TRANSACTION, GET_ACTIVE_TRANSACTION } from './gql/PoS.gql';

const initialState = {
  isCreating: false,
  transactionNumber: undefined,
  quantity: '1',
  productCode: '',
  products: [],
  overallTotal: 0
}

const reducer = (state: any, action: { type: any, value?: any }) => {
  switch(action.type) {
    case 'START_NEW_TRANSACTION':
      return {
        ...state,
        isCreating: true
      }

    case 'START_NEW_TRANSACTION_SUCCESS':
        return {
          ...state,
          isCreating: false,
          transactionNumber: action.value
        }

    case 'ADD_IN_PRODUCT':
      return {
        ...state,
        productCode: action.value
      }
    
    case 'SET_ADDED_ITEM':
      return {
        ...state,
        overallTotal: action.value.overallTotal,
        products: action.value.products
      }

    default:
      return state;
  }
}


function pad(num: string | any[], size: number) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

const usePosReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [createNewTransaction] = useMutation(CREATE_NEW_TRANSACTION, {
    onCompleted: ({createSaleTransaction}) => {
      const {id} = createSaleTransaction
      dispatch({
        type: 'START_NEW_TRANSACTION_SUCCESS',
        value: id
      })
    },
    onError: (err) => {
      console.error(err.message)
    }
  })

  const [addInProduct] = useMutation(ADD_IN_PRODUCT, {
    onCompleted: () => {
      getActiveTransaction({
        variables: {
          transactionNumber: state.transactionNumber
        }
      })
    },
    onError: (err) => {
      console.log('addInProduct err ==>', err.message)
    }
  })

  const [getActiveTransaction]= useLazyQuery(GET_ACTIVE_TRANSACTION, {
    onError: (err) => {
      console.log('getActiveTransaction ==>', err.message)
    },
    onCompleted: ({getActiveSalesTransaction}) => {
      const {overallTotal, productList} = getActiveSalesTransaction
      dispatch({
        type: 'SET_ADDED_ITEM',
        value: {
          overallTotal,
          products: productList
        }
      })
    }
  })

  const handleNewTransaction = () => {
    dispatch({
      type: 'START_NEW_TRANSACTION'
    })
    createNewTransaction()
  }

  
  const transactionNumber = state.transactionNumber ? pad(state.transactionNumber, 10) : undefined

  const handleScan = (value: string) => {
    addInProduct({
      variables: {
        transactionNumber: state.transactionNumber,
        code: value,
        quantity: Number(state.quantity)
      }
    })
  }

  const handleInputScanChange = (value: string) => {
    dispatch({
      type: 'ADD_IN_PRODUCT',
      value
    })
  }

  return {
    state,
    transactionNumber,
    handleNewTransaction,
    handleScan,
    handleInputScanChange
  }
}

export default usePosReducer