import Manager from './manager';

export const MODE_WRITE = "write";
export const MODE_ERASER = "eraser";
export const MODE_REDUCER = "reducer";
export const Actions = {
  ADD: 'add',
  DEL: 'del',
};
export const AUTO_SIZE = 20;
export const REDUCE_RATIO = 0.05;
export const MOVE_COUNT = 2;

export default Manager;
