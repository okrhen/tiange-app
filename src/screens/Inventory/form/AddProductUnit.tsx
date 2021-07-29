import { Box, Button, HStack, Text, Input, VStack, FlatList, useToast, KeyboardAvoidingView } from 'native-base';
import React from 'react';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { gql, useMutation, useQuery } from '@apollo/client';
import Themes from '../../../styles/Themes';
import { Keyboard, Pressable } from 'react-native';
import { Formik } from 'formik';
import { IInitialFormValues } from '../../../interfaces/AddProductUnit';
import { CREATE_PRODUCT_UNIT, FETCH_UNIT } from '../gql/Inventory.gql';


const AddProductUnit = () => {

  const handleTouch = () => Keyboard.dismiss();

  return (
    <HStack space={4} flex={1} onTouchStart={handleTouch}>
      <Box flex={.7} padding={5}>
        <Box flex={1} bg="#fff" p={5}>
          <Text>Product Unit List</Text>
          <Box flex={1} paddingTop={5}>
            <CategoryList />
          </Box>
        </Box>
      </Box>
      <Box flex={.3}>
        <AddCategoryForm />
      </Box>
    </HStack>
  )
}

const AddCategoryForm = () => {

  const toast = useToast()

  const [onCreateProductUnit] = useMutation(CREATE_PRODUCT_UNIT, {
    onError: (err) => {
      toast.show({
        title: err.message,
        placement: 'bottom',
        status: 'error'
      })
    },
    onCompleted: () => {
      toast.show({
        title: 'Success',
        placement: 'bottom',
        status: 'success'
      })
    },
    update: (cache, mutationResult) => {
      const newUnit = mutationResult.data.createProductUnit;
      const data: any = cache.readQuery({
        query: FETCH_UNIT
      });

      cache.writeQuery({
        query: FETCH_UNIT,
        data: {
          getProductUnit: [...data.getProductUnit, ...newUnit]
        }
      });
    }
  });

  const initialFormValues: IInitialFormValues = {
    name: ''
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialFormValues}
      onSubmit={(values, { resetForm }) => {
        onCreateProductUnit({ variables: { name: values.name } });
        resetForm(initialFormValues)
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit, dirty }) => (
        <KeyboardAvoidingView flex={1} behavior="padding" keyboardVerticalOffset={80}>
          <VStack flex={1}>
            <Box flex={.6} px={5} py={10} backgroundColor="#fff">
              <Text>Add Product Unit</Text>
              <Box py="10" width="100%">
                <Input
                  placeholder="Unit Name"
                  size="lg"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
              </Box>
            </Box>
            <Box
              flex={.4}
              backgroundColor="#fff"
              p={5}
              justifyContent="center"
            >
              <HStack
                space={4}
                flex={1}
                justifyContent="space-around"
                alignItems="flex-end"
              >
                <Button
                  size="lg"
                  startIcon={
                    <Icon
                      name="close-circle-outline"
                      size={24} />
                  }
                  bg="#f0f8f6"
                  width="45%"
                >
                  <Text>Cancel</Text>
                </Button>
                <Button
                  size="lg"
                  startIcon={
                    <Icon
                      name="check-circle-outline"
                      color="#fff"
                      size={24}
                    />
                  }
                  bg="#028759"
                  width="45%"
                  onPress={handleSubmit}
                  disabled={!dirty}
                >
                  <Text color="#fff">Save</Text>
                </Button>
              </HStack>
            </Box>
          </VStack>
        </KeyboardAvoidingView>
      )
      }
    </Formik >
  )
}

const TableHeader = () => (
  <HStack
    space={1}
    height={45}
    alignItems="center"
    backgroundColor="#eee"
    justifyContent="center"
    padding={1}
  >
    <Box flex={.3} px={5}>
      <Text>ID</Text>
    </Box>
    <Box flex={.65} px={5}>
      <Text>Name</Text>
    </Box>
    <Box flex={.15} px={5}>
      <Text>Actions</Text>
    </Box>
  </HStack>
)

const CategoryList = () => {

  const { loading, error, data = [] } = useQuery(FETCH_UNIT, {
    fetchPolicy: "cache-first"
  });

  let { getProductUnit: productUnit = [] } = data;
  productUnit = loading || error ? [] : productUnit;


  const item = ({ item }: any) => {

    const onItemPress = () => {
      console.log('item ==>', item)
    }

    return (
      <Pressable onPress={onItemPress}>
        <HStack
          space={1}
          height={45}
          borderBottomWidth={1}
          borderBottomColor="#eee"
          alignItems="center"
        >
          <Box flex={.3} px={5}>
            <Text>{item.id}</Text>
          </Box>
          <Box flex={.65} px={5}>
            <Text>{item.name}</Text>
          </Box>
          <Box flex={.15} px={5}>
            <Button bg={Themes.main.danger}>
              <Text fontSize={12} color={Themes.common.white}>Disable</Text>
            </Button>
          </Box>
        </HStack>
      </Pressable>
    )
  }

  return <FlatList
    data={productUnit}
    renderItem={item}
    keyExtractor={(item) => item.id}
    ListHeaderComponent={TableHeader}
  />
}

export default AddProductUnit