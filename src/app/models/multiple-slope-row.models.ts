export class MultipleSlopeRow {
  y1: number;
  y2: number;
  x: number;
  slope!: number;

  constructor(y1: number, y2: number, x: number) {
    this.y1 = y1;
    this.y2 = y2;
    this.x = x;
    this.calculateSlope();
  }

  calculateX() {
    this.x = Math.abs(this.y2 - this.y1) / this.slope;
  }

  calculateSlope() {
    this.slope = Math.abs(this.y2 - this.y1) / this.x;
  }
}
