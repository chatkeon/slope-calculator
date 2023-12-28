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
      this.x = Math.abs(this.y2! - this.y1!) / (this.slope! / 100);
    }
  }

  calculateY2() {
    if (this.isValid(this.y1) && this.isValid(this.x) && this.isValid(this.slope)) {
      const deltaY = this.x! * (this.slope! / 100);
      this.y2 = this.y1! + deltaY;
    }
  }

  calculateSlope() {
    if (this.isValid(this.y2) && this.isValid(this.y1) && this.isValid(this.x)) {
      this.slope = ((this.y2! - this.y1!) / this.x!) * 100;
    }
  }

  private isValid(value?: number) {
    return (value !== null) && (value !== undefined) && !isNaN(value);
  }
}
