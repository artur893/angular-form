import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  userDataInputs = {
    login: ''
  }

  statusInfo: string = ''

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  resetPassword() {
    if (this.userDataInputs.login) {
      this.http.post<any>('http://127.0.0.1:5001/users/resetPassword', this.userDataInputs.login.toLowerCase()).subscribe({
        next: data => this.statusInfo = data.msg,
        error: err => this.statusInfo = err.error.msg
      })
    } else { this.statusInfo = "Uzupełnij formularz" }
  }
}
