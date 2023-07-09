import { Directive, Input } from '@angular/core';
import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
 
@Directive({
  selector: '[greaterThan]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: GreaterThanDirective, multi: true }
  ]
})
export class GreaterThanDirective implements Validator {
  // TODO: Figure out how to re-run validation on the control when the greaterThan input value changes
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
