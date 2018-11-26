import React, { Fragment, useState, useRef, useEffect } from "react";
import styles from "./Kamera.module.scss";
import { Link } from "react-router-dom";
import fallbackImage from "./default.jpg";

console.log(fallbackImage);

export default function() {
  const [source, setSource] = useState(undefined);

  const sendToServer = dataUrl => {
    var byteString;
    if (dataUrl.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataUrl.split(",")[1]);
    else byteString = unescape(dataUrl.split(",")[1]);
    // separate out the mime component
    var mimeString = dataUrl
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const file = new Blob([ia], { type: mimeString });

    const formData = new FormData();
    formData.append("foto", file);

    fetch("/image", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors",
      body: formData
    }) // body data type must match "Content-Type" header)
      .then(response => response.json())
      .then(response => {
        setSource(response.url);
      })
      .catch(error => {
        // fallback solution for connectivity issues during presentation
        setTimeout(() => {
          setSource(fallbackImage);
          fetch("/setfallback").then(response => response.json());
        }, 2000);
      });
  };

  // video handling
  const videoEl = useRef();
  const constraints = {
    video: true
  };

  useEffect(
    () => {
      if (videoEl.current) {
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
          videoEl.current.srcObject = stream;
          canvasEl.current.width = videoEl.current.width;
          canvasEl.current.height = videoEl.current.height;
        });
      }
    },
    [videoEl.current]
  );

  // get context
  const canvasEl = useRef(null);
  const [context, setContext] = useState(null);
  useEffect(
    () => {
      if (canvasEl.current) {
        setContext(canvasEl.current.getContext("2d"));
      }
    },
    [canvasEl.current]
  );

  // make a foto
  const click = () => {
    context.drawImage(
      videoEl.current,
      0,
      0,
      canvasEl.current.width,
      canvasEl.current.height
    );
    if (source) {
      setSource(null);
    } else {
      setSource(true);
      sendToServer(canvasEl.current.toDataURL());
    }
  };
  return (
    <Fragment>
      <div className={styles.container}>
        <video
          ref={videoEl}
          controls
          autoPlay
          className={source ? styles.hide : ""}
        />
        <canvas ref={canvasEl} className={!source ? styles.hide : ""} />
        <button onClick={click} className={styles.button}>
          {!source ? "Capture" : "try again"}
        </button>
      </div>
    </Fragment>
  );
}
