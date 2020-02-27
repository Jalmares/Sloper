import { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";

const apiUrl = "http://media.mw.metropolia.fi/wbma/";

const fetchAPI = async (
  method = "GET",
  endpoint = "",
  params = "",
  token = "",
  data = {},
  type = "application/json"
) => {
  if (type === "form") type = "multipart/form-data";
  const options = {
    method: method,
    headers: {
      "x-access-token": token,
      "Content-Type": type
    }
  };
  if (method != "GET") {
    if(type != "multipart/form-data"){
    options.body = JSON.stringify(data);
    } else { options.body = data}

  }
  const response = await fetch(apiUrl + endpoint + "/" + params, options);
  const json = await response.json();
  if (response.status === 400 || response.status === 401) {
    const message = Object.values(json).join();
    throw new Error(message);
  } else if (response.status > 299) {
    throw new Error("fetch" + method + " error: " + response.status);
  }
  return json;
};

const deletePost = async id => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const result = fetchAPI('DELETE', "media", id, token);
  } catch (e) {
    console.log(e);
  }
};

const updatePost = async data => {
  let formBody = [];
  for (let property in data.data) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(data.data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  try {
    const token = await AsyncStorage.getItem("userToken");
    const result = await fetchAPI('PUT',"media", data.file_id, token, formBody);
  } catch (e) {
    console.log("update post error", e);
  }
};

const isLiked = async file_id => {
  try {
    const arr = await fetchAPI("GET", "favourites/file", file_id);
    const userFromStorage = await AsyncStorage.getItem("user");
    const user = JSON.parse(userFromStorage);
    return arr.find(it => it.user_id === user.user_id);
  } catch (e) {
    console.log(e.message);
  }
};

const postFavourite = async file_id => {
  const token = await AsyncStorage.getItem("userToken");
  if ((await isLiked(file_id)) === undefined) {
    try {
      await fetchAPI('POST', 'favourites', undefined , token, { file_id: file_id });
    } catch (e) {
      console.log(e.message);
    }
  } else {
    try {
      await fetchAPI('DELETE',"favourites/file", file_id, token);
    } catch (e) {
      console.log(e.message);
    }
  }
};

const getAllMedia = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchMedia = async () => {
    try {
      const json = await fetchAPI("GET", "tags/sloperTEST");
      const result = await Promise.all(
        json
          .reverse()
          .slice(0, 10)
          .map(async item => {
            const file = await fetchAPI("GET", "media", item.file_id);
            const favourites = await fetchAPI('GET', 'favourites/file', item.file_id);
            file.favCount = favourites.length
            console.log(file)
            return await file
          })
      );
      setData(result);
      setLoading(false);
    } catch (e) {
      console.log("getAllMedia error", e);
    }
  };
  useEffect(() => {
    fetchMedia();
  }, []);
  return [data, loading];
};

const getAllUserMedia = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchMedia = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const json = await fetchAPI((endpoint = "media/user"), (token = token));
      const result = await Promise.all(
        json.map(async item => {
          return await fetchAPI((endpoint = "media"), (params = item.file_id));
        })
      );
      setData(result);
      setLoading(false);
    } catch (e) {
      console.log("getAllUserMedia error", e.message);
    }
  };
  useEffect(() => {
    fetchMedia();
  }, []);
  return [data, loading];
};

const uploadImage = async (data, tag) => {
  const token = await AsyncStorage.getItem("userToken");
  try {
    const response = await fetchAPI('POST', 'media', undefined, token, data, 'form')
    const fileid = {
      file_id: response.file_id,
      tag: tag
    };
    try {
      await fetchAPI('POST', "tags", undefined, token, fileid);
    } catch (e) {
      console.log("error in image tag", e.message);
    }
  } catch (e) {
    console.log("upload image error: ", e);
  }
};

export {
  getAllMedia,
  uploadImage,
  postFavourite,
  isLiked,
  getAllUserMedia,
  deletePost,
  updatePost,
  fetchAPI
};

/* END OF FILE */
