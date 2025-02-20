import { Component, OnInit, Inject } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from "@angular/material/snack-bar";
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
@Component({
  selector: 'app-basicsnackbar',
  templateUrl: './basicsnackbar.component.html',
  styleUrls: ['./basicsnackbar.component.css']
})
export class BasicsnackbarComponent implements OnInit {
  _obj: InboxDTO;
  constructor(
    public sbRef: MatSnackBarRef<BasicsnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
    , private inboxService: InboxService,
    private _snackBar: MatSnackBar) {
    this._obj = new InboxDTO();
  }

  ngOnInit(): void {
    //alert(this.data)

  }
  PinClose(val) {
    // alert(val)
    this._obj.PopupId = val;
    this.inboxService.AddPin(this._obj).subscribe(
      data => {
        console.log(data, "pindata")
        this._obj = data as InboxDTO;
        this._snackBar.dismiss(); //close funtion() in snackBar

        var dataII = localStorage.getItem('currentUser');
        if (dataII != null) {
          let cart = JSON.parse(dataII);
          cart[0].PinConversationCount = cart[0].PinConversationCount + 1;
          localStorage.setItem('currentUser', JSON.stringify(cart));
        }

      }
    )
  }

}
