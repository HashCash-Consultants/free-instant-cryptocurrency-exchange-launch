import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoreDataService } from '../core-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from "jquery";
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UUID } from 'angular2-uuid';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  contries: any;
  captcha: string|undefined;
  loadmail: any;
  dataemail: any;
  dateofbirth;
  model;
  file1: any;
  file2: any;
  loader: boolean;
  ipaddress;
  latitude;
  longitude;
  location;
  invalid=false;
  franchiseCode;
  referredByUser;
  referrerTypeUser;
  referredBy;
  referralCode;
  referCode;
  passwordMatch:boolean = false;
  isBrokerIdComingFromUrl : boolean = false;
  isReferalComingFromUrl : boolean = false;
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
  // @Output() messageEvent = new EventEmitter<string>();
  //search: (text$: Observable<string>) => Observable<any>;

  title = 'identity';
  countries;
  man;
  reg: any = {};
  reg2: any = {};
  errormessage;
  private countryApi: Subscription;
  private signupApi: Subscription;
  private checkmailApi: Subscription;
  private checkphoneApi: Subscription;
  private userdtlApi: Subscription;
  private latlongApi: Subscription;
  private checkReffealCodeApi: Subscription;
  uuidValue: string;
  selectedCountryPhone = '1';
  captchaNextButton: boolean;
  showPhoneDisclaimer: boolean = false;
  constructor(private http: HttpClient, 
    public data: CoreDataService, 
    private route: Router, 
    private activeRoute: ActivatedRoute, 
    private deviceService: DeviceDetectorService, 
    private cookie: CookieService,
    private modalService:NgbModal,
    private meta: Meta,
    public titleService: Title
    ) {
      this.titleService.setTitle('Broker Exchange SignUp | Broker')
      this.meta.addTags
      ([
      { name: 'description', content: 'Signup to the Broker crypto trading platform and explore the opportunities in trading, brokerage, payments, tokenization, ICOs & Banking' },
        {name: 'title',content:'Broker Exchange SignUp | Broker'}
      ]);
     }

  signupObj: any = {
    country: '',
    latitude: '',
    longitude: '',
    ipAddress: '',
    location: '',
    referredBy: ''
  };
  signupObj1: any = {};
  ngOnInit() {
    const firstParam: string = this.activeRoute.snapshot.queryParamMap.get('franchise_code');
    const secondParam: string = this.activeRoute.snapshot.queryParamMap.get('referal_code');
    const thirdParam: string = this.activeRoute.snapshot.queryParamMap.get('broker_id');
    const fourthParam: string = this.activeRoute.snapshot.queryParamMap.get('email');
    this.franchiseCode = firstParam;
    if(secondParam != null && secondParam != ''  && secondParam != undefined){
      this.signupObj1.referralCode = secondParam;
      this.isReferalComingFromUrl = true
      localStorage.setItem('referralCodeFromUrl',secondParam)
      this.checkReferralCode();
    }
    if(fourthParam != null && fourthParam != ''  && fourthParam != undefined){
      this.signupObj.email = fourthParam;
      this.checkEmail();
    }
    if(thirdParam != null && thirdParam != ''  && thirdParam != undefined){
      this.signupObj.brokerId = thirdParam;
      this.isBrokerIdComingFromUrl = true
      localStorage.setItem('brokerIdFromUrl',thirdParam)
      this.handleBrokerIdCheck();
    }else{
      this.signupObj.brokerId = this.data.BROKERID;
    }
    //console.log('query param',secondParam,thirdParam);
     this.getLoc();
    this.checkurlemail(this.loadmail);
    this.generateUUID();
    this.epicFunction();

    $(document).ready(function(){       
      var scroll_pos = 0;
      let color = '#ffffff';
      let picker = "body::-webkit-scrollbar-thumb {background:" + color + ";}body::-webkit-scrollbar-track {background-color:#636666;}";
      let new_stylesheet = "<style type='text/css' id='currentCSS'>" + picker + "</style>";

      //check if stylsheet exists          
      let existingStylesheet = $("#currentCSS");
      if (existingStylesheet.length) {$(existingStylesheet).replaceWith(new_stylesheet);}
      else {$(new_stylesheet).appendTo('head');}
  });
   
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
  checkurlemail(loadmail) {
    this.checkmailApi = this.activeRoute.queryParams.subscribe(params => {
      this.loadmail = params['email'];
    })
    if (this.loadmail != undefined && this.loadmail != '') {
      this.signupObj.email = this.loadmail;
    } else {
      this.signupObj.email = ''
    }
  }

  getLoc() {
    this.countryApi = this.http.get<any>('./assets/data/country.json')
      .subscribe(data => {
        this.contries = data;
      })
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    if(this.captcha == undefined || this.captcha == null ){
      this.captchaNextButton = false;
      }
      else{
        this.captchaNextButton = true
      }

  }
  IDMSERVICE: any = "https://sandbox.identitymind.com/im/account/consumer?graphScoreResponse=false";
  WEBSERVICE: any = "https://api.digitalterminal.net/webservice";
  merchantid: any = 'cornerstore';
  merchantpassword: any = '8215631cc6e8b0ef43a2aba1aa61a489ebe547f2';
  accessKey = btoa(("this.merchantid:this.merchantpassword"));


  signupData(isValid) {
    if (isValid) {
      this.data.alert("Loading...", "dark");
      this.http.get<any>('https://api.ipgeolocation.io/ipgeo?apiKey=693da481af1b4a3e80e3dfea9115dc52')
        .subscribe(response => {
          this.latitude = response.latitude;
          this.longitude = response.longitude;
          this.ipaddress = response.ip;
          this.location = response.country_name;
          this.signupObj.latitude = this.longitude;
          this.signupObj.longitude = this.longitude;
          this.signupObj.ipAddress = this.ipaddress
          this.signupObj.location = this.location;
          var promoCode = this.referCode;
          this.signupObj.countryCode = this.selectedCountryPhone;

          this.signupObj.phone = this.signupObj.phone;

          if(this.franchiseCode!=null){
            this.signupObj['referredBy'] = this.franchiseCode;
            this.signupObj['referrerType'] = 'F';
           }
           else if(this.invalid==true){
             delete this.signupObj['referredBy']
           }
           else{
            this.signupObj['referredBy'] = this.referredByUser;
            this.signupObj['referrerType'] = this.referrerTypeUser;
           }

          this.signupObj['browser'] = this.Browser + '' + this.Browserversion;

          this.signupObj['deviceId'] = this.uuidValue.toString();

          if (this.Ismobole == true) {
            this.signupObj['deviceType'] = 'mobile';
          }
          else if (this.Istablet == true) {
            this.signupObj['deviceType'] = 'tablet';
          }
          else if (this.Isdesktop == true) {
            this.signupObj['deviceType'] = 'Desktop browser';
          }
          var deviceID = this.cookie.get('deviceID');
          if (deviceID==""||deviceID == "undefined") {
            this.signupObj['deviceId'] = this.uuidValue;
            this.cookie.set('deviceID', this.uuidValue.toString(),60);
          }
          else {
            this.signupObj['deviceId'] = this.cookie.get('deviceID');
          }
          //this.signupObj['brokerId'] = this.data.BROKERID
          this.signupObj['gRecaptchaResponse'] = this.captcha;
          var jsonString = JSON.stringify(this.signupObj);

          console.log('payload data', jsonString);
          localStorage.setItem('phoneUsedForRegistration',this.signupObj.phone);
          localStorage.setItem('phoneCountryUsedForRegistration',this.signupObj.countryCode);

          this.signupObj.phone = this.signupObj.phone.replace(this.selectedCountryPhone,'');
          // if (this.captcha != '') {

          let payload = {
            brokerId :  this.signupObj['brokerId']
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
                this.data.alert(result.error.error_msg, 'danger');
                this.signupObj.brokerId = ''
                $('#submit_btn').attr('disabled','disabled');
              } else {

                this.userdtlApi = this.http.post<any>(this.data.WEBSERVICE + '/user/AddUserDetails', jsonString, { headers: { 'Content-Type': 'application/json' } })
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
      ///

    } else {
      this.data.loader = false;
      this.data.alert('Please fill up all the fields properly', 'warning');
    }
  }

  handleShowPhoneDisclaimer = (param : boolean) => {
    this.showPhoneDisclaimer = param
  }
  getSize(content) {
    var sz = $('#' + content)[0].files[0];
    if (sz.type == "image/jpeg") {
      if (sz.size > 5000000) {
        this.data.alert('File size should be less than 2MB', 'warning');
        $('#' + content).val('');
      }
    }
    else {
      this.data.alert('File should be in JPG or JPEG. ' + sz.type.split('/')[1].toUpperCase() + ' is not allowed', 'warning');
      $('#' + content).val('');
    }
  }


  confirmPassword(e) {
    if (
      (this.signupObj.password != '' && this.signupObj.password != undefined) &&
      (this.signupObj.repassword1 != '' && this.signupObj.repassword1 != undefined)
    ) {
      if (this.signupObj.password == this.signupObj.repassword1) {
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

  handleInfoModal = (elem) => {
    this.modalService.open(elem,{centered:true});
  }

  checkEmail() {
    if (this.signupObj.email != undefined && this.signupObj.email != '') {
      if (this.signupObj.email != '' && this.signupObj.email != undefined) {
        if (this.is_mail(this.signupObj.email) == true) {
          var emailValue = this.signupObj.email;
          var emailObj = {};
          emailObj['email'] = emailValue;
          var jsonString = JSON.stringify(emailObj);
          this.checkmailApi = this.http.post<any>(this.data.WEBSERVICE + '/user/CheckEmail', jsonString, {
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
                  this.signupObj.email = '';
                } else {

                }
              }
            }, reason => {
              this.data.alert('Internal Server Error', 'danger')
            });
        } else {
        }
      }
    } else {
      this.data.alert('Please Provide Email Id', 'warning');
    }
  }
  
  checkPhone() {
    if (this.signupObj.phone != '' && this.signupObj.phone != undefined) {
      // wip(1);
      console.log('country code',this.selectedCountryPhone);
      console.log('country phone',this.signupObj.phone);

      
      var phoneValue = this.signupObj.phone;
      var phoneObj = {};

      // phoneObj['phone'] = this.editablePhone;
      //       phoneObj['countryCode'] = this.selectedCountryPhone;

      phoneObj['phone'] = phoneValue;
      phoneObj['countryCode'] = this.selectedCountryPhone;

      var jsonString = JSON.stringify(phoneObj);

      this.checkphoneApi = this.http.post<any>(this.data.WEBSERVICE + '/user/CheckPhone', jsonString, {
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
              this.signupObj.phone.value = '';
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

  handleBrokerIdCheck = () => {
    
      let value  = this.signupObj.brokerId;
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
              this.data.alert(result.error.error_msg, 'danger');
              this.signupObj.brokerId = ''
              $('#submit_btn').attr('disabled','disabled');
            } else {
              
            }
          }, reason => {
            // wip(0);
            this.data.alert('Internal Server Error', 'danger')
  
          });
      }
  }

  checkReferralCode() {
    if (this.signupObj1.referralCode != '' && this.signupObj1.referralCode != undefined) {
      this.referCode = this.signupObj1.referralCode;
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
          this.data.alert(result.error.error_msg, 'danger');
          this.invalid=true;
        } else {
            this.data.alert('valid Referral Code', 'success');
            this.referredByUser = this.referCode;
            this.referrerTypeUser= result.userResult.referrerType;
        }
      }, reason => {
          this.data.alert('Internal Server Error', 'danger')

        });
    } else {
      //this.data.alert('Please Provide Referral Code.', 'warning')
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
    var password = this.signupObj.password;
    if (password != '' && password != undefined && password.length >= 8) {
      var passwordStatus = this.checkAlphaNumeric(password);
      if (passwordStatus == false) {
        this.data.alert('The password should be of minimum 8, maximum 35 characters and must contain at least one uppercase, one lowercase, a number and a special character (only $ @  . ! are allowed in special characters).', 'warning');
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

  is_mail(email) {
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return regex.test(email);
  }
  ngOnDestroy() {
    if (this.countryApi != undefined) {
      this.countryApi.unsubscribe();
    }
    if (this.signupApi != undefined) {
      this.signupApi.unsubscribe();
    }
    if (this.checkmailApi != undefined) {
      this.checkmailApi.unsubscribe();
    }

    if (this.checkphoneApi != undefined) {
      this.checkphoneApi.unsubscribe();
    }
    if (this.userdtlApi != undefined) {
      this.userdtlApi.unsubscribe();
    }
    if (this.checkReffealCodeApi != undefined) {
      this.checkReffealCodeApi.unsubscribe();
    }

  }

  getNumber(e){
    console.log('phone number', e);
    
  }
  telInputObject(e){
    console.log('telInputObject', e);
    
  }

  onCountryChange(e){
    console.log('countryCode', e);
    this.selectedCountryPhone = e.dialCode
    this.checkPhone()

    // phoneObj['phone'] = this.selectedCountryPhone + phoneValue;

    
  }

  /* Method defination for copy broker id */
  copyBrokerId = () => {
    let copyText = document.getElementById("brokerIdField") as HTMLInputElement;

        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        // navigator.clipboard.writeText(copyText.value);
        window.navigator['clipboard'].writeText(copyText.value);
        this.data.alert('Broker Id Copied','success');
  }

 


}