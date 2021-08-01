import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useReducer, useRef } from 'react'
import { formatNumber } from '../../utils/currency';
import { ADD_IN_PRODUCT, CREATE_NEW_TRANSACTION, GET_ACTIVE_TRANSACTION, SAVE_PAYMENT } from './gql/PoS.gql';

const initialState = {
  modalIsOpen: true,
  isCreating: false,
  transactionNumber: undefined,
  quantity: 1,
  productCode: '',
  products: [],
  isAddingProduct: false,
  totalItems: 0,
  overallTotal: 0,
  subTotal: 0,
  vatAmount: 0,
  payment: {
    showPaymentModal: false,
    amountReceived: 0,
    paymentMethod: undefined,
    /** props if successfulPayment */
    isSaving: false,
    paymentSaved: false,
    amountChange: undefined
  }
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
          transactionNumber: action.value,
          modalIsOpen: false
        }

    case 'ADD_IN_PRODUCT':
      return {
        ...state,
        productCode: action.value
      }
    
    case 'SET_ADDED_ITEM':
      return {
        ...state,
        products: action.value.products,
        productCode: '',
        totalItems: action.value.totalItems,
        isAddingProduct: false,
        quantity: initialState.quantity,
        // total
        overallTotal: action.value.overallTotal,
        subTotal: action.value.subTotal,
        vatAmount: action.value.vatAmount,
      }

    case 'SET_QUANTITY': 
      return {
        ...state,
        quantity: action.value
      }

    case 'SET_IS_ADDING_PRODUCT':
      return {
        ...state,
        isAddingProduct: action.value
      }

    case 'SET_MODAL_ISOPEN':
      return {
        ...state,
        modalIsOpen: action.value
      }

    case 'IS_PAYING': 
      return {
        ...state,
        payment: {
          ...state.payment,
          showPaymentModal: action.value
        }
      }

    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        payment: {
          ...state.payment,
          amountReceived: action.value === 'others' ? 
           state.overallTotal.toString() : 
           state.payment.amountReceived,
          paymentMethod: action.value
        }
      }

    case 'SET_CANCEL_PAYMENT':
      return {
        ...state,
        payment: initialState.payment
      }

    case 'SET_INPUT_PAYMENT':
      return {
        ...state,
        payment: {
          ...state.payment,
          amountReceived: action.value
        }
      }
    
    case 'IS_PAYMENT_SAVING':
      return {
        ...state,
        payment: {
          ...state.payment,
          isSaving: true
        }
      }
    
    case 'SUCCESS_PAYMENT_MADE':
      return {
        ...state,
        payment: {
          ...state.payment,
          isSaving: false,
          paymentSaved: true,
          amountChange: action.value
        }
      }

      case 'FAIL_PAYMENT_MADE':
        return {
          ...state,
          payment: {
            ...state.payment,
            isSaving: false
          }
        }
      
      case 'RESET_TRANSACTION':
        return {
          ...initialState,
          modalIsOpen: false
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
  const inputSearchCodeRef = useRef<any>(null)

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
    fetchPolicy: 'network-only',
    onError: (err) => {
      console.log('error getActiveTransaction ==>', err.message)
      dispatch({
        type: 'SET_IS_ADDING_PRODUCT',
        value: false
      })
    },
    onCompleted: ({getActiveSalesTransaction}) => {
      const {overallTotal, totalItems, productList, subTotal, vatAmount} = getActiveSalesTransaction

      dispatch({
        type: 'SET_ADDED_ITEM',
        value: {
          overallTotal,
          products: productList,
          totalItems,
          subTotal,
          vatAmount
        }
      })
    }
  })

  const [savePayment] = useMutation(SAVE_PAYMENT, {
    onCompleted: ({salesMakePayment}) => {
      const {amountChange} = salesMakePayment
      dispatch({
        type: 'SUCCESS_PAYMENT_MADE',
        value: amountChange
      })
    },
    onError: (err) => {
      dispatch({
        type: 'FAIL_PAYMENT_MADE',
      })
      console.log('savePayment err ==>', err.message)
    }
  })

  const handleNewTransaction = () => {
    dispatch({
      type: 'START_NEW_TRANSACTION'
    })
    createNewTransaction()
    handleClearandFocus()
  }

  
  const transactionNumber = state.transactionNumber ? pad(state.transactionNumber, 10) : undefined

  const handleScan = (value: string) => {
    handleClearandFocus()

    dispatch({
      type: 'SET_IS_ADDING_PRODUCT',
      value: true
    })
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

  const handleClearandFocus = () => {
    if(inputSearchCodeRef && inputSearchCodeRef.current) {
      inputSearchCodeRef.current.clear();
      inputSearchCodeRef.current.focus();
    }
  }

  const hasItems = state.totalItems > 0;
  const hasTransactionNumber = Boolean(state.transactionNumber)

  const closeModal = () => dispatch({
    type: 'SET_MODAL_ISOPEN',
    value: false
  })

  const handleQuantityChange = (value: string) => {
    dispatch({
      type: 'SET_QUANTITY',
      value: Number(value)
    })
  }


 /** PAYMENT ACTIONS */ 
  const handlePayment = () => {
    dispatch({
      type: 'IS_PAYING',
      value: true
    })
  }

  const handleSelectPaymentMethod = (type: 'cash' | 'others') => {
    dispatch({
      type: 'SET_PAYMENT_METHOD',
      value: type
    })
  }

  const handleCancelPayment = () => {
    dispatch({
      type: 'SET_CANCEL_PAYMENT'
    })
  }

  const handleInputPayment = (value: string) => {
    dispatch({
      type: 'SET_INPUT_PAYMENT',
      value: formatNumber(value)
    })
  }

  const handleSavePayment = () => {
    dispatch({
      type: 'IS_PAYMENT_SAVING',
    })
    savePayment({
      variables: {
        transactionNumber: state.transactionNumber,
        amountReceived: Number(state.payment.amountReceived),
        paymentType: state.payment.paymentMethod
      }
    })
  }

  const handleCloseSavedPayment = () => (
    dispatch({
      type: 'RESET_TRANSACTION',
    })
  )

/** END PAYMENT ACTIONS */ 


  return {
    state,
    transactionNumber,
    handleNewTransaction,
    handleScan,
    handleInputScanChange,
    inputSearchCodeRef,
    hasItems,
    closeModal,
    handleQuantityChange,
    hasTransactionNumber,
    paymentAction: {
      handlePayment,
      handleSelectPaymentMethod,
      handleCancelPayment,
      handleInputPayment,
      handleSavePayment,
      handleCloseSavedPayment
    }
  }
}

export default usePosReducer