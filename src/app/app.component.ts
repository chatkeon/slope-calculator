import { Component } from '@angular/core';

import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentYear = '';

  slopeCalcY1?: number;
  slopeCalcY2?: number;
  slopeCalcX?: number;
  slopeCalc?: number;

  constructor(private settingsService: SettingsService) {
    this.currentYear = new Date().getFullYear().toString();
  }

  openSettingsDialog() {
    this.settingsService.configure();
  }

  calculateSlope() {
    this.slopeCalc = undefined;
    let height = this.slopeCalcY1!;
    if (this.slopeCalcY2 !== undefined && this.slopeCalcY2 !== null) {
      height = Math.abs(this.slopeCalcY2! - this.slopeCalcY1!);
    }
    this.slopeCalc = height / this.slopeCalcX!;
  }
}
