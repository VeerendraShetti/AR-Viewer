// src/App.jsx
import React from 'react';
import './App.css';
import ARScene from './ARScene.jsx'; // Update the import statement

function App() {
  return (
    <div className="App" style={{ width: '100vw', height: '100vh' }}>
      <ARScene />
    </div>
  );
}

export default App;
