import { Component, OnInit, DoCheck } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CoreDataService } from "../core-data.service";
import { StopLossComponent } from "../stop-loss/stop-loss.component";
import { TradesComponent } from "../trades/trades.component";
import * as $ from "jquery";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { Action } from "rxjs/internal/scheduler/Action";
import { isNgTemplate } from "@angular/compiler";
import { Subscription } from "rxjs";
import { Title } from '@angular/platform-browser';
import { WebSocketAPI } from '../WebSocketAPI';
import { C } from "@angular/core/src/render3";
import { OrderBookComponent } from "../order-book/order-book.component"

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"]
})
export class ChartComponent implements OnInit {
  title = 'angulartitle';
  webSocketAPI: WebSocketAPI;
  greeting: any;
  name: string;
  req: any;
  reqNo: any;
  reqNo1: any;
  filePath: string;
  fileDir: string;
  url: any = null;
  chartDataInit: any;
  chartData: any;
  selected: any;
  indicatorStatus: any = 0;
  indicatorName: any = "";
  apiUrl: string;
  apiData: any;
  loader: boolean;
  errorText: string;
  selectedBuyingCryptoCurrencyName: string;
  selectedSellingCryptoCurrencyName: string;
  selectedCryptoCurrencySymbol: string;
  selectedBuyingAssetText: string;
  selectedSellingAssetText: string;
  currencyListEur: any = 0;
  currencyListBtc: any = 0;
  currencyListEth: any = 0;
  currencyListUsd: any = 0;
  buyPriceText: any;
  chartD: any = "d";
  dateD: any = "1m";
  indicatorGroup1: any;
  indicatorGroup2: any;
  highValue;
  lowValue;
  cur: any;
  tools: boolean;
  chartlist: any;
  ctpdata: any = 0;
  ltpdata: any = 0;
  lowprice: any = 0;
  highprice: any = 0;
  rocdata: number = 0;
  action: any;
  volumndata: any = 0;
  act: any;
  react: boolean;
  buyingAssetIssuer: string;
  sellingAssetIssuer: string;
  //rocact:any;
  rocreact: boolean;
  droc: any;
  negetive: boolean;
  Tonight: boolean;
  Tomorning: boolean;
  filterCurrency: any;
  logic: boolean;
  flag: boolean;
  Cname: any;
  testval = [];
  currency_code: any;
  base_currency: any;
  assetpairbuy: string;
  assetpairsell: string;
  responseBuySell: any;
  header: any;
  assets: any;
  message: any;
  currencyId: any;
  Themecolor: any;
  private currencyapi: Subscription;
  constructor(private titleService: Title,
    public data: CoreDataService,
    public dash: DashboardComponent,
    public websoket: WebSocketAPI,
    public http: HttpClient
  ) { }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    if (
      localStorage.getItem('selling_asset') == undefined ||
      localStorage.getItem('selling_asset') == null ||
      localStorage.getItem('selling_asset') == 'undefined' ||
      localStorage.getItem('selling_asset') == 'null' ||
      localStorage.getItem('selling_asset') == ''

    ) {
      this.base_currency = 'usd';
      localStorage.setItem('selling_asset', this.base_currency);
    } else {
      this.base_currency = localStorage.getItem('selling_asset').toLowerCase();
      localStorage.setItem('selling_asset', this.base_currency);
    }

    this.http.get<any>("https://stream.paybito.com/SocketStream/api/get24hTicker?counter=" + localStorage.getItem("buying_crypto_asset") + "&base=" + localStorage.getItem("selling_asset"), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {
      var result = data;
     // if (this.currency_code == 'BTC' || this.base_currency == 'USDT') {
        this.chartlist = result[0];
        if (this.chartlist) {
          this.ctpdata = this.data.ctpdata = this.chartlist.ctp;
          this.ltpdata = this.data.ltpdata = this.chartlist.ltp;
          this.lowprice = this.data.lowprice = parseFloat(this.chartlist.lowPrice).toFixed(2);
          this.highprice = this.data.highprice = parseFloat(this.chartlist.highPrice).toFixed(2);
          this.act = this.data.ACTION = this.chartlist.action;
          this.data.rocdata = parseFloat(this.chartlist.roc).toFixed(2);
          if (this.data.rocdata > 0) {
            this.data.rocreact = true;
          }
          else {
            this.data.rocreact = false;
          }
          if (this.data.rocdata < 0) {
            this.data.negetive = true;
          }
          else {
            this.data.negetive = false;
          }
          this.data.volumndata = parseFloat(this.chartlist.volume).toFixed(2);
          if(isNaN(this.data.volumndata)){
            this.data.volumndata = 0;
          }
          console.log('24H API',this.chartlist.volume, this.data.volumndata)
          if (this.data.rocdata >= 0) { this.rocreact = true }
          if (this.data.act == 'sell') {
            this.data.react = true;
          }
          else {
            this.data.react = false;
          }
        }
        else {

          this.chartlist = result;
          if (this.chartlist) {
            this.ctpdata = this.data.ctpdata = this.chartlist.ctp;
            //this.ltpdata = this.data.ltpdata = this.chartlist.ltp;
            this.lowprice = this.data.lowprice = this.chartlist.lowPrice;
            this.highprice = this.data.highprice = this.chartlist.highPrice;
            this.act = this.data.ACTION = this.chartlist.action;
            this.data.rocdata = this.chartlist.tR.roc;
            this.data.volumndata = parseFloat(this.chartlist.volume).toFixed(2);
            if(isNaN(this.data.volumndata)){
              this.data.volumndata = 0;
            }
            if (this.data.rocdata > 0) {
              this.rocreact = true;
            }
            else {
              this.data.rocreact = false;
            }
            if (this.data.rocdata < 0) {
              this.data.negetive = true;
            }
            else {
              this.data.negetive = false;
            }

            if (this.data.rocdata >= 0) { this.rocreact = true }
            if (this.data.act == 'sell') {
              this.data.react = true;
            }
            else {
              this.data.react = false;
            }
          }
        }
      //}

      this.setTitle(this.data.ltpdata + ' | ' + 'BTCUSD' + ' | ' + this.data.exchange);

    });


    this.websoket._connect();

    if (this.websoket.stompClient != null) {
      setTimeout(() => {
        this.websoket.subscribe();
      }, 8000);
    }

    this.websoket.currentMessage.subscribe((message: any) => {
      if (message) {
        this.message = message;
        var result = this.message;
        if (result != '' && result != undefined && result != ' ') {
          this.chartlist = JSON.parse(result);
          if (this.chartlist.tR != null) {
            //console.log(this.chartlist.tR)
            this.ctpdata = this.data.ctpdata = this.chartlist.tR.ctp;
            //console.log('ctp data => ',this.data.ctpdata)
            //this.ltpdata = this.data.ltpdata = this.chartlist.tR.ltp;
            this.lowprice = this.data.lowprice = parseFloat(this.chartlist.tR.lowPrice).toFixed(2);
            this.highprice = this.data.highprice = parseFloat(this.chartlist.tR.highPrice).toFixed(2);
            this.act = this.data.ACTION = this.chartlist.tR.action;
            this.data.rocdata = parseFloat(this.chartlist.tR.roc).toFixed(2);
            if (this.data.rocdata > 0) {
              this.data.rocreact = true;
            }
            else {
              this.data.rocreact = false;
            }
            if (this.data.rocdata < 0) {
              this.data.negetive = true;
            }
            else {
              this.data.negetive = false;
            }
            this.data.volumndata = parseFloat(this.chartlist.tR.volume).toFixed(2);
            if(isNaN(this.data.volumndata)){
              this.data.volumndata = 0;
            }
            if (this.data.rocdata >= 0) { this.rocreact = true }
            if (this.data.act == 'sell') {
              this.data.react = true;
            }
            else {
              this.data.react = false;
            }
          }
          else {

            this.chartlist = result;
            if (this.chartlist.tR) {
              this.ctpdata = this.data.ctpdata = this.chartlist.tR.ctp;
              //this.ltpdata = this.data.ltpdata = this.chartlist.tR.ltp;
              console.log('ctp data => ',this.data.ctpdata)
              this.lowprice = this.data.lowprice = this.chartlist.tR.lowPrice;
              this.highprice = this.data.highprice = this.chartlist.tR.highPrice;
              this.act = this.data.ACTION = this.chartlist.tR.action;
              this.data.rocdata = this.chartlist.tR.roc;
              this.data.volumndata = parseFloat(this.chartlist.tR.volume).toFixed(2);
              if(isNaN(this.data.volumndata)){
                this.data.volumndata = 0;
              }
              if (this.data.rocdata > 0) {
                this.rocreact = true;
              }
              else {
                this.data.rocreact = false;
              }
              if (this.data.rocdata < 0) {
                this.data.negetive = true;
              }
              else {
                this.data.negetive = false;
              }

              if (this.data.rocdata >= 0) { this.rocreact = true }
              if (this.data.act == 'sell') {
                this.data.react = true;
              }
              else {
                this.data.react = false;
              }
            }
          }
        }
      }

      this.setTitle(this.data.ltpdata + ' | ' + 'BTCUSD' + ' | ' + this.data.exchange);
    });

    this.selectedBuyingCryptoCurrencyName = this.data.selectedBuyingCryptoCurrencyName;
    if (
      localStorage.getItem('buying_crypto_asset') == undefined ||
      localStorage.getItem('buying_crypto_asset') == null ||
      localStorage.getItem('buying_crypto_asset') == 'undefined' ||
      localStorage.getItem('buying_crypto_asset') == 'null' ||
      localStorage.getItem('buying_crypto_asset') == '' ||
      localStorage.getItem('selling_crypto_asset') == undefined ||
      localStorage.getItem('selling_crypto_asset') == null ||
      localStorage.getItem('selling_crypto_asset') == 'undefined' ||
      localStorage.getItem('selling_crypto_asset') == 'null' ||
      localStorage.getItem('selling_crypto_asset') == ''
    ) {
      this.currency_code = 'BTC';
      this.base_currency = 'USD';

    } 
    else if(localStorage.getItem('isLandedOption') == 'true'){
      this.currency_code = 'BTC';
      this.base_currency = 'USD';
      localStorage.setItem('isLandedOption','false')
    }
    
    else {
      this.currency_code = localStorage.getItem('buying_crypto_asset');
      this.base_currency = localStorage.getItem('selling_crypto_asset');
    }
    localStorage.setItem("buying_crypto_asset", this.currency_code);
    localStorage.setItem("selling_crypto_asset", this.base_currency);
    this.data.selectedSellingAssetText = this.base_currency;
    this.data.selectedBuyingAssetText = this.currency_code;
    // this.Themecolor = this.dash.Themecolor
  }


  changemode() {
    if (this.data.changescreencolor == true) {
      $(".bg_new_class")
        .removeClass("bg-dark")
        .css("background-color", "#fefefe");
      $(".btn")
        .removeClass("bg-black")
        .css("background-color", "#dedede");
      $(".btn").css("border-color", "#b3b4b4");
      $(".btn").css("color", "#000");
      $(".charts-tab.active").css("background-color", "#fefefe");
    } else {
      $(".bg_new_class")
        .removeClass("bg-dark")
        .css("background-color", "#16181a");
      $(".btn")
        .removeClass("bg-black")
        .css("background-color", "rgb(44, 65, 66)");
      $(".btn").css("border-color", "transparent");
      $(".btn").css("color", "#fff");
      $(".charts-tab.active").css("background-color", "#242e3e");
    }
  }

   /* method defination for calling get 24 hr ticker manually */
   handle24hrTickerManualy = () => {
    this.http.get<any>("https://stream.paybito.com/SocketStream/api/get24hTicker?counter=" + localStorage.getItem("buying_crypto_asset") + "&base=" + localStorage.getItem("selling_asset"), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {
      var result = data;
      if (this.currency_code == 'BTC' || this.base_currency == 'USDT') {
        this.chartlist = result[0];
        if (this.chartlist) {
          this.ctpdata = this.data.ctpdata = this.chartlist.ctp;
          //console.log('#############################################')
          //console.log(this.chartlist.ltp)
          //console.log(this.data.ltpdata)
          //this.ltpdata = this.data.ltpdata = this.chartlist.ltp;
          this.lowprice = this.data.lowprice = parseFloat(this.chartlist.lowPrice).toFixed(2);
          this.highprice = this.data.highprice = parseFloat(this.chartlist.highPrice).toFixed(2);
          this.act = this.data.ACTION = this.chartlist.action;
          this.data.rocdata = parseFloat(this.chartlist.roc).toFixed(2);
          this.data.markprice = parseFloat(this.chartlist.markPrice).toFixed(4);
          this.data.indexprice = parseFloat(this.chartlist.indexPrice).toFixed(4);
          if (this.data.markprice > 0) {
            this.data.isMarkPricePositive = true;
          } else {
            this.data.isMarkPricePositive = false;
          }
          if (this.data.indexprice > 0) {
            this.data.isIndexPricePositive = true;
          } else {
            this.data.isIndexPricePositive = false;
          }
          if (this.data.rocdata > 0) {
            this.data.rocreact = true;
          }
          else {
            this.data.rocreact = false;
          }
          if (this.data.rocdata < 0) {
            this.data.negetive = true;
          }
          else {
            this.data.negetive = false;
          }
          this.data.volumndata = parseFloat(this.chartlist.volume).toFixed(2);
          if (this.data.rocdata >= 0) { this.rocreact = true }
          if (this.data.act == 'sell') {
            this.data.react = true;
          }
          else {
            this.data.react = false;
          }
        }
        else {

          this.chartlist = result;
          console.log(this.chartlist)
          if (this.chartlist) {
            this.ctpdata = this.data.ctpdata = this.chartlist.ctp;
            //console.log(this.data)
            //console.log(this.chartlist.ltp)
            //this.ltpdata = this.data.ltpdata = this.chartlist.ltp;
            this.lowprice = this.data.lowprice = this.chartlist.lowPrice;
            this.highprice = this.data.highprice = this.chartlist.highPrice;
            this.act = this.data.ACTION = this.chartlist.action;
            this.data.rocdata = this.chartlist.tR.roc;
            this.data.markprice = parseFloat(this.chartlist.markPrice).toFixed(4);
            this.data.indexprice = parseFloat(this.chartlist.indexPrice).toFixed(4);
            if (this.data.markprice > 0) {
              this.data.isMarkPricePositive = true;
            } else {
              this.data.isMarkPricePositive = false;
            }
            this.data.volumndata = parseFloat(this.chartlist.volume).toFixed(2);
            if (this.data.rocdata > 0) {
              this.rocreact = true;
            }
            else {
              this.data.rocreact = false;
            }
            if (this.data.rocdata < 0) {
              this.data.negetive = true;
            }
            else {
              this.data.negetive = false;
            }

            if (this.data.rocdata >= 0) { this.rocreact = true }
            if (this.data.act == 'sell') {
              this.data.react = true;
            }
            else {
              this.data.react = false;
            }
          }
        }
      }
      console.log('Data Value .... ')
      console.log(this.data)
      this.setTitle(this.data.ltpdata + ' | ' + 'BTCUSD' + ' | ' + this.data.exchange);

    });
   }



  ngDoCheck() {
    // this.changemode();
    // this.Themecolor = this.dash.Themecolor
  }

  disconnect() {
    this.websoket._disconnect();
  }

  ngOnDestroy() {
    if (this.data.source3 != undefined) {
      this.data.source3.close();
    }
    if (this.currencyapi != undefined) {
      this.currencyapi.unsubscribe();
    }
    if (this.websoket.stompClient != null) {
      this.websoket.unsubscribe();
    }
  }
}
