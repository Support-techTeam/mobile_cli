/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
const midth = Dimensions.get('window').width;
const hidth = Dimensions.get('window').height;
const text = <Text style={{color: 'red'}}>blue</Text>;
const slides = [
  {
    id: '1',
    image: require('../../../assets/images/onb1.png'),
    title: 'Financial Solution & inclusion for your MSME is here!',
    subtitle: '',
  },
  {
    id: '2',
    image: require('../../../assets/images/onb2.png'),
    title: 'Face the future confidently, Protect all that matters!',
    subtitle: '',
  },
  {
    id: '3',
    image: require('../../../assets/images/onb3.png'),
    title: 'Make the right money moves, Lend funds and earn returns.',
    subtitle: '',
  },
];

const Slide = ({item}) => {
  return (
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.image} />
      <View
        style={{
          position: 'absolute',
          top: hidth * 0.59,
          marginBottom: 0,
          width: wp('100%'),
          paddingLeft: 24,
        }}>
        <Text style={styles.watermark}>{item.title}</Text>
      </View>
    </View>
  );
};
const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentslide, setCurrentSlide] = useState(0);
  const insets = useSafeAreaInsets();
  const Footer = () => {
    const handleCompleteOnboarding = async () => {
      // Set the onboarding state as completed
      try {
        await AsyncStorage.setItem('onboardingCompleted', JSON.stringify(true));
      } catch (error) {
        // console.error('Error setting onboarding state in AsyncStorage', error);
      }
    };
    return (
      <View
        style={{
          height: hp('25%'),
          // height: height * 0.25,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 2,
          }}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentslide === index && {
                  borderColor: '#054B99',
                  borderWidth: 2,
                  backgroundColor: '',
                },
              ]}
            />
          ))}
        </View>

        <View style={{marginBottom: 50}}>
          <TouchableOpacity
            onPress={() => {
              handleCompleteOnboarding();
              navigation.navigate('SignUp');
            }}>
            <View
              style={{
                marginBottom: 2,
                marginLeft: 24,
                marginRight: 18,
                backgroundColor: '#054B99',
                // height: 48,
                height: hp('7%'),
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: '500', color: '#fff'}}>
                Get Started
              </Text>
            </View>
          </TouchableOpacity>

          <Pressable
            onPress={() => {
              handleCompleteOnboarding();
              navigation.navigate('Login');
            }}>
            <View
              style={{
                marginTop: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text style={{fontSize: hp('2.5%')}}>
                Already have an account?{' '}
              </Text>
              <Text style={{color: '#054B99', fontSize: hp('2.5%')}}>
                Log in
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  };
  const updateCurrentSlide = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlide(currentIndex);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        // paddingTop: insets.top !== 0 ? insets.top : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <FlatList
        onMomentumScrollEnd={updateCurrentSlide}
        data={slides}
        pagingEnabled
        // contentContainerStyle={{height: height * 0.77}}
        contentContainerStyle={{height: hp('77%')}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
      <StatusBar />
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#A0A3BD',
    borderRadius: 5,
    height: 10,
    width: 10,
    marginHorizontal: 3,
  },
  content: {
    paddingRight: 40,
    // fontSize: 28,
    // fontSize: width * 0.072,
    fontSize: hp('5%'),
    color: '#054B99',
    fontFamily: 'serif',
    letterSpacing: 0.4,
  },
  image: {
    maxHeight: hp('100%'),
    maxWidth: wp('100%'),
    width: wp('100%'),
    // height: height * 0.72,
    height: hp('72%'),
    resizeMode: 'contain',
    borderWidth: 1,
  },
  imageContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  watermark: {
    position: 'absolute',
    // top: height * 0.04,
    top: hp('4%'),
    left: 0,
    fontSize: hp('3.8%'),
    // fontSize: width * 0.077,
    fontWeight: '600',
    paddingLeft: 5,
    color: '#054B99',
    fontFamily: 'serif',
    letterSpacing: 0.4,
  },
});
