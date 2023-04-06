import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lastRecording, setLastRecording] = useState(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
  }, []);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
      setLastRecording(null);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      setRecording(null);
      setIsRecording(false);
      setLastRecording(uri);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playSound = async () => {
    try {
      await sound.playAsync();
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to play sound', err);
    }
  };

  const pauseSound = async () => {
    try {
      await sound.pauseAsync();
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to pause sound', err);
    }
  };

  const stopSound = async () => {
    try {
      await sound.stopAsync();
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to stop sound', err);
    }
  };

  const restartSound = async () => {
    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to restart sound', err);
    }
  };

  const toggleMute = async () => {
    try {
      await sound.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    } catch (err) {
      console.error('Failed to toggle mute', err);
    }
  };

  const clearRecording = () => {
    setLastRecording(null);
    setSound(null);
  };

  const playLastRecording = async () => {
    try {
      if (lastRecording) {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: lastRecording });
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Failed to play last recording', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.username}>
              FOL username: y_shah142873
        </Text>
        <Text style={styles.title}>
              Lab 6 - Audio App
        </Text>
      </View>
      {isRecording ? (
        <View style={styles.recordingContainer}>
        <Text style={styles.recordingText}>Recording...</Text>
        <TouchableOpacity style={styles.button} onPress={stopRecording}>
          <Text style={styles.buttonText}>Stop Recording</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startRecording}>
          <Text style={styles.buttonText}>Record</Text>
        </TouchableOpacity>
        {sound ? (
          <View>
            <TouchableOpacity style={styles.button} onPress={playLastRecording}>
              <Text style={styles.buttonText}>Play Last Recording</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={isPlaying ? pauseSound : playSound}>
             <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={stopSound}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={restartSound}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleMute}>
              <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={clearRecording}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    )}
  </View>
  );
  }
  
  const styles = StyleSheet.create({

  title:{
    fontSize: 20,
    paddingLeft: 90,
  },

  username: {
    marginTop: 0,
    fontSize: 25,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#3d3d3d',
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  recordingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingText: {
    fontSize: 20,
  },
  });