import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Audio, InterruptionModeAndroid, interruptionModeAndroid, InterruptionModeIOS, interruptionModeIOS } from "expo-av";
import { Feather } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import React, { Component } from "react";

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

export default class App extends Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    volume: 1.0,
    isBuffering: false,
  };

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      //interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      //interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.loadAudio();
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state;
    isPlaying
      ? await playbackInstance.pauseAsync()
      : await playbackInstance.playAsync();
    this.setState({
      isPlaying: !isPlaying,
    });
  };

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      isBuffering: status.isBuffering
    });
  }

  async loadAudio() {
    const playbackInstance = new Audio.Sound();
		const status = {
			shouldPlay: this.state.isPlaying,
			volume: this.state.volume,
    };
    playbackInstance
      .setOnPlaybackStatusUpdate(
        this.onPlaybackStatusUpdate
      );
    await playbackInstance.loadAsync(require("./music/ukulele.mp3"), status, false);
    this.setState({
      playbackInstance
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Aloha Music</Text>
        <Image source={require("./images/ukulele.png")} style={styles.image} />
        <View>
          <TouchableOpacity onPress={this.handlePlayPause}>
            {this.state.isPlaying ? (
              <Feather name="pause" size={32} color="#563822" />
            ) : (
              <Feather name="play" size={32} color="#563822" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4e3cf",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    width: 300,
    backgroundColor: "#da9547",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 500,
    margin: 40,
  },
});
