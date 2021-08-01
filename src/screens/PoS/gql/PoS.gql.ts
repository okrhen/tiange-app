import { gql } from "@apollo/client";

/**
 * start query
 */

 export const GET_ACTIVE_TRANSACTION = gql`
 query getActiveTransaction($transactionNumber: ID!) {
   getActiveSalesTransaction(transactionNumber: $transactionNumber) {
     overallTotal
     totalItems
     subTotal
     vatAmount
     productList {
      salesTransactionId
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

export const SAVE_PAYMENT = gql`
  mutation savePayment($transactionNumber: ID!, $amountReceived: Float!, $paymentType: String!) {
    salesMakePayment(transactionNumber: $transactionNumber, amountReceived: $amountReceived, paymentType: $paymentType ) {
      amountChange
    }
  }
`

// === end mutation == 
