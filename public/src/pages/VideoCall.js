// src/components/VideoCall/VideoCall.js
import React, { useEffect, useRef, useState } from "react";

const VideoCall = ({ callerId, calleeId }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // Clean up when the component unmounts
    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [peerConnection]);

  // Start a video call using API
  const startCall = async () => {
    const pc = createPeerConnection();
    setPeerConnection(pc);

    // Create an offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send offer to backend API
    const response = await fetch("http://localhost:5000/api/videocall/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offer: offer,
        calleeId: calleeId,
        callerId: callerId,
      }),
    });

    if (response.ok) {
      setIsCalling(true);
    }
  };

  // Accept the incoming call using API
  const acceptCall = async () => {
    const pc = createPeerConnection();
    setPeerConnection(pc);

    // Create an answer
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // Send answer to backend API
    const response = await fetch("/api/video-call/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer: answer,
        callerId: callerId,
        calleeId: calleeId,
      }),
    });

    if (response.ok) {
      setIsReceiving(false);
    }
  };

  // Reject the call
  const rejectCall = () => {
    fetch("/api/video-call/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callerId: callerId,
        calleeId: calleeId,
      }),
    });

    setIsReceiving(false);
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendIceCandidate(event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStream(event.streams[0]);
      }
    };

    // Add local stream to the peer connection
    if (localVideoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
          });
        })
        .catch((err) => console.log(err));
    }

    return pc;
  };

  const sendIceCandidate = async (candidate) => {
    const response = await fetch("/api/video-call/ice-candidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        candidate: candidate,
        calleeId: calleeId,
        callerId: callerId,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send ICE candidate.");
    }
  };

  return (
    <div>
      <div>
        {isCalling && <h3>Calling...</h3>}
        {isReceiving && (
          <div>
            <h3>Incoming Call</h3>
            <button onClick={acceptCall}>Accept</button>
            <button onClick={rejectCall}>Reject</button>
          </div>
        )}
      </div>
      <div>
        <video ref={localVideoRef} autoPlay muted />
        {remoteStream && <video ref={remoteVideoRef} autoPlay />}
      </div>
      <div>
        {!isCalling && !isReceiving && (
          <button onClick={startCall}>Start Video Call</button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
