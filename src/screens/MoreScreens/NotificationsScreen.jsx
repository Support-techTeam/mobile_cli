import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
} from 'react-native';
import React, {
  useEffect,
  useState,
  Component,
  useContext,
  useCallback,
} from 'react';
import {
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header} from '../../component/header/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../constants/colors';
import Timeline from 'react-native-timeline-flatlist';
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
    let title = <Text style={[styles.title]}>{sectionID + 1}. {rowData.title}</Text>;
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
        <Timeline
          style={styles.list}
          data={notifications}
          circleSize={20}
          circleColor="rgb(45,156,219)"
          lineColor="rgb(45,156,219)"
          timeContainerStyle={{minWidth: 52, marginTop: 0}}
          timeStyle={{
            textAlign: 'center',
            backgroundColor: '#ff9797',
            color: 'white',
            padding: 5,
            borderRadius: 13,
          }}
          descriptionStyle={{color: 'gray'}}
          options={{
            style: {paddingTop: 5},
            ListEmptyComponent: <RenderEmptyItem />,
          }}
          isUsingFlatlist={true}
          innerCircle={'dot'}
          renderDetail={renderDetail}
          columnFormat="single-column-left"
          onEventPress={e => {
            const title = e?.title;
            const body = e?.description;
            const android = e?.android;
            const redirectUrl = e?.redirectUrl;
            setNotification({title, body, android, redirectUrl});
            if (e.viewed === false) {
              updateNotification(e.id, {viewed: true});
              getNotificationList();
            }
          }}
          renderFullLine={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    marginTop: 20,
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
});
