import React, { useEffect, useRef } from "react";

const VideoContainer = ({ currentCall, socket, endCall }) => {
  const myVideoRef = useRef();
  const userVideoRef = useRef();

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        myVideoRef.current.srcObject = stream;

        // Listen to incoming video stream (use socket to get it)
        socket.current.on("receive-video", (stream) => {
          userVideoRef.current.srcObject = stream;
        });
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getUserMedia();

    return () => {
      // Clean up when the component is unmounted
      if (myVideoRef.current && myVideoRef.current.srcObject) {
        let stream = myVideoRef.current.srcObject;
        let tracks = stream.getTracks();

        tracks.forEach((track) => track.stop());
      }
    };
  }, [socket]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
      <div>
        <h3>Your Video</h3>
        <video
          ref={myVideoRef}
          autoPlay
          muted
          style={{ width: "300px", borderRadius: "10px" }}
        />
      </div>
      <div>
        <h3>Partner's Video</h3>
        <video
          ref={userVideoRef}
          autoPlay
          style={{ width: "300px", borderRadius: "10px" }}
        />
      </div>

      <button onClick={endCall} style={{ marginTop: "20px", backgroundColor: "#dc3545", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px" }}>
        End Call
      </button>
    </div>
  );
};

export default VideoContainer;
