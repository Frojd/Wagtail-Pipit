import React from 'react';
import ReactDOM from 'react-dom';
import { Component, props } from './Component';
import '../../app/styles/index.css';
ReactDOM.render(<Component {...props} />, document.getElementById('root'));
