import { useMutation, useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/core'
import { Formik } from 'formik'
import { Box, Button, Center, HStack, Image, Input, KeyboardAvoidingView, Select, Text, VStack, ScrollView, useToast } from 'native-base'
import React, { useRef, useState } from 'react'
import { Keyboard } from 'react-native'
import AppDialog from '../../../components/AppDialog'
import { ICommonSelect, IInitProductValues } from '../../../interfaces/AddProduct'
import Themes from '../../../styles/Themes'
import { addProductValidation } from '../../../utils/validations/AddProductSchema'
import { CREATE_PRODUCT, FETCH_PRODUCT, GET_PROD_CATEGORIES } from '../gql/Inventory.gql'

const initProductValues: IInitProductValues = {
  barcode: '',
  name: '',
  category: '',
  cost: '',
  price: '',
  quantity: '',
  unit: '',
  description: ''
}


const AddProduct = () => {
  const navigate = useNavigation()
  const toast = useToast()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const formikRef = useRef(null);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const { data } = useQuery(GET_PROD_CATEGORIES);
  const [onCreateProduct] = useMutation(CREATE_PRODUCT, {
    onError: (err) => {
      setIsSaving(false)
      toast.show({
        title: err.message,
        placement: 'bottom',
        status: 'error'
      })
    },
    onCompleted: () => {
      setIsSaving(false)
      formikRef.current?.resetForm();
      toast.show({
        title: 'Success',
        placement: 'bottom',
        status: 'success'
      })
    },
    update: (cache, mutationResult) => {
      const newProduct = mutationResult.data.createProduct;
      const data: any = cache.readQuery({
        query: FETCH_PRODUCT
      });

      cache.writeQuery({
        query: FETCH_PRODUCT,
        data: {
          getProducts: [...data.getProducts, ...newProduct]
        }
      });
    }
  })

  const handleTouch = () => Keyboard.dismiss()

  const handleAccept = () => {
    setIsDialogOpen(false)
    navigate.goBack()
  }

  const handleClose = () => {
    setIsDialogOpen(false)
  }

  const handleCancel = (isDirty: boolean) => {
    if (isDirty) {
      setIsDialogOpen(true)
    } else {
      navigate.goBack()
    }
  }

  return (
    <KeyboardAvoidingView flex={1} behavior="padding" keyboardVerticalOffset={80}>
      <AppDialog
        open={isDialogOpen}
        onAccept={handleAccept}
        onClose={handleClose}
        title="Create Product"
        message="Are you sure you want to cancel?"
      />
      <Formik
        innerRef={formikRef}
        initialValues={initProductValues}
        validationSchema={addProductValidation}
        onSubmit={(values) => {
          setIsSaving(true);
          onCreateProduct({
            variables: {
              barcode: values.barcode,
              name: values.name,
              category: values.category,
              cost: Number(values.cost),
              price: Number(values.price),
              quantity: Number(values.quantity),
              unit: values.unit,
              description: values.description,
            }
          });
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isValid, dirty }) => {
          return (
            <VStack space={2} flex={1} onTouchStart={handleTouch}>
              <Box flex={.85} px={20} paddingTop={2}>
                <Box flex={1} bg={Themes.common.white} p={5}>
                  <Text>Add New Product</Text>

                  <VStack paddingTop={5} >
                    <HStack space={2}>
                      <VStack flex={.7} space={4}>
                        <Input
                          placeholder="Barcode"
                          size="xl"
                          InputRightElement={
                            <Button bg={"emerald.500"}>
                              <Text color="white">Generate</Text>
                            </Button>}
                          value={values.barcode}
                          onChangeText={handleChange('barcode')}
                          onBlur={handleBlur('barcode')}
                        />
                        <Input
                          placeholder="Name"
                          size="xl"
                          value={values.name}
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                        />
                        <Select
                          placeholder="Category"
                          size="xl"
                          accessibilityLabel="Select Category"
                          selectedValue={values.category}
                          onValueChange={handleChange('category')}
                        >
                          {
                            data && data?.getProductCategories ?
                              (
                                data?.getProductCategories.map((item: ICommonSelect) =>
                                  <Select.Item label={item.name} value={item.id} key={item.id} />
                                )
                              ) : <Select.Item label="Loading" value="Loading" disabled />
                          }
                        </Select>
                        <HStack space={2}>
                          <Input
                            placeholder="Cost"
                            flex={.5}
                            size="xl"
                            keyboardType="number-pad"
                            value={values.cost}
                            onChangeText={handleChange('cost')}
                            onBlur={handleBlur('cost')}
                          />
                          <Input
                            placeholder="Price"
                            flex={.5}
                            size="xl"
                            keyboardType="number-pad"
                            value={values.price}
                            onChangeText={handleChange('price')}
                            onBlur={handleBlur('price')}
                          />
                        </HStack>
                        <HStack space={2}>
                          <Input
                            placeholder="Quantity"
                            flex={.5} size="xl"
                            keyboardType="number-pad"
                            value={values.quantity}
                            onChangeText={handleChange('quantity')}
                            onBlur={handleBlur('quantity')}
                          />
                          <Select
                            placeholder="Unit"
                            size="xl"
                            flex={.55}
                            selectedValue={values.unit}
                            onValueChange={handleChange('unit')}
                          >
                            {
                              data && data?.getProductUnit ?
                                (
                                  data?.getProductUnit.map((item: ICommonSelect) =>
                                    <Select.Item label={item.name} value={item.id} key={item.id} />
                                  )
                                ) : <Select.Item label="Loading" value="Loading" disabled />
                            }
                          </Select>
                        </HStack>
                        <Input
                          placeholder="Description"
                          size="xl"
                          multiline
                          minHeight={100}
                          value={values?.description}
                          onChangeText={handleChange('description')}
                          onBlur={handleBlur('description')}
                        />
                      </VStack>
                      <Box flex={.3}>
                        <Center flex={1} p="10">
                          <Image
                            alt="product-preview"
                            height="100%"
                            width="100%"
                            resizeMode="contain"
                            source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/gallery-187-902099.png' }}
                          />
                          <Button bg="transparent">
                            <Text>Attach Image</Text>
                          </Button>
                        </Center>
                      </Box>
                    </HStack>
                  </VStack>
                </Box>
              </Box>
              <Box flex={.15}>
                <HStack
                  space={2}
                  flex={1}
                  bg={Themes.common.white}
                  alignItems="center"
                  justifyContent="flex-end"
                  px={20}
                >
                  <Button
                    size="lg"
                    bg={Themes.main.primaryLight}
                    onPress={() => handleCancel(dirty)}
                  >
                    <Text>Cancel</Text>
                  </Button>
                  <Button
                    bg={Themes.main.primary}
                    onPress={handleSubmit}
                    disabled={!dirty || !isValid || isSaving}
                    isLoading={isSaving}
                    isLoadingText="Saving..."
                  >
                    <Text color={Themes.common.white}>Save</Text>
                  </Button>
                </HStack>
              </Box>
            </VStack>
          )
        }}
      </Formik>
    </KeyboardAvoidingView >
  )
}


export default AddProduct