import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent implements OnInit {
  constructor(private http: HttpClient) { }

  userDataInputs = {
    login: '',
    password: ''
  }

  statusInfo: string = ''

  ngOnInit(): void {
  }

  authUser() {
    this.http.post<any>('http://127.0.0.1:5001/auth/login', { email: this.userDataInputs.login.toLowerCase(), password: this.userDataInputs.password }).subscribe({
      next: data => this.statusInfo = data.msg,
      error: err => this.statusInfo = err.error.msg
    })
  }
}
