import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Dashboard from '../screens/Dashboard';
import Login from '../screens/Login';
import PoS from '../screens/PoS';
import Inventory from '../screens/Inventory'
import AddProductCategory from '../screens/Inventory/form/AddProductCategory'
import AddProductUnit from '../screens/Inventory/form/AddProductUnit'
import AddProduct from '../screens/Inventory/form/AddProduct'
import AddStock from '../screens/Inventory/form/AddStock';
import { getToken } from '../apollo/config';

const Stack = createStackNavigator();

const noHeader = { header: () => null }
const getScreenTitle = (title: string) => ({ title })

function AppNavigation({ isLoggedIn }: { isLoggedIn: boolean }) {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? "Login" : "Dashboard"}>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={noHeader}
                />
                <Stack.Screen
                    name="Dashboard"
                    component={Dashboard}
                />
                <Stack.Screen
                    name="PointOfSale"
                    component={PoS}
                    options={getScreenTitle('Point of Sale')}
                />
                <Stack.Screen
                    name="Inventory"
                    component={Inventory}
                />
                <Stack.Screen
                    name="AddProductCategory"
                    component={AddProductCategory}
                    options={getScreenTitle('Add Product Category')}
                />
                <Stack.Screen
                    name="AddProductUnit"
                    component={AddProductUnit}
                    options={getScreenTitle('Add Product Unit')}
                />
                <Stack.Screen
                    name="AddProduct"
                    component={AddProduct}
                    options={getScreenTitle('Add Product')}
                />
                <Stack.Screen
                    name="AddStock"
                    component={AddStock}
                    options={getScreenTitle('Add Stock')}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation
