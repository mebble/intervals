import React from "react";

import "./header.css";

const Header = ({ title }) => (
  <div className="Header">
    <h1 className="Header__title">{title}</h1>
  </div>
);

export default Header;
