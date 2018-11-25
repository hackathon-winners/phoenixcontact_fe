import React from "react";
import styles from "./Presentation.module.scss";
import { Link } from "react-router-dom";

export default function() {
  return (
    <div className={styles.container}>
      <Link to="/">zur Kamera</Link>
      Presentation
    </div>
  );
}
