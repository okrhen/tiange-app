import { gql } from "@apollo/client";

/**
 * start query
 */

 export const GET_ACTIVE_TRANSACTION = gql`
 query getActiveTransaction($transactionNumber: ID!) {
   getActiveSalesTransaction(transactionNumber: $transactionNumber) {
     overallTotal
     productList {
       total
       quantity
       product {
         name
       }
     }
   }
 }
`

/**
 * end query
 */

// === start mutation == 
export const CREATE_NEW_TRANSACTION = gql`
  mutation createNewTransaction {
    createSaleTransaction {
      id
    }
  }
`

export const ADD_IN_PRODUCT = gql`
  mutation addInProduct($transactionNumber: ID!, $code: String!, $quantity: Float!) {
    createTransaction(transactionNumber: $transactionNumber, code: $code, quantity: $quantity) {
      success
    }
  }
`
// === end mutation == 
