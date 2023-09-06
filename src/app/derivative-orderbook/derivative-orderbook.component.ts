import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as $ from "jquery";
import { CoreDataService } from "../core-data.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Title } from '@angular/platform-browser'
import { DerivativeWebSocketAPI } from "../DerivativeWebSocketAPI";
import { getQueryPredicate } from "@angular/compiler/src/render3/view/util";
import { DerivativeDashboardComponent } from '../derivative-dashboard/derivative-dashboard.component';
import { DerivativeTradeComponent } from '../derivative-trade/derivative-trade.component';
import { DerivativeStoplossComponent } from '../derivative-stoploss/derivative-stoploss.component';
declare const toggleslide: any;

export interface Todo {
  id: number | string;
  createdAt: number;
  value: string;
}

@Component({
  selector: 'app-derivative-orderbook',
  templateUrl: './derivative-orderbook.component.html',
  styleUrls: ['./derivative-orderbook.component.css']
})
export class DerivativeOrderbookComponent implements OnInit {
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
  marketTradeRecords: any;
  itemcount: any;
  rocreact: any;
  filterCurrency: any;
  header: any;
  assets: any;
  currency_code: any;
  base_currency: any;
  assetPair: any;
  assetPairName: any;
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
  p;
  s;
  tradep;
  tradem;
  assetCode;
  currencyId;
  // Themecolor: any;
  allAssetPairList: any = []
  @Input() Themecolor = 'Dark';
  @Output() tradeBookData: EventEmitter<any> = new EventEmitter();
  @Output() bidDataOutput: EventEmitter<any> =   new EventEmitter();
  askdataFinal: any;
  biddataFinal: any;



  constructor(private titleService: Title,
    public data: CoreDataService,
    public dash: DerivativeDashboardComponent,
    private http: HttpClient,
    private trade: DerivativeTradeComponent,
    public websocket: DerivativeWebSocketAPI,
    public stoploss: DerivativeStoplossComponent) { }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {

    $('.orderbook-dropdown').hover(function () {
      $('.fa-angle-double-down').addClass('fa-angle-double-up').removeClass('fa-angle-double-down');
    }, function () {
      $('.fa-angle-double-up').addClass('fa-angle-double-down').removeClass('fa-angle-double-up');
    });
    // this.Themecolor = this.dash.Themecolor


    this.selectedSellingCryptoCurrencyName = this.data.selectedSellingCryptoCurrencyName;
    this.selectedBuyingCryptoCurrencyName = this.data.selectedBuyingCryptoCurrencyName;
    console.log(this.selectedBuyingCryptoCurrencyName, this.selectedSellingCryptoCurrencyName)
    console.log(localStorage.getItem('selected_derivative_asset_pair_name'), localStorage.getItem('selected_derivative_asset_pair'))

    if (
      localStorage.getItem('selected_derivative_asset_pair_name') == undefined ||
      localStorage.getItem('selected_derivative_asset_pair_name') == null ||
      localStorage.getItem('selected_derivative_asset_pair_name') == 'undefined' ||
      localStorage.getItem('selected_derivative_asset_pair_name') == 'null' ||
      localStorage.getItem('selected_derivative_asset_pair_name') == '' ||
      localStorage.getItem('selected_derivative_asset_pair') == undefined ||
      localStorage.getItem('selected_derivative_asset_pair') == null ||
      localStorage.getItem('selected_derivative_asset_pair') == 'undefined' ||
      localStorage.getItem('selected_derivative_asset_pair') == 'null' ||
      localStorage.getItem('selected_derivative_asset_pair') == ''
    ) {
      this.assetPairName = 'BTCUSD Perpetual'
      this.currency_code = 'BTC';
      this.base_currency = 'USD';
      this.assetPair = 'BTCUSD_PERP';
    } else {
      this.assetPairName = localStorage.getItem('selected_derivative_asset_pair_name')
      this.currency_code = localStorage.getItem('buying_crypto_asset');
      this.base_currency = localStorage.getItem('selling_crypto_asset');
      this.assetPair = localStorage.getItem('selected_derivative_asset_pair');
    }
    this.getNewCurrency('ALL');
    $(".caret").on('click', function () {
      $(this).toggleClass('is-active').next(".caret").stop().slideToggle(500);
    });

    $(".asset-dtl-font").click(function () {
      $(".asset-dtl-font").attr('disabled', false);
      $(this).attr('disabled', true);
    });
    this.changemode();

    this.tickerResponse();
    this.serverSentEventForOrderbookAsk();
    this.tardebookHistory();

    /* checking if asset pair drop down is rendered is not */
    setTimeout(() => {
      // debugger;
      // console.log('asset pair back',this.assetetpairback)
      if (this.assetetpairback.length == 0) {
       // location.reload();
      }
    }, 6000);
    /* Removing counter for asset chnage */
    localStorage.removeItem('assetChangeCounterForFutures');

    /* Funtionality for showing 24H high and low value visible , area between the bid & ask orderbook */
    setInterval(() => {

      if (document.getElementById("pricered") != null && document.getElementById("pricered") != null) {

        document.getElementById("pricered").style.display = "inline-block";
        document.getElementById("pricegreen").style.display = "none";
      }
      setTimeout(() => {
        if (document.getElementById("pricered") != null && document.getElementById("pricered") != null) {
          document.getElementById("pricered").style.display = "none";
          document.getElementById("pricegreen").style.display = "inline-block";
        }
      }, 3000);
    }, 6000)

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


  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    $('.filterseacrh').val('');
    this.assetetpairback = [...this.assetetpair];
  }

  changemode() {
    // if (this.data.changescreencolor == true) {
      if(this.Themecolor != 'Dark'){
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
    //this.Themecolor = this.dash.Themecolor

    // this.changemode();
    var randomNoForFlashArr = [];
    var arraylength = 2;
    var valcurrency = this.data.ctpdata;
    if (valcurrency == undefined) {
      //this.ctpdata = this.chartlist.CTP;
      //this.ltpdata = this.chartlist.LTP;
      this.lowprice = this.chartlist.LOW_PRICE;
      this.highprice = this.chartlist.HIGH_PRICE;
    } else {
      //this.ctpdata = this.data.ctpdata;
      //this.ltpdata = this.data.ltpdata;
      this.lowprice = this.data.lowprice;
      this.highprice = this.data.highprice;
    }
    var randomNo = this.randomNoForOrderBook(0, arraylength);
    randomNoForFlashArr.push(randomNo);
    // for (var i = 0; i < arraylength; i++) {
    //   if (!$.inArray(i, randomNoForFlashArr)) {
    //     if (i == 0) {
    //       document.getElementById("pricered").style.display = "inline-block";
    //       document.getElementById("pricegreen").style.display = "none";
    //     } else {
    //       document.getElementById("pricered").style.display = "none";
    //       document.getElementById("pricegreen").style.display = "inline-block";
    //     }
    //   }
    // }
    /* logic for if asset pair has changed 5 times then reload the page */
    if (localStorage.getItem('assetChangeCounterForFutures') == '5') {
      document.body.classList.add("overlay")
      localStorage.setItem('assetChangeCounterForFutures', '1');
      // location.reload();
    }
    this.tradep = 6;

  }

  getNewCurrency(currency) {
    $('.asset-dtl-font').attr('disabled', false);
    $("#asset-table .btn").click(function () {
      $("#asset-table .btn").removeClass('active');
      $(this).toggleClass('active');
    });

    this.assetetpair = [];
    this.assetetpairback = [];
    this.http.get<any>('https://accounts.paybito.com/CacheService/api/getData?Name=DerivativeAssets')
      .subscribe(responseCurrency => {
        // console.log('-----------in response for get data ----------------------')
        //console.log(JSON.parse(responseCurrency.value))
        localStorage.setItem('derivative_assets', responseCurrency.value)
        this.filterCurrency = JSON.parse(responseCurrency.value);
        this.header = this.filterCurrency.Header;
        this.assets = this.filterCurrency.Values;
        let basecur = this.assets.filter(x => x.baseCurrency == 'USD' && x.currencyCode == 'BTC')
        this.data.changeMessage1(basecur[0].amountPrecision);
        this.data.changeMessage2(basecur[0].pricePrecision);
        if (
          localStorage.getItem('selected_derivative_asset_pair_name') == undefined ||
          localStorage.getItem('selected_derivative_asset_pair_name') == null ||
          localStorage.getItem('selected_derivative_asset_pair_name') == 'undefined' ||
          localStorage.getItem('selected_derivative_asset_pair_name') == 'null' ||
          localStorage.getItem('selected_derivative_asset_pair_name') == '' ||
          localStorage.getItem('selected_derivative_asset_pair') == undefined ||
          localStorage.getItem('selected_derivative_asset_pair') == null ||
          localStorage.getItem('selected_derivative_asset_pair') == 'undefined' ||
          localStorage.getItem('selected_derivative_asset_pair') == 'null' ||
          localStorage.getItem('selected_derivative_asset_pair') == ''
        ) {
          localStorage.setItem('amountprc', basecur[0].amountPrecision);
          localStorage.setItem('priceprc', basecur[0].pricePrecision);
          localStorage.setItem('assetCode', basecur[0].assetCode);
          localStorage.setItem('currencyId', basecur[0].currencyId);
        } else {
          localStorage.setItem('amountprc', localStorage.getItem('amountprc'));
          localStorage.setItem('priceprc', localStorage.getItem('priceprc'));
          localStorage.setItem('assetCode', localStorage.getItem('assetCode'));
        }
        if(localStorage.getItem('amountprc') == undefined ||
        localStorage.getItem('amountprc') == null ||
        localStorage.getItem('amountprc') == 'undefined' ||
        localStorage.getItem('amountprc') == 'null' ||
        localStorage.getItem('amountprc') == ''){
          localStorage.setItem('amountprc', basecur[0].amountPrecision);
          localStorage.setItem('priceprc', basecur[0].pricePrecision);
          localStorage.setItem('assetCode', basecur[0].assetCode);
        }

        var basrcurrency = currency;
        var x;
        for (var i = 0; i <= this.assets.length - 1; i++) {
          if (basrcurrency == this.assets[i].baseCurrency) {
            if (this.assets[i].roc > 0) {
              this.roccolor = true;
            }
            else {
              this.roccolor = false;
            }
            if (this.assets[i].action == 'buy') {
              this.ltpcolor = true;
            }
            else if (this.assets[i].action == 'sell') {
              this.ltpcolor = false;
            }
            else {
              this.ltpcolor = null;
            }
            this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade1': this.assets[i].ltpValue, lasttrade2: this.assets[i].ltpConvValue, 'lpricecolor': this.ltpcolor, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'RocColor': this.roccolor, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode, 'assetPair': this.assets[i].assetPair, 'assetPairName': this.assets[i].assetPairName, 'currencyId': this.assets[i].currencyId });
            this.assetetpairback = [...this.assetetpair];
          }

          else if (basrcurrency == 'ALL') {
            if (this.assets[i].roc > 0) {
              this.roccolor = true;
            }
            else {
              this.roccolor = false;
            }
            if (this.assets[i].action == 'buy') {
              this.ltpcolor = true;
            }
            else if (this.assets[i].action == 'sell') {
              this.ltpcolor = false;
            }
            else {
              this.ltpcolor = null;
            }

            if (this.assets[i].currencyType == '1') {
              var lastprice = parseFloat(this.assets[i].ltpValue) + '/' + this.assets[i].ltpConvValue;
              this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade1': this.assets[i].ltpValue, lasttrade2: this.assets[i].ltpConvValue, 'lpricecolor': this.ltpcolor, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode, 'assetPair': this.assets[i].assetPair, 'assetPairName': this.assets[i].assetPairName, 'currencyId': this.assets[i].currencyId });
              this.assetetpairback = [...this.assetetpair];
            }
          }

          else if (basrcurrency == 'OTHER') {
            if (this.assets[i].baseCurrency != 'AED' && this.assets[i].baseCurrency != 'USD' && this.assets[i].baseCurrency != 'INR' && this.assets[i].baseCurrency != 'ETH' && this.assets[i].baseCurrency != 'BTC') {
              var lastprice = parseFloat(this.assets[i].ltpValue) + '/' + this.assets[i].ltpConvValue;
              this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade': lastprice, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode, 'assetPair': this.assets[i].assetPair, 'assetPairName': this.assets[i].assetPairName, 'currencyId': this.assets[i].currencyId });
              this.assetetpairback = [...this.assetetpair];
            }
          }
        }
        this.handleSetLeverageMinMaxValue('2', '125');
      })
  }

  getselectval() {
    var fiattype = $("#selectval option:selected").text();
    if (fiattype == 'ALL') {
      this.getNewCurrency('ALL');
    }
    else if (fiattype == 'AED') {
      this.getNewCurrency('AED');
    }
    else if (fiattype == 'INR') {
      this.getNewCurrency('INR');
    }
    else if (fiattype == 'USD') {
      this.getNewCurrency('USD');
    }
  }

  filterItem(searchStr: string) {
    this.assetetpairback = this.assetetpair.filter((item) => {
      if (item.currencycode.includes(searchStr.toUpperCase())) {
        return item;
      }
    });
  }

  resetstoplossinputfield() {
    this.stoploss.stopLossPrice = '';
    this.stoploss.stopLossTriggerPrice = '';
    this.stoploss.stopLossQuantity = '';
    this.stoploss.limitAmount = '';
    this.stoploss.limitPrice = '';
    this.stoploss.limitValue = '';
    this.stoploss.onlyBuyAmount = '';
    this.stoploss.onlyBuyPrice = '';
    this.stoploss.onlyBuyTotalPrice = '';
    this.stoploss.onlySellAmount = '';
    this.stoploss.onlySellPrice = '';
    this.stoploss.onlySellTotalPrice = '';
    $(function () {
      $('input.form-control').val('');
    })
  }

  buySellCode(item) {
    this.websocket.unsubscribe();
    if (this.websocket.stompClient !== null) {
      setTimeout(() => {
        this.websocket.subscribe();
      }, 5000);
    }
    if (this.tickerSubscription != undefined) {
      this.tickerSubscription.unsubscribe();
    }
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
    if (this.subscription1 != undefined) {
      this.subscription1.unsubscribe();
    }

    this.resetstoplossinputfield();
    (item.currency == "BCC") ? this.currency_code = "BCH" : this.currency_code = item.currency;
    document.getElementById("myDropdown").classList.toggle("show");
    this.currency_code = item.currencycode;
    this.base_currency = item.basecurrency;
    this.assetPair = item.assetPair;
    this.assetPairName = item.assetPairName
    this.amountPrecision = item.amountPrecision;
    this.pricePrecision = item.pricePrecision;
    this.assetCode = item.assetCode;
    this.currencyId = item.currencyId;
    localStorage.setItem('amountprc', this.amountPrecision);
    localStorage.setItem('priceprc', this.pricePrecision);
    localStorage.setItem('assetCode', this.assetCode);
    localStorage.setItem('currencyId', this.currencyId);
    this.data.selectedSellingAssetText = this.base_currency;
    this.data.selectedBuyingAssetText = this.currency_code;
    this.data.selectedBuyingCryptoCurrencyName = this.base_currency + this.currency_code;
    this.data.selectedSellingCryptoCurrencyName = this.currency_code + this.base_currency;
    this.selectedBuyingAssetText = item.currencyCode;
    this.selectedSellingAssetText = item.baseCurrency;
    localStorage.setItem("buying_crypto_asset", this.currency_code.toLocaleLowerCase());
    localStorage.setItem("selling_crypto_asset", this.base_currency.toLocaleLowerCase());
    localStorage.setItem("selected_derivative_asset_pair", this.assetPair);
    localStorage.setItem("selected_derivative_asset_pair_name", this.assetPairName);
    this.data.cur = this.selectedSellingAssetText;
    this.assetpairsell = item.currencyCode + item.baseCurrency;
    this.assetpairbuy = item.baseCurrency + item.currencyCode;
    this.data.selectedSellingCryptoCurrencyissuer = "";
    this.data.selectedBuyingCryptoCurrencyissuer = "";
    this.data.changeMessage1(this.amountPrecision);
    this.data.changeMessage2(this.pricePrecision)
    this.data.changeMessage(this.currency_code);
    setTimeout(() => {
      this.tickerResponse();
    }, 3000);
    this.serverSentEventForOrderbookAsk();
    this.tardebookHistory();
    // this.trade.reload();
    this.trade.myTradeDisplay(0);
    $('#trade').click();
    $('#dropHolder').css('overflow', 'scroll');
    $(window).resize(function () {
      var wd = $('#chartHolder').width();
      $('#dropHolder').width(wd);
      $('#dropHolder').css('overflow', 'scroll');
    });
    /* setting flag for asset pair change */
    localStorage.setItem('isAssetPairChangedRecentlyFutures', 'true')
    localStorage.setItem('isResetTheStoplossfieldForFutures', 'true')


    /* Setting flag for page reload after asset selection 5 times */
    let assetChangeCounter: any = localStorage.getItem('assetChangeCounterForFutures');
    if (
      assetChangeCounter != undefined && assetChangeCounter != 'undefined' &&
      assetChangeCounter != 'null' && assetChangeCounter != null
    ) {
      assetChangeCounter = parseInt(assetChangeCounter);
      assetChangeCounter++;
      localStorage.setItem('assetChangeCounterForFutures', assetChangeCounter);
    } else {
      localStorage.setItem('assetChangeCounterForFutures', '1');
    }
    this.handleSetLeverageMinMaxValue('2', '125');

  }

  /* Method defination for handling leverage value */
  handleSetLeverageMinMaxValue = (min, max) => {
    localStorage.setItem('leverage_min_limit', min)
    localStorage.setItem('leverage_max_limit', max)

  }

  randomNoForOrderBook(minVal: any, maxVal: any): number {
    var minVal1: number = parseInt(minVal);
    var maxVal1: number = parseInt(maxVal);
    return Math.floor(Math.random() * (maxVal1 - minVal1 + 2) + minVal1);
  }

  tickerResponse() {
    this.http.get<any>("https://futures-stream.paybito.com/fSocketStream/api/get24hTicker?assetPair=" + this.assetPair, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {
      var result = data;
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
          //this.ctpdata = this.data.ctpdata = this.chartlist.ctp;
          //this.ltpdata = this.data.ltpdata = this.chartlist.ltp;
          this.lowprice = this.data.lowprice = this.chartlist.lowPrice;
          this.highprice = this.data.highprice = this.chartlist.highPrice;
          this.act = this.data.ACTION = this.chartlist.action;
          this.data.rocdata = this.chartlist.roc;
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
      this.setTitle(this.data.ltpdata + ' | ' + 'BTCUSD Perpetual' + ' | ' + this.data.exchange);
    });

    this.tickerSubscription = this.websocket.currentMessage.subscribe(message => {
      this.message = message;
      var result = this.message;
      if (result != " ") {
        this.chartlist = JSON.parse(result);
        if (this.chartlist.tR) {
          //this.ctpdata = this.data.ctpdata = this.chartlist.tR.ctp;
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
            //this.ctpdata = this.data.ctpdata = this.chartlist.tR.ctp;
            //this.ltpdata = this.data.ltpdata = this.chartlist.tR.ltp;
            this.lowprice = this.data.lowprice = this.chartlist.tR.lowPrice;
            this.highprice = this.data.highprice = this.chartlist.tR.highPrice;
            this.act = this.data.ACTION = this.chartlist.tR.action;
            this.data.rocdata = this.chartlist.tR.roc;
            this.data.volumndata = parseFloat(this.chartlist.tR.volume).toFixed(2);
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
      this.setTitle(this.data.ltpdata + ' | ' + this.assetPairName + ' | ' + this.data.exchange);
    });
  }

  getPrice(m) {
    // this.p = localStorage.getItem('priceprc');
    return (parseFloat(m.price)).toFixed(parseInt(this.tradep));
  }

  getAmount(m) {
    // this.s = localStorage.getItem('amountprc');
    return (parseFloat(m.amount)).toFixed(parseInt(this.tradep));
  }

  serverSentEventForOrderbookAsk() {
    this.biddata = [];
    this.askdata = [];
    //http://18.144.130.37:7080/SocketStream/api/depth?symbol=btcusd&limit=10
    //$('#marketTrade').html('<tr><td colspan="3" class="text-center"><img src="./assets/svg-loaders/three-dots.svg" alt="" width="50"></td></tr>');
    this.http.get<any>("https://futures-stream.paybito.com/fSocketStream/api/depth?symbol=" + localStorage.getItem("selected_derivative_asset_pair") + "&limit=25", {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        console.log(data)
        var askSideData = result.ask;
        this.askdata = askSideData.sort((a, b) => b.price - a.price);
        this.biddata = result.bid;

        this.biddataFinal = this.biddata
        this.askdataFinal = this.askdata

        var a = {'ask':this.askdataFinal, 'bid':this.biddataFinal}

        this.bidDataOutput.emit(a);
      });

    this.subscription = this.websocket.currentMessage.subscribe(message => {
      this.message = message;
      if (this.message != " ") {
        var orderbookdata = JSON.parse(this.message);
        console.log(orderbookdata)
        if (orderbookdata.e == 'depthUpdate' && orderbookdata.ask != '') {
          for (var i = 0; i < orderbookdata.ask.length; i++) {
            if (orderbookdata.ask[i].action == 'NEW' && orderbookdata.ask[i].side == "ASK") {
              this.askdata.push({ 'price': (parseFloat(orderbookdata.ask[i].price)).toFixed(parseInt(this.p)), 'amount': (parseFloat(orderbookdata.ask[i].quantity)).toFixed(parseInt(this.s)), 'newly': true });
              for (var h = 0; h < this.askdata.length; h++) {
                if (this.askdata[h].newly == true) {
                  setTimeout(() => {
                    this.askdata.forEach(element => {
                      element['newly'] = false;
                    });
                  }, 4000)
                }
              }
            }

            else if (orderbookdata.ask[i].action == 'CHANGE' && orderbookdata.ask[i].side == "ASK") {
              for (var j = 0; j < this.askdata.length; j++) {
                if ((this.askdata[j].price) == parseFloat(orderbookdata.ask[i].price)) {
                  this.askdata[j].amount = orderbookdata.ask[i].quantity;
                  this.askdata[j]['newly'] = true;
                }
              }
              setTimeout(() => {
                this.askdata.forEach(element => {
                  element['newly'] = false;
                });
              }, 2000)

            }

            else if (orderbookdata.ask[i].action == 'DELETE' && orderbookdata.ask[i].side == "ASK") {
              var index = this.askdata.findIndex((y) => y.price == parseFloat(orderbookdata.ask[i].price));
              if (index > -1) {
                this.askdata.splice(index, 1);
              }
            }
          }
          if (this.askdata.length > 50) {
            var askLength = this.askdata.length;
            this.askdata = this.askdata.slice((askLength - 50), askLength);
          }

          this.askdata = this.askdata.sort((a, b) => b.price - a.price);
          // if(this.askdata.length>50){
          //  this.askdata = this.askdata.slice(0,50);
          // }

        }


        else if (orderbookdata.e == 'depthUpdate' && orderbookdata.bid != '') {
          for (var i = 0; i < orderbookdata.bid.length; i++) {
            if (orderbookdata.bid[i].action == 'NEW' && orderbookdata.bid[i].side == "BID") {
              this.biddata.push({ 'price': (parseFloat(orderbookdata.bid[i].price)).toFixed(parseInt(this.p)), 'amount': (parseFloat(orderbookdata.bid[i].quantity)).toFixed(parseInt(this.s)), 'newly': true });

              for (var h = 0; h < this.biddata.length; h++) {
                if (this.biddata[h].newly == true) {
                  setTimeout(() => {
                    this.biddata.forEach(element => {
                      element['newly'] = false;
                    });
                  }, 4000);
                }
              }
            }

            else if (orderbookdata.bid[i].action == 'CHANGE' && orderbookdata.bid[i].side == "BID") {
              for (var j = 0; j < this.biddata.length; j++) {
                if (this.biddata[j].price == parseFloat(orderbookdata.bid[i].price)) {
                  this.biddata[j].amount = orderbookdata.bid[i].quantity;
                  this.biddata[j].newly = true;
                }
              }

              setTimeout(() => {
                this.biddata.forEach(element => {
                  element['newly'] = false;
                });
              }, 2000);
            }

            else if (orderbookdata.bid[i].action == 'DELETE' && orderbookdata.bid[i].side == "BID") {
              var index = this.biddata.findIndex((x) => x.price == parseFloat(orderbookdata.bid[i].price));
              if (index > -1) {
                this.biddata.splice(index, 1);
              }
            }

          }
          this.biddata = this.biddata.sort((a, b) => b.price - a.price);

          if (this.biddata.length > 50) {
            this.biddata = this.biddata.slice(0, 50);
          }



          this.askdataFinal = this.askdata
          this.biddataFinal = this.biddata

          var a = {'ask':this.askdataFinal, 'bid':this.biddataFinal}

          this.bidDataOutput.emit(a);

        }
      }

    });


  }



  tardebookHistory() {
    this.marketTradeRecords = [];
    this.tradeBookData.emit(this.marketTradeRecords);
    this.http.get<any>("https://futures-stream.paybito.com/fSocketStream/api/tradeHistory?symbol=" + localStorage.getItem("selected_derivative_asset_pair") + "&limit=50", {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        console.log(data)
        this.marketTradeRecords = result;
        this.tradeBookData.emit(this.marketTradeRecords);

      });

    this.subscription1 = this.websocket.currentMessage.subscribe(message => {
      this.message = message;
      if (this.message != " ") {
        var tradeHistorydata = JSON.parse(this.message);
        if (tradeHistorydata.e == 'trade') {
          for (var i = 0; i < tradeHistorydata.tH.length; i++) {

            this.data.ltpdata = (parseFloat(tradeHistorydata.tH[i].price)).toFixed(parseInt(this.tradep))
            this.ctpdata = this.data.ltpdata
            //console.log('TICKER DATA => ',this.data.ltpdata,this.ctpdata)
            if (tradeHistorydata.tH[i].side == "ASK") {
              this.marketTradeRecords.unshift({ 'quantity': (parseFloat(tradeHistorydata.tH[i].quantity)).toFixed(parseInt(this.tradem)), 'price': (parseFloat(tradeHistorydata.tH[i].price)).toFixed(parseInt(this.tradep)), 'timestamp': tradeHistorydata.tH[i].timestamp, 'side': tradeHistorydata.tH[i].side, 'newask': true });

              for (var h = 0; h < this.marketTradeRecords.length; h++) {
                if (this.marketTradeRecords[h].newask == true) {
                  setTimeout(() => {
                    this.marketTradeRecords.forEach(element => {
                      element['newask'] = false;
                    });
                  }, 3000)
                }
              }
            }

            if (tradeHistorydata.tH[i].side == "BID") {
              this.marketTradeRecords.unshift({ 'quantity': (parseFloat(tradeHistorydata.tH[i].quantity)).toFixed(parseInt(this.tradem)), 'price': (parseFloat(tradeHistorydata.tH[i].price)).toFixed(parseInt(this.tradep)), 'timestamp': tradeHistorydata.tH[i].timestamp, 'side': tradeHistorydata.tH[i].side, 'newbid': true });
              for (var h = 0; h < this.marketTradeRecords.length; h++) {
                if (this.marketTradeRecords[h].newbid == true) {
                  setTimeout(() => {
                    this.marketTradeRecords.forEach(element => {
                      element['newbid'] = false;
                    });
                  }, 3000)
                }
              }
            }

          }

          if (this.marketTradeRecords.length > 100) {
            this.marketTradeRecords = this.marketTradeRecords.slice(0, 100);
            this.tradeBookData.emit(this.marketTradeRecords);


          }
        }
      }
    });
  }

  getTradePrice(m) {
    this.tradep = localStorage.getItem('priceprc');
    return (parseFloat(m.price)).toFixed(parseInt(this.tradep));
  }

  getTradeAmount(m) {
    this.tradem = localStorage.getItem('amountprc');
    return (parseFloat(m.quantity)).toFixed(parseInt(this.tradem));
  }

  ngOnDestroy() {
    if (this.tickerSubscription != undefined) {
      this.tickerSubscription.unsubscribe();
    }

    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
    if (this.subscription1 != undefined) {
      this.subscription1.unsubscribe();
    }
    if (this.data.source2 != undefined) {
      this.data.source2.close();
    }
    if (this.source1 != undefined) {
      this.source1.close();
    }
    if (this.websocket.stompClient != null) {
      this.websocket.unsubscribe();
    }
    if (this.websocket.stompClient != null) {
      this.websocket._disconnect();
    }
  }

}
