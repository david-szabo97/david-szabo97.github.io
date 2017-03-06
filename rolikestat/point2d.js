class Point2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(p) {
    return new Point2D(this.x + p.x, this.y + p.y);
  }

  subtract(p) {
    return new Point2D(this.x - p.x, this.y - p.y);
  }

  multiply(p) {
    return new Point2D(this.x * p.x, this.y * p.y);
  }

  divide(p) {
    return new Point2D(this.x / p.x, this.y / p.y);
  }

  rotate(theta) {
    let c = Math.cos(theta);
    let s = Math.sin(theta);

    return new Point2D(this.x * c - this.y * s, this.x * s + this.y * c);
  }
}