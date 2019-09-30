import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import BottomBtn from './components/FileListButton';

import filemock from './mock/defaultFiles'

function App () {
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 bg-red">
          <FileSearch
            placeholder="search"
            onFileSearch={(keywords) => { window.alert(keywords) }}
          />
          <FileList
            files={filemock}
            onFileClick={(id) => { console.log(id) }}
            onFileDelete={(id) => { console.log('delete' + id) }}
            onFileSave={(id, newname) => { console.log(id, newname) }}
          />
          <div className="row no-gutters">
            <BottomBtn
              text="新建"
              icon="add"
              className="btn btn-primary"
              onButtonClick={() => console.log('new')}
            />
            <BottomBtn
              text="导入"
              icon="upload"
              className="btn btn-success"
              onButtonClick={() => console.log('import')}
            />
          </div>
        </div>
        <div className="col-9 bg-primary"><h1>this is right pennal</h1></div>
      </div>
    </div>
  );
}

export default App;
