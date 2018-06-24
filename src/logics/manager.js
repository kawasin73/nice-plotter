import {
  MODE_ERASER, MODE_REDUCER, MODE_WRITE,
  Actions, AUTO_SIZE, REDUCE_RATIO, MOVE_COUNT,
} from "./index";
import * as utils from "./utils";
import Drawer from "./drawer";
import PlotTable from "./plot_table";
import History from "./history";

export default class Manager {
  constructor(height, width, maxCount, fileName) {
    this.table = new PlotTable(height, width);
    this.drawer = new Drawer();
    this.history = new History();
    this.mode = MODE_WRITE;
    this.down = false;
    this.pointer = { x: width / 2, y: height / 2 };
    this.pointerSize = 25;
    this.pointCount = 5;
    this.maxCount = maxCount;
    this.fileName = fileName;

    this.moveCount = 0;
  }

  get count() {
    return this.table.size;
  }

  get canPrev() {
    return this.history.canPrev;
  }

  get canNext() {
    return this.history.canNext;
  }

  changeMode(mode) {
    console.log("change mode to : " + mode);
    this.mode = mode;
    this.refreshPointer();
  }

  updatePointCount(count) {
    this.pointCount = count;
    if (count <= 1) {
      this.pointerSize = 1;
    } else if (count <= 3) {
      this.pointerSize = count * 5;
    } else if (count <= 20) {
      this.pointerSize = count * 10;
    } else {
      this.pointCount = 100;
      this.pointerSize = 100;
    }
    this.refreshPointer();
  }

  updateCanvas(canvas) {
    this.drawer.updateCanvas(canvas);
  }

  updateOverlay(overlay) {
    this.drawer.updateOverlay(overlay);
    this.refreshPointer();
  }

  download() {
    this.reload();
    const base64 = this.drawer.dataUrl();
    const blob = utils.Base64toBlob(base64);
    utils.saveBlob(blob, this.fileName);
  }

  onMouseDown(e) {
    this.down = true;
    this.history.buildStep();
    console.log("onMouseDown");
    this.moveCount = 0;
    this.onMouseMove(e);
  }

  onMouseMove(e) {
    const { x, y } = this.pointer = utils.getPosition(e);
    this.refreshPointer();
    if (this.down) {
      switch (this.mode) {
        case MODE_WRITE:
          if (this.moveCount == 0) {
            console.log("generate", x, y);
            this.generatePoints(x, y);
          }
          this.moveCount = ++this.moveCount % MOVE_COUNT;
          break;
        case MODE_ERASER:
          console.log("erace", x, y);
          this.erace(x, y);
          this.reload();
          break;
        case MODE_REDUCER:
          console.log("reduce", x, y);
          this.reduce(x, y);
          this.reload();
          break;
      }
    }
  }

  onMouseUp(e) {
    console.log("onMouseUp");
    this.down = false;
    this.reload();
  }

  generatePoints(baseX, baseY) {
    for (let i = 0; i < this.pointCount; i++) {
      const { x, y } = utils.randomCircle(baseX, baseY, this.pointerSize);
      if (this.table.add(x, y)) {
        this.drawer.add(x, y);
        this.history.add({ type: Actions.ADD, x: x, y: y });
      }
    }
  }

  erace(baseX, baseY) {
    const half = this.pointerSize;
    const delPoints = this.table.select(baseX - half, baseX + half, baseY - half, baseY + half);
    delPoints.forEach((p) => {
      if (this.table.del(p.x, p.y)) {
        this.history.add({ type: Actions.DEL, x: p.x, y: p.y });
      }
    });
  }

  reduce(baseX, baseY) {
    const half = this.pointerSize;
    const delPoints = this.table.select(baseX - half, baseX + half, baseY - half, baseY + half);
    for (let delCount = Math.ceil(delPoints.length * REDUCE_RATIO); delCount > 0; delCount--) {
      const i = Math.trunc(Math.random() * delPoints.length);
      if (this.table.del(delPoints[i].x, delPoints[i].y)) {
        this.history.add({ type: Actions.DEL, x: delPoints[i].x, y: delPoints[i].y });
      }
      delPoints.splice(i, 1);
    }
  }

  reload() {
    this.drawer.drawAll(this.table.all());
  }

  refreshPointer() {
    const { x, y } = this.pointer;
    this.drawer.currentPointer(x, y, this.pointerSize, this.mode);
  }

  autoFit() {
    this.history.buildStep();
    while (this.table.size > 0 && this.table.size < this.maxCount) {
      this.generateAuto();
    }
    this.removeToMax();
    this.reload();
  }

  generateAuto() {
    this.table.all().forEach((point) => {
      const { x, y } = utils.randomNorm(point.x, point.y, AUTO_SIZE);
      if (this.table.add(x, y)) {
        this.history.add({ type: Actions.ADD, x: x, y: y });
      }
    });
  }

  removeToMax() {
    while (this.table.size > this.maxCount) {
      const { x, y } = this.table.removeIndex(Math.trunc(Math.random() * this.table.size));
      if (x >= 0) {
        this.history.add({ type: Actions.DEL, "x": x, "y": y });
      }
    }
  }

  goNext() {
    const list = this.history.next();
    list.forEach((action) => {
      switch (action.type) {
        case Actions.ADD:
          this.table.add(action.x, action.y);
          break;
        case Actions.DEL:
          this.table.del(action.x, action.y);
          break;
      }
    });
    this.reload()
  }

  goPrev() {
    const list = this.history.prev();
    list.reverse().forEach((action) => {
      switch (action.type) {
        case Actions.ADD:
          this.table.del(action.x, action.y);
          break;
        case Actions.DEL:
          this.table.add(action.x, action.y);
          break;
      }
    });
    this.reload()
  }
}
