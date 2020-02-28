import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";
import {Form,
  Container,
  Content,
  Item,
  Input,
  Picker,
  Icon,
  Textarea,
  Text,
  H3,
  Button, Label} from 'native-base'
import useUploadForm from '../hooks/UploadHooks'
import useSignUpForm from '../hooks/LoginHooks'
import * as ImagePicker from "expo-image-picker";
import {fetchAPI, uploadImage} from '../hooks/APIHooks'
import {updateConstraints} from '../constraints/Constraints'


const UpdateUser = ({navigation}) => {

  const {userdata} = navigation.state.params
  const { handleUpload } = useUploadForm();
  const {
    handleUsernameChange,
    handlePasswordChange,
    handleEmailChange,
    handleFullnameChange,
    handleConfirmPasswordChange,
    validateField,
    validateOnSend,
    checkAvail,
    inputs,
    errors,
    setErrors,
    setInputs

  } = useSignUpForm(updateConstraints);
  useEffect(()=> {
    setInputs({
      username: userdata.username,
      email: userdata.email
    })

  },[])

 const validationProperties = {
    username: {username: inputs.username},
    email: {email: inputs.email},
  };

  // Image picker from gallery
 const [avatarPic, setAvatarPic] = useState(undefined)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    if (!result.cancelled) {
      setAvatarPic(result.uri);
    }
  };

  const updateProfileAsync = async () => {
    console.log('inputs:', inputs)
    const regValid = validateOnSend(validationProperties);
    console.log('reg field errors', errors);

    console.log(regValid)

    if (!regValid) {
      console.log('not valid');
      return;
    }
    const token =  await AsyncStorage.getItem('userToken');
    try {
      const user = inputs;
      //delete user.confirmPassword;
      console.log('avatarpic', avatarPic)
      if (avatarPic != undefined) {
      await handleUpload(avatarPic, null, 'sloper_avatar_' + userdata.user_id)
      }
      await fetchAPI('PUT','users',undefined , token, user);
      await AsyncStorage.clear()
      navigation.navigate('AuthLoading');

   } catch (e) {
      console.log('registerAsync error: ', e.message);
      setErrors((errors) =>
        ({
          ...errors,
          fetch: e.message,
        }));
    }
  };

  return (
    <Container>
    <Content padder>
      <Form>
        <Item>
        <Label>Username:</Label>
        <Input
          placeholder={userdata.username}
          onChangeText={handleUsernameChange}
          onEndEditing={() => validateField(validationProperties.username)}

        />
        </Item>
        <Item>
        <Label>Email</Label>
        <Input
          placeholder={userdata.email}
          onChangeText={handleEmailChange}
        />
        </Item>
        <Item>
        <Label>Password:</Label>
        <Input
          placeholder='password'
          onChangeText={handlePasswordChange}
        />
        </Item>
        <Item>
        <Label>Confirm Password: </Label>
        <Input
          placeholder='Confirm password'
          onChangeText={handleConfirmPasswordChange}
        />
        </Item>
        <Item>
          <Button onPress={pickImage}><Text>select image</Text></Button>
          {avatarPic && <Image source={{uri: avatarPic}} style={styles.image}></Image>}
        </Item>
        <Item>
          <Button onPress={async () => {
            await updateProfileAsync();

          }}><Text>Update profile</Text></Button>
        </Item>
       </Form>
    </Content>
  </Container>

  );
};
  const styles = StyleSheet.create({
    image: {
      width: Dimensions.get("window").width * 0.15,
      height: Dimensions.get("window").width * 0.15,
    },
  });



export default UpdateUser;