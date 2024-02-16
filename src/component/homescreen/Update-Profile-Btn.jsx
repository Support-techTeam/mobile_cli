import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const UpdateProfileBtn = props => {
  const navigation = useNavigation();
  const {title, body, image, action} = props;
  return (
    <View style={[styles.container, {marginTop: hp(1)}]}>
      <TouchableOpacity
        style={[styles.button]}
        onPress={action}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={styles.image}>
            <Image source={image} />
          </View>

          <View style={{flex: 1, marginHorizontal: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.desc}>{body}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: '#D9DBE9',
    width: wp(90),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  button: {
    height: hp(7.4),
    width: wp('85%'),
    alignSelf: 'center',
    backgroundColor: '#CDDBEB',
    marginVertical: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    color: '#14142B',
  },
  desc: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  image: {
    borderRadius: 5,
    marginRight: 16,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
