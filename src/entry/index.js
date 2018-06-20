console.log("hello world");

window.addEventListener("load", () => {
  const canvas = document.getElementById('canvas-view');
  const overlay = document.getElementById('canvas-over');
  const manager = new Manager(canvas, overlay);
  manager.setUp();
});

const SIZE = 3;

function randomCircle(x, y, size) {
  const theta = 2 * Math.PI * Math.random();
  const r = Math.sqrt(Math.random() * Math.pow(size, 2));
  return { x: Math.trunc(r * Math.cos(theta) + x), y: Math.trunc(r * Math.sin(theta) + y) }
}

class Manager {
  constructor(canvas, overlay) {
    this.table = new PlotTable();
    this.mode = "write";
    this.down = false;
    this.pointerSize = 50;
    this.pointCount = 5;


    this.canvas = canvas;
    this.overlay = overlay;
    this.ctx = canvas.getContext('2d');
    this.ctxOver = overlay.getContext('2d');
    this.overlay.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.overlay.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.overlay.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  setUp() {
  }

  onMouseDown(e) {
    const { x, y } = Manager.getPosition(e);
    this.down = true;
    console.log("onMouseDown", x, y);
    this.generatePoints(x, y);
  }

  onMouseMove(e) {
    const { x, y } = Manager.getPosition(e);
    console.log("onMouseMove", x, y);
    this.drawPointer(x, y);
    if (this.down) {
      this.generatePoints(x, y);
    }
  }

  onMouseUp(e) {
    this.down = false;
  }

  generatePoints(baseX, baseY) {
    for (let i = 0; i < this.pointCount; i++) {
      const { x, y } = randomCircle(baseX, baseY, this.pointerSize);
      console.log("generate ", x, y);
      if (this.table.add(x, y)) {
        this.drawPoint(x, y);
      }
    }
  }

  static getPosition(e) {
    const rect = e.target.getBoundingClientRect();
    const mouseX = e.clientX - Math.floor(rect.left) - 2;
    const mouseY = e.clientY - Math.floor(rect.top) - 2;
    return { x: mouseX, y: mouseY };
  }

  drawPointer(x, y) {
    this.ctxOver.clearRect(0, 0, this.overlay.width, this.overlay.height);
    this.ctxOver.beginPath();
    this.ctxOver.arc(x, y, this.pointerSize, 0, 2 * Math.PI, false);
    this.ctxOver.lineWidth = 1;
    this.ctxOver.stroke();
    this.ctxOver.closePath();
  }

  drawAll() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.table.all().forEach((point) => {
      this.drawPoint(point.x, point.y);
    });
  }

  drawPoint(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, SIZE, 0, 2 * Math.PI, false);
    this.ctx.fill();
    this.ctx.closePath();
  }
}

class PlotTable {
  constructor() {
    this.table = [];
    this.size = 0;
  }

  add(x, y) {
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
        break;
      } else {
        cur += ylist.list.length;
      }
    }
  }

  all() {
    return this.table.map((ylist) => {
      ylist.list.map((y) => {
        return { "x": ylist.x, "y": y };
      })
    }).flatten();
  }
}
