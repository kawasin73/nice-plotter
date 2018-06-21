import React from 'react';
import { render } from 'react-dom';
import App from '../component/App';
import { Manager } from "../logics";

const MAX_COUNT = 1000;

const manager = new Manager(500, 500, MAX_COUNT);

render(
  <App manager={manager} height={500} width={500}/>,
  document.getElementById('root')
);
