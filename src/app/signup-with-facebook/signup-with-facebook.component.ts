import { Component, OnInit,DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CoreDataService } from '../core-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UUID } from 'angular2-uuid';
import { CookieService } from 'ngx-cookie-service';


import * as $ from "jquery";


@Component({
  selector: 'app-signup-with-facebook',
  templateUrl: './signup-with-facebook.component.html',
  styleUrls: ['./signup-with-facebook.component.css']
})
export class SignupWithFacebookComponent implements OnInit {

  public facebookname: string = '';
  public facebookemail: string = '';
  public userphone: string = '';
  public broker: string = '';
  public userpassword: string = '';
  public userrepassword1: string = '';
  public userreferralCode: string = '';
  public passwordMatch: boolean = false;
  public uuidValue: string;
  public selectedCountryPhone = '1';
  public selectedCountryNameAlias = 'us'
  public step: any = 1;
  franchiseCode;
  referredByUser;
  referrerTypeUser;
  referredBy;
  referralCode;
  referCode;
  invalid = false;
  captcha: string | undefined;
  captchaNextButton: boolean;
  public Browser: any;
  public Browserversion: any;
  public DeviceId: any;
  public OS: any;
  public OSversion: any;
  public devicetype: any;
  public Ismobole: any;
  public Istablet: any;
  public Isdesktop: any;
  deviceInfo = null;

  constructor(private route: Router, private activeRoute: ActivatedRoute, public data: CoreDataService, private http: HttpClient, private modalService: NgbModal, private deviceService: DeviceDetectorService, private cookie: CookieService) { 
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  /* Method defination for next button click */
  handleNextButtonClick = () => {
    if (this.step == 1) {
      if (this.facebookemail != '' && this.facebookname != '' && this.userphone != '' && this.is_name(this.facebookname)) {
        this.step++;

      } else {
        this.data.alert('Please provide valid details', 'danger')
      }
    } else if (this.step == 2) {
      if (this.broker != '') {
        this.step++;

      } else {
        this.data.alert('Please provide valid Membership/Broker Id', 'danger')
      }
    } else if (this.step == 3) {
      if (this.passwordMatch) {
        this.step++;

      } else {
        this.data.alert('Please provide valid password', 'danger')
      }
    } else {

      this.step++;



    }
  }
  handleBackButtonClick = () => {
    this.step--;
  }
  handleSubmitButtonClick = () => {
    let payload = {}
    this.http.get<any>('https://api.ipgeolocation.io/ipgeo?apiKey=693da481af1b4a3e80e3dfea9115dc52')
      .subscribe(response => {
        payload['latitude'] = response.latitude;
        payload['longitude'] = response.longitude;
        payload['ipAddress'] = response.ip;
        payload['location'] = response.country_name;

        var promoCode = this.referCode;
        payload['phone'] = this.selectedCountryPhone + this.userphone;

        /* if(this.franchiseCode!=null){
          payload['referredBy'] = this.franchiseCode;
          payload['referrerType'] = 'F';
         }
         else if(this.invalid==true){
           delete this.signupObj['referredBy']
         }
         else{
          this.signupObj['referredBy'] = this.referredByUser;
          this.signupObj['referrerType'] = this.referrerTypeUser;
         } */

        payload['browser'] = this.Browser + '' + this.Browserversion;

        payload['deviceId'] = this.uuidValue.toString();

        if (this.Ismobole == true) {
          payload['deviceType'] = 'mobile';
        }
        else if (this.Istablet == true) {
          payload['deviceType'] = 'tablet';
        }
        else if (this.Isdesktop == true) {
          payload['deviceType'] = 'Desktop browser';
        }
        var deviceID = this.cookie.get('deviceID');
        if (deviceID == "" || deviceID == "undefined") {
          payload['deviceId'] = this.uuidValue;
          this.cookie.set('deviceID', this.uuidValue.toString(), 60);
        }
        else {
          payload['deviceId'] = this.cookie.get('deviceID');
        }
        //this.signupObj['brokerId'] = this.data.BROKERID
        payload['gRecaptchaResponse'] = this.captcha;
        payload['loginType'] = 2;
        if(localStorage.getItem('socialLoginType') == 'facebook'){
          payload['socialMediaId'] = localStorage.getItem('facebook_app_id');
        }else if(localStorage.getItem('socialLoginType') == 'google'){
          payload['socialMediaId'] = localStorage.getItem('google_app_id');
        }else if(localStorage.getItem('socialLoginType') == 'linkedin'){
          payload['socialMediaId'] = localStorage.getItem('linkedin_app_id');
        }
        payload['brokerId'] = this.broker
        let name: any = this.facebookname.split(' ');
        if (name.length == '3') {
          payload['firstName'] = name[0]
          payload['middleName'] = name[1]
          payload['lastName'] = name[2]
        } else {
          payload['firstName'] = name[0]
          payload['lastName'] = name[1]
          payload['middleName'] = ''
        }
        payload['repassword1'] = this.userrepassword1;
        payload['password'] = this.userpassword;
        payload['country'] = '';
        payload['email']=this.facebookemail;

        localStorage.setItem('phoneUsedForRegistration',payload['phone']);


        var jsonString = JSON.stringify(payload);
        console.log('payload data', jsonString);

        // if (this.captcha != '') {
        this.http.post<any>(this.data.WEBSERVICE + '/user/AddUserDetails', jsonString, { headers: { 'Content-Type': 'application/json' } })
          .subscribe(response => {
            // wip(0);
            var result = response;
            if (result.error.error_data != '0') {
              this.data.alert(result.error.error_msg, 'danger');
            } else {
              var userId = result.userResult.userId;
              localStorage.setItem('signup_user_id', userId);
              this.data.alert('Registration Done,  Kindly check your email for verification token', 'success');
              this.data.loader = false;
              this.route.navigateByUrl('/otp');
            }
          }, reason => {
            // wip(0);
            this.data.alert('Internal Server Error', 'danger')

          });

        ///

        // } else {
        //   this.data.loader = false;
        //   this.data.alert('Captcha Unverified', 'warning');
        // }
      })
  }


  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    if (this.captcha == undefined || this.captcha == null) {
      this.captchaNextButton = false;
    }
    else {
      this.captchaNextButton = true
    }

  }
  getNumber(e) {
    console.log('phone number', e);

  }
  telInputObject(e) {
    console.log('telInputObject', e);

  }
  generateUUID() {
    this.uuidValue = UUID.UUID();
    return this.uuidValue;
  }
  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    this.Browser = JSON.stringify(this.deviceInfo.browser);
    this.Browserversion = JSON.stringify(this.deviceInfo.browser_version);
    this.Ismobole = isMobile;
    this.Istablet = isTablet;
    this.Isdesktop = isDesktopDevice;
  }


  onCountryChange(e) {
    console.log('countryCode', e);
    this.selectedCountryPhone = e.dialCode
    this.selectedCountryNameAlias = e.iso2
    this.checkPhone()

    // phoneObj['phone'] = this.selectedCountryPhone + phoneValue;


  }
  checkEmail() {
    if (this.facebookemail != undefined && this.facebookemail != '') {
        //if (this.is_mail(this.facebookemail) == true) {
          var emailValue = this.facebookemail;
          var emailObj = {};
          emailObj['email'] = emailValue;
          var jsonString = JSON.stringify(emailObj);
          this.http.post<any>(this.data.WEBSERVICE + '/user/CheckEmail', jsonString, {
            headers: {

              'Content-Type': 'application/json'
            }
          })
            .subscribe(response => {
              var result = response;
              if (result.error.error_data != '0') {
                this.data.alert(result.error.error_msg, 'danger');
              } else {
                if (result.userResult.checkEmailPhoneFlag == 1) {
                  this.data.alert('Email already registered , please try with another email address', 'warning');
                  this.facebookemail = '';
                } else {

                }
              }
            }, reason => {
              this.data.alert('Internal Server Error', 'danger')
            });
        /* } else {
        } */
    } else {
      this.data.alert('Please Provide Email Id', 'warning');
    }
  }
  handleInfoModal = (elem) => {
    this.modalService.open(elem, { centered: true });
  }
  checkPhone() {
    if (this.userphone != '' && this.userphone != undefined) {
      // wip(1);
      var phoneValue = this.selectedCountryPhone + this.userphone;
      var phoneObj = {};
      phoneObj['phone'] = phoneValue;
      var jsonString = JSON.stringify(phoneObj);

      this.http.post<any>(this.data.WEBSERVICE + '/user/CheckPhone', jsonString, {
        headers: {

          'Content-Type': 'application/json'
        }
      })
        .subscribe(response => {
          // wip(0);
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            if (result.userResult.checkEmailPhoneFlag == 1) {
              this.data.alert('Phone No. already registered , please try with another phone no.', 'warning');
              this.userphone = '';
            } else {

            }
          }
        }, reason => {
          // wip(0);
          this.data.alert('Internal Server Error', 'danger')

        });
    } else {
      this.data.alert('Please Provide Phone No.', 'warning')
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

  //check password
  checkPassword() {
    var password = this.userpassword;
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
    if (string.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!@#.])[a-zA-Z0-9$!@.#]{8,35}$/)) {
      return true;
    } else {
      return false;
    }
  }

  is_mail(email) {
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return regex.test(email);
  }

  is_name(name){
    let regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    return regex.test(name);
  }
  confirmPassword(e) {
    if (
      (this.userpassword != '' && this.userpassword != undefined) &&
      (this.userrepassword1 != '' && this.userrepassword1 != undefined)
    ) {
      if (this.userpassword == this.userrepassword1) {
        $('.confirm_password_text').html('Password Matched');
        $('.confirm_password_text').css('color', 'lightgreen');
        this.passwordMatch = true;
      } else {
        $('.confirm_password_text').html('Password  Mismatched');
        $('.confirm_password_text').css('color', 'red');
        this.passwordMatch = false;
      }
    } else {
      $('.confirm_password_text').html('');
      this.passwordMatch = false;
    }

  }

  checkReferralCode() {
    if (this.userreferralCode != '' && this.userreferralCode != undefined) {
      this.referCode = this.userreferralCode;
      this.invalid = true
      var referralCodeObj = {};
      referralCodeObj['referralCode'] = this.referCode;
      var jsonString = JSON.stringify(referralCodeObj);
      this.http.post<any>(this.data.WEBSERVICE + '/user/checkReferralCode', jsonString, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .subscribe(response => {
          var result = response;
          if (result.error.error_data != '0') {
            this.step = 4;
            this.userreferralCode = ''
            this.data.alert(result.error.error_msg, 'danger');
            this.invalid = true;
          } else {
            this.data.alert('valid Referral Code', 'success');
            this.referredByUser = this.referCode;
            this.referrerTypeUser = result.userResult.referrerType;
            this.invalid = false
          }
        }, reason => {
          this.data.alert('Internal Server Error', 'danger')

        });
    } else {
      //this.data.alert('Please Provide Referral Code.', 'warning')
    }
  }

      /* Method defination for broker id check */
      handleBrokerIdCheck = (e) => {
        let value  = e.target.value;
        if(value != ''){
    
          let payload = {
            brokerId : value
          }
    
          this.http.post<any>(this.data.WEBSERVICE + '/user/CheckBroker', JSON.stringify(payload), {
            headers: {
    
              'Content-Type': 'application/json'
            }
          })
            .subscribe(response => {
              // wip(0);
              var result = response;
              if (result.error.error_data != '0') {
                e.target.value = ''
                this.broker = '';
                this.step = 2;
                this.data.alert(result.error.error_msg, 'danger');
              } else {
                
              }
            }, reason => {
              // wip(0);
              this.data.alert('Internal Server Error', 'danger')
    
            });
        }
    
        
      }

  ngOnInit() {
    //console.log(localStorage.getItem('facebook_email'),localStorage.getItem('facebook_name'))
    if(localStorage.getItem('socialLoginType') == 'facebook'){
      if (localStorage.getItem('facebook_email') != 'undefined') {

        this.facebookemail = localStorage.getItem('facebook_email')
        this.checkEmail();
      } else {
        this.facebookemail = ''
      }
  
      if (localStorage.getItem('facebook_name') != 'undefined') {
  
        this.facebookname = localStorage.getItem('facebook_name')
      } else {
        this.facebookname = ''
      }

    }else if(localStorage.getItem('socialLoginType') == 'google'){
      if (localStorage.getItem('google_email') != 'undefined') {

        this.facebookemail = localStorage.getItem('google_email')
        this.checkEmail();
      } else {
        this.facebookemail = ''
      }
  
      if (localStorage.getItem('google_name') != 'undefined') {
  
        this.facebookname = localStorage.getItem('google_name')
      } else {
        this.facebookname = ''
      }
    }if(localStorage.getItem('socialLoginType') == 'linkedin'){
      if (localStorage.getItem('linkedin_email') != 'undefined') {

        this.facebookemail = localStorage.getItem('linkedin_email')
        this.checkEmail();
      } else {
        this.facebookemail = ''
      }
  
      if (localStorage.getItem('linkedin_name') != 'undefined') {
  
        this.facebookname = localStorage.getItem('linkedin_name')
      } else {
        this.facebookname = ''
      }
    }

    if(
      localStorage.getItem('referralCodeFromUrl') != undefined && 
      localStorage.getItem('referralCodeFromUrl') != 'undefined' && 
      localStorage.getItem('referralCodeFromUrl') != 'null' 
    ){
      this.userreferralCode = localStorage.getItem('referralCodeFromUrl')
    }

    if(
      localStorage.getItem('brokerIdFromUrl') != undefined && 
      localStorage.getItem('brokerIdFromUrl') != 'undefined' && 
      localStorage.getItem('brokerIdFromUrl') != 'null' 
    ){
      this.broker = localStorage.getItem('brokerIdFromUrl');
    }
    
    

    this.generateUUID();
    this.epicFunction();
    $(document).ready(function () {
      var scroll_pos = 0;
      let color = '#ffffff';
      let picker = "body::-webkit-scrollbar-thumb {background:" + color + ";}body::-webkit-scrollbar-track {background-color:#636666;}";
      let new_stylesheet = "<style type='text/css' id='currentCSS'>" + picker + "</style>";

      //check if stylsheet exists          
      let existingStylesheet = $("#currentCSS");
      if (existingStylesheet.length) { $(existingStylesheet).replaceWith(new_stylesheet); }
      else { $(new_stylesheet).appendTo('head'); }
    });
  }

  ngDoCheck(){
    
  }

}
