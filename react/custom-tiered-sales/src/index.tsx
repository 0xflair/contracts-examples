import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

import { FlairProvider } from "@flair-sdk/react";

import App from "./App";
import AppCustomTierSelector from "./App.custom-tier-selector";

ReactDOM.render(
  <React.StrictMode>
    <FlairProvider>
      {/* <App /> */}
      <AppCustomTierSelector />
    </FlairProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
