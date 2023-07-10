export class SteppedSlopeRow {
  y1?: number;
  y2?: number;
  x?: number;
  slope?: number;

  constructor(y1?: number, y2?: number, x?: number, slope?: number) {
    this.y1 = y1;
    this.y2 = y2;
    this.x = x;
    this.slope = slope;
  }

  calculateX() {
    if (this.isValid(this.y2) && this.isValid(this.y1) && this.isValid(this.slope)) {
      this.x = Math.abs(this.y2! - this.y1!) / this.slope!;
    }
  }

  calculateSlope() {
    if (this.isValid(this.y2) && this.isValid(this.y1) && this.isValid(this.x)) {
      this.slope = (this.y2! - this.y1!) / this.x!;
    }
  }

  private isValid(value?: number) {
    return (value !== null) && (value !== undefined) && !isNaN(value);
  }
}
