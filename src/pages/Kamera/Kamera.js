import React, { useState } from "react";
import styles from "./Kamera.module.scss";
import { Link } from "react-router-dom";

import fallbackImage from "./default.jpg";

export default function() {
  const [source, setSource] = useState(undefined);

  const sendToServer = e => {
    var formData = new FormData();
    var fileField = document.querySelector("input[type='file']");
    formData.append("foto", fileField.files[0]);

    fetch("http://automation.hack:5000/image", {
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
  return (
    <div className={styles.container}>
      <input
        type="file"
        accept="image/*"
        onChange={sendToServer}
        className={styles.button}
      />
      {source && <img src={source} alt="result" className={styles.image} />}
      <Link to="presentation">Presentation</Link>
    </div>
  );
}
