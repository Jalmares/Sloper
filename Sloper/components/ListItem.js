import React, {useState, useEffect} from 'react';
import {
  ListItem as BaseListItem,
  Left,
  Body,
  Right,
  Button,
  Text,
  Thumbnail,
  H3,
  Label,
} from 'native-base';
import PropTypes from 'prop-types';
import nearbyCities from "nearby-big-cities";

const mediaURL = 'http://media.mw.metropolia.fi/wbma/uploads/';

const ListItem = (props) => {
  const [city, setCity] = useState(undefined);
  const allData = JSON.parse(props.singleMedia.description);
  const description = allData.description;
  const exif = allData.exif;

  let temp = '';
  if (exif === undefined || exif.GPSLatitude === undefined) {
    temp = undefined;
  } else {
    const query = {latitude: exif.GPSLatitude, longitude: exif.GPSLongitude};
    const cities = nearbyCities(query);
    temp = cities[0].name;
  }

  useEffect(() => {
    setCity(temp);
  }, []);

  return (
    <BaseListItem thumbnail>
      <Left>
        <Thumbnail
          square
          source={{uri: mediaURL + props.singleMedia.thumbnails.w160}}
        />
        {city &&
        <Label>Taken near {city}</Label>
        }
      </Left>
      <Body>
        <H3 numberOfLines={1}>{props.singleMedia.title}</H3>
        <Text numberOfLines={1}>{description}</Text>
      </Body>
      <Right>
        <Button onPress={() => {
          props.navigation.push('Single', {file: props.singleMedia, user: props.user});
        }
        }>
          <Text>View</Text>
        </Button>
      </Right>
    </BaseListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;

/* END OF FILE */
