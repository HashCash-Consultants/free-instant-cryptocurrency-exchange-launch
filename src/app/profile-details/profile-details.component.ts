import { Component, OnInit } from '@angular/core';
import { BodyService } from '../body.service';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { CoreDataService } from '../core-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  editName: any;
  editEmail: any;
  editOtp: any;
  public loghistory: any;
  page = 1;
  public totalcount: any;
  pgn: any = [];
  Themecolor: string;
  constructor(public main: BodyService, private http: HttpClient, public data: CoreDataService, private modalService: NgbModal) { }

  ngOnInit() {
    this.main.getDashBoardInfo();
    this.main.getUserDetails();
    this.main.getUserTransaction();
    this.getloginhistory(this.page);
  }

  resendOtpForOutgoing(content) {
    this.modalService.open(content, { centered: true });
    var otpObj = {};
    otpObj['email'] = localStorage.getItem('email');
    var jsonString = JSON.stringify(otpObj);
    this.http.post<any>(this.data.WEBSERVICE + '/user/ResendOTP', jsonString, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          $('.send_btn').show();
          $('.get_Otp_btn').hide();
          this.editName = this.main.fullName;
          this.editEmail = this.main.email;
        }
      },
        function (reason) {
          this.data.alert('Session Timeout. Login Again', 'warning');
        });
  }

  getloginhistory(pageno) {
    this.loghistory = null;
    var loghistoryInfoObj = {};
    //loghistoryInfoObj['userId'] = localStorage.getItem('user_id');
    loghistoryInfoObj['uuid'] = localStorage.getItem('uuid');
    loghistoryInfoObj['noOfItemsPerPage'] = 20;
    loghistoryInfoObj['pageNo'] = pageno;
    var jsonString = JSON.stringify(loghistoryInfoObj);
    this.http.post<any>(this.data.WEBSERVICE + '/user/GetLoginHistory', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        this.loghistory = response.loginDetails;
        this.totalcount = response.totalRows;
        this.pgn = [];
        for (var i = 1; i <= Math.ceil(this.totalcount / 20); i++) {
          this.pgn.push(i);
        }
      })
  }


  pager(pg) {
    this.getloginhistory(pg);
  }
  pagerNext(pg) {

    pg++;
    this.page = pg;
    this.getloginhistory(pg);
  }
  pagerPre(pg) {
    pg--;
    this.page = pg;
    this.getloginhistory(pg);
  }

  ngDoCheck() {

    this.Themecolor = localStorage.getItem('themecolor');
    //console.log('saved theme', this.Themecolor)
  }

  themeChangedHandler(val){

    this.Themecolor = val;

  }




}