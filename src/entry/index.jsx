import React from 'react';
import { render } from 'react-dom';
import App from '../component/App';
import Manager from "../logics";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

const MAX_COUNT = 1000;
const FILE_NAME = 'plotter.png';

const manager = new Manager(500, 500, MAX_COUNT, FILE_NAME);

render(
  <App manager={manager} height={500} width={500}/>,
  document.getElementById('root')
);

// URL: https://stackoverflow.com/questions/49500339/cant-prevent-touchmove-from-scrolling-window-on-ios
window.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, { passive: false });
