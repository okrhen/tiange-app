import { gql } from "@apollo/client";

// === start query == 
export const FETCH_PRODUCT = gql`
  query Product{
    getProducts {
      id
      barcode
      name
      inventory {
        quantity
      }
      unit {
        name
      }
    }
  }`


export const GET_PROD_CATEGORIES = gql`
  query ProductOptions {
     getProductCategories {
      name
      id
     }
     getProductUnit {
       name
       id
     }
  }
`;

export const FETCH_CATEGORIES = gql`
  query ProductCategory{
    getProductCategories {
        id
        name
    }
}`

export const FETCH_UNIT = gql`
  query ProductUnit {
    getProductUnit {
      id
      name
    }
}`

export const FIND_PRODUCT = gql`
  query FindProduct($code: String!) {
    findProductBySkuCode(code: $code) {
      id
      name
      barcode
      description
      category {
        name
      }
      inventory {
        quantity
      }
      unit {
        name
      }
    }
  }
`

// === end query == 

// === start mutation == 

export const CREATE_PRODUCT = gql`
  mutation createProduct(
    $barcode: String!, 
    $name: String!, 
    $category: String!, 
    $cost: Float!, 
    $price: Float!, 
    $quantity: Int!, 
    $unit: String!, 
    $description: String, 
  ) {
    createProduct(product: {
      barcode: $barcode,
      name: $name, 
      category: $category, 
      cost: $cost, 
      price: $price, 
      quantity: $quantity, 
      unit: $unit, 
      description: $description, 
    }) {
      id
      name
    }
  }
`

export const CREATE_PRODUCT_CATEGORY = gql`
  mutation createProductCategory($name: String!) {
    createProductCategory(name: $name) {
      id
      name
    }
  }
`;

export const CREATE_PRODUCT_UNIT = gql`
  mutation createProductUnit($name: String!) {
    createProductUnit(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_PRODUCT_STOCK = gql`
  mutation updateProductStock($productId: ID!, $quantity: Float) {
    updateProductStock(productId: $productId, quantity: $quantity) {
      quantity
    }
  }
`;

// === end mutation == 
