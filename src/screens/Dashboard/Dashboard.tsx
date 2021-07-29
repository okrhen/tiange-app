import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import Themes from '../../styles/Themes'
import { Box, Center, HStack, Pressable, Text } from 'native-base';

interface ICategoryList {
  name: string;
  screen: string;
  icon: string;
}

const categoryList: ICategoryList[] = [
  {
    name: 'Point of Sale',
    screen: 'PointOfSale',
    icon: 'cash-register'
  },
  {
    name: 'Inventory',
    screen: 'Inventory',
    icon: 'clipboard-text-multiple-outline'
  },
  {
    name: 'Transactions',
    screen: 'Transactions',
    icon: 'clipboard-check-multiple-outline'
  },
  {
    name: 'Reports',
    screen: 'Reports',
    icon: 'chart-pie'
  }
]


function CategoriesCard() {

  const navigation = useNavigation()

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen)
  }
  return (
    <HStack justifyContent="space-evenly" flex={1}>
      {
        categoryList.map((item: ICategoryList) => {
          return (
            <Pressable
              key={item?.name}
              flex={.2}
              onPress={() => handleNavigate(item?.screen)}
            >
              {({ isPressed }) => {
                const hovered = isPressed
                return (
                  <Center
                    height={200}
                    backgroundColor={hovered ? "#333332" : "white"}
                    borderRadius={4}
                  >
                    <Icon
                      name={item?.icon} size={48}
                      color={hovered ? 'white' : '#333332'}
                    />
                    <Text
                      fontSize={24}
                      color={hovered ? 'white' : '#333332'}
                    >
                      {item?.name}
                    </Text>
                  </Center>
                )
              }}
            </Pressable>
          )
        })
      }
    </HStack>)
}

function Dashboard() {
  return (
    <Box
      bgColor={Themes.bgColor.bgPrimary}
      padding={10}
      flex={1}>
      <CategoriesCard />
    </Box>
  )
}

export default Dashboard

