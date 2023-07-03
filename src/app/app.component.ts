import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare interface ChartRow {
  height: number;
  length: number;
  slope: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentYear = '';
  lockedVariable = 'slope';
  height = 0.05;
  length = 5.0;
  slope = 1.0;

  displayedColumns: string[] = ['height', 'length', 'slope'];
  chartRows: ChartRow[] = [];

  // @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  // private ctx!: CanvasRenderingContext2D;

  constructor() {
    this.currentYear = new Date().getFullYear().toString();
  }

  ngOnInit() {
    // this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    this.calculateChartRows('height');
    this.draw();
  }

  updateHeight(newValue: number) {
    this.height = newValue;
    if (this.lockedVariable === 'length') {
      this.slope = this.calculateSlope(this.height, this.length) * 100;
    } else {
      this.length = this.calculateLength(this.height, this.getActualSlope());
    }

    this.calculateChartRows('height');
    this.draw();
  }

  updateLength(newValue: number) {
    this.length = newValue;
    if (this.lockedVariable === 'height') {
      this.slope = this.calculateSlope(this.height, this.length) * 100;
    } else {
      this.height = this.calculateHeight(this.getActualSlope(), this.length);
    }

    this.calculateChartRows('length');
    this.draw();
  }

  updateSlope(newValue: number) {
    this.slope = newValue;
    if (this.lockedVariable === 'height') {
      this.length = this.calculateLength(this.height, this.getActualSlope());
    } else {
      this.height = this.calculateHeight(this.getActualSlope(), this.length);
    }

    this.calculateChartRows('slope');
    this.draw();
  }

  private getActualSlope() {
    return this.slope / 100;
  }

  private calculateHeight(slope: number, length: number): number {
    return slope / length;
  }

  private calculateLength(height: number, slope: number): number {
    return height / slope;
  }

  private calculateSlope(height: number, length: number): number {
    return height / length;
  }

  private calculateChartRows(variable: string) {
    this.chartRows = [];
    this.chartRows.push({
      height: this.height,
      length: this.length,
      slope: this.getActualSlope()
    });

    let rowStep = (variable === 'slope') ? 0.0001 : 0.01;
    if (variable === 'height') {
      let variableHeight = this.height - rowStep;
      for (let i = 0; i < 5; i++) {
        if (variableHeight < 0) {
          break;
        }
        if (this.lockedVariable === 'length') {
          this.chartRows.unshift({
            height: variableHeight,
            length: this.length,
            slope: this.calculateSlope(variableHeight, this.length)
          });
        } else {
          this.chartRows.unshift({
            height: variableHeight,
            length: this.calculateLength(variableHeight, this.getActualSlope()),
            slope: this.getActualSlope()
          });
        }
        variableHeight = variableHeight - rowStep;
      }
      variableHeight = this.height + rowStep;
      for (let i = 0; i < 5; i++) {
        if (this.lockedVariable === 'length') {
          this.chartRows.unshift({
            height: variableHeight,
            length: this.length,
            slope: this.calculateSlope(variableHeight, this.length)
          });
        } else {
          this.chartRows.unshift({
            height: variableHeight,
            length: this.calculateLength(variableHeight, this.getActualSlope()),
            slope: this.getActualSlope()
          });
        }
        variableHeight = variableHeight + rowStep;
      }
    } else if (variable === 'length') {
      let variableLength = this.length - rowStep;
      for (let i = 0; i < 5; i++) {
        if (variableLength < 0) {
          break;
        }
        if (this.lockedVariable === 'height') {
          this.chartRows.unshift({
            height: this.height,
            length: variableLength,
            slope: this.calculateSlope(this.height, variableLength)
          });
        } else {
          this.chartRows.unshift({
            height: this.calculateHeight(variableLength, this.getActualSlope()),
            length: variableLength,
            slope: this.getActualSlope()
          });
        }
        variableLength = variableLength - rowStep;
      }
      variableLength = this.length + rowStep;
      for (let i = 0; i < 5; i++) {
        if (this.lockedVariable === 'height') {
          this.chartRows.unshift({
            height: this.height,
            length: variableLength,
            slope: this.calculateSlope(this.height, variableLength)
          });
        } else {
          this.chartRows.unshift({
            height: this.calculateHeight(variableLength, this.getActualSlope()),
            length: variableLength,
            slope: this.getActualSlope()
          });
        }
        variableLength = variableLength + rowStep;
      }
    } else {
      let variableSlope = this.getActualSlope() - rowStep;
      for (let i = 0; i < 5; i++) {
        if (variableSlope < 0) {
          break;
        }
        if (this.lockedVariable === 'height') {
          this.chartRows.unshift({
            height: this.height,
            length: this.calculateLength(this.height, variableSlope),
            slope: variableSlope
          });
        } else {
          this.chartRows.unshift({
            height: this.calculateHeight(this.length, variableSlope),
            length: this.length,
            slope: variableSlope
          });
        }
        variableSlope = variableSlope - rowStep;
      }
      variableSlope = this.getActualSlope() + rowStep;
      for (let i = 0; i < 5; i++) {
        if (this.lockedVariable === 'height') {
          this.chartRows.unshift({
            height: this.height,
            length: this.calculateLength(this.height, variableSlope),
            slope: variableSlope
          });
        } else {
          this.chartRows.unshift({
            height: this.calculateHeight(this.length, variableSlope),
            length: this.length,
            slope: variableSlope
          });
        }
        variableSlope = variableSlope + rowStep;
      }
    }
  }

  private draw() {
    // const scaleFactor = 300 / this.length;
    // this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Calculate X offset
    // const xValue = this.length * scaleFactor;
    // const xOffset = Math.floor((this.canvas.nativeElement.width - xValue) / 2);

    // Calculate Y offset
    // const yValue = this.height * scaleFactor;
    // const yOffset = Math.floor((this.canvas.nativeElement.height - yValue) / 2);

    // Draw line
    // this.ctx.fillStyle = 'black';
    // this.ctx.beginPath();
    // this.ctx.moveTo(xOffset, yOffset);
    // this.ctx.lineTo((xValue + xOffset), (yValue + yOffset));
    // this.ctx.stroke();
  }
}
