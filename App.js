'use strict';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, CameraRoll, Alert, PermissionsAndroid, FlatList  } from 'react-native';
import { RNCamera } from 'react-native-camera';
// import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
import RNVideoEditor from 'react-native-video-editor';
import Video from 'react-native-video';
// import VideoPreview from 'react-native-video-preview';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      recording: false,
      balance: RNCamera.Constants.WhiteBalance.sunny,
      modes: [{"mode":"Sunny"},{"mode":"Cloudy"}, {"mode":"Shadow"}, {"mode":"Incandescent"}, {"mode":"Fluorescent"}, {"mode":"Auto"}],
      preview: false,
      filter_modes: [{"mode":"NONE"},{"mode":"INVERT"}, {"mode":"MONOCHROME"}, {"mode":"POSTERIZE"}, {"mode":"FALSE"}, 
                     {"mode":"MAXIMUMCOMPONENT"}, {"mode":"MINIMUMCOMPONENT"},{"mode":"CHROME"}, {"mode":"FADE"}, {"mode":"INSTANT"}, {"mode":"MONO"}, {"mode":"NOIR"},
                     {"mode":"PROCESS"}, {"mode":"TONAL"}, {"mode":"TRANSFER"}, {"mode":"SEPIA"} ],
      m_filter: "",
      timer: -1,
      recording_mode: 0,  //0: start/stop recording, 1: hold mode, 2: delay mode
      color:"#3430641f",
      video: "",
      isfirst: 0,
    }
  }

  setCameraMode(mode){
    if(mode === "Sunny"){
      this.setState({
        balance: RNCamera.Constants.WhiteBalance.sunny
      })
    }
    if(mode === "Cloudy"){
      this.setState({
        balance: RNCamera.Constants.WhiteBalance.cloudy
      })
    }
    if(mode === "Shadow"){
      this.setState({
        balance: RNCamera.Constants.WhiteBalance.shadow
      })
    }
    if(mode === "Incandescent"){
      this.setState({
        balance: RNCamera.Constants.WhiteBalance.incandescent
      })
    }
    if(mode === "Fluorescent"){
      this.setState({
        balance: RNCamera.Constants.WhiteBalance.fluorescent
      })
    }
    if(mode === "Auto"){
      this.setState({
        balance: RNCamera.Constants.WhiteBalance.auto
      })
    }
  }

  setFilter(mode){
    if(Platform.OS === 'android'){
      if(mode === "NONE"){
        this.setState({
          m_filter: "",
          color:"#3430641f",
        })
      }
      if(mode === "INVERT"){
        this.setState({
          m_filter: "CIColorInvert",
          color:"#3430642f",
        })
      }
      if(mode === "MONOCHROME"){
        this.setState({
          m_filter: "CIColorMonochrome",
          color:"#3430643f",
        })
      }
      if(mode === "FALSE"){
        this.setState({
          m_filter: "CIFalseColor",
          color:"#3430644f",
        })
      }
      if(mode === "MAXIMUMCOMPONENT"){
        this.setState({
          m_filter: "CIMaximumComponent",
          color:"#3430645f",
        })
      }
      if(mode === "MINIMUMCOMPONENT"){
        this.setState({
          m_filter: "CIMinimumComponent",
          color:"#3430641f",
        })
      }
      if(mode === "CHROME"){
        this.setState({
          m_filter: "CIPhotoEffectChrome",
          color:"#3430641f",
        })
      }
      if(mode === "FADE"){
        this.setState({
          m_filter: "CIPhotoEffectFade",
          color:"#3430641f",
        })
      }
      if(mode === "MONO"){
        this.setState({
          m_filter: "CIPhotoEffectMono",
          color:"#3430641f",
        })
      }
      if(mode === "NOIR"){
        this.setState({
          m_filter: "CIPhotoEffectNoir",
          color:"#3430641f",
        })
      }
      if(mode === "PROCESS"){
        this.setState({
          m_filter: "CIPhotoEffectProcess",
          color:"#3430641f",
        })
      }
      if(mode === "TONAL"){
        this.setState({
          m_filter: "CIPhotoEffectTonal",
          color:"#3430641f",
        })
      }
      if(mode === "TRANSFER"){
        this.setState({
          m_filter: "CIPhotoEffectTransfer",
          color:"#3430641f",
        })
      }
      if(mode === "SEPIA"){
        this.setState({
          m_filter: "CISepiaTone",
          color:"#3430641f",
        })
      }
    } else {
      if(mode === "NONE"){
        this.setState({
          m_filter: FilterType.NONE
        })
      }
      if(mode === "INVERT"){
        this.setState({
          m_filter: FilterType.INVERT
        })
      }
      if(mode === "MONOCHROME"){
        this.setState({
          m_filter: FilterType.MONOCHROME
        })
      }
      if(mode === "FALSE"){
        this.setState({
          m_filter: FilterType.FALSE
        })
      }
      if(mode === "MAXIMUMCOMPONENT"){
        this.setState({
          m_filter: FilterType.MAXIMUMCOMPONENT
        })
      }
      if(mode === "MINIMUMCOMPONENT"){
        this.setState({
          m_filter: FilterType.MINIMUMCOMPONENT
        })
      }
      if(mode === "CHROME"){
        this.setState({
          m_filter: FilterType.CHROME
        })
      }
      if(mode === "FADE"){
        this.setState({
          m_filter: FilterType.FADE
        })
      }
      if(mode === "MONO"){
        this.setState({
          m_filter: FilterType.MONO
        })
      }
      if(mode === "NOIR"){
        this.setState({
          m_filter: FilterType.NOIR
        })
      }
      if(mode === "PROCESS"){
        this.setState({
          m_filter: FilterType.PROCESS
        })
      }
      if(mode === "TONAL"){
        this.setState({
          m_filter: FilterType.TONAL
        })
      }
      if(mode === "TRANSFER"){
        this.setState({
          m_filter: FilterType.TRANSFER
        })
      }
      if(mode === "SEPIA"){
        this.setState({
          m_filter: FilterType.SEPIA
        })
      }
    }
  }

  render() {
    const { pause, recording, balance, modes, preview, filter_modes, m_filter, timer, recording_mode } = this.state;

    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          whiteBalance={balance}
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <PendingView />;
            if(preview){
              // <VideoPreview
              //   source={{ uri: this.state.video }} // Can be a URL or a local file.
              //   style={styles.preview}
              //   resizeMode="contain" />
              return (
                <View style={styles.backgroundVideo}>
                  <Video source={{uri: this.state.video}}   // Can be a URL or a local file.
                    ref={(ref) => {
                      this.player = ref
                    }}                                      // Store reference
                    onBuffer={this.onBuffer}                // Callback when remote video is buffering
                    onError={this.videoError}               // Callback when video cannot be loaded
                    controls={true}
                    fullscreen={true}
                    filterEnabled={true}
                    filter={m_filter}
                    repeat={true}
                    style={styles.backgroundVideo} />
                  {/* <View style={{position: "absolute",zindex:999, top: 0, left: 0 ,width: 200, height: 1000, backgroundColor: {color} }}/> */}
                  <TouchableOpacity style={styles.backgroundVideo}/>
                  {/* <FlatList
                    data={filter_modes}
                    horizontal={true}
                    renderItem={
                      ({item}) =>
                      <TouchableOpacity onPress={() => this.setFilter(item.mode)} style={styles.selmode}>
                        <Text style={{ fontSize: 14 }}> {item.mode} </Text>
                      </TouchableOpacity>
                    }
                    keyExtractor={item => item.mode}
                  /> */}
                  <TouchableOpacity onPress={() => this.setState({preview: false})} style={styles.capture_back}>
                    <Text style={{ fontSize: 14 }}> Back </Text>
                  </TouchableOpacity>
                  </View>
              )
            } else {
              if(recording&&(recording_mode!==1)) return (
                <View style={{ flex: 0, flexDirection: 'column', justifyContent: 'center' }}>
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 14 }}> Recording Starts After {this.state.timer} Seconds... </Text>
                    </View>
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.pauseRecord(camera)} style={styles.capture}>
                      <Text style={{ fontSize: 14 }}> Pause </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.stopRecord(camera)} style={styles.capture}>
                      <Text style={{ fontSize: 14 }}> Stop </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
              );
              if(pause) return (
                <View style={{ flex: 0, flexDirection: 'column', justifyContent: 'center' }}>
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.startRecord(camera)} style={styles.capture}>
                      <Text style={{ fontSize: 14 }}> Resume </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
              if((!pause && !recording)||(recording_mode==1)) return (
                <View style={{ flex: 0, flexDirection: 'column', justifyContent: 'center' }}>
                  {(recording_mode==0)&&<FlatList
                    data={modes}
                    horizontal={true}
                    renderItem={
                      ({item}) =>
                      <TouchableOpacity onPress={() => this.setCameraMode(item.mode)} style={styles.selmode}>
                        <Text style={{ fontSize: 14 }}> {item.mode} </Text>
                      </TouchableOpacity>
                    }
                    keyExtractor={item => item.mode}
                  />}
                  
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.startRecord(camera)} style={styles.capture}>
                      <Text style={{ fontSize: 14 }}> Start </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onLongPress={() => this.startHoldRecord(camera)} onPressOut={() => this.stopRecord(camera)} style={styles.capture}>
                      <Text style={{ fontSize: 14 }}> Hold Mode </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.startDelayRecord(camera)} style={styles.capture}>
                      <Text style={{ fontSize: 14 }}> Delay Mode </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
          }}
        </RNCamera>
      </View>
    );
  }

  startRecord = async function(camera) {
    const options = { quality: 0.5, base64: true, maxDuration: 60 };
    // const data = await camera.takePictureAsync(options);
    this.setState({recording: true});
    if(!this.state.pause){
      this.setState({
        isfirst: this.state.isfirst + 1,
      })
    }
    const data = await camera.recordAsync(options)
    .then((res) => {
      console.log(res.uri);
      if(this.state.recording && !this.state.pause){
        Alert.alert("you can record up to 60 secs...");
        CameraRoll.saveToCameraRoll(res.uri).then(console.log('Success', 'Saved to camera roll!'));
        this.setState({
          pause: false,
          recording: false,
          video: res.uri,
          isfirst: 0,
          preview: true,
        });
      }
      if(this.state.pause&& (!this.state.recording)){
        // RNFFmpeg.executeWithArguments(["-i", this.state.video, "-c:v", "mpeg4", res.uri]).then(result => console.log("FFmpeg process exited with rc " + result.rc ));
        // RNVideoEditor.merge([this.state.video, res.uri])
        // .then((err)=>{
        //   Alert.alert('Error: ' + err);
        // })
        // .then((results, file)=>{
        //   Alert.alert('Success : ' + results + " file: " + file);
        // });
        // this.setState({
        //   video: res.uri,
        // });
        if(this.state.isfirst <= 2){
          this.setState({
            video: res.uri,
          });
          console.log('Paused!!!');
        } else {
          RNVideoEditor.merge(
            [this.state.video, res.uri],
            (results) => {
              console.log('Error: ' + results);
            },
            (results, file) => {
              console.log('Success : ' + results + " file: " + file);
              this.setState({
                video: file,
              });
            }
          );
        }        
      }else if(!this.state.pause){
        console.log("really stopped??");
        this.setState({recording: false});
        let requestExternalStoragePermission = async () => {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'My App Storage Permission',
                message: 'My App needs access to your storage ' +
                  'so you can save your photos',
              },
            );
            if(granted)
            {
              if(this.state.isfirst > 1)
              {
                this.setState({isfirst: 0});
                RNVideoEditor.merge(
                  [this.state.video, res.uri],
                  (results) => {
                    console.log('Error: ' + results);
                  },
                  (results, file) => {
                    console.log('Success : ' + results + " file: " + file);
                    CameraRoll.saveToCameraRoll(file).then(console.log('Success', 'Saved to camera roll!', file));
                    this.setState({
                      video: file,
                      preview: true,
                    });
                  }
                );
              }else {
                CameraRoll.saveToCameraRoll(res.uri).then(console.log('Success', 'Saved to camera roll!', res.uri));
                this.setState({isfirst: 0});
                this.setState({
                  video: res.uri,
                  preview: true,
                });
              }        
            } 
            else
            console.log('Failed', 'Access Denied!')
            return granted;
          } catch (err) {
            console.log('Failed', err);
            return null;
          }
        };
        requestExternalStoragePermission();
      }
    });
    // if(this.state.pause){
    //   this.setState({
    //     video: data,
    //   });
    // }else{
    //   this.setState({recording: false});
    //   CameraRoll.saveToCameraRoll(data.uri).then(Alert.alert('Success', 'Saved to camera roll!'));
    // }
    //  eslint-disable-next-line
    // console.log(data.uri);
  };

  pauseRecord = async function(camera) {
    // const data = await camera.takePictureAsync(options);
    // const data = await camera.recordAsync();
    // //  eslint-disable-next-line
    // console.log(data.uri);
    const data = camera.stopRecording();
    this.setState(
      {
        pause: true,
        recording: false,
        isfirst: this.state.isfirst + 1,
      }
    );
    console.log("pause is not working for now...");
  };

  stopRecord = async function(camera) {
    // const data = await camera.takePictureAsync(options);
    const data = camera.stopRecording();
    this.setState({recording_mode: 0, timer: -1});
    this.setState({pause: false});
    this.setState({recording: false});
    console.log("it's stopped...");
    
    clearInterval(this.interval);
    //  eslint-disable-next-line
  };

  startHoldRecord(camera){
    const options = { quality: 0.5, base64: true, maxDuration: 60 };
    this.setState({recording_mode: 1});
    this.startRecord(camera);
  }

  startDelayRecord(camera){
    const options = { quality: 0.5, base64: true, maxDuration: 60 };
    this.setState({recording_mode: 2, timer: 5});
    this.interval = setInterval(
      () => {
        this.setState({timer: this.state.timer - 1})
        if(this.state.timer == 0){
          this.startRecord(camera);
        }
      },
      1000
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  selmode: {
    flex: 0,
    backgroundColor: '#008CBA',
    color: "white",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 15,
  },
  capture: {
    flex: 0,
    backgroundColor: '#4CAF50',
    color: "white",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 10,
  },
  capture_back: {
    flex: 0,
    backgroundColor: '#4CAF50',
    color: "white",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 30,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  flatlist: {
    display: 'flex',
  }
});
