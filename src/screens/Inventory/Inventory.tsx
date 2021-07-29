import { Box, Center, FlatList, HStack, Pressable, Text, VStack } from 'native-base'
import React from 'react'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import Themes from '../../styles/Themes'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/core'
import { IActionsList, ICountList } from '../../interfaces/Inventory'
import { useQuery } from '@apollo/client'
import { FETCH_PRODUCT } from './gql/Inventory.gql'


const actions: IActionsList[] = [
  {
    title: 'Add Product',
    icon: 'tray-plus',
    path: 'AddProduct'
  },
  {
    title: 'Add Stock',
    icon: 'clipboard-plus-outline',
    path: 'AddStock'
  },
  {
    title: 'Add Product Category',
    icon: 'tag-plus-outline',
    path: 'AddProductCategory'
  },
  {
    title: 'Add Product Unit',
    icon: 'cube-outline',
    path: 'AddProductUnit'
  }
]

const count: ICountList[] = [
  {
    name: 'Available Products',
    count: 500
  },
  {
    name: 'Top Selling Products',
    count: 30
  },
  {
    name: 'Out of Stock',
    warn: true,
    count: 25
  },
  {
    name: 'Low Stock',
    warn: true,
    count: 10
  }
]

function Inventory() {
  const navigation = useNavigation()

  const handlePress = (path: string) => {
    navigation.navigate(path)
  }


  return (
    <VStack
      flex={1}
      padding={10}
      backgroundColor={Themes.bgColor.bgPrimary}
      space={2}
    >
      <Box flex={.2} width="100%">
        <HStack space={4}>
          {
            actions.map((item: IActionsList) => (
              <Pressable
                width="20%"
                onPress={() => handlePress(item.path)}
                key={item.path}
              >
                <Box
                  height={100}
                  backgroundColor="#fff"
                  borderRadius={4}
                >
                  <Center flex={1}>
                    <Icon name={item.icon} size={42} />
                    <Text>{item.title}</Text>
                  </Center>
                </Box>
              </Pressable>
            ))
          }
        </HStack>
      </Box>
      <Box flex={.8}>
        <HStack
          flex={1}
          space={4}
        >
          <Box
            flex={.7}
            backgroundColor="#fff"
            padding={5}>
            <VStack flex={1} space={2}>
              <Box flex={.1}>
                <Text>Product List</Text>
              </Box>
              <Box
                flex={.9}
              >
                <ProductList />
              </Box>
            </VStack>
          </Box>
          <Box
            flex={.3}
            backgroundColor="#fff"
          >
            <Text padding={5}>Products Summary</Text>
            <ScrollView>
              <VStack
                space={4}
                flex={1}
                padding={5}
              >
                {
                  count.map((item: ICountList) => {
                    const isWarn = item?.warn
                    const colorWhite = isWarn ? { color: '#fff' } : {}
                    return (
                      <Box
                        backgroundColor={isWarn ? "#E04322" : "#fafafc"}
                        key={item.name}
                        height={20}
                        shadow={1}
                        borderRadius={4}
                        px={5}
                      >
                        <HStack
                          alignItems="center"
                          justifyContent="space-between"
                          flex={1}
                        >
                          <Text {...colorWhite}>{item.name}</Text>
                          <Text
                            fontSize={24}
                            fontWeight="500"
                            {...colorWhite}
                          >
                            {item?.count}
                          </Text>
                        </HStack>
                      </Box>
                    )
                  })
                }
              </VStack>
            </ScrollView>
          </Box>
        </HStack>
      </Box>
    </VStack>
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
    <Box flex={.4}>
      <Text>Code</Text>
    </Box>
    <Box flex={.4}>
      <Text>Name</Text>
    </Box>
    <Box flex={.2}>
      <Text>Quantity</Text>
    </Box>
  </HStack>
)

const ProductList = () => {

  const { data = [] } = useQuery(FETCH_PRODUCT, {
    fetchPolicy: "cache-first"
  });

  const item = ({ item }: any) => (
    <HStack
      space={1}
      height={45}
      borderBottomWidth={1}
      borderBottomColor="#eee"
      alignItems="center"
    >
      <Box flex={.4}>
        <Text>{item.barcode}</Text>
      </Box>
      <Box flex={.4}>
        <Text>{item.name}</Text>
      </Box>
      <Box flex={.2}>
        <Text>{item.inventory.quantity} {item.unit.name}</Text>
      </Box>
    </HStack>
  )

  return (
    <FlatList
      data={data?.getProducts || []}
      renderItem={item}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={TableHeader}
    />)
}

export default Inventory