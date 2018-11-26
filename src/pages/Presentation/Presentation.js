import React, { useState, useEffect } from "react";
// import styles from "./Presentation.module.scss";
import { Link } from "react-router-dom";

// Import Spectacle Core tags
import { Deck, Heading, Slide } from "spectacle";
import createTheme from "spectacle/lib/themes/default";

export default function() {
  const [message, setMessage] = useState("waiting");
  useEffect(() => {
    const ws = new WebSocket(
      `ws://${window.location.hostname}:${window.location.port}/echo`
    );
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

  const theme = createTheme(
    {
      primary: "white",
      secondary: "#1F2022",
      tertiary: "#03A9FC",
      quaternary: "#CECECE"
    },
    {
      primary: "Montserrat",
      secondary: "Helvetica"
    }
  );

  return (
    <Deck transition={["zoom", "slide"]} transitionDuration={500} theme={theme}>
      <Slide transition={["zoom"]} bgColor="primary">
        <Heading size={1} fit caps lineHeight={1} textColor="secondary">
          AI on Automation Infrastructure
        </Heading>
      </Slide>
      <Slide transition={["zoom"]} bgColor="primary">
        <Link to="/">zur Kamera {message}</Link>
      </Slide>
    </Deck>
  );
}
