import React, { useState } from 'react';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import BottomBtn from './components/FileListButton';
import TabList from './components/TabList';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import filemock from './mock/defaultFiles'

function App () {
  const [files, setFiles] = useState(filemock);
  const [activeFileID, setActiveFileId] = useState('');
  const [openFileIDs, setOpenFileIDs] = useState([]);
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
  // 查找已打开的文件列表
  const openFiles = openFileIDs.map(openID => {
    return files.find(file => file.id === openID)
  })
  // 查找当前选中文件
  const activeFile = files.find(file => file.id === activeFileID)
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        {/* 左侧列表区域 */}
        <div className="col-3 bg-red left-panel">
          <FileSearch
            placeholder="search"
            onFileSearch={(keywords) => { window.alert(keywords) }}
          />
          <FileList
            files={files}
            onFileClick={(id) => { console.log(id) }}
            onFileDelete={(id) => { console.log('delete' + id) }}
            onFileSave={(id, newname) => { console.log(id, newname) }}
          />
          <div className="row no-gutters bottom-btn-group">
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
        {/* 右侧内容区域 */}
        <div className="col-9">
          <TabList
            files={openFiles}
            activeId='1'
            unsaveIds={['1', '2']}
            onTabClick={(id) => { console.log(`tabid:${id}`) }}
            onSaveTab={() => { }}
            onCloseTab={(id) => { console.log(`closing: ${id}`) }}
          />
          <SimpleMDE
            value={activeFile && activeFile.body}
            onChange={newvalue => console.info(newvalue)}
            options={{
              minHeight: "85vh",
              status: false
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
