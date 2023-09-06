import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { BodyService } from '../body.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyWalletComponent } from '../my-wallet/my-wallet.component';
import { BehaviorSubject } from 'rxjs';
import { DerivativeDashboardComponent } from '../derivative-dashboard/derivative-dashboard.component';
import { DerivativeChartComponent } from '../derivative-chart/derivative-chart.component';
import { e } from '@angular/core/src/render3';

@Component({
  selector: 'app-derivative-stoploss',
  templateUrl: './derivative-stoploss.component.html',
  styleUrls: ['./derivative-stoploss.component.css']
})
export class DerivativeStoplossComponent implements OnInit {

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
  tradep: any;
  selectedAssetPair: any = localStorage.getItem('selected_derivative_asset_pair');
  selectedAssetForLeverage;
  selectedLeverageMarginType: any = 2;
  leverageMinLimit: string = localStorage.getItem('leverage_min_limit')
  leverageMaxLimit: string = localStorage.getItem('leverage_max_limit')
  crossRange: Array<string> = []
  selectedCrossRange: any = this.leverageMinLimit + "X"
  selectedRangeSliderValue: any = this.leverageMinLimit;
  selectedRangeSliderInputValue: number = parseInt(this.leverageMinLimit);
  sliderStyle: any = {}
  @Input() Themecolor = 'Dark';

  selectedContractBalance: string = '0';
  selectedContractAsset: string = '';
  baseLeverage: any;
  baseRangeLeverage: any;
  baseInputLeverage: any;
  showOrderTypeDropdown: boolean = false;
  selectedOrderType: string = 'GTC';
  disclosedQuantity: any;
  limitAmountForOco: any
  limitTotalForOco: any
  limitPriceForOco: any
  buySellPillsClassStatus: boolean = true;

  sliderValueBuy:any = 0;
  sliderValueSell:any = 0;
  newBuybalance: any;
  newSellbalance: any;

  sliderValueBuyLimit:any = 0;
  sliderValueSellLimit:any = 0;
  newBuybalanceLimit: any;
  newSellbalanceLimit: any;
  percentageValue: any;
  resetLoader: boolean;
  stpLoader: boolean = false;
  limitPriceSell: any;
  limitAmountSell: any;
  valLimitSell: number;
  limitValueSell: any;
  sliderValueBuyStopLimit:any = 0;
  sliderValueSellStopLimit:any = 0;
  newBuybalanceStopLimit: any;
  newSellbalanceStopLimit: any;
  stopLossTotal: any;
  activeTabForSpot : any = 'market'
  stopLossQuantitySell: any;
  stopLossTriggerPriceSell: any;
  stopLossPriceSell: any;
  stopLossTotalSell: any;
 

  constructor(public data: CoreDataService, private http: HttpClient, public main: BodyService, public dash: DerivativeDashboardComponent, private modalService: NgbModal, public mywallet: MyWalletComponent, public ticker: DerivativeChartComponent) {
    $(function () {
      $('.form-control').click(function () {
        $(this).select();
      })
    })

    this.valLimit = 0;
  }

  ngOnInit() {

    // this.Themecolor = this.dash.Themecolor;
    this.data.currentMessage1.subscribe(message1 => {
      if (message1) {
        this.tradem = message1;
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

    /* setting up slider range value */
    this.crossRange.push(this.leverageMinLimit + 'X')
    this.crossRange.push(this.leverageMaxLimit + 'X')
    if (this.leverageMinLimit != null && this.leverageMinLimit != undefined) {
      //alert('in if')
      this.selectedCrossRange = this.leverageMinLimit + 'X'
      this.selectedRangeSliderInputValue = parseInt(this.leverageMinLimit)
      this.selectedRangeSliderValue = parseInt(this.leverageMinLimit)
    } else {
      //alert('in else')
      /* this.selectedCrossRange = '2X'
      this.selectedRangeSliderInputValue = 2
      this.selectedRangeSliderValue = 2 */
    }
    /* setting up previous selected leverage */
    if (
      localStorage.getItem('selected_leverage') == undefined || localStorage.getItem('selected_leverage') == 'undefined' ||
      localStorage.getItem('selected_leverage') == null && localStorage.getItem('selected_leverage') == 'null' || localStorage.getItem('selected_leverage') == ''
    ) {
      //alert('if')
      this.selectedCrossRange = this.selectedCrossRange;
      this.selectedRangeSliderValue = this.selectedRangeSliderValue;
      this.selectedRangeSliderInputValue = this.selectedRangeSliderInputValue;
    } else {
      //alert('else')
      this.selectedCrossRange = localStorage.getItem('selected_leverage')
      this.selectedRangeSliderValue = localStorage.getItem('selected_leverage').slice(0, -1);
      this.selectedRangeSliderInputValue = parseInt(localStorage.getItem('selected_leverage').slice(0, -1));
    }
    /* setting up previous selected margin type */
    if (
      localStorage.getItem('selected_leverage_margin_type') == undefined || localStorage.getItem('selected_leverage_margin_type') == 'undefined' ||
      localStorage.getItem('selected_leverage_margin_type') == null && localStorage.getItem('selected_leverage_margin_type') == 'null' || localStorage.getItem('selected_leverage_margin_type') == ''
    ) {
      this.selectedLeverageMarginType = this.selectedLeverageMarginType
    } else {
      this.selectedLeverageMarginType = localStorage.getItem('selected_leverage_margin_type')
    }
    localStorage.setItem('selected_leverage', this.selectedCrossRange)
    localStorage.setItem('selected_leverage_margin_type', this.selectedLeverageMarginType)
    if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
      this.data.renderAvailableBalance(this.data.selectedSellingAssetText, localStorage.getItem('selected_leverage_margin_type'), localStorage.getItem('selected_leverage').slice(0, -1), 'futures')
    } else {
      this.getUserTransaction();
      //this.renderContractBalance()
    }

    this.tradep = localStorage.getItem('priceprc')

    this.getfeesOfUser();

  }

  getfeesOfUser(){

    let currencyId = '';
    if(localStorage.getItem('selling_crypto_asset').toUpperCase() == 'USD'){
      currencyId = '1'
    }else{
      currencyId = '16'
    }
    this.http.get<any>(this.data.WEBSERVICE + '/fTrade/tradingFeesByCurrency?currencyId=' + currencyId, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        console.log('feeeeeeeeee', response);
        this.percentageValue = ((response.tradingFee + 0.1)/100);
       console.log('val fee',this.percentageValue)


      })


    

    

  }

  ngDoCheck() {
    //this.Themecolor = this.dash.Themecolor;

    this.selectedBuyingAssetText = this.data.selectedBuyingAssetText;
    this.selectedSellingAssetText = this.data.selectedSellingAssetText;
    /* setting up leverage bound dynamically */
    this.leverageMinLimit = localStorage.getItem('leverage_min_limit')
    this.leverageMaxLimit = localStorage.getItem('leverage_max_limit')
    this.crossRange = [];
    this.crossRange.push(this.leverageMinLimit + 'X')
    this.crossRange.push(this.leverageMaxLimit + 'X')
    //console.log('CROSS RANGE %%%%%%%',this.crossRange)
    if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
      this.selelectedSellingAssetBalance = this.data.selelectedSellingAssetBalance;
      this.selelectedBuyingAssetBalance = this.data.selelectedBuyingAssetBalance;

      // console.log('ggg',this.selelectedSellingAssetBalance);
      
      this.selectedContractBalance = this.data.selectedContractBalance;
    }
    if(this.selectedCrossRange.slice(0, -1) == 'null'){
      this.selectedCrossRange = localStorage.getItem('leverage_min_limit') + 'X'
      localStorage.setItem('selected_leverage',this.selectedCrossRange);
    }
    //console.log(' --------- in derivative stoploss compoenet ------------');
    //console.log(this.data.selectedBuyingAssetText,this.data.selectedSellingAssetText)
    this.asset = this.selectedSellingAssetText;
    if (this.asset === "USD") {
      this.valid = true;
    }
    else {
      this.valid = false;
    }
    if (this.data.orderbookPrice != 0) {
      this.limitPrice = this.data.orderbookPrice;
      //console.log(this.limitPrice)
    }
    setTimeout(() => {
      this.data.orderbookPrice = 0
    }, 5000);

    /* clearing up all field on asset changes */
    let isResetTheStoplossfieldForFutures = localStorage.getItem('isResetTheStoplossfieldForFutures')
    if (isResetTheStoplossfieldForFutures == 'true') {
      this.reset();
      this.tradep = localStorage.getItem('priceprc')
      localStorage.setItem('isResetTheStoplossfieldForFutures', 'false');
    }

    /* checking for buy sell pill tab data which is active */
    $('.nav-link').each(function (i, obj) {
      if ($(this).hasClass('active')) {
        let tabTitle = $(this).html();
        if (tabTitle.indexOf('Buy') != -1) {
          $(this).parent().parent().parent().removeClass('sell-pills')
          $(this).parent().parent().parent().addClass('buy-pills')
        } else if (tabTitle.indexOf('Sell') != -1) {
          $(this).parent().parent().parent().removeClass('buy-pills')
          $(this).parent().parent().parent().addClass('sell-pills')
        }
      }
    });



  }

  reset() {
    this.limitPrice = "";
    this.limitValue = "";
    this.limitPrice = "";
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
    this.stopLossQuantity = "";
    this.stopLossPrice = "";
    this.stopLossTriggerPrice = "";
    this.sliderValueBuy = 0;
    this.sliderValueSell = 0;
    this.sliderValueBuyLimit = 0;
    this.sliderValueSellLimit = 0;
    $('.form-range').val('0');document.getElementById('customRange3').classList.remove("changeBackgroundSlider");
    $(function () {
      //$('input.form-control').val('');
    })
    this.getUserTransaction();
  }

  sellReset() {
    this.limitPrice = "";
    this.limitValue = "";
    this.limitPrice = "";
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
    this.stopLossQuantity = "";
    this.stopLossPrice = "";
    this.stopLossTriggerPrice = "";
    //this.selelectedBuyingAssetBalance='0.0000';
    $(function () {
     // $('input.form-control').val('');
    })
    //this.renderAssetPriceForSell();
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
    this.sliderValueBuy = 0;
    this.sliderValueSell = 0;
    this.sliderValueBuyLimit = 0;
    this.sliderValueSellLimit = 0;
    $('.form-range').val('0');document.getElementById('customRange3').classList.remove("changeBackgroundSlider");
    if (val < 0 || val == "") {
      // var onlyBuyAmount:any=val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlyBuyAmount = '';
    } else {
      var onlyBuyAmount: any = val;
      this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&side=BID&amount=' + onlyBuyAmount)
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
         // console.log(error)
         if(error.status == '401'){
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
            // this.data.alert(error.message, 'warning');
        }
        });
    }
  }

  marginBuyVal(event) {
    var val = event.target.value;
    if (val < 0 || val == "") {
      // var onlyBuyAmount:any=val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlyBuyAmount = '';
    } else {
      var onlyBuyAmount: any = val;
      this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&side=BID&amount=' + onlyBuyAmount)
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
          // console.log(error)
          if(error.status == '401'){
            this.data.logout();
            this.data.alert('Session Timeout. Login Again', 'warning');
          }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
              // this.data.alert(error.message, 'warning');
          }
        });
    }
  }

  getSellVal(event) {
    var val = event.target.value;
    this.sliderValueBuy = 0;
    this.sliderValueSell = 0;
    this.sliderValueBuyLimit = 0;
    this.sliderValueSellLimit = 0;
    $('.form-range').val('0');document.getElementById('customRange3').classList.remove("changeBackgroundSlider");
    if (val < 0 || val == "") {
      // var onlyBuyAmount:any=val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlySellAmount = '';
    } else {
      var onlySellAmount: any = val;
      this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&side=ASK&amount=' + onlySellAmount)
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
            $('.onlyBuyError').hide();
            $('#msell').prop('disabled', false);
          } else {
            this.onlySellPrice = 0;
            this.onlySellTotalPrice = 0;
            $('.onlyBuyError').show();
            $('#msell').prop('disabled', true);
          }
        })
    }


  }
  marginSellVal(event) {
    var val = event.target.value;
    if (val < 0 || val == "") {
      // var onlyBuyAmount:any=val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlySellAmount = '';
    } else {
      var onlySellAmount: any = val;
      this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&side=ASK&amount=' + onlySellAmount)
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
            $('.onlyBuyError').hide();
            $('#msell').prop('disabled', false);
          } else {
            this.onlySellPrice = 0;
            this.onlySellTotalPrice = 0;
            $('.onlyBuyError').show();
            $('#msell').prop('disabled', true);
          }
        })
    }


  }

  async marketSell() {
    $('.onlyBuyBtn').prop('disabled', true);
      $('.onlySellBtn').prop('disabled', true);

    var a = await this.data.checkUserBlockStatus();
    if(a == true){

      this.data.alert('Loading...', 'dark');
      $('.onlyBuyBtn').prop('disabled', true);
      $('.onlySellBtn').prop('disabled', true);
      $('.load').fadeIn();
      $('#marketsell').attr('disabled', true);
      var onlyBuyAmount = this.onlySellAmount;
      // this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&side=ASK&amount=' + onlyBuyAmount)
      //   .subscribe(data => {
      //     var result = data;
      //     if (this.data.selectedSellingAssetText == 'usd') {
      //       this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
      //       this.onlySellPrice1 = parseFloat(result.price1);
      //     } else {
      //       this.onlySellPrice = (parseFloat(result.price)).toFixed(this.tradep);
      //       this.onlySellPrice1 = parseFloat(result.price1);
      //     }
      $('.onlyBuyError').hide();
      //$('#marketsell').prop('disabled', false);
      // var inputObj = {}
      // inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase(); //
      // inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase(); //change by sanu
      // inputObj['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
      // inputObj['userId'] = localStorage.getItem('user_id');
      // inputObj['price'] = this.onlySellPrice1;
      // inputObj['txn_type'] = '2';
      // inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
      // if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
      //   inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
      // }
      // var jsonString = JSON.stringify(inputObj);
      // this.http.post<any>(this.data.WEBSERVICE + '/fTrade/OfferPriceCheck', jsonString, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'authorization': 'BEARER ' + localStorage.getItem('access_token'),
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
      inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
      inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
      inputObj['amount'] = parseFloat(this.onlySellAmount);
      inputObj['price'] = parseFloat(this.onlySellPrice);
      inputObj["offerType"] = 'M';
      inputObj['txn_type'] = '2';
      inputObj['assetPair'] = localStorage.getItem("selected_derivative_asset_pair");
      inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
      if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
        inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
      }
      inputObj['uuid'] = localStorage.getItem('uuid')
      var jsonString = JSON.stringify(inputObj);
      // if ((this.onlySellPrice * this.onlySellAmount) >= .001) {
      this.http.post<any>(this.data.WEBSERVICE + '/fTrade/TradeCreateOffer', jsonString, {
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
            this.sellReset();
            this.reset();
            this.data.alert(result.error.error_msg, 'success');
            this.data.renderDataForMyTradeFutures();
            this.data.renderDataForMyOfferFutures();
            //this.ticker.handle24hrTickerManualy();
  
          }
          if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
            this.data.renderAvailableBalance(this.data.selectedSellingAssetText, localStorage.getItem('selected_leverage_margin_type'), localStorage.getItem('selected_leverage').slice(0, -1), 'futures')
          } else {
            this.getUserTransaction();
            //this.renderContractBalance()
          }
        });
      // } else {
      //   this.reset();
      //   this.data.loader = false;
      //   this.data.alert('Offer Value is lesser than permissible value', 'warning');
      //   $('.onlyBuyBtn').prop('disabled',false);
      //   $('.onlySellBtn').prop('disabled',false);
      // }
      //   }
      // });
  
      // else {
      //   this.onlySellPrice = 0;
      //   $('.onlySellError').show();
      //   $('#msell').prop('disabled', true);
      // }
      //});
    }
   
  }

  marginMarketSell() {
    this.data.alert('Loading...', 'dark');
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    $('.load').fadeIn();
    $('#marketsell').attr('disabled', true);
    var onlyBuyAmount = this.onlySellAmount;
    this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&side=ASK&amount=' + onlyBuyAmount)
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
        // var inputObj = {}
        // // inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase(); //
        // // inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase(); //change by sanu
        // inputObj['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
        // inputObj['userId'] = localStorage.getItem('user_id');
        // inputObj['price'] = this.onlySellPrice1;
        // inputObj['txn_type'] = '2';
        // inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
        // var jsonString = JSON.stringify(inputObj);
        // this.http.post<any>(this.data.WEBSERVICE + '/fTrade/OfferPriceCheck', jsonString, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        //   }
        // })
        //   .subscribe(response => {
        //     var result = response;
        //     if (result.error.error_data != '0') {
        //       if (result.error.error_data == 1)
        //         this.data.alert(result.error.error_msg, 'danger');
        //       else
        //         // $('#warn').click();
        //         $('.tradeBtn').attr('disabled', true);
        //     } else {

        var inputObj = {};
        inputObj['customerId'] = localStorage.getItem('user_id');
        inputObj['uuid'] = localStorage.getItem('uuid');

        inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
        inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
        inputObj['quantity'] = parseFloat(this.onlySellAmount);
        inputObj['price'] = parseFloat(this.onlySellPrice1);
        inputObj["offerType"] = 'M';
        inputObj['txnType'] = '2';
        inputObj['assetCode'] = localStorage.getItem('assetCode');
        inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
        if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
          inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
        }
        var jsonString = JSON.stringify(inputObj);
        if ((this.onlySellPrice * this.onlySellAmount) >= .001) {
          this.http.post<any>('http://13.52.20.196:8080/Margin' + '/trade/createOffer', jsonString, {
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
    var a = await this.data.checkUserBlockStatus();
if(a == true){

  this.data.alert('Loading...', 'dark');
  $('.onlyBuyBtn').prop('disabled', true);
  $('.onlySellBtn').prop('disabled', true);
  var onlyBuyAmount = this.onlyBuyAmount;
  // this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&side=BID&amount=' + onlyBuyAmount)
  //   .subscribe(data => {
  //     var result = data;
  //     if (this.data.selectedSellingAssetText == 'usd') {
  //       this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
  //       this.onlyBuyPrice1 = parseFloat(result.price1);
  //     } else {
  //       this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
  //       this.onlyBuyPrice1 = parseFloat(result.price1);
  //  }
  $('.onlyBuyError').hide();
  //$('#marketbuy').prop('disabled', false);
  //var inputObj = {}
  // inputObj['selling_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
  // inputObj['buying_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
  // inputObj['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
  // inputObj['userId'] = localStorage.getItem('user_id');
  // inputObj['price'] = this.onlyBuyPrice1;
  // inputObj['txn_type'] = '1';
  // inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
  // var jsonString = JSON.stringify(inputObj);
  // this.http.post<any>(this.data.WEBSERVICE + '/fTrade/OfferPriceCheck', jsonString, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'authorization': 'BEARER ' + localStorage.getItem('access_token'),
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
  inputObj['assetPair'] = localStorage.getItem("selected_derivative_asset_pair");
  inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
  if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
    inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
  }
  inputObj['uuid'] = localStorage.getItem('uuid')
  var jsonString = JSON.stringify(inputObj);
  //if ((this.onlyBuyPrice1 * this.onlyBuyAmount) >= .001) {
  this.http.post<any>(this.data.WEBSERVICE + '/fTrade/TradeCreateOffer', jsonString, {
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
        this.data.renderDataForMyTradeFutures();
        this.data.renderDataForMyOfferFutures();
        //this.ticker.handle24hrTickerManualy();

      }
      this.reset();
      if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
        this.data.renderAvailableBalance(this.data.selectedSellingAssetText, localStorage.getItem('selected_leverage_margin_type'), localStorage.getItem('selected_leverage').slice(0, -1), 'futures')
      } else {
        this.getUserTransaction();
        //this.renderContractBalance()
      }
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

  // })

}

  }
  marginMarketBuy() {
    this.data.alert('Loading...', 'dark');
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    var onlyBuyAmount = this.onlyBuyAmount;
    this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&side=ASK&amount=' + onlyBuyAmount)
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
        // var inputObj = {}
        // // inputObj['selling_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
        // // inputObj['buying_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
        // inputObj['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
        // inputObj['userId'] = localStorage.getItem('user_id');
        // inputObj['price'] = this.onlyBuyPrice1;
        // inputObj['txn_type'] = '1';
        // inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
        // var jsonString = JSON.stringify(inputObj);
        // this.http.post<any>(this.data.WEBSERVICE + '/fTrade/OfferPriceCheck', jsonString, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        //   }
        // })
        //   .subscribe(response => {
        //     var result = response;
        //     if (result.error.error_data != '0') {
        //       this.data.alert(result.error.error_msg, 'warning');
        //       $('.tradeBtn').attr('disabled', true);
        //     } else {
        var inputObj = {};
        // inputObj['customerId'] = localStorage.getItem('user_id');
        inputObj['uuid'] = localStorage.getItem('uuid');

        inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
        inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
        inputObj['quantity'] = parseFloat(this.onlyBuyAmount);
        inputObj['price'] = this.onlyBuyPrice1;
        inputObj["offerType"] = 'M';
        inputObj['txnType'] = '1';
        inputObj['assetCode'] = localStorage.getItem('assetCode');
        inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
        if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
          inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
        }
        var jsonString = JSON.stringify(inputObj);
        if ((this.onlyBuyPrice1 * this.onlyBuyAmount) >= .001) {
          this.http.post<any>('http://13.52.20.196:8080/Margin' + '/trade/createOffer', jsonString, {
            headers: {
              'Content-Type': 'application/json'
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

  async limitBuy() {
    $('.tradeBtn').attr('disabled', true);
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    var a = await this.data.checkUserBlockStatus();
    if(a == true){
      $('.tradeBtn').attr('disabled', true);
      $('.onlyBuyBtn').prop('disabled', true);
      $('.onlySellBtn').prop('disabled', true);
      this.data.alert('Loading...', 'dark', 30000);
      var inputObj = {}
      //inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
      //inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
      // inputObj['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
      // inputObj['userId'] = localStorage.getItem('user_id');
      // inputObj['price'] = this.limitPrice;
      // inputObj['txn_type'] = '1';
      // inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
      // var jsonString = JSON.stringify(inputObj);
      if ((this.limitPrice * this.limitAmount) > this.valLimit) {
        // this.http.post<any>(this.data.WEBSERVICE + '/fTrade/OfferPriceCheck', jsonString, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'authorization': 'BEARER ' + localStorage.getItem('access_token'),
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
          inputObj["offerType"] = 'L';
          inputObj['txn_type'] = '1';
          inputObj['assetPair'] = localStorage.getItem("selected_derivative_asset_pair");
          inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
          if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
            inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
          }
          inputObj['uuid'] = localStorage.getItem('uuid')
          var jsonString = JSON.stringify(inputObj);
          this.http.post<any>(this.data.WEBSERVICE + '/fTrade/TradeCreateOffer', jsonString, {
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
                this.data.renderDataForMyTradeFutures();
                this.data.renderDataForMyOfferFutures();
                this.limitPrice = 0;
                this.limitAmount = 0;
                //this.ticker.handle24hrTickerManualy();
                this.reset();
                $('#trade').click();
              }
              if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
                this.data.renderAvailableBalance(this.data.selectedSellingAssetText, localStorage.getItem('selected_leverage_margin_type'), localStorage.getItem('selected_leverage').slice(0, -1), 'futures')
              } else {
                this.getUserTransaction();
                //this.renderContractBalance()
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
        // });
      } else {
        this.limitAmount = this.limitPrice = this.limitValue = null;
        this.data.loader = false;
        this.data.alert('Your offer is too small', 'warning');
        $('.onlyBuyBtn').prop('disabled', false);
        $('.onlySellBtn').prop('disabled', false);
      }
    }
    
  }

  marginLimitBuy() {
    $('.tradeBtn').attr('disabled', true);
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    this.data.alert('Loading...', 'dark', 30000);
    // var inputObj = {}
    // //inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase();
    // //inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
    // inputObj['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
    // inputObj['userId'] = localStorage.getItem('user_id');
    // inputObj['price'] = this.limitPrice;
    // inputObj['txn_type'] = '1';
    // inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
    // var jsonString = JSON.stringify(inputObj);
    if ((this.limitPrice * this.limitAmount) > this.valLimit) {
      //   this.http.post<any>(this.data.WEBSERVICE + '/fTrade/OfferPriceCheck', jsonString, {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      //     }
      //   })
      //     .subscribe(response => {
      //       var result = response;
      //       if (result.error.error_data != '0') {
      //         this.data.alert(result.error.error_msg, 'warning');
      //         $('.tradeBtn').attr('disabled', true);
      //       } else {
      if (this.limitAmount != undefined && this.limitPrice != undefined) {
        var inputObj = {};
        // inputObj['customerId'] = localStorage.getItem('user_id');
        inputObj['uuid'] = localStorage.getItem('uuid');

        inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
        inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
        inputObj['quantity'] = this.limitAmount;
        inputObj['price'] = this.limitPrice;
        inputObj["offerType"] = 'L';
        inputObj['txnType'] = '1';
        inputObj['assetCode'] = localStorage.getItem('assetCode');
        inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
        if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
          inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
        }
        var jsonString = JSON.stringify(inputObj);
        this.http.post<any>('http://13.52.20.196:8080/Margin' + '/trade/createOffer', jsonString, {
          headers: {
            'Content-Type': 'application/json',
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
      // });
    } else {
      this.limitAmount = this.limitPrice = this.limitValue = null;
      this.data.loader = false;
      this.data.alert('Your offer is too small', 'warning');
      $('.onlyBuyBtn').prop('disabled', false);
      $('.onlySellBtn').prop('disabled', false);
    }
  }

  async limitSell() {
    $('.tradeBtn').attr('disabled', true);
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    var a = await this.data.checkUserBlockStatus();
    if(a == true){

      $('.tradeBtn').attr('disabled', true);
      $('.onlyBuyBtn').prop('disabled', true);
      $('.onlySellBtn').prop('disabled', true);
      this.data.alert('Loading...', 'dark', 30000);
      if (this.limitPriceSell != undefined && this.limitAmountSell != undefined) {
        //var inputObj = {}
        //inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase(); 
        //inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
        // inputObj['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
        // inputObj['userId'] = localStorage.getItem('user_id');
        // inputObj['price'] = this.limitPrice;
        // inputObj['txn_type'] = '2';
        // inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
        // var jsonString = JSON.stringify(inputObj);
        if ((this.limitPriceSell * this.limitAmountSell) > this.valLimit) {
          // this.http.post<any>(this.data.WEBSERVICE + '/fTrade/OfferPriceCheck', jsonString, {
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'authorization': 'BEARER ' + localStorage.getItem('access_token'),
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
          inputObj["offerType"] = 'L';
          inputObj['txn_type'] = '2';
          inputObj['assetPair'] = localStorage.getItem("selected_derivative_asset_pair");
          inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
          if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
            inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
          }
          inputObj['uuid'] = localStorage.getItem('uuid')
          var jsonString = JSON.stringify(inputObj);
          this.http.post<any>(this.data.WEBSERVICE + '/fTrade/TradeCreateOffer', jsonString, {
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
                this.data.renderDataForMyTradeFutures();
                this.data.renderDataForMyOfferFutures();
                //this.ticker.handle24hrTickerManualy();
                this.limitAmountSell = 0;
                this.limitPriceSell = 0;
                this.reset();
                this.sellReset();
                $('#trade').click();
              }
              if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
                this.data.renderAvailableBalance(this.data.selectedSellingAssetText, localStorage.getItem('selected_leverage_margin_type'), localStorage.getItem('selected_leverage').slice(0, -1), 'futures')
              } else {
                this.getUserTransaction();
                //this.renderContractBalance()
              }
            });
          //}
          this.limitAmountSell = this.limitPriceSell = this.limitValueSell = null;
  
          //});
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

    }
  
  }

  marginLimitSell() {
    $('.tradeBtn').attr('disabled', true);
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    this.data.alert('Loading...', 'dark', 30000);
    if (this.limitPrice != undefined && this.limitAmount != undefined) {
      // var inputObj = {}
      // //inputObj['selling_asset_code'] = (this.data.selectedBuyingAssetText).toUpperCase(); 
      // //inputObj['buying_asset_code'] = (this.data.selectedSellingAssetText).toUpperCase();
      // inputObj['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
      // inputObj['userId'] = localStorage.getItem('user_id');
      // inputObj['price'] = this.limitPrice;
      // inputObj['txn_type'] = '2';
      // inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
      // var jsonString = JSON.stringify(inputObj);
      if ((this.limitPrice * this.limitAmount) > this.valLimit) {
        //   this.http.post<any>(this.data.WEBSERVICE + '/fTrade/OfferPriceCheck', jsonString, {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        //     }
        //   })
        //     .subscribe(response => {
        //       var result = response;
        //       if (result.error.error_data != '0') {
        //         if (result.error.error_data == 1)
        //           this.data.alert(result.error.error_msg, 'danger');
        //         else
        //           $('#warn').click();
        //         $('.tradeBtn').attr('disabled', true);
        //       } else {
        var inputObj = {};
        // inputObj['customerId'] = localStorage.getItem('user_id');
        inputObj['uuid'] = localStorage.getItem('uuid');

        inputObj['selling_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
        inputObj['buying_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
        inputObj['quantity'] = this.limitAmount;
        inputObj['price'] = this.limitPrice;
        inputObj["offerType"] = 'L';
        inputObj['txnType'] = '2';
        inputObj['assetCode'] = localStorage.getItem('assetCode');
        inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
        if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
          inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');
        }
        var jsonString = JSON.stringify(inputObj);
        this.http.post<any>('http://13.52.20.196:8080/Margin' + '/trade/createOffer', jsonString, {
          headers: {
            'Content-Type': 'application/json'
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
          });
        // }
        this.limitAmount = this.limitPrice = this.limitValue = null;

        // });
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
    var userTransObj = {};
    userTransObj['customerId'] = localStorage.getItem('user_id');
    userTransObj['uuid'] = localStorage.getItem('uuid')
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
          // this.stpLoader = false;
          this.stpLoader = false


        }
        else {
          this.selectedCryptoCurrency = localStorage.getItem('selected_currency');
          localStorage.getItem("selling_crypto_asset");
          localStorage.getItem("buying_crypto_asset");
          for (var i = 0; i <= this.balencelist.length - 1; i++) {
            if (this.balencelist[i].currencyCode == localStorage.getItem("buying_crypto_asset").toUpperCase()) {
              this.selelectedBuyingAssetBalance = this.balencelist[i].closingBalance.toFixed(4);

            }
            if (this.balencelist[i].currencyCode == localStorage.getItem("selling_crypto_asset").toUpperCase()) {
              this.selelectedSellingAssetBalance = this.balencelist[i].closingBalance.toFixed(4);
              // console.log('assetBalance', this.selelectedSellingAssetBalance);
              
            }
          }
          // this.stpLoader = false;
          this.stpLoader = false


        }

      }, error => {
        // console.log(error)
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
            inputObj['uuid'] = localStorage.getItem('uuid');
            inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
            inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
            inputObj['stop_loss_price'] = this.stopLossPrice;
            inputObj['trigger_price'] = this.stopLossTriggerPrice;
            inputObj['quantity'] = this.stopLossQuantity;
            inputObj['txn_type'] = '1';

            //inputObj['offerType'] = '1';
            inputObj['assetPair'] = localStorage.getItem("selected_derivative_asset_pair");
            if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
            inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');

            }

            inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
            
            var jsonString = JSON.stringify(inputObj);
            this.http.post<any>(this.data.WEBSERVICE + '/fTrade/StopLossBuySellTrade', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
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
          inputObj['uuid'] = localStorage.getItem('uuid');
            inputObj['selling_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
            inputObj['buying_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
            inputObj['stop_loss_price'] = this.stopLossPriceSell;
            inputObj['trigger_price'] = this.stopLossTriggerPriceSell;
            inputObj['quantity'] = this.stopLossQuantitySell;
            inputObj['txn_type'] = '2';

           // inputObj['offerType'] = '1';
            inputObj['assetPair'] = localStorage.getItem("selected_derivative_asset_pair");
            if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
            inputObj['marginType'] = localStorage.getItem('selected_leverage_margin_type');

            }

            inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);

          var jsonString = JSON.stringify(inputObj);
          this.http.post<any>(this.data.WEBSERVICE + '/fTrade/StopLossBuySellTrade', jsonString, {
            headers: {
              'Content-Type': 'application/json',
              'authorization': 'BEARER ' + localStorage.getItem('access_token'),
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
    this.mywallet.getCurrencyForSend(content, val, '', '','NA');
  }

  resetSlider(){
    this.sliderValueBuy = 0;
      this.sliderValueSell = 0;
      this.sliderValueBuyLimit = 0;
      this.sliderValueSellLimit = 0;
      $('.form-range').val('0');document.getElementById('customRange3').classList.remove("changeBackgroundSlider");
  }

  validateLimit() {
    var lv: number = 0.000001;
    if (this.limitAmount <= 0.0001) {
      $('.onlyBuyError2').show();
      $('#mbuy').prop('disabled', true);
      $('#msell').prop('disabled', true);
    }
    else {
      $('.onlyBuyError2').hide();
      $('#mbuy').prop('disabled', false);
      $('#msell').prop('disabled', false);
    }
    return 0.0001 >= this.limitAmount || 0.00000001 >= this.limitPrice;
  }

  validateLimitSell() {
    var lv: number = 0.000001;
    if (this.limitAmountSell <= 0.0001) {
      $('.onlyBuyError5').show();
      // $('#mbuy').prop('disabled', true);
      $('#msellLimit').prop('disabled', true);
    }
    else {
      $('.onlyBuyError5').hide();
      // $('#mbuy').prop('disabled', false);
      $('#msellLimit').prop('disabled', false);
    }
    return 0.0001 >= this.limitAmountSell || 0.00000001 >= this.limitPriceSell;
  }

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

  

  /*** Method defination for rendering sell price of asset ****/
  renderAssetPriceForSell = () => {
    this.http.get<any>(this.data.WEBSERVICE + '/fTrade/userFuturesBalanceByAsset?uuid=' + localStorage.getItem('uuid') + '&currencyId=' + localStorage.getItem('currencyId') + '&assetPair=' + localStorage.getItem('selected_derivative_asset_pair'), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        if (response.statusCode != 0) {
          // this.data.alert(response.message, 'danger')
          //this.selelectedBuyingAssetBalance = '0'
          this.selectedContractBalance = '0'
        } else {
          //this.selelectedBuyingAssetBalance = response.balance;
          this.selectedContractBalance = response.balance;
        }
      })
  }
  /* method defination for opening leverage cross modal */
  handleOpenCrossModal = (modal) => {
    this.selectedAssetForLeverage = localStorage.getItem('selected_derivative_asset_pair_name')
    this.modalService.open(modal, { centered: true });
  }
  /* method defination for opening leverage cross modal */
  handleOpenXModal = (modal) => {
    //alert(this.selectedRangeSliderValue)
    if(localStorage.getItem('selected_leverage') == undefined || localStorage.getItem('selected_leverage') == null || localStorage.getItem('selected_leverage').slice(0, -1) == 'null'){
      this.selectedCrossRange = this.leverageMinLimit + 'X'
      this.selectedRangeSliderInputValue = parseInt(this.leverageMinLimit)
      this.selectedRangeSliderValue = parseInt(this.leverageMinLimit)
      localStorage.setItem('selected_leverage',this.selectedCrossRange)
    }else{
      this.selectedCrossRange = localStorage.getItem('selected_leverage')
      this.selectedRangeSliderInputValue = parseInt(localStorage.getItem('selected_leverage').slice(0,-1))
      this.selectedRangeSliderValue = parseInt(localStorage.getItem('selected_leverage').slice(0,-1))
    }

    
    this.selectSliderRange(parseInt(this.selectedRangeSliderValue))
    this.selectedRangeSliderInputValue = this.selectedRangeSliderValue;
    this.baseLeverage = this.selectedCrossRange;
    this.baseRangeLeverage = this.selectedRangeSliderValue;
    this.baseInputLeverage = this.selectedRangeSliderInputValue;
    this.modalService.open(modal, { centered: true });
  }
  /* Method defination for selecting margin type for leverage */
  handleSelectLeverageMarginType = (param) => {
    this.selectedLeverageMarginType = param;
    localStorage.setItem('selected_leverage_margin_type', this.selectedLeverageMarginType)
    if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
      this.data.renderAvailableBalance(this.data.selectedSellingAssetText, localStorage.getItem('selected_leverage_margin_type'), localStorage.getItem('selected_leverage').slice(0, -1), 'futures')
    } else {
      this.getUserTransaction();
      //this.renderContractBalance()

    }
  }

  /* Method defination for toggling range for cross */
  toggleCrossRange = (param) => {
    let crossRange = this.crossRange;
    let start = parseInt(crossRange[0].slice(0, -1));
    let end = parseInt(crossRange[crossRange.length - 1].slice(0, -1));
    let currentLeverage = parseInt(this.baseLeverage.slice(0, -1));

    //alert(start+'  '+end+' '+currentLeverage)
    if (param == 0 && currentLeverage < end) {
      this.baseLeverage = (currentLeverage + 1) + 'X'
      this.baseRangeLeverage = (currentLeverage + 1);
      this.baseInputLeverage = (currentLeverage + 1);
    }
    if (param == -1 && currentLeverage > start) {
      this.baseLeverage = (currentLeverage - 1) + 'X'
      this.baseRangeLeverage = (currentLeverage - 1);
      this.baseInputLeverage = (currentLeverage - 1);
    }
    //localStorage.setItem('selected_leverage', this.selectedCrossRange)
    this.selectSliderRange(this.baseRangeLeverage)
  }
  /* Method defination for getting range slider value */
  handleRangeSliderValue = (param) => {
    param = parseInt(param)
    this.baseLeverage = param + 'X'
    this.baseRangeLeverage = param
    this.baseInputLeverage = param
    //localStorage.setItem('selected_leverage', this.selectedCrossRange)
    this.selectSliderRange(param)
  }
  /* Method defination for getting leverage value by input field */
  handleRangeSliderByInput = (e) => {
    console.log(this.baseInputLeverage)
    let param = this.baseInputLeverage
    console.log(param)
    let crossRange = this.crossRange;
    let start = parseInt(crossRange[0].slice(0, -1));
    let end = parseInt(crossRange[crossRange.length - 1].slice(0, -1));
    console.log('Start ',start,' End',end);
    if (param >= start && param <= end) {
      param = parseInt(param)
      this.baseLeverage = param + 'X'
      this.baseRangeLeverage = param
      this.baseInputLeverage = param
      //localStorage.setItem('selected_leverage', this.selectedCrossRange)
      this.selectSliderRange(param)
    } else {
      this.selectedRangeSliderInputValue = start;
      e = start
      this.data.alert('Please provide a valid input', 'danger');
    }
  }
  /*Method for select data from range slider */
  selectSliderRange(param) {
    let crossRange = this.crossRange;
    let rangeV = document.getElementById('rangeV');
    let newValue = Number((parseInt(this.baseRangeLeverage) - parseInt(crossRange[0].slice(0, -1))) * 100 / (parseInt(crossRange[crossRange.length - 1].slice(0, -1)) - parseInt(crossRange[0].slice(0, -1))));
    let newPosition = 10 - (newValue * 0.2);
    /* if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
      this.data.renderAvailableBalance(this.data.selectedSellingAssetText, localStorage.getItem('selected_leverage_margin_type'), localStorage.getItem('selected_leverage').slice(0, -1),'futures')
    } else {
      this.getUserTransaction();
      //this.renderContractBalance()
    } */
    //let newPosition = 10 - ((this.selectedRangeSliderValue * 2);
    /* let left  = '0';
    if(this.selectedRangeSliderValue < 68){
      left = `calc(${parseInt(this.selectedRangeSliderValue) + 4}% + (${newPosition}px))`
    }else if(this.selectedRangeSliderValue > 68 && this.selectedRangeSliderValue < 100){
      left = `calc(${parseInt(this.selectedRangeSliderValue) -5}% + (${newPosition}px))`
    }else{
      left = `calc(${parseInt(this.selectedRangeSliderValue) -6}% + (${newPosition}px))`
    } */

    let left = `calc(${newValue}% + (${newPosition}px))`
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
  }

  /* handle confirm button */
  handleConfirmBtn = () => {
    //alert(this.baseLeverage + ' ' +this.baseRangeLeverage + ' ' +  this.baseInputLeverage)
    this.selectedCrossRange = this.baseLeverage;
    this.selectedRangeSliderValue = this.baseRangeLeverage;
    this.selectedRangeSliderInputValue = this.baseInputLeverage;
    localStorage.setItem('selected_leverage', this.selectedCrossRange)
    if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
      this.data.renderAvailableBalance(this.data.selectedSellingAssetText, localStorage.getItem('selected_leverage_margin_type'), localStorage.getItem('selected_leverage').slice(0, -1), 'futures')
    } else {
      this.getUserTransaction();
      //this.renderContractBalance()
    }
  }

  /* handle togglinging of css for light mode & dark mode */
  toggleTheme = () => {
    if (this.Themecolor == 'Dark') {
      $('.buy-pills .nav-item a.nav-link').css({ "background": "0 0", "padding": "0 1px", "border": "none" });
      $('.buy-pills .nav-item a.nav-link.active').css({ "background": "0 0", "border": "1px solid #fff", "padding": "0 1px" });
    } else {
      $('.buy-pills .nav-item a.nav-link').css({ "background": "0 0", "padding": "0 1px", "border": "none", "color": "#000" });
      $('.buy-pills .nav-item a.nav-link.active').css({ "background": "0 0", "border": "1px solid #000", "padding": "0 1px", "color": "#000" });
    }
  }

  /* method defination for showing contract balance in sell section  */
  renderContractBalance = () => {
    let selectedAssetPair = localStorage.getItem('selected_derivative_asset_pair')
    let walletType = 'Perpetual'
    this.http.get<any>(this.data.WEBSERVICE + '/fTrade/userFuturesBalance?uuid=' + localStorage.getItem('uuid') + '&walletType=' + walletType, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        if (result.statusCode === 0) {
          let balance = result.userFuturesBalanceList;
          for (let i = 0; i < balance.length; i++) {
            if (selectedAssetPair == balance[i].assetPair) {
              this.selectedContractBalance = balance[i].currentBalance;
              break;
            }
          }
        } else {
          this.data.alert(result.message, 'danger');
        }
      })
  }


  /* Method defination for showing order type dropdown */
  handleShowOrderTypeDropdown = (param) => {
    this.selectedOrderType = 'GTC';
    this.disclosedQuantity = null;
    this.limitAmountForOco = null;
    this.limitTotalForOco = null;
    this.limitPriceForOco = null;
    if (param.toLowerCase() == 'limit') {
      this.showOrderTypeDropdown = true
    } else {
      this.showOrderTypeDropdown = false;
    }
  }
  makeClassToggle(status) {
    // console.log('button clicked');
    this.buySellPillsClassStatus = status;


  }

  getBuySliderVal(e){

    this.stpLoader = true


    var balance;
    if(e.target.value == 0){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuy = 0;
    }
    if(e.target.value == 1){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuy = 25;
    }
    if(e.target.value == 2){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuy = 50;
    }
    if(e.target.value == 3){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuy = 75;
    }
    if(e.target.value == 4){
      document.getElementById('customRange3').classList.add("changeBackgroundSlider");

      this.sliderValueBuy = 100;
    }

    console.log('slide sliderValue', this.sliderValueBuy);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));

   


    let sliderValue = this.sliderValueBuy 
    let ltp =  this.data.ltpdata
    this.newBuybalance =parseFloat(this.selelectedSellingAssetBalance);

    this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/depth?symbol='+localStorage.getItem('selected_derivative_asset_pair')+'&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {

       console.log('askme', data.ask[0].price);
       
      //  this.onlyBuyAmount = (((this.newBuybalance * (sliderValue/100)) / parseFloat(data.ask[0].price))*this.percentageValue).toFixed(this.tradep)
      // console.log('ask me cal price',this.onlyBuyAmount)
      //   this.getBuyValSlider(this.onlyBuyAmount)
      //   this.validatemarketbuy()


      //this.onlyBuyAmount = (((this.newBuybalance * (sliderValue/100)) / parseFloat(data.ask[0].price))*this.percentageValue).toFixed(this.tradep)
      //this.onlyBuyAmount = (((this.newBuybalance * (sliderValue/100)) - ((this.newBuybalance * (sliderValue/100)) *this.percentageValue))/parseFloat(data.ask[0].price)).toFixed(this.tradep)
      // Amount = (((MWB * Slider %) - ((MWB * L * Slider %) * (TF + 0.1)%)) * L) / MP
     // Here, MWB - Margin Wallet Balance, TF - Trading Fees,L - Leverage, MP - Market Price
     //console.log('RAW DATA = > ',this.data.selelectedMarginWalletBalance,sliderValue/100,this.percentageValue,localStorage.getItem('selected_leverage').slice(0, -1),data.ask[0].price);
      let mwb = parseFloat(this.data.selelectedMarginWalletBalance);
      let leverage = parseFloat(localStorage.getItem('selected_leverage').slice(0, -1));
      let marketPrice = parseFloat(data.ask[0].price)
      /* console.log(mwb,sliderValue,leverage,this.percentageValue,marketPrice);
      console.log((mwb * (sliderValue/100)));
      console.log(((mwb * leverage * (sliderValue/100))*this.percentageValue));
      console.log(((mwb * (sliderValue/100)) - ((mwb * leverage * (sliderValue/100))*this.percentageValue)));
      console.log((((mwb * (sliderValue/100)) - ((mwb * leverage * (sliderValue/100))*this.percentageValue)) * leverage));
      console.log(((((mwb * (sliderValue/100)) - ((mwb * leverage * (sliderValue/100))*this.percentageValue)) * leverage) / marketPrice)) */
     this.onlyBuyAmount = ((((mwb * (sliderValue/100)) - ((mwb * leverage * (sliderValue/100))*this.percentageValue)) * leverage) / marketPrice).toFixed(this.tradep)

      this.getBuyValSlider(this.onlyBuyAmount)
      this.validatemarketbuy()



    })



    

    console.log('slide newBuybalance', this.newBuybalance);
    console.log('slide onlyBuyAmount', this.onlyBuyAmount);

    

  }

  getBuyValSlider(data) {
    
    var val = data;
    if (val < 0 || val == "") {
      if(val == 0){
            this.onlyBuyPrice = 0;
            this.onlyBuyTotalPrice = 0;
          }
      // var onlyBuyAmount:any=val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlyBuyAmount = '';
    } else {
      var onlyBuyAmount: any = val;
      this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&side=BID&amount=' + onlyBuyAmount)
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
          // console.log(error)
          if(error.status == '401'){
            this.data.logout();
            this.data.alert('Session Timeout. Login Again', 'warning');
          }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
              // this.data.alert(error.message, 'warning');
          }
        });
    }

    this.stpLoader = false

  }

  getSellSliderVal(e){
    this.stpLoader = true

    if(e.target.value == 0){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSell = 0;
      
    }
    if(e.target.value == 1){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSell = 25;
    }
    if(e.target.value == 2){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSell = 50;
    }
    if(e.target.value == 3){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSell = 75;
    }
    if(e.target.value == 4){
      document.getElementById('customRange3').classList.add("changeBackgroundSlider");

      this.sliderValueSell = 100;
    }
    console.log('slide sliderValue', this.sliderValueSell);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));

   


    let sliderValue = this.sliderValueSell 
    let ltp =  this.data.ltpdata
    this.newBuybalance = parseFloat(this.selelectedSellingAssetBalance);

    // this.onlySellAmount = (this.newBuybalance * (sliderValue/100))


//     let balance = this.selelectedBuyingAssetBalance
// this.onlySellPrice = (balance * sliderValue%)

    
    console.log('SELL SLIDER' ,'BALANCE => ' + parseFloat(this.selelectedBuyingAssetBalance),'SLIDER VALUE => ' + sliderValue/100, (parseFloat(this.selelectedBuyingAssetBalance) * (sliderValue / 100)))
    console.log('SELL SLIDER' ,'LTP => ' + parseFloat(this.data.ltpdata), (parseFloat(this.selelectedBuyingAssetBalance) * (sliderValue / 100))/ parseFloat(this.data.ltpdata))

    console.log('slide newBuybalance kk', this.newBuybalance);
    console.log('SELL SLIDER onlySellAmount', this.onlySellAmount);


    this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/depth?symbol='+localStorage.getItem('selected_derivative_asset_pair')+'&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {

       console.log('askme', data.bid[0].price);
      //this.onlySellAmount = (((this.newBuybalance / parseFloat(data.bid[0].price))*(sliderValue/100))*this.percentageValue).toFixed(this.tradep)
      let mwb = parseFloat(this.data.selelectedMarginWalletBalance);
      let leverage = parseFloat(localStorage.getItem('selected_leverage').slice(0, -1));
      let marketPrice = parseFloat(data.bid[0].price)
     this.onlySellAmount = ((((mwb * (sliderValue/100)) - ((mwb * leverage * (sliderValue/100))*this.percentageValue)) * leverage) / marketPrice).toFixed(this.tradep)
      
      this.getSellValSlider(this.onlySellAmount)
      this.validatemarketsell()
      })


    
    

  }

  getSellValSlider(data) {

    var val = data;
    if (val < 0 || val == "") {
      if(val == 0){
            this.onlySellPrice = 0;
            this.onlySellTotalPrice = 0;
          }
      // var onlyBuyAmount:any=val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlySellAmount = '';
    } else {
      var onlySellAmount: any = val;
      this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&side=ASK&amount=' + onlySellAmount)
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
  getBuySliderValLimit(e){
    this.stpLoader = true

    var balance;
    if(e.target.value == 0){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyLimit = 0;
    }
    if(e.target.value == 1){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyLimit = 25;
    }
    if(e.target.value == 2){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyLimit = 50;
    }
    if(e.target.value == 3){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueBuyLimit = 75;
    }
    if(e.target.value == 4){
      document.getElementById('customRange3').classList.add("changeBackgroundSlider");

      this.sliderValueBuyLimit = 100;
    }

    console.log('slide sliderValue', this.sliderValueBuyLimit);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));

   


    let sliderValue = this.sliderValueBuyLimit 
    
    let ltp =  this.data.ltpdata
    this.newBuybalanceLimit =parseFloat(this.selelectedSellingAssetBalance);

    
    
    this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/depth?symbol='+localStorage.getItem('selected_derivative_asset_pair')+'&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {

       console.log('askme', data.ask[0].price);
       //this.limitAmount = (((this.newBuybalanceLimit * (sliderValue/100)) / parseFloat(data.ask[0].price))*this.percentageValue).toFixed(this.tradep)

      // this.limitAmount = (((this.newBuybalanceLimit * (sliderValue/100)) - ((this.newBuybalanceLimit * (sliderValue/100)) *this.percentageValue))/parseFloat(data.ask[0].price)).toFixed(this.tradep)
       let mwb = parseFloat(this.data.selelectedMarginWalletBalance);
      let leverage = parseFloat(localStorage.getItem('selected_leverage').slice(0, -1));
      let marketPrice = parseFloat(data.ask[0].price)
     this.limitAmount = ((((mwb * (sliderValue/100)) - ((mwb * (sliderValue/100))*this.percentageValue)) * leverage) / marketPrice).toFixed(this.tradep)

      
       if(this.sliderValueBuyLimit == 0){
        this.limitPrice = 0;
      }
      else{
        this.limitPrice = (parseFloat(data.ask[0].price) - (parseFloat(data.ask[0].price) * 0.01)).toFixed(this.tradep);
  
      }
      this.limitValue = (this.limitAmount * this.limitPrice).toFixed(this.tradep);
      this.validateLimit()
      })


    
    

    console.log('slide newBuybalance', this.newBuybalance);
    console.log('slide onlyBuyAmount', this.limitAmount);

    this.stpLoader = false
    

  }

  getSellSliderValLimit(e){
    this.stpLoader = true

    var balance;
    if(e.target.value == 0){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSellLimit = 0;
    }
    if(e.target.value == 1){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSellLimit = 25;
    }
    if(e.target.value == 2){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSellLimit = 50;
    }
    if(e.target.value == 3){
      document.getElementById('customRange3').classList.remove("changeBackgroundSlider");

      this.sliderValueSellLimit = 75;
    }
    if(e.target.value == 4){
      document.getElementById('customRange3').classList.add("changeBackgroundSlider");

      this.sliderValueSellLimit = 100;
    }

    console.log('slide sliderValue', this.sliderValueSellLimit);
    console.log('slide ltp', this.data.ltpdata);
    console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
    console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));

   


    let sliderValue = this.sliderValueSellLimit 
    let ltp =  this.data.ltpdata

  

    this.newBuybalanceLimit =parseFloat(this.selectedContractBalance);

    this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/depth?symbol='+localStorage.getItem('selected_derivative_asset_pair')+'&limit=1', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {

       console.log('askme', data.bid[0].price);
    //this.limitAmount = (((this.newBuybalanceLimit / parseFloat(data.bid[0].price))*(sliderValue/100))*this.percentageValue).toFixed(this.tradep)
    let mwb = parseFloat(this.data.selelectedMarginWalletBalance);
    let leverage = parseFloat(localStorage.getItem('selected_leverage').slice(0, -1));
    let marketPrice = parseFloat(data.bid[0].price)
   this.limitAmountSell = ((((mwb * (sliderValue/100)) - ((mwb * leverage * (sliderValue/100))*this.percentageValue)) * leverage) / marketPrice).toFixed(this.tradep)
      
    if(this.sliderValueSellLimit == 0){
      this.limitPrice = 0;
    }
    else{
      this.limitPriceSell = (parseFloat(data.bid[0].price) + (parseFloat(data.bid[0].price) * 0.01)).toFixed(this.tradep);

    }
    this.limitValueSell = (this.limitAmountSell * this.limitPriceSell).toFixed(this.tradep);
    this.validateLimitSell()
    console.log('slide selectedContractBalance', this.selectedContractBalance);
    console.log('slide onlyBuyAmount', this.limitAmountSell);
      })




      this.stpLoader = false
    
   

    

  }


    /* Method defination for getting amount from total price for both buy and sell*/
    handleAmountFromTotalPrice = (e,type) => {
      let inputValue  = e.target.value;
      let deductionPercentage = parseFloat(this.percentageValue);
      let balance = parseFloat(this.selelectedSellingAssetBalance);
          $('.form-range').val('0');document.getElementById('customRange3').classList.remove("changeBackgroundSlider");;
      this.sliderValueBuy = 0;
      this.sliderValueSell = 0;
      this.sliderValueBuyLimit = 0;
      this.sliderValueSellLimit = 0;
  
      if(inputValue != ''){
        if(parseFloat(inputValue)<=balance){
          this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/depth?symbol='+localStorage.getItem('selected_derivative_asset_pair')+'&limit=1', {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      }).subscribe(data => {
  
         //console.log('askme', data.ask[0].price);
         if(type == 'buy'){
          this.onlyBuyPrice = parseFloat(data.ask[0].price).toFixed(this.tradep)
          //this.onlyBuyAmount = ((parseFloat(inputValue)/parseFloat(data.bid[0].price))*deductionPercentage).toFixed(this.tradep)
          this.onlyBuyAmount = ((parseFloat(inputValue)/parseFloat(data.ask[0].price))).toFixed(this.tradep)
          console.log('CONDITION => ',parseFloat(this.onlyBuyAmount)>0.0001)
          if(parseFloat(this.onlyBuyAmount)>0.0001){
  
            $('.onlyBuyBtn').prop('disabled', false);
          }else{
  
            $('.onlyBuyBtn').prop('disabled', true);
          }
        }else{
          this.onlySellPrice = parseFloat(data.bid[0].price).toFixed(this.tradep)
          //this.onlySellAmount = ((parseFloat(inputValue)/parseFloat(data.ask[0].price))*deductionPercentage).toFixed(this.tradep)
          this.onlySellAmount = ((parseFloat(inputValue)/parseFloat(data.bid[0].price))).toFixed(this.tradep)
          if(parseFloat(this.onlySellAmount)>0.0001){
  
            $('.onlySellBtn').prop('disabled', false);
          }else{
  
            $('.onlySellBtn').prop('disabled', true);
          }
        }
         
        
      })
          
        }else{
          $('.onlyBuyBtn').prop('disabled', true);
          $('.onlySellBtn').prop('disabled', true);
          this.data.alert('Total Price is exceeding your current balance','danger')
        }
      }else{
          this.onlyBuyAmount = this.onlyBuyPrice = ''
          $('.onlyBuyBtn').prop('disabled', true);
          this.onlySellAmount = this.onlySellPrice = ''
          $('.onlySellBtn').prop('disabled', true);
      }
    }
    calculateAmountFromLimitForLimit = (type) => {
      //if(this.limitValue != ''){
        if(type == 'buy'){
          // this.limitAmount = (parseFloat(this.limitValue)/parseFloat(this.limitPrice)).toFixed(this.tradep)
        this.limitValue = (parseFloat(this.limitAmount)*parseFloat(this.limitPrice)).toFixed(this.tradep);

        }else{
          this.limitValueSell = (parseFloat(this.limitPriceSell)*parseFloat(this.limitAmountSell)).toFixed(this.tradep)
        // this.limitValue = (parseFloat(this.limitPrice)*parseFloat(this.limitAmount)).toFixed(this.tradep)

        }
        if(isNaN(this.limitAmount)){
          this.limitAmount = ''
        }
        if(isNaN(this.limitAmountSell)){
          this.limitAmountSell = ''
        }
      //}
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
    calculateAmountFromTotalForLimit = (type,e)=>{
      let inputValue = e.target.value;
      this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ '/depth?symbol=' + localStorage.getItem('selected_derivative_asset_pair') + '&limit=1', {
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
          //$('.onlySellBtn').prop('disabled', true);
  
        }else if(parseFloat(this.limitAmount)>0.0001){
          if(type == 'buy'){
            $('.onlyBuyBtn').prop('disabled', false);
          }else{
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
        document.getElementById('customRange4').classList.remove("changeBackgroundSlider");
  
        this.sliderValueSellStopLimit = 0;
      }
      if (e.target.value == 1) {
        document.getElementById('customRange4').classList.remove("changeBackgroundSlider");
  
        this.sliderValueSellStopLimit = 25;
      }
      if (e.target.value == 2) {
        document.getElementById('customRange4').classList.remove("changeBackgroundSlider");
  
        this.sliderValueSellStopLimit = 50;
      }
      if (e.target.value == 3) {
        document.getElementById('customRange4').classList.remove("changeBackgroundSlider");
  
        this.sliderValueSellStopLimit = 75;
      }
      if (e.target.value == 4) {
        document.getElementById('customRange4').classList.add("changeBackgroundSlider");
  
        this.sliderValueSellStopLimit = 100;
      }
  
      console.log('slide sliderValue', this.sliderValueSellStopLimit);
      console.log('slide ltp', this.data.ltpdata);
      console.log('slide selelectedSellingAssetBalance', parseFloat(this.selelectedSellingAssetBalance));
      console.log('slide selelectedBuyingAssetBalance', parseFloat(this.selelectedBuyingAssetBalance));
  
  
  
  
      // let sliderValue = this.sliderValueSellStopLimit
      // let ltp = this.data.ltpdata
      // this.newBuybalanceLimit = parseFloat(this.selelectedBuyingAssetBalance);
      // this.stopLossPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata)*0.02)).toFixed(this.tradep);
      //   this.stopLossQuantitySell = ((this.newBuybalanceLimit * (sliderValue / 100)));
      //   this.stopLossTriggerPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata)*0.01)).toFixed(this.tradep);
      // this.stopLossTotalSell = (parseFloat(this.stopLossPriceSell) * parseFloat(this.stopLossQuantitySell)).toFixed(this.tradep)
  


      // let sliderValue = this.sliderValueSellStopLimit
      // let ltp = this.data.ltpdata
      // this.newBuybalanceLimit = parseFloat(this.selelectedSellingAssetBalance);
  
  
        
      //   this.stopLossPriceSell = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata)*0.02)).toFixed(this.tradep);
      //   this.stopLossTriggerPriceSell = (parseFloat(this.data.ltpdata) + (parseFloat(this.data.ltpdata)*0.01)).toFixed(this.tradep);
      //   this. stopLossQuantitySell= (((this.newBuybalanceLimit * (sliderValue / 100)) - ((this.newBuybalanceLimit * (sliderValue / 100)) * this.percentageValue)) / parseFloat(this.stopLossPriceSell)).toFixed(this.tradep)
      //   this.stopLossTotalSell = (parseFloat(this.stopLossPrice) * parseFloat(this.stopLossTriggerPriceSell)).toFixed(this.tradep)
      
      
  
      // this.getBuyValSlider(this.onlyBuyAmount)
  
      //   let balance = this.selelectedBuyingAssetBalance
      // this.onlySellPrice = (balance * sliderValue%)


      let sliderValue = this.sliderValueSellStopLimit
      let ltp = this.data.ltpdata
      this.newBuybalanceLimit = parseFloat(this.selelectedSellingAssetBalance);
        this.stopLossPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata)*0.02)).toFixed(this.tradep);
        
        this.stopLossTriggerPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata)*0.01)).toFixed(this.tradep);
        this.stopLossTotalSell = ((this.newBuybalanceLimit * (sliderValue / 100)));
        //  (parseFloat(this.stopLossPriceSell) * parseFloat(this.stopLossQuantitySell)).toFixed(this.tradep)
        this.stopLossQuantitySell= (parseFloat(this.stopLossTotalSell)/parseFloat(this.stopLossPriceSell)).toFixed(this.tradep)
  
      if(parseFloat(this.stopLossQuantitySell)>0.0001){
        $('.onlySellBtn').prop('disabled', false);
      }else{
        $('.onlySellBtn').prop('disabled', true);
      }
  
      
  
      this.validateStoplossAmountSell()
  //});
  
      console.log('slide newBuybalance', this.newBuybalance);
      console.log('slide onlyBuyAmount', this.stopLossQuantity);
  
      this.stpLoader = false
  
  
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
        this.stopLossTotal = ''
  
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
        this.stopLossTotalSell = ''
  
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

    validateStoplossTriggerPriceSell(){

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
      this.stopLossTriggerPrice = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata) * 0.01)).toFixed(this.tradep);
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

     } else {
      this.stopLossPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata) * 0.02)).toFixed(this.tradep);
      this.stopLossTriggerPriceSell = (parseFloat(this.data.ltpdata) - (parseFloat(this.data.ltpdata) * 0.01)).toFixed(this.tradep);
      this.stopLossTotalSell = (parseFloat(inputValue) * parseFloat(this.stopLossPriceSell)).toFixed(this.tradep);
      $('.onlySellBtn').prop('disabled', false);

      if (isNaN(this.stopLossTotalSell)) {
        this.stopLossTotalSell = ''
        $('.onlySellBtn').prop('disabled', true);

      }

    }
  }

  calculateAmountFromLimitForStopLoss = (type) => {

    if(type == 'buy'){
      if(this.stopLossPrice != ''){
        //if(type == 'buy'){
          // this.stopLossQuantity = (parseFloat(this.stopLossTotal)/parseFloat(this.stopLossPrice)).toFixed(this.tradep)
          this.stopLossTotal = (parseFloat(this.stopLossQuantity) * parseFloat(this.stopLossPrice)).toFixed(this.tradep);

  
        //}else{
    
        //}
        if(isNaN(this.stopLossQuantity)){
          this.stopLossQuantity = ''
        }
      }
    }
    else{
      if(this.stopLossPriceSell != ''){
        //if(type == 'buy'){
          // this.stopLossQuantitySell = (parseFloat(this.stopLossTotalSell)/parseFloat(this.stopLossPriceSell)).toFixed(this.tradep)
          this.stopLossTotalSell = (parseFloat(this.stopLossQuantitySell) * parseFloat(this.stopLossPriceSell)).toFixed(this.tradep);
  
        //}else{
    
        //}
        if(isNaN(this.stopLossQuantitySell)){
          this.stopLossQuantitySell = ''
        }
      }
    }
    
  }

}
