import {Dimensions, StyleSheet, Platform, ActivityIndicator} from 'react-native';
import React from "react";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Gives styling to Loginscreen
const loginStyles = StyleSheet.create({
  backgroundVideo: {
    height: windowHeight,
    width: windowWidth,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'stretch',
    bottom: 0,
    right: 0,
  },
  content: {
    ...Platform.select({
      ios: {
        top: '20%',
      },
      android: {
        top: 0,
      },
    }),
  },
  title: {
    color: 'grey',
    margin: 40,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    textDecorationLine: 'underline',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    borderColor: 'grey',
    borderWidth: 1,
  },
  form: {
    borderColor: 'transparent',
    marginRight: 15,
    marginLeft: 10,

  },
  signInOrRegister: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    marginTop: 15,

  },
  alert: {
    fontSize: 30,
  },
  alertButton: {
    zIndex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    width: 49,
    marginLeft: 10,
  },
});

// Gives styling to Forms
const formStyles = StyleSheet.create({
  border: {
    borderColor: 'black',
    color: 'white',
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    borderRadius: 25,
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 15,
    marginTop: 5,
    paddingLeft: 20,
  },
  form: {
    borderColor: 'transparent',
  },
});

// Gives styling to List
const listStyles = StyleSheet.create({
  thumbNail: {
    ...Platform.select({
      ios: {
        width: windowWidth * 0.6,
        height: windowHeight * 0.18,
        marginLeft: -15,
        marginTop: -37,
      },
      android: {
        width: windowWidth * 0.6,
        height: windowHeight * 0.2,
        marginLeft: -15,
        marginTop: -40,
      },
    }),
  },
  baseList: {
    borderColor: 'transparent',
    backgroundColor: 'aliceblue',
    marginLeft: 0,
  },
  card: {
    ...Platform.select({
      ios: {
        width: windowWidth,
        height: windowHeight * 0.16,
        marginTop: -5,
      },
      android: {
        width: windowWidth,
        height: windowHeight * 0.19,
        marginTop: -5,
      },
    }),
  },
  heartColor: {
    color: 'black',
  },
  starColor: {
    color: 'black',
  },
  locationColor: {
    color: 'black',
  },
  listTitle: {
    ...Platform.select({
      ios: {
        zIndex: 1,
        marginLeft: -15,
        maxWidth: windowWidth * 0.6,
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        top: -15,
      },
      android: {
        zIndex: 1,
        marginLeft: -15,
        maxWidth: windowWidth * 0.6,
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        top: -18,
      },
    }),
  },
  bodyMargin: {
    marginTop: -10,
  },
  headerBar: {
    backgroundColor: 'white',
  },
  headerInput: {
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
});

// Gives styling to Single
const singleStyles = StyleSheet.create({
  map: {
    width: '100%',
    height: windowHeight * 0.4,
    flex: 1,
    marginTop: 0,
  },
  asyncImage: {
    ...Platform.select({
      ios: {
        width: '100%',
        height: windowHeight * 0.5,
        flex: 1,
        marginTop: -30,
      },
      android: {
        width: '100%',
        height: windowHeight * 0.5,
        flex: 1,
      },
    }),
  },
  title: {
    fontSize: 40,
    marginTop: 10,
  },
  description: {
    fontSize: 18,
  },
  heart: {
    color: '#3F51B5',
    fontSize: 30,
    marginRight: 20,
  },
  heartLiked: {
    color: 'red',
    fontSize: 30,
    marginRight: 20,
  },
  commentTitle: {
    fontSize: 20,
  },
  comments: {
    width: windowWidth * 0.95,
    borderColor: 'transparent',
  },
  border: {
    borderColor: 'transparent',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  commentForm: {
    borderColor: 'transparent',
    marginTop: 10,
    marginBottom: 10,
  },
  commentInput: {
    borderRadius: 25,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  bubbleIcon: {
    fontSize: 25,
    marginRight: 5,
  },
  cardItem: {
    marginTop: -60,
  },
  rateText: {
    marginTop: 10,
  },
});

// Gives styling to myFiles
const myFilesStyles = StyleSheet.create({
  tabFooter: {
    ...Platform.select({
      ios: {
        backgroundColor: 'white',
      },
      android: {},
    }),
  },
});

// Gives styling to Header
const headerStyles = StyleSheet.create({
  headerLogo: {
    ...Platform.select({
      ios: {
        width: 70,
        height: 25,
        marginLeft: 10,
      },
      android: {
        width: 70,
        height: 25,
        marginLeft: 95,
      },
    }),
  },
  headerArrow: {
    ...Platform.select({
      ios: {},
      android: {
        color: 'blue',
      },
    }),
  },
  loginLogo: {
    width: 150,
    height: 50,
    top: '8%',
    left: '33%',
    zIndex: 1,
  },
  headerImage: {
    width: 30,
    height: 30,
    borderRadius: 40
  },
  headerColor: {
    backgroundColor: 'white',
  },
});

// Gives styling to Loading
const loadingStyles = StyleSheet.create({
  activityIndicator: {
    top: '30%',
  },
});

// Gives styling to aSyncImages
const aSyncImageStyles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
  view: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -13,
  },
  viewFlex: {
    flex: 1,
  },
});

// Gives styling to Profile
const profileStyles = StyleSheet.create({
  profilePic: {
    width: '100%',
    height: windowHeight * 0.5,
  },
  profileIcon: {
    fontSize: 30,
  },
  info: {
    fontSize: 16,
  },
  myPostsIcon: {
    marginRight: 10,
  },
  logoutIcon: {
    marginLeft: 10,
  },
});

// Gives styling to Updating post
const updateStyles = StyleSheet.create({
  formTextInput: {
    borderRadius: 25,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  imageMargin: {
    marginLeft: 10,
  },
  imageSize: {
    width: windowWidth * 0.85,
    height: windowHeight * 0.45,
  },
  border: {
    borderColor: 'transparent',
  },
});

// Gives styling to updating Profile
const updateUserStyles = StyleSheet.create({
  border: {
    borderColor: 'transparent',
  },
  iconSize: {
    fontSize: 30,
  },
  input: {
    borderRadius: 25,
    borderStyle: "solid",
    borderWidth: 1,
  },
  slider: {
    width: 300,
    height: 40,
  },
  image: {
    width: windowWidth * 0.2,
    height: windowHeight * 0.09,
  },
});

// Gives styling to Upload
const uploadStyles = StyleSheet.create({
  border: {
    borderColor: 'transparent',
  },
  input: {
    borderRadius: 25,
    borderStyle: "solid",
    borderWidth: 1,
  },
  imageMargin: {
    marginLeft: 10,
  },
  image: {
    width: windowWidth * 0.85,
    height: windowHeight * 0.4,
  },
});

export {
  loginStyles,
  formStyles,
  listStyles,
  singleStyles,
  myFilesStyles,
  headerStyles,
  loadingStyles,
  aSyncImageStyles,
  profileStyles,
  updateStyles,
  updateUserStyles,
  uploadStyles,
};

