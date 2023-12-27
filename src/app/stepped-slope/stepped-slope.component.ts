import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SteppedSlopeRow } from '../models/stepped-slope-row.models';

@Component({
  selector: 'app-stepped-slope',
  templateUrl: './stepped-slope.component.html',
  styleUrls: ['./stepped-slope.component.css']
})
export class SteppedSlopeComponent {
  totalY: number = 0;
  totalX: number = 0;
  totalSlope: number = 0;
  tableRows: SteppedSlopeRow[] = [];

  @ViewChild('tableForm') tableForm?: NgForm;

  constructor() {
    this.reset();
  }

  reset() {
    this.tableRows = [];
    this.tableRows.push(new SteppedSlopeRow());
    this.updateTotals(true);
  }

  // When a row's Y1 height is updated, change its slope value
  updateRowY1(index: number, newValue: number) {
    this.tableRows[index].y1 = Number(newValue);
    this.tableRows[index].calculateSlope();

    // Propagate change to previous row
    if (index > 0) {
      this.tableRows[index - 1].y2 = Number(newValue);
      this.tableRows[index - 1].calculateSlope();
    }

    this.updateTotals();
  }

  // When a row's Y2 height is updated, change its slope value
  updateRowY2(index: number, newValue: number) {
    this.tableRows[index].y2 = Number(newValue);
    this.tableRows[index].calculateSlope();

    // Propagate change to next row
    if (index < this.tableRows.length - 1) {
      this.tableRows[index + 1].y1 = Number(newValue);
      this.tableRows[index + 1].calculateSlope();
    }

    this.updateTotals();
  }

  // When a row's length is updated, change its slope value
  updateRowX(index: number, newValue: number) {
    this.tableRows[index].x = Number(newValue);
    this.tableRows[index].calculateSlope();

    this.updateTotals();
  }

  // When a row's slope is updated, change its length value
  updateRowSlope(index: number, newValue: number) {
    this.tableRows[index].slope = Number(newValue);
    this.tableRows[index].calculateX();

    this.updateTotals();
  }

  // When adding a row, pre-populate values based on last row
  addRow() {
    const lastIndex = this.tableRows.length - 1;
    const y1 = this.tableRows[lastIndex].y2!;
    const x = this.tableRows[lastIndex].x!;
    const deltaY = this.tableRows[lastIndex].slope! * this.tableRows[lastIndex].x!;
    const y2 = y1 + deltaY;
    const newRow = new SteppedSlopeRow(y1, y2, x, this.tableRows[lastIndex].slope);
    this.tableRows.push(newRow);

    this.updateTotals();
  }

  // When deleting a row, update next row to cover gap
  deleteRow(index: number) {
    const lastIndex = this.tableRows.length - 1;
    const row = this.tableRows[index];

    // Update Y1 value of the next row to match the Y2 value of the previous row
    if (index > 0 && index < lastIndex) {
      this.tableRows[index + 1].y1 = this.tableRows[index - 1].y2;
      this.tableRows[index + 1].calculateSlope();
    }

    this.tableRows.splice(index, 1);

    this.updateTotals();
  }

  updateTotals(init: boolean = false) {
    const lastIndex = this.tableRows.length - 1;
    const totalY1 = this.tableRows[0].y1 || 0;
    const totalY2 = this.tableRows[lastIndex].y2 || 0;
    this.totalY = Math.abs(totalY2 - totalY1);
    this.totalX = this.tableRows.reduce((accumulator: number, currentValue: SteppedSlopeRow) => {
      return accumulator + (currentValue.x || 0);
    }, 0);
    this.totalSlope = (this.totalY === 0 || this.totalX === 0) ? 0 : this.totalY / this.totalX;

    if (!init) {
      // Use timeout to ensure form has rendered and form control state updates immediately
      setTimeout(() => {
        if (this.tableForm) {
          this.tableForm.form.markAllAsTouched();
        }
      }, 500);
    }
  }
}
