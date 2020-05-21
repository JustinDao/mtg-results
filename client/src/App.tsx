import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Home } from "./views/Home";
import { Modern } from "./views/Modern";
import { Scraper } from "./views/Scraper";
import Layout from "./layout/Layout";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";

function App() {
  return (
    <>
      <CssBaseline />
      <Layout>
        <Router>
          <div>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/modern">
              <Modern />
            </Route>
            <Route path="/scraper">
              <Scraper />
            </Route>
          </div>
        </Router>
      </Layout>
    </>
  );
}

export default App;
