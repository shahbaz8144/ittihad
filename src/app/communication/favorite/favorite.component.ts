import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  // @Output() demo = new EventEmitter<string>();
  @Input() favObj: InboxDTO;
  _obj: InboxDTO;
  FavoriteVal: boolean;
  MailId: number;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;

  constructor(private inboxService: InboxService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  ngOnInit() {
    //alert(this.favObj.Favorite);
    this.FavoriteVal = this.favObj.Favorite;
    this.MailId=this.favObj.MailId;
  }
  ChangeFavoriteValue(val: boolean, _mailId: number) {

    if (val == true) {
      val = false;
    }
    else if (val == false) {
      val = true;
    }
   
    this.inboxService.FavStatus(_mailId, val,this.currentUserValue.createdby)
      .subscribe(data => {
        // this._obj = data as InboxDTO;
        if (data['Message'] != "1") {
          alert('Please try again')
        }
        else{
          this.FavoriteVal=val;
        }
      });
  }

  // ngOnChanges(changes:SimpleChanges){
  //   console.log(changes);
  // }

}
