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

const {width, height} = Dimensions.get('window');
const midth = Dimensions.get('window').width;
const hidth = Dimensions.get('window').height;

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
    title: 'Make the right money moves, Lend funds and earn returns. ',
    subtitle: '',
  },
];

const Slide = ({item}) => {
  const insets = useSafeAreaInsets();
  // console.log(insets.top * 0.05, height);
  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        position: 'relative',
        paddingTop: insets.top !== 0 ? insets.top * 0.05 : 'auto',
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <Image
        source={item.image}
        style={{height: '100%', width: midth, resizeMode: 'cover'}}
      />
      <View
        style={{
          position: 'absolute',
          top: hidth * 0.59,
          // bottom: hidth * 0.01,
          marginBottom: 0,
          width: '100%',
          paddingLeft: 24,
        }}>
        <Text style={styles.content}>{item.title}</Text>
      </View>
    </SafeAreaView>
  );
};
const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentslide, setCurrentSlide] = useState(0);
  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.25,
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
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <View
              style={{
                marginBottom: 2,
                marginLeft: 24,
                marginRight: 18,
                backgroundColor: '#054B99',
                height: 48,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: '500', color: '#fff'}}>
                Get Started
              </Text>
            </View>
          </TouchableOpacity>

          <Pressable onPress={() => navigation.navigate('Login')}>
            <View
              style={{
                marginTop: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text style={{fontSize: 16}}>Already have an account? </Text>
              <Text style={{color: '#054B99', fontSize: 16}}>Log in</Text>
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
    <View style={styles.container}>
      <FlatList
        onMomentumScrollEnd={updateCurrentSlide}
        data={slides}
        pagingEnabled
        contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
      <StatusBar />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingTop: statusBarHeight,
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: '#A0A3BD',
    marginHorizontal: 3,
    borderRadius: 5,
  },
  content: {
    paddingRight: 40,
    // fontSize: 28,
    fontSize: width * 0.072,
    color: '#054B99',
    fontFamily: 'MontSBold',
    letterSpacing: 0.4,
  },
});
