import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import CustomView from './AccountView/CustomView';
import Buttons from '../buttons/Buttons';
import {getLoanUserDetails} from '../../stores/LoanStore';

const Document = () => {
  const navigation = useNavigation();
  const [docsDeets, setDocsDeets] = useState([]);

  useEffect(() => {
    unSubBankDetails();
  }, []);

  const unSubBankDetails = async () => {
    const res = await getLoanUserDetails();
    if (res?.error) {
      // TODO: handle error
    } else {
      setDocsDeets(res?.data?.loanDocumentDetails);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ValidIdentity')}
        style={{marginBottom: 20}}>
        <Buttons label={'Update Documents'} />
      </TouchableOpacity>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <CustomView
          label={`${
            docsDeets?.validIdentificationType === undefined
              ? 'N/A'
              : docsDeets?.validIdentificationType
          } `}
          subLabel="Valid ID type"
        />

        <CustomView
          label={`${
            docsDeets?.validIdentification === undefined
              ? 'N/A'
              : docsDeets?.validIdentification
          } `}
          subLabel="Valid ID"
        />

        <Pressable
          onPress={() => {
            if (docsDeets?.utilityBill && docsDeets?.utilityBill !== '') {
              Linking.openURL(docsDeets?.utilityBill);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.utilityBill === undefined
                ? 'N/A'
                : `${docsDeets?.utilityBill === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="Proof of address"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.signature && docsDeets?.signature !== '') {
              Linking.openURL(docsDeets?.signature);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.signature === undefined
                ? 'N/A'
                : `${docsDeets?.signature === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="Signature"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.passport && docsDeets?.passport !== '') {
              Linking.openURL(docsDeets?.passport);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.passport === undefined
                ? 'N/A'
                : `${docsDeets?.passport === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="Passport"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.bankStatement && docsDeets?.bankStatement !== '') {
              Linking.openURL(docsDeets?.bankStatement);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.bankStatement === undefined
                ? 'N/A'
                : `${docsDeets?.bankStatement === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="Bank statement"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.seal && docsDeets?.seal !== '') {
              Linking.openURL(docsDeets?.seal);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.seal === undefined
                ? 'N/A'
                : `${docsDeets?.seal === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="Seal"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.cac7 && docsDeets?.cac7 !== '') {
              Linking.openURL(docsDeets?.cac7);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.cac7 === undefined
                ? 'N/A'
                : `${docsDeets?.cac7 === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="CAC 7"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.cac2 && docsDeets?.cac2 !== '') {
              Linking.openURL(docsDeets?.cac2);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.cac2 === undefined
                ? 'N/A'
                : `${docsDeets?.cac2 === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="CAC 2"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.cacCertificate && docsDeets?.cacCertificate !== '') {
              Linking.openURL(docsDeets?.cacCertificate);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.cacCertificate === undefined
                ? 'N/A'
                : `${
                    docsDeets?.cacCertificate === '' ? 'N/A' : 'Open Document'
                  }`
            } `}
            subLabel="CAC certificate"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.lpoFile && docsDeets?.lpoFile !== '') {
              Linking.openURL(docsDeets?.lpoFile);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.lpoFile === undefined
                ? 'N/A'
                : `${docsDeets?.lpoFile === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="LPO File"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.proformaFile && docsDeets?.proformaFile !== '') {
              Linking.openURL(docsDeets?.proformaFile);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.proformaFile === undefined
                ? 'N/A'
                : `${docsDeets?.proformaFile === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="Proforma File"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.MERMAT && docsDeets?.MERMAT !== '') {
              Linking.openURL(docsDeets?.MERMAT);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.MERMAT === undefined
                ? 'N/A'
                : `${docsDeets?.MERMAT === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="MERMAT"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (docsDeets?.others && docsDeets?.others !== '') {
              Linking.openURL(docsDeets?.others);
            }
          }}>
          <CustomView
            label={`${
              docsDeets?.others === undefined
                ? 'N/A'
                : `${docsDeets?.others === '' ? 'N/A' : 'Open Document'}`
            } `}
            subLabel="Others"
          />
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default Document;
const styles = StyleSheet.create({
  container: {
    marginVertical: 28,
    marginHorizontal: 20,
    paddingBottom: 30,
  },
});
