import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';

import filemock from './mock/defaultFiles'

function App () {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-3 bg-red">
          <FileSearch
            placeholder="search"
            onFileSearch={(keywords) => { window.alert(keywords) }}
          />
          <FileList
            files={filemock}
            onFileClick={(id) => {console.log(id)}}
            onFileDelete={(id) => {console.log('delete' + id)}}
            onFileSave={(id, newname) => {console.log(id, newname)}}
          />
        </div>
        <div className="col-9 bg-primary"><h1>this is right pennal</h1></div>
      </div>
    </div>
  );
}

export default App;
