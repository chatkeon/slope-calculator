import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { Settings } from './models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settings: BehaviorSubject<Settings> = new BehaviorSubject<Settings>({
    rangedSlope: {
      slider: {
        y1: { min: 0, max: 500, step: 1 },
        y2: { min: 0, max: 500, step: 1 },
        x: { min: 0, max: 500, step: 1 },
        slope: { min: 0.5, max: 15.0, step: 0.01 }
      },
      table: {
        precision: 2,
        step: 0.01,
        maxRows: 20
      }
    }
  });

  constructor(public dialog: MatDialog) { }

  configure() {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      disableClose: true,
      data: this.settings.value
    });
  
    dialogRef.afterClosed().subscribe((updatedSettings?: Settings) => {
      if (updatedSettings) {
        this.settings.next(updatedSettings);
      }
    });
  }
}
