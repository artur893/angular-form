import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.css']
})
export class MainFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  tabIndex = 0

  changeTab() {
    this.tabIndex = 0
  }

}
