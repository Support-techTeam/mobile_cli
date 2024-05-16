import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Button,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header} from '../../component/header/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NotificationContext} from '../../context/NotificationContext';
import CustomNotification from '../../component/push-notifications/CustomNotification';

// const data = [
//   {
//     time: '09:00',
//     title: 'Archery Training',
//     description:
//       'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
//     lineColor: '#009688',
//     viewed: false,
//   },
//   {
//     time: '10:45',
//     title: 'Play Badminton',
//     description:
//       'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
//     viewed: false,
//   },
//   {time: '12:00', title: 'Lunch'},
//   {
//     time: '14:00',
//     title: 'Watch Soccer',
//     description:
//       'Team sport played between two teams of eleven players with a spherical ball. ',
//     lineColor: '#009688',
//     viewed: true,
//   },
//   {
//     time: '16:30',
//     title: 'Go to Fitness center',
//     description: 'Look out for the Best Gym & Fitness Centers around me :)',
//     viewed: true,
//   },
//   {
//     time: '09:00',
//     title: 'Archery Training',
//     description:
//       'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
//     lineColor: '#009688',
//     viewed: false,
//   },
//   {
//     time: '10:45',
//     title: 'Play Badminton',
//     description:
//       'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
//     viewed: false,
//   },
//   {time: '12:00', title: 'Lunch'},
//   {
//     time: '14:00',
//     title: 'Watch Soccer',
//     description:
//       'Team sport played between two teams of eleven players with a spherical ball. ',
//     lineColor: '#009688',
//     viewed: true,
//   },
//   {
//     time: '16:30',
//     title: 'Go to Fitness center',
//     description: 'Look out for the Best Gym & Fitness Centers around me :)',
//     viewed: true,
//   },
//   {
//     time: '09:00',
//     title: 'Archery Training',
//     description:
//       'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
//     lineColor: '#009688',
//     viewed: false,
//   },
//   {
//     time: '10:45',
//     title: 'Play Badminton',
//     description:
//       'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
//     viewed: false,
//   },
//   {time: '12:00', title: 'Lunch'},
//   {
//     time: '14:00',
//     title: 'Watch Soccer',
//     description:
//       'Team sport played between two teams of eleven players with a spherical ball. ',
//     lineColor: '#009688',
//     viewed: true,
//   },
//   {
//     time: '16:30',
//     title: 'Go to Fitness center',
//     description: 'Look out for the Best Gym & Fitness Centers around me :)',
//     viewed: true,
//   },
//   {
//     time: '09:00',
//     title: 'Archery Training',
//     description:
//       'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
//     lineColor: '#009688',
//     viewed: false,
//   },
//   {
//     time: '10:45',
//     title: 'Play Badminton',
//     description:
//       'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
//     viewed: false,
//   },
//   {time: '12:00', title: 'Lunch'},
//   {
//     time: '14:00',
//     title: 'Watch Soccer',
//     description:
//       'Team sport played between two teams of eleven players with a spherical ball. ',
//     lineColor: '#009688',
//     viewed: true,
//   },
//   {
//     time: '16:30',
//     title: 'Go to Fitness center',
//     description: 'Look out for the Best Gym & Fitness Centers around me :)',
//     viewed: true,
//   },
//   {
//     time: '09:00',
//     title: 'Archery Training',
//     description:
//       'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
//     lineColor: '#009688',
//     viewed: false,
//   },
//   {
//     time: '10:45',
//     title: 'Play Badminton',
//     description:
//       'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
//     viewed: false,
//   },
//   {time: '12:00', title: 'Lunch'},
//   {
//     time: '14:00',
//     title: 'Watch Soccer',
//     description:
//       'Team sport played between two teams of eleven players with a spherical ball. ',
//     lineColor: '#009688',
//     viewed: true,
//   },
//   {
//     time: '16:30',
//     title: 'Go to Fitness center',
//     description: 'Look out for the Best Gym & Fitness Centers around me :)',
//     viewed: true,
//   },
//   {
//     time: '09:00',
//     title: 'Archery Training',
//     description:
//       'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
//     lineColor: '#009688',
//     viewed: false,
//   },
//   {
//     time: '10:45',
//     title: 'Play Badminton',
//     description:
//       'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.',
//     viewed: false,
//   },
//   {time: '12:00', title: 'Lunch'},
//   {
//     time: '14:00',
//     title: 'Watch Soccer',
//     description:
//       'Team sport played between two teams of eleven players with a spherical ball. ',
//     lineColor: '#009688',
//     viewed: true,
//   },
//   {
//     time: '16:30',
//     title: 'Go to Fitness center',
//     description: 'Look out for the Best Gym & Fitness Centers around me :)',
//     viewed: true,
//   },
// ];

const NotificationsScreen = () => {
  const {notifications, loadNotifications, updateNotification} =
    useContext(NotificationContext);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // useFocusEffect(
  useEffect(() => {
    getNotificationList();
  }, []);
  // );

  const getNotificationList = () => {
    setIsLoading(true);
    loadNotifications();
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  const handleNotificationPress = () => {
    setNotification(null);
  };

  function renderDetail(rowData, sectionID, rowID) {
    let title = (
      <Text style={[styles.title]}>
        {sectionID + 1}. {rowData.title}
      </Text>
    );
    var desc = null;
    const date = new Date(rowData.id);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
    if (rowData.description) {
      desc = (
        <View style={styles.descriptionContainer}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text
            style={
              ([styles.textDescription],
              {
                color: `${rowData.viewed ? 'black' : COLORS.lendaLightBlue}`,
              })
            }>
            {rowData.description}
          </Text>
        </View>
      );
    }

    return (
      <View style={{flex: 1}}>
        {title}
        {desc}
      </View>
    );
  }

  const formatDate = date => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatDateTime = date => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const RenderEmptyItem = () => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 20,
            marginVertical: hp('15%'),
          }}>
          <Image source={require('../../../assets/images/Group.png')} />
          <Text style={styles.noTrans}>No notification data available!</Text>
        </View>
      </View>
    );
  };

  // Organize notifications into sections by date
  const sections = notifications.reduce((acc, notification) => {
    const dateKey = formatDate(new Date(notification.id));
    const existingSection = acc.find(section => section.title === dateKey);
    if (existingSection) {
      existingSection.data.push(notification);
    } else {
      acc.push({title: dateKey, data: [notification]});
    }
    return acc;
  }, []);

  // Render each section
  const renderSection = ({section: {title}}) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  // Render each notification item
  const renderItem = ({item}) => {
    const date = new Date(item.id);
    const formattedDate = formatDate(date);
    return (
      <View
        style={[
          styles.PanelItemContainer,
          {
            justifyContent: 'center',
          },
        ]}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              height: 'auto',
              paddingHorizontal: 10,
              backgroundColor: '#F7F7FC',
            },
          ]}
          onPress={() => {
            const title = item?.title;
            const body = item?.description;
            const android = item?.android;
            const redirectUrl = item?.redirectUrl;
            setNotification({title, body, android, redirectUrl});
            if (item.viewed === false) {
              updateNotification(item.id, {viewed: true});
              getNotificationList();
            }
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              gap: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 0.8,
              }}>
              <View>
                <Text
                  style={[
                    styles.title,
                    {
                      fontSize: hp(1.8),
                      color: COLORS.dark,
                    },
                  ]}>
                  {item.title}
                </Text>
                <Text
                  numberOfLines={4}
                  style={[
                    styles.desc,
                    {
                      color: COLORS.dark,
                      opacity: 0.8,
                      marginTop: 1,
                    },
                  ]}>
                  {item.description}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 0.2,
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.desc}>
                {formatDateTime(new Date(item.id))}
              </Text>

              <View style={{alignSelf: 'center', justifyContent: 'center'}}>
                <Icon name="chevron-right" size={16} color={COLORS.lendaBlue} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? Math.min(insets.top, 10) : 'auto',
        paddingBottom:
          insets.bottom !== 0 ? Math.min(insets.bottom, 10) : 'auto',
        paddingLeft: insets.left !== 0 ? Math.min(insets.left, 10) : 'auto',
        paddingRight: insets.right !== 0 ? Math.min(insets.right, 10) : 'auto',
      }}>
      <Header
        routeAction={() => navigation.goBack()}
        heading="NOTIFICATIONS"
        disable={false}
      />
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={COLORS.lendaGreen}
          animating
          style={{
            zIndex: 99999,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
      <CustomNotification
        isVisible={notification === null ? false : true}
        title={notification?.title}
        body={notification?.body}
        imageUrl={notification?.android?.imageUrl}
        redirectUrl={notification?.redirectUrl}
        onPress={handleNotificationPress}
        navigationRef={navigation}
        insideRoute={true}
      />
      <View style={styles.container}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id.toString()}
          renderSectionHeader={renderSection}
          renderItem={renderItem}
          ListEmptyComponent={<RenderEmptyItem />}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  descriptionContainer: {
    flexDirection: 'column',
    paddingRight: 50,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textDescription: {
    // marginLeft: 10,
    color: 'black',
  },
  noTrans: {
    fontFamily: 'MontSBold',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },

  dateText: {
    fontFamily: 'MontSBold',
    fontSize: 14,
    fontWeight: '600',
  },
  PanelItemContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
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
  button: {
    borderWidth: 0,
    borderColor: COLORS.lendaComponentBorder,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  sectionHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    color: '#6E7191',
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
