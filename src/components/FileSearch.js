import React, { Fragment, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import propTypes from 'prop-types';

const FileSearch = ({ placeholder, onFileSearch }) => {
    let [isActive, setActive] = useState(false);
    let [value, setValue] = useState('');
    let inputStyle = {
        border: "none",
        background: "#D0E5FC",
        color: "#1c1f21",
        outline: "none",
        borderBottom: "1px solid #007bff"
    }

    const clearSearch = (e) => {
        e.preventDefault();
        setActive(false);
        setValue('')
    }

    useEffect(() => {
        const handleKeyup = event => {
            let { keyCode } = event;
            if (keyCode === 13 && isActive && value) { // 回车
                onFileSearch(value);
                setActive(false)
            } else if (keyCode === 27 && isActive) { // ESC
                clearSearch(event)
            }
        }
        document.addEventListener('keyup', handleKeyup);

        return () => {
            document.removeEventListener('keyup', handleKeyup);
        }
    })

    return (
        <Fragment>
            <div className="d-flex alert alert-primary justify-content-between align-items-center">
                {
                    isActive ?
                        <input
                            className="col-10 text-left"
                            type="text"
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => { setValue(e.target.value) }}
                            autoFocus
                            style={inputStyle}
                        /> :
                        <div
                            className="col-10 text-left"
                            onClick={() => { setActive(true) }}
                        >
                            {value ? value : placeholder}
                        </div>
                }
                {
                    !isActive ?
                        <button
                            type="button"
                            className="search-btn col-2"
                            onClick={() => { value && onFileSearch(value) }}
                        >
                            <FontAwesomeIcon size="lg" icon={faSearch}/>
                        </button> :

                        <button
                            type="button"
                            className="search-btn col-2"
                            onClick={clearSearch}
                        >
                            <FontAwesomeIcon size="lg" icon={faTimes}/>
                        </button>
                }
            </div>
        </Fragment>
    )
}

FileSearch.propTypes = {
    placeholder: propTypes.string,
    onFileSearch: propTypes.func.isRequired
}

FileSearch.defaultProps = {
    placeholder: 'search...'
}

export default FileSearch;