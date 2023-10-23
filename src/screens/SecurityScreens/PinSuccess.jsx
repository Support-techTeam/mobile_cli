import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Buttons from '../../component/buttons/Buttons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
const PinSuccess = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#CED0D9',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <View style={styles.inner}>
        <Image source={require('../../../assets/images/checkeredd.png')} />
      </View>
      <Text style={styles.success}>Pin created successfully</Text>
      <TouchableOpacity
        style={{marginTop: 10, width: 100}}
        onPress={() => navigation.navigate('Home')}>
        <Buttons label={'Done'} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PinSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#CED0D9',
  },
  inner: {
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    fontSize: 20,
    color: '#14142B',
    textAlign: 'center',
  },
});
