import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent {
  settings: any = {};

  constructor(public dialog: MatDialog) {}
}
