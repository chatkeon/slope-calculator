import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare interface ChartRow {
  y1: number;
  y2: number;
  x: number;
  slope: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  defaultMinSlope = 0.5;
  defaultMaxSlope = 5;
  useY2 = false;

  currentYear = '';
  lastEdited = 'y';
  y1 = 0.5;
  y2 = 0.0;
  x = 100.0;
  minSlope = 0.5;
  maxSlope = 2.0;

  displayedColumns: string[] = ['y1', 'x', 'slope'];
  chartRows: ChartRow[] = [];

  // @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  // private ctx!: CanvasRenderingContext2D;

  constructor() {
    this.currentYear = new Date().getFullYear().toString();
  }

  ngOnInit() {
    // this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    this.calculateChartRows();
    this.draw();
  }

  toggleY2(event: any) {
    this.useY2 = !this.useY2;
    if (this.useY2) {
      this.displayedColumns = ['y1', 'y2', 'x', 'slope'];
    } else {
      this.displayedColumns = ['y1', 'x', 'slope'];
    }

    this.calculateChartRows();

    // Keep the settings menu open
    event.stopPropagation();
  }

  updateY1(newValue: number) {
    this.y1 = newValue;
    this.lastEdited = 'y';
    this.calculateChartRows();
    this.draw();
  }

  updateY2(newValue: number) {
    this.y2 = newValue;
    this.lastEdited = 'y';
    this.calculateChartRows();
    this.draw();
  }

  updateX(newValue: number) {
    this.x = newValue;
    this.lastEdited = 'x';
    this.calculateChartRows();
    this.draw();
  }

  updateMinSlope(newValue: number) {
    if (newValue < this.defaultMinSlope) {
      newValue = this.defaultMinSlope;
    }

    this.minSlope = newValue;
    this.calculateChartRows();
    this.draw();
  }

  updateMaxSlope(newValue: number) {
    if (newValue > this.defaultMaxSlope) {
      newValue = this.defaultMaxSlope;
    }

    this.maxSlope = newValue;
    this.calculateChartRows();
    this.draw();
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

  private calculateChartRows() {
    this.chartRows = [];
    let variableSlope = this.minSlope;
    let actualSlope;
    while (variableSlope <= this.maxSlope) {
      actualSlope = variableSlope / 100;
      if (this.lastEdited === 'x') {
        const y = this.calculateHeight(this.x, actualSlope);
        if (this.useY2) {
          this.chartRows.push({
            y1: this.y1,
            y2: (y - this.y1),
            x: this.x,
            slope: actualSlope
          });
        } else {
          this.chartRows.push({
            y1: y,
            y2: 0,
            x: this.x,
            slope: actualSlope
          });
        }
      } else {
        if (this.useY2) {
          this.chartRows.push({
            y1: this.y1,
            y2: this.y2,
            x: this.calculateLength(Math.abs(this.y2 - this.y1), actualSlope),
            slope: actualSlope
          });
        } else {
          this.chartRows.push({
            y1: this.y1,
            y2: 0,
            x: this.calculateLength(this.y1, actualSlope),
            slope: actualSlope
          });
        }
      }
      variableSlope = this.roundToHundredths(variableSlope + 0.1);
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

  private roundToHundredths(value: number) {
    return Math.round((value * 100)) / 100;
  }
}
