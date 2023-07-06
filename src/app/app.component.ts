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
      maxRows: 50
    }
  };
  lastUpdatedVariable = 'y1';
  lockedVariable = 'y2';
  tableFormat = '1.2-2';

  y1: number = 0.5;
  y2: number = 0.0;
  x: number = 100.0;
  minSlope: number = 0.5;
  maxSlope: number = 2.0;

  displayedColumns: string[] = ['y1', 'y2', 'x', 'slope'];
  tableRows: TableRow[] = [];
  truncatedTableRows = false;

  slopeCalcY1?: number;
  slopeCalcY2?: number;
  slopeCalcX?: number;
  slopeCalc?: number;

  formula1 = '(Y1 - Y2) / X = Slope';
  formula2 = '(Y2 - Y1) / X = Slope';

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

  getIcon(variableName: string): string {
    let icon = 'change_circle';
    if (this.lockedVariable === variableName) {
      icon = 'lock';
    } else if (this.lastUpdatedVariable === variableName) {
      icon = 'lock_open';
    }

    return icon;
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

        this.tableFormat = `1.${this.settings.table.precision}-${this.settings.table.precision}`;
        this.updateTable();
      }
    });
  }

  calculateSlope() {
    this.slopeCalc = undefined;
    let height = this.slopeCalcY1!;
    if (this.slopeCalcY2 !== undefined && this.slopeCalcY2 !== null) {
      height = Math.abs(this.slopeCalcY2! - this.slopeCalcY1!);
    }
    this.slopeCalc = height / this.slopeCalcX!;
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

      // Pin the last updated variable and the currently locked variable, calculate the remaining variable
      if (this.lastUpdatedVariable === 'y1') {
        if (this.lockedVariable === 'y2') {
          this.addTableRowCalcX(this.y1, this.y2, actualSlope);
        } else {
          this.addTableRowCalcY2(this.y1, this.x, actualSlope);
        }
      } else if (this.lastUpdatedVariable === 'y2') {
        if (this.lockedVariable === 'y1') {
          this.addTableRowCalcX(this.y1, this.y2, actualSlope);
        } else {
          this.addTableRowCalcY1(this.y2, this.x, actualSlope);
        }
      } else {
        if (this.lockedVariable === 'y1') {
          this.addTableRowCalcY2(this.y1, this.x, actualSlope);
        } else {
          this.addTableRowCalcY1(this.y2, this.x, actualSlope);
        }
      }

      variableSlope = variableSlope + this.settings.table.step;
    }
  }

  private addTableRowCalcY1(y2: number, x: number, slope: number) {
    this.tableRows.push({
      y1: this.calculateY(y2, x, slope),
      y2: y2,
      x: x,
      slope: slope
    });
  }

  private addTableRowCalcY2(y1: number, x: number, slope: number) {
    this.tableRows.push({
      y1: y1,
      y2: this.calculateY(y1, x, slope),
      x: x,
      slope: slope
    });
  }

  private addTableRowCalcX(y1: number, y2: number, slope: number) {
    this.tableRows.push({
      y1: y1,
      y2: y2,
      x: this.calculateLength(Math.abs(y2 - y1), slope),
      slope: slope
    });
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
