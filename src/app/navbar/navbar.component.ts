import { Component, EventEmitter, OnInit, Output, DoCheck, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CoreDataService } from '../core-data.service';
import { BodyService } from '../body.service';
import { HttpClient, } from '@angular/common/http';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { TvChartContainerComponent } from '../tv-chart-container/tv-chart-container.component';
import * as $ from "jquery";
import { ConnectionService } from 'ng-connection-service';
declare var FB: any;


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() themeChanged: EventEmitter<number> = new EventEmitter();
  @Output() connectionData: EventEmitter<any> = new EventEmitter();
  @ViewChild('myModal') myModal : any;

  auth2: any;
  userName: any;
  profilePic: any;
  closeResult: string;
  token: any = localStorage.getItem('access_token');
  mode: any
  modeMessage: any;
  alertType: any;
  alertMsg: any;
  currentRoute: any;
  reason: any;
  time: number = 10;
  isNavbarCollapsed = true;
  lightActive: boolean = false;
  sideMenu: any = [
    { name: 'Profile Info', alias: 'profile-details' },
    { name: 'Identity Verification', alias: 'identity-verification' },
    { name: 'Bank Info', alias: 'bank-details' },
    { name: 'My Wallet', alias: 'my-wallet' },
    { name: 'Deposit Funds', alias: 'deposit-funds' },
    { name: 'Withdraw Funds', alias: 'withdraw-funds' },
    { name: 'Settings', alias: 'settings' },
    { name: 'History', alias: 'history' },
    { name: 'Report', alias: 'report' },
    { name: 'Refer & Earn', alias: 'promotion' },
    // { name: 'Support', alias: 'support' },
  ];
  upperMenu: any = [
    { name: 'Basic', alias: 'basic' },
    { name: 'Spot', alias: 'dashboard' },
    /* {name:'Portfolio Holdings',alias:'portfolio-holdings'} */
    { name: 'Futures', alias: 'derivative-dashboard' },
    { name: 'Options', alias: 'options-dashboard' },
    { name: 'OTC', alias: 'otc' },

    // { name: 'Copy Trading / Social Trading', alias: 'copy-trading' }


    // {name:'History',alias:'history'},
    // {name:'Report',alias:'report'},
  ]
  interval;
  userid: string;
  act: string;
  imageLink: string;
  userDocStatus: any;
  Themecolor: any;
  screencolor: any;
  isConnected = true;
  noInternetConnection: boolean;
  constructor(private modalService: NgbModal, private route: Router, public data: CoreDataService,
    private http: HttpClient, public main: BodyService,
    public tvChartContainerComponent: TvChartContainerComponent, private connectionService: ConnectionService) {
    this.route.events.subscribe(val => {
      this.currentRoute = val;
      // console.log(this.currentRoute)
    });

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.noInternetConnection = false;
        console.log('internet on');
        // this.data.alert('Please select a valid type','danger')
        this.connectionData.emit(this.noInternetConnection);


      }
      else {
        this.noInternetConnection = true;
        console.log('internet off');
        this.connectionData.emit(this.noInternetConnection);
        

        // this.data.alert('No internet Connection','danger')

      }
    })
  }

  handleFacebookLogout = () => {
    FB.logout(function (response) {
      console.log('logout from facebook initiated', response);
    });
  }

  handleGoogleLogout = () => {
    this.auth2.signOut().then(function () {
      console.log('User signed out from google.');
      this.data.handlePageReloadForecibily(100)
    });
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

 
  async ngOnInit() {
    /*Method defination for checking user is blocked or not  */
// this.data.checkDashPermission('nav');

    this.data.getAllBrokerDetails();
    this.data.getBrokerWhitelabelDetails();

    var a = await this.data.checkUserBlockStatus();
    console.log('blocked statussss', a);
    this.checkAndShowPaymentRenewPopup()


    $(document).ready(function() {
      $('.goog-te-menu-value span').css('color', '#d6cece');
    });

    /* initializing google auth*/
    this.googleAuthSDK();
    /* Initializing app */
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
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    if (this.route.url != '/dashboard') {
    }
    if (this.token == null) {
      this.route.navigateByUrl('/login');
      this.data.handlePageReloadForecibily(100)
    }
    this.userName = localStorage.getItem('user_name');

    if(this.userName.length > 5){
      this.userName = this.userName.substring(0, 5) + '..';

    }
    else{
    this.userName = localStorage.getItem('user_name');

    }




    this.userid = localStorage.getItem('user_id');
    this.act = localStorage.getItem('access_token');
    this.profilePic = localStorage.getItem('profile_pic');
    console.log(this.profilePic)
    this.imageLink = (this.profilePic != undefined) ? this.data.WEBSERVICE + '/user/' + this.userid + '/file/' + this.profilePic + '?access_token=' + this.act : './assets/img/default.png'
    console.log(this.imageLink)
    this.main.getUserDetails();
    setTimeout(() => {
      document.body.classList.remove("overlay");
    }, 6000);

    $(document).ready(function () {
      var scroll_pos = 0;
      let color = '#181d2b';
      let picker = "body::-webkit-scrollbar-thumb {background:" + color + ";}body::-webkit-scrollbar-track {background-color:#272f2721;}";
      let new_stylesheet = "<style type='text/css' id='currentCSS'>" + picker + "</style>";

      //check if stylsheet exists          
      let existingStylesheet = $("#currentCSS");
      if (existingStylesheet.length) { $(existingStylesheet).replaceWith(new_stylesheet); }
      else { $(new_stylesheet).appendTo('head'); }
    });
    //this.userDocStatus = this.main.userDocStatus;

  }
  ngDoCheck() {
    
    // this.userDocStatus = this.main.userDocStatus;
    //console.log(localStorage.getItem('profile_pic'));
    if (localStorage.getItem('profile_pic') != undefined && localStorage.getItem('profile_pic') != null && localStorage.getItem('profile_pic') != '' && localStorage.getItem('profile_pic') != 'null') {

      if (this.main.profilePic != undefined && this.main.profilePic != null) {
        this.imageLink = this.main.profilePic
      } else {
        this.imageLink = this.data.WEBSERVICE + '/user/' + this.userid + '/file/' + this.profilePic + '?access_token=' + this.act;
      }
    } else {
      this.imageLink = './assets/img/default.png'
    }
    //console.log(this.imageLink)

    // this.Themecolor = this.dash.Themecolor;
    this.Themecolor = localStorage.getItem('themecolor');

    if (this.Themecolor == null || this.Themecolor == undefined) {
      this.Themecolor = 'Dark'
      localStorage.setItem('themecolor', this.Themecolor);

    }

    if (this.Themecolor == 'Dark') {
      this.lightActive = true;
      let elem: any = document.querySelectorAll('.goog-te-gadget-simple');
      if (elem[0] != undefined && elem[0] != null) {

        elem[0].style.backgroundColor = "#24262D";
      }
      //let list :any = document.querySelectorAll('.VIpgJd-ZVi9od-vH1Gmf');
      //list[0].style.backgroundColor = "#24262D";   
      // let lang :any = document.querySelectorAll('.VIpgJd-ZVi9od-vH1Gmf-ibnC6b');
      // lang[0].style.backgroundColor = "#24262D"; 

    }
    else {
      this.lightActive = false;
      let elem: any = document.querySelectorAll('.goog-te-gadget-simple');
      if (elem[0] != undefined && elem[0] != null) {
        elem[0].style.backgroundColor = "#DEDEDE";
      }
    }

    if (this.Themecolor != 'Dark') {
      var scroll_pos = 0;
      let color = '#ffffff';
      let picker = "body::-webkit-scrollbar-thumb {background:" + color + ";}body::-webkit-scrollbar-track {background-color:#d3dddd;}";
      let new_stylesheet = "<style type='text/css' id='currentCSS'>" + picker + "</style>";

      //check if stylsheet exists          
      let existingStylesheet = $("#currentCSS");
      if (existingStylesheet.length) { $(existingStylesheet).replaceWith(new_stylesheet); }
      else { $(new_stylesheet).appendTo('head'); }
    }

    else {

      var scroll_pos = 0;
      let color = '#0c0f16';
      let picker = "body::-webkit-scrollbar-thumb {background:" + color + ";}body::-webkit-scrollbar-track {background-color:#1a1f2a;}";
      let new_stylesheet = "<style type='text/css' id='currentCSS'>" + picker + "</style>";

      //check if stylsheet exists          
      let existingStylesheet = $("#currentCSS");
      if (existingStylesheet.length) { $(existingStylesheet).replaceWith(new_stylesheet); }
      else { $(new_stylesheet).appendTo('head'); }

    }
    // //console.log('saved theme', this.Themecolor)

  }

  open(content) {
    this.modalService.open(content);
  }

  changebg(val) {
    this.screencolor = val;
    this.data.changescreencolor = val;
    if (this.data.changescreencolor == true) {
      this.Themecolor = 'Light';
      this.lightActive = false;
      localStorage.setItem('themecolor', this.Themecolor);
      this.themeChanged.emit(this.Themecolor);
      // $(".content-wrapper").css("background-color", "#fafafa").addClass("intro");

      this.tvChartContainerComponent.changeThemeColor('Light')

      if (this.route.url == '/spot' || this.route.url == '/futures' || this.route.url == '/options') {
        location.reload();
      }

    } else {
      $(".content-wrapper").css("background-color", "#131722").removeClass("intro");
      this.Themecolor = 'Dark';
      this.lightActive = true;

      localStorage.setItem('themecolor', this.Themecolor);
      this.themeChanged.emit(this.Themecolor);

      this.tvChartContainerComponent.changeThemeColor('Dark')
      if (this.route.url == '/spot' || this.route.url == '/futures' || this.route.url == '/options') {
        location.reload();
      }

    }

  }


  checkAndShowPaymentRenewPopup(){

    // this.http
    //   .get<any>(this.data.WEBSERVICE + "/home/brokerSubscriptionStatus?brokerId=" + this.data.BROKERID, {
    //     headers: {
    //       Authorization: "BEARER " + localStorage.getItem("access_token"),
    //     },
    //   })
    //   .subscribe(

       

    //     (result) => {

    //       if(this.data.BROKERID == 'ARNA06022023114437'){
          
    //       }
    //       else{
    //         if(result.paymentStatus == 2){
    //           this.modalService.open(this.myModal, { centered: true,backdrop: 'static',
    //              keyboard: false });
    //         }
    //       }
          
    //     }
        

    //   )
  }

}
