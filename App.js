import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { getStoragePermissions } from "./src/utils/camera";

export default function App() {
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const video = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === "granted");
    })();
  }, []);

  const takeVideo = async () => {
    if (camera) {
      const data = await camera.recordAsync({ maxDuration: 10 }); // function to record video
      setRecord(data.uri); // note the uri data is here
      console.log(data.uri);
    }
  };

  const stopVideo = async () => {
    if (camera) {
      camera.stopRecording(); // function to stop recording
    }
  };

  const clearVideo = () => {
    setRecord(null);
  };

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const saveRecordVideoToDevice = async () => {
    if (record) {
      const status = await getStoragePermissions();
      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(record); // does record have to be a file path?
        await MediaLibrary.createAlbumAsync("Recordings", asset, false);
      } else {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => {
          setCamera(ref);
        }}
      >
        <View style={styles.buttonContainer}>
          <Text
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            Flip
          </Text>
          <Text style={styles.button} onPress={takeVideo}>
            Record
          </Text>
          <Text style={styles.button} onPress={stopVideo}>
            Stop
          </Text>
          <Text style={styles.button} onPress={clearVideo}>
            Clear
          </Text>
          <Text style={styles.button} onPress={saveRecordVideoToDevice}>
            Save to Local
          </Text>
        </View>
      </Camera>
      {record && (
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: record,
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 8,
    borderRadius: 10,
    padding: 16,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  video: {
    width: 300,
    height: 300,
  },
});
