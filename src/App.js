import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-3 bg-red"><h1>this is left pennal</h1></div>
        <div className="col-9 bg-primary"><h1>this is right pennal</h1></div>
      </div>
    </div>
  );
}

export default App;
