import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import "./styles/App.css";

const App = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
