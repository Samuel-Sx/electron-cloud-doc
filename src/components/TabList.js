// files activeId unsaveIds onTabClick onCloseTab
import React from 'react';
import propTypes from 'prop-types';
import ClassNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import './TabList.scss';
const TabList = ({ files, activeId, unsaveIds, onTabClick, onCloseTab }) => {
    return (
        <ul className="nav nav-tabs">
            {
                files.map(file => {
                    const isUnsave = unsaveIds.includes(file.id);
                    const classnames = ClassNames({
                        'nav-link': true,
                        'active': file.id === activeId,
                        'withunsave': isUnsave
                    });
                    return (
                        <li className="nav-item" key={file.id}>
                            <a
                                href="/"
                                className={classnames}
                                onClick={e => {
                                    e.preventDefault();
                                    onTabClick(file.id)
                                }}
                            >
                                {file.title}
                                <FontAwesomeIcon
                                    className='ml-2 close-item'
                                    size="sm"
                                    icon={faTimes}
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onCloseTab(file.id);
                                    }}
                                />
                                {
                                    isUnsave &&
                                    <span className="rounded-circle unsave-icon ml-2"></span>
                                }
                            </a>
                        </li>
                    )
                })
            }
        </ul>
    )
}

TabList.propTypes = {
    files: propTypes.array.isRequired,
    activeId: propTypes.string,
    unsaveIds: propTypes.array,
    onSaveTab: propTypes.func,
    onCloseTab: propTypes.func
}
export default TabList
