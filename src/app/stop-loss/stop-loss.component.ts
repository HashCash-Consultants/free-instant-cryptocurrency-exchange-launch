import {
  Component,
  OnInit,
  DoCheck
} from '@angular/core';
import {
  CoreDataService
} from '../core-data.service';
import {
  HttpClient
} from '@angular/common/http';
import * as $ from 'jquery';
import {
  BodyService
} from '../body.service';
import {
  DashboardComponent
} from '../dashboard/dashboard.component';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  MyWalletComponent
} from '../my-wallet/my-wallet.component';
import { BehaviorSubject, timer } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { ChartComponent } from '../chart/chart.component';
@Component({
  selector: 'app-stop-loss',
  templateUrl: './stop-loss.component.html',
  styleUrls: ['./stop-loss.component.css'],
  providers: []

})
export class StopLossComponent implements DoCheck {

  selectedBuyingAssetText: string;
  selectedSellingAssetText: string;
  market: boolean;
  spot: any;
  onlyBuyAmount: any;
  onlyBuyPrice: any;
  onlyBuyTotalPrice: any;
  onlySellAmount: any;
  onlySellPrice: any;
  onlySellTotalPrice: any;
  mode: any
  modeMessage: any;
  buyPriceText: string;
  sellPriceText: string;
  fiatBalance: number;
  fiatBalanceText: string;
  sellPrice: string;
  totalFiatBalance: any;
  fiatBalanceLabel: string;
  btcBalance: string;
  bchBalance: any;
  hcxBalance: string;
  iecBalance: string;
  buyPrice: any;
  btcBalanceInUsd: string;
  bchBalanceInUsd: string;
  hcxBalanceInUsd: string;
  iecBalanceInUsd: string;
  selectedCryptoCurrency: string;
  selectedCryptoCurrencyBuy: string;
  selectedCryptoCurrencySell: string;
  selectedCryptoCurrencyBalance: string;
  selelectedBuyingAssetBalance: string = '0';
  selelectedSellingAssetBalance: string = '0';
  btcBought: any;
  btcSold: any;
  bchBought: any;
  bchSold: any;
  hcxBought: any;
  hcxSold: any;
  iecBought: any;
  iecSold: any;
  marketOrderPrice: number;
  stopLossError: string;
  rateControl: any;
  valLimit: number;
  result: any;
  base_currency: any;
  valid;
  asset;
  currencyBalance;
  onlyBuyPrice1: any;
  onlySellPrice1: any;
  content: any;
  tradem: any;
  tradep: any = 6;
  marginBalance: any
  selectedMarginType: any;
  showOrderTypeDropdown: boolean = false;
  selectedOrderType: string = 'GTC';
  disclosedQuantity: any;
  limitAmountForOco1: any
  limitTotalForOco1: any
  limitPriceForOco1: any
  limitAmountForOco2: any
  limitTotalForOco2: any
  limitPriceForOco2: any
  isPlaceOrderEnabled: boolean = false;
  isPlaceOrderEnabledForSell: boolean = false;
  buySellPillsClassStatus: boolean = true;
  isOrderTypeDropdownEnabled: boolean = false;
  Themecolor: any;
  limittriggerForOco1: any;
  limittriggerForOco2: any;

  sliderValueBuy:any = 0;
  sliderValueSell:any = 0;
  newBuybalance: any;
  newSellbalance: any;

  sliderValueBuyLimit:any = 0;
  sliderValueSellLimit:any = 0;
  newBuybalanceLimit: any;
  newSellbalanceLimit: any;

  sliderValueBuyStopLimit:any = 0;
  sliderValueSellStopLimit:any = 0;
  newBuybalanceStopLimit: any;
  newSellbalanceStopLimit: any;

  percentageValue: any ;
  resetLoader: boolean;
  stopLossTotal: any;
  activeTabForSpot : any = 'market'
  stpLoader: boolean = true;
  stopLossQuantitySell: any;
  stopLossTriggerPriceSell: any;
  stopLossPriceSell: any;
  stopLossTotalSell: any;
  limitAmountSell: any;
  limitValueSell: any;
  limitPriceSell: any;


  constructor(public data: CoreDataService, private http: HttpClient, public main: BodyService, public dash: DashboardComponent, private modalService: NgbModal, public mywallet: MyWalletComponent, private decimalPipe: DecimalPipe,public ticker: ChartComponent) {
    $(function () {
      $('.form-control').click(function () {
        $(this).select();
      })
    })

    this.valLimit = 0;

  }
  ngOnInit() {
    this.data.orderbookPrice = 0;
    this.data.orderbookSellPrice = 0;

    
    
    this.Themecolor = localStorage.getItem('themecolor');


    this.data.currentMessage1.subscribe(message1 => {
      if (message1) {
        this.tradem = message1;
        console.log(this.tradem)
      }
    })

    this.data.currentMessage2.subscribe(message2 => {
      if (message2) {
        //this.tradep = message2;
      }
    })

    this.data.currentMessage.subscribe(message => {
      if (message) {
        this.getUserTransaction();
      }
    })

    /* storing precesion list */
    this.getAllPrecision()
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

    this.getfeesOfUser();


  }

  getfeesOfUser() {

    this.http.get<any>(this.data.WEBSERVICE + '/userTrade/userTradingFeeByVolume?uuid=' + localStorage.getItem('uuid') + '&offerType=M', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {

      console.log('feeeeeeeeee', data);
      // this.percentageValue = data.tradingFee;
      //this.percentageValue = (((100 - (data.tradingFee/100)) - 0.03)/100);
      this.percentageValue = ((data.tradingFee + 0.01) / 100)
      console.log('val fee', this.percentageValue)
    })



  }

  ngDoCheck() {
    // this.tradep = localStorage.getItem('priceprc')

    this.selectedBuyingAssetText = this.data.selectedBuyingAssetText;
    this.selectedSellingAssetText = this.data.selectedSellingAssetText;
    this.asset = this.selectedSellingAssetText;
    // this.Themecolor = this.dash.Themecolor;
    

    if (this.asset === "USD") {
      this.valid = true;
    }
    else {
      this.valid = false;
    }
    if (this.data.orderbookPrice != 0) {
      this.limitPrice = this.data.orderbookPrice;
    }
    if (this.data.orderbookSellPrice != 0) {
      this.limitPriceSell = this.data.orderbookSellPrice;
    }

    
    // timer(5000).subscribe(()=>{
    //   this.data.orderbookPrice = 0
    // });

    if(this.stopLossQuantity == 0 || this.stopLossQuantity <= 0.0001){
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
    }

    /* clearing up all field on asset changes */
    let isResetTheStoplossfieldForSpot = localStorage.getItem('isResetTheStoplossfieldForSpot')
    if (isResetTheStoplossfieldForSpot == 'true') {
      this.reset();
      this.tradep = localStorage.getItem('priceprc')
      localStorage.setItem('isResetTheStoplossfieldForSpot','false');
    }

    /* checking for buy sell pill tab data which is active */
    $('.nav-link').each(function (i, obj) {
      if ($(this).hasClass('active')) {
        let tabTitle = $(this).html();
        /* Checking for buy sell pill active*/
        if (tabTitle.indexOf('Buy') != -1) {
          $(this).parent().parent().parent().removeClass('sell-pills')
          $(this).parent().parent().parent().addClass('buy-pills')
        } else if (tabTitle.indexOf('Sell') != -1) {
          $(this).parent().parent().parent().removeClass('buy-pills')
          $(this).parent().parent().parent().addClass('sell-pills')
        }
        //console.log('selected TAB =>',tabTitle)
        if(tabTitle.toLowerCase() == 'limit'){

        }
      }
    });
    /* checking for ordertype dropdown show hide */
    $('.spot-pills').each(function (i, obj) {
      if ($(this).parent().hasClass('active')) {
        let tabTitle = $(this).html();
          if (tabTitle == 'LIMIT') {
            this.showOrderTypeDropdown = true
            $('#orderTypeDropdown').show();
          } else {
            this.showOrderTypeDropdown = false
            $('#orderTypeDropdown').hide();
          }
      }
    });
  }

  handleNaNCheck(e) {
    if (isNaN(e.target.value)) {
      alert(`Is NaN => ` + isNaN(e.target.value))
      e.target.value = 0;
    }
  }

  handleLimitTotalPrice = (type) => {
    if(type == 'buy'){
      if(this.sliderValueBuyLimit == 0){
        let value: any = (this.limitPrice * this.limitAmount).toFixed(this.tradep)
        console.log(isNaN(value))
        if (isNaN(value)) {
          value = 0
        }
        console.log(value)
        return value
      }else{
        let value = this.limitValue
        return value
      }
    }else{
      let value: any = (this.limitPrice * this.limitAmount).toFixed(this.tradep)
        console.log(isNaN(value))
        if (isNaN(value)) {
          value = 0
        }
        console.log(value)
        return value
    }
    
  }
 
  reset() {
    this.isPlaceOrderEnabled = false;
    this.isPlaceOrderEnabledForSell = false;
    this.limitPrice = "";
    this.limitValue = "";
    this.limitPrice = "";
    this.limitAmount = "";
    this.limitAmountForOco1 = "";
    this.limitAmountForOco2 = "";
    this.limittriggerForOco1="";
    this.limittriggerForOco2="";
    this.limitPriceForOco1 = "";
    this.limitPriceForOco2 = "";
    this.limitTotalForOco1 = "";
    this.limitTotalForOco2 = "";
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
    this.stopLossQuantity = "";
    this.stopLossPrice = "";
    this.stopLossTriggerPrice = "";
    this.stopLossTotal = "";
    this.stopLossTriggerPrice = "";
    this.sliderValueBuy = 0;
    this.sliderValueSell = 0;
    this.sliderValueBuyLimit = 0;
    this.sliderValueSellLimit = 0;
    this.sliderValueBuyStopLimit = 0;
    this.sliderValueSellStopLimit = 0;
    $('.form-range').val('0'); document.getElementById('customRange3').classList.remove("changeBackgroundSlider");;

    $(function () {
     // $('input.form-control').val('');
    })
    this.getUserTransaction();
  }

  marginReset() {
    this.limitPrice = "";
    this.limitValue = "";
    this.limitPrice = "";
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
    this.stopLossQuantity = "";
    this.stopLossPrice = "";
    this.stopLossTriggerPrice = "";
    this.stopLossTotal = "";
    this.limitAmount = ''


    $(function () {
     // $('input.form-control').val('');
    
    })
    this.getUserTransaction();
  }

  update() {
    this.selectedBuyingAssetText = this.data.selectedBuyingAssetText;
    this.selectedSellingAssetText = this.data.selectedSellingAssetText;
    this.market = true;
  }

  getBuyVal(event) {
    var val = event.target.value;
    $('.form-range').val('0'); document.getElementById('customRange3').classList.remove("changeBackgroundSlider");;

    if (val < 0 || val == "") {
      // var onlyBuyAmount:any=val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlyBuyAmount = '';
    } else {
      var onlyBuyAmount: any = val;
      this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=BID' + '&amount=' + onlyBuyAmount)
        .subscribe(data => {
          var result = data;
          if (result.statuscode != '0') {
            if (this.data.selectedSellingAssetText == 'USD') {
              this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
              this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(this.tradep);
              if (this.onlyBuyTotalPrice < 0.001) {
                $('.onlyBuyErrorM').show();
                $('#mbuy').prop('disabled', true);

              }
              else {
                $('.onlyBuyErrorM').hide();
                $('#mbuy').prop('disabled', false);
              }
            } else {
              this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
              this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(this.tradep);
              if (this.onlyBuyTotalPrice < 0.001) {
                $('.onlyBuyErrorM').show();
                $('#mbuy').prop('disabled', true);

              }
              else {
                $('.onlyBuyErrorM').hide();
                $('#mbuy').prop('disabled', false);
              }
            }
            $('.onlyBuyError').hide();
            $('#mbuy').prop('disabled', false);
          } else {
            this.onlyBuyPrice = 0;
            this.onlyBuyTotalPrice = 0;
            $('.onlyBuyError').show();
            $('#mbuy').prop('disabled', true);
          }
        }, error => {
          // this.data.logout();
          // this.data.alert('Session Timeout. Login Again', 'warning');
        });
    }
  }

  // marginBuyVal(event) {
  //   var val = event.target.value;
  //   if (val < 0 || val == "") {
  //     this.data.alert('Amount cannot be negative or blank', 'warning');
  //     this.onlyBuyAmount = '';
  //   } else {
  //     var onlyBuyAmount: any = val;
  //     this.http.get<any>("https://api.paybito.com/exchange/marketPrice" +'/'+localStorage.getItem('assetCode')+'/' +'BID' + '/'+ onlyBuyAmount)
  //       .subscribe(data => {
  //         var result = data;
  //         if (result.statuscode != '0') {
  //           if (this.data.selectedSellingAssetText == 'USD') {
  //             this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
  //             this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(this.tradep);
  //             if (this.onlyBuyTotalPrice < 0.001) {
  //               $('.onlyBuyErrorM').show();
  //               $('#mbuy').prop('disabled', true);

  //             }
  //             else {
  //               $('.onlyBuyErrorM').hide();
  //               $('#mbuy').prop('disabled', false);
  //             }
  //           } else {
  //             this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
  //             this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(this.tradep);
  //             if (this.onlyBuyTotalPrice < 0.001) {
  //               $('.onlyBuyErrorM').show();
  //               $('#mbuy').prop('disabled', true);

  //             }
  //             else {
  //               $('.onlyBuyErrorM').hide();
  //               $('#mbuy').prop('disabled', false);
  //             }
  //           }
  //           $('.onlyBuyError').hide();
  //           $('#mbuy').prop('disabled', false);
  //         } else {
  //           this.onlyBuyPrice = 0;
  //           this.onlyBuyTotalPrice = 0;
  //           $('.onlyBuyError').show();
  //           $('#mbuy').prop('disabled', true);
  //         }
  //       }, error => {
  //         this.data.logout();
  //         this.data.alert('Session Timeout. Login Again', 'warning');
  //       });
  //   }
  // }

  getSellVal(event) {
    var val = event.target.value;
    $('.form-range').val('0'); document.getElementById('customRange3').classList.remove("changeBackgroundSlider");;

    if (val < 0 || val == "") {
      // var onlyBuyAmount:any=val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlySellAmount = '';
    } else {
      var onlySellAmount: any = val;
      this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=ASK' + '&amount=' + onlySellAmount)
        .subscribe(data => {
          var result = data;
          if (result.statuscode != '0') {
            if (this.data.selectedSellingAssetText == 'usd') {
              this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
              this.onlySellTotalPrice = (parseFloat(result.price) * parseFloat(onlySellAmount)).toFixed(this.tradep);
              if (this.onlySellTotalPrice < 0.001) {
                $('.onlyBuyErrorM').show();
                $('#msell').prop('disabled', true);
              }
              else {
                $('.onlyBuyErrorM').hide();
                $('#msell').prop('disabled', false);
              }
            } else {
              this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
              this.onlySellTotalPrice = (parseFloat(result.price) * parseFloat(onlySellAmount)).toFixed(this.tradep);
              if (this.onlySellTotalPrice < 0.001) {
                $('.onlyBuyErrorM').show();
                $('#msell').prop('disabled', true);

              }
              else {
                $('.onlyBuyErrorM').hide();
                $('#msell').prop('disabled', false);
              }
            }
            $('.onlySellError').hide();
            $('#msell').prop('disabled', false);
          } else {
            this.onlySellPrice = 0;
            this.onlySellTotalPrice = 0;
            $('.onlySellError').show();
            $('#msell').prop('disabled', true);
          }
        })
    }


  }
  // marginSellVal(event) {
  //   var val = event.target.value;
  //   if (val < 0 || val == "") {
  //     // var onlyBuyAmount:any=val;
  //     this.data.alert('Amount cannot be negative or blank', 'warning');
  //     this.onlySellAmount = '';
  //   } else {
  //     var onlySellAmount: any = val;
  //     this.http.get<any>("https://api.paybito.com/exchange/marketPrice" +'/'+localStorage.getItem('assetCode')+'/' +'ASK' + '/'+ onlySellAmount)
  //       .subscribe(data => {
  //         var result = data;
  //          if (result.statuscode != '0') {
  //           if (this.data.selectedSellingAssetText == 'usd') {
  //             this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
  //             this.onlySellTotalPrice = (parseFloat(result.price) * parseFloat(onlySellAmount)).toFixed(this.tradep);
  //             if (this.onlySellTotalPrice < 0.001) {
  //               $('.onlyBuyErrorM').show();
  //               $('#msell').prop('disabled', true);
  //             }
  //             else {
  //               $('.onlyBuyErrorM').hide();
  //               $('#msell').prop('disabled', false);
  //             }
  //           } else {
  //             this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
  //             this.onlySellTotalPrice = (parseFloat(result.price) * parseFloat(onlySellAmount)).toFixed(this.tradep);
  //             if (this.onlySellTotalPrice < 0.001) {
  //               $('.onlyBuyErrorM').show();
  //               $('#msell').prop('disabled', true);

  //             }
  //             else {
  //               $('.onlyBuyErrorM').hide();
  //               $('#msell').prop('disabled', false);
  //             }
  //           }
  //           $('.onlyBuyError').hide();
  //           $('#msell').prop('disabled', false);
  //         } else {
  //           this.onlySellPrice = 0;
  //           this.onlySellTotalPrice = 0;
  //           $('.onlyBuyError').show();
  //           $('#msell').prop('disabled', true);
  //         }
  //       })
  //   }


  // }

  async marketSell() {
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    /* var a = await this.data.checkUserBlockStatus();
    console.log('blocked statussss', a); */

    //if(a == true){
      this.data.alert('Loading...', 'dark');
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    $('.load').fadeIn();
    $('#marketsell').attr('disabled', true);
    var onlyBuyAmount = this.onlySellAmount;
    /*  this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=ASK' + '&amount=' + onlyBuyAmount)
       .subscribe(data => {
         var result = data;
         if (this.data.selectedSellingAssetText == 'usd') {
           this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
           this.onlySellPrice1 = parseFloat(result.price1);
         } else {
           this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
           this.onlySellPrice1 = parseFloat(result.price1);
         } */
    $('.onlyBuyError').hide();
    // $('#marketsell').prop('disabled', false);
    // var inputObj = {}
    // inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase(); //
    // inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase(); //change by sanu
    // inputObj['userId'] = localStorage.getItem('user_id');
    // inputObj['price'] = this.onlySellPrice;
    // inputObj['txn_type'] = '2';
    // if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
    //   //inputObj['marginType'] = this.selectedMarginType
    // }
    // var jsonString = JSON.stringify(inputObj);
    // this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    //   .subscribe(response => {
    // var result = response;
    // if (result.error.error_data != '0') {
    //   if (result.error.error_data == 1)
    //     this.data.alert(result.error.error_msg, 'danger');
    //   else
    //     $('#warn').click();
    //   $('.tradeBtn').attr('disabled', true);

    // } else {
    var inputObj = {};
    // inputObj['userId'] = localStorage.getItem('user_id');
    inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
    inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
    inputObj['amount'] = parseFloat(this.onlySellAmount);
    inputObj['price'] = parseFloat(this.onlySellPrice);
    inputObj["offerType"] = 'M';
    inputObj['txn_type'] = '2';
    inputObj['assetCode'] = this.data.getAssetCode(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'));
    inputObj['baseCurrencyId'] = this.data.getAssetId(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'))['baseCurrencyId'];
    inputObj['currencyId'] = this.data.getAssetId(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'))['currencyId'];
    inputObj['uuid'] = localStorage.getItem('uuid')
    var jsonString = JSON.stringify(inputObj);
    //if ((this.onlySellPrice * this.onlySellAmount) >= .001) {
    this.http.post<any>(this.data.WEBSERVICE + '/userTrade/TradeCreateOffer', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        this.data.loader = false;
        $('.onlyBuyBtn').prop('disabled', false);
        $('.onlySellBtn').prop('disabled', false);
        $('.load').fadeOut();
        var result = data;
        if (result.error.error_data != '0') {
          if (result.error.error_data == 1)
            this.data.alert(result.error.error_msg, 'danger');
          else
            $('#warn').click();
        } else {
          this.reset();
          this.data.alert(result.error.error_msg, 'success');
          if(localStorage.getItem('tradeNavHist') == 'open'){

            this.data.renderDataForMyOfferSpot();
          }else if(localStorage.getItem('tradeNavHist') == 'stop'){

            this.data.renderDataForStopLimitSpot('buy');
          }else{

            //this.data.renderDataForMyTradeSpot();
            localStorage.setItem('isTimeToRenderSpotMyTrade','true');
          }
          //this.ticker.handle24hrTickerManualy();

        }
      });
    // } else {
    //   this.reset();
    //   this.data.loader = false;
    //   this.data.alert('Offer Value is lesser than permissible value', 'warning');
    //   $('.onlyBuyBtn').prop('disabled',false);
    //   $('.onlySellBtn').prop('disabled',false);
    // }

    //});

    // else {
    //   this.onlySellPrice = 0;
    //   $('.onlySellError').show();
    //   $('#msell').prop('disabled', true);
    // }
    //});
    //}
    
  }

  marginMarketSell() {
    this.data.alert('Loading...', 'dark');
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    $('.load').fadeIn();
    $('#marketsell').attr('disabled', true);
    var onlyBuyAmount = this.onlySellAmount;
    this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=ASK' + '&amount=' + onlyBuyAmount)
      .subscribe(data => {
        var result = data;
        if (this.data.selectedSellingAssetText == 'usd') {
          this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
          this.onlySellPrice1 = parseFloat(result.price1);
        } else {
          this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
          this.onlySellPrice1 = parseFloat(result.price1);
        }
        $('.onlyBuyError').hide();
        //$('#marketsell').prop('disabled', false);
        var inputObj = {}
        inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase(); //
        inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase(); //change by sanu
        inputObj['userId'] = localStorage.getItem('user_id');
        inputObj['price'] = this.onlySellPrice1;
        inputObj['txn_type'] = '2';
        if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
          //inputObj['marginType'] = this.selectedMarginType
        }
        var jsonString = JSON.stringify(inputObj);
        this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .subscribe(response => {
            var result = response;
            if (result.error.error_data != '0') {
              $('.onlyBuyBtn').prop('disabled', false);
              $('.onlySellBtn').prop('disabled', false);
              if (result.error.error_data == 1)
                this.data.alert(result.error.error_msg, 'danger');
              else
                // $('#warn').click();
                $('.tradeBtn').attr('disabled', true);

            } else {

              var inputObj = {};
              // inputObj['userId'] = localStorage.getItem('user_id');
              inputObj['uuid'] = localStorage.getItem('uuid');

              inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
              inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
              inputObj['amount'] = parseFloat(this.onlySellAmount);
              inputObj['price'] = parseFloat(this.onlySellPrice1);
              inputObj["offerType"] = 'M';
              inputObj['txn_type'] = '2';
              inputObj['assetCode'] = localStorage.getItem('assetCode');
              if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
                //inputObj['marginType'] = this.selectedMarginType
              }
              var jsonString = JSON.stringify(inputObj);
              if ((this.onlySellPrice * this.onlySellAmount) >= .001) {
                this.http.post<any>(this.data.MARGINURL + 'createOffer', jsonString, {
                  headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                  }
                })
                  .subscribe(data => {
                    this.data.loader = false;
                    $('.onlyBuyBtn').prop('disabled', false);
                    $('.onlySellBtn').prop('disabled', false);
                    $('.load').fadeOut();
                    var result = data;
                    if (result.error != '0') {
                      this.marginReset();
                      this.data.alert(result.message, 'success');
                    } else {
                      this.marginReset();
                      this.data.alert(result.message, 'success');
                    }
                    this.renderMarginBalance(this.selectedMarginType);
                  });
              } else {
                this.marginReset();
                this.data.loader = false;
                this.data.alert('Offer Value is lesser than permissible value', 'warning');
                $('.onlyBuyBtn').prop('disabled', false);
                $('.onlySellBtn').prop('disabled', false);
              }
            }
          });

        // else {
        //   this.onlySellPrice = 0;
        //   $('.onlySellError').show();
        //   $('#msell').prop('disabled', true);
        // }
      });
  }
  async marketBuy() {
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);

    //var a = await this.data.checkUserBlockStatus();
    //console.log('blocked statussss', a);

    //if(a == true){

    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    this.data.alert('Loading...', 'dark');
    var onlyBuyAmount = this.onlyBuyAmount;
    /* this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=BID' + '&amount=' + onlyBuyAmount)
      .subscribe(data => {
        var result = data;
        if (this.data.selectedSellingAssetText == 'usd') {
          this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
          this.onlyBuyPrice1 = parseFloat(result.price1);
        } else {
          this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
          this.onlyBuyPrice1 = parseFloat(result.price1);
        } */
    $('.onlyBuyError').hide();
    //$('#marketbuy').prop('disabled', false);
    // var inputObj = {}
    // inputObj['selling_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
    // inputObj['buying_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
    // inputObj['userId'] = localStorage.getItem('user_id');
    // inputObj['price'] = this.onlyBuyPrice;
    // inputObj['txn_type'] = '1';
    // if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
    //   //inputObj['marginType'] = this.selectedMarginType
    // }
    // var jsonString = JSON.stringify(inputObj);
    // this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    //   .subscribe(response => {
    //     var result = response;
    //     if (result.error.error_data != '0') {
    //       this.data.alert(result.error.error_msg, 'warning');
    //       $('.tradeBtn').attr('disabled', true);
    //     } else {
    var inputObj = {};
    // inputObj['userId'] = localStorage.getItem('user_id');
    inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
    inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
    inputObj['amount'] = parseFloat(this.onlyBuyAmount);
    inputObj['price'] = this.onlyBuyPrice;
    inputObj["offerType"] = 'M';
    inputObj['txn_type'] = '1';
    if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
      inputObj['marginType'] = this.selectedMarginType
    }
    inputObj['assetCode'] = this.data.getAssetCode(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'));
    inputObj['baseCurrencyId'] = this.data.getAssetId(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'))['baseCurrencyId'];
    inputObj['currencyId'] = this.data.getAssetId(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'))['currencyId'];
    inputObj['uuid'] = localStorage.getItem('uuid')
    var jsonString = JSON.stringify(inputObj);
    // if ((this.onlyBuyPrice * this.onlyBuyAmount) >= .001) {
    this.http.post<any>(this.data.WEBSERVICE + '/userTrade/TradeCreateOffer', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        this.data.loader = false;
        $('.onlyBuyBtn').prop('disabled', false);
        $('.onlySellBtn').prop('disabled', false);
        var result = data;
        if (result.error.error_data != '0') {
          if (result.error.error_data == 1)
            this.data.alert(result.error.error_msg, 'danger');
          else
            $('#warn').click();
        } else {
          this.reset();
          this.data.alert(result.error.error_msg, 'success');
          if(localStorage.getItem('tradeNavHist') == 'open'){

            this.data.renderDataForMyOfferSpot();
          }else if(localStorage.getItem('tradeNavHist') == 'stop'){

            this.data.renderDataForStopLimitSpot('buy');
          }else{

            //this.data.renderDataForMyTradeSpot();
            localStorage.setItem('isTimeToRenderSpotMyTrade','true');
          }
          //this.ticker.handle24hrTickerManualy();

        }
        this.reset();
      });
    // } else {
    //   this.reset();
    //   this.data.loader = false;
    //   this.data.alert('Offer Value is lesser than permissible value', 'warning');
    //   $('.onlyBuyBtn').prop('disabled',false);
    //   $('.onlySellBtn').prop('disabled',false);
    // }
    //}
    //});

    //})

    //}


    
  }
  marginMarketBuy() {
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    this.data.alert('Loading...', 'dark');
    var onlyBuyAmount = this.onlyBuyAmount;
    this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=BID' + '&amount=' + onlyBuyAmount)
      .subscribe(data => {
        var result = data;
        if (this.data.selectedSellingAssetText == 'usd') {
          this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
          this.onlyBuyPrice1 = parseFloat(result.price1);
        } else {
          this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
          this.onlyBuyPrice1 = parseFloat(result.price1);
        }
        $('.onlyBuyError').hide();
        // $('#marketbuy').prop('disabled', false);
        var inputObj = {}
        inputObj['selling_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
        inputObj['buying_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
        inputObj['userId'] = localStorage.getItem('user_id');
        inputObj['price'] = this.onlyBuyPrice1;
        inputObj['txn_type'] = '1';
        if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
          //inputObj['marginType'] = this.selectedMarginType
        }
        var jsonString = JSON.stringify(inputObj);
        // this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
        //   headers: {
        //     'Content-Type': 'application/json'
        //   }
        // })
        //   .subscribe(response => {
        //     var result = response;
        //     if (result.error.error_data != '0') {
        //       this.data.alert(result.error.error_msg, 'warning');
        //       $('.tradeBtn').attr('disabled', true);
        //     } else {
        var inputObj = {};
        // inputObj['userId'] = localStorage.getItem('user_id');
        inputObj['uuid'] = localStorage.getItem('uuid');

        inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
        inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
        inputObj['amount'] = parseFloat(this.onlyBuyAmount);
        inputObj['price'] = this.onlyBuyPrice1;
        inputObj["offerType"] = 'M';
        inputObj['txn_type'] = '1';
        inputObj['assetCode'] = localStorage.getItem('assetCode');
        if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
          //inputObj['marginType'] = this.selectedMarginType
        }
        var jsonString = JSON.stringify(inputObj);
        if ((this.onlyBuyPrice1 * this.onlyBuyAmount) >= .001) {
          this.http.post<any>(this.data.MARGINURL + 'createOffer', jsonString, {
            headers: {
              'Content-Type': 'application/json',
              'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
          })
            .subscribe(data => {
              this.data.loader = false;
              $('.onlyBuyBtn').prop('disabled', false);
              $('.onlySellBtn').prop('disabled', false);
              var result = data;
              if (result.error != '0') {
                this.marginReset();
                this.data.alert(result.message, 'success');
              } else {
                this.marginReset();
                this.data.alert(result.message, 'success');
              }
              // this.marginReset();
              this.renderMarginBalance(this.selectedMarginType);
            });
        } else {
          this.marginReset();
          this.data.loader = false;
          this.data.alert('Offer Value is lesser than permissible value', 'warning');
          $('.onlyBuyBtn').prop('disabled', false);
          $('.onlySellBtn').prop('disabled', false);
        }
        //   }
        // });

      })
  }
  limitAmount: any = 0;
  limitPrice: any = 0;
  limitValue: any = 0;
  limitAmount2: any = 0;
  limitPrice2: any = 0;
  limitValue2: any = 0;

  async limitBuy() {
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    //var a = await this.data.checkUserBlockStatus();
    //console.log('blocked statussss', a);

    //if(a == true){
      // this.placeOrderForOcoBuy();
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    $('.tradeBtn').attr('disabled', true);
    this.data.alert('Loading...', 'dark', 30000);
    var inputObj = {}
    inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
    inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
    inputObj['userId'] = localStorage.getItem('user_id');
    inputObj['price'] = this.limitPrice;
    inputObj['txn_type'] = '1';
    if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
      //inputObj['marginType'] = this.selectedMarginType
    }
    var jsonString = JSON.stringify(inputObj);
    if ((this.limitPrice * this.limitAmount) > this.valLimit) {
      // this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      //   .subscribe(response => {
      //     var result = response;
      //     if (result.error.error_data != '0') {
      //       this.data.alert(result.error.error_msg, 'warning');
      //       $('.tradeBtn').attr('disabled', true);
      //     } else {
      if (this.limitAmount != undefined && this.limitPrice != undefined) {
        var inputObj = {};
        // inputObj['userId'] = localStorage.getItem('user_id');
        inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
        inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
        inputObj['amount'] = this.limitAmount;
        inputObj['price'] = this.limitPrice;
        inputObj['txn_type'] = '1';
        if(this.selectedOrderType == 'FOK' || this.selectedOrderType == 'IOC'){
          inputObj["offerType"] = 'M';

        }
        else{
          inputObj["offerType"] = 'L';

        }
        if(this.selectedOrderType != 'GTC'){
          inputObj['orderType'] = this.selectedOrderType;
        }
        if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
          //inputObj['marginType'] = this.selectedMarginType
        }
        inputObj['assetCode'] = this.data.getAssetCode(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'));
        inputObj['baseCurrencyId'] = this.data.getAssetId(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'))['baseCurrencyId'];
        inputObj['currencyId'] = this.data.getAssetId(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'))['currencyId'];
        inputObj['uuid'] = localStorage.getItem('uuid')
        var jsonString = JSON.stringify(inputObj);
        this.http.post<any>(this.data.WEBSERVICE + '/userTrade/TradeCreateOffer', jsonString, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'BEARER ' + localStorage.getItem('access_token')
          }
        })
          .subscribe(response => {
            this.data.loader = false;
            $('.onlyBuyBtn').prop('disabled', false);
            $('.onlySellBtn').prop('disabled', false);
            var result = response;
            if (result.error.error_data != '0') {
              if (result.error.error_data == 1)
                this.data.alert(result.error.error_msg, 'danger');
              else
                $('#warn').click();
              $('.tradeBtn').removeAttr('disabled');
              $('.form-control').val('');
              $('#totalValueTrade').val('');
              $('.tradeBtn').attr('disabled', true);
            } else {
              $('.form-control').val('');
              this.data.alert(result.error.error_msg, 'success');
              this.limitPrice = 0;
              this.limitAmount = 0;
              if(localStorage.getItem('tradeNavHist') == 'open'){

                this.data.renderDataForMyOfferSpot();
              }else if(localStorage.getItem('tradeNavHist') == 'stop'){
    
                this.data.renderDataForStopLimitSpot('buy');
              }else{
    
                //this.data.renderDataForMyTradeSpot();
                localStorage.setItem('isTimeToRenderSpotMyTrade','true');
              }
              //this.ticker.handle24hrTickerManualy();
              this.reset();
              $('#trade').click();
            }
          });
      } else {
        $('.tradeBtn').removeAttr('disabled');
        $('.form-control').val('');
        this.data.alert('Please provide proper buying details', 'warning');
        $('.onlyBuyBtn').prop('disabled', false);
        $('.onlySellBtn').prop('disabled', false);
      }
      //}
      this.limitAmount = this.limitPrice = this.limitValue = null;
      //});
    } else {
      this.limitAmount = this.limitPrice = this.limitValue = null;
      this.data.loader = false;
      this.data.alert('Your offer is too small', 'warning');
      $('.onlyBuyBtn').prop('disabled', false);
      $('.onlySellBtn').prop('disabled', false);
    }

    //}
    
  }

  marginLimitBuy() {
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    $('.tradeBtn').attr('disabled', true);
    this.data.alert('Loading...', 'dark', 30000);
    var inputObj = {}
    inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
    inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
    inputObj['userId'] = localStorage.getItem('user_id');
    inputObj['price'] = this.limitPrice;
    inputObj['txn_type'] = '1';
    if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
      //inputObj['marginType'] = this.selectedMarginType
    }
    var jsonString = JSON.stringify(inputObj);
    if ((this.limitPrice * this.limitAmount) > this.valLimit) {
      this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .subscribe(response => {
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'warning');
            $('.tradeBtn').attr('disabled', true);
          } else {
            if (this.limitAmount != undefined && this.limitPrice != undefined) {
              var inputObj = {};
              // inputObj['userId'] = localStorage.getItem('user_id');
              inputObj['uuid'] = localStorage.getItem('uuid');

              inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
              inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
              inputObj['amount'] = this.limitAmount;
              inputObj['price'] = this.limitPrice;
              inputObj["offerType"] = 'L';
              inputObj['txn_type'] = '1';
              inputObj['assetCode'] = localStorage.getItem('assetCode');
              if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
                //inputObj['marginType'] = this.selectedMarginType
              }
              var jsonString = JSON.stringify(inputObj);
              this.http.post<any>(this.data.MARGINURL + 'createOffer', jsonString, {
                headers: {
                  'Content-Type': 'application/json',
                  'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                }
              })
                .subscribe(response => {
                  this.data.loader = false;
                  $('.onlyBuyBtn').prop('disabled', false);
                  $('.onlySellBtn').prop('disabled', false);
                  var result = response;
                  if (result.error != '0') {
                    this.data.alert(result.message, 'success');
                    //$('#warn').click();
                    // $('.tradeBtn').removeAttr('disabled');
                    // $('.form-control').val('');
                    // $('#totalValueTrade').val('');
                    // $('.tradeBtn').attr('disabled', true);
                  } else {
                    $('.form-control').val('');
                    this.data.alert(result.message, 'success');
                    this.limitPrice = 0;
                    this.limitAmount = 0;
                    this.marginReset();
                    $('#trade').click();
                  }
                  this.renderMarginBalance(this.selectedMarginType);
                });
            } else {
              $('.tradeBtn').removeAttr('disabled');
              $('.form-control').val('');
              this.data.alert('Please provide proper buying details', 'warning');
              $('.onlyBuyBtn').prop('disabled', false);
              $('.onlySellBtn').prop('disabled', false);
            }
          }
          this.limitAmount = this.limitPrice = this.limitValue = null;
        });
    } else {
      this.limitAmount = this.limitPrice = this.limitValue = null;
      this.data.loader = false;
      this.data.alert('Your offer is too small', 'warning');
      $('.onlyBuyBtn').prop('disabled', false);
      $('.onlySellBtn').prop('disabled', false);
    }
  }

  async limitSell() {
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    /* var a = await this.data.checkUserBlockStatus();
    console.log('blocked statussss', a); */

    //if(a == true){
      this.placeOrderForOcoSell()
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    $('.tradeBtn').attr('disabled', true);
    this.data.alert('Loading...', 'dark', 30000);
    if (this.limitPriceSell != undefined && this.limitAmountSell != undefined) {
      var inputObj = {}
      inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
      inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
      inputObj['userId'] = localStorage.getItem('user_id');
      inputObj['price'] = this.limitPriceSell;
      inputObj['txn_type'] = '2';
      
      if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
        //inputObj['marginType'] = this.selectedMarginType
      }
      var jsonString = JSON.stringify(inputObj);
      //alert((this.limitPriceSell * this.limitAmountSell) +'  '+this.limitValueSell)
      if ((this.limitPriceSell * this.limitAmountSell) >= this.limitValueSell) {
        // this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
        //   headers: {
        //     'Content-Type': 'application/json'
        //   }
        // })
        //   .subscribe(response => {
        //     var result = response;
        //     if (result.error.error_data != '0') {
        //       if (result.error.error_data == 1)
        //         this.data.alert(result.error.error_msg, 'danger');
        //       else
        //         $('#warn').click();
        //       $('.tradeBtn').attr('disabled', true);
        //     } else {
        var inputObj = {};
        // inputObj['userId'] = localStorage.getItem('user_id');
        inputObj['selling_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
        inputObj['buying_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
        inputObj['amount'] = this.limitAmountSell;
        inputObj['price'] = this.limitPriceSell;
        // inputObj["offerType"] = 'L';
        inputObj['txn_type'] = '2';
        if(this.selectedOrderType == 'FOK' || this.selectedOrderType == 'IOC'){
          inputObj["offerType"] = 'M';

        }
        else{
          inputObj["offerType"] = 'L';

        }
        if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
          //inputObj['marginType'] = this.selectedMarginType
        }
        inputObj['assetCode'] = this.data.getAssetCode(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'));
        inputObj['baseCurrencyId'] = this.data.getAssetId(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'))['baseCurrencyId'];
        inputObj['currencyId'] = this.data.getAssetId(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset'))['currencyId'];
        inputObj['uuid'] = localStorage.getItem('uuid')
        if(this.selectedOrderType != 'GTC'){
          inputObj['orderType'] = this.selectedOrderType;
        }
        var jsonString = JSON.stringify(inputObj);
        this.http.post<any>(this.data.WEBSERVICE + '/userTrade/TradeCreateOffer', jsonString, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'BEARER ' + localStorage.getItem('access_token'),
          }
        })
          .subscribe(response => {
            this.data.loader = false;
            $('.onlyBuyBtn').prop('disabled', false);
            $('.onlySellBtn').prop('disabled', false);
            var result = response;
            if (result.error.error_data != '0') {
              if (result.error.error_data == 1)
                this.data.alert(result.error.error_msg, 'danger');
              else
                $('#warn').click();
              $('.tradeBtn').removeAttr('disabled');
              $('.form-control').val('');
              $('#totalValueTrade').val('');
              $('.tradeBtn').attr('disabled', true);
            } else {
              $('.form-control').val('');
              this.data.alert(result.error.error_msg, 'success');
              if(localStorage.getItem('tradeNavHist') == 'open'){

                this.data.renderDataForMyOfferSpot();
              }else if(localStorage.getItem('tradeNavHist') == 'stop'){
    
                this.data.renderDataForStopLimitSpot('buy');
              }else{
    
                //this.data.renderDataForMyTradeSpot();
                localStorage.setItem('isTimeToRenderSpotMyTrade','true');
              }
              //this.ticker.handle24hrTickerManualy();
              this.limitAmountSell = 0;
              this.limitPriceSell = 0;
              this.reset();
              $('#trade').click();
            }
          });
        //}
        this.limitAmountSell = this.limitPriceSell = this.limitValueSell = null;

        // });
      } else {
        this.limitAmountSell = this.limitPriceSell = this.limitValueSell = null;
        this.data.loader = false;
        this.data.alert('Your offer is too small', 'warning');
        $('.onlyBuyBtn').prop('disabled', false);
        $('.onlySellBtn').prop('disabled', false);
      }
    } else {
      $('.form-control').val('');
      $('.tradeBtn').removeAttr('disabled');
      this.data.alert('Please provide proper selling details', 'warning');
      $('.onlyBuyBtn').prop('disabled', false);
      $('.onlySellBtn').prop('disabled', false);
    }
    //}
    
  }

  marginLimitSell() {
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    $('.tradeBtn').attr('disabled', true);
    this.data.alert('Loading...', 'dark', 30000);
    if (this.limitPrice != undefined && this.limitAmount != undefined) {
      var inputObj = {}
      inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
      inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
      inputObj['userId'] = localStorage.getItem('user_id');
      inputObj['price'] = this.limitPrice;
      inputObj['txn_type'] = '2';
      if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
        //inputObj['marginType'] = this.selectedMarginType
      }
      var jsonString = JSON.stringify(inputObj);
      if ((this.limitPrice * this.limitAmount) > this.valLimit) {
        this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .subscribe(response => {
            var result = response;
            if (result.error.error_data != '0') {
              if (result.error.error_data == 1)
                this.data.alert(result.error.error_msg, 'danger');
              else
                $('#warn').click();
              $('.tradeBtn').attr('disabled', true);
            } else {
              var inputObj = {};
              // inputObj['userId'] = localStorage.getItem('user_id');
              inputObj['uuid'] = localStorage.getItem('uuid');

              inputObj['selling_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
              inputObj['buying_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
              inputObj['amount'] = this.limitAmount;
              inputObj['price'] = this.limitPrice;
              inputObj["offerType"] = 'L';
              inputObj['txn_type'] = '2';
              inputObj['assetCode'] = localStorage.getItem('assetCode');
              if (this.selectedMarginType !== undefined && this.selectedMarginType !== null) {
                //inputObj['marginType'] = this.selectedMarginType
              }
              var jsonString = JSON.stringify(inputObj);
              this.http.post<any>(this.data.MARGINURL + 'createOffer', jsonString, {
                headers: {
                  'Content-Type': 'application/json',
                  'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                }
              })
                .subscribe(response => {
                  this.data.loader = false;
                  $('.onlyBuyBtn').prop('disabled', false);
                  $('.onlySellBtn').prop('disabled', false);
                  var result = response;
                  if (result.error != '0') {
                    this.data.alert(result.message, 'success');
                    //$('#warn').click();
                    // $('.tradeBtn').removeAttr('disabled');
                    // $('.form-control').val('');
                    // $('#totalValueTrade').val('');
                    // $('.tradeBtn').attr('disabled', true);
                  } else {
                    $('.form-control').val('');
                    this.data.alert(result.message, 'success');
                    this.limitAmount = 0;
                    this.limitPrice = 0;
                    this.marginReset();
                    $('#trade').click();
                  }
                  this.renderMarginBalance(this.selectedMarginType);
                });
            }
            this.limitAmount = this.limitPrice = this.limitValue = null;

          });
      } else {
        this.limitAmount = this.limitPrice = this.limitValue = null;
        this.data.loader = false;
        this.data.alert('Your offer is too small', 'warning');
        $('.onlyBuyBtn').prop('disabled', false);
        $('.onlySellBtn').prop('disabled', false);
      }
    } else {
      $('.form-control').val('');
      $('.tradeBtn').removeAttr('disabled');
      this.data.alert('Please provide proper selling details', 'warning');
      $('.onlyBuyBtn').prop('disabled', false);
      $('.onlySellBtn').prop('disabled', false);
    }
  }

  balencelist;
  assetbalance;
  getUserTransaction() {
    this.stpLoader = true;
    // this.stpLoader = true

    var userTransObj = {};
    userTransObj['customerId'] = localStorage.getItem('user_id');
    userTransObj['uuid'] = localStorage.getItem('uuid')
    if (this.selectedMarginType != undefined && this.selectedMarginType != null) {
      userTransObj['marginType'] = this.selectedMarginType;
    }
    var jsonString = JSON.stringify(userTransObj);
    this.http.post<any>(this.data.WEBSERVICE + '/transaction/getUserBalance', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        this.balencelist = result.userBalanceList;
        this.currencyBalance = this.balencelist;
        if (this.currencyBalance != null) {
          for (var i = 0; i < this.currencyBalance.length; i++) {
            if (this.currencyBalance[i].currencyCode == "USD") {
              localStorage.setItem('usdbalance', this.currencyBalance[i].closingBalance);

            }
          }

        }
        if (result.error.error_data != '0') {
          this.data.alert('Cannot fetch user balance', 'danger');
        }
        else {
          this.selectedCryptoCurrency = localStorage.getItem('selected_currency');
          localStorage.getItem("selling_crypto_asset");
          localStorage.getItem("buying_crypto_asset");
          for (var i = 0; i <= this.balencelist.length - 1; i++) {
            if (this.balencelist[i].currencyCode == localStorage.getItem("buying_crypto_asset").toUpperCase()) {
              this.selelectedBuyingAssetBalance = this.balencelist[i].closingBalance.toFixed(localStorage.getItem('priceprc'));

            }
            if (this.balencelist[i].currencyCode == localStorage.getItem("selling_crypto_asset").toUpperCase()) {
              this.selelectedSellingAssetBalance = this.balencelist[i].closingBalance.toFixed(localStorage.getItem('priceprc'));
              //console.log('Selling Asset Balance',this.selelectedSellingAssetBalance)
            }
          }
        }
      this.stpLoader = false;
      // this.stpLoader = false



      }, error => {
         //console.log(error)
         if(error.status == '401'){
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
            // this.data.alert(error.message, 'warning');
        }
      });
  }
  stopLossPrice: any;
  stopLossTriggerPrice: any;
  stopLossQuantity: any;

  async sellStoploss() {

    /* var a = await this.data.checkUserBlockStatus();
    console.log('blocked statussss', a); */

    //if(a == true){

      $('#placeOrderForStopLossBtn').attr('disabled', true);
    $('.stopLossError').hide();
    this.data.alert('Loading...', 'dark');
    if (this.stopLossPriceSell != undefined && this.stopLossTriggerPriceSell != undefined && this.stopLossQuantitySell != undefined) {
      $('#placeOrderForStopLossBtn').attr('disabled', false);
      if (this.data.ltpdata != null) {
        this.marketOrderPrice = parseFloat(this.data.ltpdata);
        if (
          this.marketOrderPrice > this.stopLossTriggerPriceSell &&
          this.marketOrderPrice > this.stopLossPriceSell &&
          this.stopLossTriggerPriceSell > this.stopLossPriceSell
        ) {

          var inputObj = {};
          inputObj['buying_asset_code'] = localStorage.getItem('selling_crypto_asset').toUpperCase();
          // inputObj['userId'] = localStorage.getItem('user_id');
          inputObj['selling_asset_code'] = localStorage.getItem('buying_crypto_asset').toUpperCase();
          inputObj['quantity'] = this.stopLossQuantitySell;
          inputObj['stop_loss_price'] = this.stopLossPriceSell;
          inputObj['trigger_price'] = this.stopLossTriggerPriceSell;
          inputObj['txn_type'] = '2';
          inputObj['uuid'] = localStorage.getItem('uuid');

          var jsonString = JSON.stringify(inputObj);
          this.http.post<any>(this.data.WEBSERVICE + '/userTrade/StopLossBuySellTrade', jsonString, {
            headers: {
              'Content-Type': 'application/json',
              'authorization': 'BEARER ' + localStorage.getItem('access_token')
            }
          })
            .subscribe(data => {
              this.data.loader = false;
              var result = data;
              if (result.error.error_data != '0') {
                if (result.error.error_data == 1)
                  this.data.alert(result.error.error_msg, 'danger');
                else
                  $('#warn').click();
              } else {
                this.data.alert(result.error.error_msg, 'success');
                $('#trade').click();
                
              }
              this.stopLossPriceSell = this.stopLossTriggerPriceSell = this.stopLossQuantitySell = this.stopLossTotalSell = null
              $('.onlyBuyBtn').prop('disabled', true);
              $('.onlySellBtn').prop('disabled', true);
            });

        } else {
          //this.stopLossError = '*Market order price should be greater than trigger price & trigger price should be greater than stop loss price';
          this.stopLossError = '*Market order price should be greater than stop price and limit price should be less than stop price';
          $('.stopLossError').html(this.stopLossError);
          $('.stopLossError').show();
          this.data.loader = false;
        }
      } else {
        this.stopLossError = '*Orderbook depth reached, price not found';
        $('.stopLossError').html(this.stopLossError);
        $('.stopLossError').show();
        this.data.loader = false;
      }

    } else {
      this.data.alert('Please Provide Proper Details', 'error');
    }

    //}

    
  }

  async buyStopLoss() {

    /* var a = await this.data.checkUserBlockStatus();
    console.log('blocked statussss', a); */

    //if(a == true){

      $('#buyForStopLossBtn').attr('disabled', true);
      $('.stopLossError').hide();
      this.data.alert('Loading...', 'dark');
      if (this.stopLossPrice != undefined && this.stopLossTriggerPrice != undefined && this.stopLossQuantity != undefined) {
        $('#buyForStopLossBtn').attr('disabled', false);
        if (this.data.ltpdata != null) {
          this.marketOrderPrice = parseFloat(this.data.ltpdata);
          if (
            this.marketOrderPrice < this.stopLossTriggerPrice &&
            this.marketOrderPrice < this.stopLossPrice &&
            this.stopLossTriggerPrice < this.stopLossPrice
          ) {
            var inputObj = {};
            inputObj['buying_asset_code'] = localStorage.getItem('buying_crypto_asset').toUpperCase();
            // inputObj['userId'] = localStorage.getItem('user_id');
            inputObj['selling_asset_code'] = localStorage.getItem('selling_crypto_asset').toUpperCase();
            inputObj['quantity'] = this.stopLossQuantity;
            inputObj['stop_loss_price'] = this.stopLossPrice;
            inputObj['trigger_price'] = this.stopLossTriggerPrice;
            inputObj['txn_type'] = '1';
            inputObj['uuid'] = localStorage.getItem('uuid');

            var jsonString = JSON.stringify(inputObj);
            this.http.post<any>(this.data.WEBSERVICE + '/userTrade/StopLossBuySellTrade', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                 'authorization': 'BEARER ' + localStorage.getItem('access_token')

              }
            })
              .subscribe(data => {
                this.data.loader = false;
                var result = data;
                if (result.error.error_data != '0') {
                  if (result.error.error_data == 1)
                    this.data.alert(result.error.error_msg, 'danger');
                  else
                    $('#warn').click();
                } else {
                  this.data.alert(result.error.error_msg, 'success');
                  $('#trade').click();
                  this.reset();
                }
                this.stopLossPrice = this.stopLossTriggerPrice = this.stopLossQuantity = this.stopLossTotal = null
                $('.onlyBuyBtn').prop('disabled', true);
                $('.onlySellBtn').prop('disabled', true);
              });
  
          } else {
            //this.stopLossError = '*Market order price should be less than trigger price & trigger price should be less than stop loss price';
            this.stopLossError = '*Market order price should be less than stop price and limit price should be greater than stop price';
            $('.stopLossError').html(this.stopLossError);
            $('.stopLossError').show();
            this.data.loader = false;
          }
        } else {
          this.stopLossError = '*Orderbook depth reached, price not found';
          $('.stopLossError').html(this.stopLossError);
          $('.stopLossError').show();
          this.data.loader = false;
        }
  
      } else {
        this.data.alert('Please Provide Proper Details', 'warning');
      }

    //}

   

  }
// place order spot->limit->oco buy
  async limitOcobuy(){
    // debugger;
    /* var a = await this.data.checkUserBlockStatus();
    console.log('blocked statussss', a);
 */
    //if(a == true){

      this.placeOrderForOcoBuy();
    if(this.limitPriceForOco1 !=undefined && this.limittriggerForOco1 !=undefined){
      if (this.data.ltpdata != null) {
        this.marketOrderPrice = parseFloat(this.data.ltpdata);
        console.log('market',this.marketOrderPrice)
        console.log(this.marketOrderPrice , parseFloat(this.limittriggerForOco1))
        console.log(this.marketOrderPrice , parseFloat(this.limitPriceForOco1))
        console.log(parseFloat(this.limittriggerForOco1) , parseFloat(this.limitPriceForOco1))
        if(
          this.marketOrderPrice > parseFloat(this.limittriggerForOco1) &&
          this.marketOrderPrice > parseFloat(this.limitPriceForOco1) &&
          parseFloat(this.limittriggerForOco1) > parseFloat(this.limitPriceForOco1)
        ){
          
          let payload = {
            // "userId":localStorage.getItem('user_id'),
            "uuid":localStorage.getItem('uuid'),

            "selling_asset_code":(this.data.selectedSellingAssetText).toUpperCase(),
            "buying_asset_code":(this.data.selectedBuyingAssetText).toUpperCase(),
            "amount":this.limitAmount,
            "price":this.limitPrice,
            "offerType":"L",
            "txn_type":"1",
            "assetCode":this.data.getAssetCode(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset')),
            "quantity":this.limitAmountForOco1,
            "stop_loss_price": this.limitPriceForOco1,
            "trigger_price":this.limittriggerForOco1
          }

          console.log('OCO BUY PAYLOAD',payload);
          this.data.alert('Loading...', 'dark', 30000);
          
          $('#mBuyOrder').prop('disabled', true);
          var jsonString = JSON.stringify(payload);
        this.http.post<any>(this.data.WEBSERVICE + '/userTrade/createOCOOffer', jsonString, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'BEARER ' + localStorage.getItem('access_token')
          }
        })
          .subscribe(response => {
            this.data.loader = false;
            $('#mBuyOrder').prop('disabled', false);
            var result = response;
            if (result.error.error_data != '0') {
              if (result.error.error_data == 1)
                this.data.alert(result.error.error_msg, 'danger');
              else
                $('#warn').click();
              $('.tradeBtn').removeAttr('disabled');
              $('.form-control').val('');
              $('#totalValueTrade').val('');
              $('.tradeBtn').attr('disabled', true);
            } else {
              $('.form-control').val('');
              this.data.alert(result.error.error_msg, 'success');
              this.limitPrice = 0;
              this.limitAmount = 0;
              this.data.renderDataForMyTradeSpot();
              this.data.renderDataForMyOfferSpot();
              this.data.renderDataForStopLimitSpot('buy');
              //this.ticker.handle24hrTickerManualy();
              this.reset();
              $('#trade').click();
            }
          });
          
        }else{
          console.log("wrong condition")
          this.stopLossError = '*Market order price should be greater than stop price and limit price should be less than stop price';
          $('.stopLossError').html(this.stopLossError);
          $('.stopLossError').show();
          
        }
      }
    }
    //}
    
  }
  // place order spot->limit->oco sell
  async limitOcoSell(){


  /*   var a = await this.data.checkUserBlockStatus();
    console.log('blocked statussss', a); */

    //if(a == true){

      this.placeOrderForOcoSell()
    if(this.limitPriceForOco2 !=undefined && this.limittriggerForOco2 !=undefined){
      if (this.data.ltpdata != null) {
        this.marketOrderPrice = parseFloat(this.data.ltpdata);
        console.log('market',this.marketOrderPrice)
        if(
          this.marketOrderPrice < parseFloat(this.limittriggerForOco2) &&
          this.marketOrderPrice < parseFloat(this.limitPriceForOco2) &&
          parseFloat(this.limittriggerForOco2) < parseFloat(this.limitPriceForOco2)
        ){
          
          let payload = {
            // "userId":localStorage.getItem('user_id'),
            "uuid":localStorage.getItem('uuid'),

            "selling_asset_code":(this.data.selectedBuyingAssetText).toUpperCase(),
            "buying_asset_code":(this.data.selectedSellingAssetText).toUpperCase(),
            "amount":this.limitAmount,
            "price":this.limitPrice,
            "offerType":"L",
            "txn_type":"2",
            "assetCode":this.data.getAssetCode(localStorage.getItem('buying_crypto_asset'), localStorage.getItem('selling_crypto_asset')),
            "quantity":this.limitAmountForOco2,
            "stop_loss_price": this.limitPriceForOco2,
            "trigger_price":this.limittriggerForOco2
          }

          console.log('OCO BUY PAYLOAD',payload);
          this.data.alert('Loading...', 'dark', 30000);
          
          $('#msellorder').prop('disabled', true);
          var jsonString = JSON.stringify(payload);
        this.http.post<any>(this.data.WEBSERVICE + '/userTrade/createOCOOffer', jsonString, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'BEARER ' + localStorage.getItem('access_token')
          }
        })
          .subscribe(response => {
            this.data.loader = false;
            $('#msellorder').prop('disabled', false);
            var result = response;
            if (result.error.error_data != '0') {
              if (result.error.error_data == 1)
                this.data.alert(result.error.error_msg, 'danger');
              else
                $('#warn').click();
              $('.tradeBtn').removeAttr('disabled');
              $('.form-control').val('');
              $('#totalValueTrade').val('');
              $('.tradeBtn').attr('disabled', true);
            } else {
              $('.form-control').val('');
              this.data.alert(result.error.error_msg, 'success');
              this.limitPrice = 0;
              this.limitAmount = 0;
              this.data.renderDataForMyTradeSpot();
              this.data.renderDataForMyOfferSpot();
              this.data.renderDataForStopLimitSpot('buy');
              //this.ticker.handle24hrTickerManualy();
              this.reset();
              $('#trade').click();
            }
          });
        }else{
          console.log("wrong condition")
          this.stopLossError = '*Market order price should be less than stop price and limit price should be greater than stop price';
          $('.stopLossError').html(this.stopLossError);
          $('.stopLossError').show();
        }
      }
    }

    //}

    
  }

  warnKyc(content) {
    this.modalService.open(content, {
      centered: true
    });
  }

  nonNg(event) {
    var val = event.target.value;
    if (val < 0)
      this.data.alert('Price cannot be negative', 'warning');
  }

  send(content, val) {
    this.mywallet.getCurrencyForSend(content, val, '', '', 'NA');
  }
  // disabled  buy place order button for oco input field invalid
  placeOrderForOcoBuy() {
    if (this.selectedOrderType == 'OCO') {

      if ((this.limitAmount <= 0.0001) || (this.limitPrice <= 0)
        || (this.limitAmountForOco1 <= 0.0001) || (this.limitPriceForOco1 <= 0) || (this.limittriggerForOco1 <=0.0001)) {
        this.isPlaceOrderEnabled = false;
      }
      else {
        this.isPlaceOrderEnabled = true;
      }
    }
  }
  // disabled  sell place order button for oco input field invalid
  placeOrderForOcoSell() {
    if (this.selectedOrderType == 'OCO') {

      if ((this.limitAmount <= 0.0001) || (this.limitPrice <= 0) || (this.limitAmountForOco2 <= 0.0001) || (this.limitPriceForOco2 <= 0) || (this.limittriggerForOco2 <=0.0001)) {
        this.isPlaceOrderEnabledForSell = false;
      }
      else {
        this.isPlaceOrderEnabledForSell = true;
      }
    }
  }

  resetSlider() {
    this.sliderValueBuy = 0;
    this.sliderValueSell = 0;
    this.sliderValueBuyLimit = 0;
    this.sliderValueSellLimit = 0;
    $('.form-range').val('0'); document.getElementById('customRange3').classList.remove("changeBackgroundSlider");
  }

  validateLimit() {
    this.placeOrderForOcoBuy();
    this.placeOrderForOcoSell();
    var lv: number = 0.000001;
    if (this.limitAmount <= 0.0001) {
      $('.onlyBuyError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
      $('#onlyBuyBtn').prop('disabled', true);
      

    }
    else {
      $('.onlyBuyError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
      $('#onlyBuyBtn').prop('disabled', false);
    }
    return 0.0001 >= this.limitAmount || 0.00000001 >= this.limitPrice;
  }

  validateLimitSell(){

    this.placeOrderForOcoBuy();
    this.placeOrderForOcoSell();
    var lv: number = 0.000001;
    if (this.limitAmountSell <= 0.0001) {
      $('.onlySellError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
      $('#onlySellBtn').prop('disabled', true);
      

    }
    else {
      $('.onlySellError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
      $('#onlySellBtn').prop('disabled', false);
    }
    return 0.0001 >= this.limitAmountSell || 0.00000001 >= this.limitPriceSell;
  }


  /* validatelimitAmountForOco() {
    this.placeOrderForOcoBuy();
    this.placeOrderForOcoSell();
    var lv: number = 0.000001;
    if (this.limitAmountForOco <= 0.0001) {
      $('.onlyBuyError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);

    }
    else {

      $('.onlyBuyError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
    }
    return 0.0001 >= this.limitAmountForOco || 0.00000001 >= this.limitPriceForOco;
  } */

 /*  validatelimitPriceForOco(){
    this.placeOrderForOcoBuy();
    this.placeOrderForOcoSell();
    if(this.limitPriceForOco <=0.0001){
      $('.onlyBuyError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);

    }
    else {

      $('.onlyBuyError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
    }
    return 0.0001 >= this.limitPriceForOco
  } */
  

  /* handlelimittriggerForOco(){
    // console.log('0here',this.limittriggerForOco)
    this.placeOrderForOcoBuy();
    this.placeOrderForOcoSell();
    if (this.limittriggerForOco <= 0.0001) {
      $('.onlyBuyError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
    }
    else {
      $('.onlyBuyError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
    }
    return 0.0001 >= this.limittriggerForOco;
  } */


  validatemarketLimit() {
    var lv;
    if (this.onlyBuyTotalPrice >= 0.001) {
      lv = true
    }
    else {
      lv = false;
    }
    return lv;
  }

  validatemarketbuy() {
    if (this.onlyBuyAmount <= 0.0001) {
      $('.marketbuyerror').show();
      $('#marketbuy').prop('disabled', true);
    }
    else {
      $('.marketbuyerror').hide();
      $('#marketbuy').prop('disabled', false);
    }
    return 0.0001 >= this.onlyBuyAmount;
  }

  validatemarketsell() {
    if (this.onlySellAmount <= 0.0001) {
      $('.marketsellerror').show();
      $('#marketsell').prop('disabled', true);
    }
    else {
      $('.marketsellerror').hide();
      $('#marketsell').prop('disabled', false);
    }
    return 0.0001 >= this.onlySellAmount;
  }

  validateStoplossAmount() {
    if (this.stopLossQuantity <= 0.0001) {
      $('.onlyBuyError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
      this.stopLossTotal = ''

    }
    else {
      this.stopLossTotal = (parseFloat(this.stopLossQuantity) * parseFloat(this.stopLossPrice)).toFixed(this.tradep)
      if (isNaN(this.stopLossTotal)) {
        this.stopLossTotal = ''
      }
      $('.onlyBuyError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
    }
    return 0.0001 >= this.stopLossQuantity;
  }

  validateStoplossAmountSell(){

    if (this.stopLossQuantitySell <= 0.0001) {
      $('.onlySellError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
      this.stopLossTotalSell = ''

    }
    else {
      this.stopLossTotalSell = (parseFloat(this.stopLossQuantitySell) * parseFloat(this.stopLossPriceSell)).toFixed(this.tradep)
      if (isNaN(this.stopLossTotalSell)) {
        this.stopLossTotalSell = ''
      }
      $('.onlySellError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
    }
    return 0.0001 >= this.stopLossQuantitySell;

  }

  validateStoplossPrice() {
    /* $('.form-range').val('0'); document.getElementById('customRange3').classList.remove("changeBackgroundSlider");;
    this.sliderValueBuy = 0;
    this.sliderValueSell = 0;
    this.sliderValueBuyLimit = 0;
    this.sliderValueSellLimit = 0;
    this.sliderValueBuyStopLimit = 0;
    this.sliderValueSellStopLimit = 0; */
    if (this.stopLossPrice <= 0.0001) {
      $('.onlyBuyError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
      this.stopLossTotal = ''

    }
    else {
      /* this.stopLossTotal = (parseFloat(this.stopLossQuantity) * parseFloat(this.stopLossPrice)).toFixed(this.tradep)
      if (isNaN(this.stopLossTotal)) {
        this.stopLossTotal = ''
      } */
      $('.onlyBuyError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
    }
    return 0.0001 >= this.stopLossPrice;
  }

  validateStoplossPriceSell() {
  
    if (this.stopLossPriceSell <= 0.0001) {
      $('.onlySellError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
      this.stopLossTotal = ''

    }
    else {
     $('.onlySellError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
    }
    return 0.0001 >= this.stopLossPriceSell;
  }

  validateStoplossTriggerPrice() {
    /* $('.form-range').val('0'); document.getElementById('customRange3').classList.remove("changeBackgroundSlider");;
    this.sliderValueBuy = 0;
    this.sliderValueSell = 0;
    this.sliderValueBuyLimit = 0;
    this.sliderValueSellLimit = 0;
    this.sliderValueBuyStopLimit = 0;
    this.sliderValueSellStopLimit = 0; */
    if (this.stopLossTriggerPrice <= 0.0001) {
      $('.onlyBuyError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
    }
    else {
      $('.onlyBuyError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
    }
    return 0.0001 >= this.stopLossTriggerPrice;
  }

  validateStoplossTriggerPriceSell() {
    
    if (this.stopLossTriggerPriceSell <= 0.0001) {
      $('.onlySellError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
    }
    else {
      $('.onlySellError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
    }
    return 0.0001 >= this.stopLossTriggerPriceSell;
  }

  /*** Method defination for selecting margin type ***/
  handleSelectMarginType = (param) => {
    this.selectedMarginType = param;
    this.renderMarginBalance(this.selectedMarginType)
  }

  /*** Method defination for retrieve margin wallet balance ***/
  renderMarginBalance = (type) => {

    this.http.get<any>(this.data.LENDINGURL + 'getMarginWalletByCurrency?customerId=' + localStorage.getItem('user_id') + '&currencyName=' + localStorage.getItem('selling_crypto_asset') + '&marginType=' + type, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {

      if (data.error != '1') {
        // this.data.alert("Balance is available", 'success');
        this.marginBalance = data.availableBalance.toFixed(localStorage.getItem('priceprc'))
        //console.log('Margin Balance',this.marginBalance)
        //this.selelectedSellingAssetBalance = data.marginWalletBalance
      } else {
        this.data.alert("No Balance is Available Here", 'danger');
        this.marginBalance = 0
        // this.selelectedSellingAssetBalance = '0'
      }
    })
  }

  /* Method defination for get all precesion */
  getAllPrecision = () => {
    this.http.get<any>(this.data.WEBSERVICE + '/home/currencyPrecision')
      .subscribe(data => {
        let precisionList = data.precisionList;
        console.log(precisionList)
        localStorage.setItem('precision_list_json', JSON.stringify(precisionList))
      })
  }

  /* Method defination for get specific currncy precision */
  getSpecificCurrencyPrecision = (param) => {
    let list = JSON.parse(localStorage.getItem('precision_list_json'));
    let precision = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].CURRENCYID == param || list[i].CURRENCY == param.toUpperCase()) {
        precision = list[i].PRECISION;
        break;
      }
    }
    return precision;
  }

  /* Method defination for showing order type dropdown */
  handleShowOrderTypeDropdown = (param) => {
    //this.selectedOrderType = 'GTC';
    this.disclosedQuantity = null;
    this.limitAmountForOco1 = null;
    this.limitTotalForOco1 = null;
    this.limitPriceForOco1 = null;
    this.limitAmountForOco2 = null;
    this.limitTotalForOco2 = null;
    this.limitPriceForOco2 = null;
    if (param.toLowerCase() == 'limit') {
      this.showOrderTypeDropdown = true
      $('#orderTypeDropdown').show();
    } else {
      this.showOrderTypeDropdown = false;
      $('#orderTypeDropdown').hide();
    }
  }

  makeClassToggle(status) {
    // console.log('button clicked');
    this.buySellPillsClassStatus = status;


  }

  getBuySliderVal(e) {

    this.stpLoader = true

    var balance;
    if (e.target.value == 0) {
      this.sliderValueBuy = 0;
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 1) {
      this.sliderValueBuy = 25;
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 2) {
      this.sliderValueBuy = 50;
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 3) {
      this.sliderValueBuy = 75;
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 4) {
      document.getElementById('customRange3').classList.add("changeBackgroundSlider");
      this.sliderValueBuy = 100;

    }

    console.log('slide sliderValue', this.sliderValueBuy);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));




    let sliderValue = this.sliderValueBuy
    let ltp = this.data.ltpdata
    this.newBuybalance = parseFloat(this.selelectedSellingAssetBalance);


    this.http.get<any>('https://stream.paybito.com/SocketStream/api/depth?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {

      console.log('askme', data.ask[0].price);

      //this.onlyBuyAmount = (((this.newBuybalance * (sliderValue/100)) / parseFloat(data.ask[0].price))*this.percentageValue).toFixed(this.tradep)
      //Amount = ((WB * Slider %) - ((WB * Slider %) * (TF + 0.1)%)) / MP

      this.onlyBuyAmount = (((this.newBuybalance * (sliderValue / 100)) - ((this.newBuybalance * (sliderValue / 100)) * this.percentageValue)) / parseFloat(data.ask[0].price)).toFixed(this.tradep)
      console.log('ask me cal price', this.onlyBuyAmount)
      this.getBuyValSlider(this.onlyBuyAmount)
      this.validatemarketbuy()
    })






    console.log('slide newBuybalance', this.newBuybalance);
    console.log('slide onlyBuyAmount', this.onlyBuyAmount);


  }

  getBuyValSlider(data) {
    var val = data;
    console.log('slide getvalSlider', val)
    if (val < 0 || val == "") {
      // var onlyBuyAmount:any=val;
      if (val == 0) {
        this.onlyBuyPrice = 0;
        this.onlyBuyTotalPrice = 0;
      }
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlyBuyAmount = '';
    } else {
      var onlyBuyAmount: any = val;
      this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=BID' + '&amount=' + onlyBuyAmount)
        .subscribe(data => {
          var result = data;
          if (result.statuscode != '0') {
            if (this.data.selectedSellingAssetText == 'USD') {
              this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
              this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(this.tradep);
              if (this.onlyBuyTotalPrice < 0.001) {
                $('.onlyBuyErrorM').show();
                $('#marketbuy').prop('disabled', true);

              }
              else {
                $('.onlyBuyErrorM').hide();
                $('#marketbuy').prop('disabled', false);
              }
            } else {
              this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
              this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(this.tradep);
              if (this.onlyBuyTotalPrice < 0.001) {
                $('.onlyBuyErrorM').show();
                $('#marketbuy').prop('disabled', true);

              }
              else {
                $('.onlyBuyErrorM').hide();
                $('#marketbuy').prop('disabled', false);
              }
            }
            $('.onlyBuyError').hide();
            $('#marketbuy').prop('disabled', false);
          } else {
            this.onlyBuyPrice = 0;
            this.onlyBuyTotalPrice = 0;
            $('.onlyBuyError').show();
            $('#marketbuy').prop('disabled', true);
          }
        }, error => {
          // this.data.logout();
          // this.data.alert('Session Timeout. Login Again', 'warning');
        });
    }

    this.stpLoader = false

  }

  getBuySliderValLimit(e) {
    this.stpLoader = true

    var balance;
    if (e.target.value == 0) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyLimit = 0;

    }
    if (e.target.value == 1) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyLimit = 25;
    }
    if (e.target.value == 2) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyLimit = 50;
    }
    if (e.target.value == 3) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyLimit = 75;
    }
    if (e.target.value == 4) {
      document.getElementById('customRange3').classList.add("changeBackgroundSlider");

      this.sliderValueBuyLimit = 100;
    }

    console.log('slide sliderValue', this.sliderValueBuyLimit);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));
    console.log('slide this.tradep', parseFloat(this.tradep));


    

    let sliderValue = this.sliderValueBuyLimit
    let ltp = this.data.ltpdata
    this.newBuybalanceLimit = parseFloat(this.selelectedSellingAssetBalance);

    this.http.get<any>('https://stream.paybito.com/SocketStream/api/depth?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {


      console.log('this.newBuybalanceLimit',this.newBuybalanceLimit);
      console.log('this.sliderValue',sliderValue);
      console.log('this.percentageValue',this.percentageValue);
      console.log('askme', data.ask[0].price);
      console.log('this.tradep',this.tradep);


      

      //this.limitAmount = (((this.newBuybalanceLimit * (sliderValue/100)) / parseFloat(data.ask[0].price))*this.percentageValue).toFixed(this.tradep)

      this.limitAmount = (((this.newBuybalanceLimit * (sliderValue / 100)) - ((this.newBuybalanceLimit * (sliderValue / 100)) * this.percentageValue)) / parseFloat(data.ask[0].price)).toFixed(this.tradep)

      if (this.sliderValueBuyLimit == 0) {
        this.limitPrice = 0;
      }
      else {
        this.limitPrice = (parseFloat(data.ask[0].price) - (parseFloat(data.ask[0].price) * 0.01)).toFixed(this.tradep)

      }
      this.limitValue = (this.limitAmount * this.limitPrice).toFixed(this.tradep);

      this.validateLimit()

    })






    // this.getBuyValSlider(this.onlyBuyAmount)

    console.log('slide newBuybalance', this.newBuybalance);
    console.log('slide onlyBuyAmount', this.limitAmount);

    this.stpLoader = false


  }

  getSellSliderValLimit(e) {
    this.stpLoader = true

    var balance;
    if (e.target.value == 0) {
      this.sliderValueSellLimit = 0;
      document.getElementById('customRange4').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 1) {
      this.sliderValueSellLimit = 25;
      document.getElementById('customRange4').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 2) {
      this.sliderValueSellLimit = 50;
      document.getElementById('customRange4').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 3) {
      this.sliderValueSellLimit = 75;
      document.getElementById('customRange4').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 4) {
      this.sliderValueSellLimit = 100;
      document.getElementById('customRange4').classList.add("changeBackgroundSlider");

    }

    console.log('slide sliderValue', this.sliderValueSellLimit);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));




    let sliderValue = this.sliderValueSellLimit
    let ltp = this.data.ltpdata
    this.newSellbalanceLimit = parseFloat(this.selelectedBuyingAssetBalance);

    this.limitAmountSell = ((this.newSellbalanceLimit * (sliderValue / 100)));

    this.http.get<any>('https://stream.paybito.com/SocketStream/api/depth?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {

      console.log('askme', data.bid[0].price);


      if (this.sliderValueSellLimit == 0) {
        this.limitPriceSell = 0;
      }
      else {
        this.limitPriceSell = (parseFloat(data.bid[0].price) + (parseFloat(data.bid[0].price) * 0.01)).toFixed(this.tradep);

      }

      this.limitValueSell = (this.limitAmountSell * this.limitPriceSell).toFixed(this.tradep);
      this.validateLimitSell()



    })



    this.stpLoader = false


  }
  getSellSliderValLimitOCO(e) {
    this.stpLoader = true

    var balance;
    if (e.target.value == 0) {
      this.sliderValueSellLimit = 0;
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 1) {
      this.sliderValueSellLimit = 25;
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 2) {
      this.sliderValueSellLimit = 50;
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 3) {
      this.sliderValueSellLimit = 75;
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

    }
    if (e.target.value == 4) {
      this.sliderValueSellLimit = 100;
      document.getElementById('customRange3').classList.add("changeBackgroundSlider");

    }

    console.log('slide sliderValue', this.sliderValueSellLimit);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));




    let sliderValue = this.sliderValueSellLimit
    let ltp = this.data.ltpdata
    this.newSellbalanceLimit = parseFloat(this.selelectedBuyingAssetBalance);

    this.limitAmount2 = ((this.newSellbalanceLimit * (sliderValue / 100)));

    this.http.get<any>('https://stream.paybito.com/SocketStream/api/depth?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {

      console.log('askme', data.bid[0].price);


      if (this.sliderValueSellLimit == 0) {
        this.limitPrice2 = 0;
      }
      else {
        this.limitPrice2 = (parseFloat(data.bid[0].price) + (parseFloat(data.bid[0].price) * 0.01)).toFixed(this.tradep);

      }

      this.limitValue2 = (this.limitAmount2 * this.limitPrice2).toFixed(this.tradep);
      this.validateLimitSell()



    })



    this.stpLoader = false


  }

  getBuySliderValStopLimit(e) {
    this.stpLoader = true
    var balance;
    if (e.target.value == 0) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyStopLimit = 0;
    }
    if (e.target.value == 1) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyStopLimit = 25;
    }
    if (e.target.value == 2) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyStopLimit = 50;
    }
    if (e.target.value == 3) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyStopLimit = 75;
    }
    if (e.target.value == 4) {
      document.getElementById('customRange3').classList.add("changeBackgroundSlider");

      this.sliderValueBuyStopLimit = 100;
    }

    console.log('slide sliderValue', this.sliderValueBuyStopLimit);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));




    let sliderValue = this.sliderValueBuyStopLimit
    let ltp = this.data.ltpdata
    this.newBuybalanceLimit = parseFloat(this.selelectedSellingAssetBalance);


    /* this.http.get<any>('https://stream.paybito.com/SocketStream/api/depth?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => { */

      //console.log('askme', data.ask[0].price);

      //this.stopLossQuantity = (((this.newBuybalanceLimit * (sliderValue/100)) / parseFloat(data.ask[0].price))*this.percentageValue).toFixed(this.tradep)

      
      this.stopLossPrice = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata)*0.02)).toFixed(this.tradep);
      this.stopLossTriggerPrice = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata)*0.01)).toFixed(this.tradep);
      this.stopLossQuantity = (((this.newBuybalanceLimit * (sliderValue / 100)) - ((this.newBuybalanceLimit * (sliderValue / 100)) * this.percentageValue)) / parseFloat(this.stopLossPrice)).toFixed(this.tradep)
      this.stopLossTotal = (parseFloat(this.stopLossPrice) * parseFloat(this.stopLossQuantity)).toFixed(this.tradep)

      

      if(parseFloat(this.stopLossQuantity)>0.0001){
        $('.onlyBuyBtn').prop('disabled', false);
      }else{
        $('.onlyBuyBtn').prop('disabled', true);
      }

      

      this.validateStoplossAmount()

    //})




    // this.getBuyValSlider(this.onlyBuyAmount)

    console.log('slide newBuybalance', this.newBuybalance);
    console.log('slide onlyBuyAmount', this.stopLossQuantity);

    this.stpLoader = false


  }


  getSellSliderValStopLimit(e) {
    this.stpLoader = true

    var balance;
    if (e.target.value == 0) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSellStopLimit = 0;
    }
    if (e.target.value == 1) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSellStopLimit = 25;
    }
    if (e.target.value == 2) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSellStopLimit = 50;
    }
    if (e.target.value == 3) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSellStopLimit = 75;
    }
    if (e.target.value == 4) {
      document.getElementById('customRange3').classList.add("changeBackgroundSlider");

      this.sliderValueSellStopLimit = 100;
    }

    console.log('slide sliderValue', this.sliderValueSellStopLimit);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));




    let sliderValue = this.sliderValueSellStopLimit
    let ltp = this.data.ltpdata
    this.newBuybalanceLimit = parseFloat(this.selelectedBuyingAssetBalance);
    /* this.http.get<any>('https://stream.paybito.com/SocketStream/api/depth?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => { */
      //this.stopLossPrice = ((this.newBuybalanceLimit * (sliderValue / 100)));
      this.stopLossPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata)*0.02)).toFixed(this.tradep);
      this.stopLossQuantitySell = ((this.newBuybalanceLimit * (sliderValue / 100)));
      this.stopLossTriggerPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata)*0.01)).toFixed(this.tradep);
    this.stopLossTotalSell = (parseFloat(this.stopLossPriceSell) * parseFloat(this.stopLossQuantitySell))

    // console.log('slide1', this.stopLossPriceSell);
    // console.log('slide2', this.stopLossQuantitySell);
    // console.log('slide3', this.stopLossTriggerPriceSell);
    // console.log('slide4', this.stopLossTotalSell);    

    // this.getBuyValSlider(this.onlyBuyAmount)

    //   let balance = this.selelectedBuyingAssetBalance
    // this.onlySellPrice = (balance * sliderValue%)

    if(parseFloat(this.stopLossQuantitySell)>0.0001){
      $('.onlySellBtnStopLimit').prop('disabled', false);
    }else{
      $('.onlySellBtnStopLimit').prop('disabled', false);
    }

    

    this.validateStoplossAmountSell()
//});

    console.log('slide newBuybalance', this.newBuybalance);
    console.log('slide onlyBuyAmount', this.stopLossQuantity);

    this.stpLoader = false


  }
  getBuySliderValStopLimitOco(e) {
    this.stpLoader = true

    var balance;
    if (e.target.value == 0) {
      document.getElementById('customRange3OCO').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyStopLimit = 0;
    }
    if (e.target.value == 1) {
      document.getElementById('customRange3OCO').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyStopLimit = 25;
    }
    if (e.target.value == 2) {
      document.getElementById('customRange3OCO').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyStopLimit = 50;
    }
    if (e.target.value == 3) {
      document.getElementById('customRange3OCO').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyStopLimit = 75;
    }
    if (e.target.value == 4) {
      document.getElementById('customRange3OCO').classList.add("changeBackgroundSlider");

      this.sliderValueBuyStopLimit = 100;
    }

    console.log('slide sliderValue', this.sliderValueBuyStopLimit);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));




    let sliderValue = this.sliderValueBuyStopLimit
    let ltp = this.data.ltpdata
    this.newBuybalanceLimit = parseFloat(this.selelectedSellingAssetBalance);


    /* this.http.get<any>('https://stream.paybito.com/SocketStream/api/depth?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => { */

      //console.log('askme', data.ask[0].price);

      //this.stopLossQuantity = (((this.newBuybalanceLimit * (sliderValue/100)) / parseFloat(data.ask[0].price))*this.percentageValue).toFixed(this.tradep)

      
      
      //FOR OCO 
    this.limitPriceForOco2 = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata)*0.02)).toFixed(this.tradep);
    this.limitAmountForOco2 = (((this.newBuybalanceLimit * (sliderValue / 100)) - ((this.newBuybalanceLimit * (sliderValue / 100)) * this.percentageValue)) / parseFloat(this.limitPriceForOco2)).toFixed(this.tradep);
    this.limittriggerForOco2 = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata)*0.01)).toFixed(this.tradep);

      

      if(parseFloat(this.limitAmountForOco2)>0.0001){
        this.isPlaceOrderEnabledForSell = true
      }else{
        this.isPlaceOrderEnabledForSell = false
      }

      this.validateStoplossAmount()

    //})




    // this.getBuyValSlider(this.onlyBuyAmount)

    console.log('slide newBuybalance', this.newBuybalance);
    console.log('slide onlyBuyAmount', this.stopLossQuantity);
    this.stpLoader = false



  }


  getSellSliderValStopLimitOco(e) {
    this.stpLoader = true
    var balance;
    if (e.target.value == 0) {
      document.getElementById('customRange3OCO').classList.remove("changeBackgroundSlider");

      this.sliderValueSellStopLimit = 0;
    }
    if (e.target.value == 1) {
      document.getElementById('customRange3OCO').classList.remove("changeBackgroundSlider");

      this.sliderValueSellStopLimit = 25;
    }
    if (e.target.value == 2) {
      document.getElementById('customRange3OCO').classList.remove("changeBackgroundSlider");

      this.sliderValueSellStopLimit = 50;
    }
    if (e.target.value == 3) {
      document.getElementById('customRange3OCO').classList.remove("changeBackgroundSlider");

      this.sliderValueSellStopLimit = 75;
    }
    if (e.target.value == 4) {
      document.getElementById('customRange3OCO').classList.add("changeBackgroundSlider");

      this.sliderValueSellStopLimit = 100;
    }

    console.log('slide sliderValue', this.sliderValueSellStopLimit);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));




    let sliderValue = this.sliderValueSellStopLimit
    let ltp = this.data.ltpdata
    this.newBuybalanceLimit = parseFloat(this.selelectedBuyingAssetBalance);
    console.log('slide newBuybalanceLimit',this.newBuybalanceLimit)
    /* this.http.get<any>('https://stream.paybito.com/SocketStream/api/depth?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => { */
      //this.stopLossPrice = ((this.newBuybalanceLimit * (sliderValue / 100)));
      

    //FOR OCO 
    this.limitPriceForOco1 = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata)*0.02)).toFixed(this.tradep);
    console.log(this.newBuybalanceLimit,sliderValue)
      this.limitAmountForOco1 = ((this.newBuybalanceLimit * (sliderValue / 100)));
      this.limittriggerForOco1 = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata)*0.01)).toFixed(this.tradep);
    

    // this.getBuyValSlider(this.onlyBuyAmount)

    //   let balance = this.selelectedBuyingAssetBalance
    // this.onlySellPrice = (balance * sliderValue%)

    

    if(parseFloat(this.limitAmountForOco1)>0.0001){
      this.isPlaceOrderEnabled = true
    }else{
      this.isPlaceOrderEnabled = false
    }

    this.validateStoplossAmount()
//});

    //console.log('slide newBuybalance', this.newBuybalance);
    //console.log('slide onlyBuyAmount', this.stopLossQuantity);


    this.stpLoader = false

  }




  getSellSliderVal(e) {
    this.stpLoader = true

    if (e.target.value == 0) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSell = 0;
    }
    if (e.target.value == 1) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSell = 25;
    }
    if (e.target.value == 2) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSell = 50;
    }
    if (e.target.value == 3) {
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSell = 75;
    }
    if (e.target.value == 4) {
      document.getElementById('customRange3').classList.add("changeBackgroundSlider");

      this.sliderValueSell = 100;
    }
    console.log('slide sliderValue', this.sliderValueSell);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));




    let sliderValue = this.sliderValueSell
    let ltp = this.data.ltpdata
    this.newBuybalance = parseFloat(this.selelectedBuyingAssetBalance);

    this.onlySellAmount = (this.newBuybalance * (sliderValue / 100));


    // let balance = this.selelectedBuyingAssetBalance
    // this.onlySellPrice = (balance * sliderValue%)


    console.log('SELL SLIDER', 'BALANCE => ' + parseFloat(this.selelectedBuyingAssetBalance), 'SLIDER VALUE => ' + sliderValue / 100, (parseFloat(this.selelectedBuyingAssetBalance) * (sliderValue / 100)))
    console.log('SELL SLIDER', 'LTP => ' + parseFloat(this.data.ltpdata), (parseFloat(this.selelectedBuyingAssetBalance) * (sliderValue / 100)) / parseFloat(this.data.ltpdata))

    console.log('slide newBuybalance', this.newBuybalance);
    console.log('SELL SLIDER onlySellAmount', this.onlySellAmount);
    this.getSellValSlider(this.onlySellAmount)
    this.validatemarketsell()


  }

  getSellValSlider(data) {
    var val = data;
    if (val < 0 || val == "") {
      console.log('hello test')
      if (val == 0) {
        this.onlySellPrice = 0;
        this.onlySellTotalPrice = 0;
      }
      // var onlyBuyAmount:any=val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlySellAmount = '';
    } else {
      var onlySellAmount: any = val;
      this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=ASK' + '&amount=' + onlySellAmount)
        .subscribe(data => {
          var result = data;
          if (result.statuscode != '0') {
            if (this.data.selectedSellingAssetText == 'usd') {
              this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
              this.onlySellTotalPrice = (parseFloat(result.price) * parseFloat(onlySellAmount)).toFixed(this.tradep);
              if (this.onlySellTotalPrice < 0.001) {
                $('.onlyBuyErrorM').show();
                $('#marketsell').prop('disabled', true);
              }
              else {
                $('.onlyBuyErrorM').hide();
                $('#marketsell').prop('disabled', false);
              }
            } else {
              this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
              this.onlySellTotalPrice = (parseFloat(result.price) * parseFloat(onlySellAmount)).toFixed(this.tradep);
              if (this.onlySellTotalPrice < 0.001) {
                $('.onlyBuyErrorM').show();
                $('#marketsell').prop('disabled', true);

              }
              else {
                $('.onlyBuyErrorM').hide();
                $('#marketsell').prop('disabled', false);
              }
            }
            $('.onlyBuyError').hide();
            $('#marketsell').prop('disabled', false);
          } else {
            this.onlySellPrice = 0;
            this.onlySellTotalPrice = 0;
            $('.onlyBuyError').show();
            $('#marketsell').prop('disabled', true);
          }
        })
    }

    this.stpLoader = false

  }

  /* Method defination for getting amount from total price for both buy and sell*/
  handleAmountFromTotalPrice = (e, type) => {
    let inputValue = e.target.value;
    let deductionPercentage = parseFloat(this.percentageValue);
    let balance = parseFloat(this.selelectedSellingAssetBalance);
    $('.form-range').val('0'); document.getElementById('customRange3').classList.remove("changeBackgroundSlider");;
    this.sliderValueBuy = 0;
    this.sliderValueSell = 0;
    this.sliderValueBuyLimit = 0;
    this.sliderValueSellLimit = 0;
    this.sliderValueBuyStopLimit = 0;
    this.sliderValueSellStopLimit = 0;

    if (inputValue != '') {
      if (parseFloat(inputValue) <= balance) {
        this.http.get<any>('https://stream.paybito.com/SocketStream/api/depth?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&limit=1', {
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'BEARER ' + localStorage.getItem('access_token'),
          }
        }).subscribe(data => {

          //console.log('askme', data.ask[0].price);
          if (type == 'buy') {
            this.onlyBuyPrice = parseFloat(data.ask[0].price).toFixed(this.tradep)
            //this.onlyBuyAmount = ((parseFloat(inputValue) / parseFloat(data.bid[0].price)) * deductionPercentage).toFixed(this.tradep)
            //Amount = ((WB * Slider %) - ((WB * Slider %) * (TF + 0.1)%)) / MP
            //this.onlyBuyAmount = ((parseFloat(inputValue) / parseFloat(data.bid[0].price)) * deductionPercentage).toFixed(this.tradep);
            this.onlyBuyAmount = ((parseFloat(inputValue) / parseFloat(data.ask[0].price))).toFixed(this.tradep);
            console.log('CONDITION => ', parseFloat(this.onlyBuyAmount) > 0.0001)
            if (parseFloat(this.onlyBuyAmount) > 0.0001) {

              $('.onlyBuyBtn').prop('disabled', false);
            } else {

              $('.onlyBuyBtn').prop('disabled', true);
            }
          } else {
            this.onlySellPrice = parseFloat(data.bid[0].price).toFixed(this.tradep)
            //this.onlySellAmount = ((parseFloat(inputValue) / parseFloat(data.ask[0].price)) * deductionPercentage).toFixed(this.tradep)
            this.onlySellAmount = ((parseFloat(inputValue) / parseFloat(data.bid[0].price))).toFixed(this.tradep)
            if (parseFloat(this.onlySellAmount) > 0.0001) {

              $('.onlySellBtn').prop('disabled', false);
            } else {

              $('.onlySellBtn').prop('disabled', true);
            }
          }


        })

      } else {
        $('.onlyBuyBtn').prop('disabled', true);
        $('.onlySellBtn').prop('disabled', true);
        this.data.alert('Total Price is exceeding your current balance', 'danger')
      }
    } else {
      this.onlyBuyAmount = this.onlyBuyPrice = ''
      $('.onlyBuyBtn').prop('disabled', true);
      this.onlySellAmount = this.onlySellPrice = ''
      $('.onlySellBtn').prop('disabled', true);
    }
  }

  /*Method defination for getting amount from total price for stop limit */
  handleStopLimitTotal = (e, type) => {
    let inputValue = e.target.value;
    if (type == 'buy') {
      this.stopLossPrice = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata) * 0.02)).toFixed(this.tradep);
      this.stopLossTriggerPrice = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata) * 0.01)).toFixed(this.tradep);
      this.stopLossQuantity = (parseFloat(inputValue) / parseFloat(this.stopLossPrice)).toFixed(this.tradep);
      $('.onlyBuyBtn').prop('disabled', false);

      if (isNaN(this.stopLossQuantity)) {
        this.stopLossQuantity = ''
        $('.onlyBuyBtn').prop('disabled', true);

      }
    } else {
      this.stopLossPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata) * 0.02)).toFixed(this.tradep);
      this.stopLossTriggerPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata) * 0.01)).toFixed(this.tradep);
      this.stopLossQuantitySell = (parseFloat(inputValue) / parseFloat(this.stopLossPriceSell)).toFixed(this.tradep);
      $('.onlySellBtn').prop('disabled', false);

      if (isNaN(this.stopLossQuantitySell)) {
        this.stopLossQuantitySell = ''
        $('.onlySellBtn').prop('disabled', true);

      }
    }
  }
  

  /*Method defination for getting total from amount for stop limit */
  handleStopLimitAmount = (e, type) => {
    let inputValue = e.target.value;
    if (type == 'buy') {
      this.stopLossPrice = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata) * 0.02)).toFixed(this.tradep);
      this.stopLossTriggerPrice = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata) * 0.01)).toFixed(this.tradep);
      this.stopLossTotal = (parseFloat(inputValue) * parseFloat(this.stopLossPrice)).toFixed(this.tradep);
      $('.onlyBuyBtn').prop('disabled', false);

      if (isNaN(this.stopLossTotal)) {
        this.stopLossTotal = ''
        $('.onlyBuyBtn').prop('disabled', true);

      }

      //For OCO 
      this.limitPriceForOco2 = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata) * 0.02)).toFixed(this.tradep);
      this.limittriggerForOco2 = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata) * 0.01)).toFixed(this.tradep);
      
    } else {
      this.stopLossPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata) * 0.02)).toFixed(this.tradep);
      this.stopLossTriggerPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata) * 0.01)).toFixed(this.tradep);
      this.stopLossTotalSell = (parseFloat(inputValue) * parseFloat(this.stopLossPriceSell)).toFixed(this.tradep);
      $('.onlySellBtn').prop('disabled', false);

      if (isNaN(this.stopLossTotalSell)) {
        this.stopLossTotalSell = ''
        $('.onlySellBtn').prop('disabled', true);

      }

      //FOR OCO
      this.limitPriceForOco2 = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata) * 0.02)).toFixed(this.tradep);
      this.limittriggerForOco2 = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata) * 0.01)).toFixed(this.tradep);
    }
  }

  calculateAmountFromLimitForStopLoss = (type) => {
    if(this.stopLossPrice != ''){


      // this.stopLossQuantity = (parseFloat(this.stopLossTotal)/parseFloat(this.stopLossPrice)).toFixed(this.tradep)

          this.stopLossTotal = (parseFloat(this.stopLossQuantity) * parseFloat(this.stopLossPrice)).toFixed(this.tradep);


      
      if(isNaN(this.stopLossQuantity)){
        this.stopLossQuantity = ''
      }
    }
  }

  calculateAmountFromLimitForStopLossSell = (type) => {
    if(this.stopLossPriceSell != ''){


      // this.stopLossQuantity = (parseFloat(this.stopLossTotal)/parseFloat(this.stopLossPrice)).toFixed(this.tradep)

          this.stopLossTotalSell = (parseFloat(this.stopLossQuantitySell) * parseFloat(this.stopLossPriceSell)).toFixed(this.tradep);


      
      if(isNaN(this.stopLossQuantitySell)){
        this.stopLossQuantitySell = ''
      }
    }
  }
  calculateAmountFromLimitForLimit = (type) => {
    console.log('here',type)
    //if(this.limitValue != ''){
      console.log('limitAmount',this.limitAmount)
      console.log('limitPrice',this.limitPrice)
      console.log('limitValue',this.limitValue)
      if(type == 'buy'){
        // if(this.limitValue != '' && this.limitValue != null && this.limitValue > 0){
        //   /* If total is not zero then calculating amount */
        //   this.limitAmount = (parseFloat(this.limitValue)/parseFloat(this.limitPrice)).toFixed(this.tradep)
        // }else{
        //   /* If total is  zero then calculating total */
        //   this.limitValue = (parseFloat(this.limitAmount)*parseFloat(this.limitPrice)).toFixed(this.tradep)
        // }
        this.limitValue = (parseFloat(this.limitAmount)*parseFloat(this.limitPrice)).toFixed(this.tradep);
      }else{
        // if(this.limitValue != '' && this.limitValue != null && this.limitValue > 0){
        //   /* If total is not zero then calculating total */
        //   this.limitValue = (parseFloat(this.limitPrice)*parseFloat(this.limitAmount)).toFixed(this.tradep)
        // }else{
        //   /* If total is  zero then calculating amount */
        //   this.limitAmount = (parseFloat(this.limitValue)/parseFloat(this.limitPrice)).toFixed(this.tradep)
        // }
        this.limitValueSell = (parseFloat(this.limitPriceSell)*parseFloat(this.limitAmountSell)).toFixed(this.tradep)
      }
      if(isNaN(this.limitAmount)){
        this.limitAmount = ''
      }
    //}
  }

  calculateAmountFromTotalForLimit = (type,e)=>{
    let inputValue = e.target.value;
    this.http.get<any>('https://stream.paybito.com/SocketStream/api/depth?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {

      //console.log('askme', data.ask[0].price);
      if(type == 'buy'){
        this.limitPrice = (parseFloat(data.ask[0].price) - (parseFloat(data.ask[0].price) * 0.01)).toFixed(this.tradep) 
        this.limitAmount = (parseFloat(inputValue)/parseFloat(this.limitPrice)).toFixed(this.tradep)
      }else{
        this.limitPrice = (parseFloat(data.bid[0].price) + (parseFloat(data.bid[0].price) * 0.01)).toFixed(this.tradep)
        this.limitAmount = (parseFloat(inputValue)/parseFloat(this.limitPrice)).toFixed(this.tradep)
      }
      if(isNaN(this.limitAmount)){
        this.limitAmount = ''
        $('.onlyBuyBtn').prop('disabled', true);
        $('.onlySellBtn').prop('disabled', true);

      }else if(parseFloat(this.limitAmount)>0.0001){
        if(type == 'buy'){
          //alert('in if')
          $('.onlyBuyBtn').prop('disabled', false);
        }else{
          //alert('in else')
          $('.onlyBuyBtn').prop('disabled', false);
        }

      }else if(parseFloat(this.limitAmount)<0.0001){
        if(type == 'buy'){
          $('.onlyBuyBtn').prop('disabled', true);
        }else{
          $('.onlyBuyBtn').prop('disabled', true);
        }

      }
      


    })
    
  }
  calculateLimitTotalFromAmount(){
    this.limitValue = (this.limitAmount * this.limitPrice).toFixed(this.tradep);
    if(isNaN(this.limitValue)){
      this.limitValue = '';
    }

  }

  calculateLimitTotalFromAmountSell(){
    this.limitValueSell = (this.limitAmountSell * this.limitPriceSell).toFixed(this.tradep);
    if(isNaN(this.limitValueSell)){
      this.limitValueSell = '';
    }

  }

  /* Method for clicking on order type caret icon */
  handleOrderTypeOption = () => {
    this.isOrderTypeDropdownEnabled = !this.isOrderTypeDropdownEnabled
    //alert(this.isOrderTypeDropdownEnabled)
  }

  /* handle select ordertype */
  handleSelectOrderType = (param) => {
    this.selectedOrderType = param;
    // console.log('param check',this.selectedOrderType)
    this.isOrderTypeDropdownEnabled = false
    if(param == 'GTC'){
      this.activeTabForSpot = 'stop-limit' 
    }else{
      this.activeTabForSpot = 'orderType'   
    }
  }

}
