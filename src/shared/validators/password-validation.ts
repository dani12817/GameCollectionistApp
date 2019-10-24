import { ValidatorFn, AbstractControl } from '@angular/forms';

export function passwordValidator(options: any): ValidatorFn {
    const letterMatcher = /[a-zA-Z]/;
    const lowerCaseLetterMatcher = /[a-z]/;
    const upperCaseLetterMatcher = /[A-Z]/;
    const numberMatcher = /[0-9]/;
    const specialCharactersMatcher = /[-+=_.,:;~`!@#$%^&*(){}<>\[\]"'\/\\]/;

    return (control: AbstractControl): {[key: string]: any} => {
        if (!control.value) {
            return null;
        }

        const errors = {};

        if (options.minLength > 0 && control.value.length < options.minLength) {
            errors['passwordMinLengthRequired'] = {
                minLength: options.minLength
            };
          }
        if (options.maxLength >= 0 && control.value.length > options.maxLength) {
            errors['passwordMaxLengthExceeded'] = {
              maxLength: options.maxLength
            };
        }
        if (options.requireLetters && !letterMatcher.test(control.value)) {
            errors['passwordLetterRequired'] = true;
        }
        if (options.requireLowerCaseLetters && !lowerCaseLetterMatcher.test(control.value)) {
            errors['passwordLowerCaseLetterRequired'] = true;
        }
        if (options.requireUpperCaseLetters && !upperCaseLetterMatcher.test(control.value)) {
            errors['passwordUpperCaseLetterRequired'] = true;
        }
        if (options.requireNumbers && !numberMatcher.test(control.value)) {
            errors['passwordNumberRequired'] = true;
        }
        if (options.requireSpecialCharacters && !specialCharactersMatcher.test(control.value)) {
            errors['passwordSpecialCharacterRequired'] = true;
        }
        return Object.keys(errors).length > 0 ? errors : null;
    };
}

export function matchPasswords(passwordToConfirm: string) {
    let passwordConfirmationControl;
    let passwordControl;

    return (control: AbstractControl): {[key: string]: any} => {
        if (!control.parent) {
            return null;
        }

        if (!passwordConfirmationControl) {
            passwordConfirmationControl = control;
            passwordControl = control.parent.get(passwordToConfirm);
            if (!passwordControl) {
                throw new Error('matchOtherValidator(): other control is not found in parent group');
            }
            passwordControl.valueChanges.subscribe(function () {
                passwordConfirmationControl.updateValueAndValidity();
            });
        }

        if (!passwordControl) {
            return null;
        }

        if (passwordControl.value !== passwordConfirmationControl.value) {
            return {
                matchOther: true
            };
        }
        return null;
    };
}
