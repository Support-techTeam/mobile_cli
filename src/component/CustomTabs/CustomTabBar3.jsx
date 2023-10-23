import React, {useState, useRef} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const data = [{id: 'myInvesments', title: 'My Investment'}];

const CustomTabBar = ({navigationState, onIndexChange}) => {
  const [activeTab, setActiveTab] = useState(navigationState.index);
  const flatListRef = useRef();

  const handleTabPress = index => {
    setActiveTab(index);
    onIndexChange(index);
    flatListRef.current.scrollToIndex({index, animated: true});
  };

  const renderItem = ({item, index}) => {
    const isActive = index === activeTab;

    return (
      <View>
        <TouchableOpacity
          style={[styles.tab]}
          onPress={() => handleTabPress(index)}>
          <Text style={[styles.tabTitle]}>{item.title}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.tabBar}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    height: hp(10),
    width: wp(100),
    marginTop: 20,
  },
  tab: {
    paddingHorizontal: 20,
  },
  tabTitle: {
    fontSize: hp(2.8),
    fontFamily: 'serif',
    textAlign: 'center',
  },
});
