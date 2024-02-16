import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';

export const Header = props => {
  const {routeAction, heading, disable} = props;
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.leftView}>
          <TouchableOpacity onPress={routeAction}>
            <View style={styles.arrow}>
              <Icon name="chevron-left" size={26} color={COLORS.lendaGrey} />
            </View>
          </TouchableOpacity>
          <View style={styles.HeadView}>
            <View style={styles.TopView}>
              <Text style={styles.TextHead}>{heading}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightView}>
         {disable === false && <TouchableOpacity style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
          }}
          onPress={() => navigation.navigate('SupportScreen')}
          >
            <Icon name="headset" size={26} color={COLORS.lendaBlue} />
          </TouchableOpacity>}
        </View>
      </View>
      <View style={styles.demark} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    height: hp('5%'),
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeadView: {
    alignItems: 'center',
  },
  TopView: {
    justifyContent: 'space-between',
  },
  TextHead: {
    fontFamily: 'MontSBold',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: 0.5,
    flexShrink: 1,
    color: '#14142B',
  },

  demark: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D9DBE9',
    marginTop: 10,
  },
  arrow: {
    borderWidth: 0.2,
    borderColor: COLORS.lendaComponentBorder,
    backgroundColor: COLORS.lendaComponentBg,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rightView: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  leftView: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
});
