import React, { useEffect, useState } from "react";
import {
  Container,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  H3,
  Icon,
  Text,
  Button
} from "native-base";
import {
  fetchGET,
  postFavourite,
  isLiked,
  deletePost,
} from '../hooks/APIHooks'
import {ActivityIndicator, AsyncStorage} from 'react-native'
import PropTypes from "prop-types";
import AsyncImage from "../components/AsyncImage";
import { Dimensions, StyleSheet } from "react-native";
import { Video } from "expo-av";
import MapView from "react-native-maps";

const deviceHeight = Dimensions.get("window").height;

const mediaURL = "http://media.mw.metropolia.fi/wbma/uploads/";

const Single = props => {
  const [liked, setLiked] = useState();
  const { navigation } = props;
  const file = navigation.state.params.file;
  const owner = navigation.state.params.user;
  const [user, setUser] = useState({});
  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await fetchGET('users', file.user_id, token);
      setUser(user);
    }catch (e) {
      console.log(e)
    }
  };

  const checkLicked = async () => {
    const status = await isLiked(file.file_id);
    setLiked(status);

  };

  const putLike = async () => {
    await postFavourite(file.file_id);
    await checkLicked(file.file_id);
  };

  useEffect(()=> {
    getUser();
    checkLicked();
  },[]);
  const [loading, setLoading] = useState(false);
  const allData = JSON.parse(file.description);
  const exif = allData.exif;
  const description = allData.description;
  console.log(exif);
  return (
    <Container>
      {!loading ? (
      <Content>
        <Card>
          <CardItem>
            {file.media_type === "image" && (
              <AsyncImage
                style={{
                  width: "100%",
                  height: deviceHeight / 2
                }}
                spinnerColor="#777"
                source={{ uri: mediaURL + file.filename }}
              />
            )}
            {file.media_type === "video" && (
              <Video
                source={{ uri: mediaURL + file.filename }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={{ width: "100%", height: deviceHeight / 2 }}
                onError={(e) => {console.log('video error', e)}}
              />
            )}
          </CardItem>
          <CardItem>
            <Left>
              <Body>
                <H3>{file.title}</H3>
                <Text>{description}</Text>
                <Text>By {user.username}</Text>
                <MapView style={styles.map}
                         region= {{
                           latitude: exif.GPSLatitude,
                           longitude: exif.GPSLongitude,
                           latitudeDelta: 0.7,
                           longitudeDelta: 0.7,
                         }}>
                  <MapView.Marker
                    coordinate={{
                      latitude: exif.GPSLatitude,
                      longitude: exif.GPSLongitude,
                    }}
                    title={"Date & Time"}
                    description={exif.DateTime}
                  />
                </MapView>
              </Body>
            </Left>
            <Button transparent onPress={() => {putLike(file.file_id)}}>
              {liked === undefined && <Icon name="heart" style={{color: "red"}} />}
              {liked !== undefined && <Icon name="heart" style={{color: "#3F51B5"}}/>}
            </Button>
          </CardItem>
          {owner === file.user_id &&
          <CardItem>
            <Button danger onPress={ ()=> {deletePost(file.file_id)
            }}>
              <Text>DELETE</Text>
            </Button>
            <Button warning onPress={ async ()=> {
              setLoading(true);
              props.navigation.replace("Update", file);
            }}>
              <Text>UPDATE</Text>
            </Button>
          </CardItem>}
        </Card>
      </Content>
      ) : (<ActivityIndicator size="large" color="#0000ff"/>)}
    </Container>
  );
};
const styles = StyleSheet.create( {
  map: {
    height: Dimensions.get('window').height * 0.5,
    width: Dimensions.get('window').width * 0.75,
  }
});
Single.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object
};

export default Single;

/* END OF FILE */
