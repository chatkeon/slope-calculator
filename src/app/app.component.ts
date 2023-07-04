import { Component, OnInit } from '@angular/core';

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
  lastUpdatedVariable = 'y1';
  lockedVariable = 'y2';

  currentYear = '';
  y1 = 0.5;
  y2 = 0.0;
  x = 100.0;
  minSlope = 0.5;
  maxSlope = 2.0;

  displayedColumns: string[] = ['y1', 'x', 'slope'];
  chartRows: ChartRow[] = [];

  constructor() {
    this.currentYear = new Date().getFullYear().toString();
  }

  ngOnInit() {
    this.calculateChartRows();
  }

  lock(variableName: string) {
    this.lockedVariable = variableName;
  }

  toggleY2(event: any) {
    this.useY2 = !this.useY2;
    if (this.useY2) {
      this.displayedColumns = ['y1', 'y2', 'x', 'slope'];
      this.lock('y1');
    } else {
      this.displayedColumns = ['y1', 'x', 'slope'];
      this.lock('y2');
    }

    this.calculateChartRows();

    // Keep the settings menu open
    event.stopPropagation();
  }

  updateY1(newValue: number) {
    this.y1 = newValue;
    this.lastUpdatedVariable = 'y1';
    this.calculateChartRows();
  }

  updateY2(newValue: number) {
    this.y2 = newValue;
    this.lastUpdatedVariable = 'y2';
    this.calculateChartRows();
  }

  updateX(newValue: number) {
    this.x = newValue;
    this.lastUpdatedVariable = 'x';
    this.calculateChartRows();
  }

  updateMinSlope(newValue: number) {
    if (newValue < this.defaultMinSlope) {
      newValue = this.defaultMinSlope;
    }

    this.minSlope = newValue;
    this.calculateChartRows();
  }

  updateMaxSlope(newValue: number) {
    if (newValue > this.defaultMaxSlope) {
      newValue = this.defaultMaxSlope;
    }

    this.maxSlope = newValue;
    this.calculateChartRows();
  }

  openSettingsDialog() {
    // TODO: Implement
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

      if (this.useY2) {
        // If using Y2, pin the last updated variable and the currently locked variable
        if (this.lastUpdatedVariable === 'y1') {
          if (this.lockedVariable === 'y2') {
            this.chartRows.push({
              y1: this.y1,
              y2: this.y2,
              x: this.calculateLength(Math.abs(this.y2 - this.y1), actualSlope),
              slope: actualSlope
            });
          } else {
            const height = this.calculateHeight(this.x, actualSlope);
            this.chartRows.push({
              y1: this.y1,
              y2: Math.abs(height - this.y1),
              x: this.x,
              slope: actualSlope
            });
          }
        } else if (this.lastUpdatedVariable === 'y2') {
          if (this.lockedVariable === 'y1') {
            this.chartRows.push({
              y1: this.y1,
              y2: this.y2,
              x: this.calculateLength(Math.abs(this.y2 - this.y1), actualSlope),
              slope: actualSlope
            });
          } else {
            const height = this.calculateHeight(this.x, actualSlope);
            this.chartRows.push({
              y1: Math.abs(height - this.y2),
              y2: this.y2,
              x: this.x,
              slope: actualSlope
            });
          }
        } else {
          const height = this.calculateHeight(this.x, actualSlope);
          if (this.lockedVariable === 'y1') {
            this.chartRows.push({
              y1: this.y1,
              y2: Math.abs(height - this.y1),
              x: this.x,
              slope: actualSlope
            });
          } else {
            this.chartRows.push({
              y1: Math.abs(height - this.y2),
              y2: this.y2,
              x: this.x,
              slope: actualSlope
            });
          }
        }
      } else {
        // If not using Y2, pin the last updated variable
        if (this.lastUpdatedVariable === 'y1') {
          this.chartRows.push({
            y1: this.y1,
            y2: 0,
            x: this.calculateLength(this.y1, actualSlope),
            slope: actualSlope
          });
        } else {
          this.chartRows.push({
            y1: this.calculateHeight(this.x, actualSlope),
            y2: 0,
            x: this.x,
            slope: actualSlope
          });
        }
      }
      variableSlope = this.roundToHundredths(variableSlope + 0.1);
    }
  }

  private roundToHundredths(value: number) {
    return Math.round((value * 100)) / 100;
  }
}
