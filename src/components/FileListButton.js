import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileUpload } from '@fortawesome/free-solid-svg-icons';

const FileListButton = ({ text, icon, className, onButtonClick }) => {
    return (
        <button
            type="button"
            className={`btn col ${className}`}
            onClick={() => { onButtonClick() }}
        >
            <FontAwesomeIcon
                size="lg"
                icon={icon === 'add' ? faPlus : faFileUpload}
            />
            <span className="ml-3">{text}</span>
        </button>
    )
}

export default FileListButton