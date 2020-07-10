import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet,Alert, Platform} from 'react-native';
import { Camera } from 'expo-camera';

import { useNavigation } from '@react-navigation/native';
import Axios from "axios";

import { MaterialCommunityIcons,Entypo } from '@expo/vector-icons';

import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [imageUri, setImageUri] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [CameraRef, setCameraRef] = useState();
  
  const navigation = useNavigation();
  
  async function imagePickerCall() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        Alert("Nós precisamos dessa permissão.");
        return;
      }
    }
    const data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All
    });
    
    if (data.cancelled) {
      return;
    }
    
    if (!data.uri) {
      return;
    }
  }
  
  function handleNavigateToHome(){
    navigation.navigate('Home');
  }
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    imageUri ?
    <ImageBackground style={styles.preview} source={{ uri: imageUri }}>
    </ImageBackground>
    :
    <View style={{ flex: 1 }}>
      <Camera style={styles.cameradiv} type={type} ref={ref => setCameraRef(ref)}>
          <TouchableOpacity style={ Platform.OS === 'ios' ? { 
              flex:1,
              alignItems:"center",
              alignSelf:'flex',
              top:'3%',
            }:
            { 
              flex:1,
              alignItems:"center",
              top:'3%',
              right:'40%',
            }
            
          } 
          onPress={handleNavigateToHome}>
              <MaterialCommunityIcons name="arrow-left" size={45} color="white" />
          </TouchableOpacity>
          </Camera>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: 'black',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={ Platform.OS === 'ios' ? {
              flex: 0.2,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }
            :
            {
              flex: 0.2,
              top:'40%',
              alignItems: 'center',
            }
          
          }
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
              <MaterialCommunityIcons name="camera-retake" size={50} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={ Platform.OS === 'ios' ? {
            flex: 0.2,
            alignSelf: 'flex-end',
            alignItems: 'center',
            bottom:'-1%',
            left:'24%',         
          }
        : {
          flex: 0.2,
          alignItems: 'center',
          bottom:'-1%',
          top:'40%',
          left:'24%',         
        }
      } onPress={async() => {
            if(CameraRef){
              let photo = await CameraRef.takePictureAsync();
              console.log('photo', photo);
          //    setUpload(photo);
          //     const path = photo.uri.split('/');
          //     const name = path[path.length - 1];
          //     console.log(name)
          //     const data = new FormData();
          //     data.append("photo", {
          //       name: name,
          //       uri: photo.uri,
          //       });
          //       console.log(photo.uri)
          //     console.log(data)
          //     await Axios.post("http://localhost:3333/upload", data);
           }
        }}
          >
            <MaterialCommunityIcons name="camera" size={50} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={ Platform.OS === 'ios' ? {
            flex: 0.2,
            alignSelf: 'flex-end',
            alignItems: 'center',
            bottom:'0%',
            left:'44%',         
          }
          :
          {
            alignContent: 'flex-end',
            alignItems: 'center',
            top:'40%',
            left:'48%',         
          }
          
          } onPress={imagePickerCall}>
            <Entypo name="images" size={50} color="white" />
          </TouchableOpacity>    
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    footcam:{
      flexDirection:'row',
    },
    preview: {
      width: "100%",
      height: "100%",
      flex: 1,
    },
    cameradiv:{
      flex:1,
      width:'100%',
    },
  });
 