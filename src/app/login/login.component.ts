import { Component, OnInit, DoCheck, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreDataService } from '../core-data.service';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TradesComponent } from '../trades/trades.component';
import { Subscription, timer } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UUID } from 'angular2-uuid';
import { ActivatedRoute } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  token: string | undefined;

  email: any;
  password: any;
  userId: any;
  error: boolean;
  accessToken: any;
  refreshToken: any;
  expiresIn: any;
  logoutReason: any;
  loader: boolean;
  currentRoute;
  otpBlock: boolean = false;
  otp: any;
  twoFactorOtp: any
  smsOtp: any
  private loginapi: Subscription;
  private loginotpApi: Subscription;
  private setlogdataApi: Subscription;
  private userdtlApi: Subscription;
  private maientanenceApi: Subscription;
  private deviceinfoApi: Subscription;
  private userblockObjApi: Subscription;
  ipaddress;
  latitude;
  longitude;
  location;
  deviceInfo = null;
  abc: any;
  abcForSms: any;
  public Browser: any;
  public Browserversion: any;
  public DeviceId: any;
  public OS: any;
  public OSversion: any;
  public devicetype: any;
  public Ismobole: any;
  public Istablet: any;
  public Isdesktop: any;
  public errormessage: any;
  uuidValue: string;
  timeLeft: any = 60;
  interval;
  intervalForSms;
  intervalMessageForSmsPopup: string = '';
  showGetCodeButtonInSmsOtpPopup: boolean = true
  fifthParam: any;
  isLoginButtonEnabled: boolean = false;
  @ViewChild('myModal') myModal: any;
  @ViewChild('myModalAuth') myModalAuth: any;
  @ViewChild('twoFactorAuth') twoFactorAuth: any;
  @ViewChild('smsAuth') smsAuth: any;
  @ViewChild('versionModal') versionModal: any;
  

  
  captchaNextButton: boolean = false;

  emailVerificationCode: string = '';
  countdownSec: any = this.data.timeIntervalForEmail;
  secondStatusCheck: boolean;
  noEmailStatus: boolean;
  noPasswordStatus: boolean;
  otpAuth: any;
  hiddenEmail: string;
  showCountdownVar: any;
  userSmsAuthStatus: any;
  userPhoneUsingForSendingSms: any;
  loginResponse: any;
  disabledSpan: boolean = false;
  accessTokenWillBeComingAfterVerifing: string = '';
  appLink: any;
  disableSecStatus: boolean = true;
  currentVerson: any;


  constructor(
    private http: HttpClient,
    public data: CoreDataService,
    public cookie: CookieService,
    private route: Router,
    private nav: NavbarComponent,
    private titleService: Title,
    private modalService: NgbModal,
    private trade: TradesComponent, private deviceService: DeviceDetectorService, private route1: ActivatedRoute) {
    this.token = undefined;

  }

  public setTitle(newTitle: string) {
    console.log(newTitle)
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {

    setTimeout(() => {

      this.disableSecStatus = false;
      
    }, 5000);

    this.setTitle(this.data.exchange);
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
    const firstParam: string = this.route1.snapshot.queryParamMap.get('userId');
    const secondParam: string = this.route1.snapshot.queryParamMap.get('location');
    const thirdParam: string = this.route1.snapshot.queryParamMap.get('deviceId');
    const fourthParam: string = this.route1.snapshot.queryParamMap.get('del');
    this.error = false;
    this.loader = false;
    this.logoutReason = this.nav.reason;
    this.generateUUID();
    this.epicFunction();
    this.getmaintenanceSetting();
    //this.checkAppVesion();
    if (firstParam != null && secondParam != null && thirdParam != null) {
      var deviceinfoObj = {};
      deviceinfoObj['userId'] = firstParam;
      deviceinfoObj['location'] = secondParam;
      deviceinfoObj['deviceId'] = thirdParam;
      var jsonString = JSON.stringify(deviceinfoObj);
      this.deviceinfoApi = this.http.post<any>(this.data.WEBSERVICE + '/user/deviceVerification', jsonString, { headers: { 'content-Type': 'application/json' } })
        .subscribe(response => {
          if (response.error.error_data == '1') {
            this.error = true;
            this.loader = false;
            this.errormessage = response.error.error_msg;
            this.data.alert(this.errormessage, 'warning');
          }
          else {
            this.error = true;
            this.loader = false;
            this.errormessage = response.error.error_msg;
            this.data.alert(this.errormessage, 'success');
          }
        })
    }

    if (firstParam != null && secondParam == null) {
      var userblockObj = {};
      userblockObj['userId'] = firstParam;
      var jsonString = JSON.stringify(userblockObj);
      this.http.post<any>(this.data.WEBSERVICE + '/user/blockAccount', jsonString, { headers: { 'content-Type': 'application/json' } })
        .subscribe(response => {
          if (response.error.error_data == '1') {
            this.error = true;
            this.loader = false;
            this.errormessage = response.error.error_msg;
            this.data.alert(this.errormessage, 'warning');
          }
          else {
            this.error = true;
            this.loader = false;
            this.errormessage = response.error.error_msg;
            this.data.alert(this.errormessage, 'success');
          }
        })
    }

    if (fourthParam != null && secondParam == null) {
      localStorage.clear();
      this.Deletecookies();
      this.route.navigateByUrl('/login');
      // this.data.handlePageReloadForecibily(100)
    }

    /* Logic for showing OTP count down on page load */
    if (localStorage.getItem('secondStatusCheck') == 'true') {
      this.secondStatusCheck = true;
      console.log(localStorage.getItem('secondStatusCheck'), this.secondStatusCheck);
      this.showCountdown(parseInt(localStorage.getItem('countdownSec')))
    } else {
      this.secondStatusCheck = false;
    }


  }
  ngDoCheck() {

  }
  Deletecookies() {
    var cookieName = 'Username';
    var cookieName1 = 'userId';
    var cookieName2 = 'ssecca';
    document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.paybito.com;path=/';
    document.cookie = cookieName1 + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.paybito.com;path=/';
    document.cookie = cookieName2 + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.paybito.com;path=/';
    //document.cookie = cookieName + "=" + dataRecheck.userResult.userId + ";expires=" + myDate + ";domain=.paybito.com;path=/";
  }
  getmaintenanceSetting() {
    this.http.get<any>(this.data.WEBSERVICE + '/user/maintenanceStatus')
      .subscribe(response => {
        if (response.status != '1') {
          this.route.navigateByUrl("/");
        } else {

          window.location.href = "https://www.paybito.com/exchange-maintenance";
        }

      })
  }
  generateUUID() {
    this.uuidValue = UUID.UUID();
    localStorage.setItem('uuid', this.uuidValue);
    return this.uuidValue;
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    this.Browser = JSON.stringify(this.deviceInfo.browser);
    localStorage.setItem('browser', this.Browser);
    this.Browserversion = JSON.stringify(this.deviceInfo.browser_version);
    localStorage.setItem('browserver', this.Browserversion);
    // this.DeviceId = uuid();
    this.OS = JSON.stringify(this.deviceInfo.os);
    this.OSversion = JSON.stringify(this.deviceInfo.os_version);
    this.Ismobole = isMobile;
    localStorage.setItem('Ismobole', this.Ismobole);
    this.Istablet = isTablet;
    localStorage.setItem('Istablet', this.Istablet);
    this.Isdesktop = isDesktopDevice;
    localStorage.setItem('Isdesktop', this.Isdesktop);
  }
  loginData(isValid: boolean) {
    if (this.fifthParam == 'otc') {
      this.route.navigateByUrl('/otc');
    }
    if (isValid && this.email != "" && this.password != "") {
      this.loader = true;
      this.isLoginButtonEnabled = false
      this.http.get<any>('https://api.ipgeolocation.io/ipgeo?apiKey=693da481af1b4a3e80e3dfea9115dc52')
        .subscribe(response => {

          this.latitude = response.latitude;
          localStorage.setItem('latitude', response.latitude);
          this.longitude = response.longitude;
          localStorage.setItem('longitude', response.longitude);
          this.ipaddress = response.ip;
          localStorage.setItem('ipaddress', response.ip);
          this.location = response.country_name;
          localStorage.setItem('location', response.country_name);
          localStorage.setItem('email', this.email);
          this.logoutReason = '';
          var loginObj = {};
          loginObj['email'] = this.email;
          loginObj['password'] = this.password;
          loginObj['latitude'] = this.latitude;
          loginObj['longitude'] = this.longitude;
          loginObj['ipAddress'] = this.ipaddress;
          loginObj['location'] = this.location;
          loginObj['callFrom'] = 'Desktop';

          loginObj['otp'] = this.emailVerificationCode;
          loginObj['gRecaptchaResponse'] = this.token;

          loginObj['browser'] = this.Browser + '' + this.Browserversion;
          var deviceID = this.cookie.get('deviceID');
          localStorage.setItem('deviceid', deviceID);
          if (deviceID == "" || deviceID == "undefined") {
            loginObj['deviceId'] = this.uuidValue.toString();
            this.cookie.set('deviceID', this.uuidValue.toString(), 60);
          }
          else {
            loginObj['deviceId'] = this.cookie.get('deviceID');
          }

          if (this.Ismobole == true) {
            loginObj['deviceType'] = 'mobile';
          }
          else if (this.Istablet == true) {
            loginObj['deviceType'] = 'tablet';
          }
          else if (this.Isdesktop == true) {
            loginObj['deviceType'] = 'Desktop browser';
          }
          var jsonString = JSON.stringify(loginObj);
          this.loginapi = this.http.post<any>(this.data.WEBSERVICE + '/user/LoginWithUsernamePassword', jsonString, { headers: { 'content-Type': 'application/json' } })
            .subscribe(data => {
              // error
              this.modalService.dismissAll();
              if (data.error.error_data == '1') {
                this.error = true;
                this.loader = false;
                this.errormessage = data.error.error_msg;
                this.isLoginButtonEnabled = true
              }

              if (data.error.error_data == '2') {
                this.error = true;
                this.loader = false;
                this.errormessage = data.error.error_msg;
                this.isLoginButtonEnabled = true

                $('#unverifiesusermsgd').css('display', 'block');
                //var unverifieduser = "Resend device verification mail &nbsp; &nbsp; <button id='verifyuser' class='btn btn-success'>RESEND</button>";
                //$('#unverifiesusermsgd').html("<div style='display: flex;justify-content: space-between;align-items: center;'>" + unverifieduser + "</div>");

                $('#verifyuser').on('click', function () {

                  $('#unverifiesusermsgd').css('display', 'none');

                  var resendverifymailObj = {};
                  resendverifymailObj['email'] = localStorage.getItem('email');
                  resendverifymailObj['latitude'] = localStorage.getItem('latitude');
                  resendverifymailObj['longitude'] = localStorage.getItem('longitude');
                  resendverifymailObj['ipAddress'] = localStorage.getItem('ipaddress');
                  resendverifymailObj['location'] = localStorage.getItem('location');
                  resendverifymailObj['browser'] = localStorage.getItem('browser') + '' + localStorage.getItem('browserver');
                  if (deviceID == "" || deviceID == "undefined") {
                    resendverifymailObj['deviceId'] = localStorage.getItem('uuid').toString();
                    //this.cookie.set('deviceID', this.uuidValue.toString(), 60);
                  }
                  else {
                    resendverifymailObj['deviceId'] = localStorage.getItem('deviceid');
                  }

                  if (localStorage.getItem('Ismobole') == 'true') {
                    resendverifymailObj['deviceType'] = 'mobile';
                  }
                  else if (localStorage.getItem('Istablet') == 'true') {
                    resendverifymailObj['deviceType'] = 'tablet';
                  }
                  else if (localStorage.getItem('Isdesktop') == 'true') {
                    resendverifymailObj['deviceType'] = 'Desktop browser';
                  }

                  var jsonString = JSON.stringify(resendverifymailObj);
                  $.ajax({
                    url: "https://accounts.paybito.com/api/user/resendDeviceVerificationMail",
                    type: 'POST',
                    data: jsonString,
                    dataType: "JSON",
                    contentType: 'application/json',
                    // beforeSend: function (xhr) {
                    //   xhr.setRequestHeader("authorization", "bearer" + localStorage.getItem('access_token'));
                    // },
                    success: function (response) {
                      var result = response;
                      if (result.error.error_data != '0') {
                        alert(result.error.error_msg);
                        this.isLoginButtonEnabled = true
                      } else {
                        alert(result.error.error_msg);
                        $('#countermsg').css('display', 'block');

                        var timeleft = this.data.timeIntervalForEmail;
                        this.interval;
                        var s = timer(1000, 1000);
                        this.isLoginButtonEnabled = true
                        this.abc = s.subscribe(val => {
                          this.interval = timeleft - val;
                          $('#countermsg').html("<div class='text-center'>" + 'Resend in ' + this.interval + ' seconds' + "</div>");

                          if (this.interval == 0) {
                            $('#countermsg').css('display', 'none');
                            $('#unverifiesusermsgd').css('display', 'block');
                            this.abc.unsubscribe();
                          }
                        });
                      }
                    }
                  });
                });
              }


              if (data.error.error_data == '0') {
                this.loader = false;

                this.error = false;
                localStorage.setItem('secondStatusCheck', 'false');
                localStorage.setItem('countdownSec', '0')
                localStorage.setItem('twoFactorAuth', data.userResult.twoFactorAuth)
                this.userSmsAuthStatus = data.userResult.phoneValidation
                localStorage.setItem('userSmsAuthStatus', this.userSmsAuthStatus)
                this.userPhoneUsingForSendingSms = data.userResult.phone;
                this.loginResponse = data;
                if (data.userResult.phoneValidation == '1') {
                  this.accessTokenWillBeComingAfterVerifing = 'phone'
                } else if (data.userResult.twoFactorAuth == '1') {
                  this.accessTokenWillBeComingAfterVerifing = '2fa'
                } else if (data.userResult.phoneValidation == '1' && data.userResult.twoFactorAuth == '1') {
                  this.accessTokenWillBeComingAfterVerifing = '2fa'
                } else {
                  this.accessTokenWillBeComingAfterVerifing = 'none'
                }
                if (this.userSmsAuthStatus == 1) {
                  this.handleOpenSmsOtp();
                } else if (localStorage.getItem('twoFactorAuth') == '1') {
                  this.loader = false;
                  //this.otpBlock = true;
                  this.modalService.dismissAll()

                  this.modalService.open(this.twoFactorAuth, { centered: true, backdrop: false, keyboard: false });

                  this.isLoginButtonEnabled = true
                  $('.otp_segment').show();
                  $('.otp_btn').show();
                  $('.login_btn').hide();
                  $('#loginInputOTP').focus();
                } else {
                  this.setLoginData(this.loginResponse);
                }

              }
            }, error => {
              this.loader = false;
              this.isLoginButtonEnabled = true
            })
        }, error => {
          console.log('IP GEO ERROR', error)
        })
    }
    else {
      this.error = true;
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

  /* method defination for opening SMS otp popup */
  handleOpenSmsOtp = () => {
    this.smsOtp = '';
    this.modalService.open(this.smsAuth, { centered: true, backdrop: false, keyboard: false });
  }

  /* Method defination for calling API for sms auth   */
  async handleSmsAuthSubmit() {
    let isOtpValidated = await this.data.handleConfirmOtpInSmsForLogin('loginverifymobileotp', this.userPhoneUsingForSendingSms, this.smsOtp, this.password,'');

    if (isOtpValidated) {

      if (localStorage.getItem('twoFactorAuth') == '0') {
        this.loginResponse = JSON.parse(localStorage.getItem('loginData'))
        this.setLoginData(this.loginResponse);
      } else {
        this.loader = false;
        //this.otpBlock = true;
        this.modalService.dismissAll()

        this.modalService.open(this.twoFactorAuth, { centered: true, backdrop: false, keyboard: false });

        this.isLoginButtonEnabled = true
        $('.otp_segment').show();
        $('.otp_btn').show();
        $('.login_btn').hide();
        $('#loginInputOTP').focus();
      }


    } else {

    }
  }

  /* Get Code button for sms auth popup */
  async handleSendOtpThroughSms() {
    this.disabledSpan = true;
    let payload = {
      phone : this.userPhoneUsingForSendingSms
    }
    let isOtpSendToPhone = await this.data.handleSendOtpInSms(payload, 'loginmobileotp');
    if (isOtpSendToPhone) {
      var timeleft = this.data.timeIntervalForSms;
      this.interval;
      var s = timer(1000, 1000);
      this.abcForSms = s.subscribe(val => {
        this.intervalForSms = timeleft - val;
        this.showGetCodeButtonInSmsOtpPopup = false
        this.intervalMessageForSmsPopup = 'Resend in ' + this.intervalForSms + ' seconds';

        if (this.intervalForSms <= 0) {
          this.intervalMessageForSmsPopup = '';
          this.showGetCodeButtonInSmsOtpPopup = true
          this.abcForSms.unsubscribe();
        }
      });

      this.disabledSpan = false;

    } else {
      this.disabledSpan = false;

    }

  }
  /* method defination for login through sms*/
  loginThroughSmsOtp = (content) => {

  }

  loginThroughOtp() {
    var otpObj = {};
    otpObj['email'] = this.email;
    otpObj['otp'] = this.twoFactorOtp;
    otpObj['callFrom'] = 'login';
    otpObj['password'] = this.password;
    var jsonString = JSON.stringify(otpObj);
    // wip(1);
    this.loginotpApi = this.http.post<any>(this.data.WEBSERVICE + '/user/CheckTwoFactor', jsonString, {
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
          this.loginResponse = result
          this.setLoginData(this.loginResponse);

        }
      },
        reason => {
          this.data.alert(reason, 'danger')
        });
  }

  setLoginData(data) {

    this.accessToken = data.token
    localStorage.setItem('access_token', this.accessToken);
    let body = new URLSearchParams();
    localStorage.setItem('uuid', data.userResult.uuid)
    body.set('username', localStorage.getItem('uuid'));
    body.set('password', this.password);
    localStorage.setItem('password', this.password);
    body.set('grant_type', 'password');
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('authorization', 'Basic cGF5Yml0by13ZWItY2xpZW50OlB5Z2h0bzM0TEpEbg==')
    };
    /* this.setlogdataApi = this.http.post<any>(this.data.WEBSERVICE + '/oauth/token', body.toString(), options)
      .subscribe(dataAuth => {
        this.accessToken = dataAuth.access_token;
        this.refreshToken = dataAuth.refresh_token;
        this.expiresIn = dataAuth.expires_in;
        localStorage.setItem('access_token', this.accessToken);
        localStorage.setItem('refresh_token', this.refreshToken);
        var expiresTime = this.expiresIn;
        expiresTime = expiresTime * 3600000;
        var start_time = $.now();
        var expiresIn = start_time + expiresTime; */
    var userObj = {};
    userObj['userId'] = this.userId;
    userObj['uuid'] = localStorage.getItem('uuid');
    var userJsonString = JSON.stringify(userObj);
    this.userdtlApi = this.http.post<any>(this.data.WEBSERVICE + '/user/GetUserDetails', userJsonString, { headers: { 'Content-Type': 'application/json', 'authorization': 'BEARER ' + this.accessToken } })
      .subscribe(dataRecheck => {
        if (dataRecheck.error.error_data == '0') {
          var cookieName = 'Username';
          var cookieName1 = 'userId';
          var cookieName2 = 'ssecca';
          var myDate = new Date();
          myDate.setMonth(myDate.getMonth() + 12);
          document.cookie = cookieName + "=" + dataRecheck.userResult.firstName + ";expires=" + myDate + ";domain=.paybito.com;path=/";
          localStorage.setItem('user_name', dataRecheck.userResult.firstName);
          localStorage.setItem('first_name', dataRecheck.userResult.firstName);
          localStorage.setItem('last_name', dataRecheck.userResult.lastName);
          localStorage.setItem('middle_name', dataRecheck.userResult.middleName);
          localStorage.setItem('user_id', dataRecheck.userResult.userId);
          document.cookie = cookieName1 + "=" + dataRecheck.userResult.userId + ";expires=" + myDate + ";domain=.paybito.com;path=/";
          localStorage.setItem('email', dataRecheck.userResult.email);
          localStorage.setItem('profile_pic', dataRecheck.userResult.profilePic);
          localStorage.setItem('check_id_verification_status', 'true');
          localStorage.setItem('selected_currency', 'btc');
          localStorage.setItem('buying_crypto_asset', 'btc');
          localStorage.setItem('selling_crypto_asset', 'usd');
          localStorage.setItem('UserTiretype', dataRecheck.userResult.userTierType);
          localStorage.setItem('exist2FaKey', dataRecheck.userResult.exist2FaKey);
          localStorage.setItem('BROKERID', dataRecheck.userResult.brokerId);
              this.data.BROKERID = dataRecheck.userResult.brokerId;

              this.data.getAllBrokerDetails();
              this.data.getAllBrokerMarkets();

          this.cookie.set('access_token', localStorage.getItem('access_token'), 60);
          var accesstoken = localStorage.getItem('access_token');
          document.cookie = cookieName2 + "=" + accesstoken + ";expires=" + myDate + ";domain=.paybito.com;path=/";
          if (sessionStorage.getItem('basicroute') == 'basic') {
            this.route.navigate(['/basic']);
          }
          else if (sessionStorage.getItem('otcroute') == 'otc') {
            this.route.navigate(['/otc']);
          }
          else if (sessionStorage.getItem('proDashboard') == 'pro') {
            // this.route.navigate(['/dashboard']);
            this.routeTolocation();
          }
          else {
            if (dataRecheck.userResult.userTierType == 2 || dataRecheck.userResult.userTierType == 3) {
              // this.route.navigateByUrl('/dashboard');
            this.routeTolocation();

            }
            else {

            this.routeTolocation();

              // this.route.navigateByUrl('/identity-verification');
            }
          }
          this.modalService.dismissAll()
          this.data.alert('Login Successful!', 'success');
          localStorage.setItem('secondStatusCheck', 'false');
          localStorage.setItem('countdownSec', '0')
          this.data.Countdown();
        }
      }, reason => {
        this.data.alert(reason, 'danger');
        this.isLoginButtonEnabled = true
      });
    /* }, reason => {
      //this.data.alert(reason, 'danger');
      this.data.alert('Server Error Occured', 'danger');
      this.isLoginButtonEnabled = true
    }); */
  }


  async routeTolocation(){

    var a = await this.data.getAllBrokerMarkets();

    console.log('spot',this.data.isSpot,this.data.isFutures,this.data.isOptions);
    

    if(this.data.isSpot == 0 ){
        if(this.data.isFutures == 0 ){
            if(this.data.isOptions == 0){
                this.route.navigateByUrl('/profile-details');
                }

        else{

      this.route.navigateByUrl('/options-dashboard');
            }

      }
      else{
        this.route.navigateByUrl('/derivative-dashboard');
          }

    }
    else{
        this.route.navigateByUrl('/dashboard');
      }
    }
  /* method defination for validating otp */
  validateOtp = (e) => {
    let otp = e.target.value;
    console.log(otp, typeof (otp))
    let reg = /^[0-9]*$/g
    if (otp.length > 6 || !otp.match(reg)) {
      otp = otp.toString().slice(0, -1);
      e.target.value = otp
    }
  }

  ngOnDestroy() {
    if (this.loginapi != undefined) {
      this.loginapi.unsubscribe();
    }
    if (this.loginotpApi != undefined) {
      this.loginotpApi.unsubscribe();
    }
    if (this.setlogdataApi != undefined) {
      this.setlogdataApi.unsubscribe();
    }
    if (this.loginotpApi != undefined) {
      this.loginotpApi.unsubscribe();
    }
    if (this.userdtlApi != undefined) {
      this.userdtlApi.unsubscribe();
    }
  }

  openModalForCaptcha() {

    if (this.email == '' || this.password == '' || this.email == undefined || this.password == undefined) {
      if (this.email == '' || this.email == undefined) {
        this.noEmailStatus = true;
      }
      else {
        this.noEmailStatus = false;

      }

      if (this.password == '' || this.password == undefined) {
        this.noPasswordStatus = true;
      }
      else {
        this.noPasswordStatus = false;

      }
    }

    else {
      this.hideEmail();
      this.captchaNextButton = false;
      this.modalService.open(this.myModal, { centered: true, backdrop: false, keyboard: false });
    }






  }

  hideEmail() {
    var i = 0;
    var email = this.email //anas.behhari@gmail.com
    this.hiddenEmail = "";
    for (i = 0; i < email.length; i++) {
      if (i > 2 && i < email.indexOf("@")) {
        this.hiddenEmail += "*";
      } else {
        this.hiddenEmail += email[i];
      }
    }
  }

  resolved(captchaResponse: string) {

    this.token = captchaResponse;
    console.log('resolved captcha with response' + this.token)
    if (this.token == undefined || this.token == null) {
      this.captchaNextButton = false;
    }
    else {
      this.captchaNextButton = true
    }
  }

  redirectToAuthentication() {
    this.modalService.dismissAll()


    if (this.email == 'demo@hashcashconsultants.org') {
      this.loginData(true)

    }
    else {
      this.emailVerificationCode = '';
      if (localStorage.getItem('secondStatusCheck') == 'true') {
        this.secondStatusCheck = true;
        console.log(localStorage.getItem('secondStatusCheck'), this.secondStatusCheck);
        //this.showCountdown(parseInt(localStorage.getItem('countdownSec')))
      } else {
        this.secondStatusCheck = false;
        localStorage.setItem('secondStatusCheck', 'false');
        clearInterval(this.showCountdownVar);
        this.countdownSec = this.data.timeIntervalForEmail;
        localStorage.setItem('countdownSec', this.countdownSec)
        // this.showCountdown(this.countdownSec);
      }

      this.modalService.open(this.myModalAuth, { centered: true, backdrop: false, keyboard: false });


    }


  }

  sendVerificationCodeMail() {
    this.sendMail();


  }

  sendMail() {

    this.disabledSpan = true;

    var userObj = {};
    userObj['email'] = this.email;
    var userJsonString = JSON.stringify(userObj);
    this.userdtlApi = this.http.post<any>(this.data.WEBSERVICE + '/user/SendOtp/login', userJsonString, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(response => {

        console.log('mail sent', response)
        if (response.error.error_data == 0) {
          this.data.alert('OTP has been sent to your mail id', 'success'); this.secondStatusCheck = true
          this.disabledSpan = false;

          localStorage.setItem('secondStatusCheck', 'true');
          this.countdownSec = this.data.timeIntervalForEmail;
          localStorage.setItem('countdownSec', this.countdownSec)
          this.showCountdown(this.countdownSec);

        }
        else {
          this.disabledSpan = false;

          this.data.alert(response.error.error_msg, 'danger')


        }


      })




  }



  showCountdown(i) {
    this.showCountdownVar = setInterval(function () {
      // console.log('time', i)

      this.countdownSec = i;
      localStorage.setItem('countdownSec', this.countdownSec)
      i-- || clearInterval(this.showCountdownVar) || this.newF();  //if i is 0, then stop the interval
      console.log(i)

    }.bind(this), 1000)

  }
  newF() {
    this.secondStatusCheck = false;
    localStorage.setItem('secondStatusCheck', 'false');


  }


  checkAppVesion(){

    this.http.get<any>(this.data.WEBSERVICE + '/home/checkAppVersion?appVersion='+this.data.appVersion)
      .subscribe(response => {

        if(this.data.appVersion < response.currentVersion){

          this.modalService.open(this.versionModal, { centered: true});
          this.appLink = response.link
          this.currentVerson = response.currentVersion


        }


        // console.log('version',response);
        
        

      })

  }

}