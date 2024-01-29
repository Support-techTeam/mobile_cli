/* eslint-disable no-shadow */
/* eslint-disable react/no-unstable-nested-components */
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../../component/inputField/input.component';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import ProofofAdd from '../../../component/Idtypes/ProofOfAddress';

const ITEM_HEIGHT = 100;
const TobTabs = [
  {name: 'Valid Identity', key: 'ValidIdentity'},
  {name: 'Proof of Address', key: 'ProofOfAddress'},
  {name: 'Personal Photo', key: 'PersonalPhoto'},
  {name: 'Identity Card (ARM)', key: 'IdentityCard'},
  {name: 'Bank Statement', key: 'BankStatement'},
  {name: 'Passport', key: 'Passport'},
  {name: 'Signature', key: 'Signature'},
  {name: 'Company Seals', key: 'CompanySeals'},
  {name: 'CAC', key: 'CAC'},
  {name: 'Others', key: 'Others'},
  {name: 'Submit All', key: 'SubmitDocs'},
];

const BankStatement = () => {
  // const docsDetails = route?.params?.paramKey;

  const route = useRoute();
  const {params} = route;
  const {paramKey} = params;

  const activeTab = 'BankStatement';
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const renderItem = ({item}) => {
    const isActive = item.key === activeTab;

    return (
      <View>
        <View style={[styles.tobTab, isActive && styles.activeTab]}>
          <Text style={[styles.tabText, isActive && styles.activeTabText]}>
            {item.name}
          </Text>
        </View>
      </View>
    );
  };

  const FirstRoute = () => {
    return (
      <View
        style={{
          flex: 1,
          marginHorizontal: 19,
        }}>
        <View style={{marginHorizontal: 10, marginVertical: 20}}>
          <ProofofAdd isCam={true} isBank={true} deets={route} />
        </View>
      </View>
    );
  };

  const SecondRoute = () => {
    return (
      <View
        style={{
          flex: 1,
          marginHorizontal: 19,
        }}>
        <View style={{marginHorizontal: 10, marginVertical: 20}}>
          <ProofofAdd isBank={true} deets={route} />
        </View>
      </View>
    );
  };

  const [routes] = useState([
    {key: 'upload', title: 'UPLOAD'},
    {key: 'camera', title: 'CAMERA'},
  ]);

  const renderScene = SceneMap({
    upload: SecondRoute,
    camera: FirstRoute,
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top !== 0 ? insets.top : 18,
        paddingBottom: insets.bottom !== 0 ? insets.bottom / 2 : 'auto',
        paddingLeft: insets.left !== 0 ? insets.left / 2 : 'auto',
        paddingRight: insets.right !== 0 ? insets.right / 2 : 'auto',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 15,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: '#D9DBE9',
              borderRadius: 5,
            }}>
            <AntDesign name="left" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.HeadView}>
          <View style={styles.TopView}>
            <Text style={styles.TextHead}>UPLOAD DOCUMENT</Text>
          </View>
        </View>
        <View>
          <Text> </Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.header}>Upload Bank Statement</Text>
      </View>
      <View style={styles.innercontainer}>
        <FlatList
          data={TobTabs}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          horizontal
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={2}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        />
      </View>

      <TabView
        navigationState={{
          index,
          routes,
        }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        tabBarPosition="top"
        renderTabBar={props => (
          <TabBar
            {...props}
            // tabStyle={styles.tabBar}
            labelStyle={styles.label}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            renderLabel={({route, focused}) => (
              <Text style={[styles.tabText2, focused && {color: '#054B99'}]}>
                {route.title}
              </Text>
            )}
            // contentContainerStyle={styles.tabBar}
          />
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          marginHorizontal: 16,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={[styles.tobTab, {backgroundColor: '#054B99'}]}>
            <Text style={[styles.tabText, {color: 'white'}]}>Prev.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Passport', {paramKey: {...paramKey}})
          }>
          <View style={[styles.tobTab, {backgroundColor: '#054B99'}]}>
            <Text style={[styles.tabText, {color: 'white'}]}>Skip</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BankStatement;
const styles = StyleSheet.create({
  innercontainer: {
    marginTop: 16,
    marginHorizontal: 19,
  },
  tobTab: {
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: 2,
  },
  activeTabText: {
    color: 'white',
  },
  activeTab: {
    backgroundColor: '#054B99',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabText2: {
    fontFamily: 'serif',
    fontSize: 12,
    textAlign: 'center',
  },
  TextHead: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    alignItems: 'center',
    marginVertical: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#14142B',
  },
  tabBar: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderWidth: 0,
  },
  indicator: {
    backgroundColor: '#054B99',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  camHead: {
    fontSize: 14,
    fontWeight: '400',
  },
});
