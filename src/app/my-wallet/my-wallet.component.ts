import {
  Component,
  OnInit,
  NgZone,
  Optional,
  Inject,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import {
  CoreDataService
} from '../core-data.service';
import {
  BodyService
} from '../body.service';
import {
  NgbModal, NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import {
  Router
} from '@angular/router';

import { WindowRefService } from '../window-ref.service'
import { StopLossComponent } from '../stop-loss/stop-loss.component';
import * as _ from 'lodash';

declare var Razorpay: any;

@Component({
  selector: 'app-my-wallet',
  templateUrl: './my-wallet.component.html',
  styleUrls: ['./my-wallet.component.css']
})
export class MyWalletComponent implements OnInit {
  @ViewChild('ctdTabset') ctdTabset;
  private _window: WindowRefService;
  public rzp: any;
  orderid: any;
  currencyFilter = '';
  amount: any;
  flag: boolean;
  transactionType = 'send';
  whistoryDetails: any;
  totalCount: any;
  ftotalCount: any;
  ototalCount: any;
  mtotalCount: any;
  historyTableTr: string;
  selectedCurrency: string;
  selectedCurrencyText: string;
  selectedBuyingAssetText: string;
  selectedSellingAssetText: string;
  rcvCode: any;
  cryptoCurrency: string;
  rcv: any;
  lockOutgoingTransactionStatus: any;
  paybito_phone: any;
  paybito_amount: any;
  paybito_otp: any;
  other_address: string;
  other_amount: any;
  other_otp: any;
  sendDisclaimer: any;
  sendDisclaimer2: any;
  rateList: any;
  trigx: any;
  accept: boolean;
  mining_fees: number = 0;
  balance: any;
  limit: any = 0;
  diamtag: any;
  hcxtag: any;
  cartag: any;
  xlmtag: any;
  coinTag: any;
  memo: any;
  xrptag: any;
  source5: any;
  myBalanceList: any = [];
  txncharge: any;
  loader: any;
  assetfromdate: any;
  assettodate: any;
  fdata: any = [];
  // hcx_tag:any;
  marginWalletBalance: any;
  usedBalance: any;
  availableBalance: any;
  usdbalance1: any;
  marginWalletBalance1: any;
  usedBalance1: any;
  availableBalance1: any;
  responsemargin: any;
  spot: any;
  btcLink: any = 'https://live.blockcypher.com/btc/tx/';
  ltcLink: any = 'https://live.blockcypher.com/ltc/tx/';
  bchLink: any = 'https://explorer.bitcoin.com/bch/search/';
  ethLink: any = 'https://etherscan.io/tx/';
  etclink: any = 'http://gastracker.io/tx/';
  bsvlink: any = 'https://blockchair.com/search?q=';
  triggerslink: any = 'https://xchain.io/tx/';
  xrpLink: any = 'https://bithomp.com/explorer/';

  loading: boolean;
  disclaim: boolean = false;
  currencyID: any;
  currencyId: any;
  public razorpay: any;
  public currencyBalance: any;
  public usdbalance: any;
  onlyBuyAmount: any;
  onlyBuyPrice: any;
  onlyBuyTotalPrice: any;
  ui_alert: any;
  pgorder: any;
  networkfee: any = "";
  maxsendamount: any;
  otherWalletMinValue: any;
  otherWalletMiningFees: any;
  errormsg: any;
  validmsg: any;
  errorercmsg: any;
  curPrecision: any;
  fundingHomeViewIso: any;
  fundingHomeViewCross: any;
  fundingHomeViewFunding: any;
  fundingHomeViewIsoForFuture: any;
  fundingHomeViewCrossForFuture: any;
  fundingHomeViewFundingForFuture: any;
  fundingHomeView: any;
  model: any;
  send_amount: any | null;
  modelabc: any;
  modeldate: any;
  fundingdata: any = [];
  fiatCurrencyId: any;
  marginCurId: any;
  selectedCountryPhone = '1';
  arrayy: any = "assetcurrency";
  public maxvalueBtc;
  public minvalueBtc;
  public maxvalueEth;
  public minvalueEth;
  public maxvalueBch;
  public minvalueBch;
  public maxvalueLtc;
  public minvalueLtc;
  public maxvalueUsdt;
  public minvalueUsdt;
  public minvalueDiam;
  public maxvalueDiam;
  public minvalueHcx;
  public maxvalueHcx;
  public maxvalueHbar;
  public minvalueHbar;
  public maxvalueXrp;
  public minvalueXrp;
  public maxvalueLink;
  public minvalueLink;
  public maxvalueBat;
  public minvalueBat;
  public minvalueKicks;
  public maxvalueKicks;
  public minvalueMrc;
  public maxvalueMrc;
  public minvalueAda;
  public maxvalueAda;
  public minvalueSol;
  public maxvalueSol;
  public minvalueCar;
  public maxvalueCar;
  public minvalueXlm;
  public maxvalueXlm;
  public minValueCoin;
  public maxValueCoin;
  marginWalletid: any;
  cryptoCur: any;
  fiatid: any;
  marginwalletId: any;
  marginwalletId1: any;
  currencyId1: any;
  cryptoid: any;
  cryptomarginwalletId: any;
  cryptoCurrency1: any;
  public sendDisclaimerCoin; sendisclaimerXrp; sendisclaimerBat; sendisclaimerHbar; endisclaimerLink; sendisclaimerHcx; sendisclaimerDiam; sendisclaimerUsdt; sendisclaimerLtc; sendisclaimerBch; sendisclaimerEth; sendisclaimerBtc; sendisclaimerLink; sendisclaimerKicks; sendisclaimerMrc; sendisclaimerCar; sendisclaimerXlm; sendisclaimerAda; sendisclaimerSol;

  portfolioDetails: any;
  portfolioHeader: any;
  portfolioId: any;
  portfolioDate: any;
  fulName: any;
  currencyName: any;
  baseCurrency: any;
  //balance:any;
  price: any;
  portfolioType: any;
  marginTransactionId;
  marginTimeStamp;
  marginFullName;
  marginDescription;
  marginTxnType;
  marginDebit;
  margincrebit;
  marginoperationMode;
  marginTransactionValues;
  portfolioBalance: any;
  portfolioBalanceForFuturePerpetual: any;
  portfolioBalanceForFutureCurrentQuarter: any;
  portfolioBalanceForFutureNextQuarter: any;
  portfolioHeadersForFuture: Array<string> = [];
  portfolioValueForFuture: Array<string> = [];
  portfolioValueForFutureContract1: Array<string> = [];
  portfolioValueForFutureContract2: Array<string> = [];
  portfolioValueForFutureContract3: Array<string> = [];
  fiatRateArray: Array<string> = [];
  portfolioHoldings: any;
  /* amount:any;
  onlyBuyAmount: any;
  onlyBuyPrice: any;
  onlyBuyTotalPrice: any; */
  onlySellAmount: any;
  onlySellPrice: any;
  onlySellTotalPrice: any;
  onlyBuyPrice1: any;
  tradem: any;
  tradep: any;
  curencyName: any;
  baseCurrencyName: any;
  assetcode: any;
  mpTransactionid: any;
  getPerpetualTxnList: Array<string> = [];
  getCurrentQuartTxnList: Array<string> = [];
  getNextQuartTxnList: Array<string> = [];
  contractList: Array<string> = [];
  contractName1: string;
  contractName2: string;
  contractName3: string;
  contractName1Id: string;
  contractName2Id: string;
  contractName3Id: string;
  selectedMarginType: string = '1';
  selectedMarginTypeForOptions: string = '2';
  selectedLeverageType: string;
  selectedAssetPairForFutureMargin: any;
  assetPairForFunding: any = '';
  assetPairList: Array<string> = [];
  showDropDownForContract: boolean = false;
  myBalanceListForFuture: Array<string> = [];
  myBalanceListForFutureSpot: Array<string> = [];
  counterAssetPair: any;
  counterLeverage: any;
  amountForPayment: any;
  priceForPayment: any;
  totalForPayment: any;
  currencyForPayment: string = "USD";
  minDate: any
  assetMarginFor: any = 'margin';
  finalTabForFuture: any = 'position'
  finalActiveTabSetForFuture: any = ''
  selectedContractTypeId: any;
  source6: any;
  source7: any;
  marginWalletBalanceForOption: any;
  usedBalanceForOption: any;
  availableBalanceForOption: any;
  fundingHomeViewCrossForOption: any;
  fundingHomeViewFundingForOption: any;
  marginwalletIdForOption: any;
  currencyIdForOption: any;
  cryptoCurrencyForOption: any;
  portfolioBalanceForOptionPerpetual: any;
  portfolioBalanceForOptionCurrentQuarter: any;
  portfolioBalanceForOptionNextQuarter: any;
  portfolioHeadersForOption: Array<string> = [];
  portfolioValueForOptionContract1: Array<string> = [];
  portfolioValueForOptionContract2: Array<string> = [];
  portfolioValueForOptionContract3: Array<string> = [];
  selectedAssetPairForOptionMargin: any;
  myBalanceListForOption: Array<string> = [];
  myBalanceListForOptionsSpot: Array<string> = [];
  finalActiveTabSetForOption: any = '';
  finalTabForOptions: any = 'position'
  contractNameOptions1: string;
  contractNameOptions2: string;
  contractNameOptions3: string;
  contractNameOptions1Id: string;
  contractNameOptions2Id: string;
  contractNameOptions3Id: string;
  contractListOptions: Array<string> = [];
  selectedContractTypeIdForOptions: any;
  public currencyFullName: string = '';
  noOfItemPerPage;
  collection;
  pgn;
  fpgn;
  opgn;
  mpgn;
  page = 1;
  fpage = 1;
  opage = 1;
  mpage = 1;
  e: any
  Themecolor: string;
  whistoryDetails1: any = [];
  network: string;
  activeIdString: any;
  futureChild: any;
  optionChild: string;
  twoFactorOtp: string = '';
  twoFactorOtpOnly: string = '';
  emailOtp: string = ''
  messageotp;
  messageotpforsms;
  interval;
  intervalForSms;
  abc: any;
  abcForSms: any;
  isGetCodeButtonDisabled: boolean = false;
  isGetCodeButtonForSmsDisabled: boolean = false;
  isSendToOtherErc: boolean = false;
  isOpenModal: boolean = false;
  smsOtp: string = '';
  sendTowalletButtonStatus: boolean = true;
  constructor(@Optional() private ref: ChangeDetectorRef, private activeModal: NgbActiveModal, private zone: NgZone, private winref: WindowRefService, private http: HttpClient, public data: CoreDataService, public main: BodyService, private modalService: NgbModal, private route: Router, /* private stoploss:StopLossComponent */) {
    // this._window=this.winref.; 
  }

  ngDoCheck() {

    this.Themecolor = localStorage.getItem('themecolor');
    // //console.log('saved theme', this.Themecolor)
  }
  themeChangedHandler(val) {

    this.Themecolor = val;

  }

  public initPay() {
    var razorpayObj = {};
    razorpayObj['customerId'] = localStorage.getItem('user_id');
    razorpayObj['quantity'] = $('#inputOnlyBuyAmount').val();
    razorpayObj['unitPrice'] = $('#inputOnlyBuyPrice').val();
    razorpayObj['amount'] = $('#inputOnlyBuyTotalPrice').val();
    razorpayObj['currency'] = this.cryptoCurrency;
    razorpayObj['baseCurrency'] = 'INR';
    razorpayObj['paymentCapture'] = 1;
    razorpayObj['transactionFee'] = $('#inputOnlyBuyTotalPrice').val() * 3 / 100;

    var jsonString = JSON.stringify(razorpayObj);
    this.http.post<any>(this.data.WEBSERVICE + '/transaction/paymentGatewayCreateOrder', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        // wip(0);
        var result = response;

        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'danger');
        }
        else {
          this.orderid = result.orderId;
          this.amount = result.amount;
          var pgorder = result.pgOrderId;
          this.data.alert('Submit Successfully', 'success');
          var data: any = {
            //  "key":"rzp_test_YXgiTmHAzJgh0N",
            "order_id": this.orderid,
            "amount": this.amount,
            "name": "Paybito",
            "currency": "INR",
            "description": "Purchase Description",
            "handler": function (response) {
              var pgorderid = pgorder;
              var orderid = response.razorpay_order_id;
              var paymentid = response.razorpay_payment_id;
              var signature = response.razorpay_signature
              var arr = { "pgOrderId": pgorderid, "orderId": orderid, "paymentId": paymentid, "signature": signature }
              var access_token = localStorage.getItem('access_token');
              $.ajax({
                url: "https://accounts.paybito.com/api/transaction/gatewayPaymentDetails",
                type: "POST",
                data: JSON.stringify(arr),
                dataType: 'json',
                async: false,
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {
                  xhr.setRequestHeader("authorization", "bearer" + access_token);
                },
                success: function (msg) {
                  if (msg.error.error_data != 0)
                    alert(msg.error.error_msg);
                  else {
                    alert(msg.error.error_msg);
                  }
                }
                // error:function(){
                //   alert('Something Went Wrong');
                // }
              });
            },
            // handler:this.paymentHandler(response),
            "prefill": {
              "name": "sanu das",
              "email": ""
            },
            "notes": {
              "address": "Kolkata"
            },
            "theme": {
              "color": "#F37254"
            },
            // "method":'credit'
          };
          var rzp1 = new Razorpay(data);
          rzp1.open();
        }
      });
  }


  ngOnInit() {

    this.getWalletMarketTypeNavHist()
    this.getFutureChildNavHist()
    this.getOptionChildNavHist()


    this.collection = this.main.noOfItemPerPage;
    /* functionality for rendering overlay */
    document.body.classList.add("overlay")
    /* removing overlay after a specific time out*/
    setTimeout(() => {
      document.body.classList.remove("overlay")
    }, 8000);
    this.getUserTransactionBalanceRest();
    this.getAllPrecision();
    //this.getUserTransactionBalance();
    // this.getUserTransactionBalanceForFuture();
    // this.getUserTransactionBalanceForOptions();
    //this.main.getUserTransaction();
    this.walletHistoryList('1');
    this.main.getDashBoardInfo();
    this.sendMax();
    //this.getAssets(); 
    // this.getAssetsForFutureMargin();
    // this.getAssetsForOptionsMargin();
    //this.portfolioDeatilsForFuture();


    if (
      localStorage.getItem('selected_leverage') != undefined && localStorage.getItem('selected_leverage') != 'undefined' &&
      localStorage.getItem('selected_leverage') != null && localStorage.getItem('selected_leverage') != 'null'
    ) {
      this.selectedLeverageType = localStorage.getItem('selected_leverage').slice(0, -1)
    } else {
      this.selectedLeverageType = '3'
    }
    // this.getBuyVal(event);
    this.currencyBalance = this.main.balencelist;
    if (this.currencyBalance != null) {
      for (var i = 0; i < this.currencyBalance.length; i++) {
        if (this.currencyBalance[i].currencyCode == "USD") {
          this.usdbalance = this.currencyBalance[i].closingBalance;
          this.currencyId = this.currencyBalance[i].currencyId;
        }
      }
    }

    this.data.currentMessage1.subscribe(message1 => {
      if (message1) {
        this.tradem = message1;
      }
    })

    this.data.currentMessage2.subscribe(message2 => {
      if (message2) {
        this.tradep = message2;
      }
    })
    //this.portfolioDeatils();
    //this.marginTransactionHistory(); 
    //this.userPortfolioBalance();
    /*** calling method to render perpetual future data****/
    // this.getContractDetails();
    /*** calling method to render perpetual options data****/
    // this.getContractDetailsForOptions();
    //this.renderFuturesBalance('perpetual')
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    /* calling method to show last selected tab */
    this.handleShowLastSelectedTab();
  }



  //  pegination
  pager(pg) {

    this.walletHistoryList(pg);

  }
  pagerNext(pg) {

    pg++;
    this.page = pg;
    this.walletHistoryList(pg);

  }
  pagerPre(pg) {
    pg--;
    this.page = pg;
    this.walletHistoryList(pg);

  }
  // future pegination
  pagerFutures(pg) {
    this.portfolioDeatilsForFuture();
    // this.fpage = pg;

  }
  pagerFuturesNext(pg) {

    pg++;
    this.fpage = pg;
    this.portfolioDeatilsForFuture();
  }
  pagerFuturesPre(pg) {
    pg--;
    this.fpage = pg;
    this.portfolioDeatilsForFuture();
  }
  // options pegination


  pagerOptions(pg) {

    this.portfolioDeatilsForOption();

  }
  pagerOptionsNext(pg) {

    pg++;
    this.opage = pg;
    this.portfolioDeatilsForOption();

  }

  pagerOptionsPre(pg) {
    pg--;
    this.opage = pg;
    this.portfolioDeatilsForOption();

  }
  //  margin pegination

  pagermargin(pg) {

    this.portfolioDeatils()

  }
  pagermarginNext(pg) {

    pg++;
    this.mpage = pg;
    this.portfolioDeatils()

  }
  pagermarginPre(pg) {
    pg--;
    this.mpage = pg;
    this.portfolioDeatils()

  }



  successmsg() {
    $('.successmsg').addClass('success-msg');
  }


  getUserTransactionBalance(): void {
    this.getUserTransactionBalanceRest();

    // var url = "https://accounts.paybito.com/api/transaction/getUserBalanceStream?customerId=" + localStorage.getItem('user_id') + "";
    // if (this.source5 != undefined) {
    //   this.source5.close();
    // }
    // this.source5 = new EventSource(url);
    // var result: any = new Object();
    // this.source5.onmessage = (event: MessageEvent) => {
    //   // result = event.data;
    //   // result = JSON.parse(event.data);
    //   // this.myBalanceList = result.userBalanceList;

    //   // let basecur = this.myBalanceList.filter(x => x.currencyCode == 'USD')
    //   // this.usdbalance1 = basecur[0].closingBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
    //   // this.fiatCurrencyId = basecur[0].currencyId;
    //   // /* Adding variable to use show hide functionality for search */
    //   // for(let i=0;i<this.myBalanceList.length;i++){
    //   //   this.myBalanceList[i]['display'] = true;
    //   // }
    //   // console.log('RESPONSE -> ',this.myBalanceList)
    //   // if (!this.ref['destroyed']) {
    //   //   this.ref.detectChanges();
    //   // }
    //   result = event.data;
    //   result = JSON.parse(event.data);
    //   let balance = result.userBalanceList;
    //   let arr = [];
    //   for (let i = 0; i < balance.length; i++) {
    //     //if(balance[i].currencyId != 324){
    //       if(balance[i].currencyType == 1 && balance[i].currencyCode != 'USD'){
    //         let fiatRateArray = this.fiatRateArray;
    //         for(let j=0;j<fiatRateArray.length;j++){
    //          if(fiatRateArray[j]['currencyCode'] ==  balance[i].currencyCode){
    //             balance[i].lastPrice = fiatRateArray[j]['rate'];
    //            arr.push(balance[i])
    //          }
    //         }
    //       }else{
    //         arr.push(balance[i]) 
    //       }
    //     //}
    //   }

    //   // checking if the new list from event source is same or not START


    //   var checkArray = _.isEqual(this.myBalanceList.sort(), arr.sort());


    //   if(checkArray == false){
    //   this.myBalanceList = arr;

    //   // console.log('array mismatch');

    //   }
    //   else{

    //     // do nothing
    //     // console.log('array is same');


    //   }
    //   // checking if the new list from event source is same or not END


    //   //console.log(this.myBalanceList)
    //   let basecur = this.myBalanceList.filter(x => x.currencyCode == 'USD')
    //   this.usdbalance1 = basecur[0].closingBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
    //   this.fiatCurrencyId = basecur[0].currencyId;

    //   if (!this.ref['destroyed']) {
    //     this.ref.detectChanges();
    //   }
    // }
    // // else{
    // //   this.source5.close();
    // // }
  }

  changeArray() {
    var balance = [{ "customerId": 0, "currencyId": 1, "currencyCode": "USD", "currencyName": "US Dollar", "closingBalance": 0.0, "sendAccess": 0, "receiveAccess": 0, "lastPrice": 0.0, "roc": 0.0, "holdingInUsd": 0.0, "totalBuy": 0.0, "totalSell": 0.0, "currencyType": 1, "action": null, "isIsoMargin": 1, "isCrossMargin": 1, "isFund": 1 }];
    this.handleFiatRate(balance);
    var arr = [];

    for (let i = 0; i < balance.length; i++) {
      //if(balance[i].currencyId != 324){
      if (balance[i].currencyType == 1 && balance[i].currencyCode != 'USD') {
        let fiatRateArray = this.fiatRateArray;
        for (let j = 0; j < fiatRateArray.length; j++) {
          if (fiatRateArray[j]['currencyCode'] == balance[i].currencyCode) {
            balance[i].lastPrice = fiatRateArray[j]['rate'];
            arr.push(balance[i])
          }
        }
      } else {
        arr.push(balance[i])
      }

      this.myBalanceList = arr;

      //}
    }
  }

  /* Method defination for calling rest api user balance */
  getUserTransactionBalanceRest() {
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
        let result = response;
        let balance = result.userBalanceList;
        this.handleFiatRate(balance);
        let arr = [];
        for (let i = 0; i < balance.length; i++) {
          //if(balance[i].currencyId != 324){
          //console.log('list from response',balance[i].currencyCode)
          if (balance[i].currencyType == 1 && balance[i].currencyCode != 'USD') {
            let fiatRateArray = this.fiatRateArray;
            for (let j = 0; j < fiatRateArray.length; j++) {
              if (fiatRateArray[j]['currencyCode'] == balance[i].currencyCode) {
                balance[i].lastPrice = fiatRateArray[j]['rate'];
              }
            }
            // console.log('list in if',balance[i].currencyCode)
            arr.push(balance[i])
          } else {
            //console.log('list in else',balance[i].currencyCode)
            arr.push(balance[i])
          }
          //}
        }
        //console.log('LIST => ',arr)
        this.myBalanceList = arr;
        //console.log(this.myBalanceList)
        let basecur = this.myBalanceList.filter(x => x.currencyCode == 'USD')
        this.usdbalance1 = basecur[0].closingBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
        this.fiatCurrencyId = basecur[0].currencyId;
        document.body.classList.remove("overlay")
      })

    // else{
    //   this.source5.close();
    // }
  }

  getMainWalletBalanceForFutureMargin = () => {
    this.http.get<any>(this.data.FUTUREMARGINURL + 'getMainWalletBalance?customerId=' + localStorage.getItem('user_id'), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(result => {

        // console.log('data for new future',result)

        this.myBalanceListForFuture = result.userBalance;
        let arr = [];
        for (let i = 0; i < this.myBalanceListForFuture.length; i++) {
          if (this.myBalanceListForFuture[i]['currencyType'] == 1) {
            arr.push(this.myBalanceListForFuture[i])
          }
        }
        this.myBalanceListForFutureSpot = arr;

      })
  }

  getUserTransactionBalanceForFuture() {
    this.getMainWalletBalanceForFutureMargin();

    // var url = this.data.FUTUREMARGINURL + "getMainWalletBalanceStream?customerId=" + localStorage.getItem('user_id') + "";
    // if (this.source6 != undefined) {
    //   this.source6.close();
    // }
    // this.source6 = new EventSource(url);
    // var result: any = new Object();
    // this.source6.onmessage = (event: MessageEvent) => {
    //   result = event.data;
    //   result = JSON.parse(event.data);
    //   this.myBalanceListForFuture = result.userBalance;
    //   let arr = [];
    //   for (let i = 0; i < this.myBalanceListForFuture.length; i++) {
    //     console.log('Currency ==> ' + this.myBalanceListForFuture[i])
    //     if (this.myBalanceListForFuture[i]['currencyType'] == 1) {
    //       arr.push(this.myBalanceListForFuture[i])
    //     }
    //   }
    //   this.myBalanceListForFutureSpot = arr;
    //   console.log('Future spot wallet',this.myBalanceListForFutureSpot)
    //   /*  let basecur = this.myBalanceList.filter(x => x.currencyCode == 'USD')
    //    this.usdbalance1 = basecur[0].closingBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
    //    this.fiatCurrencyId = basecur[0].currencyId; */

    //   if (!this.ref['destroyed']) {
    //     this.ref.detectChanges();
    //   }
    // }
    // // else{
    // //   this.source6.close();
    // // }
  }

  getAssets() {
    this.http.get<any>(this.data.MARGINURL + 'fundingHomeView', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        let currenciesIso = response.P_ISO_MARGIN_CURRENCY;
        let currenciesCross = response.P_CROSS_MARGIN_CURRENCY;
        let currenciesFunding = response.P_FUNDING_CURRENCY;
        //this.fundingHomeView = response.P_CURRENCY;
        let arrIso = [];
        let arrCross = [];
        let arrFunding = [];
        for (let i = 0; i < currenciesIso.length; i++) {
          if (currenciesIso[i].CURRENCY_TYPE !== 1) {
            arrIso.push(currenciesIso[i])
          }
        }
        for (let i = 0; i < currenciesCross.length; i++) {
          if (currenciesCross[i].CURRENCY_TYPE !== 1) {
            arrCross.push(currenciesCross[i])
          }
        }
        for (let i = 0; i < currenciesFunding.length; i++) {
          if (currenciesFunding[i].CURRENCY_TYPE !== 1) {
            arrFunding.push(currenciesFunding[i])
          }
        }
        this.fundingHomeViewIso = arrIso
        this.fundingHomeViewCross = arrCross
        this.fundingHomeViewFunding = arrFunding
      })
  }

  /* Function defination for funding home view for future margin */
  getAssetsForFutureMargin() {
    this.http.get<any>(this.data.FUTUREMARGINURL + 'fundingHomeView', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        let currenciesIso = response.P_ISO_MARGIN_CURRENCY;
        let currenciesCross = response.P_CROSS_MARGIN_CURRENCY;
        let currenciesFunding = response.P_FUNDING_CURRENCY;
        //this.fundingHomeView = response.P_CURRENCY;
        let arrIso = [];
        let arrCross = [];
        let arrFunding = [];
        for (let i = 0; i < currenciesIso.length; i++) {
          if (currenciesIso[i].CURRENCY_TYPE !== 1) {
            arrIso.push(currenciesIso[i])
          }
        }
        for (let i = 0; i < currenciesCross.length; i++) {
          if (currenciesCross[i].CURRENCY_TYPE !== 1) {
            arrCross.push(currenciesCross[i])
          }
        }
        for (let i = 0; i < currenciesFunding.length; i++) {
          if (currenciesFunding[i].CURRENCY_TYPE !== 1) {
            arrFunding.push(currenciesFunding[i])
          }
        }
        console.log(arrIso)
        console.log(arrCross)
        console.log(arrFunding)
        this.fundingHomeViewIsoForFuture = arrIso
        this.fundingHomeViewCrossForFuture = arrCross
        this.fundingHomeViewFundingForFuture = arrFunding
      })
  }
  faitmargin() {
    this.flag = true;
    this.http.get<any>(this.data.FUTURELENDINGURL + 'getMarginWalletByCurrency?customerId=' + localStorage.getItem('user_id') + '&currencyName=USD&marginType=' + this.selectedMarginType, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        this.responsemargin = data;
        if (this.responsemargin.error != '1') {
          /*  this.data.alert("Balance is available", 'success'); */
          this.marginWalletBalance = this.responsemargin.marginWalletBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
          this.usedBalance = this.responsemargin.usedBalance;
          this.availableBalance = this.responsemargin.availableBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
          this.marginWalletid = this.responsemargin.marginWalletId;
        } else {
          this.marginWalletBalance = 0;
          this.usedBalance = 0;
          this.availableBalance = 0;
          this.data.alert("No Balance is Available Here", 'danger');
        }
        this.main.getUserTransaction();
      })
  }
  faitmarginForFuture() {
    this.flag = true;
    this.http.get<any>(this.data.FUTURELENDINGURL + 'getMarginWalletByCurrency?customerId=' + localStorage.getItem('user_id') + '&currencyName=USD&marginType=' + this.selectedMarginType + '&leverage=' + this.selectedLeverageType, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        this.responsemargin = data;
        if (this.responsemargin.error != '1') {
          /*  this.data.alert("Balance is available", 'success'); */
          this.marginWalletBalance = this.responsemargin.marginWalletBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
          this.usedBalance = this.responsemargin.usedBalance;
          this.availableBalance = this.responsemargin.availableBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
          this.marginWalletid = this.responsemargin.marginWalletId;
        } else {
          this.marginWalletBalance = 0;
          this.usedBalance = 0;
          this.availableBalance = 0;
          this.data.alert("No Balance is Available Here", 'danger');
        }
        this.main.getUserTransaction();
      })
  }

  somethingChanged(event) {
    var bal = event
    this.flag = true;
    this.http.get<any>(this.data.FUTURELENDINGURL + 'getMarginWalletByCurrency?customerId=' + localStorage.getItem('user_id') + '&currencyName=' + bal + '&marginType=' + this.selectedMarginType, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(responsemargin => {
        if (responsemargin.error != '1') {
          /* this.data.alert("Balance is available", 'success'); */
          this.marginWalletBalance1 = responsemargin.marginWalletBalance.toFixed(this.getSpecificCurrencyPrecision(bal));
          this.usedBalance1 = responsemargin.usedBalance;
          this.availableBalance1 = responsemargin.availableBalance.toFixed(this.getSpecificCurrencyPrecision(bal));
          this.marginwalletId1 = responsemargin.marginWalletId;
          this.currencyId1 = responsemargin.currencyId;
          this.cryptoCurrency1 = responsemargin.currencyName;
        } else {
          this.marginWalletBalance1 = 0;
          this.usedBalance1 = 0;
          this.availableBalance1 = 0;
          this.data.alert("No Balance Available for " + bal + '', 'danger');
        }
        this.main.getUserTransaction();
      })
  }

  somethingChangedForFuture(event) {
    var bal = event
    this.flag = true;
    this.http.get<any>(this.data.FUTURELENDINGURL + 'getMarginWalletByCurrency?customerId=' + localStorage.getItem('user_id') + '&currencyName=' + bal + '&marginType=' + this.selectedMarginType + '&leverage=' + this.selectedLeverageType, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(responsemargin => {
        if (responsemargin.error != '1') {
          /*  this.data.alert("Balance is available", 'success'); */
          this.marginWalletBalance1 = responsemargin.marginWalletBalance.toFixed(this.getSpecificCurrencyPrecision(bal));
          this.usedBalance1 = responsemargin.usedBalance;
          this.availableBalance1 = responsemargin.availableBalance.toFixed(this.getSpecificCurrencyPrecision(bal));
          this.marginwalletId1 = responsemargin.marginWalletId;
          this.currencyId1 = responsemargin.currencyId;
          this.cryptoCurrency1 = responsemargin.currencyName;
        } else {
          this.marginWalletBalance1 = 0;
          this.usedBalance1 = 0;
          this.availableBalance1 = 0;
          this.data.alert("No Balance Available for " + bal + '', 'danger');
        }
        this.main.getUserTransaction();
      })
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getOtherWalletValue() {
    this.errormsg = '';
    var otherwalletbalanceobj = {};
    otherwalletbalanceobj['currencyId'] = this.currencyId;
    var jsonString = JSON.stringify(otherwalletbalanceobj);
    this.http.post<any>(this.data.WEBSERVICE + '/transaction/getFeesByCurrencyId', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        this.otherWalletMinValue = result.fees.minFee;
        this.otherWalletMiningFees = result.fees.feeRate;
        this.curPrecision = result.fees.currencyPrecision;
      })
  }

  getHcxErcOtherWalletValue() {
    this.errormsg = '';
    var otherwalletercbalanceobj = {};
    otherwalletercbalanceobj['currencyId'] = this.currencyId;
    otherwalletercbalanceobj['tokenType'] = 'erc';
    var jsonString = JSON.stringify(otherwalletercbalanceobj);
    this.http.post<any>(this.data.WEBSERVICE + '/transaction/getFeesByCurrencyId', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        this.otherWalletMinValue = result.fees.minFee;
        this.otherWalletMiningFees = result.fees.feeRate;
        this.curPrecision = result.fees.currencyPrecision;
      })
  }
  receveraddrs() {
    var abc = $('.receiveaddrs').val();
    var sanu = $('#otherWallet').val();
    if ($('#otherWallet').val() == 0) {
      // $('.maxSendAmount').attr("disabled", false); 
      $('.submitbtn').attr("disabled", true);
    }

    if (abc != '') {
      $('.submitbtn').attr("disabled", true);
    }

    // alert(abc);
    // alert(sanu);
    if ($('.receiveaddrs').val() != '') {
      $('.submitbtn').attr("disabled", false);
    }
    else {
      $('.submitbtn').attr("disabled", true);
    }
  }

  MaxSendAmount() {

    $('.maxSendAmount').attr("disabled", "disabled");
    this.maxsendamount = (this.balance - this.otherWalletMinValue - ((this.balance - this.otherWalletMinValue) * this.otherWalletMiningFees / 100)).toFixed(this.curPrecision);
    if (this.balance <= this.otherWalletMinValue) {
      $('#otherWallet').val('0');
      this.networkfee = "";
      this.other_amount = 0;
    }
    else {
      $('#otherWallet').val(this.maxsendamount);
      this.other_amount = this.maxsendamount;

    }

    var abc = $('#otherWallet').val();
    if (abc == 0) {
      $('.submitbtn').attr("disabled", true);
    }

    else {
      $('.submitbtn').attr("disabled", false);
    }

    this.rateList = null;
    if (this.maxsendamount > 0) {
      var feeObj = {};
      //  if(this.cryptoCurrency == 'HCX ERC20'){
      //    feeObj['currencyId'] = this.currencyId;
      //    feeObj['tokenType'] = 'erc';
      //  }
      //  else{
      feeObj['currencyId'] = this.currencyId;
      // if (this.maxsendamount > 0) {
      feeObj['sendAmount'] = this.maxsendamount;
      // }
      // else {
      //   feeObj['sendAmount'] = 0;
      // }
      var jsonString = JSON.stringify(feeObj);
      this.http.post<any>(this.data.WEBSERVICE + '/transaction/getFees', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token')
        }
      })
        // .subscribe(data => {
        //   this.networkfee = (data.feesListResult[0].totalFees).toFixed(data.feesListResult[0].currencyPrecision);
        .subscribe(data => {
          if (data.error.error_data != '0') {
            this.data.alert(data.error.error_msg, 'danger');
          } else {
            this.networkfee = (data.feesListResult[0].totalFees).toFixed(data.feesListResult[0].currencyPrecision);
          }

        })
    } else {
      $('.maxSendAmount').prop("disabled", false);
    }


  }

  MaxSendAmountForErc() {
    $('.maxsendamountforerc').attr("disabled", "disabled");
    this.maxsendamount = (this.balance - this.otherWalletMinValue - ((this.balance - this.otherWalletMinValue) * this.otherWalletMiningFees / 100)).toFixed(this.curPrecision);
    //  $('#ercotherwallet').val(this.maxsendamount);

    if (this.balance <= this.otherWalletMinValue) {
      $('#ercotherwallet').val('0');
      this.networkfee = "";
    }
    else {
      $('#ercotherwallet').val(this.maxsendamount);
    }



    var abc = $('#ercotherwallet').val();
    if (abc == 0) {
      $('.submitbtn').attr("disabled", true);
    }

    else {
      $('.submitbtn').attr("disabled", false);
    }

    this.rateList = null;
    if (this.maxsendamount > 0) {
      var feeObj = {};
      feeObj['currencyId'] = this.currencyId;
      // if (this.maxsendamount > 0) {
      feeObj['sendAmount'] = this.maxsendamount;
      // }
      // else {
      //   feeObj['sendAmount'] = 0;
      // }

      feeObj['tokenType'] = 'erc';
      var jsonString = JSON.stringify(feeObj);
      this.http.post<any>(this.data.WEBSERVICE + '/transaction/getFees', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token')
        }
      })
        // .subscribe(data => {
        //   this.networkfee = (data.feesListResult[0].totalFees).toFixed(data.feesListResult[0].currencyPrecision);
        .subscribe(data => {
          if (data.error.error_data != '0') {
            this.data.alert(data.error.error_msg, 'danger');
          } else {
            this.networkfee = (data.feesListResult[0].totalFees).toFixed(data.feesListResult[0].currencyPrecision);
          }
        })
    } else {
      $('.maxsendamountforerc').prop("disabled", false);
    }
    $("#otherWallet").prop("disabled", false);
  }

  checkNodeaddress() {
    var checknodeObj = {};
    checknodeObj['toAdd'] = $('.receiveaddrs').val();
    checknodeObj['currencyId'] = this.currencyId;
    if (this.cryptoCurrency == 'HCX') {
      checknodeObj['tokenType'] = 'native';
    }
    var jsonString = JSON.stringify(checknodeObj);
    // wip(1);
    this.http.post<any>(this.data.WEBSERVICE + '/transaction/checkNodeAddress', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(response => {
      var result = response;
      this.validmsg = result.error.error_data;
      if (result.error.error_data != '0') {
        this.errormsg = result.error.error_msg;
        this.other_address = ''
      }
      else {
        this.errormsg = result.error.error_msg;
        //this.data.alert(result.error.error_msg, 'success');
      }
    });
  }

  checkercNodeaddress() {
    var checknodeObj = {};
    checknodeObj['toAdd'] = $('.ercreceiveaddrs').val();
    checknodeObj['currencyId'] = this.currencyId;
    checknodeObj['tokenType'] = 'erc';

    var jsonString = JSON.stringify(checknodeObj);
    // wip(1);
    this.http.post<any>(this.data.WEBSERVICE + '/transaction/checkNodeAddress', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(response => {
      var result = response;
      this.validmsg = result.error.error_data;
      if (result.error.error_data != '0') {
        this.errormsg = result.error.error_msg;
      }
      else {
        this.errormsg = result.error.error_msg;
      }
    });
  }

  reset() {
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.marginWalletBalance1 = "";
    this.usedBalance1 = "";
    this.availableBalance1 = "";
    this.marginWalletBalance = "";
    this.usedBalance = "";
    this.availableBalance = "";
    this.send_amount = this.send_amount = this.send_amount = '';
    this.model = this.model = this.model = '';
    this.assetfromdate = this.assetfromdate = this.assetfromdate = '';
    this.assettodate = this.assettodate = this.assettodate = '';
    this.modeldate = this.modeldate = this.modeldate = '';
    this.modelabc = this.modelabc = this.modelabc = '';
    this.marginWalletBalanceForOption = "";
    this.availableBalanceForOption = "";
    this.usedBalanceForOption = "";
  }


  getCodeFromEmail() {
    var getotpObj = {};
    getotpObj["email"] = localStorage.getItem("email");
    var jsonString = JSON.stringify(getotpObj);

    this.isGetCodeButtonDisabled = true;
    this.http
      .post<any>(this.data.WEBSERVICE + "/user/ResendOTP/sendtoother", jsonString, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .subscribe(
        response => {
          var result = response;
          if (result.error.error_data != '0') {
            this.isGetCodeButtonDisabled = false;
            this.data.alert(result.error.error_msg, 'danger');
          } else {

            var timeleft = this.data.timeIntervalForEmail;
            this.interval;
            var s = timer(1000, 1000);
            this.abc = s.subscribe(val => {
              this.interval = timeleft - val;

              this.messageotp = 'Resend in ' + this.interval + ' seconds';
              this.isGetCodeButtonDisabled = true;


              if (this.interval == 0 || this.interval < 0) {
                this.messageotp = ''
                this.isGetCodeButtonDisabled = false;
                this.abc.unsubscribe();
              }
            });
          }
        },
        reason => {
          this.data.alert('Session Timeout. Login Again', 'warning');
        }
      );
  }


  async getCodeFromSmsForExternalWallet() {
    let payload = {
      phone : localStorage.getItem('phone')
    }

    let isOtpSend = await this.data.handleSendOtpInSms(payload, 'sendtoothermobileotp');
    if (isOtpSend) {

      var timeleft = this.data.timeIntervalForSms;
      this.intervalForSms;
      var s = timer(1000, 1000);
      this.abcForSms = s.subscribe(val => {
        this.intervalForSms = timeleft - val;

        this.messageotpforsms = 'Resend in ' + this.intervalForSms + ' seconds';
        this.isGetCodeButtonForSmsDisabled = true;


        if (this.intervalForSms == 0 || this.intervalForSms < 0) {
          this.messageotpforsms = ''
          this.isGetCodeButtonForSmsDisabled = false;
          this.abcForSms.unsubscribe();
        }
      });
    }
  }

  getUsdtBuyVal(event) {
    var val = event.target.value;
    if (val < 0 || val == "") {
      var onlyBuyAmount: any = val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlyBuyAmount = '';
    }
    else {
      var onlyBuyAmount: any = val;
      var razorpayusdtObj = {};
      razorpayusdtObj['currency'] = this.cryptoCurrency;
      razorpayusdtObj['baseCurrency'] = 'INR';
      var jsonString = JSON.stringify(razorpayusdtObj);
      this.http.post<any>(this.data.WEBSERVICE + '/transaction/marketPriceByCurrency', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          var result = response;
          // if (result.code == '0') {
          //   debugger;
          if (this.data.selectedSellingAssetText == 'INR') {
            this.onlyBuyPrice = (parseFloat(result.marketPrice)).toFixed(4);
            this.onlyBuyTotalPrice = (parseFloat(result.marketPrice) * parseFloat(onlyBuyAmount)).toFixed(4);
            if (this.onlyBuyTotalPrice < 0.001) {
              $('.onlyBuyErrorM').show();
              $('#mbuy').prop('disabled', true);
            }
            else {
              $('.onlyBuyErrorM').hide();
              $('#mbuy').prop('disabled', false);
            }
          } else {
            this.onlyBuyPrice = (parseFloat(result.marketPrice)).toFixed(6);
            this.onlyBuyTotalPrice = (parseFloat(result.marketPrice) * parseFloat(onlyBuyAmount)).toFixed(6);
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
          // } else {
          //   this.onlyBuyPrice = 0;
          //   this.onlyBuyTotalPrice = 0;
          //   $('.onlyBuyError').show();
          //   $('#mbuy').prop('disabled', true);
          // }
        }
        )
    }
  }


  getBuyVal(event) {
    var val = event.target.value;
    if (val < 0 || val == "") {
      // var onlyBuyAmount:any=val;
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlyBuyAmount = '';
    } else {
      var onlyBuyAmount: any = val;
      this.http.get<any>(this.data.TRADESERVICE + '/getAmountBuy/' + 'INR' + this.cryptoCurrency.toUpperCase() + '/' + this.cryptoCurrency.toUpperCase() + 'INR' + '/' + onlyBuyAmount)
        .subscribe(data => {
          var result = data;
          if (result.code == '0') {
            //   debugger;
            if (this.data.selectedSellingAssetText == 'INR') {
              this.onlyBuyPrice = (parseFloat(result.price)).toFixed(4);
              this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(4);
              if (this.onlyBuyTotalPrice < 0.001) {
                $('.onlyBuyErrorM').show();
                $('#mbuy').prop('disabled', true);

              }
              else {
                $('.onlyBuyErrorM').hide();
                $('#mbuy').prop('disabled', false);
              }
            } else {
              this.onlyBuyPrice = (parseFloat(result.price)).toFixed(6);
              this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(6);
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
        }
        )
    }
  }

  walletHistoryList(pageNo) {
    // this.historyTableTr = '';
    /* $('.walletHistoryTableBody').html(`<tr>
    <td colspan="5" class="text-center py-3">
    <img src="./assets/svg-loaders/puff.svg" width="50" alt="">
    </td>
  </tr>`); */
    this.whistoryDetails1 = [];
    var historyObj = {};
    //historyObj['userId'] = localStorage.getItem('user_id');
    historyObj['uuid'] = localStorage.getItem('uuid');

    historyObj['pageNo'] = pageNo;
    historyObj['noOfItemsPerPage'] = 20;
    historyObj['timeSpan'] = this.main.timeSpan;
    historyObj['transactionType'] = this.transactionType;

    var jsonString = JSON.stringify(historyObj);
    this.http.post<any>(this.data.WEBSERVICE + '/transaction/getUserAllTransaction', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          if (result.error.error_msg == 'no result') {
            // this.whistoryDetails1 = [];
            // console.log('forating to 0')
            $('#walletHistoryTableBody').html(`<tr>
            <td colspan="5" class="text-center py-3">
              No Data Available
            </td>
          </tr>`);
          } else {
            this.whistoryDetails = result.userTransactionsResult;
            this.totalCount = result.totalCount;
            this.historyTableTr = '';
            if (this.whistoryDetails != null) {
              for (var i = 0; i < this.whistoryDetails.length; i++) {
                var timestamp = this.whistoryDetails[i].transactionTimestamp;
                var timestampArr = timestamp.split('.');
                timestamp = this.data.readable_timestamp(timestampArr[0]);
                var action = this.whistoryDetails[i].action;
                var hrefForTxn = '';
                var hrefForTxn1 = '';

                var toolTipDesc = '';
                var amount = '';
                var amountdbtcrdt = '';
                if (action == 'Send' || this.transactionType == 'send') {
                  if (this.whistoryDetails[i]['debitAmount'] != '0' && this.whistoryDetails[i]['currency']) {
                    var amount: string = this.whistoryDetails[i]['currency'];
                    var amountdbtcrdt: string = this.whistoryDetails[i]['debitAmount'];
                    if (this.whistoryDetails[i].currencyTxnid != null) {
                      if ((this.whistoryDetails[i].currencyTxnid).length > 0) {
                        hrefForTxn = '<br><a target="_blank" href="' + this.whistoryDetails[i].currencyUrl + this.whistoryDetails[i].currencyTxnid + '">(Check Transaction Block)</a>';
                        hrefForTxn1 = this.whistoryDetails[i].currencyUrl + this.whistoryDetails[i].currencyTxnid

                      }
                    }
                  }
                }

                if (action == 'Received' || this.transactionType == 'received') {
                  console.log('in receive');

                  if (this.whistoryDetails[i]['creditAmount'] != '0' && this.whistoryDetails[i]['currency']) {
                    var amount: string = this.whistoryDetails[i]['currency'];
                    var amountdbtcrdt: string = this.whistoryDetails[i]['creditAmount'];
                    if (this.whistoryDetails[i].currencyTxnid != null) {
                      if ((this.whistoryDetails[i].currencyTxnid).length > 0) {
                        hrefForTxn = '<br><a target="_blank" href="' + this.whistoryDetails[i].currencyUrl + this.whistoryDetails[i].currencyTxnid + '">(Check Transaction Block)</a>';
                        hrefForTxn1 = this.whistoryDetails[i].currencyUrl + this.whistoryDetails[i].currencyTxnid;

                      }
                    }
                  }
                }

                if (this.whistoryDetails[i].status == '1' || this.whistoryDetails[i].status == '1') {
                  var status = 'Confirmed';
                  var statusClass = 'text-green';
                }
                if (this.whistoryDetails[i].status == '0' || this.whistoryDetails[i].status == '0') {
                  var status = 'Pending';
                  var statusClass = 'text-orange';
                }
                if (this.whistoryDetails[i].status == 'cancel' || this.whistoryDetails[i].status == 'Cancel') {
                  var status = 'Cancelled';
                  var statusClass = 'text-red';
                }




                toolTipDesc = '<div class="position-absolute tool_tip_div tool_tip_' + this.whistoryDetails[i].transactionId + ' mt-4 bg-pbgreen text-white p-1 rounded " style="display:none;">' + this.whistoryDetails[i].description + '  <span data-txn-id="' + this.whistoryDetails[i].transactionId + '" onClick="angular.element(this).scope().hideToolTipDesc()"><i class="fa fa-times"></i></span></div>';
                var description = (this.whistoryDetails[i].description != null) ? this.whistoryDetails[i].description : 'Received Amount';
                if (description.length < 100) {
                  var descriptionTd = '<td style="width:25%;padding:10px 0;" data-txn-id="' + this.whistoryDetails[i].transactionId + '" > ' + description + ' ' + hrefForTxn + '</td>';
                  var descriptionTd1 = description + ' ';

                } else {
                  var descriptionTd = '<td style="width:25%;padding:10px 0;" data-txn-id="' + this.whistoryDetails[i].transactionId + '" title="' + description + '">' + toolTipDesc + ' ' + (description).substr(0, 100) + '...  ' + hrefForTxn + '</td>';
                  var descriptionTd1 = (description).substr(0, 100) + '...  ';

                }

                this.whistoryDetails1.push(


                  {
                    toolTipDesc: toolTipDesc,
                    description: this.whistoryDetails[i].description,
                    transactionId: this.whistoryDetails[i].transactionId,
                    timestamp: timestamp,
                    amount: amount,
                    amountdbtcrdt: amountdbtcrdt,
                    action: action,
                    status: status,
                    statusClass: statusClass,
                    descriptionTd: descriptionTd1,
                    hrefForTxn: hrefForTxn1
                  }




                );
                // this.historyTableTr += '<tr style="background-color: #31313a ;border-top: 2px solid #24262d; ">';
                // this.historyTableTr += '<tr class="wallet-hstry ">';
                // this.historyTableTr += '<td class="text-white" style="width:25%;padding: 10px 0;">' + timestamp + '</td>';
                // this.historyTableTr += descriptionTd;
                // this.historyTableTr += '<td  class="text-white"style="width:15%;padding: 10px 0;">' + amount + '</td>';
                // this.historyTableTr += '<td  class="text-white"style="width:16%;padding: 10px 0;">' + amountdbtcrdt + '</td>' + '<i class="fa fax fa-angle-down" aria-hidden="true"></i>';
                // this.historyTableTr += '<td class="text-white" style="width:10%;padding: 10px 0;">' + action + '</td>';
                // this.historyTableTr += '<td class="' + statusClass + '" style="width:9%;padding: 10px 0;">' + status + ' </td>';
                // this.historyTableTr += '</tr>';

              }
              this.pgn = [];
              for (let i = 1; i <= Math.ceil(this.totalCount / 20); i++) {
                this.pgn.push(i);
              }
              // this.main.pagination(this.totalCount, this.main.noOfItemPerPage, 'walletHistoryList');
            } else {
              this.historyTableTr += '<tr colspan="5" class="text-center">No Data Exist</tr>';
            }
            console.log('send receive', this.whistoryDetails1)
            console.log('send receive length', this.whistoryDetails1.length)

            //$('#walletHistoryTableBody').html(this.historyTableTr);
            this.main.getUserTransaction();

          }
        }
      }, function (reason) {
        // wip(0);
        if (reason.data.error == 'invalid_token') {
          this.data.logout();
        } else {
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
          // this.data.alert('Could Not Connect To Server', 'warning');
        }
      });
  }
  filterType(type) {
    if (type == 'send') {
      this.transactionType = 'send';
      this.walletHistoryList('1');
      $('.mywallet_filter_btn').removeClass('btn_active');
      $('.send_filter_btn_wallet').addClass('btn_active');


    } else {
      this.transactionType = 'received';
      this.walletHistoryList('1');
      $('.mywallet_filter_btn').removeClass('btn_active');
      $('.recieved_filter_btn_wallet').addClass('btn_active');
    }
  }

  showToolTipDesc(elem) {
    var txnId = elem.getAttribute('data-txn-id');
    $('.tool_tip_div').hide();
    $('.tool_tip_' + txnId).show();
  }

  hideToolTipDesc() {
    setTimeout(function () {
      $('.tool_tip_div').hide();
    }, 100);
  }

  copy(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }



  getCurrencyForRecieveNative(elem, currency, CID) {
    this.cryptoCurrency = currency;
    this.currencyID = CID;
    this.network = this.cryptoCurrency;
    $('.receive_address_label, .receive_address, .recieve_qr_code').hide();
    $('.generate_address_btn').hide();
    $('#qr_code').html('');
    $('#rcvCodehcx').html('');
    //  if (this.main.userDocVerificationStatus() == true) {
    this.generateAddressForNative(this.currencyID);
    this.modalService.open(elem, {
      centered: true
    });
    // }

  }

  getCurrencyForRecieveModalNative(elem, currency, CID, name) {
    this.cryptoCurrency = currency;
    this.currencyFullName = name
    this.currencyID = CID;
    this.modalService.open(elem, {
      centered: true
    });
  }

  getCurrencyForRecieveModalErc(elem, currency, CID, name) {
    this.cryptoCurrency = currency;
    this.currencyFullName = name;
    this.currencyID = CID;
    this.modalService.open(elem, {
      centered: true
    });
  }


  getCurrencyForRecieveErc(elem, currency, CID) {
    this.cryptoCurrency = currency;
    this.currencyID = CID;
    this.network = 'ERC 20';

    $('.receive_address_label, .receive_address, .recieve_qr_code').hide();
    $('.generate_address_btn').hide();
    $('#qr_code').html('');
    $('#rcvCodehcx').html('');
    //  if (this.main.userDocVerificationStatus() == true) {
    this.generateAddressForErc(this.currencyID);
    this.modalService.open(elem, {
      centered: true
    });
    // }

  }

  generateAddressForNative(currencyId) {
    this.rcv = null;
    this.diamtag = null;
    this.hcxtag = null;
    this.xrptag = null;
    this.cartag = null;
    this.xlmtag = null;
    this.coinTag = null;
    // $(this).attr('data-type')
    var rcvObj = {};
    //rcvObj['userId'] = localStorage.getItem('user_id');
    rcvObj['uuid'] = localStorage.getItem('uuid');
    rcvObj['currencyId'] = currencyId;
    rcvObj['marginType'] = this.selectedMarginType;
    if (this.cryptoCurrency == 'HCX') {
      rcvObj['tokenType'] = 'native';
    }
    // rcvObj['tokenType']='Erc';

    var jsonString = JSON.stringify(rcvObj);
    if (this.cryptoCurrency != 'triggers') {
      this.http.post<any>(this.data.WEBSERVICE + '/transaction/getCryptoAddress', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          // wip(0);
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            this.rcv = result.customerLedgerResult.publicKey;
            this.diamtag = result.customerLedgerResult.memo;
            this.hcxtag = result.customerLedgerResult.memo;
            this.xrptag = result.customerLedgerResult.memo;
            this.cartag = result.customerLedgerResult.memo;
            this.xlmtag = result.customerLedgerResult.memo;
            this.coinTag = result.customerLedgerResult.memo;

          }

        });
    } else {
      this.http.post<any>(this.data.WEBSERVICE + '/userTransaction/GetCounterPartyNewAddress', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          // wip(0);
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            this.rcv = result.customerLedgerResult.publicKey;//change by sanu
          }

        });

    }

  }


  generateAddressForErc(currencyId) {
    this.rcv = null;
    this.diamtag = null;
    this.hcxtag = null;
    this.xrptag = null;
    this.xlmtag = null;
    var rcvObj = {};
    //rcvObj['userId'] = localStorage.getItem('user_id');
    rcvObj['uuid'] = localStorage.getItem('uuid');
    rcvObj['currencyId'] = currencyId;
    rcvObj['marginType'] = this.selectedMarginType;
    if (this.cryptoCurrency == 'HCX') {
      rcvObj['tokenType'] = 'erc';
    }

    var jsonString = JSON.stringify(rcvObj);
    if (this.cryptoCurrency != 'triggers') {
      this.http.post<any>(this.data.WEBSERVICE + '/transaction/getCryptoAddress', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          // wip(0);
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            this.rcv = result.customerLedgerResult.publicKey;
            this.diamtag = result.customerLedgerResult.memo;
            this.hcxtag = result.customerLedgerResult.memo;
            this.xrptag = result.customerLedgerResult.memo;
            this.xlmtag = result.customerLedgerResult.memo;

          }

        });
    } else {
      this.http.post<any>(this.data.WEBSERVICE + '/userTransaction/GetCounterPartyNewAddress', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          // wip(0);
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            this.rcv = result.customerLedgerResult.publicKey;
          }
        });
    }
  }

  getCurrencyForBuy(md, elem, bal, txncharge) {
    $('#inputOnlyBuyAmount').html('');
    $('#inputOnlyBuyPrice').html('');
    this.cryptoCurrency = elem;
    this.balance = bal;
    this.txncharge = 3;
    this.modalService.open(md, {
      centered: true,
    });

  }

  setNetworkCoin(currencyId) {

    console.log('hcx', currencyId)
    if (currencyId == 25 ||
      currencyId == 27 ||
      currencyId == 37 ||
      currencyId == 8 ||
      currencyId == 16 ||
      currencyId == 159 ||
      currencyId == 150 ||
      currencyId == 157 ||
      currencyId == 162 ||
      currencyId == 167 ||
      currencyId == 145 ||
      currencyId == 146 ||
      currencyId == 148 ||
      currencyId == 155 ||
      currencyId == 156 ||
      currencyId == 158 ||
      currencyId == 151 ||
      currencyId == 152 ||
      currencyId == 153 ||
      currencyId == 154 ||
      currencyId == 160 ||
      currencyId == 161 ||
      currencyId == 3 ||
      currencyId == 731 ||
      currencyId == 782


    ) {
      this.network = 'ERC 20'
    }
    else if (currencyId == 2) {
      this.network = 'BTC';

    }
    else {
      this.network = this.cryptoCurrency;

    }
  }

  getCurrencyForSend(md, elem, bal, cId, flag) {

    console.log('flaaag', flag);

    this.networkfee = "";
    this.maxsendamount = "";
    this.cryptoCurrency = elem;
    this.selectedCurrency = elem;
    this.balance = bal;
    this.mining_fees = 0;
    this.currencyId = cId;
    this.other_address = ''
    this.other_amount = ''
    if (flag == 'NA') {
      this.setNetworkCoin(this.currencyId);

    }
    else {
      this.network = 'HCX';
    }
    localStorage.setItem("currencyId", this.currencyId);
    this.modalService.open(md, {
      centered: true
    });
    $('.modal-content').css({ "background-color": "transparent", "border": "0", "box-shadow": "none" });
    this.paybito_phone = this.paybito_amount = this.other_address = this.other_amount = null;
    var userAppSettingsObj = JSON.parse(localStorage.getItem('user_app_settings_list'));
    //  user_app_settings_list_tire
    this.lockOutgoingTransactionStatus = userAppSettingsObj.lock_outgoing_transactions;
    if (this.lockOutgoingTransactionStatus == 1) {
      $('.sendOtpSection').show();
      $('.send_btn').show();

    } else {
      $('.sendOtpSection').hide();
      $('.send_btn').show();
    }
    var settingsList = JSON.parse(localStorage.getItem('environment_settings_list'));
    var newsetting = JSON.parse(localStorage.getItem('user_app_settings_list_tire'));
    var Tiretype = localStorage.getItem('UserTiretype');
    for (var i = 0; i < newsetting.length; i++) {
      this.txncharge = localStorage.setItem('txncharge', newsetting[i].gatewayTxnCharge);

      if (newsetting[i].currencyId == this.currencyId && newsetting[i].tierType == Tiretype) {
        this.maxValueCoin = newsetting[i].dailySendLimit;
        this.minValueCoin = newsetting[i].minLimit;
        this.sendDisclaimerCoin = newsetting[i].sendOtherMCharges;
      }

      /*  if (newsetting[i].currencyId == '2' && newsetting[i].tierType == Tiretype) {
         this.maxvalueBtc = newsetting[i].dailySendLimit;
         this.minvalueBtc = newsetting[i].minLimit;
         this.sendisclaimerBtc = newsetting[i].sendOtherMCharges;
       }
       if (newsetting[i].currencyId == '3' && newsetting[i].tierType == Tiretype) {
         this.maxvalueEth = newsetting[i].dailySendLimit;
         this.minvalueEth = newsetting[i].minLimit;
         this.sendisclaimerEth = newsetting[i].sendOtherMCharges;
       }
       if (newsetting[i].currencyId == '4' && newsetting[i].tierType == Tiretype) {
         this.maxvalueBch = newsetting[i].dailySendLimit;
         this.minvalueBch = newsetting[i].minLimit;
         this.sendisclaimerBch = newsetting[i].sendOtherMCharges;
 
       }
       if (newsetting[i].currencyId == '7' && newsetting[i].tierType == Tiretype) {
         this.maxvalueLtc = newsetting[i].dailySendLimit;
         this.minvalueLtc = newsetting[i].minLimit;
         this.sendisclaimerLtc = newsetting[i].sendOtherMCharges;
       }
       if (newsetting[i].currencyId == '16' && newsetting[i].tierType == Tiretype) {
         this.maxvalueUsdt = newsetting[i].dailySendLimit;
         this.minvalueUsdt = newsetting[i].minLimit;
         this.sendisclaimerUsdt = newsetting[i].sendOtherMCharges;
         //   alert(this.maxvalueUsdt+"++++++++"+this.minvalueUsdt);
       }
 
       if (newsetting[i].currencyId == '5' && newsetting[i].tierType == Tiretype) {
         this.maxvalueDiam = newsetting[i].dailySendLimit;
         this.minvalueDiam = newsetting[i].minLimit;
         this.sendisclaimerDiam = newsetting[i].sendOtherMCharges;
 
       }
       if (newsetting[i].currencyId == '8' && newsetting[i].tierType == Tiretype) {
         this.maxvalueHcx = newsetting[i].dailySendLimit;
         this.minvalueHcx = newsetting[i].minLimit;
         this.sendisclaimerHcx = newsetting[i].sendOtherMCharges;
       }
 
       if (newsetting[i].currencyId == '27' && newsetting[i].tierType == Tiretype) {
         this.maxvalueLink = newsetting[i].dailySendLimit;
         this.minvalueLink = newsetting[i].minLimit;
         this.sendisclaimerLink = newsetting[i].sendOtherMCharges;
       }
 
       if (newsetting[i].currencyId == '26' && newsetting[i].tierType == Tiretype) {
         this.maxvalueHbar = newsetting[i].dailySendLimit;
         this.minvalueHbar = newsetting[i].minLimit;
         this.sendisclaimerHbar = newsetting[i].sendOtherMCharges;
       }
 
       if (newsetting[i].currencyId == '25' && newsetting[i].tierType == Tiretype) {
         this.maxvalueBat = newsetting[i].dailySendLimit;
         this.minvalueBat = newsetting[i].minLimit;
         this.sendisclaimerBat = newsetting[i].sendOtherMCharges;
       }
 
       if (newsetting[i].currencyId == '14' && newsetting[i].tierType == Tiretype) {
         this.maxvalueXrp = newsetting[i].dailySendLimit;
         this.minvalueXrp = newsetting[i].minLimit;
         this.sendisclaimerXrp = newsetting[i].sendOtherMCharges;
       }
 
       if (newsetting[i].currencyId == '37' && newsetting[i].tierType == Tiretype) {
         this.maxvalueKicks = newsetting[i].dailySendLimit;
         this.minvalueKicks = newsetting[i].minLimit;
         this.sendisclaimerKicks = newsetting[i].sendOtherMCharges;
       }
       if (newsetting[i].currencyId == '38' && newsetting[i].tierType == Tiretype) {
         this.maxvalueMrc = newsetting[i].dailySendLimit;
         this.minvalueMrc = newsetting[i].minLimit;
         this.sendisclaimerMrc = newsetting[i].sendOtherMCharges;
       }
       if (newsetting[i].currencyId == '85' && newsetting[i].tierType == Tiretype) {
         this.maxvalueCar = newsetting[i].dailySendLimit;
         this.minvalueCar = newsetting[i].minLimit;
         this.sendisclaimerCar = newsetting[i].sendOtherMCharges;
       }
       if (newsetting[i].currencyId == '144' && newsetting[i].tierType == Tiretype) {
         this.maxvalueXlm = newsetting[i].dailySendLimit;
         this.minvalueXlm = newsetting[i].minLimit;
         this.sendisclaimerXlm = newsetting[i].sendOtherMCharges;
       }
       if (newsetting[i].currencyId == '36' && newsetting[i].tierType == Tiretype) {
         this.maxvalueAda = newsetting[i].dailySendLimit;
         this.minvalueAda = newsetting[i].minLimit;
         this.sendisclaimerAda = newsetting[i].sendOtherMCharges;
       }
       if (newsetting[i].currencyId == '185' && newsetting[i].tierType == Tiretype) {
         this.maxvalueSol = newsetting[i].dailySendLimit;
         this.minvalueSol = newsetting[i].minLimit;
         this.sendisclaimerSol = newsetting[i].sendOtherMCharges;
       } */


    }

    //}
    if (this.cryptoCurrency == 'triggers') {
      this.flag = true;
    }
    else {
      ////alert('2');
      this.flag = false;
    }
  }

  getmodalcurrency(md, elem, bal, cid, name) {
    this.cryptoCurrency = elem;
    this.currencyFullName = name
    this.selectedCurrency = elem;
    this.balance = bal;
    this.mining_fees = 0;
    this.currencyId = cid;
    localStorage.setItem("currencyId", this.currencyId);
    this.modalService.open(md, {
      centered: true
    });
  }

  modalOpen(content, bal, cur, curId) {
    this.modalService.open(content);
    this.amount = bal;
    this.cryptoCurrency = cur;
    this.marginCurId = curId;
  }



  rate() {
    $(".maxSendAmount").attr("disabled", false);
    let reg = /^(0|[1-9]\d*)(\.\d+)?(e-?(0|[1-9]\d*))?$/i
    if (this.other_amount.match(reg)) {
      this.rateList = null;
      var feeObj = {};
      feeObj['currencyId'] = this.currencyId;
      feeObj['sendAmount'] = this.other_amount;
      feeObj['marginType'] = this.selectedMarginType;
      var jsonString = JSON.stringify(feeObj);
      this.http.post<any>(this.data.WEBSERVICE + '/transaction/getFees', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token')
        }
      })
        .subscribe(data => {
          this.networkfee = (data.feesListResult[0].totalFees).toFixed(data.feesListResult[0].currencyPrecision);

        })

    } else {
      if(isNaN(this.other_amount)){
        this.other_amount = ''
      }
    }

  }


  rateHcxErc() {
    $(".maxsendamountforerc").attr("disabled", false);
    this.rateList = null;
    var feeObj = {};
    feeObj['currencyId'] = this.currencyId;
    feeObj['sendAmount'] = this.other_amount;
    feeObj['tokenType'] = 'erc';
    feeObj['marginType'] = this.selectedMarginType;

    var jsonString = JSON.stringify(feeObj);
    this.http.post<any>(this.data.WEBSERVICE + '/transaction/getFees', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token')
      }
    })
      .subscribe(data => {
        this.networkfee = (data.feesListResult[0].totalFees).toFixed(data.feesListResult[0].currencyPrecision);
      })
  }

  Disclaimerdtl(trigger) {
    this.modalService.open(trigger, {
      centered: true
    });
  }
  filter(Search: any) {
  }

  checkforLockStatusWhileSendingToPaybito = (template) => {

    if (this.lockOutgoingTransactionStatus == 1) {
      let twoFactorAuth = localStorage.getItem('twoFactorAuth');
      this.twoFactorOtpOnly = ''
      if (twoFactorAuth == '1') {
        this.modalService.open(template, { centered: true });
      } else {
        this.data.alert('Please turn on Two Factor Authentication from Settings first', 'danger');
      }
    } else {
      this.transactionSendWithinPaybito()
    }

  }
  async transactionSendWithinPaybito() {
    var a = await this.data.checkUserBlockStatus();
    if (a == true) {
      var sendToPaybitoObj = {};
      //sendToPaybitoObj['userId'] = localStorage.getItem('user_id');
      sendToPaybitoObj['uuid'] = localStorage.getItem('uuid');
      // sendToPaybitoObj['toAdd'] = this.selectedCountryPhone+$('.paybitophone').val();
      sendToPaybitoObj['toAdd'] = this.selectedCountryPhone + this.paybito_phone;

      sendToPaybitoObj['sendAmount'] = this.paybito_amount;
      sendToPaybitoObj['currencyId'] = localStorage.getItem("currencyId");
      // sendToPaybitoObj['marginType'] = this.selectedMarginType
      if (this.lockOutgoingTransactionStatus == 1) {
        sendToPaybitoObj['securityCode'] = this.twoFactorOtpOnly;
      }
      var jsonString = JSON.stringify(sendToPaybitoObj);
      console.log('new address payload', jsonString);

      this.http.post<any>(this.data.WEBSERVICE + '/transaction/sendToWallet', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          // wip(0);
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            this.data.alert('Sent successfully', 'success');
            //$('#sendModal').modal('hide');
            this.paybito_phone = '';
            this.paybito_amount = '';
            this.other_address = '';
            this.other_amount = '';
            this.main.getUserTransaction();
            this.walletHistoryList('1');
            this.route.navigateByUrl('/my-wallet');
          }

        }, reason => {
          // wip(0);
          this.data.logout();
          // $('#sendModal').modal('hide');

          this.data.alert('Session Timeout. Login Again', 'danger');
        });

    }


  }

  async transactionSendForOthers(openmodal) {
    var a = await this.data.checkUserBlockStatus();
    if (a == true) {

      // this.networkfee = "";
      //alert($scope.cryptoCurrency);
      var sendToPaybitoObj = {};
      //{"customerID":"38","toadd":"61","btcAmount":"0.75"}
      //sendToPaybitoObj['userId'] = localStorage.getItem('user_id');
      sendToPaybitoObj['uuid'] = localStorage.getItem('uuid');
      sendToPaybitoObj['currencyId'] = localStorage.getItem("currencyId");
      sendToPaybitoObj['currency'] = this.cryptoCurrency;
      sendToPaybitoObj['toAdd'] = this.other_address;
      // sendToPaybitoObj['diamTag'] = this.diam_tag;
      console.log('Memo', this.memo)
      sendToPaybitoObj['memo'] = this.memo;
      console.log('Currency Id', localStorage.getItem("currencyId"))
      if (localStorage.getItem("currencyId") == '16') {
        sendToPaybitoObj['sendAmount'] = parseFloat(this.other_amount).toFixed(2);
      } else {
        sendToPaybitoObj['sendAmount'] = this.other_amount;
      }
      console.log('sendAmount', this.other_amount)
      sendToPaybitoObj['totalFees'] = this.networkfee;
      //sendToPaybitoObj['marginType'] = this.selectedMarginType;
      if (this.cryptoCurrency == 'HCX') {
        sendToPaybitoObj['tokenType'] = 'native';
      }
      // sendToPaybitoObj['crypto_currency'] = this.cryptoCurrency;
      /* if (this.lockOutgoingTransactionStatus == 1) {
        sendToPaybitoObj['otp'] = this.other_otp;
      } */
      sendToPaybitoObj['otp'] = this.emailOtp;
      sendToPaybitoObj['securityCode'] = this.twoFactorOtp;
      sendToPaybitoObj['mobileOtp'] = this.smsOtp;

      console.log('test pppp', sendToPaybitoObj);
      
      var jsonString = JSON.stringify(sendToPaybitoObj);
      if (this.cryptoCurrency != 'triggers') {
        this.http.post<any>(this.data.WEBSERVICE + '/transaction/sendToOther', jsonString, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'BEARER ' + localStorage.getItem('access_token'),
          }
        })
          .subscribe(response => {
            //  wip(0);
            var result = response;
            if (result.error.error_data != '0') {
              this.data.alert(result.error.error_msg, 'danger');
            } else {
              this.modalService.open(openmodal, {
                centered: true
              })
              //$('#batchmsg').modal('show');
              this.data.alert('Balance transferred successfully', 'success');
              this.main.getUserTransaction();
              this.walletHistoryList('1');
              //  $('#sendModal').modal('hide');
              this.paybito_phone = '';
              this.paybito_amount = '';
              this.other_address = '';
              this.other_amount = '';
            }

          }, reason => {
            //  wip(0);
            //  $('#sendModal').modal('hide');
            this.data.alert(reason, 'danger');
          });
      } else {// Do changes Here for Triggers
        this.http.post<any>(this.data.WEBSERVICE + '/userTransaction/SendTriggers', jsonString, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'BEARER ' + localStorage.getItem('access_token'),
          }
        })
          .subscribe(response => {
            //  wip(0);
            var result = response;
            if (result.error.error_data != '0') {
              this.data.alert(result.error.error_msg, 'danger');
            } else {
              this.modalService.open(openmodal, {
                centered: true
              })
              this.data.alert('Balance transferred successfully', 'success');
              //  $('#sendModal').modal('hide');
              this.paybito_phone = '';
              this.paybito_amount = '';
              this.other_address = '';
              this.other_amount = '';
            }

          }, reason => {
            //  wip(0);
            //  $('#sendModal').modal('hide');
            this.data.alert(reason, 'danger');
          });
      }

    }

  }

  handleOpenTwoFactorModal = (template, isSendToOtherForErc, isOpenModal) => {
    let twoFactorAuth = localStorage.getItem('twoFactorAuth');
    let smsAuth = localStorage.getItem('userSmsAuthStatus');
    this.twoFactorOtp = ''
    this.emailOtp = ''
    this.smsOtp = ''
    this.isSendToOtherErc = isSendToOtherForErc;
    this.isOpenModal = isOpenModal
    if (twoFactorAuth == '1' && smsAuth == '1') {

      this.modalService.open(template, { centered: true });
    } else {
      this.data.alert('Please turn on Two Factor Authentication and Phone Verification from Settings first', 'danger');
    }

  }


  transactionSendForOthersErc(openmodal) {
    //alert($scope.cryptoCurrency);
    var sendToPaybitoObj = {};
    //{"customerID":"38","toadd":"61","btcAmount":"0.75"}
    //sendToPaybitoObj['userId'] = localStorage.getItem('user_id');
    sendToPaybitoObj['uuid'] = localStorage.getItem('uuid');
    sendToPaybitoObj['currencyId'] = localStorage.getItem("currencyId");
    sendToPaybitoObj['toAdd'] = this.other_address;
    sendToPaybitoObj['currency'] = this.cryptoCurrency;
    // sendToPaybitoObj['diamTag'] = this.diam_tag;
    sendToPaybitoObj['memo'] = this.memo;
    sendToPaybitoObj['sendAmount'] = $('#ercotherwallet').val();
    sendToPaybitoObj['totalFees'] = this.networkfee;
    sendToPaybitoObj['marginType'] = this.selectedMarginType;
    if (this.cryptoCurrency == 'HCX') {
      sendToPaybitoObj['tokenType'] = 'erc';
    }
    // sendToPaybitoObj['crypto_currency'] = this.cryptoCurrency;
    /* if (this.lockOutgoingTransactionStatus == 1) {
      sendToPaybitoObj['otp'] = this.other_otp;
    } */
    sendToPaybitoObj['securityCode'] = this.twoFactorOtp;
    sendToPaybitoObj['otp'] = this.emailOtp;
    sendToPaybitoObj['mobileOtp'] = this.smsOtp;
    var jsonString = JSON.stringify(sendToPaybitoObj);
    if (this.cryptoCurrency != 'triggers') {
      this.http.post<any>(this.data.WEBSERVICE + '/transaction/sendToOther', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          //  wip(0);
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            this.modalService.open(openmodal, {
              centered: true
            })
            //$('#batchmsg').modal('show');
            this.data.alert('Balance transferred successfully', 'success');
            this.main.getUserTransaction();
            this.walletHistoryList('1');
            //  $('#sendModal').modal('hide');
            this.paybito_phone = '';
            this.paybito_amount = '';
            this.other_address = '';
            this.other_amount = '';
          }

        }, reason => {
          //  wip(0);
          //  $('#sendModal').modal('hide');
          this.data.alert(reason, 'danger');
        });
    } else {// Do changes Here for Triggers
      this.http.post<any>(this.data.WEBSERVICE + '/userTransaction/SendTriggers', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          //  wip(0);
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            this.modalService.open(openmodal, {
              centered: true
            })
            this.data.alert('Balance transferred successfully', 'success');
            //  $('#sendModal').modal('hide');
            this.paybito_phone = '';
            this.paybito_amount = '';
            this.other_address = '';
            this.other_amount = '';
          }

        }, reason => {
          //  wip(0);
          //  $('#sendModal').modal('hide');
          this.data.alert(reason, 'danger');
        });
    }
  }
  testmodal(test) {

  }
  myFunction() {

    var checked = document.forms["uc-disclaimer-form"]["disclaim"].checked;

    if (checked == true) {

      // this.disclaim = true;
      // this.cryptoCurrency='submit';
      document.getElementById('sclaimer').style.display = 'block';
    } else {

      document.getElementById('sclaimer').style.display = 'none';
      //this.disclaim = false;
    }
  }
  swapModal(content, bal) {
    this.modalService.open(content, {
      centered: true,
      size: 'lg'
    });
    this.trigx = bal;
  }

  getRate(event, cur) {
  }

  sendMax() {
    this.other_amount = 0;
    this.getRate(this.balance, this.cryptoCurrency);
    this.loading = true;

    setTimeout(() => {
      if (this.balance > 0 && this.balance > this.limit || this.balance < this.mining_fees) {
        this.other_amount = this.balance - this.mining_fees;
      } else {
        this.other_amount = 0;
      }
      this.loading = false;
    }, 500);
  }

  fundBuy() {
    var dt = this.model;
    var objdata = null;
    if (parseInt(dt.day) < 10) {
      dt.day = '0' + dt.day
    }
    if (parseInt(dt.month) < 10) {
      dt.month = '0' + dt.month
    }
    objdata = {
      "customerId": localStorage.getItem('user_id'), "amount": this.send_amount, "currencyId": this.marginCurId,
      "baseCurrencyId": this.fiatCurrencyId, "unitPrice": 50, "returnDate": dt.day + '-' + dt.month + '-' + dt.year,
    };
    this.http.post<any>(this.data.MARGINURL + 'transferFund', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.returnId != 1) {
          this.data.alert("Funding is not successfully. Please try again", 'danger');
        } else {
          this.data.alert("Funding successful", 'success');
        }
        this.getUserTransactionBalance();
        this.getUserTransactionBalanceForFuture();
        //  wip(0);
      })
  }

  fundBuyForFuture() {
    var dt = this.model;
    var objdata = null;
    if (parseInt(dt.day) < 10) {
      dt.day = '0' + dt.day
    }
    if (parseInt(dt.month) < 10) {
      dt.month = '0' + dt.month
    }
    objdata = {
      "customerId": localStorage.getItem('user_id'), "amount": this.send_amount, "currencyId": this.marginCurId,
      "unitPrice": 50, "returnDate": dt.day + '-' + dt.month + '-' + dt.year,
    };
    objdata['assetPair'] = this.cryptoCurrency.toUpperCase();
    if (this.assetPairForFunding == '') {
      objdata['baseCurrencyId'] = this.marginCurId
    } else {
      objdata['baseCurrencyId'] = this.fiatCurrencyId
    }
    this.http.post<any>(this.data.FUTUREMARGINURL + 'transferFund', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.returnId != 1) {
          this.data.alert(data.message, 'danger');
        } else {
          this.data.alert("Funding successful", 'success');
        }
        this.getUserTransactionBalanceForFuture();
        //  wip(0);
      })
  }

  getmarginval() {
    var name = this.cryptoCurrency;
    // var url = this.data.BUYURL  +name+'USD'+ '/' + 'USD'+name +'/' + 1;
    //   this.http.get<any>(url)
    //   .subscribe(response=>{
    //     this.margetpricegin = response;
    //   })
  }

  lendingPrice() {
    var objdata = {
      "customerId": localStorage.getItem('user_id'),
      "amount": this.send_amount,
      "currencyId": this.marginCurId,
      "baseCurrencyId": this.fiatCurrencyId,
      "unitPrice": "0",
      "marginType": this.selectedMarginType
    }
    this.http.post<any>(this.data.LENDINGURL + 'transferBalanceToMWB', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.error == '1') {
          this.data.alert("Margin not successful", 'danger');
        } else {
          this.data.alert("Margin successful", 'success');
        }
        this.getUserTransactionBalance();
        this.getUserTransactionBalanceForFuture();
        this.getUserTransactionBalanceForOptions();
      });
  }

  lendingPriceForFuture() {
    var objdata = {
      "customerId": localStorage.getItem('user_id'),
      "amount": this.send_amount,
      "currencyId": this.marginCurId,
      "baseCurrencyId": this.fiatCurrencyId,
      "unitPrice": "0",
      "marginType": this.selectedMarginType,
    }
    if (this.selectedAssetPairForFutureMargin != undefined && this.selectedAssetPairForFutureMargin != '') {
      objdata['assetPair'] = this.selectedAssetPairForFutureMargin;
    } else {
      objdata['assetPair'] = this.cryptoCurrency.toUpperCase();
    }
    this.http.post<any>(this.data.FUTURELENDINGURL + 'transferBalanceToMWB', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.error == '1') {
          this.data.alert("Margin not successful", 'danger');
        } else {
          this.data.alert("Margin successful", 'success');
        }
        this.getUserTransactionBalance();
        this.getUserTransactionBalanceForFuture();
      });
  }

  assetlendingPrice() {
    var objdata = {
      "customerId": localStorage.getItem('user_id'),
      "amount": this.send_amount,
      "currencyId": this.fiatCurrencyId,
      "baseCurrencyId": this.fiatCurrencyId,
      "unitPrice": "0",
      "marginType": this.selectedMarginType
    }
    this.http.post<any>(this.data.LENDINGURL + 'transferBalanceToMWB', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.error == '1') {
          this.data.alert("Margin is not successfully. Please try again", 'danger');
        } else {
          this.data.alert("Margin successful", 'success');
        }
        this.getUserTransactionBalance();
        this.getUserTransactionBalanceForFuture();
        this.getUserTransactionBalanceForOptions();
      })
  }
  assetlendingPriceForFuture() {
    this.selectedAssetPairForFutureMargin = this.cryptoCurrency.toUpperCase();
    var objdata = {
      "customerId": localStorage.getItem('user_id'),
      "amount": this.send_amount,
      "currencyId": this.fiatCurrencyId,
      "baseCurrencyId": this.fiatCurrencyId,
      "unitPrice": "0",
      "marginType": this.selectedMarginType
    }
    if (this.selectedAssetPairForFutureMargin != undefined && this.selectedAssetPairForFutureMargin != '') {
      objdata['assetPair'] = this.selectedAssetPairForFutureMargin;
    }
    this.http.post<any>(this.data.FUTURELENDINGURL + 'transferBalanceToMWB', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.returnId != '1') {
          this.data.alert(data.message, 'danger');
        } else {
          this.data.alert("Margin successful", 'success');
        }
        this.getUserTransactionBalanceForFuture();
      })
  }
  assetfundBuy() {
    var dt = this.model;
    var objdata = null;
    if (parseInt(dt.day) < 10) {
      dt.day = '0' + dt.day
    }
    if (parseInt(dt.month) < 10) {
      dt.month = '0' + dt.month
    }
    objdata = {
      "customerId": localStorage.getItem('user_id'), "amount": this.send_amount, "currencyId": this.fiatCurrencyId,
      "baseCurrencyId": this.fiatCurrencyId, "unitPrice": 50, "returnDate": dt.day + '-' + dt.month + '-' + dt.year,
    };
    this.http.post<any>(this.data.MARGINURL + 'transferFund', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.returnId != 1) {
          this.data.alert("Funding is not successfully. Please try again", 'danger');
        } else {
          this.data.alert("Funding successful", 'success');
        }
        this.getUserTransactionBalance();
        this.getUserTransactionBalanceForFuture();
        this.getUserTransactionBalanceForOptions();
      })
  }
  assetfundBuyForFuture() {
    var dt = this.model;
    var objdata = null;
    if (parseInt(dt.day) < 10) {
      dt.day = '0' + dt.day
    }
    if (parseInt(dt.month) < 10) {
      dt.month = '0' + dt.month
    }
    objdata = {
      "customerId": localStorage.getItem('user_id'), "amount": this.send_amount, "currencyId": this.fiatCurrencyId,
      "baseCurrencyId": this.fiatCurrencyId, "unitPrice": 50, "returnDate": dt.day + '-' + dt.month + '-' + dt.year,
    };
    objdata['assetPair'] = this.cryptoCurrency.toUpperCase();
    this.http.post<any>(this.data.FUTUREMARGINURL + 'transferFund', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.returnId != 1) {
          this.data.alert(data.message, 'danger');
        } else {
          this.data.alert("Funding successful", 'success');
        }
        this.getUserTransactionBalanceForFuture();
      })
  }
  assetfundingmargin() {
    this.assetfromdate = this.assetfromdate;
    this.assettodate = this.assettodate;
    if (parseInt(this.assetfromdate.day) < 10) {
      this.assetfromdate.day = '0' + this.assetfromdate.day
    }
    if (parseInt(this.assetfromdate.month) < 10) {
      this.assetfromdate.month = '0' + this.assetfromdate.month
    }
    if (parseInt(this.assettodate.day) < 10) {
      this.assettodate.day = '0' + this.assettodate.day
    }
    if (parseInt(this.assettodate.month) < 10) {
      this.assettodate.month = '0' + this.assettodate.month
    }

    var objdatafund = {
      "customerId": localStorage.getItem('user_id'),
      "currencyId": 1,
      "fromDate": `${this.assetfromdate.day}-${this.assetfromdate.month}-${this.assetfromdate.year}`,
      "toDate": `${this.assettodate.day}-${this.assettodate.month}-${this.assettodate.year}`,
    }
    this.http.post<any>(this.data.FUTUREMARGINURL + 'fundingViewByInputValue', JSON.stringify(objdatafund), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        //this.fdata = data.fundingHomeResponseDtoList;
        let list = data.fundingHomeResponseDtoList;
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          let obj = [];
          obj['currencyName'] = list[i].currencyName;
          obj['lendingDate'] = list[i].lendingDate;
          obj['returnDate'] = list[i].returnDate;
          //console.log('CurrencyName',list[i].currencyName)
          if (list[i].currencyName == 'US Dollar') {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision('USD'));
          } else if (list[i].currencyName == 'BCC') {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision('BCH'));
          } else {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision(list[i].currencyName));
          }
          arr.push(obj)
        }
        this.fdata = arr;
        console.log(this.fdata)
      })
  }

  modalUp(content) {
    if (this.arrayy != 'assetcurrency' && this.modelabc && this.modeldate) {

      let totalToDate = this.modeldate.month + this.modeldate.year;
      let totalfromDate = this.modelabc.month + this.modelabc.year;
      //console.log(totalfromDate);

      if ((this.modeldate.year > this.modelabc.year) || (totalToDate > totalfromDate) ||
        (totalToDate == totalfromDate && this.modeldate.day > this.modelabc.day)) {
        this.modalService.open(content);
      }
      else {
        this.modalService.open('To Date Must be greater than from date!!');
      }
    } else {
      this.data.alert("Please Fill-up all the fields", 'danger');
    }
  }

  modalUpFiat(content) {
    if (this.assetfromdate && this.assettodate) {
      let totalToDate = this.assettodate.month + this.assettodate.year;
      let totalfromDate = this.assetfromdate.month + this.assetfromdate.year;
      if ((this.assettodate.year > this.assetfromdate.year) || (totalToDate > totalfromDate) ||
        (totalToDate == totalfromDate && this.assettodate.day > this.assetfromdate.day)) {
        this.modalService.open(content);
      }
      else {
        this.modalService.open('To Date Must be greater than from date!!');
      }
    } else {
      this.data.alert("Please Fill-up from date and to date both", 'danger');
    }
  }

  findingViewForInputServise() {

    var ds = this.modelabc;
    var dp = this.modeldate;
    if (parseInt(ds.day) < 10) {
      ds.day = '0' + ds.day
    }
    if (parseInt(ds.month) < 10) {
      ds.month = '0' + ds.month
    }
    if (parseInt(dp.day) < 10) {
      dp.day = '0' + dp.day
    }
    if (parseInt(dp.month) < 10) {
      dp.month = '0' + dp.month
    }
    var objdatafund = {
      "customerId": localStorage.getItem('user_id'),
      "currencyId": parseInt(this.arrayy),
      "fromDate": `${ds.day}-${ds.month}-${ds.year}`,
      "toDate": `${dp.day}-${dp.month}-${dp.year}`,
    }

    this.http.post<any>(this.data.FUTUREMARGINURL + 'fundingViewByInputValue', JSON.stringify(objdatafund), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        let list = data.fundingHomeResponseDtoList;
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          let obj = [];
          obj['currencyName'] = list[i].currencyName;
          obj['lendingDate'] = list[i].lendingDate;
          obj['returnDate'] = list[i].returnDate;
          //console.log('CurrencyName',list[i].currencyName)
          if (list[i].currencyName == 'US Dollar') {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision('USD'));
          } else if (list[i].currencyName == 'BCC') {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision('BCH'));
          } else {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision(list[i].currencyName));
          }
          arr.push(obj)
        }
        this.fundingdata = arr;
      })
  }
  findingViewForInputServiseForFuture() {

    var ds = this.modelabc;
    var dp = this.modeldate;
    if (parseInt(ds.day) < 10) {
      ds.day = '0' + ds.day
    }
    if (parseInt(ds.month) < 10) {
      ds.month = '0' + ds.month
    }
    if (parseInt(dp.day) < 10) {
      dp.day = '0' + dp.day
    }
    if (parseInt(dp.month) < 10) {
      dp.month = '0' + dp.month
    }
    var objdatafund = {
      "customerId": localStorage.getItem('user_id'),
      "currencyId": parseInt(this.arrayy),
      "fromDate": `${ds.day}-${ds.month}-${ds.year}`,
      "toDate": `${dp.day}-${dp.month}-${dp.year}`,
    }

    this.http.post<any>(this.data.FUTUREMARGINURL + 'fundingViewByInputValue', JSON.stringify(objdatafund), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        let list = data.fundingHomeResponseDtoList;
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          let obj = [];
          obj['currencyName'] = list[i].currencyName;
          obj['lendingDate'] = list[i].lendingDate;
          obj['returnDate'] = list[i].returnDate;
          //console.log('CurrencyName',list[i].currencyName)
          if (list[i].currencyName == 'US Dollar') {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision('USD'));
          } else if (list[i].currencyName == 'BCC') {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision('BCH'));
          } else {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision(list[i].currencyName));
          }
          arr.push(obj)
        }
        this.fundingdata = arr;
      })
  }
  assetmarginmodal(content, bal, curId, marginwltid, from) {
    this.modalService.open(content);
    this.amount = bal;
    this.fiatid = curId;
    this.marginwalletId = marginwltid;
    this.assetMarginFor = from;
  }

  cryptoholdingmargin(content, cur1, bal, curId, cryptomarginwltid) {
    this.modalService.open(content);
    this.cryptoCur = cur1;
    this.amount = bal;
    this.cryptoid = curId;
    if (this.cryptoid == undefined) {
      this.cryptoid = "";
    }
    this.cryptomarginwalletId = cryptomarginwltid;
  }

  assetholdingPrice() {
    var margintowalletObj = {};
    margintowalletObj['customerId'] = localStorage.getItem('user_id');
    margintowalletObj['marginWalletId'] = this.marginwalletId;
    margintowalletObj['amount'] = this.send_amount;
    margintowalletObj['currencyId'] = this.fiatid;
    margintowalletObj['marginType'] = this.selectedMarginType;
    var jsonString = JSON.stringify(margintowalletObj);
    // wip(1);
    let url: any = '';
    if (this.assetMarginFor == 'margin') {
      url = this.data.FUTURELENDINGURL + 'transferBalanceMarginToMainWallet'
    } else if (this.assetMarginFor == 'options') {
      url = this.data.OPTIONSLENDINGURL + 'transferBalanceMarginToMainWallet'
    } else {
      url = this.data.FUTURELENDINGURL + 'transferBalanceMarginToMainWallet'
    }
    this.http.post<any>(url, jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error != '0') {
          this.data.alert(result.message, 'danger');
        } else {
          this.data.alert(result.message, 'success');
          this.main.getUserTransaction();
          if (this.assetMarginFor == 'margin') {
            this.faitmargin();
          } else if (this.assetMarginFor == 'options') {
            this.faitmarginForOptions()
          } else {
            this.faitmarginForFuture();
          }
          this.send_amount = ''
        }
      })
  }

  fiatholdingPrice() {
    var cryptomargintowalletObj = {};
    cryptomargintowalletObj['customerId'] = localStorage.getItem('user_id');
    cryptomargintowalletObj['marginWalletId'] = this.cryptomarginwalletId;
    cryptomargintowalletObj['amount'] = this.send_amount;
    cryptomargintowalletObj['currencyId'] = this.cryptoid;
    cryptomargintowalletObj['marginType'] = this.selectedMarginType;
    var jsonString = JSON.stringify(cryptomargintowalletObj);
    // wip(1);
    let url: any = '';
    //alert(this.assetMarginFor)
    if (this.assetMarginFor == 'margin') {
      url = this.data.FUTURELENDINGURL + 'transferBalanceMarginToMainWallet'
    } else if (this.assetMarginFor == 'options') {
      url = this.data.OPTIONSLENDINGURL + 'transferBalanceMarginToMainWallet'
    } else {
      url = this.data.FUTURELENDINGURL + 'transferBalanceMarginToMainWallet'
    }
    this.http.post<any>(url, jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error != '0') {
          this.data.alert(result.message, 'danger');
        } else {
          this.data.alert(result.message, 'success');
          this.main.getUserTransaction();

          if (this.assetMarginFor == 'margin') {
            this.faitmargin();
          } else if (this.assetMarginFor == 'options') {
            this.faitmarginForOptions()
          } else {
            this.faitmarginForFuture();
          }
          this.send_amount = ''
        }
      })
  }
  portfolioDeatils() {
    // let payload = {
    //   // no_of_items_per_page : this.collection,
    //   page_no : this.mpage,
    //   userId :  localStorage.getItem('user_id')
    // }
    var url = this.data.MARGINURL + "portfolioDetails?customerId=" + localStorage.getItem('user_id') + "&marginType=" + this.selectedMarginType;
    this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        this.portfolioHeader = response.header;
        this.portfolioId = this.portfolioHeader[0];
        this.portfolioDate = this.portfolioHeader[1]
        this.fulName = this.portfolioHeader[2];
        this.currencyName = this.portfolioHeader[3];
        this.baseCurrency = this.portfolioHeader[4];
        this.balance = this.portfolioHeader[5];
        this.price = this.portfolioHeader[6];
        this.portfolioType = this.portfolioHeader[7];
        this.portfolioDetails = response.values;

        this.mpgn = [];
        for (let i = 1; i <= Math.ceil(this.mtotalCount / 20); i++) {
          this.mpgn.push(i);
        }
        /* if (localStorage.getItem('last_selected_tab_of_wallet') !== undefined && localStorage.getItem('last_selected_tab_of_wallet') !== null && localStorage.getItem('last_selected_tab_of_wallet') !== '') {
          let lastSelectedTabOfWallet = localStorage.getItem('last_selected_tab_of_wallet');
          if (lastSelectedTabOfWallet == 'margin') {
            $('#sanu').children('.market-reset').click();
            $('#portfolio').children('.market-reset').click();
          }
          if (lastSelectedTabOfWallet == 'spot') {
            $('#spot').click();
          }
          if (lastSelectedTabOfWallet == 'futures') {
            $('#future').click();
          }
        } else {
          localStorage.setItem('last_selected_tab_of_wallet', 'spot')
        }
        setTimeout(() => {
          //localStorage.removeItem('last_selected_tab_of_wallet')
        }, 10000); */
        //this.handleShowLastSelectedTab();
      })
  }

  marginTransactionHistory() {
    var url = this.data.MARGINURL + "marginFundingTransactionHistory?customerId=" + localStorage.getItem('user_id') + "&marginType=" + this.selectedMarginType;
    this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var response = data.header;
        this.marginTransactionId = response[0];
        this.marginTimeStamp = response[1];
        this.marginFullName = response[2]
        this.marginDescription = response[3];
        this.marginTxnType = response[4];
        this.marginDebit = response[5];
        this.margincrebit = response[6];
        this.marginoperationMode = response[7];
        this.marginTransactionValues = data.values;
      })
  }

  userPortfolioBalance() {
    var url = this.data.MARGINURL + "userPortfolioBalance?customerId=" + localStorage.getItem('user_id') + "&marginType=" + this.selectedMarginType;
    this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        this.portfolioBalance = data.userBalance;
      })
  }

  modalbuy(content, amount, curName, base_currency, assetCode, mpportfolioid) {
    this.amount = amount;
    this.curencyName = curName;
    this.baseCurrencyName = base_currency;
    this.assetcode = assetCode;
    this.mpTransactionid = mpportfolioid
    this.modalService.open(content, { centered: true });
  }
  modalbuyForFuture(content, amount, curName, base_currency, assetCode, mpportfolioid, assetpair, leverage) {
    this.amount = amount;
    this.curencyName = curName;
    this.baseCurrencyName = base_currency;
    this.assetcode = assetCode;
    this.mpTransactionid = mpportfolioid;
    this.counterAssetPair = assetpair;
    this.counterLeverage = leverage
    this.modalService.open(content, { centered: true });
  }
  marginReset() {
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
    $(function () {
      $('input.form-control').val('');
    })
    //this.stoploss.getUserTransaction();
  }

  portfolioholdingBuy() {
    this.data.alert('Loading...', 'dark');
    this.data.selectedBuyingAssetText = localStorage.getItem('buying_crypto_asset')
    this.data.selectedSellingAssetText = localStorage.getItem('selling_crypto_asset')
    var onlyBuyAmount = this.amount;
    this.http.get<any>("https://stream.paybito.com/SocketStream/api/marketPrice" + '?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&side=' + 'BID' + '&amount=' + onlyBuyAmount + '&marginType=' + this.selectedMarginType, {
      headers: {
        'Content-Type': 'application/json',
        //'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        if (result.statuscode != '0') {
          if (this.data.selectedSellingAssetText == 'USD') {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          } else {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          }
          $('.onlyBuyError').hide();
          $('#marketbuy').prop('disabled', false);
          var inputObj = {}
          inputObj['selling_asset_code'] = (this.baseCurrencyName).toUpperCase();
          inputObj['buying_asset_code'] = (this.curencyName).toUpperCase();
          inputObj['userId'] = localStorage.getItem('user_id');
          inputObj['price'] = this.onlyBuyPrice1;
          inputObj['txn_type'] = '1';
          inputObj['marginType'] = this.selectedMarginType;
          var jsonString = JSON.stringify(inputObj);
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
                var inputObj = {};
                // inputObj['userId'] = localStorage.getItem('user_id');
                inputObj['uuid'] = localStorage.getItem('uuid');

                inputObj['selling_asset_code'] = (this.baseCurrencyName).toUpperCase();
                inputObj['buying_asset_code'] = (this.curencyName).toUpperCase();
                inputObj['amount'] = parseFloat(onlyBuyAmount);
                inputObj['price'] = this.onlyBuyPrice1;
                inputObj["offerType"] = 'P';
                inputObj['txn_type'] = '1';
                inputObj['assetCode'] = this.assetcode;
                inputObj['portfolioId'] = this.mpTransactionid;
                inputObj['marginType'] = this.selectedMarginType;
                var jsonString = JSON.stringify(inputObj);
                if ((this.onlyBuyPrice1 * onlyBuyAmount) >= .001) {
                  this.http.post<any>(this.data.MARGINURL + 'createOffer', jsonString, {
                    headers: {
                      'Content-Type': 'application/json',
                      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                    }
                  })
                    .subscribe(data => {
                      this.data.loader = false;
                      var result = data;
                      if (result.error != '0') {
                        this.data.alert(result.message, 'danger');
                        //this.data.reloadPage(this.route.url);
                      } else {
                        this.marginReset();
                        this.data.alert(result.message, 'success');
                        this.handleSelectedTab('margin')
                        this.data.reloadPage(this.route.url);
                      }
                      //this.marginReset();
                    });
                } else {
                  this.marginReset();
                  this.data.loader = false;
                  this.data.alert('Offer Value is lesser than permissible value', 'warning');
                }
              }


            });
        }
        else {
          this.data.alert(result.message, 'danger');
        }
      })
  }
  portfolioholdingBuyForFuture() {
    $('#btn' + this.mpTransactionid).prop('disabled', true)
    this.data.alert('Loading...', 'dark');
    this.data.selectedBuyingAssetText = localStorage.getItem('buying_crypto_asset')
    this.data.selectedSellingAssetText = localStorage.getItem('selling_crypto_asset')
    var onlyBuyAmount = this.amount;
    this.http.get<any>("https://futures-stream.paybito.com/fSocketStream/api/marketPrice" + '?symbol=' + this.counterAssetPair + '&side=' + 'BID' + '&amount=' + onlyBuyAmount + '&marginType=' + this.selectedMarginType, {
      headers: {
        'Content-Type': 'application/json',
        //'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        if (result.statuscode != '0') {
          if (this.data.selectedSellingAssetText == 'USD') {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          } else {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          }
          $('.onlyBuyError').hide();
          $('#marketbuy').prop('disabled', false);
          // var inputObj = {}
          // inputObj['selling_asset_code'] = (this.baseCurrencyName).toUpperCase();
          // inputObj['buying_asset_code'] = (this.curencyName).toUpperCase();
          // inputObj['userId'] = localStorage.getItem('user_id');
          // inputObj['price'] = this.onlyBuyPrice1;
          // inputObj['txn_type'] = '1';
          // inputObj['marginType'] = this.selectedMarginType;
          // inputObj['assetPair'] = this.counterAssetPair;
          // inputObj['leverage'] = this.counterLeverage;
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
          inputObj['selling_asset_code'] = (this.baseCurrencyName).toUpperCase();
          inputObj['buying_asset_code'] = (this.curencyName).toUpperCase();
          inputObj['amount'] = parseFloat(onlyBuyAmount);
          inputObj['price'] = this.onlyBuyPrice1;
          inputObj["offerType"] = 'P';
          inputObj['txn_type'] = '1';
          inputObj['assetCode'] = this.assetcode;
          inputObj['portfolioId'] = this.mpTransactionid;
          inputObj['marginType'] = this.selectedMarginType;
          inputObj['assetPair'] = this.counterAssetPair;
          inputObj['leverage'] = this.counterLeverage;
          inputObj['uuid'] = localStorage.getItem('uuid')
          var jsonString = JSON.stringify(inputObj);
          if ((this.onlyBuyPrice1 * onlyBuyAmount) >= .001) {
            this.http.post<any>(this.data.WEBSERVICE + '/fTrade/TradeCreateOffer', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
              }
            })
              .subscribe(data => {
                this.data.loader = false;
                var result = data;
                if (result.error.error_data != '0') {
                  this.data.alert(result.error.error_msg, 'danger');
                  $('#btn' + this.mpTransactionid).prop('disabled', false)
                  //this.data.reloadPage(this.route.url);
                } else {
                  this.marginReset();
                  this.data.alert(result.error.error_msg, 'success');
                  this.handleSelectedTab('margin')
                  $('#btn' + this.mpTransactionid).prop('disabled', false)
                  this.data.reloadPage(this.route.url);
                }
                //this.marginReset();
              });
          } else {
            this.marginReset();
            this.data.loader = false;
            this.data.alert('Offer Value is lesser than permissible value', 'warning');
            $('#btn' + this.mpTransactionid).prop('disabled', false)
          }
          //}


          //});
        }
        else {
          this.data.alert(result.message, 'danger');
          $('#btn' + this.mpTransactionid).prop('disabled', false)
        }
      })
  }

  portfolioholdingSell() {
    this.data.alert('Loading...', 'dark');
    this.data.selectedBuyingAssetText = localStorage.getItem('buying_crypto_asset')
    this.data.selectedSellingAssetText = localStorage.getItem('selling_crypto_asset')
    var onlySellAmount = this.amount;

    this.http.get<any>("https://stream.paybito.com/SocketStream/api/marketPrice" + '?symbol=' + localStorage.getItem('buying_crypto_asset') + localStorage.getItem('selling_crypto_asset') + '&side=' + 'ASK' + '&amount=' + onlySellAmount + '&marginType=' + this.selectedMarginType, {
      headers: {
        'Content-Type': 'application/json',
        //'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        if (result.statuscode != '0') {
          if (this.data.selectedSellingAssetText == 'USD') {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          } else {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          }
          $('.onlyBuyError').hide();
          $('#marketbuy').prop('disabled', false);
          var inputObj = {}
          inputObj['selling_asset_code'] = (this.curencyName).toUpperCase();
          inputObj['buying_asset_code'] = (this.baseCurrencyName).toUpperCase();
          inputObj['userId'] = localStorage.getItem('user_id');
          inputObj['price'] = this.onlyBuyPrice1;
          inputObj['txn_type'] = '1';
          inputObj['marginType'] = this.selectedMarginType;
          var jsonString = JSON.stringify(inputObj);
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
                var inputObj = {};
                // inputObj['userId'] = localStorage.getItem('user_id');
                
                inputObj['selling_asset_code'] = (this.curencyName).toUpperCase();
                inputObj['buying_asset_code'] = (this.baseCurrencyName).toUpperCase();
                inputObj['amount'] = parseFloat(onlySellAmount);
                inputObj['price'] = this.onlyBuyPrice1;
                inputObj["offerType"] = 'P';
                inputObj['txn_type'] = '2';
                inputObj['assetCode'] = this.assetcode;
                inputObj['portfolioId'] = this.mpTransactionid;
                inputObj['marginType'] = this.selectedMarginType;
                inputObj['uuid'] = localStorage.getItem('uuid');

                var jsonString = JSON.stringify(inputObj);
                if ((this.onlyBuyPrice1 * onlySellAmount) >= .001) {
                  this.http.post<any>(this.data.MARGINURL + 'createOffer', jsonString, {
                    headers: {
                      'Content-Type': 'application/json',
                      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                    }
                  })
                    .subscribe(data => {
                      this.data.loader = false;
                      var result = data;
                      if (result.error != '0') {
                        this.data.alert(result.message, 'danger');
                        // this.data.reloadPage(this.route.url);
                      } else {
                        this.marginReset();
                        this.data.alert(result.message, 'success');
                        this.handleSelectedTab('margin')
                        this.data.reloadPage(this.route.url);
                      }
                      //this.marginReset();
                    });
                } else {
                  this.marginReset();
                  this.data.loader = false;
                  this.data.alert('Offer Value is lesser than permissible value', 'warning');
                }
              }


            });
        }
        else {
          this.data.alert(result.message, 'danger');
        }
      })
  }

  portfolioholdingSellForFuture() {
    this.data.alert('Loading...', 'dark');
    $('#btn' + this.mpTransactionid).prop('disabled', true)
    this.data.selectedBuyingAssetText = localStorage.getItem('buying_crypto_asset')
    this.data.selectedSellingAssetText = localStorage.getItem('selling_crypto_asset')
    var onlySellAmount = this.amount;

    this.http.get<any>("https://futures-stream.paybito.com/fSocketStream/api/marketPrice" + '?symbol=' + this.counterAssetPair + '&side=' + 'ASK' + '&amount=' + onlySellAmount + '&marginType=' + this.selectedMarginType, {
      headers: {
        'Content-Type': 'application/json',
        //'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        if (result.statuscode != '0') {
          if (this.data.selectedSellingAssetText == 'USD') {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          } else {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          }
          $('.onlyBuyError').hide();
          $('#marketbuy').prop('disabled', false);
          // var inputObj = {}
          // inputObj['selling_asset_code'] = (this.curencyName).toUpperCase();
          // inputObj['buying_asset_code'] = (this.baseCurrencyName).toUpperCase();
          // inputObj['userId'] = localStorage.getItem('user_id');
          // inputObj['price'] = this.onlyBuyPrice1;
          // inputObj['txn_type'] = '1';
          // inputObj['marginType'] = this.selectedMarginType;
          // inputObj['assetPair'] = this.counterAssetPair;
          // inputObj['leverage'] = this.counterLeverage;
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
          inputObj['selling_asset_code'] = (this.curencyName).toUpperCase();
          inputObj['buying_asset_code'] = (this.baseCurrencyName).toUpperCase();
          inputObj['amount'] = parseFloat(onlySellAmount);
          inputObj['price'] = this.onlyBuyPrice1;
          inputObj["offerType"] = 'P';
          inputObj['txn_type'] = '2';
          inputObj['assetCode'] = this.assetcode;
          inputObj['portfolioId'] = this.mpTransactionid;
          inputObj['marginType'] = this.selectedMarginType;
          inputObj['assetPair'] = this.counterAssetPair;
          inputObj['leverage'] = this.counterLeverage;
          inputObj['uuid'] = localStorage.getItem('uuid')
          var jsonString = JSON.stringify(inputObj);
          if ((this.onlyBuyPrice1 * onlySellAmount) >= .001) {
            this.http.post<any>(this.data.WEBSERVICE + '/fTrade/TradeCreateOffer', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
              }
            })
              .subscribe(data => {
                this.data.loader = false;
                var result = data;
                if (result.error.error_data != '0') {
                  this.data.alert(result.error.error_msg, 'danger');
                  $('#btn' + this.mpTransactionid).prop('disabled', false)
                  // this.data.reloadPage(this.route.url);
                } else {
                  this.marginReset();
                  this.data.alert(result.error.error_msg, 'success');
                  this.handleSelectedTab('margin')
                  $('#btn' + this.mpTransactionid).prop('disabled', false)
                  this.data.reloadPage(this.route.url);
                }
                //this.marginReset();
              });
          } else {
            this.marginReset();
            this.data.loader = false;
            this.data.alert('Offer Value is lesser than permissible value', 'warning');
            $('#btn' + this.mpTransactionid).prop('disabled', false)
          }
          //}


          //});
        }
        else {
          this.data.alert(result.message, 'danger');
          $('#btn' + this.mpTransactionid).prop('disabled', false)
        }
      })
  }
  /**** Method defination for rendering futures waleet values ****/
  renderFuturesBalance = (param) => {
    this.data.alert('Loading...', 'dark');
    this.http.get<any>(this.data.WEBSERVICE + '/fTrade/userFuturesBalance?uuid=' + localStorage.getItem('uuid') + '&walletType=' + param, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        if (result.statusCode === 0) {
          if (param === 'PERPETUAL') {
            this.getPerpetualTxnList = result.userFuturesBalanceList
          } else if (param === 'QUARTERLY 0625') {
            this.getCurrentQuartTxnList = result.userFuturesBalanceList
          } else if (param === 'QUARTERLY 0924') {
            this.getNextQuartTxnList = result.userFuturesBalanceList
          }

        } else {
          this.data.alert(result.message, 'danger');
        }
      })
  }

  /*** method defination get contract details ***/
  getContractDetails = () => {
    //this.data.alert('Loading...', 'dark');
    this.http.get<any>(this.data.WEBSERVICE + '/fTrade/getContractsName')
      .subscribe(data => {
        var result = data;
        if (result.statusCode === 0) {
          this.contractList = result.contractList;
          let contract = this.contractList;
          console.log(contract)
          /* for (let i = 0; i < contract.length; i++) {
            if (contract[i]['order'] === 1) {
              this.contractName1 = contract[i]['contractName'];
              this.renderFuturesBalance(this.contractName1);
            } else if (contract[i]['order'] === 2) {
              this.contractName2 = contract[i]['contractName'];
              this.renderFuturesBalance(this.contractName2);
            } else if (contract[i]['order'] === 3) {
              this.contractName3 = contract[i]['contractName'];
              this.renderFuturesBalance(this.contractName3);
            }
          } */
          this.contractName1 = contract[0]['contractName'];
          this.contractName1Id = contract[0]['contractTypeId'];
          //this.renderFuturesBalance(this.contractName1);
          this.contractName2 = contract[1]['contractName'];
          this.contractName2Id = contract[1]['contractTypeId'];
          //this.renderFuturesBalance(this.contractName2);
          this.contractName3 = contract[2]['contractName'];
          this.contractName3Id = contract[2]['contractTypeId'];
          //this.renderFuturesBalance(this.contractName3);
          this.selectedContractTypeId = contract[0]['contractTypeId']
          this.userPortfolioBalanceForFuture();
        } else {
          //alert('here')
          this.data.alert(result.message, 'danger');
        }
      })
  }
  /* Method defination for selecting margin type */
  handleSelectMarginType = (param) => {
    this.selectedMarginType = param
    this.getUserTransactionBalance();
    this.getUserTransactionBalanceForFuture();
    this.getUserTransactionBalanceForOptions();
    this.main.getUserTransaction();
    this.walletHistoryList('1');
    this.main.getDashBoardInfo();
    this.sendMax();
    // this.getAssets();
    // this.getBuyVal(event);
    this.currencyBalance = this.main.balencelist;
    if (this.currencyBalance != null) {
      for (var i = 0; i < this.currencyBalance.length; i++) {
        if (this.currencyBalance[i].currencyCode == "USD") {
          this.usdbalance = this.currencyBalance[i].closingBalance;
          this.currencyId = this.currencyBalance[i].currencyId;
        }
      }
    }

    this.data.currentMessage1.subscribe(message1 => {
      if (message1) {
        this.tradem = message1;
      }
    })

    this.data.currentMessage2.subscribe(message2 => {
      if (message2) {
        this.tradep = message2;
      }
    })

    // commenting out as spot margin is not working at the time: Arnab

    //this.portfolioDeatils();
    // this.marginTransactionHistory();
    // this.userPortfolioBalance();
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
  /* Method defintion for validating phone no */
  handleValidatePhone = (e) => {
    let phone = e.target.value;
    let regex = /^[0-9]+$/
    //console.log(phone.match(regex))
    if (!phone.match(regex)) {
      //console.log('not matched')
      phone = phone.toString().slice(0, -1);
      e.target.value = parseInt(phone)
    }

  }

  handleValidatePhoneNew = (e) => {
    let phone = e.target.value;
    let regex = /^[0-9]+$/
    //console.log(phone.match(regex))
    if (!phone.match(regex)) {
      //console.log('not matched')
      phone = phone.toString().slice(0, -1);
      e.target.value = phone
    }

  }

  /* select margin type for futures portfolio */
  handleMarginTypeForFuturePortfolio = (param) => {
    this.selectedMarginType = param;
    this.userPortfolioBalanceForFuture();
    this.portfolioDeatilsForFuture();
  }
  userPortfolioBalanceForFuture() {
    var url = this.data.FUTUREMARGINURL + "userPortfolioBalance?customerId=" + localStorage.getItem('user_id') + "&marginType=" + this.selectedMarginType + "&contractTypeId=" + this.selectedContractTypeId;
    this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        this.portfolioBalanceForFuturePerpetual = data.userBalance;
        this.portfolioBalanceForFutureCurrentQuarter = data.userBalance;
        this.portfolioBalanceForFutureNextQuarter = data.userBalance;
      })
  }

  portfolioDeatilsForFutureOnTabHistCall() {

    // console.log('iammmmmmmm innnnnnnnn 2');


    var url = this.data.FUTUREMARGINURL + "portfolioDetails?customerId=" + localStorage.getItem('user_id') + "&marginType=2";
    this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        this.portfolioHeadersForFuture = response.header
        //TODO: show as per as contact id
        let values = response.values
        let arrPerp = [];
        let arrCurrent = [];
        let arrNext = [];

        /* console.log(this.contractName1Id)
        console.log(this.contractName2Id)
        console.log(this.contractName3Id) */
        //console.log(values)
        if (values.length != 0) {
          for (let i = 0; i < values.length; i++) {
            if (values[i].contractTypeId == this.contractName1Id) {
              arrPerp.push(values[i])
            }
            if (values[i].contractTypeId == this.contractName2Id) {
              arrCurrent.push(values[i])
            }
            if (values[i].contractTypeId == this.contractName3Id) {
              arrNext.push(values[i])
            }
          }
          this.fpgn = [];
          for (let i = 1; i <= Math.ceil(this.ftotalCount / 20); i++) {
            this.fpgn.push(i);
          }
        }
        else {
          arrPerp = [];
          arrCurrent = [];
          arrNext = [];
        }
        this.portfolioValueForFutureContract1 = arrPerp;
        this.portfolioValueForFutureContract2 = arrCurrent;
        this.portfolioValueForFutureContract3 = arrNext;
        console.log(this.portfolioValueForFutureContract1)
        console.log(this.portfolioValueForFutureContract2)
        console.log(this.portfolioValueForFutureContract2)
        console.log('---------------------------------------')


      })
  }

  portfolioDeatilsForFuture() {

    // console.log('iammmmmmmm innnnnnnnn',this.selectedMarginType);


    var url = this.data.FUTUREMARGINURL + "portfolioDetails?customerId=" + localStorage.getItem('user_id') + "&marginType=" + this.selectedMarginType;
    this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        this.portfolioHeadersForFuture = response.header
        //TODO: show as per as contact id
        let values = response.values
        let arrPerp = [];
        let arrCurrent = [];
        let arrNext = [];

        /* console.log(this.contractName1Id)
        console.log(this.contractName2Id)
        console.log(this.contractName3Id) */
        //console.log(values)
        if (values.length != 0) {
          for (let i = 0; i < values.length; i++) {
            if (values[i].contractTypeId == this.contractName1Id) {
              arrPerp.push(values[i])
            }
            if (values[i].contractTypeId == this.contractName2Id) {
              arrCurrent.push(values[i])
            }
            if (values[i].contractTypeId == this.contractName3Id) {
              arrNext.push(values[i])
            }
          }
          this.fpgn = [];
          for (let i = 1; i <= Math.ceil(this.ftotalCount / 20); i++) {
            this.fpgn.push(i);
          }
        }
        else {
          arrPerp = [];
          arrCurrent = [];
          arrNext = [];
        }
        this.portfolioValueForFutureContract1 = arrPerp;
        this.portfolioValueForFutureContract2 = arrCurrent;
        this.portfolioValueForFutureContract3 = arrNext;
        console.log(this.portfolioValueForFutureContract1)
        console.log(this.portfolioValueForFutureContract2)
        console.log(this.portfolioValueForFutureContract2)
        console.log('---------------------------------------')


      })
  }

  /* method defination for handling position and portfolio tab automaticatilly*/
  autoToggleFinalTabForFuture = (param) => {
    let key = ''
    console.log(this.finalTabForFuture)
    if (this.finalTabForFuture == 'position') {
      key = 'Position'
    } else {
      key = 'Portfolio'
    }
    console.log(param + key)
    //$('#'+param+key).click();
    this.ctdTabset.select(param + key);
    this.finalActiveTabSetForFuture = param + key;
  }
  /* method defination for select position and portfolio tab */
  handleSelectTabForFuture = (param) => {
    this.finalTabForFuture = param
  }

  /* Method defination for handling selected contarct type*/
  handleContractTypeSelection = (id) => {
    this.selectedContractTypeId = id
    this.userPortfolioBalanceForFuture();
    this.portfolioDeatilsForFuture();
  }
  /* get currency min max value for */
  getAssetCharges = (param) => {
    console.log('selected currency ' + param);
    let obj = {};
    let newsetting = JSON.parse(localStorage.getItem('user_app_settings_list_tire'));
    for (var i = 0; i < newsetting.length; i++) {

      if (newsetting[i].currencyId == param) {
        obj['maxValue'] = newsetting[i].dailySendLimit;
        obj['minValue'] = newsetting[i].minLimit;
        obj['sendisclaimer'] = newsetting[i].sendOtherMCharges;
        break;
      }
    }
    console.log(obj)
    return obj;
  }

  /* Method defination for selecting tab */
  handleSelectedTab = (param) => {
    let alreadySelectedTab = localStorage.getItem('last_selected_tab_of_wallet')
    let isAbleToSave = false;
    if (alreadySelectedTab != undefined) {
      if (
        param == 'margin' && (alreadySelectedTab == 'marginIso' || alreadySelectedTab == 'marginCross' || alreadySelectedTab == 'marginIsoWallet' || alreadySelectedTab == 'marginIsoPortfolio' || alreadySelectedTab == 'marginCrossWallet' || alreadySelectedTab == 'marginCrossPortfolio')
      ) {
        isAbleToSave = false
      } else if (
        param == 'marginIso' && (alreadySelectedTab == 'marginIsoWallet' || alreadySelectedTab == 'marginIsoPortfolio')
      ) {
        isAbleToSave = false
      } else if (
        param == 'marginCross' && (alreadySelectedTab == 'marginCrossWallet' || alreadySelectedTab == 'marginCrossPortfolio')
      ) {
        isAbleToSave = false
      } else if (
        param == 'futures' && (alreadySelectedTab == 'futuresCurrentQuarter' || alreadySelectedTab == 'futuresNextQuarter' || alreadySelectedTab == 'futuresPerpetual')
      ) {
        isAbleToSave = false
      } else {
        isAbleToSave = true
      }
    } else {
      isAbleToSave = true

    }
    if (isAbleToSave) {
      localStorage.setItem('last_selected_tab_of_wallet', param);
    }
  }

  /* Method call on future tab load */
  callMethodsOnFutureTabLoad() {
    //TODO : get 1st contarct name
    this.getContractDetails();
    this.getUserTransactionBalanceForFuture();
    this.getAssetsForFutureMargin();
    this.portfolioDeatilsForFuture();

  }


  /* Method call on optionns tab load */
  callMethodsOnOptionsTabLoad() {
    this.getContractDetailsForOptions()
    this.getUserTransactionBalanceForOptions();
    this.getAssetsForOptionsMargin();

    this.portfolioDeatilsForOption();

    this.portfolioDeatilsForOption();

  }

  /* Method defination for showing last selected tab */
  handleShowLastSelectedTab = () => {
    let tabName = localStorage.getItem('last_selected_tab_of_wallet');
    if (tabName != undefined) {
      $('#' + tabName + 'Tab').click();
      if (tabName.indexOf('margin') > -1) {
        $('#marginTab').click();
        setTimeout(() => {
          if (tabName == 'marginIso') {
            $('#marginIsoTab').click();
          } else if (tabName == 'marginCross') {
            $('#marginCrossTab').click()
          } else if (tabName == 'marginIsoWallet') {
            $('#marginIsoTab').click();
            $('#marginIsoWalletTab').click();
          } else if (tabName == 'marginIsoPortfolio') {
            $('#marginIsoTab').click();
            $('#marginIsoPortfolioTab').click();
          } else if (tabName == 'marginCrossWallet') {
            $('#marginCrossTab').click()
            $('#marginCrossWalletTab').click()
          } else if (tabName == 'marginCrossPortfolio') {
            $('#marginCrossTab').click()
            $('#marginCrossPortfolioTab').click()
          }
        }, 2000);
      } else if (tabName.indexOf('futures') > -1) {
        $('#futuresTab').click();
        setTimeout(() => {
          if (tabName == 'futuresCurrentQuarter') {
            $('#' + tabName + 'Tab').click();
          } else if (tabName == 'futuresNextQuarter') {
            $('#' + tabName + 'Tab').click();
          } else if (tabName == 'futuresPerpetual') {
            $('#' + tabName + 'Tab').click();
          } else if (tabName == 'futuresWallet') {
            $('#' + tabName + 'Tab').click();
          }
        }, 2000);
      } else if (tabName.indexOf('options') > -1) {
        $('#futuresTab').click();
        setTimeout(() => {
          if (tabName == 'OptionsCurrentQuarter') {
            $('#' + tabName + 'Tab').click();
          } else if (tabName == 'OptionsNextQuarter') {
            $('#' + tabName + 'Tab').click();
          } else if (tabName == 'OptionsPerpetual') {
            $('#' + tabName + 'Tab').click();
          } else if (tabName == 'OptionsWallet') {
            $('#' + tabName + 'Tab').click();
          }
        }, 2000);
      }
    }

  }

  /* Method defination which are used for options functionalities */
  getUserTransactionBalanceForOptions() {
    var url = this.data.OPTIONSMARGINURL + "getMainWalletBalanceStream?customerId=" + localStorage.getItem('user_id') + "";
    if (this.source7 != undefined) {
      this.source7.close();
    }
    this.source7 = new EventSource(url);
    var result: any = new Object();
    this.source7.onmessage = (event: MessageEvent) => {
      result = event.data;
      result = JSON.parse(event.data);
      this.myBalanceListForOption = result.userBalance;
      let arr = [];
      for (let i = 0; i < this.myBalanceListForOption.length; i++) {
        if (this.myBalanceListForOption[i]['currencyType'] == 1) {
          arr.push(this.myBalanceListForOption[i])
        }
      }
      this.myBalanceListForOptionsSpot = arr;
      /*  let basecur = this.myBalanceList.filter(x => x.currencyCode == 'USD')
       this.usdbalance1 = basecur[0].closingBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
       this.fiatCurrencyId = basecur[0].currencyId; */

      if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }
    }
    // else{
    //   this.source7.close();
    // }
  }

  getAssetsForOptionsMargin() {
    this.http.get<any>(this.data.OPTIONSMARGINURL + 'fundingHomeView', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        let currenciesIso = response.P_ISO_MARGIN_CURRENCY;
        let currenciesCross = response.P_OPTIONS_MARGIN_CURRENCY;
        let currenciesFunding = response.P_FUNDING_CURRENCY;
        //this.fundingHomeView = response.P_CURRENCY;
        let arrCross = [];
        let arrFunding = [];

        for (let i = 0; i < currenciesCross.length; i++) {
          if (currenciesCross[i].CURRENCY_TYPE !== 1) {
            arrCross.push(currenciesCross[i])
          }
        }
        for (let i = 0; i < currenciesFunding.length; i++) {
          if (currenciesFunding[i].CURRENCY_TYPE !== 1) {
            arrFunding.push(currenciesFunding[i])
          }
        }
        console.log(arrCross)
        console.log(arrFunding)
        this.fundingHomeViewCrossForOption = arrCross
        this.fundingHomeViewFundingForOption = arrFunding
      })
  }


  faitmarginForOptions() {
    this.flag = true;
    this.http.get<any>(this.data.OPTIONSLENDINGURL + 'getMarginWalletByCurrency?customerId=' + localStorage.getItem('user_id') + '&currencyName=USD&marginType=' + this.selectedMarginTypeForOptions + '&leverage=' + this.selectedLeverageType, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        this.responsemargin = data;
        if (this.responsemargin.error != '1') {
          /*  this.data.alert("Balance is available", 'success'); */
          this.marginWalletBalance = this.responsemargin.marginWalletBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
          this.usedBalance = this.responsemargin.usedBalance;
          this.availableBalance = this.responsemargin.availableBalance.toFixed(this.getSpecificCurrencyPrecision('USD'));
          this.marginWalletid = this.responsemargin.marginWalletId;
        } else {
          this.marginWalletBalance = 0;
          this.usedBalance = 0;
          this.availableBalance = 0;
          this.data.alert("No Balance is Available Here", 'danger');
        }
        // this.main.getUserTransaction();
      })
  }

  somethingChangedForOption(event) {
    var bal = event
    this.flag = true;
    this.http.get<any>(this.data.OPTIONSLENDINGURL + 'getMarginWalletByCurrency?customerId=' + localStorage.getItem('user_id') + '&currencyName=' + bal + '&marginType=' + this.selectedMarginTypeForOptions + '&leverage=' + this.selectedLeverageType, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(responsemargin => {
        if (responsemargin.error != '1') {
          /*  this.data.alert("Balance is available", 'success'); */
          this.marginWalletBalanceForOption = responsemargin.marginWalletBalance.toFixed(this.getSpecificCurrencyPrecision(bal));
          this.usedBalanceForOption = responsemargin.usedBalance;
          this.availableBalanceForOption = responsemargin.availableBalance.toFixed(this.getSpecificCurrencyPrecision(bal));
          this.marginwalletIdForOption = responsemargin.marginWalletId;
          this.currencyIdForOption = responsemargin.currencyId;
          this.cryptoCurrencyForOption = responsemargin.currencyName;
        } else {
          this.marginWalletBalanceForOption = 0;
          this.usedBalanceForOption = 0;
          this.availableBalanceForOption = 0;
          this.data.alert("No Balance Available for " + bal + '', 'danger');
        }
        this.main.getUserTransaction();
      })
  }

  modalOpenOption(content, bal, cur, curId) {
    this.amount = bal;
    this.cryptoCurrency = cur;
    this.marginCurId = curId;
    this.assetPairList = [];
    this.assetPairForFunding = '';
    if (curId != undefined) {
      this.http.get<any>(this.data.OPTIONSMARGINURL + 'currencyWiseContractDetails?currencyId=' + curId, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token')
        }
      })
        .subscribe(data => {
          if (data.error != 0) {
            this.data.alert(data.message, 'error')
          } else {
            let fund = data.contractDetails;
            if (fund.length > 0) {
              this.showDropDownForContract = true;
              for (let i = 0; i < fund.length; i++) {
                //if(fund[i].assetPair == this.marginCurId){
                this.assetPairList.push(fund[i]);
                //}
              }
            } else {
              this.showDropDownForContract = false;
            }
            this.modalService.open(content);
          }
        })

    } else {
      this.modalService.open(content);
    }

  }

  fundBuyForOptions() {
    var dt = this.model;
    var objdata = null;
    if (parseInt(dt.day) < 10) {
      dt.day = '0' + dt.day
    }
    if (parseInt(dt.month) < 10) {
      dt.month = '0' + dt.month
    }
    objdata = {
      "customerId": localStorage.getItem('user_id'), "amount": this.send_amount, "currencyId": this.marginCurId,
      "unitPrice": 50, "returnDate": dt.day + '-' + dt.month + '-' + dt.year,
    };
    objdata['assetPair'] = this.cryptoCurrency.toUpperCase();
    if (this.assetPairForFunding == '') {
      objdata['baseCurrencyId'] = this.marginCurId
    } else {
      for (let i = 0; i < this.assetPairList.length; i++) {
        if (this.assetPairForFunding.toUpperCase() == this.assetPairList[i]['assetPair']) {
          objdata['baseCurrencyId'] = this.assetPairList[i]['baseCurrencyId'];
          break;
        }
      }
    }
    this.http.post<any>(this.data.OPTIONSMARGINURL + 'transferFund', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.returnId != 1) {
          this.data.alert(data.message, 'danger');
        } else {
          this.data.alert("Funding successful", 'success');
        }

        this.getUserTransactionBalanceForOptions();
        //  wip(0);
      })
  }

  lendingPriceForOptions() {
    var objdata = {
      "customerId": localStorage.getItem('user_id'),
      "amount": this.send_amount,
      "currencyId": this.marginCurId,
      "baseCurrencyId": this.fiatCurrencyId,
      "unitPrice": "0",
      "marginType": this.selectedMarginTypeForOptions,
    }
    if (this.selectedAssetPairForOptionMargin != undefined && this.selectedAssetPairForOptionMargin != '') {
      objdata['assetPair'] = this.selectedAssetPairForOptionMargin;
    } else {
      objdata['assetPair'] = this.cryptoCurrency.toUpperCase();
    }
    this.http.post<any>(this.data.OPTIONSLENDINGURL + 'transferBalanceToMWB', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.error == '1') {
          this.data.alert("Margin not successful", 'danger');
        } else {
          this.data.alert("Margin successful", 'success');
        }
        this.getUserTransactionBalance();

        this.getUserTransactionBalanceForOptions();
      });
  }

  assetlendingPriceForOptions() {
    this.selectedAssetPairForOptionMargin = this.cryptoCurrency.toUpperCase();
    var objdata = {
      "customerId": localStorage.getItem('user_id'),
      "amount": this.send_amount,
      "currencyId": this.fiatCurrencyId,
      "baseCurrencyId": this.fiatCurrencyId,
      "unitPrice": "0",
      "marginType": this.selectedMarginTypeForOptions
    }
    if (this.selectedAssetPairForOptionMargin != undefined && this.selectedAssetPairForOptionMargin != '') {
      objdata['assetPair'] = this.selectedAssetPairForOptionMargin;
    }
    this.http.post<any>(this.data.OPTIONSLENDINGURL + 'transferBalanceToMWB', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.returnId != '1') {
          this.data.alert(data.message, 'danger');
        } else {
          this.data.alert("Margin successful", 'success');
        }

        this.getUserTransactionBalanceForOptions();

      })
  }

  assetfundBuyForOptions() {
    var dt = this.model;
    var objdata = null;
    if (parseInt(dt.day) < 10) {
      dt.day = '0' + dt.day
    }
    if (parseInt(dt.month) < 10) {
      dt.month = '0' + dt.month
    }
    objdata = {
      "customerId": localStorage.getItem('user_id'), "amount": this.send_amount, "currencyId": this.fiatCurrencyId,
      "baseCurrencyId": this.fiatCurrencyId, "unitPrice": 50, "returnDate": dt.day + '-' + dt.month + '-' + dt.year,
    };
    objdata['assetPair'] = this.cryptoCurrency.toUpperCase();
    this.http.post<any>(this.data.OPTIONSMARGINURL + 'transferFund', JSON.stringify(objdata), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.returnId != 1) {
          this.data.alert(data.message, 'danger');
        } else {
          this.data.alert("Funding successful", 'success');
        }

        this.getUserTransactionBalanceForOptions();
      })
  }

  assetfundingmarginForOption() {
    this.assetfromdate = this.assetfromdate;
    this.assettodate = this.assettodate;
    if (parseInt(this.assetfromdate.day) < 10) {
      this.assetfromdate.day = '0' + this.assetfromdate.day
    }
    if (parseInt(this.assetfromdate.month) < 10) {
      this.assetfromdate.month = '0' + this.assetfromdate.month
    }
    if (parseInt(this.assettodate.day) < 10) {
      this.assettodate.day = '0' + this.assettodate.day
    }
    if (parseInt(this.assettodate.month) < 10) {
      this.assettodate.month = '0' + this.assettodate.month
    }
    var objdatafund = {
      "customerId": localStorage.getItem('user_id'),
      "currencyId": 1,
      "fromDate": `${this.assetfromdate.day}-${this.assetfromdate.month}-${this.assetfromdate.year}`,
      "toDate": `${this.assettodate.day}-${this.assettodate.month}-${this.assettodate.year}`,
    }
    this.http.post<any>(this.data.OPTIONSMARGINURL + 'fundingViewByInputValue', JSON.stringify(objdatafund), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        //this.fdata = data.fundingHomeResponseDtoList;
        let list = data.fundingHomeResponseDtoList;
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          let obj = [];
          obj['currencyName'] = list[i].currencyName;
          obj['lendingDate'] = list[i].lendingDate;
          obj['returnDate'] = list[i].returnDate;
          // console.log('CurrencyName',list[i].currencyName)
          if (list[i].currencyName == 'US Dollar') {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision('USD'));
          } else if (list[i].currencyName == 'BCC') {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision('BCH'));
          } else {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision(list[i].currencyName));
            // console.log(this.getSpecificCurrencyPrecision(list[i].currencyName));
          }
          arr.push(obj)
        }
        this.fdata = arr;
        console.log(this.fdata)
      })
  }

  modalUpFiatForOption(content) {
    if (this.assetfromdate && this.assettodate) {
      let totalToDate = this.assettodate.month + this.assettodate.year;
      let totalfromDate = this.assetfromdate.month + this.assetfromdate.year;
      if ((this.assettodate.year > this.assetfromdate.year) || (totalToDate > totalfromDate) ||
        (totalToDate == totalfromDate && this.assettodate.day > this.assetfromdate.day)) {
        this.modalService.open(content);
      }
      else {
        this.modalService.open('To Date Must be greater than from date!!');
      }
    } else {
      this.data.alert("Please Fill-up from date and to date both", 'danger');
    }
  }

  findingViewForInputServiseForOptions() {

    var ds = this.modelabc;
    var dp = this.modeldate;
    if (parseInt(ds.day) < 10) {
      ds.day = '0' + ds.day
    }
    if (parseInt(ds.month) < 10) {
      ds.month = '0' + ds.month
    }
    if (parseInt(dp.day) < 10) {
      dp.day = '0' + dp.day
    }
    if (parseInt(dp.month) < 10) {
      dp.month = '0' + dp.month
    }
    var objdatafund = {
      "customerId": localStorage.getItem('user_id'),
      "currencyId": parseInt(this.arrayy),
      "fromDate": `${ds.day}-${ds.month}-${ds.year}`,
      "toDate": `${dp.day}-${dp.month}-${dp.year}`,
    }

    this.http.post<any>(this.data.OPTIONSMARGINURL + 'fundingViewByInputValue', JSON.stringify(objdatafund), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        let list = data.fundingHomeResponseDtoList;
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          let obj = [];
          obj['currencyName'] = list[i].currencyName;
          obj['lendingDate'] = list[i].lendingDate;
          obj['returnDate'] = list[i].returnDate;
          //console.log('CurrencyName',list[i].currencyName)
          if (list[i].currencyName == 'US Dollar') {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision('USD'));
          } else if (list[i].currencyName == 'BCC') {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision('BCH'));
          } else {
            obj['amount'] = parseFloat(list[i].amount).toFixed(this.getSpecificCurrencyPrecision(list[i].currencyName));
          }
          arr.push(obj)
        }
        this.fundingdata = arr;
      })
  }

  assetmarginOptionmodal(content, bal, curId, marginwltid, from) {
    this.modalService.open(content);
    this.amount = bal;
    this.fiatid = curId;
    this.marginwalletId = marginwltid;
    this.assetMarginFor = from;
    //alert('for options'+' '+this.assetMarginFor)
  }

  cryptoholdingmarginForOption(content, cur1, bal, curId, cryptomarginwltid, operation) {
    this.modalService.open(content);
    this.cryptoCur = cur1;
    this.amount = bal;
    this.cryptoid = curId;
    if (this.cryptoid == undefined) {
      this.cryptoid = "";
    }
    this.cryptomarginwalletId = cryptomarginwltid;
    this.assetMarginFor = operation
  }

  modalbuyForOption(content, amount, curName, base_currency, assetCode, mpportfolioid, assetpair, leverage) {
    this.amount = amount;
    this.curencyName = curName;
    this.baseCurrencyName = base_currency;
    this.assetcode = assetCode;
    this.mpTransactionid = mpportfolioid;
    this.counterAssetPair = assetpair;
    this.counterLeverage = leverage
    this.modalService.open(content, { centered: true });
  }

  portfolioholdingBuyForOptions() {
    this.data.alert('Loading...', 'dark');
    this.data.selectedBuyingAssetText = localStorage.getItem('buying_crypto_asset')
    this.data.selectedSellingAssetText = localStorage.getItem('selling_crypto_asset')
    var onlyBuyAmount = this.amount;
    this.http.get<any>("https://options-socket.paybito.com/oSocketStream/api/marketPrice" + '?symbol=' + this.counterAssetPair + '&side=' + 'BID' + '&amount=' + onlyBuyAmount + '&marginType=' + this.selectedMarginTypeForOptions, {
      headers: {
        'Content-Type': 'application/json',
        //'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        if (result.statuscode != '0') {
          if (this.data.selectedSellingAssetText == 'USD') {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          } else {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          }
          $('.onlyBuyError').hide();
          $('#marketbuy').prop('disabled', false);
          var inputObj = {}
          inputObj['selling_asset_code'] = (this.baseCurrencyName).toUpperCase();
          inputObj['buying_asset_code'] = (this.curencyName).toUpperCase();
          inputObj['userId'] = localStorage.getItem('user_id');
          inputObj['uuid'] = localStorage.getItem('uuid');

          inputObj['price'] = this.onlyBuyPrice1;
          inputObj['txn_type'] = '1';
          inputObj['marginType'] = this.selectedMarginTypeForOptions;
          inputObj['assetPair'] = this.counterAssetPair;
          inputObj['leverage'] = this.counterLeverage;
          var jsonString = JSON.stringify(inputObj);
          /* this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .subscribe(response => {
              var result = response;
              if (result.error.error_data != '0') {
                this.data.alert(result.error.error_msg, 'warning');
                $('.tradeBtn').attr('disabled', true);
              } else { */
          var inputObj = {};
          // inputObj['userId'] = localStorage.getItem('user_id');
          inputObj['selling_asset_code'] = (this.baseCurrencyName).toUpperCase();
          inputObj['buying_asset_code'] = (this.curencyName).toUpperCase();
          inputObj['amount'] = parseFloat(onlyBuyAmount);
          inputObj['price'] = this.onlyBuyPrice1;
          inputObj["offerType"] = 'P';
          inputObj['txn_type'] = '1';
          inputObj['assetCode'] = this.assetcode;
          inputObj['portfolioId'] = this.mpTransactionid;
          //inputObj['marginType'] = this.selectedMarginTypeForOptions;
          inputObj['assetPair'] = this.counterAssetPair;
          inputObj['leverage'] = this.counterLeverage;
          inputObj['uuid'] = localStorage.getItem('uuid')
          var jsonString = JSON.stringify(inputObj);
          if ((this.onlyBuyPrice1 * onlyBuyAmount) >= .001) {
            this.http.post<any>(this.data.WEBSERVICE + '/optionsTrade/TradeCreateOffer', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
              }
            })
              .subscribe(data => {
                this.data.loader = false;
                var result = data;
                if (result.error.error_data != '0') {
                  this.data.alert(result.error.error_msg, 'danger');
                  //this.data.reloadPage(this.route.url);
                } else {
                  this.marginReset();
                  this.data.alert(result.error.error_msg, 'success');
                  localStorage.setItem('last_selected_tab_of_wallet', 'margin')
                  this.data.reloadPage(this.route.url);
                }
                //this.marginReset();
              });
          } else {
            this.marginReset();
            this.data.loader = false;
            this.data.alert('Offer Value is lesser than permissible value', 'warning');
          }
          //   }


          // });
        }
        else {
          this.data.alert(result.message, 'danger');
        }
      })
  }

  portfolioholdingSellForOptions() {
    this.data.alert('Loading...', 'dark');
    this.data.selectedBuyingAssetText = localStorage.getItem('buying_crypto_asset')
    this.data.selectedSellingAssetText = localStorage.getItem('selling_crypto_asset')
    var onlySellAmount = this.amount;

    this.http.get<any>("https://options-socket.paybito.com/oSocketStream/api/marketPrice" + '?symbol=' + this.counterAssetPair + '&side=' + 'ASK' + '&amount=' + onlySellAmount + '&marginType=' + this.selectedMarginTypeForOptions, {
      headers: {
        'Content-Type': 'application/json',
        //'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        if (result.statuscode != '0') {
          if (this.data.selectedSellingAssetText == 'USD') {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          } else {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          }
          $('.onlyBuyError').hide();
          $('#marketbuy').prop('disabled', false);
          var inputObj = {}
          inputObj['selling_asset_code'] = (this.curencyName).toUpperCase();
          inputObj['buying_asset_code'] = (this.baseCurrencyName).toUpperCase();
          inputObj['userId'] = localStorage.getItem('user_id');
          inputObj['price'] = this.onlyBuyPrice1;
          inputObj['txn_type'] = '1';
          inputObj['marginType'] = this.selectedMarginTypeForOptions;
          inputObj['assetPair'] = this.counterAssetPair;
          inputObj['leverage'] = this.counterLeverage;
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
          inputObj['selling_asset_code'] = (this.curencyName).toUpperCase();
          inputObj['buying_asset_code'] = (this.baseCurrencyName).toUpperCase();
          inputObj['amount'] = parseFloat(onlySellAmount);
          inputObj['price'] = this.onlyBuyPrice1;
          inputObj["offerType"] = 'P';
          inputObj['txn_type'] = '2';
          inputObj['assetCode'] = this.assetcode;
          inputObj['portfolioId'] = this.mpTransactionid;
          //inputObj['marginType'] = this.selectedMarginTypeForOptions;
          inputObj['assetPair'] = this.counterAssetPair;
          inputObj['leverage'] = this.counterLeverage;
          inputObj['uuid'] = localStorage.getItem('uuid')
          var jsonString = JSON.stringify(inputObj);
          if ((this.onlyBuyPrice1 * onlySellAmount) >= .001) {
            this.http.post<any>(this.data.WEBSERVICE + '/optionsTrade/TradeCreateOffer', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
              }
            })
              .subscribe(data => {
                this.data.loader = false;
                var result = data;
                if (result.error.error_data != '0') {
                  this.data.alert(result.error.error_msg, 'danger');
                  // this.data.reloadPage(this.route.url);
                } else {
                  this.marginReset();
                  this.data.alert(result.error.error_msg, 'success');
                  localStorage.setItem('last_selected_tab_of_wallet', 'margin')
                  this.data.reloadPage(this.route.url);
                }
                //this.marginReset();
              });
          } else {
            this.marginReset();
            this.data.loader = false;
            this.data.alert('Offer Value is lesser than permissible value', 'warning');
          }
          /*   }


          }); */
        }
        else {
          this.data.alert(result.message, 'danger');
        }
      })
  }

  renderOptionsBalance = (param) => {
    this.data.alert('Loading...', 'dark');
    this.http.get<any>(this.data.WEBSERVICE + '/optionsTrade/userOptionsBalance?userId=' + localStorage.getItem('user_id') + '&walletType=' + param, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        if (result.statusCode === 0) {
          if (param === this.contractName1) {
            this.getPerpetualTxnList = result.userFuturesBalanceList
          } else if (param === this.contractName2) {
            this.getCurrentQuartTxnList = result.userFuturesBalanceList
          } else if (param === this.contractName3) {
            this.getNextQuartTxnList = result.userFuturesBalanceList
          }

        } else {
          this.data.alert(result.message, 'danger');
        }
      })
  }

  getContractDetailsForOptions = () => {
    //this.data.alert('Loading...', 'dark');
    this.http.get<any>(this.data.WEBSERVICE + '/optionsTrade/getContractsName')
      .subscribe(data => {
        var result = data;
        if (result.statusCode === 0) {
          this.contractListOptions = result.contractList;
          let contract = this.contractListOptions;
          console.log(contract)


          console.log(contract[0]['contractTypeId'])
          this.selectedContractTypeIdForOptions = contract[0]['contractTypeId'];
          this.userPortfolioBalanceForOption();
        } else {
          //alert('here')
          this.data.alert(result.message, 'danger');
          //document.body.classList.remove("overlay")
        }
      })
  }

  handleMarginTypeForOptionPortfolio = (param) => {
    this.selectedMarginTypeForOptions = param;
    this.userPortfolioBalanceForOption();
    this.portfolioDeatilsForOption();
  }

  userPortfolioBalanceForOption() {
    document.body.classList.add("overlay")
    var url = this.data.OPTIONSMARGINURL + "userPortfolioBalance?customerId=" + localStorage.getItem('user_id') + "&marginType=" + this.selectedMarginTypeForOptions + "&contractTypeId=" + this.selectedContractTypeIdForOptions;
    this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        this.portfolioBalanceForOptionPerpetual = data.userBalance;
        this.portfolioBalanceForOptionCurrentQuarter = data.userBalance;
        this.portfolioBalanceForOptionNextQuarter = data.userBalance;
        document.body.classList.remove("overlay")
      }, error => {
        document.body.classList.remove("overlay")
      })
  }
  portfolioDeatilsForOption() {
    document.body.classList.add("overlay")
    var url = this.data.OPTIONSMARGINURL + "portfolioDetails?customerId=" + localStorage.getItem('user_id') + "&marginType=" + this.selectedMarginTypeForOptions;
    this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        this.portfolioHeadersForOption = response.header
        //TODO: show as per as contact id
        let values = response.values
        let arrOpt = [];

        if (values.length != 0) {
          for (let i = 0; i < values.length; i++) {
            if (values[i].contractTypeId == this.selectedContractTypeIdForOptions) {
              arrOpt.push(values[i])
            }
          }
          this.opgn = [];
          for (let i = 1; i <= Math.ceil(this.ototalCount / 20); i++) {
            this.opgn.push(i);
          }
        } else {
          arrOpt = [];

        }
        this.portfolioValueForOptionContract1 = arrOpt;


        console.log('---------------------------------------')
        document.body.classList.remove("overlay")

      }, error => {
        document.body.classList.remove("overlay")
      })
  }

  autoToggleFinalTabForOption = (param) => {
    let key = ''
    console.log(this.finalTabForOptions)
    if (this.finalTabForOptions == 'position') {
      key = 'Position'
    } else {
      key = 'Portfolio'
    }
    console.log(param + key)
    //$('#'+param+key).click();
    this.ctdTabset.select(param + key);
    this.finalActiveTabSetForOption = param + key;
  }

  handleSelectTabForOption = (param) => {
    this.finalTabForOptions = param
  }

  handleContractTypeSelectionForOption = (id) => {
    this.selectedContractTypeIdForOptions = id
    this.userPortfolioBalanceForOption();
    this.portfolioDeatilsForOption();

  }

  //  Get number of decimal points

  decimalCount = (num) => {
    // Convert to String
    const numStr = String(num);
    // String Contains Decimal
    if (numStr.includes('.')) {
      return numStr.split('.')[1].length;
    };
    // String Does Not Contain Decimal
    return 0;
  }

  // validate precision points

  checkAmoutPrecision(cr, amount, type) {

    var precision = this.getSpecificCurrencyPrecision(cr)

    console.log('precision', precision);

    var decimalCount = this.decimalCount(amount)

    console.log('decimalCount', decimalCount);


    if (precision == 0) {
      var t = amount;
      amount = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), precision + 1)) : t;

      amount = amount.replace('.', '')
      if (type == 'WALLET') {
        this.paybito_amount = amount
      }
      else {
        this.other_amount = amount
      }
    }

    else {
      var t = amount;
      amount = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), precision + 1)) : t;
      if (type == 'WALLET') {
        this.paybito_amount = amount
      }
      else {
        this.other_amount = amount
      }

    }



  }

  /* Method defination for getting Fiat rate */
  handleFiatRate = (list) => {

    for (let i = 0; i < list.length; i++) {
      if (list[i].currencyType == 1) {
        this.http.get('https://v6.exchangerate-api.com/v6/780e118e654b80b4f67594ed/latest/' + list[i].currencyCode.toUpperCase(), {
          headers: {
            //"Content-Type": "application/json",
            //"Access-Control-Allow-Headers": "*",
            // "Access-Control-Allow-Credentials": "true",
            // 'authorization': 'BEARER ' + localStorage.getItem('access_token'),
          },
        }).subscribe((res: any) => {
          let obj: any = {}
          if (res.result != "success") {
            this.data.alert(res.result, 'error');
          } else {
            let rates = res.conversion_rates
            obj = {
              rate: rates['USD'],
              currencyCode: list[i].currencyCode,
            }
            this.fiatRateArray.push(obj);
          }
        })
      }
    }

  }

  getNumber(e) {
    console.log('phone number', e);

  }
  telInputObject(e) {
    console.log('telInputObject', e);

  }

  onCountryChange(e) {
    console.log('countryCode', e);
    this.selectedCountryPhone = e.dialCode
    this.checkPhone()

    // phoneObj['phone'] = this.selectedCountryPhone + phoneValue;


  }


  checkPhone() {
    //this.paybito_phone = this.selectedCountryPhone+this.paybito_phone;
  }


  marketTypeNavSeve(e) {
    localStorage.setItem('walletMarketTpeNavHist', e)

  }
  futureChildNavHist(e) {
    localStorage.setItem('futureChildNavHist', e)

  }
  saveOptionChildNavHist(e) {
    localStorage.setItem('optionChildNavHist', e)

  }
  getOptionChildNavHist() {
    var hist2 = localStorage.getItem('optionChildNavHist');
    if (hist2 == null || hist2 == undefined || hist2 == '') {
      hist2 = 'stopWallet'
      // this.handleSelectMarginType(1); 
      // this.handleSelectedTab('futuresWalletIso')
    }


    this.optionChild = hist2;


  }

  getFutureChildNavHist() {
    var hist1 = localStorage.getItem('futureChildNavHist');
    if (hist1 == null || hist1 == undefined || hist1 == '') {
      hist1 = 'futuresWalletIsoTab'
      // this.handleSelectMarginType(1); 
      // this.handleSelectedTab('futuresWalletIso')
    }
    if (hist1 == 'futuresWalletIsoTab') {
      this.handleSelectMarginType(1);
      this.handleSelectedTab('futuresWalletIso')
    }
    else {
      this.handleSelectMarginType(2);
      this.handleSelectedTab('futuresWalletCross')
    }

    this.futureChild = hist1;


  }

  getWalletMarketTypeNavHist() {

    var hist = localStorage.getItem('walletMarketTpeNavHist');
    if (hist == null || hist == undefined || hist == '') {
      hist = 'spot'
    }

    this.activeIdString = hist;

    if (this.activeIdString == 'future') {
      this.handleSelectedTab('futures');
      this.callMethodsOnFutureTabLoad();
      this.portfolioDeatilsForFutureOnTabHistCall();

    }
    if (this.activeIdString == 'spot') {
      this.handleSelectedTab('spot')
    }
    if (this.activeIdString == 'options') {
      this.callMethodsOnOptionsTabLoad()
    }

  }

  restrictMinMaxAmount(min,max){
    console.log('min',min);
    console.log('min',max);

    if(this.other_amount < min || this.other_amount > max){

      this.sendTowalletButtonStatus = false;

    }
    else{

      this.sendTowalletButtonStatus = true;


    }

    
  }




}