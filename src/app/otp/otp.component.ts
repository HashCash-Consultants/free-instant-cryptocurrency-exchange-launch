import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoreDataService } from '../core-data.service';
import { Router } from '@angular/router';
import * as $ from "jquery";
import { timer } from 'rxjs';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  otp: any;
  otpMobile: any;
  interval: any;
  intervalForSms: any;
  abc: any;
  abcForSms: any;
  phoneNumber:any; 
  constructor(
    private http: HttpClient,
    public data: CoreDataService,
    private route: Router
  ) { }

  ngOnInit() {
    this.phoneNumber = localStorage.getItem('phoneUsedForRegistration');
    this.data.alert('OTP has been sent to your email', 'success');
    $('#countermsg').css('display', 'block');
    $('#otpbtnverfy').css('display', 'none');
    var timeleft = this.data.timeIntervalForEmail;
    this.interval;
    var s = timer(1000, 1000);
    this.abc = s.subscribe(val => {
      this.interval = timeleft - val;
      $('#countermsg').html("<div class='text-center'>" + 'Resend in ' + this.interval + ' seconds' + "</div>");
      if (this.interval == 0) {
        $('#countermsg').css('display', 'none');
        $('#otpbtnverfy').css('display', 'block');
        this.abc.unsubscribe();
      }

    });
    this.resendOtpForMobile();
  }

  //Submitting OTP
  async onKeyupSendOtp() {
    //if((this.otp).length==5){

    if (
      this.otpMobile != '' && this.otp != '' &&
      this.otpMobile != undefined && this.otp != undefined &&
      this.otpMobile != null && this.otp != null
    ) {

      this.otpData();

    } else {
      this.data.alert('Please enter valid otp send to your email and phone no', 'danger');
    }
    //}
  }

  otpData() {
    if (this.otp != undefined) {
      this.data.alert("Loading...", "dark");
      var userId = localStorage.getItem('signup_user_id');
      var userId = userId;
      var otp = this.otp;
      var otpObj = {};
      otpObj['userId'] = userId;
      otpObj['otp'] = otp;
      otpObj['phoneOtp'] = this.otpMobile;
      var jsonString = JSON.stringify(otpObj);
      this.http.post<any>(this.data.WEBSERVICE + '/user/CheckOTP', jsonString, { headers: { 'Content-Type': 'application/json' } })
        .subscribe(response => {
          var result = response;
          if (result.error.error_data == '2') {
            this.data.loader = false;
            this.route.navigateByUrl('/login');
            this.data.alert(result.error.error_msg, 'info');
            this.data.handlePageReloadForecibily(100)
          }
          if (result.error.error_data == '1') {
            this.data.loader = false;
            this.data.alert(result.error.error_msg, 'danger');
          }

          if (result.error.error_data == '0') {
            var userId = result.userResult.user_id;
            localStorage.setItem('signup_user_id', userId);
            this.data.loader = false;
            this.data.alert('OTP Verified', 'success');
            this.route.navigateByUrl('/login');
            this.data.handlePageReloadForecibily(100)

          }
        }, reason => {
          this.data.loader = false;
          this.data.alert(reason, 'danger')

        });

    } else {
      this.data.loader = false;
      this.data.alert('Please fill up all the fields properly', 'warning');
    }
  }

  resendOtp() {
    $('#otpbtnverfy').css('display', 'none');
    var otpObj = {};
    otpObj['userId'] = localStorage.getItem('signup_user_id');
    var jsonString = JSON.stringify(otpObj);
    this.http.post<any>(this.data.WEBSERVICE + '/user/ResendOTP/registration', jsonString, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          this.data.alert('OTP has been sent to your email', 'success');
          $('#countermsg').css('display', 'block');

          var timeleft = this.data.timeIntervalForEmail;
          this.interval;
          var s = timer(1000, 1000);
          this.abc = s.subscribe(val => {
            this.interval = timeleft - val;
            $('#countermsg').html("<div class='text-center'>" + 'Resend in ' + this.interval + ' seconds' + "</div>");
            if (this.interval == 0) {
              $('#countermsg').css('display', 'none');
              $('#otpbtnverfy').css('display', 'block');
              this.abc.unsubscribe();
            }

          });
        }
      },
        reason => {
          this.data.alert('Could Not Connect To Server', 'warning')
        });
  }


    /* Method defination for resend OTP for mobile  */
    async resendOtpForMobile() {
      $('#otpbtnverfymobile').css('display', 'none');
      let payload = {
        phone: localStorage.getItem('phoneUsedForRegistration'),
        countryCode: localStorage.getItem('phoneCountryUsedForRegistration'),
  
      }
      payload['userId'] = localStorage.getItem('signup_user_id')
      let isOtpSend = await this.data.handleSendOtpInSms(payload, 'registrationmobileotp');
      if (isOtpSend) {
        $('#countermsgmobile').css('display', 'block');
  
        var timeleft = this.data.timeIntervalForSms;
        this.intervalForSms;
        var s = timer(1000, 1000);
        this.abcForSms = s.subscribe(val => {
          this.intervalForSms = timeleft - val;
          $('#countermsgmobile').html("<div class='text-center'>" + 'Resend in ' + this.intervalForSms + ' seconds' + "</div>");
          if (this.intervalForSms == 0) {
            $('#countermsgmobile').css('display', 'none');
            $('#otpbtnverfymobile').css('display', 'block');
            this.abcForSms.unsubscribe();
          }
  
        });
      } else {
  
      }
    }

}
