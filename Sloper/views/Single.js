import React, {useEffect, useState} from "react";
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
  Button,
} from "native-base";
import {
  fetchAPI,
  postFavourite,
  isLiked,
  deletePost,
} from '../hooks/APIHooks'
import {ActivityIndicator, AsyncStorage} from 'react-native'
import PropTypes from "prop-types";
import AsyncImage from "../components/AsyncImage";
import {Dimensions, StyleSheet} from "react-native";
import {Video} from "expo-av";
import MapView from "react-native-maps";

const deviceHeight = Dimensions.get("window").height;

const mediaURL = "http://media.mw.metropolia.fi/wbma/uploads/";

const Single = props => {
  const [liked, setLiked] = useState();
  const {navigation} = props;
  const file = navigation.state.params.file;
  const owner = navigation.state.params.user;
  const [user, setUser] = useState({});

  const getComments = (id) => {
    const [comments, setComments] = useState();
    const [commentsLoading, setCommentsLoading] = useState(true);
    const fetchComments = async (id) => {
      try {
      const result = await fetchAPI('GET', 'comments/file', id)
      setComments(result);
      setCommentsLoading(false);
      } catch (e) {
        console.log('comments loading error ', e)
      }
    };
    useEffect(()=> {
      fetchComments(id)
    }, []);
    return [comments, commentsLoading];
  }
  const [comments, commentsLoading] = getComments(file.file_id);

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await fetchAPI('GET', 'users', file.user_id, token);
      setUser(user);
    } catch (e) {
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

  useEffect(() => {
    getUser();
    checkLicked();
  }, []);

  const [loading, setLoading] = useState(false);
  const [avail, setAvail] = useState(false);
  const allData = JSON.parse(file.description);
  const exif = allData.exif;
  const description = allData.description;

  if (exif !== undefined) {
    if (exif.GPSLongitude !== undefined && exif.GPSLatitude !== undefined) {
      useEffect(() => {
        setAvail(true);
      }, []);
    }
  }

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
                  source={{uri: mediaURL + file.filename}}
                />
              )}
              {file.media_type === "video" && (
                <Video
                  source={{uri: mediaURL + file.filename}}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  style={{width: "100%", height: deviceHeight / 2}}
                  onError={(e) => {
                    console.log('video error', e)
                  }}
                />
              )}
            </CardItem>
            <CardItem>
              <Left>
                <Body>
                  <H3>{file.title}</H3>
                  <Text>{description}</Text>
                  <Text>By {user.username}</Text>
                  {avail ? (
                    <MapView style={styles.map}
                             region= {{
                               latitude: exif.GPSLatitude,
                               longitude: exif.GPSLongitude,
                               latitudeDelta: 1,
                               longitudeDelta: 1,
                             }}>
                      <MapView.Marker
                        coordinate={{
                          latitude: exif.GPSLatitude,
                          longitude: exif.GPSLongitude,
                        }}
                        title={`${exif.GPSAltitude} meters above the sea level`}
                      />
                    </MapView>
                  ) : (
                    <Text>No GPS data available</Text>
                  )}
                </Body>
              </Left>
              <Button transparent onPress={() => {
                putLike(file.file_id)
              }}>
                {liked === undefined && <Icon name="heart" style={{color: "#3F51B5"}}/>}
                {liked !== undefined && <Icon name="heart" style={{color: "red"}}/>}
              </Button>
            </CardItem>
            {owner === file.user_id &&
            <CardItem>
              <Button danger onPress={() => {
                deletePost(file.file_id)
              }}>
                <Text>DELETE</Text>
              </Button>
              <Button warning onPress={async () => {
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
const styles = StyleSheet.create({
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
