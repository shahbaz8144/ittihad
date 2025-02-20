import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-html-sample',
  templateUrl: './html-sample.component.html',
  styleUrls: ['./html-sample.component.css']
})
export class HtmlSampleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(function() { $("#hideDiv").fadeOut(1500); }, 3000);
  }


  
  // editprof1() {
  //   document.getElementById("proview").classList.add("kt-quick-panel--on");
  //   document.getElementById("scrd").classList.add("position-fixed");
  //   document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block", "opacity-1");
  //   document.getElementById("proset").classList.toggle("pronew");
  //   document.getElementById("prodetails").classList.toggle("pronew");
  //   document.querySelector("tabs_li").classList.toggle("tab_one");
  // }

}
