import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Settings } from '../settings.model';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent {
  precision: number;
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

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Settings) {
    this.precision = data.precision;
    this.minY1 = data.minY1;
    this.maxY1 = data.maxY1;
    this.stepY1 = data.stepY1;
    this.minY2 = data.minY2;
    this.maxY2 = data.maxY2;
    this.stepY2 = data.stepY2;
    this.minX = data.minX;
    this.maxX = data.maxX;
    this.stepX = data.stepX;
    this.minSlope = data.minSlope;
    this.maxSlope = data.maxSlope;
    this.stepSlope = data.stepSlope;
  }

  updatePrecision(newValue: number) {
    this.precision = Math.round(newValue);
  }

  save() {
    const updatedSettings: Settings = {
      precision: this.precision,
      minY1: this.minY1,
      maxY1: this.maxY1,
      stepY1: this.stepY1,
      minY2: this.minY2,
      maxY2: this.maxY2,
      stepY2: this.stepY2,
      minX: this.minX,
      maxX: this.maxX,
      stepX: this.stepX,
      minSlope: this.minSlope,
      maxSlope: this.maxSlope,
      stepSlope: this.stepSlope
    };

    this.dialogRef.close(updatedSettings);
  }
}
