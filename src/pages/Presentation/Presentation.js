import React, { useState, useEffect } from "react";
import styles from "./Presentation.module.scss";
import { Link } from "react-router-dom";

export default function() {
  const [message, setMessage] = useState("waiting");
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000/echo");
    ws.onopen = () => {
      ws.send("socket open");
    };
    ws.onclose = evt => {
      setMessage("socket closed");
    };
    ws.onmessage = evt => {
      setMessage(evt.data);
    };
  }, []);
  return (
    <div className={styles.container}>
      <Link to="/">zur Kamera</Link>
      <br />
      {message}
    </div>
  );
}
