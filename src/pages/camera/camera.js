import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ImageBackground,
} from "react-native";

import { Camera } from "expo-camera";
//import * as FileSystem from 'expo-file-system';

import { useNavigation } from "@react-navigation/native";
//import Axios from "axios";

import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as fs from "expo-file-system";

export default function App() {
  const [imageUri, setImageUri] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [CameraRef, setCameraRef] = useState();

  const result = fs.createDownloadResumable("../../images/result");

  const navigation = useNavigation();

  async function imagePickerCall(req, res) {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        Alert("Nós precisamos dessa permissão.");
        return;
      }
    }
    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (data.cancelled) {
      return;
    }

    if (!data.uri) {
      return;
    }
    fs.uploadAsync("http://192.168.1.71:3333/image", data.uri, {
      headers: {
        "Content-Type": "image/jpg",
      },
      httpMethod: "POST",
    }).then(
      handleNavigateToResult()
    )
  }

  function handleNavigateToHome() {
    navigation.navigate("Home");
  }
  function handleNavigateToResult() {
    ö;
    navigation.navigate("Result");
  }

  function PreviewImage(imageUri) {
    return (
      <View style={styles.preview}>
        <ImageBackground
          style={styles.preview}
          source={{ uri: imageUri }}
        ></ImageBackground>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return imageUri ? (
    <ImageBackground
      style={styles.preview}
      source={{ uri: imageUri }}
    ></ImageBackground>
  ) : (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.2, backgroundColor: "black" }}>
        <TouchableOpacity
          style={
            Platform.OS === "ios"
              ? {
                  flex: 1,
                  alignItems: "center",
                  alignSelf: "flex",
                  top: "40%",
                }
              : {
                  flex: 1,
                  alignItems: "center",
                  top: "40%",
                  right: "40%",
                }
          }
          onPress={handleNavigateToHome}
        >
          <MaterialCommunityIcons name="arrow-left" size={45} color="white" />
        </TouchableOpacity>
      </View>
      <Camera
        style={styles.cameradiv}
        type={type}
        ref={(ref) => setCameraRef(ref)}
        ratio="4:3"
      ></Camera>
      <View
        style={{
          flex: 0.3,
          alignItems: "center",
          backgroundColor: "black",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={
            Platform.OS === "ios"
              ? {
                  flex: 0.2,
                  alignSelf: "flex-end",
                  alignItems: "center",
                }
              : {
                  flex: 0.2,
                  top: "-1%",
                  alignItems: "center",
                }
          }
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <MaterialCommunityIcons
            name="camera-retake"
            size={50}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={
            Platform.OS === "ios"
              ? {
                  flex: 0.2,
                  alignSelf: "flex-end",
                  alignItems: "center",
                  bottom: "-1%",
                  left: "24%",
                }
              : {
                  flex: 0.2,
                  alignItems: "center",
                  bottom: "-1%",
                  top: "-1%",
                  left: "58%",
                }
          }
          onPress={async (req, res) => {
            if (CameraRef) {
              let photo = await CameraRef.takePictureAsync();
              const imageUri = photo.uri;
              fs.uploadAsync("http://192.168.1.71:3333/image", photo.uri, {
                headers: {
                  "Content-Type": "image/jpg",
                },
                httpMethod: "POST",
              }).then(req.pipe(result), handleNavigateToResult());
            }
          }}
        >
          <MaterialCommunityIcons name="camera" size={50} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={
            Platform.OS === "ios"
              ? {
                  flex: 0.2,
                  alignSelf: "flex-end",
                  alignItems: "center",
                  bottom: "0%",
                  left: "44%",
                }
              : {
                  alignContent: "flex-end",
                  alignItems: "center",
                  top: "-1%",
                  left: "120%",
                  right: "50%",
                }
          }
          onPress={imagePickerCall}
        >
          <Entypo name="images" size={50} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footcam: {
    flexDirection: "row",
  },
  preview: {
    flex: 1,
  },
  cameradiv: {
    flex: 1,
  },
});
