import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const Announcement = props => {
  const navigation = useNavigation();
  const {index, title, body, image, action} = props;
  return (
    <View style={[styles.container, {marginVertical: hp(1)}]} key={index}>
      <View
        style={[
          styles.button,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <View style={styles.image}>
          <Image
            source={image}
            style={{
              height: 40,
              width: 40,
            }}
          />
        </View>

        <View style={{flex: 1, marginHorizontal: 0}}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: '#D9DBE9',
    width: wp(90),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  button: {
    width: wp('85%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    color: '#054B99',
  },
  desc: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: '#6E7191',
  },
  image: {
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
