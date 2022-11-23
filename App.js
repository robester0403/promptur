import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";

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

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }

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

//In this example, we are using the Camera component from expo-camera to record a video. We are also using the Video component from expo-av to play the recorded video.

//The Camera component has a recordAsync function that records the video. The recordAsync function returns a promise that resolves to an object with a uri property. The uri property contains the URI of the recorded video.

//We are using the useState hook to store the URI of the recorded video. We are also using the useRef hook to store the reference of the Video component.

//We are using the useEffect hook to request the permissions for the camera and microphone. We are using the Camera.requestCameraPermissionsAsync and Camera.requestMicrophonePermissionsAsync functions to request the permissions.

//We are using the takeVideo function to record the video. We are using the stopVideo function to stop the recording.

//We are using the Video component to play the recorded video. We are using the source property to set the source of the video. We are using the uri property of the object returned by the recordAsync function to set the source of the video.

//We are using the onPlaybackStatusUpdate property to set the function that is called when the status of the video changes. We are using the setStatus function to set the status of the video.

//We are using the status object to get the status of the video. We are using the isLoaded property to check if the video is loaded. We are using the isPlaying property to check if the video is playing.

//We are using the useNativeControls property to set whether to use native controls or not. We are using the resizeMode property to set the resize mode of the video. We are using the isLooping property to set whether to loop the video or not.

//We are using the Text component to display the buttons to record and stop the video. We are using the onPress property to set the function that is called when the button is pressed.

//We are using the StyleSheet.create function to create the styles object. We are using the flex property to set the flex property of the style. We are using the backgroundColor property to set the background color of the style. We are using the alignItems property to set the align items property of the style. We are using the justifyContent property to set the justify content property of the style.
