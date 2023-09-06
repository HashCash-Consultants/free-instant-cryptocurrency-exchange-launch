import { Component, OnInit, DoCheck, OnDestroy,EventEmitter,ChangeDetectionStrategy,ChangeDetectorRef, Input,Output } from "@angular/core";
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
  selector: "app-order-book",
  templateUrl: "./order-book.component.html",
  styleUrls: ["./order-book.component.css"],
  changeDetection : ChangeDetectionStrategy.OnPush,
})

export class OrderBookComponent implements OnInit {
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
  marketTradeRecords: any;
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
  @Output() tradeBookData: EventEmitter<any> = new EventEmitter();
  @Output() callTradeHistory: EventEmitter<any> = new EventEmitter();
  @Output() bidDataOutput: EventEmitter<any> =   new EventEmitter();


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
    this.selectedSellingCryptoCurrencyName = this.data.selectedSellingCryptoCurrencyName;
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
    } else {
      this.currency_code = localStorage.getItem('buying_crypto_asset');
      this.base_currency = localStorage.getItem('selling_crypto_asset');
    }

    var fiatStorage = localStorage.getItem('fiatStorageSave');

    if(fiatStorage == null || fiatStorage == undefined){
      this.getNewCurrency('ALL');

    }
    else{
      this.selectedFiat = fiatStorage;
      this.getNewCurrency(this.selectedFiat);

    }

    this.getPrecission();
    $(".caret").on('click', function () {
      $(this).toggleClass('is-active').next(".caret").stop().slideToggle(500);
      if ($(this).hasClass('is-active')) {
        //alert('show')
        $('.dropdown-menu-light').show()
        $('.dropdown-menu').show()
      } else {
        // alert('hide')
        $('.dropdown-menu-light').hide()
        $('.dropdown-menu').hide()
      }
    });

    $(".asset-dtl-font").click(function () {
      $(".asset-dtl-font").attr('disabled', false);
      $(this).attr('disabled', true);
    });

    //this.tickerResponse();
    //this.ctpdata = this.data.ctpdata;
    this.lowprice = this.data.lowprice;
      this.highprice = this.data.highprice;
    this.serverSentEventForOrderbookAsk();
    this.tardebookHistory();
    this.changemode();
    // this.Themecolor = this.dash.Themecolor
    // this.renderFiatDropdown();

    /* checking if asset pair drop down is rendered is not */
    timer(6000).subscribe(()=>{
      // console.log('asset pair back',this.assetetpairback)
      if (this.assetetpairback.length == 0) {
       // location.reload();
      }
    });

    
     /* Removing counter for asset chnage */
     localStorage.removeItem('assetChangeCounterForSpot');

/* Funtionality for showing 24H high and low value visible , area between the bid & ask orderbook */
     setInterval(() => {
       
      if (document.getElementById("pricered") != null && document.getElementById("pricered") != null) {

        document.getElementById("pricered").style.display = "inline-block";
        document.getElementById("pricegreen").style.display = "none";
      }
      timer(1000).subscribe(()=>{
        if (document.getElementById("pricered") != null && document.getElementById("pricered") != null) {
          document.getElementById("pricered").style.display = "none";
          document.getElementById("pricegreen").style.display = "inline-block";
        }
      });
    }, 4000)
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
    this.changeDetectorRef.detectChanges();

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
    //this.changemode();
    // this.Themecolor = this.dash.Themecolor
    var randomNoForFlashArr = [];
    var arraylength = 2;
    var valcurrency = this.data.ctpdata;
    //console.log('valcurrency => ',valcurrency)
    if (valcurrency == undefined) {
     // this.ctpdata = this.data.ctpdata;
      //this.ltpdata = this.chartlist.LTP;
      this.lowprice = this.data.lowprice;
      this.highprice = this.data.highprice;
    } else {
      //this.ctpdata = this.data.ctpdata;
      //this.ltpdata = this.data.ltpdata;
      this.lowprice = this.data.lowprice;
      this.highprice = this.data.highprice;
    }
    var randomNo = this.randomNoForOrderBook(0, arraylength);
    randomNoForFlashArr.push(randomNo);
    
    /* logic for if asset pair has changed 5 times then reload the page */
    if(localStorage.getItem('assetChangeCounterForSpot') == '5'){
      document.body.classList.add("overlay")
      localStorage.setItem('assetChangeCounterForSpot','1');
      location.reload();
    }

    if (localStorage.getItem('isUnsubscribeOccured') == 'true') {
      this.websocket.subscribe();
    }
  }

  getNewCurrency(currency) {
    $('.asset-dtl-font').attr('disabled', false);
    $("#asset-table .btn").click(function () {
      $("#asset-table .btn").removeClass('active');
      $(this).toggleClass('active');
    });
 
    this.assetetpair = [];
    this.assetetpairback = [];
    this.http.get<any>('https://accounts.paybito.com/CacheService/api/getAssetsData?Name=Assets&BrokerId='+this.data.BROKERID)
      .subscribe(responseCurrency => {
        this.filterCurrency = JSON.parse(responseCurrency.value);
        localStorage.setItem('spot_assets',JSON.stringify(this.filterCurrency.Values))
        this.header = this.filterCurrency.Header;
        this.assets = this.filterCurrency.Values;
       // console.log('all values',this.assets)
        let basecur = this.assets.filter(x => x.baseCurrency == 'USD' && x.currencyCode == 'BTC')

        let fiat1 = this.assets.filter(x => x.currencyType == 1)

       // console.log('all currency having currency type as 1',fiat1)
        let fiat2 = fiat1.map(item => item.baseCurrency)
          .filter((value, index, self) => self.indexOf(value) === index)


        var arr = [];

        for (let i = 0; i < fiat2.length; i++) {
          //console.log(fiat[i])
              arr.push(fiat2[i]);
        }
        this.dropdownFiatList = arr;
       // console.log('all fiat drop', this.dropdownFiatList);

        
        this.changeDetectorRef.detectChanges();
        


        this.data.changeMessage1(basecur[0].amountPrecision);
        this.data.changeMessage2(basecur[0].pricePrecision);
        if(localStorage.getItem('buying_crypto_asset') == undefined ||
        localStorage.getItem('buying_crypto_asset') == null ||
        localStorage.getItem('buying_crypto_asset') == 'undefined' ||
        localStorage.getItem('buying_crypto_asset') == 'null' ||
        localStorage.getItem('buying_crypto_asset') == '' ||
        localStorage.getItem('selling_crypto_asset') == undefined ||
        localStorage.getItem('selling_crypto_asset') == null ||
        localStorage.getItem('selling_crypto_asset') == 'undefined' ||
        localStorage.getItem('selling_crypto_asset') == 'null' ||
        localStorage.getItem('selling_crypto_asset') == ''){
          localStorage.setItem('amountprc', basecur[0].amountPrecision);
          console.log('1',basecur[0].pricePrecision)
          localStorage.setItem('priceprc', basecur[0].pricePrecision);
          localStorage.setItem('assetCode', basecur[0].assetCode);
        }else{
          localStorage.setItem('amountprc', localStorage.getItem('amountprc'));
          console.log('2',localStorage.getItem('priceprc'))
          localStorage.setItem('priceprc', localStorage.getItem('priceprc'));
          localStorage.setItem('assetCode', localStorage.getItem('assetCode'));
        }

        if(localStorage.getItem('amountprc') == undefined ||
        localStorage.getItem('amountprc') == null ||
        localStorage.getItem('amountprc') == 'undefined' ||
        localStorage.getItem('amountprc') == 'null' ||
        localStorage.getItem('amountprc') == ''){
          localStorage.setItem('amountprc', basecur[0].amountPrecision);
          console.log('3',basecur[0].pricePrecision)
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
            this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade1': this.assets[i].ltpValue, lasttrade2: this.assets[i].ltpConvValue, 'lpricecolor': this.ltpcolor, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'RocColor': this.roccolor, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode });
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
              this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade1': this.assets[i].ltpValue, lasttrade2: this.assets[i].ltpConvValue, 'lpricecolor': this.ltpcolor, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode });
              this.assetetpairback = [...this.assetetpair];
            }
          }

          else if (basrcurrency == 'OTHER') {
            if (this.assets[i].baseCurrency != 'AED' && this.assets[i].baseCurrency != 'USD' && this.assets[i].baseCurrency != 'INR' && this.assets[i].baseCurrency != 'ETH' && this.assets[i].baseCurrency != 'BTC') {
              var lastprice = parseFloat(this.assets[i].ltpValue) + '/' + this.assets[i].ltpConvValue;
              this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade': lastprice, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode });
              this.assetetpairback = [...this.assetetpair];
            }
          }

        this.changeDetectorRef.detectChanges();

        }
      })
  }

  /* For rendering fiat dropdoewn */
  renderFiatDropdown = () => {
    this.http.get<any>(this.data.WEBSERVICE + '/home/getAllFiatCurrency', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.error.error_data != 0) {
          this.data.alert(data.error.error_msg, 'warning');
        } else {
          let arr = [];
          let fiat = data.fiatList
          //console.log(fiat)
          for (let i = 0; i < fiat.length; i++) {
            //console.log(fiat[i])
            if (fiat[i].currencyId != 324) {
              arr.push(fiat[i]);
            }
          }
          this.dropdownFiatList = arr;
          
          console.log('tttt',this.dropdownFiatList)
        }

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
    this.changeDetectorRef.detectChanges();

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
    let previousCurrency = localStorage.getItem('buying_crypto_asset').toUpperCase()
    let previousBaseCurrency = localStorage.getItem('selling_crypto_asset').toUpperCase()
    //console.log(item)
    if (item.currencycode == 'BTC' && item.basecurrency == 'USD') {
      //alert('selected BTCUSD')
      this.websocket.unsubscribe();

      this.websocket._disconnect();
    } else if (previousCurrency == 'BTC' && previousBaseCurrency == 'USD') {
      //alert('previously selected BTCUSD')
      this.websocket.unsubscribe();

      this.websocket._disconnect();
    } else {
      // alert('not selected BTCUSD')
      this.websocket.unsubscribe();
    }
    if (this.websocket.stompClient !== null) {
      timer(1000).subscribe(()=>{
        if (item.currencycode == 'BTC' && item.basecurrency == 'USD') {
          //alert(' selected BTCUSD')
          this.websocket._connect();
        } else if (previousCurrency == 'BTC' && previousBaseCurrency == 'USD') {
          //alert('previously selected BTCUSD')
          this.websocket._connect();
        } else {
          //alert('not selected BTCUSD')
          this.websocket.subscribe();
        }

      });
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
    //document.getElementById("myDropdown").classList.toggle("show");
    this.currency_code = item.currencycode;
    this.base_currency = item.basecurrency;
    this.amountPrecision = item.amountPrecision;
    this.pricePrecision = item.pricePrecision;
    this.assetCode = item.assetCode;
    localStorage.setItem('amountprc', this.amountPrecision);
    console.log('4',this.pricePrecision)
    localStorage.setItem('priceprc', this.pricePrecision);
    localStorage.setItem('assetCode', this.assetCode);
    this.data.selectedSellingAssetText = this.base_currency;
    this.data.selectedBuyingAssetText = this.currency_code;
    this.data.selectedBuyingCryptoCurrencyName = this.base_currency + this.currency_code;
    this.data.selectedSellingCryptoCurrencyName = this.currency_code + this.base_currency;
    this.selectedBuyingAssetText = item.currencyCode;
    this.selectedSellingAssetText = item.baseCurrency;
    localStorage.setItem("buying_crypto_asset", this.currency_code.toLocaleLowerCase());
    localStorage.setItem("selling_crypto_asset", this.base_currency.toLocaleLowerCase());
    this.data.cur = this.selectedSellingAssetText;
    this.assetpairsell = item.currencyCode + item.baseCurrency;
    this.assetpairbuy = item.baseCurrency + item.currencyCode;
    this.data.selectedSellingCryptoCurrencyissuer = "";
    this.data.selectedBuyingCryptoCurrencyissuer = "";
    this.data.changeMessage1(this.amountPrecision);
    this.data.changeMessage2(this.pricePrecision)
    this.data.changeMessage(this.currency_code);
    this.tickerResponse();
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
    localStorage.setItem('isAssetPairChangedRecently', 'true')
    localStorage.setItem('isResetTheStoplossfieldForSpot', 'true')
    
     /* Setting flag for page reload after asset selection 5 times */
     let assetChangeCounter : any = localStorage.getItem('assetChangeCounterForSpot');
     if (
       assetChangeCounter != undefined && assetChangeCounter != 'undefined' &&
       assetChangeCounter != 'null' && assetChangeCounter != null
     ) {
        assetChangeCounter = parseInt(assetChangeCounter);
        assetChangeCounter ++;
        localStorage.setItem('assetChangeCounterForSpot',assetChangeCounter);
     } else {
       localStorage.setItem('assetChangeCounterForSpot','1');
     }


     this.callTradeHistory.emit('click');
 
  }

  randomNoForOrderBook(minVal: any, maxVal: any): number {
    var minVal1: number = parseInt(minVal);
    var maxVal1: number = parseInt(maxVal);
    return Math.floor(Math.random() * (maxVal1 - minVal1 + 2) + minVal1);
  }

  tickerResponse() {
    this.http.get<any>("https://stream.paybito.com/SocketStream/api/get24hTicker?counter=" + localStorage.getItem("buying_crypto_asset") + "&base=" + localStorage.getItem("selling_crypto_asset"), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {
      var result = data;
      this.chartlist = result[0];
      if (this.chartlist) {
        this.ctpdata = this.data.ctpdata = parseFloat(this.chartlist.ctp).toFixed(this.tradep);
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
          //this.ctpdata = this.data.ctpdata = parseFloat(this.chartlist.ctp).toFixed(this.tradep);
         // this.ltpdata = this.data.ltpdata = this.chartlist.ltp;
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
      this.setTitle(this.data.ltpdata + ' | ' + 'BTCUSD' + ' | ' + this.data.exchange);
    });

    /* this.tickerSubscription = this.websocket.currentMessage.subscribe(message => {
      this.message = message;
      var result = this.message;
      if (result != " ") {
        this.chartlist = JSON.parse(result);
        if (this.chartlist.tR) {
          //this.ctpdata = this.data.ctpdata = parseFloat(this.chartlist.tR.ctp).toFixed(this.tradep);
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
            //this.ctpdata = this.data.ctpdata = parseFloat(this.chartlist.tR.ctp).toFixed(this.tradep);
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
      this.setTitle(this.data.ltpdata + ' | ' + this.currency_code + this.base_currency + ' | '+this.data.exchange);
    }); */
  }
 
  getPrice(m) {
    this.p = localStorage.getItem('priceprc');
    return (parseFloat(m.price)).toFixed(parseInt(this.tradep));
  }

  getAmount(m) {
    this.s = localStorage.getItem('amountprc');
    return (parseFloat(m.amount)).toFixed(this.tradep);
  }
  
  serverSentEventForOrderbookAsk() {
    this.biddata = [];
    this.askdata = [];
    this.biddataFinal = [];
    this.askdataFinal = [];
    //$('#marketTrade').html('<tr><td colspan="3" class="text-center"><img src="./assets/svg-loaders/three-dots.svg" alt="" width="50"></td></tr>');
    this.http.get<any>("https://stream.paybito.com/SocketStream/api/depth?symbol=" + localStorage.getItem("buying_crypto_asset") + localStorage.getItem("selling_crypto_asset") + "&limit=150", {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        var askSideData = result.ask;
        this.askdata = askSideData.sort((a, b) => b.price - a.price);
        this.biddata = result.bid;
        if (parseFloat(askSideData[askSideData.length - 1].price) - parseFloat(this.biddata[0].price) >= 0) {
          this.buySellDiff = (parseFloat(askSideData[askSideData.length - 1].price) - parseFloat(this.biddata[0].price)).toFixed(parseInt(localStorage.getItem('priceprc')))
        } else {
          this.buySellDiff = ''
        }
        this.biddataFinal = this.biddata
        this.askdataFinal = this.askdata

        var a = {'ask':this.askdataFinal, 'bid':this.biddataFinal}

        this.bidDataOutput.emit(a);
      });

    this.subscription = this.websocket.currentMessage.subscribe(message => {
      this.message = message;
      if (this.message != " ") {
       
        var orderbookdata = JSON.parse(this.message);
        let askIterFirstPrice: any = 0;
        let bidIterFirstPrice: any = 0;
        if (orderbookdata.e == 'depthUpdate' && orderbookdata.ask != '') {
         

          orderbookdata.ask.forEach((item,i)=>{
            //console.log(i,item);
            if(item.action == 'NEW'){
              this.askdata.push({ 'price': (parseFloat(item.price)).toFixed(parseInt(this.p)), 'amount': (parseFloat(item.quantity)).toFixed(parseInt(this.s)), 'newly': true });
              let index = this.askdata.findIndex((x)=> parseFloat(x.price).toFixed(this.tradep) == parseFloat(item.price).toFixed(this.tradep))
              

            }else if(item.action == 'CHANGE'){
              let index = this.askdata.findIndex((x) => parseFloat(x.price).toFixed(this.tradep) == parseFloat(item.price).toFixed(this.tradep))
              if(index > -1){
                this.askdata[index].amount = orderbookdata.ask[i].quantity
                this.askdata[index].newly = true
              }

              
            }else if(item.action == 'DELETE'){
              let index = this.askdata.findIndex((y) => parseFloat(y.price).toFixed(this.tradep) == parseFloat(item.price).toFixed(this.tradep));
              if (index > -1) {
                this.askdata.splice(index, 1);
              }
            }else if(item.action == 'TRADEDELETE'){
              let index = this.askdata.findIndex((y) => parseFloat(y.price).toFixed(this.tradep) == parseFloat(item.price).toFixed(this.tradep));
              if (index > -1) {
                this.askdata.splice(index, 1);
              }
            }

            this.biddataFinal = this.biddata
        this.askdataFinal = this.askdata

        var a = {'ask':this.askdataFinal, 'bid':this.biddataFinal}

        this.bidDataOutput.emit(a);
          })

          
          
          if (this.askdata.length > 150) {
            var askLength = this.askdata.length;
            this.askdata = this.askdata.slice((askLength - 150), askLength);
          }

          this.askdata = this.askdata.sort((a, b) => b.price - a.price);
          
           /* removing trade which has same amount and price */
          for (let i = 0; i < this.askdata.length; i++) {
            if (i != 0) {
              if (this.askdata[i].price == this.askdata[i - 1].price && this.askdata[i].amount == this.askdata[i - 1].amount) {
                this.askdata.splice(i, 1);
              }
            }
          }
          this.askdataFinal = this.askdata;

          this.biddataFinal = this.biddata
        this.askdataFinal = this.askdata

        var a = {'ask':this.askdataFinal, 'bid':this.biddataFinal}

        this.bidDataOutput.emit(a);
        }


        else if (orderbookdata.e == 'depthUpdate' && orderbookdata.bid != '') {
         
          orderbookdata.bid.forEach((item,i)=>{
            //console.log(i,item);
            if(item.action == 'NEW'){
              this.biddata.push({ 'price': (parseFloat(item.price)).toFixed(parseInt(this.p)), 'amount': (parseFloat(item.quantity)).toFixed(parseInt(this.s)), 'newly': true });
              let index = this.biddata.findIndex((x)=> parseFloat(x.price).toFixed(this.tradep) == parseFloat(item.price).toFixed(this.tradep))
              if(index > -1){
                //console.log(this.biddata[index]);
                /* setTimeout(() => {
                  if(this.biddata[index] != undefined){
                    this.biddata[index].newly = false
                  }
                }, 0); */
                // timer(2000).subscribe(()=>{
                //   let elem = document.getElementById(item.price)
                //   //console.log('elem',elem);
                //   if(elem != null && elem != undefined){
                //     elem.classList.remove('bg-flash-green')
                //   }
                // });
              }

            }else if(item.action == 'CHANGE'){
              let index = this.biddata.findIndex((x) => parseFloat(x.price).toFixed(this.tradep) == parseFloat(item.price).toFixed(this.tradep))
              if(index > -1){
                this.biddata[index].amount = orderbookdata.bid[i].quantity
                this.biddata[index].newly = true
              }
              
              
            }else if(item.action == 'DELETE'){
              let index = this.biddata.findIndex((y) => parseFloat(y.price).toFixed(this.tradep) == parseFloat(item.price).toFixed(this.tradep));
              if (index > -1) {
                this.biddata.splice(index, 1);
              }
            }else if(item.action == 'TRADEDELETE'){
              let index = this.biddata.findIndex((y) => parseFloat(y.price).toFixed(this.tradep) == parseFloat(item.price).toFixed(this.tradep));
              if (index > -1) {
                this.biddata.splice(index, 1);
              }
            }
          })
          
          this.biddata = this.biddata.sort((a, b) => b.price - a.price);

          if (this.biddata.length > 150) {
            this.biddata = this.biddata.slice(0, 150);
          }
          /* removing trade which has same amount and price */
          for (let i = 0; i < this.biddata.length; i++) {
            if (i != 0) {
              if (this.biddata[i].price == this.biddata[i - 1].price && this.biddata[i].amount == this.biddata[i - 1].amount) {
                this.biddata.splice(i, 1);
              }
            }
          }
          this.biddataFinal = this.biddata;
        }
        else if (orderbookdata.e == 'bestOffer'){
          let bestOfferPriceForBid = orderbookdata.bid[0].price
          let bestOfferPriceForAsk = orderbookdata.ask[0].price
          this.biddata.forEach((item,i)=>{
            if(parseFloat(item.price).toFixed(this.tradep) > parseFloat(bestOfferPriceForBid).toFixed(this.tradep)){
              this.biddata.splice(i,1)
            }
          })
          this.askdata.forEach((item,i)=>{
            if(parseFloat(item.price).toFixed(this.tradep) < parseFloat(bestOfferPriceForAsk).toFixed(this.tradep)){
              this.askdata.splice(i,1)
            }
          })
          
          this.askdataFinal = this.askdata
          this.biddataFinal = this.biddata

          var a = {'ask':this.askdataFinal, 'bid':this.biddataFinal}

          this.bidDataOutput.emit(a);
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
        if (parseFloat(askIterFirstPrice) - parseFloat(bidIterFirstPrice) >= 0) {
          this.buySellDiff = (parseFloat(askIterFirstPrice) - parseFloat(bidIterFirstPrice)).toFixed(parseInt(localStorage.getItem('priceprc')))
        } else {
          this.buySellDiff = ''
        }
      }
      this.changeDetectorRef.detectChanges();
    });


  }



  tardebookHistory() {
    this.marketTradeRecords = [];
    this.tradeBookData.emit(this.marketTradeRecords);
    this.http.get<any>("https://stream.paybito.com/SocketStream/api/tradeHistory?symbol=" + localStorage.getItem("buying_crypto_asset") + localStorage.getItem("selling_crypto_asset") + "&limit=50", {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        this.marketTradeRecords = result;
        //console.log('TRADEBOK DATA +++',this.marketTradeRecords)
        this.tradeBookData.emit(this.marketTradeRecords);
        //console.log('Trade History Data',this.marketTradeRecords)
        this.ctpdata = this.data.ltpdata = this.marketTradeRecords[0].price;
        //console.log('CTP DATA',this.ctpdata)
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
                  //setTimeout(() => {
                    this.marketTradeRecords.forEach(element => {
                      element['newask'] = false;
                    });
                  //}, 100)
                }
              }
            }

            if (tradeHistorydata.tH[i].side == "BID") {
              this.marketTradeRecords.unshift({ 'quantity': (parseFloat(tradeHistorydata.tH[i].quantity)).toFixed(parseInt(this.tradem)), 'price': (parseFloat(tradeHistorydata.tH[i].price)).toFixed(parseInt(this.tradep)), 'timestamp': tradeHistorydata.tH[i].timestamp, 'side': tradeHistorydata.tH[i].side, 'newbid': true });
              for (var h = 0; h < this.marketTradeRecords.length; h++) {
                if (this.marketTradeRecords[h].newbid == true) {
                  //setTimeout(() => {
                    this.marketTradeRecords.forEach(element => {
                      element['newbid'] = false;
                    });
                  //}, 100)
                }
              }
            }

          }

          //this.ctpdata = this.marketTradeRecords
          //console.log('Trade History Data',this.marketTradeRecords)
          this.ctpdata = this.data.ltpdata = this.marketTradeRecords[0].price;
          //console.log('CTP DATA',this.ctpdata)

          if (this.marketTradeRecords.length > 100) {
            this.marketTradeRecords = this.marketTradeRecords.slice(0, 100);
            //console.log('TRADEBOK DATA +++',this.marketTradeRecords)
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

  handleShowFiatDropdown = () => {
    this.showFiatDopdown = !this.showFiatDopdown;
  }

  handleSelectFiatValue = (param) => {
    this.showFiatDopdown = false;
    this.selectedFiat = param.toUpperCase();
    localStorage.setItem('fiatStorageSave',this.selectedFiat)
    this.getNewCurrency(this.selectedFiat);
  }

  ngOnDestroy() {

    try{
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
    catch{

      console.log('connection not established');
      

    }
    
    
  }
  

}
