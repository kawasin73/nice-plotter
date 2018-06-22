import { MODE_ERASER, MODE_WRITE, MODE_REDUCER } from "./index";

const SIZE = 3;

export default class Drawer {
  constructor() {
    this.canvas = null;
    this.overlay = null;
    this.ctx = null;
    this.ctxOver = null;
  }

  updateCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  updateOverlay(overlay) {
    this.overlay = overlay;
    this.ctxOver = overlay.getContext('2d');
  }

  updatePointer(pointer) {
    this.pointer = pointer;
    this.ctxPointer = pointer.getContext('2d');
  }

  add(x, y) {
    if (!this.ctx) {
      console.warn("ctx is not set");
      return;
    }
    this.ctx.beginPath();
    this.ctx.arc(x, y, SIZE, 0, 2 * Math.PI, false);
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawAll(list) {
    if (!this.ctx) {
      console.warn("ctx is not set");
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    list.forEach((point) => {
      this.add(point.x, point.y);
    });
  }

  currentPointer(x, y, size, mode) {
    if (!this.ctxOver) {
      console.warn("ctxOver is not set");
      return;
    }
    this.ctxOver.clearRect(0, 0, this.overlay.width, this.overlay.height);
    this.ctxOver.beginPath();
    switch (mode) {
      case MODE_WRITE:
        this.ctxOver.arc(x, y, size, 0, 2 * Math.PI, false);
        this.ctxOver.lineWidth = 1;
        this.ctxOver.stroke();
        break;
      case MODE_REDUCER:
      case MODE_ERASER:
        this.ctxOver.rect(x - size, y - size, size * 2, size * 2);
        this.ctxOver.lineWidth = 1;
        this.ctxOver.stroke();
        break;
    }
    this.ctxOver.closePath();
  }
}
