import Drawer from './drawer';
import PlotTable from './plot_table';
import History from './history';

export const MODE_WRITE = "write";
export const MODE_ERASER = "eraser";
export const MODE_REDUCER = "reducer";
const Actions = {
  ADD: 'add',
  DEL: 'del',
};
const AUTO_SIZE = 20;
const REDUCE_RATIO = 0.05;
const FILE_NAME = 'plotter.png';

function randomCircle(x, y, size) {
  const theta = 2 * Math.PI * Math.random();
  const r = Math.sqrt(Math.random() * Math.pow(size, 2));
  return { x: Math.trunc(r * Math.cos(theta) + x), y: Math.trunc(r * Math.sin(theta) + y) }
}

// URL: https://qiita.com/gigamori/items/e17e6f9faffb78822c56
function rnorm() {
  return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
}

function randomNorm(x, y, size) {
  return { x: Math.trunc(rnorm() * size / 2 + x), y: Math.trunc(rnorm() * size / 2 + y) }
}

function getPosition(e) {
  const rect = e.target.getBoundingClientRect();
  const mouseX = (e.clientX || e.touches[0].clientX) - Math.floor(rect.left) - 2;
  const mouseY = (e.clientY || e.touches[0].clientY) - Math.floor(rect.top) - 2;
  return { x: mouseX, y: mouseY };
}

// URL: https://st40.xyz/one-run/article/133/
function Base64toBlob(base64) {
  // カンマで分割して以下のようにデータを分ける
  // tmp[0] : データ形式（data:image/png;base64）
  // tmp[1] : base64データ（iVBORw0k～）
  const tmp = base64.split(',');
  // base64データの文字列をデコード
  const data = atob(tmp[1]);
  // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
  const mime = tmp[0].split(':')[1].split(';')[0];
  //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
  const buf = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    buf[i] = data.charCodeAt(i);
  }
  return new Blob([buf], { type: mime });
}

function saveBlob(blob, fileName) {
  const url = (window.URL || window.webkitURL);
  const dataUrl = url.createObjectURL(blob);
  const event = document.createEvent("MouseEvents");
  event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  const a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
  a.href = dataUrl;
  a.download = fileName;
  a.dispatchEvent(event);
}

export class Manager {
  constructor(height, width, maxCount) {
    this.table = new PlotTable(height, width);
    this.drawer = new Drawer();
    this.history = new History();
    this.mode = MODE_WRITE;
    this.down = false;
    this.pointer = { x: width / 2, y: height / 2 };
    this.pointerSize = 25;
    this.pointCount = 5;
    this.maxCount = maxCount;
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
    this.mode = mode;
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
    const blob = Base64toBlob(base64);
    saveBlob(blob, FILE_NAME);
  }

  onMouseDown(e) {
    this.down = true;
    this.history.buildStep();
    console.log("onMouseDown");
    this.onMouseMove(e);
  }

  onMouseMove(e) {
    const { x, y } = this.pointer = getPosition(e);
    this.refreshPointer();
    if (this.down) {
      switch (this.mode) {
        case MODE_WRITE:
          console.log("generate", x, y);
          this.generatePoints(x, y);
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
      const { x, y } = randomCircle(baseX, baseY, this.pointerSize);
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
      const { x, y } = randomNorm(point.x, point.y, AUTO_SIZE);
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
