import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// pages
import Kamera from "./pages/Kamera/Kamera";

// components

const App = () => (
  <Router>
    <Fragment>
      <Route path="/" exact component={Kamera} />
    </Fragment>
  </Router>
);

export default App;
