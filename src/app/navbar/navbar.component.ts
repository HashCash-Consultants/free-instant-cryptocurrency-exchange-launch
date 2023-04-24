import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output() themeChanged: EventEmitter<number> =   new EventEmitter();
  auth2:any;
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
    { name: 'OTC', alias: 'otc' },
    /* {name:'Portfolio Holdings',alias:'portfolio-holdings'} */
    { name: 'Futures', alias: 'derivative-dashboard' },
    { name: 'Options', alias: 'options-dashboard' },
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
  disableMenu: boolean = false;
  constructor(private modalService: NgbModal, private route: Router, public data: CoreDataService, 
    private http: HttpClient, public main: BodyService, 
    public tvChartContainerComponent: TvChartContainerComponent,private connectionService: ConnectionService) {
    this.route.events.subscribe(val => {
      this.currentRoute = val;
      // console.log(this.currentRoute)
    });

    this.connectionService.monitor().subscribe(isConnected => {  
      this.isConnected = isConnected;  
      if (this.isConnected) {  
        this.noInternetConnection=false; 
        console.log('internet on');
        // this.data.alert('Please select a valid type','danger')
         
      }  
      else {  
        this.noInternetConnection=true;  
         console.log('internet off');
        // this.data.alert('No internet Connection','danger')

      }  
    }) 
  }

  handleFacebookLogout = () => {
     FB.logout(function(response) {
      console.log('logout from facebook initiated',response);
     });
  }

  handleGoogleLogout = () => {

    console.log('this.auth2',this.data.auth2New)
    this.data.auth2New.signOut().then(function () {
      console.log('User signed out from google.');
      // this.data.handlePageReloadForecibily(100)
    //   this.zone.run(() => {
    //     this.route.navigate(['/login']);
  
    // });
    });
    console.log('this.auth2after',this.data.auth2New)
  }

    /* Method defination for goole auth initialization */
    googleAuthSDK() {

      (<any>window)['googleSDKLoaded'] = () => {
        (<any>window)['gapi'].load('auth2', () => {
          this.data.auth2New = (<any>window)['gapi'].auth2.init({
            client_id:this.data.GOOGLECLIENTID,
            plugin_name:'login',
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

      setTimeout(() => {

        console.log('this.auth2 init',  this.data.auth2New);
        
        
      }, 5000);
    }


    disableMenuWait(){
       console.log('CU',this.route.url)
       if(this.route.url == '/dashboard' || this.route.url == '/derivative-dashboard' || this.route.url == '/options-dashboard'){
         this.disableMenu = true;
        setTimeout(() => {

      this.disableMenu = false;
        
      }, 8000);
       }
      
    }
    

  ngOnInit() {
    /*Method defination for checking user is blocked or not  */
   var a =this.data.checkUserBlockStatus();
   console.log('blocked bb', a);

   this.disableMenuWait()

  //  this.data.getAllBrokerDetails();
   
    /* initializing google auth*/
    this.googleAuthSDK();
    /* Initializing app */
    // (window as any).fbAsyncInit = function () {
    //   FB.init({
    //     appId: '816280339515292',
    //     cookie: false,
    //     xfbml: true,
    //     version: 'v2.10'
    //   });
    //   FB.AppEvents.logPageView();
      
    // };

    // (function (d, s, id) {
    //   var js, fjs = d.getElementsByTagName(s)[0];
    //   if (d.getElementById(id)) { return; }
    //   js = d.createElement(s); js.id = id;
    //   js.src = "https://connect.facebook.net/en_US/sdk.js";
    //   fjs.parentNode.insertBefore(js, fjs);
    // }(document, 'script', 'facebook-jssdk'));

    if (this.route.url != '/dashboard') {
    }
    if (this.token == null) {
      this.route.navigateByUrl('/login');
      // this.data.handlePageReloadForecibily(100)
    }
    this.userName = localStorage.getItem('user_name');
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

    $(document).ready(function(){       
      var scroll_pos = 0;
      let color = '#181d2b';
      let picker = "body::-webkit-scrollbar-thumb {background:" + color + ";}body::-webkit-scrollbar-track {background-color:#272f2721;}";
      let new_stylesheet = "<style type='text/css' id='currentCSS'>" + picker + "</style>";

      //check if stylsheet exists          
      let existingStylesheet = $("#currentCSS");
      if (existingStylesheet.length) {$(existingStylesheet).replaceWith(new_stylesheet);}
      else {$(new_stylesheet).appendTo('head');}
  });
    //this.userDocStatus = this.main.userDocStatus;

  }
  ngDoCheck() {
    // this.userDocStatus = this.main.userDocStatus;
    //console.log(localStorage.getItem('profile_pic'));
    if (localStorage.getItem('profile_pic') != undefined && localStorage.getItem('profile_pic') != null && localStorage.getItem('profile_pic') != '' && localStorage.getItem('profile_pic') != 'null') {
      
      if(this.main.profilePic != undefined && this.main.profilePic  != null){
        this.imageLink = this.main.profilePic
      }else{
        this.imageLink = this.data.WEBSERVICE + '/user/' + this.userid + '/file/' + this.profilePic + '?access_token=' + this.act;
      }
    } else {
      this.imageLink = './assets/img/default.png'
    }
    //console.log(this.imageLink)

    // //this.Themecolor = this.dash.Themecolor;
    this.Themecolor = localStorage.getItem('themecolor');

    if(this.Themecolor == null || this.Themecolor == undefined){
      this.Themecolor = 'Dark'
      localStorage.setItem('themecolor', this.Themecolor);

    }

    if(this.Themecolor == 'Dark'){
      this.lightActive = true;
    }
    else{
      this.lightActive = false;

    }

    if(this.Themecolor != 'Dark'){
      var scroll_pos = 0;
let color = '#ffffff';
let picker = "body::-webkit-scrollbar-thumb {background:" + color + ";}body::-webkit-scrollbar-track {background-color:#d3dddd;}";
let new_stylesheet = "<style type='text/css' id='currentCSS'>" + picker + "</style>";

//check if stylsheet exists          
let existingStylesheet = $("#currentCSS");
if (existingStylesheet.length) { $(existingStylesheet).replaceWith(new_stylesheet); }
else { $(new_stylesheet).appendTo('head'); }
  }

  else{

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

  changebg(val){
    console.log('djdjdjdjdjdjdjdjdjdjd');
    
    this.screencolor = val;
    this.data.changescreencolor = val;
    if (this.data.changescreencolor == true) {
      this.Themecolor = 'Light';
      this.lightActive = false;
      localStorage.setItem('themecolor', this.Themecolor);
      this.themeChanged.emit(this.Themecolor);
      $(".content-wrapper").css("background-color", "#fafafa").addClass("intro");

      this.tvChartContainerComponent.changeThemeColor('Light')

    } else {
      $(".content-wrapper").css("background-color", "#131722").removeClass("intro");
      this.Themecolor = 'Dark';
      this.lightActive = true;

      localStorage.setItem('themecolor', this.Themecolor);
      this.themeChanged.emit(this.Themecolor);

      this.tvChartContainerComponent.changeThemeColor('Dark')

    }

  }



}
