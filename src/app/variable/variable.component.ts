import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
selector: 'app-variable',
templateUrl: './variable.component.html',
styleUrls: ['./variable.component.css']
})
export class VariableComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() value!: number;
  @Input() max!: number;
  @Input() min!: number;
  @Input() step!: number;
  @Input() locked!: boolean;

  @Output() valueChange = new EventEmitter<number>();
  @Output() requestLock = new EventEmitter<boolean>();

  constructor() {

  }

  updateValue(newValue: number) {
    this.valueChange.emit(newValue);
  }

  lock() {
    if (!this.locked) {
      this.requestLock.emit(true);
    }
  }
}
