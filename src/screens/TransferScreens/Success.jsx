import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Buttons from '../../component/buttons/Buttons';

const Success = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Image source={require('../../../assets/images/checkeredd.png')} />
      </View>
      <Text style={styles.success}>Transaction Successful</Text>

      <TouchableOpacity
        style={{ marginTop: 10, width: 100 }}
        onPress={() => navigation.navigate('BottomTabs')}
      >
        <Buttons label={'Done'} />
      </TouchableOpacity>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: statusBarHeight + 60,
    paddingHorizontal: 20,
    backgroundColor: '#CED0D9',
  },
  inner: {
    // backgroundColor: '#fff',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    
    fontSize: 20,
    color: '#14142B',
    textAlign: 'center',
    marginBottom: 10,
  },
});
