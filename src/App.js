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

const Store = window.require('electron-store');
const store = new Store({ 'name': 'Files Data' })
const remote = window.require('electron').remote;
const { join, basename, extname, dirname } = window.require('path');
const fileOpt = require('./utls/FileIO');

const documentDir = remote.app.getPath('documents');
// 数据持久化方法
const saveToStore = (files) => {
    const Files = DictionaryToArray(files).reduce((pre, file) => {
        const { id, title, path, createAt } = file;
        pre[id] = {
            id,
            title,
            path,
            createAt
        }
        return pre
    }, {});

    store.set('files', Files);
}

// 选择文件夹方法
const selectDirectory = () => {
    return remote.dialog.showOpenDialogSync({
        title: 'Select Directory',
        properties: ['openDirectory', 'createDirectory', 'promptToCreate']
    })[0];
}

function App () {
    const [files, setFiles] = useState(store.get('files') || {});
    const [activeFileID, setActiveFileId] = useState('');
    const [openFileIDs, setOpenFileIDs] = useState([]);
    const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
    const [searchFiles, setSearchFiles] = useState([]);
    const showFiles = searchFiles.length > 0 ? searchFiles : DictionaryToArray(files);
    // 查找已打开的文件列表
    const openFiles = openFileIDs.map(openID => files[openID])

    // 查找当前选中文件
    const activeFile = files[activeFileID]

    // 检查文件路径信息
    const checkFilePath = (file, newtitle) => {
        return new Promise((resolve, reject) => {
            let paths = file.path;
            if (!paths) {
                paths = join(selectDirectory(), `${newtitle}.md`)
            } else {
                paths = join(dirname(file.path), newtitle + extname(file.path));
            }
            resolve(paths);
        })
    }
    // 文件列表点击方法
    const handleFileItemClick = async (id) => {
        const currentFile = files[id];
        let fileContent;
        try {
            fileContent = await fileOpt.getContent(currentFile.path);
        } catch (err) {
            console.error(err);
        }

        if (!fileContent && typeof fileContent !== 'string') return;

        if (!currentFile.isOpened) {
            const newFiles = { ...files, [id]: { ...files[id], body: fileContent, isOpened: true } };
            setFiles(newFiles);
        }
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
            // 先校验是否存在路径属性, 如果不存在,需要弹出路径选择并生成新路径
            const filePath = await checkFilePath(files[id], value);
            // 重组新文件列表格式
            newFiles = { ...files, [id]: { ...files[id], title: value, path: filePath } };
            // 判断是否为新建文件
            if (files[id].isNew) {
                delete newFiles[id].isNew;
                try {
                    await fileOpt.save(newFiles[id].path, files[id].body);
                } catch (err) {
                    console.error(err);
                }
            } else {
                try {
                    await fileOpt.rename(files[id].path, newFiles[id].path);
                } catch (err) {
                    console.error(err);
                }
            }
        }

        setFiles(newFiles);
        saveToStore(newFiles);
    }

    // 文档列表删除方法
    const handleDeleteFile = async (id) => {
        // 重组删除当前文件之后的文件数组
        const newFiles = { ...files };

        try {
            newFiles[id].path && await fileOpt.remove(newFiles[id].path);
        } catch (err) {
            console.error(err);
        }

        delete newFiles[id];

        setFiles(newFiles);
        saveToStore(newFiles);
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
            [fileid]: {
                id: fileid,
                title: '',
                body: '> entry markdown context',
                createAt: new Date().getTime(),
                isNew: true
            }
        }

        setFiles(newFiles);
    }

    // 保存文件内容方法
    const handleSaveFile = async () => {
        const currentFile = files[activeFileID]
        if (!currentFile) return;
        try {
            await fileOpt.save(currentFile.path, currentFile.body);
            const newUnsavedFileIDs = unsavedFileIDs.filter(id => id !== activeFileID)
            setUnsavedFileIDs(newUnsavedFileIDs);
        } catch (err) {
            console.error(err)
        }
    }

    // 将文件添加至编辑器列表
    const addFileToEditor = (filePathArray) => {
        let unOpenFiles,
            unexistFile,
            unOpenFileObj,
            newFiles;
        // 通过文件路径过滤已打开文件
        unOpenFiles = filePathArray.filter(path => {
            unexistFile = Object.values(files).find(file => {
                return file.path === path
            })
            return !unexistFile
        })

        // 完善文件信息对象
        unOpenFileObj = unOpenFiles.map(path => {
            return ({
                id: uuidv4(),
                title: basename(path, extname(path)),
                path: path,
                createAt: new Date().getTime()
            })
        })

        // 把文件信息转为字典格式
        newFiles = { ...files, ...ArrayToDictionary(unOpenFileObj) };

        // 更新文件列表，持久化文件列表信息
        setFiles(newFiles);
        saveToStore(newFiles);
    }

    // 导入文件方法
    const handleImportFile = () => {
        remote.dialog.showOpenDialog({
            title: 'Open Markdown Files',
            properties: ['openFile', "openDirectory", "multiSelections"],
            filters: [{ name: 'Markdown', extensions: ['md'] }]
        }, paths => {
            if (!paths || !Array.isArray(paths)) return;
            addFileToEditor(paths);
        })
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
                        onFileSave={(id, newname) => { handleFileChange(id, newname, 'title', files[id].isNew) }}
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
                            onButtonClick={handleImportFile}
                        />
                        <BottomBtn
                            text="保存"
                            icon="upload"
                            className="btn btn-warning"
                            onButtonClick={handleSaveFile}
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
