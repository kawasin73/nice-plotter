export default class PlotTable {
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
      const nextList = ylist.list.filter((y) => !(y >= minY && y <= maxY));
      this.size -= ylist.list.length - nextList.length;
      ylist.list = nextList;
    });
    this.table = this.table.filter((list) => list.list.length > 0);
  }

  removeIndex(index) {
    let cur = 0;
    for (let i = 0; i < this.table.length; i++) {
      let ylist = this.table[i];
      if (cur + ylist.list.length > index) {
        ylist.list.splice(index - cur, 1);
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
