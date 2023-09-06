import { Component, OnInit } from '@angular/core';
import { CoreDataService } from "../core-data.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as $ from "jquery";
import { HttpClient } from "@angular/common/http";
import { OptionsTvchartcontainerComponent } from '../options-tvchartcontainer/options-tvchartcontainer.component';

@Component({
  selector: 'app-options-dashboard',
  templateUrl: './options-dashboard.component.html',
  styleUrls: ['./options-dashboard.component.css']
})
export class OptionsDashboardComponent implements OnInit {
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
  tradeBookDataInput: any;
  stableConnectionData: any;
  bidDataInput: any;
  chartselector: boolean = true;


  constructor(  public data: CoreDataService,
    private route: Router,
    private http: HttpClient,
    public tvChartContainerComponent: OptionsTvchartcontainerComponent,
    private route1: ActivatedRoute) { 
    }

    ngOnInit() {
    this.data.checkDashPermission('options')

      this.checkThemeIfApplied()
      // const prodashboard = this.route1.snapshot.queryParamMap.get('pro');
      // sessionStorage.setItem('proDashboard',prodashboard);
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
var IDLE_TIMEOUT = 60; //seconds
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
  // console.log('IDLE TIME ', IDLE_TIMEOUT, _idleSecondsCounter)
  if (_idleSecondsCounter >= IDLE_TIMEOUT) {
    //alert("Time expired!");
    // clearInterval(this.myInterval);
    // location.reload()
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
        $(".content-wrapper").css("background-color", "#ececec").addClass("intro");
        document.getElementById("night").style.display = "block";
        document.getElementById("light").style.display = "none";
        // this.tvChartContainerComponent.changeThemeColor('Light')

      } else {
        $(".content-wrapper").css("background-color", "#131722").removeClass("intro");
        document.getElementById("light").style.display = "block";
        document.getElementById("night").style.display = "none";
        this.Themecolor = 'Dark';
        localStorage.setItem('themecolor', this.Themecolor);
        // this.tvChartContainerComponent.changeThemeColor('Dark')

      }
    }

    checkThemeIfApplied(){
      var themecolor = localStorage.getItem('themecolor');
      //console.log('saved theme', themecolor)
      if(themecolor == null || themecolor == undefined){
        $(".content-wrapper").css("background-color", "#131722").removeClass("intro");
        document.getElementById("light").style.display = "block";
        document.getElementById("night").style.display = "none";
  
      this.screencolor = false;
      this.data.changescreencolor = false;
  
        this.Themecolor = 'Dark';
        localStorage.setItem('themecolor', this.Themecolor);
        // this.tvChartContainerComponent.changeThemeColor('Dark')
  
      }
      else{
  
        if(themecolor == 'Dark'){
          $(".content-wrapper").css("background-color", "#131722").removeClass("intro");
        document.getElementById("light").style.display = "block";
        document.getElementById("night").style.display = "none";
  
          this.screencolor = false;
          this.data.changescreencolor = false;
  
          this.Themecolor = 'Dark';
        localStorage.setItem('themecolor', this.Themecolor);
        // this.tvChartContainerComponent.changeThemeColor('Dark')
  
        }
        if(themecolor == 'Light'){
  
          $(".content-wrapper").css("background-color", "#fafafa").addClass("intro");
  
        document.getElementById("night").style.display = "block";
        document.getElementById("light").style.display = "none";
  
        this.screencolor = true;
        this.data.changescreencolor = true;
  
        this.Themecolor = 'Light';
        localStorage.setItem('themecolor', this.Themecolor);
        console.log('changing tv color theme to light');
        
        // this.tvChartContainerComponent.changeThemeColor('Light')
  
        }
  
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

    tradeBookDataHandler(val){

      this.tradeBookDataInput = val;
      //console.log('IN PARENT +++',this.tradeBookDataInput)
  
    }

    connectionChangedHandler(val){
      this.stableConnectionData = val;
      console.log('connnnn', this.stableConnectionData);
      
      
    }

    bidDataHandler(data){
      this.bidDataInput = data;
  
      // console.log('askbid data',this.bidDataInput);
      
  
    }
  
    toggleChart(val){
  
      this.chartselector = val;
    }


}
