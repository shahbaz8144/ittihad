import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/_helpers/spinner.service';
//import { Spinkit} from 'ng-http-loader';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-render-body',
  templateUrl: './render-body.component.html',
  styleUrls: ['./render-body.component.css']
})
export class RenderBodyComponent implements OnInit {
   //public spinkit = Spinkit; // <===========
  // public prg=MatProgressSpinnerModule;

  constructor(public spinnerService: SpinnerService) { }

  ngOnInit(): void {
  }

}
