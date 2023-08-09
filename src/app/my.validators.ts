import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { HttpClientsService } from './services/httpClients/http-clients.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class MyValidators {
  static verifyUserInDB(
    usersDB: HttpClientsService,
    inversion?: boolean
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return usersDB.getEmails().pipe(
        map((userEmails) => {
          const hasUser = userEmails.includes(control.value.toLowerCase());
          if (inversion ? hasUser : !hasUser) {
            return { userNotFound: true };
          } else {
            return null;
          }
        })
      );
    };
  }

  static confirmPassword(passwordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.parent?.get(passwordControlName);

      if (passwordControl && control.value !== passwordControl.value) {
        control.setErrors({ notConfirm: true });
        return { notConfirm: true };
      } else {
        control.setErrors(null);
        return null;
      }
    };
  }

  static ageVerification(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const currentDate = new Date();
    const birthDate = new Date(control.value);

    const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    const dayDifference = currentDate.getDate() - birthDate.getDate();

    if (
      ageDifference > 18 ||
      (ageDifference === 18 && monthDifference >= 0 && dayDifference >= 0)
    ) {
      control.setErrors(null);
      return null;
    } else {
      control.setErrors({ underage: true });
      return { underage: true };
    }
  }

  static noSpaces(control: FormControl): { [key: string]: boolean } | null {
    const hasSpaces = /\s/.test(control.value);
    if (hasSpaces) {
      control.setErrors({ hasSpaces: true });
      return { hasSpaces: true };
    } else {
      return null;
    }
  }
}
