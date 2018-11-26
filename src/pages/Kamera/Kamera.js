import React from "react";
import styles from "./Kamera.module.scss";
import { Link } from "react-router-dom";

export default function() {
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
      .catch(error => console.error("Error:", error))
      .then(response => console.log("Success:", JSON.stringify(response)));
  };
  return (
    <div className={styles.container}>
      <Link to="/presentation">zur Presentation</Link>
      <input
        type="file"
        accept="image/*"
        onChange={sendToServer}
        capture="environment"
      />
      Kamera
    </div>
  );
}
