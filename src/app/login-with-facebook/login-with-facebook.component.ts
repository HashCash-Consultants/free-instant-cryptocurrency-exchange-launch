import { Component, OnInit, DoCheck, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreDataService } from '../core-data.service';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TradesComponent } from '../trades/trades.component';
import { Subscription, timer } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UUID } from 'angular2-uuid';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { bindAll } from 'lodash';


declare var FB: any;
declare var IN: any;

@Component({
  selector: 'app-login-with-facebook',
  templateUrl: './login-with-facebook.component.html',
  styleUrls: ['./login-with-facebook.component.css'],
  //inputs: ['purpose']
})
export class LoginWithFacebookComponent implements OnInit {


  @Input() purpose: string;
  deviceInfo = null;
  abc: any;
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
  auth2: any;
  loginType: number = 2;
  twoFactorOtp: any = '';
  smsOtp: any = '';
  authWindow: any;
  socialMediaIdUsedForTwoFactorAuth: string;
  @ViewChild('loginRef') loginElement!: ElementRef;
  @ViewChild('twoFactorAuthSocial') twoFactorAuth: any;
  @ViewChild('smsAuth') smsAuth: any;
  userSmsAuthStatus: any;
  userPhoneUsingForSendingSms: any;
  loginResponse: any;
  abcForSms: any;
  intervalForSms;
  intervalMessageForSmsPopup: string = '';
  showGetCodeButtonInSmsOtpPopup: boolean = true;
  accessTokenWillBeComingAfterVerifing: string = '';

  constructor(
    public httpH: HttpClient,
    public data: CoreDataService,
    public cookie: CookieService,
    private route: Router,
    private modalService: NgbModal,
    private deviceService: DeviceDetectorService,
    private route1: ActivatedRoute,
    private zone: NgZone,
  ) {

  }



  /* Login with facebook method defination  */
  loginWithFacebook = () => {

    FB.getLoginStatus(function (response) {
      console.log(response)
      if (response.status === 'connected') {
        //FB.logout(function(response) {
        localStorage.setItem('isCallAccountDetails', 'true')
        console.log('facebook access token', response.authResponse.accessToken)
        localStorage.setItem('facebookAccessToken', response.authResponse.accessToken)
        //});
      } else {
        FB.login((response) => {
          console.log('submitLogin', response);
          console.log('FB login response', response.status)
          if (response.status === 'connected') {
            // Logged into your webpage and Facebook.
            console.log('in If');
            console.log(response.authResponse)
            if (response.authResponse) {
              console.log(response.authResponse)
              console.log('facebook access token1', response.authResponse.accessToken)

              localStorage.setItem('isCallAccountDetails', 'true')
              localStorage.setItem('facebookAccessToken', response.authResponse.accessToken)



            }
            else {
              console.log('User login failed');
            }
          } else {
            // The person is not logged into your webpage or we are unable to tell. 
          }

        });
      }
    }, true);



  }

  /* Login with google method defination */
  loginWithGoogle() {
    console.log('google initiated')
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleAuthUser: any) => {
        console.log('google auth user', googleAuthUser)
        //Print profile details in the console logs

        let profile = googleAuthUser.getBasicProfile();
        console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        localStorage.setItem('google_app_id', profile.getId());
        localStorage.setItem('google_name', profile.getName());
        localStorage.setItem('google_email', profile.getEmail());
        localStorage.setItem('google_image', profile.getImageUrl());
        localStorage.setItem('socialLoginType', 'google')
        this.handleLoginAPICall(localStorage.getItem('google_app_id'), googleAuthUser.getAuthResponse().id_token, 'Google')
      }, (error: any) => {
        console.log(error)
        // alert(JSON.stringify(error, undefined, 2));
      });

  }

  /* Method defination for linked in auth initialization */
  loginWithLinkedIn() {
    //Calling following api 

    let clientId = this.data.LINKEDINCLIENTID;
    let redirectUri = encodeURIComponent(this.data.LINKEDINREDIRECTURI);

    let url = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=' + clientId + '&state=DCEeFWf45A53sdfKef424&scope=r_emailaddress%20r_liteprofile&redirect_uri=' + redirectUri;
    //window.open(url, '','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    location.href = url

  }



  /*Method defination for getting UUID */
  generateUUID() {
    this.uuidValue = UUID.UUID();
    localStorage.setItem('uuid', this.uuidValue);
    return this.uuidValue;
  }

  /*Method defination for getting device information needed in login */
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



  /* Method defination for getting user details from facebook */
  getAccountDetails = () => {

    FB.api('/me?fields=id,email,name', function (response) {
      console.log('Good to see you, ' + response.name + '.' + ' Email: ' + response.email + ' Facebook ID: ' + response.id);
      this.purpose = localStorage.getItem('purpose')
      localStorage.setItem('facebook_name', response.name)
      localStorage.setItem('facebook_email', response.email)
      let fbAppId = response.id;
      localStorage.setItem('facebook_app_id', fbAppId)
      console.log('purpose =>', this.purpose)
      localStorage.setItem('isCallLoginApi', 'true');
      localStorage.setItem('facebook_app_id', fbAppId);
    });
  }



  /* method defination for login ititate API call */
  handleLoginAPICall = (param, socialAccessToken, socialType) => {
    document.body.classList.add('overlay');
    this.httpH.get('https://api.ipgeolocation.io/ipgeo?apiKey=693da481af1b4a3e80e3dfea9115dc52')
      .subscribe(response => {

        let latitude = response['latitude'];
        localStorage.setItem('latitude', response['latitude']);
        let longitude = response['longitude'];
        localStorage.setItem('longitude', response['longitude']);
        let ipaddress = response['ip'];
        localStorage.setItem('ipaddress', response['ip']);
        let location = response['country_name'];
        localStorage.setItem('location', response['country_name']);
        var loginObj = {};

        loginObj['latitude'] = latitude;
        loginObj['longitude'] = longitude;
        loginObj['ipAddress'] = ipaddress;
        loginObj['location'] = location;

        loginObj['callFrom'] = 'Desktop';


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
        loginObj['socialMediaId'] = param;
        loginObj['loginType'] = this.loginType;

        loginObj['socialMediaToken'] = socialAccessToken;
        loginObj['socialMediaType'] = socialType;

        var jsonString = JSON.stringify(loginObj);
        this.httpH.post(this.data.WEBSERVICE + '/user/LoginWithUsernamePassword', jsonString, { headers: { 'content-Type': 'application/json' } })
          .subscribe(data => {
            // error
            this.modalService.dismissAll();
            if (data['error']['error_data'] == '1') {
              /* this.error = true;
              this.loader = false; */
              //this.errormessage = data['error']['error_msg'];
              this.data.alert(data['error']['error_msg'], 'error')
              //this.isLoginButtonEnabled = true
              if (this.loginType > 0) {
                //localStorage.setItem('force_reload_current_page','true')
                this.zone.run(() => {
                  this.route.navigate(['/social-signup']);
            
              });
                
                //window.location.href="https://trade.paybito.com/social-signup"
              }
              document.body.classList.remove('overlay')
            } else if (data['error']['error_data'] == '0') {
              //this.error = false;
              this.loginResponse = data
              localStorage.setItem('twoFactorAuth', data['userResult']['twoFactorAuth']);
              this.userSmsAuthStatus = data['userResult']['phoneValidation']
              localStorage.setItem('userSmsAuthStatus', this.userSmsAuthStatus)
              this.userPhoneUsingForSendingSms = data['userResult']['phone'];
              if (data['userResult']['phoneValidation'] == '1') {
                this.accessTokenWillBeComingAfterVerifing = 'phone'
              } else if (data['userResult']['twoFactorAuth'] == '1') {
                this.accessTokenWillBeComingAfterVerifing = '2fa'
              } else if (data['userResult']['phoneValidation'] == '1' && data['userResult']['twoFactorAuth'] == '1') {
                this.accessTokenWillBeComingAfterVerifing = '2fa'
              } else {
                this.accessTokenWillBeComingAfterVerifing = 'none'
              }
              console.log('PHONE AUTH STATUS => ', this.userSmsAuthStatus, typeof (this.userSmsAuthStatus))
              console.log('2FA AUTH STATUS => ', data['userResult']['twoFactorAuth'])
              if (this.userSmsAuthStatus == 1) {
                this.socialMediaIdUsedForTwoFactorAuth = param;
                document.body.classList.remove('overlay')
                console.log('IN IF')
                this.handleOpenSmsOtp();
              } else if (data['userResult']['twoFactorAuth'] == 1) {
                console.log('IN ELSE IF')
                //this.loader = false;
                //this.otpBlock = true;
                //console.log('In two factor auth')
                document.body.classList.remove('overlay')
                this.modalService.dismissAll()
                this.socialMediaIdUsedForTwoFactorAuth = param;
                console.log('socialmedia id', this.socialMediaIdUsedForTwoFactorAuth);
                
                //console.log(this.twoFactorAuth,this.modalService)
                //this.modalService.open(this.twoFactorAuth, { centered: true });
                $('#authModalTrigger').click();

                //$('.otp_segment').show();
                //$('.otp_btn').show();
                //$('.login_btn').hide();
                //$('#loginInputOTP').focus();

              } else {
                console.log('IN ELSE')
                this.setLoginData(this.loginResponse);

              }

            } else {
              //this.loader = false;
              //this.otpBlock = true;
              this.modalService.dismissAll()

              //this.modalService.open(this.twoFactorAuth, { centered: true });

              //this.isLoginButtonEnabled = true
              $('.otp_segment').show();
              $('.otp_btn').show();
              $('.login_btn').hide();
              $('#loginInputOTP').focus();
            }

          }, error => {
            //this.loader = true;
            //this.isLoginButtonEnabled = true
          })
      })
  }

  /*method defination for opening auth modal */
  handleOpenAuthModal(elem) {
    this.modalService.open(elem, { centered: true });
  }

  /* Method defination for two factor authentication  */
  loginThroughOtp() {
    console.log('social media id', this.socialMediaIdUsedForTwoFactorAuth);
    
    document.body.classList.add('overlay')
    var otpObj = {};
    //otpObj['email'] = this.email;
    if (localStorage.getItem('socialLoginType') == 'google') {
      otpObj['socialMediaId'] = localStorage.getItem('google_app_id')

    }
    else{
    otpObj['socialMediaId'] = localStorage.getItem('linkedin_app_id')


    }
    otpObj['otp'] = this.twoFactorOtp;
    otpObj['callFrom'] = 'login';
    var jsonString = JSON.stringify(otpObj);
    // wip(1);
    this.httpH.post<any>(this.data.WEBSERVICE + '/user/CheckTwoFactor', jsonString, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(response => {
        // wip(0);
        var result = response;
        this.loginResponse = result
        if (result.error.error_data != '0') {
          document.body.classList.remove('overlay')
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          document.body.classList.remove('overlay')
          this.setLoginData(this.loginResponse);
        }
      },
        reason => {
          this.data.alert(reason, 'danger')
          document.body.classList.remove('overlay')
        });
  }
  /* Method defination for Oauth API call and user details */
  setLoginData(data) {
    let userId = data.userResult.userId;
    localStorage.setItem('access_token', data.token);
    let body = new URLSearchParams();
    localStorage.setItem('uuid', data.userResult.uuid)
    body.set('username', localStorage.getItem('uuid'));
    body.set('password', 'social');
    body.set('grant_type', 'password');
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('authorization', 'Basic cGF5Yml0by13ZWItY2xpZW50OlB5Z2h0bzM0TEpEbg==')
    };
    /*  this.httpH.post<any>(this.data.WEBSERVICE + '/oauth/token', body.toString(), options)
       .subscribe(dataAuth => {
         let accessToken = dataAuth.access_token;
         let refreshToken = dataAuth.refresh_token;
         let expires_In = dataAuth.expires_in;
         localStorage.setItem('access_token', accessToken);
         localStorage.setItem('refresh_token', refreshToken);
         var expiresTime = expires_In;
         expiresTime = expiresTime * 3600000;
         var start_time = $.now();
         var expiresIn = start_time + expiresTime; */
    var userObj = {};
    userObj['userId'] = userId;
    userObj['uuid'] = localStorage.getItem('uuid');
    var userJsonString = JSON.stringify(userObj);
    this.httpH.post<any>(this.data.WEBSERVICE + '/user/GetUserDetails', userJsonString, { headers: { 'Content-Type': 'application/json', 'authorization': 'BEARER ' + localStorage.getItem('access_token') } })
      .subscribe(dataRecheck => {
        document.body.classList.remove('overlay')
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
                        this.zone.run(() => {
              this.route.navigate(['/basic']);

            });
          }
          else if (sessionStorage.getItem('otcroute') == 'otc') {
            this.zone.run(() => {
              this.route.navigate(['/otc']);

            });
            
          }
          else if (sessionStorage.getItem('proDashboard') == 'pro') {
            this.zone.run(() => {
              this.route.navigate(['/dashboard']);

            });
           
          }
          else {
            if (dataRecheck.userResult.userTierType == 2 || dataRecheck.userResult.userTierType == 3) {
              this.zone.run(() => {
                this.route.navigate(['/dashboard']);
  
              });
            }
            else {
              this.zone.run(() => {
                this.route.navigate(['/identity-verification']);
  
              });
             
            }
          }
          this.modalService.dismissAll()
          this.data.alert('Login Successful!', 'success');
          this.data.Countdown();
        }
      }, reason => {
        this.data.alert(reason, 'danger');
      });
    /* }, reason => {
      //this.data.alert(reason, 'danger');
      this.data.alert('Server Error Occured', 'danger');
    }); */
  }


  /* Method defination for goole auth initialization */
  googleAuthSDK() {

    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id: this.data.GOOGLECLIENTID,
          plugin_name: 'login',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.loginWithGoogle();
      });
    }

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement('script');
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  }

  /* Method defination to get linked in access token*/
  handleLinkedInAccessToken = (param) => {
    console.log('Linked in login data', param);
    document.body.classList.add('overlay');


    let payload = new URLSearchParams();
    payload.set('grant_type', 'authorization_code');
    payload.set('code', param);
    payload.set('redirect_uri', this.data.LINKEDINREDIRECTURI);
    payload.set('client_id', this.data.LINKEDINCLIENTID);
    payload.set('client_secret', this.data.LINKEDINSECRETID);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };


    /* this.httpH.post('https://www.linkedin.com/oauth/v2/accessToken', payload.toString(), options)
      .subscribe(data => {
        console.log('Linked in access token  success',data);
      }, error => {
        console.log('Linked in access token error',error)
        document.body.classList.remove('overlay');
      }) */




    this.httpH.get(this.data.WEBSERVICE + '/home/getLinkedInData/desktop?code=' + param, { responseType: 'text' })
      .subscribe(data => {
        let res = JSON.parse(data)
        console.log('res', data);
        console.log(data.indexOf('400'), data.indexOf('401'), data.indexOf('404'), data.indexOf('403'), data.indexOf('500'))
        if (
          data.indexOf('400') == -1 &&
          data.indexOf('401') == -1 &&
          data.indexOf('404') == -1 &&
          data.indexOf('403') == -1 &&
          data.indexOf('500') == -1
        ) {
          localStorage.setItem('linkedin_app_id', res['id'])
          localStorage.setItem('linkedin_email', res['email'])
          localStorage.setItem('linkedin_name', res['firstName'] + ' ' + res['lastName'])
          localStorage.setItem('socialLoginType', 'linkedin')
          console.log('Linked Token', localStorage.getItem('linkedin_app_id'))
          this.handleLoginAPICall(localStorage.getItem('linkedin_app_id'), res['linkedinToken'], 'LinkedIn')
        } else {
          document.body.classList.remove('overlay');
          this.data.alert('Unable to retrieve from LinkedIn', 'danger');
        }
      }, error => {
        console.log(error)
        document.body.classList.remove('overlay');
      })


  }

  /* method defination for opening SMS otp popup */
  handleOpenSmsOtp = () => {
    this.smsOtp = '';
    console.log('OTP is ready to open')
    console.log(this);
    console.log(this.smsAuth)

    if (localStorage.getItem('socialLoginType') == 'google') {
      this.zone.run(() => {
        this.modalService.open(this.smsAuth, { centered: true });
      });
    } else {
      this.modalService.open(this.smsAuth, { centered: true });
    }
  }
  /* Method defination for calling API for sms auth   */
  async handleSmsAuthSubmit() {
    let isOtpValidated = await this.data.handleConfirmOtpInSmsForLogin('loginverifymobileotp', this.userPhoneUsingForSendingSms, this.smsOtp, '', this.socialMediaIdUsedForTwoFactorAuth);
    if (isOtpValidated) {
      if (localStorage.getItem('twoFactorAuth') == '0') {
        this.loginResponse = JSON.parse(localStorage.getItem('loginData'))
        this.setLoginData(this.loginResponse);
      } else {
        //this.otpBlock = true;
        this.modalService.dismissAll()

        this.modalService.open(this.twoFactorAuth, { centered: true, backdrop: false, keyboard: false });

        // this.isLoginButtonEnabled = true
        // $('.otp_segment').show();
        // $('.otp_btn').show();
        // $('.login_btn').hide();
        // $('#loginInputOTP').focus();
      }
    } else {

    }
  }

  /* Get Code button for sms auth popup */
  async handleSendOtpThroughSms() {
    let payload = {
      phone : this.userPhoneUsingForSendingSms
    }
    let isOtpSendToPhone = await this.data.handleSendOtpInSms(payload, 'loginmobileotp');
    if (isOtpSendToPhone) {
      var timeleft = this.data.timeIntervalForSms;
      this.intervalForSms;
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
    } else {

    }

  }

  ngOnInit() {
    localStorage.removeItem('facebook_app_id');
    localStorage.removeItem('google_app_id');
    localStorage.setItem('isForceReload', 'true');
    /* Initializing goole auth function */
    this.googleAuthSDK();

    const linkedInCode: string = this.route1.snapshot.queryParamMap.get('code');
    if (linkedInCode != null && linkedInCode != undefined && linkedInCode != '') {
      this.handleLinkedInAccessToken(linkedInCode);
    }

    /* Initializing app for facebook login */
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '816280339515292',
        cookie: false,
        xfbml: true,
        version: 'v2.10'
      });
      FB.AppEvents.logPageView();

    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));



    console.log('init', this.purpose)
    localStorage.setItem('purpose', this.purpose)
    this.generateUUID();
    this.epicFunction();

  }
  ngAfterViewInit() {
    /* Initializing goole auth function */
    this.googleAuthSDK();



  }

  ngDoCheck() {
    if (localStorage.getItem('isCallAccountDetails') == 'true') {
      localStorage.setItem('isCallAccountDetails', 'false');
      this.getAccountDetails();
    }
    if (localStorage.getItem('isCallLoginApi') == 'true') {
      localStorage.setItem('isCallLoginApi', 'false');
      localStorage.setItem('socialLoginType', 'facebook')
      this.handleLoginAPICall(localStorage.getItem('facebook_app_id'), localStorage.getItem('facebookAccessToken'), 'Facebook')
    }

    if (localStorage.getItem('isReloadPage') == 'true') {
      localStorage.setItem('isReloadPage', 'false');
      window.location.reload();
    }




  }



}
