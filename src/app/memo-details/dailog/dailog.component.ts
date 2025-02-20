import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InboxService } from 'src/app/_service/inbox.service';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-dailog',
  templateUrl: './dailog.component.html',
  styleUrls: ['./dailog.component.css']
})
export class DailogComponent implements OnInit {
  _obj: InboxDTO;
  _ReplyList: any;
  selected: any = [];
  _SelectedUserName:string

  constructor(
    public dialogRef: MatDialogRef<DailogComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any
    ,private _snackBar: MatSnackBar
    ,private inboxService: InboxService
    ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.GetrestoreReplies(this.data.MailId,this.data.UserId)
  }

  GetrestoreReplies(mailid:number,userid:number){
    this.inboxService.ReplyListForRestore(mailid,userid).subscribe(
      data=>{
        this._obj = data as InboxDTO;
        this._ReplyList = JSON.parse(this._obj.ReplyListJson);
        this._SelectedUserName=this._obj.UserName;
        if(this._ReplyList.length==0){
          this.dialogRef.close();
          this.onYesClick();
        }
        // if (this._obj.message == "1") {
        //   this._snackBar.open('Restore Successfully', 'End now', {
        //     duration: 5000,
        //     horizontalPosition: "center",
        //     verticalPosition: "top",
        //   });
        //   this.dialogRef.close();
        // }
        // else{
        //   this._snackBar.open('Something went wrong please try again later', 'End now', {
        //     duration: 5000,
        //     horizontalPosition: "center",
        //     verticalPosition: "top",
        //   });
        // }
      }
    )
  }
  onChange(id) {
    if (!this.selected.includes(id)) {
        this.selected.push(id);
    }
    else {
      this.selected = this.selected.filter(item => item !== id)
    }
  } 
  onYesClick(){
    let JsonData=[];
    this.selected.forEach(element => {
      var JsonObject={}
      JsonObject["ReplyId"]=element;
      JsonObject["MailId"]=this.data.MailId;
      JsonObject["UserId"]=this.data.UserId;
      JsonData.push(JsonObject);

    });
     
    this.inboxService.AddReplyListForRestore(JSON.stringify(JsonData),this.data.MailId,this.data.UserId).subscribe(
      data=>{
        this._obj = data as InboxDTO;

        if (this._obj.message == "1") {
          this._snackBar.open('Restore Successfully', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
          this.dialogRef.close();
        }
        else{
          this._snackBar.open('Something went wrong please try again later', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
        }
      }
    )
  }
}
