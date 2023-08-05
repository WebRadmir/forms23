import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MyValidators } from 'src/app/my.validators';
import { catchError, tap } from 'rxjs';
import { UsersAuthDBService } from 'src/app/services/users-auth-db.service';

export interface Person {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string;
  id?: number;
}

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  form!: FormGroup;
  error = '';
  success = false;

  constructor(private http: HttpClient, private usersDB: UsersAuthDBService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('Radmir', [
        Validators.maxLength(23),
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я]+$/),
        MyValidators.noSpaces,
      ]),
      surname: new FormControl('Yarmukhametov', [
        Validators.maxLength(23),
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я]+$/),
        MyValidators.noSpaces,
      ]),
      email: new FormControl('web@radmir.ru', {
        validators: [Validators.email, Validators.required],
        asyncValidators: [MyValidators.verifyUserInDB(this.usersDB, true)],
        updateOn: 'blur',
      }),
      password: new FormControl('Aa12!@34', [
        Validators.minLength(8),
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]+$/
        ),
        MyValidators.noSpaces,
      ]),
      confirmPassword: new FormControl('Aa12!@34', [
        Validators.required,
        MyValidators.confirmPassword('password'),
      ]),
      birthday: new FormControl('', [
        Validators.required,
        MyValidators.ageVerification,
      ]),
    });
  }

  submit() {
    if (this.form.valid) {
      const formattedDate = new Date(
        this.form.value.birthday
      ).toLocaleDateString('ru-RU');

      const formData: Person = {
        ...this.form.value,
        birthday: formattedDate,
      };
      console.log(formData);
      this.http
        .post('https://jsonplaceholder.typicode.com/users', formData)
        .pipe(
          tap(() => (this.success = true)),
          catchError((error: HttpErrorResponse) => {
            console.log('Ошибка отправки:', error);
            this.error = error.name;
            return [];
          })
        )
        .subscribe();
      this.form.reset();
    }
  }
}
