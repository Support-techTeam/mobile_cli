import {
  Dimensions,
  FlatList,
  Text,
  View,
  ImageBackground,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState, useEffect, useRef} from 'react';

const {width, height} = Dimensions.get('window');

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'];
const dialPadSize = width * 0.2;
const pinLength = 6;

export default function PinInput() {
  const [pinCode, setPinCode] = useState([]);

  useEffect(() => {
    if (pinCode.length === pinLength) {
      startShakeAnimation();
    }
  }, [pinCode]);

  const shakeAnimationValue = useRef(new Animated.Value(0)).current;

  const startShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimationValue, {
        toValue: 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimationValue, {
        toValue: -10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimationValue, {
        toValue: 20,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimationValue, {
        toValue: -20,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimationValue, {
        toValue: 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimationValue, {
        toValue: -10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimationValue, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const interpolatedTranslateX = shakeAnimationValue.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5px', '5px'],
  });

  const animatedStyle = {
    transform: [{translateX: shakeAnimationValue}],
  };

  const DialPad = ({onPress}) => {
    return (
      <View style={{height: 420}}>
        <FlatList
          data={dialPad}
          numColumns={3}
          style={{flexGrow: 1}}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          columnWrapperStyle={{gap: 30}}
          contentContainerStyle={{gap: 30}}
          renderItem={({item}) => {
            return (
              <Pressable
                onPress={() => onPress(item)}
                disabled={item === ''}
                style={({pressed}) => [
                  {
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                  },
                ]}>
                <View
                  style={{
                    width: dialPadSize,
                    height: dialPadSize,
                    borderRadius: dialPadSize / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {item === 'del' ? (
                    <Ionicons
                      name="backspace-outline"
                      size={dialPadSize / 2}
                      color="black"
                    />
                  ) : item === '' ? (
                    <Ionicons
                      name="fingerprint-off"
                      size={dialPadSize / 2}
                      color="black"
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: dialPadSize / 2,
                        color: 'black',
                      }}>
                      {item}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 42,
          color: 'black',
        }}>
        Login with Passcode
      </Text>
      <Animated.View style={[animatedStyle]}>
        <View
          style={{
            flexDirection: 'row',
            gap: 20,
            marginBottom: 40,
            height: 30,
            alignItems: 'flex-end',
          }}>
          {[...Array(pinLength).keys()].map(index => {
            const isSelected = !!pinCode[index];

            return (
              <View
                key={index}
                style={{
                  width: 22,
                  height: isSelected ? 22 : 2,
                  borderRadius: 22,
                  backgroundColor: 'black',
                }}
              />
            );
          })}
        </View>
      </Animated.View>
      <DialPad
        onPress={item => {
          if (item === 'del') {
            setPinCode(prevCode => prevCode.slice(0, prevCode.length - 1));
          } else if (typeof item === 'number') {
            if (pinCode.length < pinLength) {
              setPinCode(prevCode => [...prevCode, item.toString()]);
            }
          }
        }}
      />
    </View>
  );
}
