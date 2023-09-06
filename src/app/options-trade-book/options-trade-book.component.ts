import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as $ from "jquery";
import { CoreDataService } from "../core-data.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Title } from '@angular/platform-browser'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OptionsWebSocketAPI } from "../OptionsWebSocketAPI";
import { getQueryPredicate } from "@angular/compiler/src/render3/view/util";
import { OptionsDashboardComponent } from '../options-dashboard/options-dashboard.component';
import { OptionsTradeComponent } from '../options-trade/options-trade.component';
import { OptionsStoplossComponent } from '../options-stoploss/options-stoploss.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
declare const toggleslide: any;


export interface Todo {
  id: number | string;
  createdAt: number;
  value: string;
}

@Component({
  selector: 'app-options-trade-book',
  templateUrl: './options-trade-book.component.html',
  styleUrls: ['./options-trade-book.component.css']
})
export class OptionsTradeBookComponent implements OnInit {

  @ViewChild('noofferPopupModal') noofferPopupModal : any;

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
  itemcount: any;
  rocreact: any;
  filterCurrency: any;
  header: any;
  assets: any = [];
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
  selectedAssetForLeverage;
  selectedLeverageMarginType: any = 2;
  crossRange: Array<string> = ['2X', '25X', '50X', '75X', '100X', '125X']
  selectedCrossRange: any = "2X"
  selectedRangeSliderValue: any = "1";
  sliderStyle: any = {}
  bidIterPrice: any = 0
  askIterPrice: any = 0
  buySellDiff: any = 0;
  // Themecolor: any;
  @Input() Themecolor = 'Dark';

  selectedOptionHeader: any;
  openPopupStatus: boolean = true;
  @ViewChild('myModal') myModal : any;
  @Input() marketTradeRecords:any;


  constructor(private titleService: Title,
    public data: CoreDataService,
    public dash: OptionsDashboardComponent,
    private http: HttpClient,
    private trade: OptionsTradeComponent,
    public websocket: OptionsWebSocketAPI,
    private modalService: NgbModal,
    public stoploss: OptionsStoplossComponent) {
      // this.modalService.open(this.noofferPopupModal, {ariaLabelledBy: 'modal-basic-title'})
    // this.modalService.open(this.noofferPopupModal, { centered: true });

     }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    this.changemode();
    //this.Themecolor = this.dash.Themecolor
    // this.toggleTheme();
    $('.orderbook-dropdown').hover(function () {
      $('.fa-angle-double-down').addClass('fa-angle-double-up').removeClass('fa-angle-double-down');
    }, function () {
      $('.fa-angle-double-up').addClass('fa-angle-double-down').removeClass('fa-angle-double-up');
    });

    this.selectedSellingCryptoCurrencyName = this.data.selectedSellingCryptoCurrencyName;
    this.selectedBuyingCryptoCurrencyName = this.data.selectedBuyingCryptoCurrencyName;
    console.log(this.selectedBuyingCryptoCurrencyName, this.selectedSellingCryptoCurrencyName)
    console.log(localStorage.getItem('selected_options_asset_pair_name'), localStorage.getItem('selected_options_asset_pair'))
    if (
      localStorage.getItem('selected_options_asset_pair_name') == undefined ||
      localStorage.getItem('selected_options_asset_pair_name') == null ||
      localStorage.getItem('selected_options_asset_pair_name') == 'undefined' ||
      localStorage.getItem('selected_options_asset_pair_name') == 'null' ||
      localStorage.getItem('selected_options_asset_pair_name') == '' ||
      localStorage.getItem('selected_options_asset_pair') == undefined ||
      localStorage.getItem('selected_options_asset_pair') == null ||
      localStorage.getItem('selected_options_asset_pair') == 'undefined' ||
      localStorage.getItem('selected_options_asset_pair') == 'null' ||
      localStorage.getItem('selected_options_asset_pair') == ''
    ) {
      /*  this.assetPairName = 'BTCUSD Perpetual'
       this.currency_code = 'BTC';
       this.base_currency = 'USDT';
       this.assetPair = 'BTCUSD_PERP'; */
    } else {
      this.assetPairName = localStorage.getItem('selected_options_asset_pair_name')
      this.currency_code = localStorage.getItem('buying_crypto_asset');
      this.base_currency = localStorage.getItem('selling_crypto_asset');
      this.assetPair = localStorage.getItem('selected_options_asset_pair');
      this.tickerResponse();
      this.tardebookHistory();
      this.serverSentEventForOrderbookAsk();
    }
    /* this.data.selectedSellingAssetText = this.base_currency;
    this.data.selectedBuyingAssetText = this.currency_code; */
    this.getNewCurrency('ALL');
    $(".caret").on('click', function () {
      $(this).toggleClass('is-active').next(".caret").stop().slideToggle(500);
    });

    $(".asset-dtl-font").click(function () {
      $(".asset-dtl-font").attr('disabled', false);
      $(this).attr('disabled', true);
    });



    localStorage.setItem('selected_leverage', this.selectedCrossRange)
    localStorage.setItem('selected_leverage_margin_type', this.selectedLeverageMarginType)
    /* 
        const
      range = document.getElementById('range'),
      rangeV = document.getElementById('rangeV'),
      setValue = ()=>{
        const
          newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) ),
          newPosition = 10 - (newValue * 0.2);
        rangeV.innerHTML = `<span>${range.value}</span>`;
        rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
      };
    document.addEventListener("DOMContentLoaded", setValue);
    range.addEventListener('input', setValue); */
    // this.Themecolor = this.dash.Themecolor
    this.toggleTheme()
    setInterval(() => {
      console.log('********** interval start *********')
      this.websocket.unsubscribe();
      setTimeout(() => {
        console.log('initiated subscribtion');
        this.websocket.subscribe();
      }, 1000);
    }, 600000);

    setInterval(() => {
      this.serverSentEventForOrderbookAsk();
    }, 900000)

    /* checking if asset pair drop down is rendered is not */
    setTimeout(() => {
      // console.log('asset pair back',this.assetetpairback)
      if (this.assetetpairback.length == 0) {
       // location.reload(); //TODO: uncomment this code when getdata will render
      }
    }, 6000);

    /* REmoving Counter for asset change*/
    localStorage.removeItem('assetChangeCounterForOptions')

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
    // this.changemode();
    // //this.Themecolor = this.dash.Themecolor
    // this.toggleTheme();
    var randomNoForFlashArr = [];
    var arraylength = 2;
    var valcurrency = this.data.ctpdata;
    if (valcurrency == undefined) {
      this.ctpdata = this.chartlist.CTP;
      this.ltpdata = this.chartlist.LTP;
      this.lowprice = this.chartlist.LOW_PRICE;
      this.highprice = this.chartlist.HIGH_PRICE;
    } else {
      this.ctpdata = this.data.ctpdata;
      this.ltpdata = this.data.ltpdata;
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
    /* Logic for if asset pair has changed 5 times then reload the page */
    if(localStorage.getItem('assetChangeCounterForOptions')=='5'){
      document.body.classList.add("overlay")
      localStorage.setItem('assetChangeCounterForOptions','1');
      location.reload();
    }

  }

  getNewCurrency(currency) {
    $('.asset-dtl-font').attr('disabled', false);
    var hangoutButton = $("#hangout-giLkojRpuK");
    $("#asset-table .btn").click(function () {
      $("#asset-table .btn").removeClass('active');
      $(this).toggleClass('active');

    });

    this.assetetpair = [];
    this.assetetpairback = [];
    this.http.get<any>('https://accounts.paybito.com/CacheService/api/getData?Name=OptionsAssets')
      .subscribe(responseCurrency => {
        console.log('options_values3', this.assets)

        localStorage.setItem('options_assets', responseCurrency.value)
        this.filterCurrency = JSON.parse(responseCurrency.value);
        this.header = this.filterCurrency.Header;
        if (currency == 'ALL') {
          this.selectedOptionHeader = this.header[0];
        } else {
          this.selectedOptionHeader = currency;
        }
        console.log('options_values2', this.assets)

        this.assets = this.filterCurrency.Values;
        console.log('options_values', this.assets)
        if(this.assets == undefined){
          this.assets = []
        }

        let basecur = this.assets.filter(x => x.baseCurrency == 'USDT' && x.currencyCode == 'BTC')
        if(basecur.length == 0){

        }
        else{
          console.log('basecur => ', basecur)
        this.data.changeMessage1(basecur[0].amountPrecision);
        this.data.changeMessage2(basecur[0].pricePrecision);
        localStorage.setItem('amountprc', basecur[0].amountPrecision);
        localStorage.setItem('priceprc', basecur[0].pricePrecision);
        localStorage.setItem('assetCode', basecur[0].assetCode);
        localStorage.setItem('currencyId', basecur[0].currencyId);
        var basrcurrency = currency;
        var x;
        console.log('no offer3')

        }
        
        for (var i = 0; i <= this.assets.length - 1; i++) {
          console.log('iter => ', basrcurrency, this.assets[i].baseCurrency)
          if (this.selectedOptionHeader == this.assets[i].contractValue) {
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
            console.log('no offer',this.assetetpairback)
          }

          else if (currency == 'ALL') {
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

            //if (this.assets[i].currencyType == '1') {
            var lastprice = parseFloat(this.assets[i].ltpValue) + '/' + this.assets[i].ltpConvValue;
            this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade1': this.assets[i].ltpValue, lasttrade2: this.assets[i].ltpConvValue, 'lpricecolor': this.ltpcolor, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode, 'assetPair': this.assets[i].assetPair, 'assetPairName': this.assets[i].assetPairName, 'currencyId': this.assets[i].currencyId });
            this.assetetpairback = [...this.assetetpair];
            console.log('no offer1',this.assetetpairback)

            //}
          }

          /*  else if (basrcurrency == 'OTHER') {
             if (this.assets[i].baseCurrency != 'AED' && this.assets[i].baseCurrency != 'USD' && this.assets[i].baseCurrency != 'INR' && this.assets[i].baseCurrency != 'ETH' && this.assets[i].baseCurrency != 'BTC') {
               var lastprice = parseFloat(this.assets[i].ltpValue) + '/' + this.assets[i].ltpConvValue;
               this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade': lastprice, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode, 'assetPair': this.assets[i].assetPair, 'assetPairName': this.assets[i].assetPairName, 'currencyId': this.assets[i].currencyId });
               this.assetetpairback = [...this.assetetpair];
             }
           } */
        }
        // console.log('assetPairBack2',this.assetetpairback)

        if(this.assetetpairback.length == 0){
          // hangoutButton.click();
          this.openPopupModal()
          //open modal
          // Swal.fire({  
          //   icon: 'error',  
          //   text: 'Currently there are no contracts to display in Options market. Please check back later.',
          //   confirmButtonText: 'Close',
          // })
        }
        else{
          // nothing
        

        if (
          localStorage.getItem('selected_options_asset_pair_name') == undefined ||
          localStorage.getItem('selected_options_asset_pair_name') == null ||
          localStorage.getItem('selected_options_asset_pair_name') == 'undefined' ||
          localStorage.getItem('selected_options_asset_pair_name') == 'null' ||
          localStorage.getItem('selected_options_asset_pair_name') == '' ||
          localStorage.getItem('selected_options_asset_pair') == undefined ||
          localStorage.getItem('selected_options_asset_pair') == null ||
          localStorage.getItem('selected_options_asset_pair') == 'undefined' ||
          localStorage.getItem('selected_options_asset_pair') == 'null' ||
          localStorage.getItem('selected_options_asset_pair') == ''
        ) {
          this.assetPairName = this.assetetpairback[0].assetPairName
          this.currency_code = this.assetetpairback[0].currencycode
          this.base_currency = this.assetetpairback[0].basecurrency
          this.assetPair = this.assetetpairback[0].assetPair
          this.data.selectedSellingAssetText = this.base_currency;
          this.data.selectedBuyingAssetText = this.currency_code;
          localStorage.setItem('selected_options_asset_pair', this.assetPair);
        } else {
          let isAssetExpired: boolean = true;
          for (let i = 0; i < this.assetetpairback.length; i++) {
            if (this.assetetpairback[i].assetPairName == localStorage.getItem('selected_options_asset_pair_name')) {
              isAssetExpired = false
              break;
            }
          }
          if (isAssetExpired) {
            this.assetPairName = this.assetetpairback[0].assetPairName
            this.currency_code = this.assetetpairback[0].currencycode
            this.base_currency = this.assetetpairback[0].basecurrency
            this.assetPair = this.assetetpairback[0].assetPair
            this.data.selectedSellingAssetText = this.base_currency;
            this.data.selectedBuyingAssetText = this.currency_code;
            localStorage.setItem('selected_options_asset_pair', this.assetPair);
          } else {

            this.assetPairName = localStorage.getItem('selected_options_asset_pair_name')
            this.currency_code = localStorage.getItem('buying_crypto_asset').toUpperCase();
            this.base_currency = localStorage.getItem('selling_crypto_asset').toUpperCase();
            this.assetPair = localStorage.getItem('selected_options_asset_pair')
            this.data.selectedSellingAssetText = this.base_currency;
            this.data.selectedBuyingAssetText = this.currency_code;
            localStorage.setItem('selected_options_asset_pair', localStorage.getItem('selected_options_asset_pair'));
          }
        }
      }

        this.tickerResponse();
        this.tardebookHistory();
        this.serverSentEventForOrderbookAsk();
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
      if (item.assetPairName.includes(searchStr.toUpperCase())) {
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
      }, 1000);
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
    localStorage.setItem("selected_options_asset_pair", this.assetPair);
    localStorage.setItem("selected_options_asset_pair_name", this.assetPairName);
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
    this.trade.reload();
    this.trade.myTradeDisplay(0);
    $('#trade').click();
    $('#dropHolder').css('overflow', 'scroll');
    $(window).resize(function () {
      var wd = $('#chartHolder').width();
      $('#dropHolder').width(wd);
      $('#dropHolder').css('overflow', 'scroll');
    });
    /* setting flag for asset pair change */
    localStorage.setItem('isAssetPairChangedRecentlyOptions', 'true')
    localStorage.setItem('isResetTheStoplossfieldForOptions','true')
    
    /*setting flag for page reload after asset selection 5 times */
    let assetChangeCounter:any=localStorage.getItem('assetChangeCounterForOptions');
    if(
      assetChangeCounter != undefined && assetChangeCounter != 'undefined' &&
      assetChangeCounter != 'null' && assetChangeCounter != null
     ){
      assetChangeCounter=parseInt(assetChangeCounter);
      assetChangeCounter++;
      localStorage.setItem('assetChangeCounterForOptions',assetChangeCounter);
     }else{
       localStorage.setItem('assetChangeCounterForOptions','1');
     }
  }

  randomNoForOrderBook(minVal: any, maxVal: any): number {
    var minVal1: number = parseInt(minVal);
    var maxVal1: number = parseInt(maxVal);
    return Math.floor(Math.random() * (maxVal1 - minVal1 + 2) + minVal1);
  }

  tickerResponse() {
    this.http.get<any>("https://options-socket.paybito.com/oSocketStream/api/get24hTicker?assetPair=" + this.assetPair, {
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
          this.ctpdata = this.data.ctpdata = this.chartlist.ctp;
          this.ltpdata = this.data.ltpdata = this.chartlist.ltp;
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
      this.setTitle(this.data.ltpdata + ' | ' + localStorage.getItem('selected_options_asset_pair_name') + ' | ' + this.data.exchange);
    });

    this.tickerSubscription = this.websocket.currentMessage.subscribe(message => {
      this.message = message;
      var result = this.message;
      if (result != " ") {
        this.chartlist = JSON.parse(result);
        if (this.chartlist.tR) {
          this.ctpdata = this.data.ctpdata = this.chartlist.tR.ctp;
          this.ltpdata = this.data.ltpdata = this.chartlist.tR.ltp;
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
            this.ctpdata = this.data.ctpdata = this.chartlist.tR.ctp;
            this.ltpdata = this.data.ltpdata = this.chartlist.tR.ltp;
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
      this.setTitle(this.data.ltpdata + ' | ' + localStorage.getItem('selected_options_asset_pair_name') + ' | '+this.data.exchange);
    });
  }

  getPrice(m) {
    this.p = localStorage.getItem('priceprc');
    return (parseFloat(m.price)).toFixed(parseInt(this.p));
  }

  getAmount(m) {
    this.s = localStorage.getItem('amountprc');
    return (parseFloat(m.amount)).toFixed(parseInt(this.s));
  }

  serverSentEventForOrderbookAsk() {
    this.biddata = [];
    this.askdata = [];
    this.http.get<any>("https://options-socket.paybito.com/oSocketStream/api/depth?symbol=" + localStorage.getItem("selected_options_asset_pair") + "&limit=25", {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {

        if(data == null){
          // do nothing
        }
        else{
          var result = data;
          console.log('test',data)
          var askSideData = result.ask;
          this.askdata = askSideData.sort((a, b) => b.price - a.price);
          this.biddata = result.bid;
          if(parseFloat(askSideData[askSideData.length-1].price) - parseFloat(this.biddata[0].price) >= 0){
            this.buySellDiff = (parseFloat(askSideData[askSideData.length-1].price) - parseFloat(this.biddata[0].price)).toFixed(parseInt(localStorage.getItem('priceprc')))
          }else{
           this.buySellDiff = ''
          }
        }
       
      });

    this.subscription = this.websocket.currentMessage.subscribe(message => {
      this.message = message;
      if (this.message != " ") {
        var orderbookdata = JSON.parse(this.message);
        //console.log('orderbookData',orderbookdata);
        let askIterFirstPrice: any = 0;
        let bidIterFirstPrice: any = 0;
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
          /* removing trade which has same amount and price */
          for (i = 0; i < this.askdata.length; i++) {
            if (i != 0) {
              if (this.askdata[i].price == this.askdata[i - 1].price && this.askdata[i].amount == this.askdata[i - 1].amount) {
                this.askdata.splice(i, 1);
              }
            }
          }
          //console.log('ASK DATA => ',this.askdata)

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
          //console.log('BID DATA => ',this.biddata)
          /* removing trade which has same amount and price */
          for (i = 0; i < this.biddata.length; i++) {
            if (i != 0) {
              if (this.biddata[i].price == this.biddata[i - 1].price && this.biddata[i].amount == this.biddata[i - 1].amount) {
                this.biddata.splice(i, 1);
              }
            }
          }
        }
        if (this.askdata == '') {
          askIterFirstPrice = 0
        } else {
          askIterFirstPrice = this.askdata[this.askdata.length - 1].price;
        }
        if (this.biddata == '') {
          bidIterFirstPrice = 0
        } else {
          bidIterFirstPrice = this.biddata[0].price;
        }
        
        if(parseFloat(askIterFirstPrice) - parseFloat(bidIterFirstPrice) >= 0){
          this.buySellDiff = (parseFloat(askIterFirstPrice) - parseFloat(bidIterFirstPrice)).toFixed(parseInt(localStorage.getItem('priceprc')))
        }else{
         this.buySellDiff = ''
        }
        console.log(askIterFirstPrice + ' - ' + bidIterFirstPrice + ' = ' + this.buySellDiff)
      }

    });


  }



  tardebookHistory() {
    this.http.get<any>("https://options-socket.paybito.com/oSocketStream/api/tradeHistory?symbol=" + localStorage.getItem("selected_options_asset_pair") + "&limit=50", {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        console.log(data)
        this.marketTradeRecords = result;
      });

    this.subscription1 = this.websocket.currentMessage.subscribe(message => {
      this.message = message;
      if (this.message != " ") {
        var tradeHistorydata = JSON.parse(this.message);
        if (tradeHistorydata.e == 'trade') {
          for (var i = 0; i < tradeHistorydata.tH.length; i++) {
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

          }

          /* removing trade which has same amount and price for trade history */
          for (i = 0; i < this.marketTradeRecords.length; i++) {
            if (i != 0) {
              if (this.marketTradeRecords[i].price == this.marketTradeRecords[i - 1].price && this.marketTradeRecords[i].amount == this.marketTradeRecords[i - 1].amount) {
                this.marketTradeRecords.splice(i, 1);
              }
            }
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
  /* handle togglinging of css for light mode & dark mode */
  toggleTheme = () => {
    if (this.Themecolor == 'Dark') {

    } else {

    }
  }

  /* method defination for opening leverage cross modal */
  /* handleOpenCrossModal = (modal) => {
    this.selectedAssetForLeverage = localStorage.getItem('selected_options_asset_pair_name')
    this.modalService.open(modal, { centered: true });
  } */
  /* method defination for opening leverage cross modal */
  /* handleOpenXModal = (modal) => {
    this.selectSliderRange(parseInt(this.selectedRangeSliderValue))
    this.modalService.open(modal, { centered: true });
  } */
  /* Method defination for selecting margin type for leverage */
  /* handleSelectLeverageMarginType = (param) => {
    this.selectedLeverageMarginType = param;
    localStorage.setItem('selected_leverage_margin_type', this.selectedLeverageMarginType)
    this.data.renderAvailableBalance(this.data.selectedSellingAssetText, this.selectedLeverageMarginType,this.selectedCrossRange.slice(0,-1),'options')
  } */

  /* Method defination for toggling range for cross */
  /*  toggleCrossRange = (param) => {
     let crossRange = this.crossRange;
     let start = 1;
     let end = parseInt(crossRange[crossRange.length - 1].slice(0, -1));
     let currentLeverage = parseInt(this.selectedCrossRange.slice(0, -1));
     console.log(start, end, currentLeverage)
     if (param == 0 && currentLeverage < end) {
       this.selectedCrossRange = (currentLeverage + 1) + 'X'
       this.selectedRangeSliderValue = (currentLeverage + 1);
     }
     if (param == -1 && currentLeverage > start) {
       this.selectedCrossRange = (currentLeverage - 1) + 'X'
       this.selectedRangeSliderValue = (currentLeverage - 1);
     }
     localStorage.setItem('selected_leverage', this.selectedCrossRange)
     this.selectSliderRange(this.selectedRangeSliderValue)
   } */
  /* Method defination for getting range slider value */
  /* handleRangeSliderValue = (param) => {
    param = parseInt(param)
    this.selectedCrossRange = param + 'X'
    this.selectedRangeSliderValue = param
    localStorage.setItem('selected_leverage', this.selectedCrossRange)
    this.selectSliderRange(param)
  } */
  /*Method for select data from range slider */
  /* selectSliderRange(param) {
    let crossRange = this.crossRange;
    let rangeV = document.getElementById('rangeV');
    let newValue = Number( (parseInt(this.selectedRangeSliderValue) - parseInt(crossRange[0].slice(0,-1))) * 100 / (parseInt(crossRange[crossRange.length-1].slice(0,-1)) - parseInt(crossRange[0].slice(0,-1))) );
    let newPosition = 10 - (newValue * 0.2);
    this.data.renderAvailableBalance(this.data.selectedSellingAssetText, this.selectedLeverageMarginType,this.selectedCrossRange.slice(0,-1),'options')
    
  
    let left =`calc(${newValue}% + (${newPosition}px))`
    this.sliderStyle = { left: left }
    for (let i = 0; i < crossRange.length; i++) {
      let value = parseInt(crossRange[i].slice(0, -1))
      if (param > value) {
        console.log(param, value, ' => less')
        $('#range-' + crossRange[i]).addClass('selectedli')
        $('#range-' + crossRange[i]).removeClass('active')
      } else if (param == value) {
        console.log(param, value, ' => matched')
        $('#range-' + crossRange[i]).addClass('selectedli')
        $('#range-' + crossRange[i]).addClass('active')
      } else {
        console.log(param, value, ' => greater')
        $('#range-' + crossRange[i]).removeClass('selectedli')
        $('#range-' + crossRange[i]).removeClass('active')
      }
    }
  } */

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

  openPopupModal(){
    console.log('opening popup')
    this.modalService.open(this.myModal, { centered: true });
    // Swal.fire({  
    //   icon: 'error',  
    //   text: 'Currently there are no contracts to display in Options market. Please check back later.',
    //   confirmButtonText: 'Close',
    // })

  }

}
