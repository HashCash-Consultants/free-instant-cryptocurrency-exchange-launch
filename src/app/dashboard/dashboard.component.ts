import { Component, OnInit, ViewChild } from "@angular/core";
import { CoreDataService } from "../core-data.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as $ from "jquery";
import { HttpClient } from "@angular/common/http";
import { TvChartContainerComponent } from "src/app/tv-chart-container/tv-chart-container.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  alertType: any;
  alertMsg: any;
  chart: any = true;
  orderbook: any = true;
  trade: any = true;
  stoploss: any = true;
  drag: any = false;
  mode: any = false;
  chartlist: any;
  lowprice: any;
  highprice;
  any = 0;
  ctpdata: any = 0;
  selectedBuyingCryptoCurrencyName: string;
  selectedSellingCryptoCurrencyName: string;
  screencolor: boolean;
  public Themecolor;
  myInterval: any;

  @ViewChild('myModal') myModal : any;


  constructor(
    public data: CoreDataService,
    private route: Router,
    private http: HttpClient,
    public tvChartContainerComponent: TvChartContainerComponent,
    private route1: ActivatedRoute,
    private modalService: NgbModal,

  ) { }

  ngOnInit() {

    this.checkAndShowPaymentRenewPopup()
    
    

    this.checkThemeIfApplied()
    const prodashboard = this.route1.snapshot.queryParamMap.get('pro');
    sessionStorage.setItem('proDashboard',prodashboard);
    this.selectedSellingCryptoCurrencyName = "usdt";
    this.selectedBuyingCryptoCurrencyName = "btc";
    this.data.changescreencolor = false;
    // this.Themecolor = 'Dark';
    // localStorage.setItem('themecolor', this.Themecolor);
    $(document).ready(function () {
      $(this).scrollTop(0);
      var i = 1;
      $(".drg").click(function () {
        i++;
        $(this).css("z-index", i);
      });
      $(':input[type="number"]').keyup(function () {
      });
    });
    document.body.classList.add("overlay");
     /* Event defination for checking if page is ideal */
     var IDLE_TIMEOUT = 120; //seconds
     var _idleSecondsCounter = 0;
     document.onclick = function () {
       _idleSecondsCounter = 0;
     };
     document.onmousemove = function () {
       _idleSecondsCounter = 0;
     };
     document.onkeypress = function () {
       _idleSecondsCounter = 0;
     };
 
     this.myInterval = setInterval(() => {
       CheckIdleTime()
     }, 1000);
 
     function CheckIdleTime() {
       _idleSecondsCounter++;
       var oPanel = document.getElementById("dashboardContent");
        console.log('IDLE TIME ', IDLE_TIMEOUT, _idleSecondsCounter)
       if (_idleSecondsCounter >= IDLE_TIMEOUT) {
         //alert("Time expired!");
        //  clearInterval(this.myInterval);
        //  location.reload()
        this.data.reloadPage(this.route.url);

       }
     }



     
  }

  checkAndShowPaymentRenewPopup(){

    this.http
      .get<any>(this.data.WEBSERVICE + "/home/brokerSubscriptionStatus?brokerId=" + this.data.BROKERID, {
        headers: {
          Authorization: "BEARER " + localStorage.getItem("access_token"),
        },
      })
      .subscribe(

        (result) => {
          if(result.paymentStatus == 2){
            this.modalService.open(this.myModal, { centered: true,backdrop: 'static',
               keyboard: false });
          }
        }
        

      )
  }

  redirectToPayment(){
    window.location.href = 'https://pay.hashcashconsultants.com/product/broker-monthly-subsciption-payment/';
  }

  checkThemeIfApplied(){
    var themecolor = localStorage.getItem('themecolor');
    console.log('saved theme', themecolor)
    if(themecolor == null || themecolor == undefined){
      this.Themecolor = 'Dark';
      localStorage.setItem('themecolor', this.Themecolor);
      $(".content-wrapper").css("background-color", "#131722").removeClass("intro");
      document.getElementById("light").style.display = "block";
      document.getElementById("night").style.display = "none";

    this.screencolor = false;
    this.data.changescreencolor = false;

      
      this.tvChartContainerComponent.changeThemeColor('Dark')

    }
    else{

      if(themecolor == 'Dark'){
        this.Themecolor = 'Dark';
      localStorage.setItem('themecolor', this.Themecolor);
        $(".content-wrapper").css("background-color", "#131722").removeClass("intro");
      document.getElementById("light").style.display = "block";
      document.getElementById("night").style.display = "none";

        this.screencolor = false;
        this.data.changescreencolor = false;

        
      this.tvChartContainerComponent.changeThemeColor('Dark')

      }
      if(themecolor == 'Light'){
        this.Themecolor = 'Light';
        localStorage.setItem('themecolor', this.Themecolor);

        $(".content-wrapper").css("background-color", "#fafafa").addClass("intro");

      document.getElementById("night").style.display = "block";
      document.getElementById("light").style.display = "none";

      this.screencolor = true;
      this.data.changescreencolor = true;

     
      console.log('changing tv color theme to light');
      // setTimeout(() => {
      // this.tvChartContainerComponent.changeThemeColor('Light')
        
      // }, 100);
      

      this.tvChartContainerComponent.changeThemeColor('Light')

      }

    }
       
  }

  ngOnDestroy() {
    // window.clearInterval(this.myInterval);
     clearInterval(this.myInterval)
   }

  changebg(val) {
    this.screencolor = val;
    this.data.changescreencolor = val;
    if (this.data.changescreencolor == true) {
      this.Themecolor = 'Light';
      localStorage.setItem('themecolor', this.Themecolor);
      // $(".content-wrapper").css("background-color", "#ececec").addClass("intro");
      $(".content-wrapper").css("background-color", "#fafafa").addClass("intro");
      // document.body.style.background = "#fafafa !important";

      document.getElementById("night").style.display = "block";
      document.getElementById("light").style.display = "none";
      this.tvChartContainerComponent.changeThemeColor('Light')
    } else {
      // document.body.style.background = "#131722 !important";

      $(".content-wrapper").css("background-color", "#131722").removeClass("intro");
      document.getElementById("light").style.display = "block";
      document.getElementById("night").style.display = "none";
      this.Themecolor = 'Dark';
      localStorage.setItem('themecolor', this.Themecolor);
      this.tvChartContainerComponent.changeThemeColor('Dark')

    }
  }
  randomNoForOrderBook(minVal: any, maxVal: any): number {
    var minVal1: number = parseInt(minVal);

    var maxVal1: number = parseInt(maxVal);

    return Math.floor(Math.random() * (maxVal1 - minVal1 + 2) + minVal1);
  }

  themeChangedHandler(val){

    this.Themecolor = val;

  }
}
