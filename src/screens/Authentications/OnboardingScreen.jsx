// React Native App Intro Slider using AppIntroSlider
// https://aboutreact.com/react-native-app-intro-slider/
// Intro slider with Custom Buttons

// import React in our code
import React, {useState} from 'react';

// import all the components we are going to use
import {StyleSheet, View, Text, Image, ImageBackground} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import onbd1 from '../../../assets/images/onb1.png';
import onbd2 from '../../../assets/images/onb2.png';
import onbd3 from '../../../assets/images/onb3.png';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const navigation = useNavigation();
  const onDone = () => {
    handleCompleteOnboarding();
    navigation.navigate('SignUp');
  };

  const RenderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="arrow-right" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };

  const RenderPreviousButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="arrow-left" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };

  const RenderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="check" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };

  const RenderItem = ({item}) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          justifyContent: 'space-between',
          paddingBottom: 100,
        }}>
        <ImageBackground source={item.image} style={styles.imageBackground}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/icons/logo_white.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.text}>
            <Text style={styles.normalText}>{item.normalText}</Text>
            <Text style={styles.specialText}>{item.specialText}</Text>
            <Text style={styles.normalText}>{item.normalText2}</Text>
          </Text>
        </ImageBackground>
      </View>
    );
  };

  const handleCompleteOnboarding = async () => {
    // Set the onboarding state as completed
    try {
      await AsyncStorage.setItem('onboardingCompleted', JSON.stringify(true));
    } catch (error) {}
  };

  return (
    <AppIntroSlider
      data={slides}
      renderItem={RenderItem}
      onDone={onDone}
      dotStyle={{
        backgroundColor: 'rgba(0, 0, 0, .2)',
      }}
      activeDotStyle={{
        backgroundColor: 'rgba(255, 255, 255, .9)',
        borderColor: COLORS.lendaBlue,
        borderWidth: 1,
      }}
      renderDoneButton={RenderDoneButton}
      renderNextButton={RenderNextButton}
      renderPrevButton={RenderPreviousButton}
      showPrevButton={true}
    />
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 1,
  },
  normalText: {
    fontSize: hp(3.5),
    fontWeight: '600',
    color: '#054B99',
  },
  specialText: {
    fontSize: hp(3.5),
    fontWeight: '600',
    color: '#06A77D',
    fontStyle: 'italic',
  },
  logoContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 47.38,
    height: 47.38,
    opacity: 1,
  },
});

const slides = [
  {
    key: 's1',
    normalText: 'Financial Solution & inclusion for your ',
    specialText: 'MSME',
    normalText2: ' is here!',
    image: {
      uri: Image.resolveAssetSource(onbd1).uri,
    },
    backgroundColor: '#fff',
  },
  {
    key: 's2',
    normalText: 'Face the future confidently, ',
    specialText: 'Protect',
    normalText2: ' all that matters!',
    image: {
      uri: Image.resolveAssetSource(onbd2).uri,
    },
    backgroundColor: '#fff',
  },
  {
    key: 's3',
    normalText: 'Make the right money moves, Lend funds and ',
    specialText: 'earn returns',
    normalText2: '.',
    image: {
      uri: Image.resolveAssetSource(onbd3).uri,
    },
    backgroundColor: '#fff',
  },
];
