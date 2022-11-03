import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  constructor(private http: HttpClient) { }


  @Output() changeTabEmit = new EventEmitter();

  statusInfo: string = ''

  barValue: number = 0

  registerForm: FormGroup;

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), this.containsCapital, this.containsLowercase, this.containsNumber]),
      confirm: new FormControl('', [Validators.required])
    }, { validators: this.checkPasswordMatch })
  }

  checkPasswordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirm = control.get('confirm');
    if (password.value !== confirm.value) {
      this.registerForm.controls['confirm'].setErrors({ passwordMatch: false })
      return { passwordMatch: false }
    } else {
      return null
    }
  };

  containsCapital(control: FormControl) {
    const uppercaseTest = new RegExp("(?=.*[A-Z])")
    return uppercaseTest.test(control.value) ? null : { containsCapital: true }
  }

  containsLowercase(control: FormControl) {
    const lowercaseTest = new RegExp("(?=.*[a-z])")
    return lowercaseTest.test(control.value) ? null : { containsLowercase: true }
  }

  containsNumber(control: FormControl) {
    const numberTest = new RegExp("(?=.*[0-9])")
    return numberTest.test(control.value) ? null : { containsNumber: true }
  }

  changeProgressBarValue() {
    const errors = this.registerForm.controls["password"].errors
    if (errors) {
      const numberOfErrors = Object.keys(errors).length
      switch (numberOfErrors) {
        case 1:
          this.barValue = 75
          break
        case 2:
          this.barValue = 50
          break
        case 3:
          this.barValue = 25
          break
        case 4:
          this.barValue = 0
      }
    } else this.barValue = 100
  }

  loginErrorMessage() {
    if (this.registerForm.controls['login'].hasError('required')) {
      return 'Pole musi być uzupełnione'
    }
    return this.registerForm.controls['login'].hasError('email') ? 'Wymagany format e-mail' : ''
  }

  passwordErrorMessage() {
    if (this.registerForm.controls['password'].hasError('required')) {
      return 'Pole musi być uzupełnione'
    } else if (this.registerForm.controls['password'].hasError('containsCapital')) {
      return 'Wymagana wielka litera'
    } else if (this.registerForm.controls['password'].hasError('containsLowercase')) {
      return 'Wymagana mała litera'
    } else if (this.registerForm.controls['password'].hasError('containsNumber')) {
      return 'Wymagana cyfra'
    } else if (this.registerForm.controls['password'].hasError('minlength')) {
      return 'Wymagane minimum 8 znaków'
    } return null
  }

  confirmErrorMessage() {
    return (this.registerForm.errors) ? 'Hasła muszą być zgodne' : ''
  }

  changeInfoTextColor(typeOfError: string) {
    if (this.registerForm.controls['password'].errors) {
      if (this.registerForm.controls['password'].errors[typeOfError]) {
        return 'rgb(255, 15, 15)'
      } else {
        return 'rgb(0, 128, 0)'
      }
    } return 'rgb(255, 15, 15)'
  }

  changeInfoDigitTextColor() {
    if (this.registerForm.controls['password'].errors) {
      if (this.registerForm.controls['password'].errors['minlength'] || this.registerForm.value['password'] === '') {
        return 'rgb(255, 15, 15)'
      } else {
        return 'rgb(0, 128, 0)'
      }
    } return 'rgb(255, 15, 15)'
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post<any>('http://127.0.0.1:5001/users', { email: this.registerForm.value.login.toLowerCase(), password: this.registerForm.value.password }).subscribe({
        next: data => this.statusInfo = data.msg,
        error: err => this.statusInfo = err.msg
      });
      setTimeout(() => {
        this.changeTabEmit.emit()
      }, 2500)
      setTimeout(() => {
        this.statusInfo = ''
      }, 3000)
    } else {
      this.statusInfo = "Uzupełnij formularz"
    }
  }
}
