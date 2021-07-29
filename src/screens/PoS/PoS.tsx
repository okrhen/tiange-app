import React from "react";
import { Box, Button, HStack, Input, Modal, Text, VStack, FlatList } from "native-base";
import Themes from "../../styles/Themes";
import usePosReducer from "./usePosReducer";
import { NativeSyntheticEvent, TextInputEndEditingEventData } from "react-native";
import { formatCurrency } from "../../utils/currency";

const pos = () => {

  const {
    handleNewTransaction,
    transactionNumber,
    handleScan,
    handleInputScanChange,
    state,
  } = usePosReducer()

  const handleScanProduct = (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    handleScan(event.nativeEvent.text)
  }

  const handleScanChange = (value: string) => {
    handleInputScanChange(value)
  }


  return (
    <>
      <Modal
        isOpen={!transactionNumber}
        bgColor="rgba(0,0,0,.4)"
      >
        <Modal.Content
          flex={1}
          backgroundColor="transparent"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            size="lg"
            padding={10}
            width="40%"
            onPress={handleNewTransaction}
            isLoading={state.isCreating}
          >
            <Text
              color={Themes.common.white} fontSize="3xl"
              textAlign="center"
            >
              Tap to Begin
            </Text>
          </Button>
        </Modal.Content>
      </Modal>
      <Box flex={1} width="100%">
        <HStack flex={1}>
          <HStack flex={.7}>
            <VStack flex={1}>
              <HStack
                padding={5}
                bg={Themes.common.white}
                space={2}
              >
                <Input
                  placeholder="Product Barcode or SKU"
                  size="2xl"
                  flex={.9}
                  clearTextOnFocus
                  clearButtonMode="unless-editing"
                  value={state.productCode}
                  onEndEditing={handleScanProduct}
                  onChangeText={handleScanChange}
                />
                <Input
                  placeholder="Qty"
                  size="2xl"
                  flex={.1}
                  textAlign="center"
                  value={state.quantity}
                />
              </HStack>
            </VStack>
          </HStack>
          <VStack
            flex={.3}
            bg={Themes.common.white}
            shadow={1}
          >
            <HStack
              flex={.1}
              justifyContent="space-between"
              padding={5}
            >
              <Text>Cart: #{transactionNumber}</Text>
              <Text textAlign="right">
                Items: ({state.products.length})
              </Text>
            </HStack>
            <Box
              flex={.8}
              paddingLeft={5}
              paddingRight={5}
            >
              <ProductList data={state.products} />
            </Box>
            <HStack
              flex={.1}
              space={2}
              paddingTop={1}
              paddingBottom={1}
              justifyContent="space-between"
              alignItems="center"
              backgroundColor="emerald.300"
              padding={5}
            >
              <Text
                fontSize="xl"
                fontWeight="500"
              >
                TOTAL:
              </Text>
              <Text
                color="white"
                fontSize="4xl"
                fontWeight="500"
                shadow={1}
              >
                P {formatCurrency(state.overallTotal)}
              </Text>
              {/* <Button flex={.8}>
                <Text color={Themes.common.white} fontSize="2xl">PAY</Text>
              </Button>
              <Button size="lg" backgroundColor="#27272a">
                <Text color={Themes.common.white} fontSize="lg">Cancel</Text>
              </Button> */}
            </HStack>
          </VStack>
        </HStack>
      </Box >
    </>
  )
}

const ProductList = ({ data }: any) => {

  const renderItem = ({ item }: any) => {
    return <HStack justifyContent="space-between">
      <Text>{item.product.name}</Text>
      <Text>P {formatCurrency(item.total)}</Text>
    </HStack>
  }

  const pageHeader = () => {
    return <HStack justifyContent="space-between" marginBottom={5}>
      <Text fontSize="lg" fontWeight="500">Name</Text>
      <Text fontSize="lg" fontWeight="500">Price</Text>
    </HStack>
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={pageHeader}
    />
  )
}

export default pos;