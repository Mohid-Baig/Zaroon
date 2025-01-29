import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AgentHeader from '../../../Component/CustomHeader/AgentHeader';
import css from '../../../CssFile/Css';
import Feather from 'react-native-vector-icons/Feather';
import instance from '../../../BaseUrl/BaseUrl';
import Loader from '../../../Component/Loader/Loader';

const HelpCenter = ({navigation}) => {
  const [blogText, setBlogText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getBlogText = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get('/fetch-blog');
      setBlogText(response?.data?.blog);
    } catch (error) {
      console.log('blog Text', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBlogText();
  }, []);

  return (
    <View style={css.MainContainer}>
      <AgentHeader onPress={() => navigation.openDrawer()} />

      <Text style={styles.Header}>User Guide</Text>

      <FlatList
        data={blogText}
        keyExtractor={item => item?.id.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('DetailHelp', {
                  section: item.section,
                  description: item.description,
                });
              }}
              style={styles.ButtonView}>
              <Text style={styles.Btntxt}>{item?.section}</Text>
              <Feather name="chevron-right" size={25} color="#242323" />
            </TouchableOpacity>
          );
        }}
      />
      {isLoading && <Loader />}
    </View>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  ButtonView: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Btntxt: {
    color: '#242323',
    fontSize: 16,
  },
  Header: {
    color: '#000',
    marginTop: 10,
    fontSize: 18,
    paddingLeft: 10,
    fontWeight: 'bold',
  },
});
