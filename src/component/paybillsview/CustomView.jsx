import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CustomView = ({label}) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {label == 'Airtime' && (
            <Image source={require('../../../assets/images/airtime.png')} />
          )}

          {label == 'Electricity' && (
            <Image source={require('../../../assets/images/Electricity.png')} />
          )}

          {label == 'Data Bundle' && (
            <Image source={require('../../../assets/images/databuy.png')} />
          )}

          {label == 'Cable TV' && (
            <Image source={require('../../../assets/images/cable.png')} />
          )}
          <Text style={styles.pageText}>{label}</Text>
        </View>

        <AntDesign name="right" size={24} color="black" />
      </View>
    </View>
  );
};

export default CustomView;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  rowView: {
    flexDirection: 'row',
    backgroundColor: '#EFF0F6',
    paddingVertical: 18,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
  },
  statusView: {
    backgroundColor: '#F4B740',
    opacity: 0.3,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 39,
  },
  pageText: {
    fontFamily: 'serif',
    fontSize: 16,
    marginLeft: 10,
    color: '#4E4B66',
    lineHeight: 24,
  },
  statusText: {
    
    fontSize: 12,
    fontWeight: '400',
    color: '#F4B740',
    lineHeight: 18,
  },
  custom: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    backgroundColor: 'white',
    padding: 5,
    marginRight: 8,
    borderRadius: 5,
  },
});
