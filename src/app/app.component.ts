import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { Settings } from './settings.model';

declare interface TableRow {
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
  currentYear = '';
  settings: Settings = {
    slider: {
      y1: { min: 0, max: 500, step: 1 },
      y2: { min: 0, max: 500, step: 1 },
      x: { min: 0, max: 500, step: 1 },
      slope: { min: 0.5, max: 15.0, step: 0.01 }
    },
    table: {
      precision: 2,
      step: 0.01,
      maxRows: 150
    }
  };
  lastUpdatedVariable = 'y1';
  lockedVariable = 'y2';
  tableFormat = '1.0-2';

  y1: number = 0.5;
  y2: number = 0.0;
  x: number = 100.0;
  minSlope: number = 0.5;
  maxSlope: number = 2.0;

  displayedColumns: string[] = ['y1', 'y2', 'x', 'slope'];
  tableRows: TableRow[] = [];
  truncatedTableRows = false;

  constructor(public dialog: MatDialog) {
    this.currentYear = new Date().getFullYear().toString();
  }

  ngOnInit() {
    this.updateTable();
  }

  lock(variableName: string) {
    this.lastUpdatedVariable = this.lockedVariable;
    this.lockedVariable = variableName;
    this.updateTable();
  }

  updateY1(newValue: number) {
    this.y1 = newValue;
    this.lastUpdatedVariable = 'y1';
    this.updateTable();
  }

  updateY2(newValue: number) {
    this.y2 = newValue;
    this.lastUpdatedVariable = 'y2';
    this.updateTable();
  }

  updateX(newValue: number) {
    this.x = newValue;
    this.lastUpdatedVariable = 'x';
    this.updateTable();
  }

  updateMinSlope(newValue: number) {
    if (newValue < this.settings.slider.slope.min) {
      newValue = this.settings.slider.slope.min;
    }

    this.minSlope = Number(newValue);
    this.updateTable();
  }

  updateMaxSlope(newValue: number) {
    if (newValue > this.settings.slider.slope.max) {
      newValue = this.settings.slider.slope.max;
    }

    this.maxSlope = Number(newValue);
    this.updateTable();
  }

  openSettingsDialog() {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      disableClose: true,
      data: this.settings
    });

    dialogRef.afterClosed().subscribe((updatedSettings?: Settings) => {
      if (updatedSettings) {
        this.settings = updatedSettings;

        if (this.minSlope < this.settings.slider.slope.min) {
          this.minSlope = Number(this.settings.slider.slope.min);
        }

        if (this.maxSlope > this.settings.slider.slope.max) {
          this.maxSlope = Number(this.settings.slider.slope.max);
        }

        this.tableFormat = `1.0-${this.settings.table.precision}`;
        this.updateTable();
      }
    });
  }

  private updateTable() {
    this.tableRows = [];
    this.truncatedTableRows = false;

    let variableSlope: number = this.minSlope;
    let actualSlope: number;
    while (variableSlope <= this.maxSlope) {
      if (this.tableRows.length >= this.settings.table.maxRows) {
        this.truncatedTableRows = true;
        break;
      }

      actualSlope = variableSlope / 100;

      // Pin the last updated variable and the currently locked variable
      if (this.lastUpdatedVariable === 'y1') {
        if (this.lockedVariable === 'y2') {
          this.tableRows.push({
            y1: this.y1,
            y2: this.y2,
            x: this.calculateLength(Math.abs(this.y2 - this.y1), actualSlope),
            slope: actualSlope
          });
        } else {
          this.tableRows.push({
            y1: this.y1,
            y2: this.calculateY(this.y1, this.x, actualSlope),
            x: this.x,
            slope: actualSlope
          });
        }
      } else if (this.lastUpdatedVariable === 'y2') {
        if (this.lockedVariable === 'y1') {
          this.tableRows.push({
            y1: this.y1,
            y2: this.y2,
            x: this.calculateLength(Math.abs(this.y2 - this.y1), actualSlope),
            slope: actualSlope
          });
        } else {
          this.tableRows.push({
            y1: this.calculateY(this.y2, this.x, actualSlope),
            y2: this.y2,
            x: this.x,
            slope: actualSlope
          });
        }
      } else {
        if (this.lockedVariable === 'y1') {
          this.tableRows.push({
            y1: this.y1,
            y2: this.calculateY(this.y1, this.x, actualSlope),
            x: this.x,
            slope: actualSlope
          });
        } else {
          this.tableRows.push({
            y1: this.calculateY(this.y2, this.x, actualSlope),
            y2: this.y2,
            x: this.x,
            slope: actualSlope
          });
        }
      }

      variableSlope = variableSlope + this.settings.table.step;
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
}
