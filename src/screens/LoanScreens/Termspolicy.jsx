import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useNavigation} from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import Buttons from '../../component/buttons/Buttons';

const source = {uri: 'https://tradelenda.com/LOAN%20POLICY.pdf', cache: true};

const handleClosePdf = () => {
  setShowPdf(false);
};
const statusBarHeight = getStatusBarHeight();

const Termspolicy = () => {
  const navigation = useNavigation();
  const [showBut, setShowBut] = useState(false);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 15,
          marginTop: 30,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}>
            <Icon name="chevron-left" size={36} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>Terms and Policy Agreement</Text>
          </View>
        </View>
        <View>
          <Text> </Text>
        </View>
      </View>
      <View style={styles.demark} />
      <Pdf
        trustAllCerts={false}
        source={source}
        style={styles.pdf}
        onPageChanged={(page, numberOfPages) => {
          {
            page === numberOfPages && setShowBut(true);
          }
        }}
      />
      {showBut && (
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View>
            <TouchableOpacity style={{margin: 20}} onPress={handleClosePdf}>
              <View
                style={[
                  styles.getLoan,
                  {
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#054B99',
                  },
                ]}>
                <Text style={[styles.getText, {color: '#054B99'}]}>
                  Go back
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{margin: 20}} onPress={handleClosePdf}>
            <View style={styles.getLoan}>
              <Text style={styles.getText}>Get Loan</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Termspolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: statusBarHeight,
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  TextHead: {
    
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  demark: {
    width: '150%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  policy: {},
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  getLoan: {
    backgroundColor: '#054B99',
    borderRadius: 25,
    width: '100%',
    padding: 15,
    justifyContent: 'center',
    //  paddingHorizontal:12,
  },
  getText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'serif',
    fontSize: 16,
  },
});
