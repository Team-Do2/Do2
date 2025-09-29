import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [backendResult, setBackendResult] = useState<string>("");

  // Fetch from backend on mount
  React.useEffect(() => {
    fetch("http://localhost:5015/")
      .then((res) => res.text())
      .then((data) => setBackendResult(data))
      .catch((err) => setBackendResult("Error: " + err.message));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React = Do2</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div style={{ marginTop: "2rem" }}>
        <h2>Backend Response:</h2>
        <pre>{backendResult}</pre>
      </div>
    </>
  );
}

export default App;
