import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

const CustomView2 = ({ label, status, isAirtime }) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowView}>
        <Text style={styles.pageText}>{label}</Text>
        <View style={styles.statusView}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <AntDesign name="right" size={24} color="black" />
      </View>
    </View>
  );
};

export default CustomView2;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
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
  statusView: {
    backgroundColor: '#EBF9F6',
    opacity: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 39,
    borderColor: '#8ADBC6',
    borderWidth: 2,
  },
  pageText: {
    fontFamily: 'Montserat',
    fontSize: 14,
    fontWeight: '600',
    color: '#4E4B66',
    lineHeight: 24,
  },
  statusText: {
    fontFamily: 'MontSBold',
    fontSize: 14,
    fontWeight: '400',
    color: '#06A77D',
    lineHeight: 18,
  },
});
