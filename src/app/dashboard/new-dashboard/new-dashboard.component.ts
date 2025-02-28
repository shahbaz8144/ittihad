import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.css']
})
export class NewDashboardComponent implements OnInit {
  images = [
    { path: 'https://yrglobaldocuments.blob.core.windows.net/documents/Banner/131/588228_Day-1_App-Banner.jpg' },
    { path: 'https://yrglobaldocuments.blob.core.windows.net/documents/Banner/44/160413_Help%20Desk_001%203.png' },
    { path: 'https://yrglobaldocuments.blob.core.windows.net/documents/Banner/147/235199_DMS-Banner.jpg' },
    { path: 'https://yrglobaldocuments.blob.core.windows.net/documents/Banner/145/690704_Magical%20Gingery.jpg' }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
