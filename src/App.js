import React from "react";
import Form from "./components/Form";
import Pokemon from "./components/Pokemon";
import "./App.css"; // Import stylesheet for custom styling

function App() {
  return (
    <div className="App">
      <div className="side-by-side">
        <div className="left-panel">
          <Form />
        </div>
        <div className="right-panel">
          <Pokemon />
        </div>
      </div>
    </div>
  );
}

export default App;
