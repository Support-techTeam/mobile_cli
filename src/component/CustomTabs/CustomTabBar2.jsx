import React, {useState, useRef} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';

const data = [
  {id: 'camera', title: 'CAMERA'},
  {id: 'upload', title: 'UPLOAD'},
];

const CustomTabBar2 = ({navigationState, onIndexChange}) => {
  const [activeTab, setActiveTab] = useState(navigationState.index);
  const flatListRef = useRef();

  const handleTabPress = index => {
    setActiveTab(index);
    onIndexChange(index);
    flatListRef.current.scrollToIndex({index, animated: true});
  };

  const handleNextPress = () => {
    const nextIndex = (activeTab + 1) % data?.length;
    setActiveTab(nextIndex);
    onIndexChange(nextIndex);
    flatListRef.current.scrollToIndex({index: nextIndex, animated: true});
  };

  const handlePrevPress = () => {
    const prevIndex = (activeTab - 1) % data?.length;
    if (activeTab === 0) {
      return;
    }
    setActiveTab(prevIndex);
    onIndexChange(prevIndex);
    flatListRef.current.scrollToIndex({index: prevIndex, animated: true});
  };

  const renderItem = ({item, index}) => {
    const isActive = index === activeTab;

    return (
      <TouchableOpacity
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={() => handleTabPress(index)}>
        <Text style={[styles.tabTitle, isActive && styles.activeTabTitle]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.nextButton} onPress={handlePrevPress}>
        <AntDesign
          name="stepbackward"
          size={24}
          color="black"
          style={styles.nextButtonText}
        />
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <AntDesign
          name="stepforward"
          size={24}
          color="black"
          style={styles.nextButtonText}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CustomTabBar2;

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginTop: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    marginRight: 30,
    marginLeft: 40,
    // backgroundColor: 'red',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#054B99',
  },
  tabTitle: {
    fontSize: 16,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 15,
  },
  nextButtonText: {
    fontSize: 16,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '25%',
    backgroundColor: 'blue',
  },
  activeTabTitle: {
    color: '#054B99',
  },
});
