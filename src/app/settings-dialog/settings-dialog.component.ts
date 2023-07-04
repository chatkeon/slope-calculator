import { Component, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Settings } from '../settings.model';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements AfterViewInit {
  minY1: number;
  maxY1: number;
  stepY1: number;
  minY2: number;
  maxY2: number;
  stepY2: number;
  minX: number;
  maxX: number;
  stepX: number;
  minSlope: number;
  maxSlope: number;
  stepSlope: number;
  precision: number;
  tableStep: number;
  maxRows: number;

  @ViewChild('settingsForm') settingsForm!: NgForm;

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Settings) {
    this.minY1 = data.slider.y1.min;
    this.maxY1 = data.slider.y1.max;
    this.stepY1 = data.slider.y1.step;
    this.minY2 = data.slider.y2.min;
    this.maxY2 = data.slider.y2.max;
    this.stepY2 = data.slider.y2.step;
    this.minX = data.slider.x.min;
    this.maxX = data.slider.x.max;
    this.stepX = data.slider.x.step;
    this.minSlope = data.slider.slope.min;
    this.maxSlope = data.slider.slope.max;
    this.stepSlope = data.slider.slope.step;

    this.precision = data.table.precision;
    this.tableStep = data.table.step;
    this.maxRows = data.table.maxRows;
  }

  ngAfterViewInit() {
    // Wrap in timeout to avoid ExpressionChangedAfterItHasBeenChecked error
    setTimeout(() => {
      this.settingsForm.form.markAllAsTouched();
    }, 0);
  }

  save() {
    const updatedSettings: Settings = {
      slider: {
        y1: { min: this.minY1, max: this.maxY1, step: this.stepY1 },
        y2: { min: this.minY2, max: this.maxY2, step: this.stepY2 },
        x: { min: this.minX, max: this.maxX, step: this.stepX },
        slope: { min: this.minSlope, max: this.maxSlope, step: this.stepSlope }
      },
      table: {
        precision: this.precision,
        step: this.tableStep,
        maxRows: this.maxRows
      }
    };

    this.dialogRef.close(updatedSettings);
  }
}
