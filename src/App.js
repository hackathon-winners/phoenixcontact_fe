import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// pages
import Kamera from "./pages/Kamera/Kamera";
import Presentation from "./pages/Presentation/Presentation";

// components

const App = () => (
  <Router>
    <Fragment>
      <Route path="/" exact component={Kamera} />
      <Route path="/presentation" component={Presentation} />
    </Fragment>
  </Router>
);

export default App;
