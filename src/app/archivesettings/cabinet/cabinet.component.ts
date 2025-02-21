import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  cabinet_add() {
    document.getElementsByClassName("addrck")[0].classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  closeInfo() {
   document.getElementsByClassName("addrck")[0].classList.remove("kt-quick-panel--on");
   document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
   document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
 }
}
