import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import './App.css';

function App() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const currentMediaStream = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentMediaStream.current = mediaStream;
          call.answer(mediaStream);
          call.on('stream', function (remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentMediaStream.current = mediaStream;
        const call = peerInstance.current.call(remotePeerId, mediaStream);
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  };

  return (
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <input type="text" value={remotePeerIdValue} onChange={(e) => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div>
        <video ref={currentUserVideoRef} autoPlay playsInline muted />
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
    </div>
  );
}

export default App;
