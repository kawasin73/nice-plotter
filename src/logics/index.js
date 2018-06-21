const SIZE = 3;
const MODE_WRITE = "write";
const MODE_ERASER = "eraser";
const AUTO_SIZE = 50;

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
    this.pointerSize = 50;
    this.pointCount = 5;
    this.maxCount = maxCount;
  }

  updateCanvas(canvas) {
    this.drawer.updateCanvas(canvas);
  }

  updateOverlay(overlay) {
    this.drawer.updateOverlay(overlay);
  }

  onMouseDown(e) {
    const { x, y } = getPosition(e);
    this.down = true;
    console.log("onMouseDown", x, y);
    this.generatePoints(x, y);
  }

  onMouseMove(e) {
    const { x, y } = getPosition(e);
    this.drawer.updatePointer(x, y, this.pointerSize, this.mode);
    if (this.down) {
      switch (this.mode) {
        case MODE_WRITE:
          this.generatePoints(x, y);
          break;
        case MODE_ERASER:
          this.erace(x, y);
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
    this.table.remove(baseX - half, baseX + half, baseY - half, baseY + half);
  }

  reload() {
    this.drawer.drawAll(this.table.all());
  }

  autoFit() {
    while (this.table.size <= this.maxCount) {
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

class Drawer {
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

  updatePointer(x, y, size, mode) {
    if (!this.ctxOver) {
      console.warn("ctxOver is not set");
      return;
    }
    this.ctxOver.clearRect(0, 0, this.overlay.width, this.overlay.height);
    this.ctxOver.beginPath();
    if (mode === MODE_WRITE) {
      this.ctxOver.arc(x, y, size, 0, 2 * Math.PI, false);
      this.ctxOver.lineWidth = 1;
      this.ctxOver.stroke();
    } else if (mode === MODE_ERASER) {
      const half = size / 2;
      this.ctxOver.rect(x - half, y - half, size, size);
      this.ctxOver.lineWidth = 1;
      this.ctxOver.stroke();
    }
    this.ctxOver.closePath();
  }
}

class PlotTable {
  constructor(height, width) {
    this.table = [];
    this.size = 0;
    this.height = height;
    this.width = width;
  }

  add(x, y) {
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      return false;
    }
    let ylist = this.table.find(list => list.x === x);
    if (!ylist) {
      ylist = { "x": x, "list": [] };
      this.table.push(ylist);
    }
    if (ylist.list.find(e => e === y)) {
      return false;
    }
    ylist.list.push(y);
    this.size++;
    return true;
  }

  remove(minX, maxX, minY, maxY) {
    const ylists = this.table.filter((ylist) => {
      return ylist.x >= minX && ylist.x <= maxX;
    });
    ylists.forEach((ylist) => {
      const nextList = ylist.list.filter((y) => y >= minY && y <= maxY);
      this.size -= ylist.list.length - nextList.length;
      y.list = nextList;
    });
    this.table = this.table.filter((list) => list.list.length > 0);
  }

  removeIndex(index) {
    let cur = 0;
    for (let i = 0; i < this.table.length; i++) {
      let ylist = this.table[i];
      if (cur + ylist.list.length > index) {
        ylist.list = ylist.list.splice(index - cur, 1);
        this.size--;
        break;
      } else {
        cur += ylist.list.length;
      }
    }
  }

  all() {
    return this.table.map((ylist) => {
      return ylist.list.map((y) => {
        return { "x": ylist.x, "y": y };
      })
    }).flatten();
  }
}
