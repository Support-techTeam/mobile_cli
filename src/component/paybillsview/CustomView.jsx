import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { AntDesign, Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const CustomView = ({ label }) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowView}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
    fontFamily: 'MontSBold',
    fontSize: 16,

    color: '#4E4B66',
    lineHeight: 24,
  },
  statusText: {
    fontFamily: 'Montserat',
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
