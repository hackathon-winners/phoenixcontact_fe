import React, { useState, useEffect } from "react";
// import styles from "./Presentation.module.scss";
import { Link } from "react-router-dom";

// Import Spectacle Core tags
import { Deck, Heading, Slide, CodePane } from "spectacle";
import createTheme from "spectacle/lib/themes/default";

export default function() {
  const [status, setStatus] = useState({});
  useEffect(() => {
    const timer = window.setInterval(() => {
      fetch("/status") // body data type must match "Content-Type" header)
        .then(response => response.json())
        .catch(error => console.error("Error:", error))
        .then(response => {
          console.log(response);
          setStatus(response);
        });
    }, 2000);
    return () => {
      // Return callback to run on unmount.
      window.clearInterval(timer);
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
        <Link to="/">zur Kamera</Link>
      </Slide>
      <Slide>
        <Heading size={1} fit caps lineHeight={1} textColor="secondary">
          Demo
        </Heading>
        {status && status.status && <p>Waiting for Visual Inspection Task</p>}
        {status && status.url && <img src={status.url} alt="demo" />}
        {status && status.PIXEL_SUMS && (
          <CodePane>{status.PIXEL_SUMS}</CodePane>
        )}
        {status}
      </Slide>
    </Deck>
  );
}
