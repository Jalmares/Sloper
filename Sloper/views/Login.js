import React, {useState, useContext, useEffect} from "react";
import {
  Container,
  Body,
  Content,
  Form,
  Button,
  Text,
  Item,
  Badge,
  Icon,
} from "native-base";
import {AsyncStorage, Keyboard, Image, Alert} from "react-native";
import PropTypes from "prop-types";
import {fetchAPI} from "../hooks/APIHooks";
import FormTextInput from "../components/FormTextInput";
import useSignUpForm from "../hooks/LoginHooks";
import {Video} from "expo-av";
import {loginConstraints} from "../constraints/Constraints";
import {formStyles, headerStyles, loginStyles} from "../styles/Style";
import {UserContext} from "../contexts/UserContext";

const Login = props => {
  // Hooks
  const [user, setUser] = useContext(UserContext);
  const [toggleForm, setToggleForm] = useState(true);

  // FormTextInput handlers
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
    setErrors
  } = useSignUpForm(loginConstraints);

  // Used to validate user input
  const validationProperties = {
    username: {username: inputs.username},
    email: {email: inputs.email},
    full_name: {full_name: inputs.full_name},
    password: {password: inputs.password},
    confirmPassword: {
      password: inputs.password,
      confirmPassword: inputs.confirmPassword
    }
  };

  /**
   * Authenticates the user with unique token and checks if the user is
    trying to log in with a different account that is not registered to Sloper
   * @param {boolean if the user loging in for first time} firstTime
   */
  const signInAsync = async firstTime => {
    try {
      const mediaURL = "http://media.mw.metropolia.fi/wbma/uploads/";
      const placeHolder = "https://placekitten.com/1024/1024";
      const user = await fetchAPI(
        "POST",
        "login",
        undefined,
        undefined,
        inputs
      );
      await AsyncStorage.setItem("userToken", user.token);
      // Create tag to block user from other apps
      if (firstTime) {
        try {
          // API call to post validation tag
          await fetchAPI("POST", "tags", undefined, user.token, {
            file_id: 1,
            tag: "sloper_validation_" + user.user.user_id
          });
        } catch (e) {
          console.log("error creating tag for new user", e);
        }
      }

      // Check if the user is valid Sloper user.
      try {
        // API call for validation tag
        const validationTag = await fetchAPI(
          "GET",
          "tags/sloper_validation_" + user.user.user_id
        );
        // If user is not registered to Sloper, display an alert
        if (validationTag === undefined || validationTag.length === 0) {
          Alert.alert(
            "Not a Sloper user",
            "Please create a new account to use this application.",
            [
              {
                text: "OK",
                onPress: () => {
                  console.log("OK Pressed");
                  setToggleForm(false);
                }
              }
            ],
            {cancelable: false}
          );
          await AsyncStorage.clear();
          return;
        }
      } catch (e) {
        console.log("fake sloper tag error", e);
      }
      try {
        // API call for avatar picture
        const avatarPic = await fetchAPI(
          "GET",
          "tags",
          "sloper_avatar_" + user.user.user_id
        );

        let avPic = "";
        // If avatar pic is not set, set placeholder
        if (avatarPic.length === 0 || avatarPic === placeHolder) {
          avPic = placeHolder;
        } else {
          avPic = mediaURL + avatarPic[avatarPic.length - 1].filename;
        }
        user.user.avatar = avPic;
      } catch (e) {
        console.log("setting profile picture error ", e);
      }
      try {
        // API call to get user skill level
        const result = await fetchAPI(
          "GET",
          "tags",
          "sloper_skill_" + user.user.user_id
        );
        let skill = "";
        if (result.length === 0) {
          skill = 0;
        } else {
          skill = result[result.length - 1].description;
        }
        user.user.skill = skill;
      } catch (e) {
        console.log("setting skilllevel error ", e);
      }
      // Set user data to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await setUser(user);
      props.navigation.navigate("App"); // Navigate to Home view
    } catch (e) {
      console.log("signInAsync error: " + e.message);
      // Set error badge
      setErrors(errors => ({
        ...errors,
        fetch: "Incorrect username or password"
      }));
    }
  };

  // Registers user to Sloper
  const registerAsync = async () => {
    // Validate user input
    const regValid = validateOnSend(validationProperties);
    if (!regValid) {
      return;
    }
    try {
      // API call to register an user
      const user = inputs;
      delete user.confirmPassword;
      const result = await fetchAPI(
        "POST",
        "users",
        undefined,
        undefined,
        user
      );
      signInAsync(true);
    } catch (e) {
      console.log("registerAsync error: ", e.message);
      // Set error badge
      setErrors(errors => ({
        ...errors,
        fetch: "Something went wrong. Try again"
      }));
    }
  };

  // Pushes content away from the keyboard
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const showAlert = () => {
    Alert.alert(
      'Sloper',
      'Sloper is the place to share your pictures and videos from different downhill skiing locations. Creators: Niko Holopainen, Enar Mariinsky and Jalmari Espo',
      [
        {text: 'Start Sloping!', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  };

  // Login view components
  return (
    <Container>
      <Image
        style={headerStyles.loginLogo}
        source={require("../public/media/sloper.png")}
      />
      <Button rounded onPress={showAlert} style={loginStyles.alertButton}>
        <Icon style={loginStyles.alert} name='md-help'/>
      </Button>
      <Video
        source={require("../public/media/loginVideo.mp4")}
        style={loginStyles.backgroundVideo}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay
        isLooping
        onError={e => {
          console.log("video error", e);
        }}
      />
      <Content style={loginStyles.content}>
        {toggleForm && (
          <Form>
            {!isKeyboardVisible && (
              <Body>
                <Text style={loginStyles.title}>
                  The night is dark and full of terror, be a sloper and make no
                  error
                </Text>
              </Body>
            )}
            <Body>
              <Item style={loginStyles.form}>
                <FormTextInput
                  style={formStyles.border}
                  autoCapitalize="none"
                  value={inputs.username}
                  placeholder="Username"
                  onChangeText={handleUsernameChange}
                />
              </Item>
              <Item style={loginStyles.form}>
                <FormTextInput
                  style={formStyles.border}
                  autoCapitalize="none"
                  value={inputs.password}
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={handlePasswordChange}
                />
              </Item>
            </Body>
            <Body>
              <Button
                style={loginStyles.signInOrRegister}
                rounded
                onPress={() => signInAsync(false)}
              >
                <Text>Sign in</Text>
              </Button>
              <Button
                style={loginStyles.buttonText}
                rounded
                onPress={() => {
                  setToggleForm(false);
                }}
              >
                <Text>Not registered? Create an account</Text>
              </Button>
            </Body>
          </Form>
        )}
        {!toggleForm && (
          <Form>
            <Body>
              {!isKeyboardVisible && (
                <Text style={loginStyles.title}>Become a sloper</Text>
              )}
              <Item style={loginStyles.form}>
                <FormTextInput
                  style={formStyles.border}
                  autoCapitalize="none"
                  value={inputs.username}
                  placeholder="Username"
                  onChangeText={handleUsernameChange}
                  onEndEditing={() => {
                    checkAvail();
                    validateField(validationProperties.username);
                  }}
                  error={errors.username}
                />
              </Item>
              <Item style={loginStyles.form}>
                <FormTextInput
                  style={formStyles.border}
                  autoCapitalize="none"
                  value={inputs.email}
                  placeholder="Email"
                  onChangeText={handleEmailChange}
                  onEndEditing={() => {
                    validateField(validationProperties.email);
                  }}
                  error={errors.email}
                />
              </Item>
              <Item style={loginStyles.form}>
                <FormTextInput
                  style={formStyles.border}
                  autoCapitalize="none"
                  value={inputs.full_name}
                  placeholder="Full name"
                  onChangeText={handleFullnameChange}
                  onEndEditing={() => {
                    validateField(validationProperties.full_name);
                  }}
                  error={errors.full_name}
                />
              </Item>
              <Item style={loginStyles.form}>
                <FormTextInput
                  style={formStyles.border}
                  autoCapitalize="none"
                  value={inputs.password}
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={handlePasswordChange}
                  onEndEditing={() => {
                    validateField(validationProperties.password);
                  }}
                  error={errors.password}
                />
              </Item>
              <Item style={loginStyles.form}>
                <FormTextInput
                  style={formStyles.border}
                  autoCapitalize="none"
                  value={inputs.confirmPassword}
                  placeholder="Confirm password"
                  secureTextEntry={true}
                  onChangeText={handleConfirmPasswordChange}
                  onEndEditing={() => {
                    validateField(validationProperties.confirmPassword);
                  }}
                  error={errors.confirmPassword}
                />
              </Item>
            </Body>
            <Body>
              <Button
                style={loginStyles.signInOrRegister}
                rounded
                onPress={registerAsync}
              >
                <Text>Register</Text>
              </Button>
              <Button
                rounded
                style={loginStyles.buttonText}
                onPress={() => {
                  setToggleForm(true);
                }}
              >
                <Text>Already registered? Sign in here</Text>
              </Button>
            </Body>
          </Form>
        )}
        {errors.fetch && (
          <Body>
            <Badge>
              <Text>{errors.fetch}</Text>
            </Badge>
          </Body>
        )}
      </Content>
    </Container>
  );
};

// proptypes here
Login.propTypes = {
  navigation: PropTypes.object
};

export default Login;

/* END OF FILE */
