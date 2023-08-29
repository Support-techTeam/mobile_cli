import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomView = ({ label, isWallet, isSecurity, isSettings, isSupport, isRate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowView}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {isWallet && (
            <View style={styles.icon}>
              <Entypo name="wallet" size={24} color="#054B99" />
            </View>
          )}
          {isSecurity && (
            <View style={styles.icon}>
              <MaterialCommunityIcons name="shield-lock" size={24} color="#054B99" />
            </View>
          )}
          {isSettings && (
            <View style={styles.icon}>
              <AntDesign name="user" size={24} color="#054B99" />
            </View>
          )}
          {isSupport && (
            <View style={styles.icon}>
              <MaterialCommunityIcons name="chat-question" size={24} color="#054B99" />
            </View>
          )}
          {isRate && (
            <View style={styles.icon}>
              <Entypo name="star" size={24} color="#F4B740" />
            </View>
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
    marginVertical: 10,
  },
  rowView: {
    flexDirection: 'row',
    backgroundColor: '#EFF0F7',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
  },
  pageText: {
    fontFamily: 'MontSBold',
    fontSize: 16,
    color: '#4E4B66',
    lineHeight: 24,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9DBE9',
  },
});
