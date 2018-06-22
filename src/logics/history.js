export default class History {
  constructor() {
    this.list = [];
    this.i = -1;
  }

  get canPrev() {
    return this.i >= 0;
  }

  get canNext() {
    return this.i < this.list.length - 1;
  }

  add(item) {
    if (this.i < 0) {
      return false;
    }
    this.list[this.i].push(item);
    return true;
  }

  buildStep() {
    if (this.i < this.list.length - 1) {
      this.list = this.list.slice(0, this.i + 1);
    }
    this.list.push([]);
    this.i++;
  }

  prev() {
    if (!this.canPrev) {
      return [];
    }
    this.i--;
    return this.list[this.i + 1];
  }

  next() {
    if (!this.canNext) {
      return [];
    }
    this.i++;
    return this.list[this.i];
  }
}
