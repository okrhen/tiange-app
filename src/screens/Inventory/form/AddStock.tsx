import { useLazyQuery, useMutation } from '@apollo/client';
import { Box, Button, HStack, Input, Spinner, Text, useToast, VStack } from 'native-base'
import React, { useState } from 'react'
import { NativeSyntheticEvent, TextInputEndEditingEventData } from 'react-native';
import Themes from '../../../styles/Themes';
import { FIND_PRODUCT, UPDATE_PRODUCT_STOCK } from '../gql/Inventory.gql';

const AddStock = () => {
  const toast = useToast()
  const [searchText, setSearchText] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [product, setProduct] = useState<any>(undefined)
  const [findProduct, { loading }] = useLazyQuery(FIND_PRODUCT, {
    onCompleted: ({ findProductBySkuCode }) => {
      setSearchText('')
      if (findProductBySkuCode) {
        setProduct(findProductBySkuCode)
      } else {
        toast.show({
          title: 'Product not found',
          placement: 'bottom',
          status: 'error'
        })
      }

    },
    onError: (err) => {
      setSearchText('')
      console.log('err ==>', err);
    }
  })

  const [updateStock] = useMutation(UPDATE_PRODUCT_STOCK, {
    onError: (err) => {
      console.log('err ==>', err)
      toast.show({
        title: err.message,
        placement: 'bottom',
        status: 'error'
      })
    },
    onCompleted: (data) => {
      toast.show({
        title: 'Stock added successfully',
        placement: 'bottom',
        status: 'success'
      })
      resetInitialData()
    }
  })

  const resetInitialData = () => {
    setSearchText('')
    setQuantity('')
    setProduct(undefined)
  }

  const handleEndEditing = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    setSearchText(e.nativeEvent.text);
    findProduct({ variables: { code: e.nativeEvent.text } })
    resetProduct()
  }

  const resetProduct = () => setProduct(undefined);

  const handleSearch = () => {
    findProduct({ variables: { code: searchText } })
  }

  const handleChange = (qty: string) => {
    setQuantity(qty)
  }

  const handleSearchCode = (val: string) => {
    resetProduct()
    setSearchText(val)
  }

  const handleAddQuantity = () => {
    updateStock({
      variables: {
        productId: product.id,
        quantity: Number(quantity)
      }
    })
  }

  const productItemVisible = Boolean(!loading && product)

  return (
    <Box padding={5} flex={1}>
      <VStack
        backgroundColor={Themes.common.white}
        flex={1}
        borderRadius={4}
        padding={10}
        space={20}
      >
        <HStack flex={.1} >
          <Input
            size="lg"
            placeholder="Enter SKU or Barcode"
            flex={.8}
            onEndEditing={handleEndEditing}
            onChangeText={handleSearchCode}
            value={searchText}
            clearTextOnFocus
            clearButtonMode="unless-editing"
            autoFocus
          />
          <Button flex={.2} size="lg" onPress={handleSearch} >
            <Text
              color={Themes.common.white}
            >
              Search
            </Text>
          </Button>
        </HStack>
        <Box flex={.9}>
          {loading && !product && <Spinner size="lg" color="danger.400" />}
          {
            productItemVisible && (
              <HStack space={2}>
                <ProductInfo product={product} />
                <VStack flex={.3} space={1}>
                  <Input
                    size="xl"
                    placeholder="Quantity"
                    textAlign="center"
                    onChangeText={handleChange}
                    value={quantity}
                  />
                  <Button bg="#065f46" onPress={handleAddQuantity}>
                    <Text color={Themes.common.white}>Add</Text>
                  </Button>
                </VStack>
              </HStack>
            )
          }
        </Box>
      </VStack>
    </Box>
  )
}

const ProductInfo = ({ product }: any) => product ? (
  <HStack flex={.7}>
    <Box flex={.4}>
    </Box>
    <Box flex={.6}>
      <Text fontSize="2xl">{product?.name}</Text>
      <Text fontSize="md">{product?.description}</Text>
      <Text fontSize="md">{product?.category?.name}</Text>
      <Text fontSize="md">{product?.inventory?.quantity} {product?.unit?.name} left</Text>
    </Box>
  </HStack>
) : null

export default AddStock;