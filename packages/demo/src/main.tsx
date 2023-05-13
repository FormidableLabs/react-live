import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { DemoApp } from "./app";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>
);
