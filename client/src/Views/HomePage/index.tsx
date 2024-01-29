import React, {useEffect, useState, useRef} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import TextInputContainer from '../../components/TextInputContainer';
import SocketIOClient from 'socket.io-client';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import CallEnd from '../../components/Buttons/CallEnd';
import CallAnswer from '../../components/Buttons/CallAnswer';
import MicOn from '../../components/Buttons/MicOn';
import MicOff from '../../components/Buttons/MicOff';
import VideoOn from '../../components/Buttons/VideoOn';
import VideoOff from '../../components/Buttons/VideoOff';
import CameraSwitch from '../../components/Buttons/CameraSwitch';
import IconContainer from '../../components/IconContainer';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../Redux/AuthReducer';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const index: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [type, setType] = useState<
    'JOIN' | 'INCOMING_CALL' | 'OUTGOING_CALL' | 'WEBRTC_ROOM'
  >('JOIN');
  const [callerId] = useState(user.id);
  const otherUserId = useRef<string | null>(null);

  const handleLogout = () => {
    dispatch(logout());
  };

  const socket = SocketIOClient('http://LOCAL_IP_ADDRESS:3500', {
    transports: ['websocket'],
    query: {
      callerId,
    },
  });

  const [localMicOn, setLocalMicOn] = useState(true);
  const [localWebcamOn, setLocalWebcamOn] = useState(true);

  const peerConnection = useRef<RTCPeerConnection>(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
        {
          urls: 'turn:your-turn-server.com',
          username: 'your-username',
          credential: 'your-password',
        },
      ],
    }),
  );

  let remoteRTCMessage = useRef<RTCSessionDescription | null>(null);

  useEffect(() => {
    socket.on('newCall', data => {
      remoteRTCMessage.current = data.rtcMessage;
      otherUserId.current = data.callerId;
      setType('INCOMING_CALL');
    });

    socket.on('callAnswered', data => {
      remoteRTCMessage.current = data.rtcMessage;
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current),
      );
      setType('WEBRTC_ROOM');
    });

    socket.on('ICEcandidate', data => {
      let message = data.rtcMessage;

      if (peerConnection.current) {
        peerConnection.current
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            }),
          )
          .then(res => {
            console.log('ICE candidate added successfully', res);
          })
          .catch(err => {
            console.log('Error adding ICE candidate:', err);
          });
      }
    });

    let isFront = false;

    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind === 'videoinput' &&
          sourceInfo.facing === (isFront ? 'user' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      peerConnection.current.ontrack = event => {
        console.log(event);
        if (event.streams && event.streams.length > 0) {
          console.log('Streams:', event.streams);
          console.log('First stream:', event.streams[0]);
          setRemoteStream(event.streams[0]);
        } else if (event.track) {
          const newStream = new MediaStream();
          newStream.addTrack(event.track);
          console.log('Created new stream from track:', newStream);
          setRemoteStream(newStream);
        } else {
          console.log('No streams or tracks in the event:', event);
        }
      };

      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500,
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then(stream => {
          setLocalStream(stream);
          stream.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, stream);
          });
        })
        .catch(error => {
          console.log('Error getting user media:', error);
        });
    });

    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        sendICEcandidate({
          calleeId: otherUserId.current,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      } else {
        console.log('End of candidates.');
      }
    };

    return () => {
      socket.off('newCall');
      socket.off('callAnswered');
      socket.off('ICEcandidate');
    };
  }, []);

  function sendICEcandidate(data: {
    calleeId: string;
    rtcMessage: RTCIceCandidate;
  }): void {
    socket.emit('ICEcandidate', data);
  }

  async function processCall(): Promise<void> {
    const localStream = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStream
      .getTracks()
      .forEach(track => peerConnection.current.addTrack(track, localStream));

    const sessionDescription = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(sessionDescription);

    sendCall({
      calleeId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  async function processAccept(): Promise<void> {
    try {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current),
      );

      const localStream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream
        .getTracks()
        .forEach(track => peerConnection.current.addTrack(track, localStream));

      const sessionDescription = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(sessionDescription);

      answerCall({
        callerId: otherUserId.current,
        rtcMessage: sessionDescription,
      });
    } catch (error) {
      console.error('Error in processAccept:', error);
    }
  }

  function answerCall(data: {
    callerId: string;
    rtcMessage: RTCSessionDescription;
  }): void {
    socket.emit('answerCall', data);
  }

  function sendCall(data: {
    calleeId: string;
    rtcMessage: RTCSessionDescription;
  }): void {
    socket.emit('call', data);
  }

  const Lobby: React.FC = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: '#050A0E',
          paddingHorizontal: 10,
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View
              style={{
                padding: 20,
                backgroundColor: '#1A1C22',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 14,
                marginTop: 10,
                flexDirection: 'row',
                paddingLeft: 30,
              }}>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: '#D0D4DD',
                    fontWeight: 'bold',
                    marginBottom: 5,
                  }}>
                  Hi {user.username}
                </Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#D0D4DD',
                    }}>
                    Your Caller ID
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 12,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 22,
                        color: '#ffff',
                        letterSpacing: 6,
                      }}>
                      {callerId}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                  }}
                  onPress={() => {
                    handleLogout();
                  }}>
                  <FAIcon
                    name="power-off"
                    size={35}
                    color="white"
                    style={{
                      justifyContent: 'flex-start',
                      alignContent: 'center',
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#1A1C22',
                padding: 40,
                marginTop: 25,
                justifyContent: 'center',
                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#D0D4DD',
                }}>
                Enter the Caller ID of the person you want to call
              </Text>
              <TextInputContainer
                placeholder={'Enter Caller ID'}
                value={otherUserId.current}
                setValue={text => {
                  otherUserId.current = text;
                  console.log('TEST', otherUserId.current);
                }}
                keyboardType={'number-pad'}
              />
              <TouchableOpacity
                onPress={() => {
                  setType('OUTGOING_CALL');
                  processCall();
                }}
                style={{
                  height: 50,
                  backgroundColor: '#01a9f4',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  marginTop: 16,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                  }}>
                  Call
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };

  const Outgoing: React.FC = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          backgroundColor: '#050A0E',
        }}>
        <View
          style={{
            padding: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#D0D4DD',
            }}>
            Calling to...
          </Text>

          <Text
            style={{
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
              letterSpacing: 6,
            }}>
            {otherUserId.current}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setType('JOIN');
              otherUserId.current = null;
            }}
            style={{
              backgroundColor: '#FF5D5D',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallEnd width={50} height={12} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Incoming: React.FC = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          backgroundColor: '#050A0E',
        }}>
        <View
          style={{
            padding: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
            }}>
            {otherUserId.current} is calling..
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              processAccept();
              setType('WEBRTC_ROOM');
            }}
            style={{
              backgroundColor: 'green',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallAnswer height={28} fill={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  function switchCamera(): void {
    localStream?.getVideoTracks().forEach(track => {
      (track as any)._switchCamera();
    });
  }

  function toggleCamera(): void {
    setLocalWebcamOn(!localWebcamOn);
    localStream?.getVideoTracks().forEach(track => {
      localWebcamOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function toggleMic(): void {
    setLocalMicOn(!localMicOn);
    localStream?.getAudioTracks().forEach(track => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function leave(): void {
    peerConnection.current.close();
    setLocalStream(null);
    setType('JOIN');
  }

  const _Room = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#050A0E',
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}>
        {localStream ? (
          <RTCView
            objectFit={'cover'}
            style={{flex: 1, backgroundColor: '#050A0E'}}
            streamURL={localStream.toURL()}
          />
        ) : null}
        {remoteStream ? (
          <RTCView
            objectFit={'cover'}
            style={{
              flex: 1,
              backgroundColor: '#050A0E',
              marginTop: 8,
            }}
            streamURL={remoteStream.toURL()}
          />
        ) : null}
        <View
          style={{
            marginVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <IconContainer
            backgroundColor={'red'}
            onPress={() => {
              leave();
            }}
            Icon={() => {
              return <CallEnd height={26} width={26} fill="#FFF" />;
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={!localMicOn ? '#fff' : 'transparent'}
            onPress={() => {
              toggleMic();
            }}
            Icon={() => {
              return localMicOn ? (
                <MicOn height={24} width={24} fill="#FFF" />
              ) : (
                <MicOff height={28} width={28} fill="#1D2939" />
              );
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
            onPress={() => {
              toggleCamera();
            }}
            Icon={() => {
              return localWebcamOn ? (
                <VideoOn height={24} width={24} fill="#FFF" />
              ) : (
                <VideoOff height={36} width={36} fill="#1D2939" />
              );
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={'transparent'}
            onPress={() => {
              switchCamera();
            }}
            Icon={() => {
              return <CameraSwitch height={24} width={24} fill="#FFF" />;
            }}
          />
        </View>
      </View>
    );
  };

  switch (type) {
    case 'JOIN':
      return Lobby();
    case 'INCOMING_CALL':
      return Incoming();
    case 'OUTGOING_CALL':
      return Outgoing();
    case 'WEBRTC_ROOM':
      return _Room();
    default:
      return null;
  }
};

export default index;
