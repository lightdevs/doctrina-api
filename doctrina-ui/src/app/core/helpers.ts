import { FormGroup } from '@angular/forms';

export const configureToastr = (toastr) => {
    toastr.toastrConfig.maxOpened = 1;
    toastr.toastrConfig.timeOut = 1000;
};

export const enum toastrTitle {
    Error = 'Error',
    Success = 'Success',
    Warning = 'Warning'
}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

