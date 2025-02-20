import { Component, OnInit } from '@angular/core';
//import { Spinkit} from 'ng-http-loader';

@Component({
  selector: 'app-empty-layout',
  templateUrl: './empty-layout.component.html',
  styleUrls: ['./empty-layout.component.css']
})
export class EmptyLayoutComponent implements OnInit {
  //public spinkit = Spinkit; // <===========

  constructor() { }

  ngOnInit(): void {
  }

}
