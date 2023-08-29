import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
// import { AntDesign } from '@expo/vector-icons';

const CustomView = ({ label, subLabel }) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowView}>
        <View style={{}}>
          <Text style={styles.pageText}>{label}</Text>
          <Text style={styles.pagesubText}>{subLabel}</Text>
        </View>

        {/* <AntDesign name="right" size={24} color="black" /> */}
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
    borderWidth: 1,
    borderColor: '#D9DBE9',
    flexDirection: 'row',
    backgroundColor: '#FCFCFC',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
  },
  statusView: {
    backgroundColor: '#f4b740',
    opacity: 0.3,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 39,
  },
  pageText: {
    fontFamily: 'MontSBold',
    fontSize: 16,
    color: '#4E4B66',
    marginVertical: 5,
  },
  pagesubText: {
    fontFamily: 'Montserat',
    fontSize: 14,
    color: '#4E4B66',
  },
  statusText: {
    fontFamily: 'Montserat',
    fontSize: 12,
    fontWeight: '400',
    color: '#F4B740',
    lineHeight: 18,
  },
});
