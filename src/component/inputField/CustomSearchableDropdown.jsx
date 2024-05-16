import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomSearchableDropdown = ({
  beneficiariesData,
  setBankDetails,
  bankDetails,
  handleAccountDetails,
  transferType,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered data based on the search query
  const [filteredData, setFilteredData] = useState(beneficiariesData || []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(beneficiariesData);
    } else {
      if (
        beneficiariesData &&
        beneficiariesData?.length > 0 &&
        searchQuery !== ''
      ) {
        const filtered = beneficiariesData.filter(item =>
          item?.accountNumber?.startsWith(searchQuery),
        );
        setFilteredData(filtered);
      }
    }
  }, [searchQuery, beneficiariesData]);

  const handleItemSelect = item => {
    setBankDetails(prevData => ({
      ...prevData,
      receiverAccountFirstName: '',
      receiverAccountLastName: '',
      receiverBankName: transferType == 'Nip' ? item?.bankName : '',
      receiverAccountNumber: transferType == 'Nip' ? item?.accountNumber : '',
      amount: 0,
      narration: '',
      saveBeneficiary: false,
      toWalletIdAccountNumber:
        transferType === 'InternalTransfer' ? item?.accountNumber : '',
      beneficiaryAccountName: '',
      beneficiaryBankName: '',
    }));
    setSearchQuery(item?.accountNumber); // Optionally reset the search query
  };

  useEffect(() => {
    if (searchQuery.length === 10 && bankDetails.receiverBankName) {
      handleAccountDetails();
    }
  }, [searchQuery, bankDetails.receiverBankName]);

  return (
    // <ScrollView keyboardShouldPersistTaps="handled">
    <View style={customStyles.container}>
      <View style={customStyles.inputContainer}>
        <TextInput
          placeholder="Enter account number"
          underlineColorAndroid="transparent"
          style={customStyles.selectInputContainer}
          maxLength={10}
          onChangeText={text => {
            setSearchQuery(text);
            setBankDetails(prevData => ({
              ...prevData,
              receiverAccountFirstName: '',
              receiverAccountLastName: '',
              receiverBankName: '',
              receiverAccountNumber: transferType === 'Nip' ? text : '',
              amount: 0,
              narration: '',
              saveBeneficiary: false,
              toWalletIdAccountNumber:
                transferType === 'InternalTransfer' ? text : '',
              beneficiaryAccountName: '',
              beneficiaryBankName: '',
            }));
          }}
          value={searchQuery}
          keyboardType="numeric"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              setBankDetails(prevData => ({
                ...prevData,
                receiverAccountFirstName: '',
                receiverAccountLastName: '',
                receiverBankName: '',
                receiverAccountNumber: '',
                amount: 0,
                narration: '',
                saveBeneficiary: false,
                toWalletIdAccountNumber: '',
                beneficiaryAccountName: '',
                beneficiaryBankName: '',
              }));
            }}
            style={customStyles.clearIcon}>
            <Icon name="times-circle" size={26} color="#000" />
          </TouchableOpacity>
        )}
      </View>
      {searchQuery.length < 10 && (
        <View style={customStyles.flatListContainer}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{flexGrow: 1}}>
            {filteredData.map(item => (
              <TouchableOpacity
                key={item.id.toString()}
                style={[
                  customStyles.itemStyle,
                  {
                    backgroundColor: COLORS.lendaComponentBg,
                    borderColor: COLORS.lendaComponentBorder,
                  },
                ]}
                onPress={() => handleItemSelect(item)}>
                <Text style={customStyles.itemTextStyle}>
                  {item.accountName} - {item.accountNumber} - {item.bankName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CustomSearchableDropdown;

// You might need to adjust or add styles based on your existing styles object
const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    // marginBottom: 10,
  },
  selectInputContainer: {
    height: 55,
    backgroundColor: COLORS.light,
    flexDirection: 'row',
    paddingHorizontal: 15,
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.lendaComponentBorder,
    padding: 12,
    justifyContent: 'center',
  },
  flatListContainer: {
    flex: 1,
    maxHeight: 160,
    padding: 5,
    marginTop: 2,
    backgroundColor: COLORS.lendaComponentBg,
    borderColor: COLORS.lendaComponentBorder,
    borderWidth: 1,
    borderRadius: 5,
  },
  itemStyle: {
    padding: 10,
    marginTop: 2,
    backgroundColor: COLORS.lendaComponentBg,
    borderColor: COLORS.lendaComponentBorder,
    borderWidth: 1,
    borderRadius: 5,
  },
  itemTextStyle: {
    color: '#222',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingRight: 30, // Adjust based on the size of your icon
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
