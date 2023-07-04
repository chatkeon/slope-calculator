import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { Settings } from './settings.model';

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
  settings: Settings = {
    precision: 2,
    minY1: 0,
    maxY1: 500,
    stepY1: 1,
    minY2: 0,
    maxY2: 500,
    stepY2: 1,
    minX: 0,
    maxX: 500,
    stepX: 1,
    minSlope: 0.5,
    maxSlope: 5.0,
    stepSlope: 0.01
  };
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

  constructor(public dialog: MatDialog) {
    this.currentYear = new Date().getFullYear().toString();
  }

  ngOnInit() {
    this.calculateChartRows();
  }

  lock(variableName: string) {
    this.lastUpdatedVariable = this.lockedVariable;
    this.lockedVariable = variableName;
    this.calculateChartRows();
  }

  toggleY2() {
    this.useY2 = !this.useY2;
    if (this.useY2) {
      this.displayedColumns = ['y1', 'y2', 'x', 'slope'];
      this.lock('y1');
    } else {
      this.displayedColumns = ['y1', 'x', 'slope'];
      this.lock('y2');
    }

    this.calculateChartRows();
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
    if (newValue < this.settings.minSlope) {
      newValue = this.settings.minSlope;
    }

    this.minSlope = newValue;
    this.calculateChartRows();
  }

  updateMaxSlope(newValue: number) {
    if (newValue > this.settings.maxSlope) {
      newValue = this.settings.maxSlope;
    }

    this.maxSlope = newValue;
    this.calculateChartRows();
  }

  openSettingsDialog() {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      disableClose: true,
      data: this.settings
    });

    dialogRef.afterClosed().subscribe((updatedSettings?: Settings) => {
      if (updatedSettings) {
        this.settings = updatedSettings;

        if (this.minSlope < this.settings.minSlope) {
          this.updateMinSlope(this.settings.minSlope);
        }

        if (this.maxSlope > this.settings.maxSlope) {
          this.updateMaxSlope(this.settings.maxSlope);
        }
      }
    });
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
            this.chartRows.push({
              y1: this.y1,
              y2: this.calculateY(this.y1, this.x, actualSlope),
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
            this.chartRows.push({
              y1: this.calculateY(this.y2, this.x, actualSlope),
              y2: this.y2,
              x: this.x,
              slope: actualSlope
            });
          }
        } else {
          if (this.lockedVariable === 'y1') {
            this.chartRows.push({
              y1: this.y1,
              y2: this.calculateY(this.y1, this.x, actualSlope),
              x: this.x,
              slope: actualSlope
            });
          } else {
            this.chartRows.push({
              y1: this.calculateY(this.y2, this.x, actualSlope),
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

  private calculateHeight(length: number, slope: number): number {
    return slope * length;
  }

  private calculateLength(height: number, slope: number): number {
    return height / slope;
  }

  private calculateY(otherY: number, length: number, slope: number): number {
    const height = this.calculateHeight(length, slope);
    return (otherY > height) ? (otherY - height) : (otherY + height);
  }

  private roundToHundredths(value: number) {
    return Math.round((value * 100)) / 100;
  }
}
