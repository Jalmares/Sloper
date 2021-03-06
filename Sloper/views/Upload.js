import React, {useState,} from 'react';
import {
  Text,
  Button,
  Form,
  Body,
  Item,
  Container,
  Spinner,
  Badge,
  Left,
  Card,
  CardItem,
  Icon,
} from "native-base";
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import FormTextInput from "../components/FormTextInput";
import useUploadForm from "../hooks/UploadHooks";
import * as ImagePicker from "expo-image-picker";
import {uploadConstraints} from '../constraints/Constraints';
import BackHeader from '../components/BackHeader';
import {apiKey} from "../API";
import {uploadStyles} from "../styles/Style";

const geoApi = "https://api.opencagedata.com/geocode/v1/json?q=";

const Upload = (props) => {

  // FormTextInput handlers
  const {
    inputs,
    errors,
    setErrors,
    handleTextChange,
    handleTitleChange,
    validateInput,
    handleUpload,
    resetText,
  } = useUploadForm(uploadConstraints);

  // Hooks
  const [image, setImage] = useState(null);
  const [exif, setExif] = useState(null);
  const [loading, setLoading] = useState(false);

  // Select image from image library
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true,
    });

    // useState setters if an image was chosen
    if (!result.cancelled) {
      setImage(result.uri);
      setExif(result.exif);
    }
  };

  // Clears inputs and image
  const clearForms = () => {
    setImage(null);
    resetText("title", "");
    resetText("postText", "");
  };

  // Upload image and data
  const uploadImage = async () => {
    const regValid = validateInput("title", inputs.title);
    if (!image) {
      setErrors((errors) =>
        ({
          ...errors,
          fetch: "Choose an image before uploading",
        }));
    }
    if (!regValid && image) {
      setLoading(true);
      setErrors((errors) =>
        ({
          ...errors,
          fetch: undefined,
        }));

      let city = undefined;
      // Try to reverse the geolocation with coordinates from exif data
      try {
        // API call to reverse geocode the coordinates
        const result = await fetch(geoApi + exif.GPSLatitude + "+" + exif.GPSLongitude + "&key=" + apiKey);
        const response = await result.json();
        const components = response.results[0].components; // Results in city name or undefined

        if (components.town !== undefined || null) {
          city = components.town;
        } else if (components.city !== undefined || null) {
          city = components.city;
        }
      } catch (e) {
        console.log("geo api error", e);
        setExif(undefined);
      }
      // Set coordinates or undefined if not present
      let resultData = undefined;
      if (exif !== undefined) {
        resultData = {
          GPSLatitude: exif.GPSLatitude,
          GPSLongitude: exif.GPSLongitude,
          GPSAltitude: exif.GPSAltitude,
          location: city,
        };
      }
      // Send post picture to be set to correct file format
      await handleUpload(image, resultData, 'SloperApp');
      props.navigation.replace("Home"); // Navigate to home
    }
  };

  // Upload view components
  return (
    <Container>
      <BackHeader title="Upload" navigation={props.navigation}/>
      {!loading ? (
        <Body>
          <Form>
            <Card>
              <CardItem bordered>
                <Item style={uploadStyles.border}>
                  <FormTextInput
                    style={uploadStyles.input}
                    value={inputs.title}
                    placeholder='Title'
                    onChangeText={handleTitleChange}
                    onEndEditing={() => {
                      validateInput("title", inputs.title);
                    }}
                    error={errors.title}
                  />
                </Item>
              </CardItem>
              <CardItem bordered>
                <Item style={uploadStyles.border}>
                  <FormTextInput
                    style={uploadStyles.input}
                    value={inputs.postText}
                    placeholder='Description'
                    onChangeText={handleTextChange}
                  />
                </Item>
              </CardItem>
              <CardItem bordered>
                <Left>
                  <Button primary rounded iconLeft onPress={pickImage}>
                    <Icon name={"ios-image"}/>
                    <Text>Select</Text>
                  </Button>
                  <Button warning rounded iconLeft onPress={uploadImage}>
                    <Icon name={"ios-cloud-upload"}/>
                    <Text>Upload</Text>
                  </Button>
                  {image &&
                  <Button danger rounded iconLeft onPress={clearForms}>
                    <Icon name={"ios-trash"}/>
                    <Text>Delete</Text>
                  </Button>
                  }
                </Left>
              </CardItem>
              {errors.fetch &&
              <Body>
                <Badge><Text>{errors.fetch}</Text></Badge>
              </Body>
              }
              {image &&
              <CardItem bordered style={uploadStyles.imageMargin}>
                <Body>
                  <Image source={{uri: image}} style={uploadStyles.image}/>
                </Body>
              </CardItem>
              }
            </Card>
          </Form>
        </Body>
      ) : (<Spinner size="large" color="#0000ff" style={{top: "40%"}}/>)}
    </Container>
  );
};

// proptypes here
Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;

/* END OF FILE */
