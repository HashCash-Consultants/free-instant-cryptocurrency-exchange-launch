import { Component, OnInit,DoCheck } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { CoreDataService } from '../core-data.service';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  email: any;
  password: any;
  secure_token: any;
  repassword: any;
  forgetpwdObj:any={};
  isChangePasswordButtonEnabled:boolean=false;
  messageotp;
  interval;
  abc: any;
  isGetCodeButtonDisabled: boolean = false;


  constructor(private http:HttpClient, public data:CoreDataService, private route:Router) { }

  ngOnInit() {
    console.log(localStorage.getItem('forgetPasswordOtpInterval'));
    if(localStorage.getItem('forgetPasswordOtpInterval') != '0' && localStorage.getItem('forgetPasswordOtpInterval') != 'undefined' && localStorage.getItem('forgetPasswordOtpInterval') != 'NaN' && localStorage.getItem('forgetPasswordOtpInterval') != 'null' && localStorage.getItem('forgetPasswordOtpInterval') != null && localStorage.getItem('forgetPasswordOtpInterval') != undefined){
      var timeleft = parseInt(localStorage.getItem('forgetPasswordOtpInterval'));
            this.interval;
            var s = timer(1000, 1000);
            this.abc = s.subscribe(val => {
                this.interval = timeleft - val;
                
                this.messageotp = 'Resend in ' + this.interval + ' seconds';
                this.isGetCodeButtonDisabled = true;
                localStorage.setItem('forgetPasswordOtpInterval',this.interval);
               

                if (this.interval == 0 || this.interval < 0) {
                  this.messageotp = ''
                    this.isGetCodeButtonDisabled = false;
                    this.abc.unsubscribe();
                }
            });
    }
  }
  ngDoCheck() {
    //console.log(this.forgetpwdObj.repassword1,this.forgetpwdObj.password)
    if (
      (this.forgetpwdObj.password != '' && this.forgetpwdObj.password != undefined) &&
      (this.forgetpwdObj.repassword1 != '' && this.forgetpwdObj.repassword1 != undefined) && 
      (this.forgetpwdObj.secureToken != '' && this.forgetpwdObj.secureToken != undefined) && 
      (this.forgetpwdObj.gRecaptchaResponse != '' && this.forgetpwdObj.gRecaptchaResponse != undefined)  &&
      (this.forgetpwdObj.password == this.forgetpwdObj.repassword1 )
    ) {
      //console.log('in if')
      this.isChangePasswordButtonEnabled = true
    }else{
      //console.log('in else')
      this.isChangePasswordButtonEnabled = false
    }
  }

  confirmPassword(e) {
    if (
      (this.forgetpwdObj.password != '' && this.forgetpwdObj.password != undefined) &&
      (this.forgetpwdObj.repassword1 != '' && this.forgetpwdObj.repassword1 != undefined)
    ) {
      if (this.forgetpwdObj.password == this.forgetpwdObj.repassword1) {
        $('.confirm_password_text').html('Password Matched');
        $('.confirm_password_text').css('color', 'lightgreen');
        $('#submit_btn').removeAttr('disabled');
      } else {
        $('.confirm_password_text').html('Password  Mismatched');
        $('.confirm_password_text').css('color', 'red');
        $('#submit_btn').attr('disabled', 'disabled');
        this.isChangePasswordButtonEnabled = false
      }
    } else {
  
    }
  
  }
  checkPassword() {
    var password = this.forgetpwdObj.password;
    if (password != '' && password != undefined && password.length >= 8) {
      var passwordStatus = this.checkAlphaNumeric(password);
      if (passwordStatus == false) {
        this.data.alert('The password should be of min 8,max 35 characters and must contain at least one uppercase, one lowercase, number and a special character($@#.!).', 'warning');
      } else {

      }
    }
    else {
      this.data.alert('Password should be minimum 8 characters', 'warning');
    }
  }

  checkAlphaNumeric(string) {
      if (string.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!@.])[a-zA-Z0-9$!.@]{8,35}$/)){
      return true;
    } else {
      return false;
    }
  }

  showHide() {
    $(".showHide-password").each(function () {
      $(this).toggleClass("fa-eye fa-eye-slash");
      var input = $($(this).attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "password");
      }
    });
  }

  forgotPassword(isValid){

     if(isValid){
       var jsonString=JSON.stringify(this.forgetpwdObj);
       this.http.post<any>(this.data.WEBSERVICE+'/user/ResetPassword',jsonString,{headers: {
           'Content-Type': 'application/json'
         }})
      .subscribe(response=>{
        //  wip(0);
         var result=response;
         if(result.error.error_data!='0'){
           this.data.alert(result.error.error_msg,'danger');
         }else{
  
         this.data.alert('Password successfully reset','success');
         this.route.navigateByUrl('/login');
         this.data.handlePageReloadForecibily(100)
  
         }
  
       },function(reason){
        //  wip(0);
         this.data.alert('Internal Server Error','danger')
       });
     }else{
      //$('.submit_btn').attr('disabled','disabled');
       this.data.alert('Please provide valid email','warning');
     }
   }

   resolved(captchaResponse: string) {

    this.forgetpwdObj.gRecaptchaResponse = captchaResponse;
    console.log('resolved captcha with response' + this.forgetpwdObj.gRecaptchaResponse)
    /* if (
      (this.forgetpwdObj.password != '' && this.forgetpwdObj.password != undefined) &&
      (this.forgetpwdObj.repassword1 != '' && this.forgetpwdObj.repassword1 != undefined) && 
      (this.forgetpwdObj.secureToken != '' && this.forgetpwdObj.secureToken != undefined) && 
      (this.forgetpwdObj.gRecaptchaResponse != '' && this.forgetpwdObj.gRecaptchaResponse != undefined)  &&
      (this.forgetpwdObj.repassword1 == this.forgetpwdObj.repassword1 )

    ) {
      this.isChangePasswordButtonEnabled = true
    }else{
      this.isChangePasswordButtonEnabled = false
    } */
    
  }

  /* Method defination for send secure token */
  handleSendSecureToken = () => {
    if(this.forgetpwdObj.email != '' && this.forgetpwdObj.email != undefined){
      var tokenObj={};
      tokenObj['email']=this.forgetpwdObj.email;
      var jsonString=JSON.stringify(tokenObj);
     
      this.isGetCodeButtonDisabled = true;
      this.http.post<any>(this.data.WEBSERVICE+'/user/SendOtp/forgetpassword',jsonString,{headers: {
          'Content-Type': 'application/json'
        }})
     .subscribe(response=>{
        // wip(0);

        var result = response;
        if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
            this.isGetCodeButtonDisabled = false;
        } else {
          this.data.alert('Secure Token sent to registered email','success');
            var timeleft = this.data.timeIntervalForEmail;
            this.interval;
            var s = timer(1000, 1000);
            this.abc = s.subscribe(val => {
                this.interval = timeleft - val;
                
                this.messageotp = 'Resend in ' + this.interval + ' seconds';
                this.isGetCodeButtonDisabled = true;
                localStorage.setItem('forgetPasswordOtpInterval',this.interval);
               

                if (this.interval == 0 || this.interval < 0) {
                  this.messageotp = ''
                    this.isGetCodeButtonDisabled = false;
                    this.abc.unsubscribe();
                }
            });
        }
        

      },function(reason){
        // wip(0);
        this.data.alert('Internal Server Error','danger')
      });
    }else{
      this.data.alert('Please provide valid email','warning');
    }
  }

}
