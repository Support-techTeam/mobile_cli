import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const CreditCardView = ({
  accountNumber,
  accountHolder,
  singleLimit,
  backgroundImage,
  accountType,
  dailyLimit,
  live,
  handleCopy,
}) => {
  const [showText, setShowText] = useState(true);
  useEffect(() => {
    // Change the state every second or the time given by User.
    const interval = setInterval(() => {
      setShowText(showText => !showText);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      imageStyle={styles.cardBackgroundImage}>
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardBrand}>{accountType}</Text>
          <Icon
            name="circle"
            color={live ? '#2DFF54' : COLORS.red}
            size={16}
            style={{display: showText ? 'none' : 'flex'}}
          />
        </View>

        <Text style={styles.accountHolder}>{accountHolder}</Text>
        <View
          style={{
            flex: 1,
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <TouchableWithoutFeedback onPress={() => handleCopy(accountNumber)}>
            <Text style={styles.accountNumber}>{accountNumber}</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handleCopy(accountNumber)}>
            <Icon
              size={17}
              color={COLORS.white}
              name="content-copy"
              style={{marginLeft: 4}}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.accountHolder}>{dailyLimit}</Text>
          <Text style={styles.singleLimit}>{singleLimit}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: COLORS.highwayBlue,
    borderRadius: 8,
    opacity: 0.8,
    height: heightPercentageToDP(30),
    padding: 20,
  },
  cardBackgroundImage: {
    resizeMode: 'contain', // Cover the entire card area
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  cardBrand: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  accountNumber: {
    fontSize: 20,
    color: '#fff',
    letterSpacing: 2,
  },
  cardFooter: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountHolder: {
    fontSize: 16,
    color: '#fff',
  },
  singleLimit: {
    fontSize: 16,
    color: '#fff',
  },
});

export default CreditCardView;
