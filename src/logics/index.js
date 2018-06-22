import Drawer from './drawer';
import PlotTable from './plot_table';

export const MODE_WRITE = "write";
export const MODE_ERASER = "eraser";
export const MODE_REDUCER = "reducer";
const AUTO_SIZE = 20;
const REDUCE_RATIO = 0.05;

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
  const mouseX = e.clientX - Math.floor(rect.left) - 2;
  const mouseY = e.clientY - Math.floor(rect.top) - 2;
  return { x: mouseX, y: mouseY };
}

export class Manager {
  constructor(height, width, maxCount) {
    this.table = new PlotTable(height, width);
    this.drawer = new Drawer();
    this.mode = MODE_WRITE;
    this.down = false;
    this.pointer = { x: width / 2, y: height / 2 };
    this.pointerSize = 50;
    this.pointCount = 5;
    this.maxCount = maxCount;
  }

  get count() {
    return this.table.size;
  }

  changeMode(mode) {
    this.mode = mode;
  }

  updateCanvas(canvas) {
    this.drawer.updateCanvas(canvas);
  }

  updateOverlay(overlay) {
    this.drawer.updateOverlay(overlay);
    const { x, y } = this.pointer;
    this.drawer.updatePointer(x, y, this.pointerSize, this.mode);
  }

  onMouseDown(e) {
    this.down = true;
    console.log("onMouseDown");
    this.onMouseMove(e);
  }

  onMouseMove(e) {
    const { x, y } = this.pointer = getPosition(e);
    this.drawer.updatePointer(x, y, this.pointerSize, this.mode);
    if (this.down) {
      switch (this.mode) {
        case MODE_WRITE:
          console.log("generate");
          this.generatePoints(x, y);
          break;
        case MODE_ERASER:
          console.log("erace");
          this.erace(x, y);
          this.reload();
          break;
        case MODE_REDUCER:
          console.log("reduce");
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
      }
    }
  }

  erace(baseX, baseY) {
    const half = this.pointerSize;
    const delPoints = this.table.select(baseX - half, baseX + half, baseY - half, baseY + half);
    delPoints.forEach((p) => {
      this.table.del(p.x, p.y);
    });
  }

  reduce(baseX, baseY) {
    const half = this.pointerSize;
    const delPoints = this.table.select(baseX - half, baseX + half, baseY - half, baseY + half);
    for (let delCount = Math.ceil(delPoints.length * REDUCE_RATIO); delCount > 0; delCount--) {
      const i = Math.trunc(Math.random() * delPoints.length);
      this.table.del(delPoints[i].x, delPoints[i].y);
      delPoints.splice(i, 1);
    }
  }

  reload() {
    this.drawer.drawAll(this.table.all());
  }

  autoFit() {
    while (this.table.size > 0 && this.table.size < this.maxCount) {
      this.generateAuto();
    }
    this.removeToMax();
    this.reload();
  }

  generateAuto() {
    this.table.all().forEach((point) => {
      const { x, y } = randomNorm(point.x, point.y, AUTO_SIZE);
      this.table.add(x, y);
    });
  }

  removeToMax() {
    while (this.table.size > this.maxCount) {
      this.table.removeIndex(Math.trunc(Math.random() * this.table.size))
    }
  }
}
