import React, { Fragment, useState } from 'react';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'

const FileList = ({ files, onFileEdit, onFileDelete }) => {

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
                        <span className="col-8">{file.title}</span>
                        <span className="col-1"><FontAwesomeIcon size="lg" icon={faEdit} /></span>
                        <span className="col-1"><FontAwesomeIcon size="lg" icon={faTrash} /></span>
                    </li>
                ))
            }
        </ul>
    )
}

FileList.propTypes = {
    files: propTypes.array.isRequired,
    onFileEdit: propTypes.func,
    onFileEdit: propTypes.func
}

export default FileList;
