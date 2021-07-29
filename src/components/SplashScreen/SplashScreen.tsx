import * as React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Spinner} from 'native-base'

import Themes from '../../styles/Themes';

function SplashScreen() {
    return (
        <View style={styles.splashScreenContainer}>
            <Spinner color={Themes.common.white}/>
            <Text style={styles.splashLabel}>Bebe's Tiange</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    splashScreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Themes.bgColor.bgLogin
    },
    splashLabel: {
        color: Themes.common.white,
        fontSize: 32,
        fontWeight: '700'
    }
})

export default SplashScreen;