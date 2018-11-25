import React from "react";
import styles from "./Kamera.module.scss";
import { Link } from "react-router-dom";

export default function() {
  return (
    <div className={styles.container}>
      <Link to="/presentation">zur Presentation</Link>
      Kamera
    </div>
  );
}
