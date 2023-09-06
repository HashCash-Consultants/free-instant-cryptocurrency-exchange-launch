import { Component, OnInit } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import { BodyService } from '../body.service'
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  emailValue: any;
  private checkmailApi: Subscription;
  refferedList: Array<string> = [];
  showReferredUsers: boolean = false
  Themecolor: string;
  constructor(private http: HttpClient, public data: CoreDataService, public main: BodyService) { }
  signupObj: any = {};
  isRefferdListRendered: boolean = false;

  

  ngOnInit() {

    this.main.getUserDetails();
    this.renderRefferedUsers();

  }

  ngDoCheck() {
    if (!this.isRefferdListRendered) {
      // this.renderRefferedUsers();
    }


    this.Themecolor = localStorage.getItem('themecolor');
    //console.log('saved theme', this.Themecolor)
  }

  themeChangedHandler(val) {

    this.Themecolor = val;

  }

  /* Method defination for facebook share */
  initateFaceBookShare = () => {
    let url = this.data.getFacebookMetaTagValue('og:url')
    let picture = this.data.getFacebookMetaTagValue('og:image')
    let title = this.data.getFacebookMetaTagValue('og:title');
    let description = this.data.getFacebookMetaTagValue('og:description')
    let payload = {}
    //TODO: call Karthik's API 
    this.checkmailApi = this.http.post<any>('http://50.18.68.182:10094/api/socialmedia/facebookshare', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(response => {
        /* var result = response;
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          this.data.alert('Successfully Sent', 'success');
        } */
      }, reason => {
        this.data.alert('Internal Server Error', 'danger')
      });
  }

  referralEmail() {
    this.emailValue = this.signupObj.email;
    // var emailValue = this.signupObj.email;
    var referObj = {};
    referObj['email'] = this.emailValue;
    //referObj['userId'] = localStorage.getItem('user_id');
    referObj['uuid'] = localStorage.getItem('uuid');
    var jsonString = JSON.stringify(referObj);
    this.checkmailApi = this.http.post<any>(this.data.WEBSERVICE + '/user/referFriend', jsonString, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          this.data.alert('Successfully Sent', 'success');
        }
      }, reason => {
        this.data.alert('Internal Server Error', 'danger')
      });
  }
  /* Method defination to render reffered list */
  renderRefferedUsers() {
    if (this.main.referralCode != undefined && this.main.referralCode != null) {
      var referObj = {};
      referObj['referredBy'] = this.main.referralCode;
      var jsonString = JSON.stringify(referObj);
      this.checkmailApi = this.http.post<any>(this.data.WEBSERVICE + '/user/allUsersByReferredUser', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            this.refferedList = result.users;
            this.isRefferdListRendered = true;
            if (this.refferedList.length > 0) {
              this.showReferredUsers = true;
            } else {
              this.showReferredUsers = false;
            }
          }
        }, reason => {
          this.data.alert('Internal Server Error', 'danger')
        });
    }
  }

  is_mail(email) {
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return regex.test(email);
  }

  ngOnDestroy() {
    localStorage.setItem('isPromotionNeedsReload', 'true')
    if (this.checkmailApi != undefined) {
      this.checkmailApi.unsubscribe();
    }
  }

}
