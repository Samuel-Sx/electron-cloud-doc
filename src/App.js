import React, { useState } from 'react';
import uuidv4 from 'uuid';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import BottomBtn from './components/FileListButton';
import TabList from './components/TabList';
import SimpleMDE from "react-simplemde-editor";
import { DictionaryToArray, ArrayToDictionary } from './utls/DataConversion'

import "easymde/dist/easymde.min.css";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import filemock from './mock/defaultFiles';

const Store = window.require('electron-store');
const stroe = new Store({ 'name': 'Files Data' })
const remote = window.require('electron').remote;
const { join } = window.require('path');
const fileOpt = require('./utls/FileIO');

const documentDir = remote.app.getPath('documents');
// 数据持久化方法
const saveToStore = (files) => {
    const Files = files.reduce((pre, file) => {
        const { id, title, path, createAt } = file;
        console.log(id, title, path, createAt)
        pre[id] = {
            id,
            title,
            path,
            createAt
        }
    }, {});
    // stroe.set('files', Files);
}

function App () {
    const [files, setFiles] = useState(ArrayToDictionary(filemock));
    const [activeFileID, setActiveFileId] = useState('');
    const [openFileIDs, setOpenFileIDs] = useState([]);
    const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
    const [searchFiles, setSearchFiles] = useState([]);
    const showFiles = searchFiles.length > 0 ? searchFiles : DictionaryToArray(files);
    // 查找已打开的文件列表
    const openFiles = openFileIDs.map(openID => {
        return files[openID]
    })

    // 查找当前选中文件
    const activeFile = files[activeFileID]

    // 文件列表点击方法
    const handleFileItemClick = (id) => {
        // 修改选中文件
        setActiveFileId(id);
        // 如果当前文件不存在于打开列表
        // 在已打开文件中插入当前文件
        if (!openFileIDs.includes(id)) {
            setOpenFileIDs([...openFileIDs, id])
        }
        setSearchFiles([]);
    }

    // tab点击方法
    const handleTabItemClick = (id) => {
        // 修改选中文件
        activeFileID !== id && setActiveFileId(id);
    }

    // tab关闭方法
    const handleTabCloseClick = (id) => {
        // 重组移除关闭文件后的打开文件数组
        const newOpenFileIDs = openFileIDs.filter(openID => openID !== id);
        // 把原数组替换为新数组
        setOpenFileIDs(newOpenFileIDs);
        // 如果打开文件数组不为空，则将最后一个文件设置为当前文件
        // 否则，将当前文件state置空
        if (openFileIDs.length > 0) {
            setActiveFileId(newOpenFileIDs[newOpenFileIDs.length - 1])
        } else {
            setActiveFileId('')
        }
    }

    // 文档修改方法
    const handleFileChange = async (id, value, type) => {
        // const initial = files.find(file => file.id === id).body
        let newFiles;
        // 如果是内容操作，并且未保存数组中没有当前文件
        // 将当前文件加入未保存数组中
        if (!unsavedFileIDs.includes(id) && type === 'content') {
            setUnsavedFileIDs([...unsavedFileIDs, id])
        }
        // 按照修改类型执行操作
        if (type === 'content') {
            newFiles = { ...files, [id]: { ...files[id], body: value } };
        } else if (type === 'title') {
            newFiles = { ...files, [id]: { ...files[id], title: value } };
            if (files[id].isNew) {
                delete newFiles[id].isNew;
                try {
                    await fileOpt.save(join(documentDir, `${value}.md`), files[id].body);
                } catch (err) {
                    console.error(err);
                }
            } else {
                try {
                    await fileOpt.rename(join(documentDir, `${files[id].title}.md`), join(documentDir, `${value}.md`));
                } catch (err) {
                    console.error(err);
                }
            }
        }

        setFiles(newFiles);
        saveToStore(newFiles);
    }

    // 文档列表删除方法
    const handleDeleteFile = (id) => {
        // 重组删除当前文件之后的文件数组
        // const newFiles = files.filter(file => file.id !== id);
        const newFiles = { ...files };
        delete newFiles[id];
        setFiles(newFiles);
        // 执行关闭操作对右侧内容区域对应文件进行清除
        handleTabCloseClick(id)
    }

    // 搜索文档方法
    const handleSearchFiles = (keywords) => {
        const searchedFiles = DictionaryToArray(files).filter(file => file.title.includes(keywords));
        setSearchFiles(searchedFiles);
    }

    // 新建文件方法
    const handleCreateFile = () => {
        const haveNewFile = DictionaryToArray(files).find(file => file.isNew)
        if (haveNewFile) return;

        const fileid = uuidv4()
        const newFiles = {
            ...files,
            [fileid]:{
                id: fileid,
                title: '',
                body: '> entry markdown context',
                createAt: new Date().getTime(),
                isNew: true
            }
        }

        setFiles(newFiles);
    }

    return (
        <div className="App container-fluid px-0">
            <div className="row no-gutters">
                {/* 左侧列表区域 */}
                <div className="col-3 bg-red left-panel">
                    <FileSearch
                        placeholder="search"
                        onFileSearch={handleSearchFiles}
                    />
                    <FileList
                        files={showFiles}
                        onFileClick={handleFileItemClick}
                        onFileDelete={handleDeleteFile}
                        onFileSave={(id, newname) => { console.info(files,id);handleFileChange(id, newname, 'title', files[id].isNew) }}
                    />
                    <div className="row no-gutters bottom-btn-group">
                        <BottomBtn
                            text="新建"
                            icon="add"
                            className="btn btn-primary"
                            onButtonClick={handleCreateFile}
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
                        activeId={activeFileID}
                        unsaveIds={unsavedFileIDs}
                        onTabClick={handleTabItemClick}
                        onSaveTab={() => { }}
                        onCloseTab={handleTabCloseClick}
                    />
                    <SimpleMDE
                        key={activeFile && activeFile.id}
                        value={activeFile && activeFile.body}
                        onChange={(newcontent) => { handleFileChange(activeFile.id, newcontent, 'content') }}
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
