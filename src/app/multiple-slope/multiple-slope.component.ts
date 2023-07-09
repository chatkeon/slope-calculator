import { Component, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgForm } from '@angular/forms';

import { MultipleSlopeRow } from '../models/multiple-slope-row.models';

@Component({
  selector: 'app-multiple-slope',
  templateUrl: './multiple-slope.component.html',
  styleUrls: ['./multiple-slope.component.css']
})
export class MultipleSlopeComponent {
  private decimalPipe: DecimalPipe = new DecimalPipe('en-US');

  y1?: number;
  y2?: number;
  x?: number;
  minSlope?: number;
  maxSlope?: number;

  totalY1?: number;
  totalY2?: number;
  totalX?: number;
  tableRows: MultipleSlopeRow[] = [];

  @ViewChild('tableForm') tableForm!: NgForm;

  reset() {
    this.y1 = undefined;
    this.y2 = undefined;
    this.x = undefined;
    this.minSlope = undefined;
    this.maxSlope = undefined;
    this.tableRows = [];
  }

  generate() {
    // TODO: Validate inputs

    this.tableRows = [];

    const calcHeight = this.x! * this.maxSlope!;
    const gapHeight = Math.abs(this.y2! - this.y1! - calcHeight);
    const numRows = Math.floor(gapHeight / this.maxSlope!);
    const deltaX = this.roundTo2(this.x! / numRows);

    let deltaY, nextY;
    let currentY = this.roundTo2(this.y1!);
    for (let i = 0; i < numRows; i++) {
      deltaY = this.roundTo2(this.maxSlope! * deltaX);
      nextY = this.roundTo2(currentY + deltaY);
      this.tableRows.push(new MultipleSlopeRow(currentY, nextY, deltaX));
      currentY = nextY;
    }

    this.updateTotals();
  }

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

  // When a row's slope is updated, change its x value
  updateRowSlope(index: number, newValue: number) {
    this.tableRows[index].slope = Number(newValue);
    this.tableRows[index].calculateX();

    this.updateTotals();
  }

  // When adding a row, prepopulate values based on last row and minimum slope value
  addRow() {
    const lastIndex = this.tableRows.length - 1;
    const y1 = this.tableRows[lastIndex].y2;
    const x = this.roundTo2(this.tableRows[lastIndex].x);
    const deltaY = this.minSlope! * this.tableRows[lastIndex].x;
    const y2 = this.roundTo2(y1 + deltaY);
    this.tableRows.push(new MultipleSlopeRow(y1, y2, x));

    this.updateTotals();
  }

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

  updateTotals() {
    const lastIndex = this.tableRows.length - 1;
    this.totalY1 = this.tableRows[0].y1;
    this.totalY2 = this.tableRows[lastIndex].y2;
    this.totalX = this.tableRows.reduce((accumulator: number, currentValue: MultipleSlopeRow) => {
      return accumulator + currentValue.x;
    }, 0);

    // Use timeout to ensure form has rendered and form control state updates immediately
    setTimeout(() => {
      if (this.tableForm) {
        this.tableForm.form.markAllAsTouched();
      }
    }, 1000);
  }

  private roundTo2(value: number): number {
    return Number(this.decimalPipe.transform(value, '1.2-2'));
  }
}
