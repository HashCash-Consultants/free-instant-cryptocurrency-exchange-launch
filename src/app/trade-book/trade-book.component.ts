import { Component, OnInit ,ChangeDetectionStrategy,ChangeDetectorRef,Input } from '@angular/core';
import { TradesComponent } from "../trades/trades.component";
import * as $ from "jquery";
import { CoreDataService } from "../core-data.service";
import { Router } from "@angular/router";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { HttpClient } from "@angular/common/http";
import { StopLossComponent } from "../stop-loss/stop-loss.component"
import { Title } from '@angular/platform-browser'
import { WebSocketAPI } from "../WebSocketAPI";
import { getQueryPredicate } from "@angular/compiler/src/render3/view/util";
import { timer } from "rxjs";
declare const toggleslide: any;

export interface Todo {
  id: number | string;
  createdAt: number;
  value: string;
}

@Component({
  selector: 'app-trade-book',
  templateUrl: './trade-book.component.html',
  styleUrls: ['./trade-book.component.css']
})
export class TradeBookComponent implements OnInit {
  buyingAssetIssuer: string;
  sellingAssetIssuer: string;
  bidBody: string;
  askBody: string;
  orderBookUrl: string;
  count: any;
  lowprice: any;
  highprice;
  any = 0;
  chartlist: any = 0;
  ctpdata: any = 0;
  ltpdata: any = 0;
  act: any;
  rocdata: any;
  volumndata: any;
  marketTradeBodyHtml: any;
  public biddata: any;
  public askdata: any;
  public biddataFinal: any;
  public askdataFinal: any;
  public source1: any;
  urlBid: any;
  urlAsk: any;
  selectedBuyingCryptoCurrencyName: string;
  selectedSellingCryptoCurrencyName: string;
  sellingAssetType: string;
  buyingAssetType: string;
  source12: any;
  source: any;
  token: any;
 // marketTradeRecords: any;
  itemcount: any;
  rocreact: any;
  filterCurrency: any;
  header: any;
  assets: any;
  currency_code: any;
  base_currency: any;
  selectedBuyingAssetText: string;
  selectedSellingAssetText: string;
  assetpairbuy: string;
  assetpairsell: string;
  responseBuySell: any;
  assetcount = [];
  assetetpair = [];
  assetetpairback = [];
  orderbiddata = [];
  orderaskdata = [];
  roccolor;
  ltpcolor;
  message: any;
  subscription: any;
  subscription1: any;
  tickerSubscription: any;
  amountPrecision: any;
  pricePrecision: any;
  p:any = 6;
  s:any = 6;
  tradep : any = 6;
  tradem;
  assetCode;
  // Themecolor: any = 'Dark';
  orderbookPrice: any;
  dropdownFiatList: Array<string> = [];
  showFiatDopdown : boolean = false;
  selectedFiat : string = 'FIAT'
  buySellDiff: any = 0;
  @Input() Themecolor = 'Dark';
  @Input() marketTradeRecords:any

  constructor(private titleService: Title,
    public data: CoreDataService,
    public dash: DashboardComponent,
    private http: HttpClient,
    private trade: TradesComponent,
    public websocket: WebSocketAPI,
    public stoploss: StopLossComponent,
    private changeDetectorRef: ChangeDetectorRef

  ) {

  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
   
this.getPrecission();

  }

  getPrecission(){

    this.tradep = localStorage.getItem('priceprc')
    console.log('buying asset',localStorage.getItem('buying_crypto_asset'))


    if(this.tradep == null || this.tradep == 'null' || this.tradep == undefined || this.tradep == 'undefined'){
      this.tradep = 6;
      console.log('5',this.tradep)


      localStorage.setItem('priceprc',this.tradep)
    }
    else if(localStorage.getItem('buying_crypto_asset') == 'BTC' || localStorage.getItem('buying_crypto_asset') == 'btc' ){
      this.tradep = 6;

    }
    else{
      console.log('6',this.tradep)
    }
  }
  

  changemode() {
    if (this.Themecolor != 'Dark') {
      $(".bg_new_class")
        .removeClass("bg-dark")
        .css("background-color", "#fefefe");
      $(".sp-highlow").css("background-color", "#d3dddd");
      $(".sp-highlow").css("color", "Black");
      $(".border-col").css("border-color", "#d3dddd");
      $("th").css({ "background-color": "#d3dddd", color: "#273338" });
      $(".text-left").css("color", "black");
      $(".text-right").css("color", "black");
    } else {
      $(".bg_new_class")
        .removeClass("bg-dark")
        .css("background-color", "#16181a");
      $(".sp-highlow").css("background-color", "#273338");
      $(".sp-highlow").css("color", "yellow");
      $(".border-col").css("border-color", "#273338");
      $("th").css({ "background-color": "#273338", color: "#d3dddd" });
      $(".text-left")
        .css("color", "")
        .css("color", "rgb(153, 152, 152)");
      $(".text-right").css("color", "rgb(153, 152, 152)");
    }
  }

  ngDoCheck() {
   
  }

  



  
  
 
  getPrice(m) {
    this.p = localStorage.getItem('priceprc');
    return (parseFloat(m.price)).toFixed(parseInt(this.tradep));
  }

  getAmount(m) {
    this.s = localStorage.getItem('amountprc');
    return (parseFloat(m.amount)).toFixed(parseInt(this.tradep));
  }
  
 




  getTradePrice(m) {
    // this.tradep = localStorage.getItem('priceprc');
    return (parseFloat(m.price)).toFixed(parseInt(this.tradep));
  }

  getTradeAmount(m) {
    // this.tradem = localStorage.getItem('amountprc');
    return (parseFloat(m.quantity)).toFixed(parseInt(this.tradep));
  }

  

  

  ngOnDestroy() {
    
    
  }

}
