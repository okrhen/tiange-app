import React, { useEffect, useState } from "react"
import { Box, Button, HStack, Input, Modal, Text, VStack, FlatList, Center, Pressable } from "native-base";
import Themes from "../../styles/Themes";
import usePosReducer from "./usePosReducer";
import { Alert, NativeSyntheticEvent, TextInputEndEditingEventData } from "react-native";
import { formatCurrency, formatNumber } from "../../utils/currency";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'


const PoS = () => {

  const navigation = useNavigation();

  const {
    handleNewTransaction,
    transactionNumber,
    handleScan,
    handleInputScanChange,
    inputSearchCodeRef,
    hasItems,
    state,
    closeModal,
    hasTransactionNumber,
    paymentAction,
    handleQuantityChange
  } = usePosReducer()

  useEffect(() => {

    navigation.addListener('beforeRemove', (event) => {
      if (!hasItems) {
        return;
      }

      event.preventDefault();

      Alert.alert(
        'Cancel Transaction?',
        'You have unfinish transaction. Are you sure to discard them and leave the screen?',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => { } },
          {
            text: 'Back to Home',
            style: 'destructive',
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => navigation.dispatch(event.data.action),
          },
        ]
      );

    })

  }, [hasItems])

  const goBackHome = () => {
    return navigation.goBack()
  }

  const handleSubmitScan = (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    handleScan(event.nativeEvent.text)
  }


  const handleGoBack = () => {
    closeModal()
    const timeout = setTimeout(() => {
      navigation.goBack()
      clearTimeout(timeout)
    }, 150)

  }

  return (
    <Box flex={1} width="100%" safeArea>
      <Modal
        isOpen={state.modalIsOpen}
        bgColor="rgba(0,0,0,.4)"
        avoidKeyboard={true}
        safeArea
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
            disabled={state.isCreating}
          >
            <Text
              color={Themes.common.white} fontSize="3xl"
              textAlign="center"
            >
              Tap to Begin
            </Text>
          </Button>
          <Button
            size="lg"
            padding={10}
            width="40%"
            onPress={handleGoBack}
            backgroundColor="black"
            marginTop={10}
            disabled={state.isCreating}
          >
            <Text
              color={Themes.common.white} fontSize="3xl"
              textAlign="center"
            >
              Go Back
            </Text>
          </Button>
        </Modal.Content>
      </Modal>
      <PaymentModal
        overallTotal={state.overallTotal}
        paymentAction={paymentAction}
        paymentState={state.payment}
      />
      <HStack flex={1}>
        <HStack flex={.7}>
          <VStack flex={1}>
            <HStack
              padding={2}
              bg={Themes.common.white}
              space={2}
              flex={.1}
            >
              <Input
                ref={inputSearchCodeRef}
                placeholder="Product Barcode or SKU"
                size="2xl"
                flex={.9}
                clearTextOnFocus
                clearButtonMode="unless-editing"
                onSubmitEditing={handleSubmitScan}
                blurOnSubmit={false}
                isReadOnly={!hasTransactionNumber}
              />
              <Input
                placeholder="Qty"
                size="2xl"
                flex={.10}
                textAlign="center"
                value={state.quantity.toString()}
                isReadOnly={!hasTransactionNumber}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
              />
            </HStack>
            <PaymentFooter
              hasItems={hasItems}
              handlePayment={paymentAction.handlePayment}
              hasTransactionNumber={hasTransactionNumber}
              handleNewTransaction={handleNewTransaction}
              isCreating={state.isCreating}
              goBackHome={goBackHome}
            />
          </VStack>
        </HStack>
        <VStack
          flex={.3}
          bg={Themes.common.white}
          shadow={1}
        >
          <VStack
            flex={.15}
            space={2}
            paddingY={1}
            backgroundColor="emerald.300"
            paddingX={5}
          >
            <HStack
              flex={.6}
              justifyContent="space-between"
              alignItems="center"
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
            </HStack>
            <Box flex={.4}>
              <VStack flex={1}>
                <HStack
                  flex={.5}
                  space={5}
                  justifyContent="space-between"
                >
                  <Text>Sub Total:</Text>
                  <Text fontWeight="500" fontSize="md">P {formatCurrency(state.subTotal)}</Text>
                </HStack>
                <HStack
                  flex={.5}
                  space={4}
                  justifyContent="space-between"
                >
                  <Text>VAT (12%):</Text>
                  <Text
                    fontWeight="500"
                    fontSize="md"
                  >
                    P {formatCurrency(state.vatAmount)}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
          <HStack
            flex={.05}
            justifyContent="space-between"
            alignItems="center"
            paddingX={5}
          >
            <Text>ID: #{transactionNumber}</Text>
            <Text textAlign="right">
              Items: ({state.totalItems})
            </Text>
          </HStack>
          <Box
            flex={.8}
            paddingX={5}
            paddingTop={5}
            borderTopColor="gray.300"
            borderTopWidth={1}
          >
            <ProductList data={state.products} />
          </Box>
        </VStack>
      </HStack>
    </Box >
  )
}

const PaymentFooter = ({
  hasItems,
  handlePayment,
  hasTransactionNumber,
  handleNewTransaction,
  isCreating,
  goBackHome
}: any) => {
  return (
    <VStack flex={.9}>
      <VStack flex={.85}>
      </VStack>
      <HStack flex={.15} paddingY={10} paddingX={5} space={2} >
        <Button
          flex={.2}
          backgroundColor="emerald.800"
          endIcon={<Icon
            name="home"
            size={24}
            color="white"
          />}
          onPress={() => goBackHome()}
        >
          Home
        </Button>
        <Button
          flex={.2}
          backgroundColor="emerald.800"
          endIcon={<Icon
            name="restart"
            size={24}
            color="white"
          />}
          disabled={hasTransactionNumber || isCreating}
          onPress={() => handleNewTransaction()}
        >
          Start New
        </Button>
        <Button
          flex={.2}
          backgroundColor="emerald.900"
          endIcon={<Icon
            name="delete-empty-outline"
            size={24}
            color="white"
          />}
          disabled={!hasItems}
        >
          Empty Cart
        </Button>
        <Button
          flex={.6}
          disabled={!hasItems}
          endIcon={
            <Icon
              name="cash"
              size={38}
              color="white"
            />
          }
          onPress={handlePayment}
        >
          <Text
            fontSize={24}
            color="white"
            fontFamily="initial" fontWeight="500"
          >
            MAKE PAYMENT
          </Text>
        </Button>
      </HStack>

    </VStack>
  )
}

const ProductList = ({ data }: any) => {

  if (!data.length) {
    return (
      <Center flex={1}>
        <Text>No Product Added</Text>
      </Center>
    )
  }
  const renderItem = ({ item }: any) => {

    return (
      <HStack
        justifyContent="space-between"
        minHeight={60}
        alignItems="flex-start"
      >
        <Text
          flex={.4}
          textAlign="left">
          {item.product.name}
        </Text>
        <Text
          flex={.2}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          (x {item.quantity})
        </Text>
        <Text
          flex={.4}
          textAlign="right"
          fontWeight="500"
        >
          P {formatCurrency(item.total)}
        </Text>
      </HStack>)
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.salesTransactionId}
    />
  )
}

const PaymentModal = ({
  overallTotal,
  paymentState: {
    showPaymentModal,
    paymentMethod,
    amountReceived,
    isSaving,
    paymentSaved,
    amountChange
  },
  paymentAction: {
    handleSavePayment,
    handleCancelPayment,
    handleInputPayment,
    handleSelectPaymentMethod,
    handleCloseSavedPayment
  }
}: any) => {

  if (!showPaymentModal) {
    return null
  }


  const isValid = paymentMethod && amountReceived >= overallTotal
  const formattedAmount = Number(formatNumber(amountReceived || ''))

  return (
    <Modal
      isOpen={showPaymentModal}
      size="lg"
      onClose={() => {
        if (!isSaving) {
          if (paymentSaved) {
            handleCloseSavedPayment()
          } else {
            handleCancelPayment()
          }
        }
      }}
      closeOnOverlayClick={false}
    >
      <Modal.Content height="80%">
        <Modal.CloseButton />
        <Modal.Header>
          Payment
        </Modal.Header>
        <VStack flex={1} height="100%">
          {
            paymentSaved ?
              <VStack
                flex={1}
                justifyContent="center"
                alignItems="center"
              >
                <VStack
                  flex={.5}
                  justifyContent="center"
                  alignItems="center">
                  <Icon
                    name="check-circle-outline"
                    color="#10b981"
                    size={80}
                  />
                  <Text
                    fontWeight="700"
                    fontSize={120}
                  >
                    P {formatCurrency(amountChange)}
                  </Text>
                  <Text
                    fontWeight="500"
                    fontSize={24}
                  >
                    CHANGE
                  </Text>
                </VStack>
                <HStack
                  flex={.5}
                  justifyContent="center"
                  alignItems="center"
                  space={2}
                >
                  <Button
                    flex={.3}
                    size="lg"
                    height="30%"
                    startIcon={
                      <Icon
                        name="close-circle"
                        size={34}
                        color="white"
                      />
                    }
                    backgroundColor="gray.800"
                    onPress={() => handleCloseSavedPayment()}
                  >
                    Close
                  </Button>
                  <Button
                    flex={.3}
                    size="lg"
                    height="30%"
                    endIcon={
                      <Icon
                        name="printer-pos"
                        size={34}
                        color="white"
                      />
                    }
                  >
                    Print Receipt
                  </Button>
                </HStack>
              </VStack>
              :
              <>
                <VStack
                  flex={.30}
                  justifyContent="center"
                  alignItems="center"
                  paddingBottom={5}
                >
                  <Text fontSize="2xl">Total</Text>
                  <Text fontSize="6xl" fontWeight="700">P {formatCurrency(overallTotal)}</Text>
                </VStack>

                <HStack
                  flex={.30}
                  justifyContent="center"
                  alignItems="center"
                  paddingBottom={10}
                >
                  <Input
                    flex={.6}
                    textAlign="center"
                    fontSize={60}
                    fontWeight="700"
                    placeholder="AMOUNT"
                    editable={paymentMethod !== 'others' || isSaving}
                    value={formatCurrency(amountReceived)}
                    keyboardType="numeric"
                    variant="filled"
                    onChangeText={handleInputPayment}
                    autoFocus
                  />
                </HStack>
                <HStack
                  flex={.25}
                  justifyContent="center"
                  alignItems="center"
                  space={5}
                >
                  <Box
                    flex={.3}
                    justifyContent="center"
                    alignContent="space-between"
                    alignItems="center"
                    borderWidth={3}
                    borderColor="gray.100"
                    borderRadius={10}
                  >
                    <Pressable
                      onPress={() => {
                        handleSelectPaymentMethod('cash')
                      }}
                      width="100%"
                      flex={1}
                      disabled={isSaving}
                    >
                      {({ isPressed }) => {
                        const isActive = isPressed || paymentMethod === 'cash'
                        const backgroundColor = isActive ? 'emerald.800' : 'transparent';
                        const color = isActive ? 'white' : 'black';

                        return (
                          <VStack
                            backgroundColor={backgroundColor}
                            flex={1}
                            borderRadius={10} justifyContent="center"
                            alignContent="space-between"
                            alignItems="center"
                            padding={2}
                          >
                            <Box
                              flex={.6}
                              justifyContent="center"
                            >
                              <Icon
                                name="cash"
                                size={48}
                                color={color}
                              />
                            </Box>
                            <Box
                              flex={.4}
                              justifyContent="center"
                            >
                              <Text
                                fontWeight="500"
                                fontSize="xl"
                                textAlign="center"
                                color={color}
                              >
                                Cash
                              </Text>
                            </Box>
                          </VStack>
                        )
                      }}
                    </Pressable>
                  </Box>
                  <Box
                    flex={.3}
                    justifyContent="center"
                    alignContent="space-between"
                    alignItems="center"
                    borderWidth={3}
                    borderColor="gray.100"
                    borderRadius={10}
                  >
                    <Pressable
                      width="100%"
                      flex={1}
                      onPress={() => {
                        handleSelectPaymentMethod('others')
                      }}
                      disabled={isSaving}
                    >
                      {({ isPressed }) => {
                        const isActive = isPressed || paymentMethod === 'others'
                        const backgroundColor = isActive ? 'emerald.800' : 'transparent';
                        const color = isActive ? 'white' : 'black';
                        return (
                          <VStack
                            backgroundColor={backgroundColor}
                            flex={1}
                            borderRadius={10} justifyContent="center"
                            alignContent="space-between"
                            alignItems="center"
                            padding={2}
                          >
                            <Box
                              flex={.6}
                              justifyContent="center"
                            >
                              <Icon
                                name="qrcode-scan"
                                size={32}
                                color={color}
                              />
                            </Box>
                            <Box
                              flex={.4}
                              justifyContent="center"
                            >
                              <Text
                                fontWeight="500"
                                fontSize="xl"
                                textAlign="center"
                                color={color}
                              >
                                Others, ( GCash )
                              </Text>
                            </Box>
                          </VStack>
                        )
                      }}
                    </Pressable>
                  </Box>
                </HStack>
                <Box
                  flex={.30}
                  paddingTop={10}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    padding={5}
                    width="50%"
                    disabled={!isValid || isSaving}
                    onPress={handleSavePayment}
                    isLoading={isSaving}
                    isLoadingText="Processing..."
                  >
                    SAVE
                  </Button>
                </Box>
              </>
          }
        </VStack>
      </Modal.Content>
    </Modal>
  )
}

export default PoS;