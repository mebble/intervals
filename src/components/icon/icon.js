import React from 'react';
import classnames from 'classnames';

import './icon.css';

const Icon = props => {
    const iconPathClass = classnames('Icon__path', {
        'Icon__path--disabled': props.appCounting,
        'Icon__path--counting': props.intervalCounting
    });
    return (
        <svg className="Icon" width="14" height="14" viewBox="0 0 1024 1024">
            <path className={iconPathClass} d={props.icon}></path>
        </svg>
    );
};

export default Icon;
