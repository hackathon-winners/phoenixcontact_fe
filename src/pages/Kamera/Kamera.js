import React, { useState } from "react";
import styles from "./Kamera.module.scss";

import { GridLoader } from "react-spinners";

import fallbackImage from "./default.jpg";

export default function() {
  const [source, setSource] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const sendToServer = e => {
    setLoading(true);
    const formData = new FormData();
    const fileField = document.querySelector("input[type='file']");
    formData.append("foto", fileField.files[0]);

    fetch("/image", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors",
      body: formData
    }) // body data type must match "Content-Type" header)
      .then(response => response.json())
      .then(response => {
        setLoading(false);
        setSource(response.url);
      })
      .catch(error => {
        // fallback solution for connectivity issues during presentation
        setTimeout(() => {
          setLoading(false);
          setSource(fallbackImage);
          fetch("/setfallback").then(response => response.json());
        }, 2000);
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.button}>
        Capture
        <input type="file" accept="image/*" onChange={sendToServer} />
      </div>
      {!loading && !source && (
        <div className={styles.waiting}>Waiting for an Image</div>
      )}
      {loading && (
        <div className={styles.loading}>
          <GridLoader color={"#fff"} />
        </div>
      )}
      {source && <img src={source} alt="result" className={styles.image} />}
    </div>
  );
}
