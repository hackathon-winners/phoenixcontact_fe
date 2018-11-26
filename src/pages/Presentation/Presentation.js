import React, { useState, useEffect } from "react";
// import styles from "./Presentation.module.scss";
import { Link } from "react-router-dom";

// Import Spectacle Core tags
import {
  Deck,
  Heading,
  Slide,
  CodePane,
  Layout,
  Text,
  Image,
  Fill
} from "spectacle";
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
        <Layout>
          {status && status.status && (
            <Fill>
              <Text>Waiting for Visual Inspection Task</Text>
            </Fill>
          )}
          {status && status.url && (
            <Fill>
              <Image src={status.url} alt="demo" />
            </Fill>
          )}
          {status && status.pixel_sums && (
            <Fill>
              <CodePane>{status.pixel_sums}</CodePane>
            </Fill>
          )}
        </Layout>
      </Slide>
    </Deck>
  );
}
