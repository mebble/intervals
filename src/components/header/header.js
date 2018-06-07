import React from 'react';

import './header.css';

const Header = props => (
    <div className="Header">
        <h1 className="Header__title">{props.title}</h1>
    </div>
);

export default Header;
