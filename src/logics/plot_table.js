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

  select(minX, maxX, minY, maxY) {
    return this.table.filter((ylist) => {
      return ylist.x >= minX && ylist.x <= maxX;
    }).map((ylist) => {
      return ylist.list.filter((y) => y >= minY && y <= maxY).map((v) => {
        return { x: ylist.x, y: v };
      });
    }).flatten();
  }

  del(x, y) {
    let ylist = this.table.find(list => list.x === x);
    if (!ylist) {
      return false;
    }
    const i = ylist.list.indexOf(y);
    if (i < 0) {
      return false;
    }
    ylist.list.splice(i, 1);
    this.size--;
    return true;
  }

  removeIndex(index) {
    let cur = 0;
    for (let i = 0; i < this.table.length; i++) {
      let ylist = this.table[i];
      if (cur + ylist.list.length > index) {
        const y = ylist.list[index - cur];
        ylist.list.splice(index - cur, 1);
        this.size--;
        return { x: ylist.x, y: y };
      } else {
        cur += ylist.list.length;
      }
    }
    return { x: -1, y: -1 };
  }

  all() {
    return this.table.map((ylist) => {
      return ylist.list.map((y) => {
        return { "x": ylist.x, "y": y };
      })
    }).flatten();
  }
}
