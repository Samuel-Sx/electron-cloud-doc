import React, { Fragment, useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import useKeyboradPress from '../hooks/useKeyboradPress';

const FileList = ({ files, onFileClick, onFileDelete, onFileSave }) => {
    const [isEdit, setIsEdit] = useState(null);
    const [newname, setNewname] = useState('');
    const entryPress = useKeyboradPress(13);
    const escPress = useKeyboradPress(27);
    const cancelEdit = (file, save) => {
        setIsEdit(null);
        setNewname('');
        // 如果是新建文件，则执行删除操作
        if(file.isNew && !save){
            onFileDelete(file.id)
        }
    }

    useEffect(() => {
        const renameItem = files.find(file => file.id === isEdit);
        if(entryPress && isEdit && newname.trim() !== ''){
            onFileSave(renameItem.id, newname);
            cancelEdit(renameItem, true);
        }else if (escPress && isEdit){
            cancelEdit(renameItem);
        }
    })

    useEffect(() => {
        const newFile = files.find(file => file.isNew);
        if(newFile){
            setIsEdit(newFile.id);
            setNewname(newFile.title);
        }
    }, [files])

    return (
        <ul
            className="list-group-flush px-0"
        >
            {
                files.map(file => (
                    <li
                        key={file.id}
                        className="list-group-item row d-flex justify-content-between align-items-center text-left no-gutters"
                    >
                        <span className="col-1"><FontAwesomeIcon size="lg" icon={faMarkdown} /></span>
                        {
                            ((file.id === isEdit) || file.isNew) ?
                                <input
                                    className="col-8"
                                    placeholder={file.title}
                                    onInput = {e => {setNewname(e.target.value)}}
                                /> :
                                <span className="col-8" onClick={() => { onFileClick(file.id) }}>{file.title}</span>
                        }
                        {
                            ((file.id === isEdit) || file.isNew) ?
                                <span
                                    className="col-2"
                                    onClick={() => { cancelEdit(file) }}
                                >
                                    <FontAwesomeIcon size="lg" icon={faTimes} />
                                </span> :
                                (
                                    <Fragment>
                                        <span className="col-1" onClick={() => { setIsEdit(file.id); setNewname(file.title) }}><FontAwesomeIcon size="lg" icon={faEdit} /></span>
                                        <span className="col-1" onClick={() => { onFileDelete(file.id) }}><FontAwesomeIcon size="lg" icon={faTrash} /></span>
                                    </Fragment>
                                )
                        }
                    </li>
                ))
            }
        </ul>
    )
}

FileList.propTypes = {
    files: propTypes.array.isRequired,
    onFileClick: propTypes.func,
    onFileDelete: propTypes.func,
    onFileSave: propTypes.func
}

export default FileList;
