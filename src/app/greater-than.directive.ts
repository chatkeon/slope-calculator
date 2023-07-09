import { Directive, Input } from '@angular/core';
import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
 
@Directive({
  selector: '[greaterThan]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: GreaterThanDirective, multi: true }
  ]
})
export class GreaterThanDirective implements Validator {
  @Input('greaterThan') greaterThanValue?: number;

  validate(control: FormControl) {
    const value: number = Number(control.value);

    let error = null;
    if (!isNaN(value) && (this.greaterThanValue !== undefined) && (value <= this.greaterThanValue)) {
        error = { 'greaterThanError': true }
    }
 
    return error;
  }
}
