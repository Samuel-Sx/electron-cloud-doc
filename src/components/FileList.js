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
    const cancelEdit = () => {
        setIsEdit(null);
        setNewname('');
    }

    useEffect(() => {
        if(entryPress && isEdit){
            const renameItem = files.find(file => file.id === isEdit);
            onFileSave(renameItem.id, newname);
            cancelEdit();
        }else if (escPress && isEdit){
            cancelEdit();
        }
    })

    return (
        <ul
            className="list-group-flush"
        >
            {
                files.map(file => (
                    <li
                        key={file.id}
                        className="list-group-item row d-flex justify-content-between align-items-center text-left"
                    >
                        <span className="col-1"><FontAwesomeIcon size="lg" icon={faMarkdown} /></span>
                        {
                            (file.id === isEdit) ?
                                <input
                                    className="col-8"
                                    placeholder={file.title}
                                    onInput = {e => {setNewname(e.target.value)}}
                                /> :
                                <span className="col-8" onClick={() => { onFileClick(file.id) }}>{file.title}</span>
                        }
                        {
                            (file.id === isEdit) ?
                                <span
                                    className="col-2"
                                    onClick={() => { cancelEdit() }}
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
