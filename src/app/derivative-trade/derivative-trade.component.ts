import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Optional, Input } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, interval } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { Subscription } from 'rxjs';
import { DerivativeDashboardComponent } from '../derivative-dashboard/derivative-dashboard.component';
import { DerivativeStoplossComponent } from '../derivative-stoploss/derivative-stoploss.component';

@Component({
  selector: 'app-derivative-trade',
  templateUrl: './derivative-trade.component.html',
  styleUrls: ['./derivative-trade.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DerivativeTradeComponent implements OnInit {
  url: any;
  currency: any;
  selectedSellingAssetText: any;
  selectedBuyingAssetText: any;
  marketTradeBodyHtml: any;
  transactionType: any;
  myTradeTableDisplayStatus: any;
  CreditCurrencyAmount: any;
  CreditBaseAmount: any;
  selectedCurrency: any;
  indentificationStatus: any;
  bankDetailStatus: any;
  historyTableTr: any;
  myOfferRecordsHtml: Observable<any>;
  closeResult: string;
  modifyAmount: any;
  tabmodifyamount: any;
  modifyPrice: any;
  tabmodifyPrice: any;
  modifyVolume: any;
  tabmodifyVolume: any;
  manageOfferId: any;
  modifyType: any;
  delOfferId: any;
  delTxnType: any;
  delPrice: any;
  loader: boolean;
  dateString: string;
  dateStringArr: any;
  stopLossTableDisplayStatus: number;
  selldata: any = 0;
  flag: string;
  modifySlAmount: number;
  modifySlPrice: number;
  modifySlTrigger: number;
  marketOrderPrice: number;
  stopLossSellingAsset: any;
  stopLossBuyingAsset: any;
  stopLossOfferId: any;
  stopLossQty: any;
  modifySlOffer: any;
  buydata: any;
  delbal: any;
  tradeInterval: any;
  buyingAssetIssuer: any;
  sellingAssetIssuer: any;
  marketTradeRecords: any;
  itemcount: any;
  source: any;
  public tradehistrybyId: any;
  public tradeofferbyId: any;
  offerbyId: any;
  backupdata: any;
  stoploss;
  value: any;
  tradem: any;
  tradep: any;
  private countryApi: Subscription;
  private stoplossdelapi: Subscription;
  private offerpricechkapi: Subscription;
  private trademangeoffrapi: Subscription;
  private trademngofferapi: Subscription;
  private getamntapi: Subscription;
  private modifystoplossapi: Subscription;
  private stoploss2api: Subscription;
  public flag1: boolean = false;
  public flag2: boolean = false;
  public flag3: boolean = false;
  public flag4: boolean = false;
  public Nodata1: boolean = false;
  public Nodata2: boolean = false;
  isloading = false;
  public modifyLeverage:any;
  public modifyMarginType:any;
  public delLeverage:any;
  public delMarginType:any;
  selectedTab: any = '1';
  // public Themecolor: any;
  selectedCounterBuySellTxn : any;
  selectedCounterType:any
  exchangeFees: Array<string> = [];
  userExchnageFee : Object = {};
  selectedCounterCurrencyPrecision:any;
  selectedBaseCurrencyPrecision:any;
  buySellDivStatus: boolean = true;
  tradeofferbyIdBuy: any = [];
  tradeofferbyIdSell: any = [];
  filterMyOfferStatus: any = 'ALL';

  myTradeTableAllPairs: boolean = false;
  myOfferTableAllPairs: boolean = false;
  tradehistrybyIdNewData: any;
  tradeofferbyIdNewData: any;

  @Input() Themecolor = 'Dark';
  activeIdString: string;
  
  constructor(public data: CoreDataService,
    private http: HttpClient,
    private modalService: NgbModal,
    private nav: NavbarComponent,
    public dash: DerivativeDashboardComponent,
    private _StopLossComponent: DerivativeStoplossComponent,
    @Optional() private ref: ChangeDetectorRef) { }

  ngOnInit() {
    var theme = localStorage.getItem('themecolor');
    this.getTradeNavHist()
    this.Themecolor = theme;
    this.data.getAllPrecision();
    /* calling API to render data before event source for my trade, my offer and stop limit */
    this.data.renderDataForMyTradeFutures();

    /** setting precision for selected **/
    this.selectedCounterCurrencyPrecision = this.data.getSpecificCurrencyPrecision(localStorage.getItem('buying_crypto_asset').toUpperCase())
    this.selectedBaseCurrencyPrecision = this.data.getSpecificCurrencyPrecision(localStorage.getItem('selling_crypto_asset').toUpperCase())

    this.data.currentMessage1.subscribe(message1 => {
      if (message1) {
        this.tradem = message1;
      }
    });

    this.data.currentMessage2.subscribe(message2 => {
      if (message2) {
        this.tradep = message2;
      }
    });

    this.isloading = true;
    setTimeout(() => {
      this.isloading = false;
        // this.GetTradeDetail();
        this.data.renderDataForMyTradeFutures()

    }, 1000);
    this.myTradeTableDisplayStatus = 0;
    //this.getOfferLists();
    setTimeout(() => {
      document.body.classList.remove("overlay");
    }, 6000);
  }

  themeChange(val){
    this.Themecolor = val;
    
  }

  filterMyOffer(text_type){
    this.filterMyOfferStatus = text_type;

    if(text_type == 'ALL'){
      $('.txnrow').show();
  
    }
    else if(text_type == 1){
      $('.typeBuy').show();
      $('.typeSell').hide();
    }
    else{
      $('.typeBuy').hide();
      $('.typeSell').show();
    }

    }

  ngDoCheck() {
    // this.Themecolor = localStorage.getItem('themecolor');
    // console.log('new theme is ',this.Themecolor);
    

    this.changemode();
    this.tradehistrybyId  = this.data.futuresMyTradeData;
    this.tradeofferbyId  = this.data.futuresMyOfferData;
    this.buydata = this.data.futuresSpotLimitBuyData;
    this.selldata = this.data.futuresSpotLimitSellData;
    /** setting precision for selected **/
    this.selectedCounterCurrencyPrecision = this.data.getSpecificCurrencyPrecision(localStorage.getItem('buying_crypto_asset').toUpperCase())
    this.selectedBaseCurrencyPrecision = this.data.getSpecificCurrencyPrecision(localStorage.getItem('selling_crypto_asset').toUpperCase())

    if(this.tradeofferbyId == undefined){
      this.tradeofferbyId = []
    }
    else{
      this.tradeofferbyIdBuy = this.tradeofferbyId.filter(function (e) {
      return e.txn_type == 1;
  });

  this.tradeofferbyIdSell = this.tradeofferbyId.filter(function (e) {
    return e.txn_type == 2;
});
    }
  }

  getTradePrice(m) {
    return (parseFloat(m.price)).toFixed(parseInt(this.selectedCounterCurrencyPrecision));
  }

  getTradeAmount(m) {
    return (parseFloat(m.amount)).toFixed(parseInt(this.selectedCounterCurrencyPrecision));
  }

  changemode() {
    if (this.data.changescreencolor == true) {
      $(".bg_new_class").removeClass("bg-dark").css("background-color", "#fefefe");
      $(".bg-black").css("background-color", "transparent");
      $(".btn").css("color", "#000");
      $(".text-blue").css("color", "black");
    }
    else {
      $(".bg_new_class").removeClass("bg-dark").css("background-color", "#16181a");
      $(".bg-black").css("background-color", "transparent");
      $(".btn").css("color", "#fff");
      $(".text-blue").css("color", "white");

    }
  }


  randomNoForOrderBook(minVal: any, maxVal: any): number {
    var minVal1: number = parseInt(minVal);
    var maxVal1: number = parseInt(maxVal);
    return Math.floor(Math.random() * (maxVal1 - minVal1 + 2) + minVal1);
  }

  reload() {
    this.GetTradeDetail();
    this.data.renderDataForMyTradeFutures()
    //this.getOfferLists();
  }

  GetTradeDetail() {
    // var userId = localStorage.getItem('user_id');
    // this.flag1 = false;
    // //var url="https://stream.paybito.com/FStreamingApi/rest/getTradeHistoryById?userID="+userId+"&buyingAssetCode="+this.data.selectedBuyingAssetText.toLowerCase()+"&sellingAssetCode="+this.data.selectedSellingAssetText.toLowerCase()+"&pageNo=1&noOfItemsPerPage=10";
    // var url = "https://stream.paybito.com/StreamingApi/rest/getFTradeHistoryById?userID=" + userId + "&assetPair=" + localStorage.getItem("selected_derivative_asset_pair") + "&pageNo=1&noOfItemsPerPage=10";
    // if (this.data.source4 != undefined) {
    //   this.data.source4.close();
    // }
    // if (this.data.source5 != undefined) {
    //   this.data.source5.close();
    // }
    // if (this.data.source6 != undefined) {
    //   this.data.source6.close();
    // }
    // if (this.data.source7 != undefined) {
    //   this.data.source7.close();
    // }
    // if (url != "") {
    //   this.flag1 = true;
    //   this.data.source4 = new EventSource(url);
    //   var result: any = new Object();
    //   //console.log(this.data.source4)
    //   this.data.source4.onmessage = (event: MessageEvent) => {
    //     console.log('*****************************')
    //     var response = JSON.parse(event.data);
    //     console.log(response)
    //     this.flag1 = false;
    //     this.tradehistrybyId = response.tradeListResult;
    //     console.log(this.tradehistrybyId)
    //     if (this.tradehistrybyId == null) {
    //       this.flag1 = false
    //       this.Nodata1 = true;
    //     }
    //     else {
    //       this.flag2 = false;
    //       this.Nodata1 = false;
    //     }
    //   }
    // }
  }

  myTradeDisplay(value) {
    this.myTradeTableDisplayStatus = value;
    if (this.myTradeTableDisplayStatus == 0) {
      // this.GetTradeDetail();
      this.data.renderDataForMyTradeFutures();

      $('#myTradeBody').children('.filter').show();
      $('.trade').show();

    }
    if (this.myTradeTableDisplayStatus == 1) {
      if (this.data.source4 != undefined) {
        this.data.source4.close();
      }
      $('#myTradeBody').children('.filter').show();
      $('#myTradeBody').children('tr.sell').hide();

      $('.tradebuy').show();
      $('.tradesell').hide();
    }
    if (this.myTradeTableDisplayStatus == 2) {
      if (this.data.source4 != undefined) {
        this.data.source4.close();

      }
      $('#myTradeBody').children('.filter').show();
      $('#myTradeBody').children('tr.buy').hide();
      $('.tradebuy').hide();
      $('.tradesell').show();
    }
  }

  getOfferLists() {
    // this.tradeofferbyId = "";
    // this.flag2 = false;
    // var userId = localStorage.getItem('user_id');
    // // var url="https://stream.paybito.com/FStreamingApi/rest/getOfferByAccountID?userID="+userId+"&buyingAssetCode="+this.data.selectedBuyingAssetText.toLocaleLowerCase()+"&sellingAssetCode="+this.data.selectedSellingAssetText.toLowerCase()+"&pageNo=1&noOfItemsPerPage=10";
    // var url = "https://stream.paybito.com/StreamingApi/rest/getFOffersByAccountID?userID=" + userId + "&assetPair=" + localStorage.getItem("selected_derivative_asset_pair");
    // if (this.data.source4 != undefined) {
    //   this.data.source4.close();

    // }
    // if (this.data.source5 != undefined) {

    //   this.data.source5.close();
    // }

    // if (this.data.source6 != undefined) {
    //   this.data.source6.close();
    // }
    // if (this.data.source7 != undefined) {
    //   this.data.source7.close();
    // }
    // if (url != "") {
    //   this.flag2 = true;
    //   this.data.source5 = new EventSource(url);
    //   var result: any = new Object();
    //   this.data.source5.onmessage = (event: MessageEvent) => {
    //     var response = JSON.parse(event.data);
    //     this.flag2 = false;
    //     console.log(response.tradeListResult)
    //     this.tradeofferbyId = response.tradeListResult;
    //     if (!this.ref['destroyed']) {
    //       this.ref.detectChanges();
    //     }
    //     if (this.tradeofferbyId == null) {
    //       this.flag2 = false;
    //       this.Nodata2 = true;
    //     }
    //     else {
    //       this.flag2 = false;
    //       this.Nodata2 = false;
    //     }
    //   }
    // }
  }

  getOfferDetails(content, offerId) {
    document.body.classList.add("overlay")
    var inputObj = {};
    this.data.alert('Loading...', 'dark');
    inputObj['offer_id'] = offerId;
    inputObj['userId'] = localStorage.getItem('user_id');
    var jsonString = JSON.stringify(inputObj);
    this.http.post<any>(this.data.WEBSERVICE + '/fTrade/GetOfferByID', jsonString, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(response => {
        document.body.classList.remove("overlay")
        this.data.loader = false;
        var result = response;
        this.backupdata = { ...result };
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          this.manageOfferId = offerId;

          this.modifyAmount = parseFloat(result.tradeResult.amount);
          this.tabmodifyamount = parseFloat(result.tradeResult.amount);
          this.modifyPrice = parseFloat(result.tradeResult.price);
          this.tabmodifyPrice = parseFloat(result.tradeResult.price);
          this.tabmodifyVolume = parseFloat(this.tabmodifyamount) * parseFloat(this.tabmodifyPrice);
          this.modifyVolume = parseFloat(this.modifyAmount) * parseFloat(this.modifyPrice);
          this.modifyType = result.tradeResult.txn_type;
          this.modifyLeverage = result.tradeResult.leverage
          this.modifyMarginType = result.tradeResult.marginType
          this.modalService.open(content, { centered: true });
        }
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        } else this.data.alert('Could Not Connect To Server', 'danger');
      });
  }

  getmarginOfferDetails(content, offerId) {
    document.body.classList.add("overlay")
    var inputObj = {};
    this.data.alert('Loading...', 'dark');
    inputObj['offer_id'] = offerId;
    inputObj['userId'] = localStorage.getItem('user_id');
    var jsonString = JSON.stringify(inputObj);
    this.http.post<any>(this.data.WEBSERVICE + '/fTrade/GetOfferByID', jsonString, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(response => {
        document.body.classList.remove("overlay")
        this.data.loader = false;
        var result = response;
        this.backupdata = { ...result };
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          this.manageOfferId = offerId;

          this.modifyAmount = parseFloat(result.tradeResult.amount);
          this.tabmodifyamount = parseFloat(result.tradeResult.amount);
          this.modifyPrice = parseFloat(result.tradeResult.price);
          this.tabmodifyPrice = parseFloat(result.tradeResult.price);
          this.tabmodifyVolume = parseFloat(this.tabmodifyamount) * parseFloat(this.tabmodifyPrice);
          this.modifyVolume = parseFloat(this.modifyAmount) * parseFloat(this.modifyPrice);
          this.modifyType = result.tradeResult.txn_type;
          this.modifyLeverage = result.tradeResult.leverage;
          this.modifyMarginType = result.tradeResult.marginType
          this.modalService.open(content, { centered: true });
        }
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        } else this.data.alert('Could Not Connect To Server', 'danger');
      });
  }


  manageOfferPrice() {
    this.data.alert("Loading...", "dark");
    var inputObjPC = {};
    if (this.modifyType == 1) {
     /*  inputObjPC[
        "selling_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedBuyingAssetText.toUpperCase(); */
      inputObjPC['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.modifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }
    else {
      /* inputObjPC[
        "selling_asset_code"
      ] =this.data.selectedBuyingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase(); */ //
      inputObjPC['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.modifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }

    var jsonString = JSON.stringify(inputObjPC);
    // this.offerpricechkapi = this.http
    //   .post<any>(
    //     this.data.WEBSERVICE + "/fTrade/OfferPriceCheck",
    //     jsonString,
    //     {
    //       headers: {
    //         "Content-Type": "application/json"
    //       }
    //     }
    //   )
    //   .subscribe(response => {

    //     var result = response;
    //     if (result.error.error_data != "0") {
    //       this.data.alert(result.error.error_msg, "warning");
    //       $(".tradeBtn").attr("disabled", true);
    //     } else {

          var inputObj = {};
          inputObj["offer_id"] = this.manageOfferId;
          inputObj["userId"] = localStorage.getItem("user_id");
          if (this.modifyType == 1) {
            inputObj["selling_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
            inputObj["buying_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
            inputObj["assetPair"] = localStorage.getItem("selected_derivative_asset_pair");
          } else {
            inputObj["buying_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
            inputObj["selling_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
            inputObj["assetPair"] = localStorage.getItem("selected_derivative_asset_pair");
          }
          inputObj["amount"] = this.modifyAmount;
          inputObj["price"] = this.modifyPrice;
          inputObj["txn_type"] = this.modifyType;
          inputObj["leverage"] = this.modifyLeverage;
          if(parseInt(this.modifyLeverage) > 1){
            inputObj["marginType"] = this.modifyMarginType;
          }
          inputObj["offerType"] = 'L';
          inputObj['uuid'] = localStorage.getItem('uuid')
          var jsonString = JSON.stringify(inputObj);
          this.trademangeoffrapi = this.http
            .post<any>(
              this.data.WEBSERVICE + '/fTrade/TradeManageOffer',
              jsonString,
              {
                headers: {
                  "Content-Type": "application/json",
                  authorization: "BEARER " + localStorage.getItem("access_token")
                }
              }
            )
            .subscribe(
              response => {
                var result = response;
                this.data.loader = false;
                if (result.error.error_data != "0") {
                  this.data.alert(result.error.error_msg, "danger");
                } else {
                  $(".reset").click();
                  this.data.alert(result.error.error_msg, "success");
                  this.GetTradeDetail();
                  this.data.renderDataForMyTradeFutures()

                  //this.getOfferLists();
                  $("#trade").click();
                }
              },
              reason => {
                if (reason.error.error == "invalid_token") {
                  this.data.logout();
                  this.data.alert("Session Timeout. Login Again", "warning");
                }
              }
            );
      //   }
      // })
  }

  manageOfferAmount() {
    this.data.alert("Loading...", "dark");
    var inputObjPC = {};
    if (this.modifyType == 1) {
      /* inputObjPC[
        "selling_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedBuyingAssetText.toUpperCase(); */
      inputObjPC['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.tabmodifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }
    else {
      /*  inputObjPC[
         "selling_asset_code"
       ] =this.data.selectedBuyingAssetText.toUpperCase();
       inputObjPC[
         "buying_asset_code"
       ] = this.data.selectedSellingAssetText.toUpperCase(); */ //
      inputObjPC['assetPair'] = localStorage.getItem('selected_derivative_asset_pair')
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.tabmodifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }

    var jsonString = JSON.stringify(inputObjPC);
    // this.offerpricechkapi = this.http
    //   .post<any>(
    //     this.data.WEBSERVICE + "/fTrade/OfferPriceCheck",
    //     jsonString,
    //     {
    //       headers: {
    //         "Content-Type": "application/json"
    //       }
    //     }
    //   )
    //   .subscribe(response => {

    //     var result = response;
    //     if (result.error.error_data != "0") {
    //       this.data.alert(result.error.error_msg, "warning");
    //       $(".tradeBtn").attr("disabled", true);
    //     } else {

          var inputObj = {};
          inputObj["offer_id"] = this.manageOfferId;
          inputObj["userId"] = localStorage.getItem("user_id");
          if (this.modifyType == 1) {
            inputObj["selling_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
            inputObj["buying_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
            inputObj["assetPair"] = localStorage.getItem("selected_derivative_asset_pair");
          } else {
            inputObj["buying_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
            inputObj["selling_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
            inputObj["assetPair"] = localStorage.getItem("selected_derivative_asset_pair");
          }
          inputObj["amount"] = this.tabmodifyamount;
          inputObj["price"] = this.tabmodifyPrice;
          inputObj["txn_type"] = this.modifyType;
          inputObj["leverage"] = this.modifyLeverage;
          if(parseInt(this.modifyLeverage) > 1){
          inputObj["marginType"] = this.modifyMarginType;
          }
          inputObj["action"] = 'amountupdate';
          inputObj["offerType"] = 'L';
          inputObj['uuid'] = localStorage.getItem('uuid')
          var jsonString = JSON.stringify(inputObj);
          this.trademangeoffrapi = this.http
            .post<any>(
              this.data.WEBSERVICE + '/fTrade/TradeManageOffer',
              jsonString,
              {
                headers: {
                  "Content-Type": "application/json",
                  authorization: "BEARER " + localStorage.getItem("access_token")
                }
              }
            )
            .subscribe(
              response => {
                var result = response;
                this.data.loader = false;
                if (result.error.error_data != "0") {
                  this.data.alert(result.error.error_msg, "danger");
                } else {
                  $(".reset").click();
                  this.data.alert(result.error.error_msg, "success");
                  this.GetTradeDetail();
                  this.data.renderDataForMyTradeFutures()
                  //this.getOfferLists();
                  $("#trade").click();
                }
              },
              reason => {
                if (reason.error.error == "invalid_token") {
                  this.data.logout();
                  this.data.alert("Session Timeout. Login Again", "warning");
                }
                // else this.data.alert("Could Not Connect To Server", "danger");
              }
            );
      //   }

      // })

  }

  amounttab(e) {
    this.modifyAmount = parseFloat(this.backupdata.tradeResult.amount);
    this.tabmodifyamount = parseFloat(this.backupdata.tradeResult.amount);
    this.modifyPrice = parseFloat(this.backupdata.tradeResult.price);
    this.tabmodifyPrice = parseFloat(this.backupdata.tradeResult.price);
    this.tabmodifyVolume = parseFloat(this.tabmodifyamount) * parseFloat(this.tabmodifyPrice);
    this.modifyVolume = parseFloat(this.modifyAmount) * parseFloat(this.modifyPrice);
    this.modifyType = this.backupdata.tradeResult.txn_type;
  }

  deleteTrade(content, offerId, txnType, price, amount,margin,leverage) {
    this.delOfferId = offerId;
    this.delTxnType = txnType;
    this.delPrice = price;
    this.delbal = amount;
    this.delMarginType = margin;
    this.delLeverage = leverage;
    this.modalService.open(content, { centered: true });
  }

  delOffer() {
    this.data.alert('Loading...', 'dark');
    $('.load').fadeIn();
    var inputObj = {};
    inputObj['offer_id'] = this.delOfferId;
    inputObj['userId'] = localStorage.getItem('user_id');
    if (this.delTxnType == 2) {
      inputObj['selling_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObj['buying_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj["assetPair"] = localStorage.getItem("selected_derivative_asset_pair");
    }
    if (this.delTxnType == 1) {
      inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObj["assetPair"] = localStorage.getItem("selected_derivative_asset_pair");
    }
    inputObj['amount'] = '0';
    inputObj['txn_type'] = this.delTxnType;
    inputObj['price'] = this.delPrice;
    inputObj["offerType"] = 'L';
    inputObj['leverage'] = this.delLeverage;
    inputObj['uuid'] = localStorage.getItem('uuid')
    if(parseInt(this.delLeverage) > 1){
    inputObj['marginType'] = this.delMarginType;
    }
    var jsonString = JSON.stringify(inputObj);
    this.trademngofferapi = this.http.post<any>(this.data.WEBSERVICE + '/fTrade/TradeManageOffer', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        this.data.loader = false;
        $('.load').fadeOut();
        var result = response;
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'warning');
        } else {
          // this.GetTradeDetail();
          this.data.renderDataForMyTradeFutures();

          this._StopLossComponent.getUserTransaction();
          $('.reset').click();
          this.data.alert(result.error.error_msg, 'success');
          $('#trade').click();

        }
      }, reason => {
        if (reason.error.error == 'invalid_token') {
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        } else this.data.alert('Could Not Connect To Server', 'danger');
      });
  }

  getStopLossOfferForSell() {
    // var userId = localStorage.getItem('user_id');
    // this.flag4 = true;
    // var transactiontype = '2';
    // var url = "https://stream.paybito.com/StreamingApi/rest/getStopLossBuySell?userID=" + userId + "&buyingAssetCode=" + this.data.selectedSellingAssetText.toUpperCase() + "&sellingAssetCode=" + this.data.selectedBuyingAssetText.toUpperCase() + "&txnType=" + transactiontype;
    // if (this.data.source4 != undefined) {
    //   this.data.source4.close();

    // }
    // if (this.data.source5 != undefined) {

    //   this.data.source5.close();
    // }

    // if (this.data.source6 != undefined) {
    //   this.data.source6.close();
    // }
    // if (this.data.source7 != undefined) {
    //   this.data.source7.close();
    // }
    // if (userId != "") {
    //   this.data.source7 = new EventSource(url);
    //   var result: any = new Object();
    //   this.data.source7.onmessage = (event: MessageEvent) => {
    //     var response = JSON.parse(event.data);
    //     this.flag4 = false;
    //     var selldata = JSON.parse(response.apiResponse);
    //     this.selldata = selldata.response;
    //     if (!this.ref['destroyed']) {
    //       this.ref.detectChanges();
    //     }
    //   }
    // }
  }

  getStopLossOfferForBuy() {
    // this.flag3 = true;
    // var userId = localStorage.getItem('user_id');
    // var transactiontype = '1';
    // var url = "https://stream.paybito.com/StreamingApi/rest/getStopLossBuySell?userID=" + userId + "&buyingAssetCode=" + this.data.selectedBuyingAssetText.toUpperCase() + "&sellingAssetCode=" + this.data.selectedSellingAssetText.toUpperCase() + "&txnType=" + transactiontype;
    // if (this.data.source4 != undefined) {
    //   this.data.source4.close();

    // }
    // if (this.data.source5 != undefined) {

    //   this.data.source5.close();
    // }

    // if (this.data.source6 != undefined) {
    //   this.data.source6.close();
    // }
    // if (this.data.source7 != undefined) {
    //   this.data.source7.close();
    // }

    // if (url != "") {
    //   this.data.source6 = new EventSource(url);
    //   var result: any = new Object();
    //   this.data.source6.onmessage = (event: MessageEvent) => {
    //     var response = JSON.parse(event.data);
    //     this.flag3 = false;
    //     var buydata = JSON.parse(response.apiResponse);
    //     this.buydata = buydata.response;
    //     if (!this.ref['destroyed']) {
    //       this.ref.detectChanges();
    //     }
    //   }
    // }
  }

  getStoplossPrice(s) {
    return (parseFloat(s.stopPrice)).toFixed(parseInt(this.tradep));
  }
  getStoplossTriggerPrice(s) {
    return (parseFloat(s.triggerPrice)).toFixed(parseInt(this.tradep));
  }
  getStoplossAmount(s) {
    return (parseFloat(s.quantity)).toFixed(parseInt(this.tradem));
  }

  modifyStoploss(content, id, q, p, t, flag) {
    this.modalService.open(content, { centered: true });
    this.modifySlAmount = q;
    this.modifySlPrice = p;
    this.modifySlTrigger = t;
    this.modifySlOffer = id;
    this.flag = flag;
  }

  manageStoploss() {
    this.data.alert('Loading...', 'dark');
    if (this.flag == 'Buy') {
      var marketOrderUrl = this.data.TRADESERVICE + '?symbol=' + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=BID' + '&amount=' + this.modifySlAmount;
    } else {
      var marketOrderUrl = this.data.TRADESERVICE + '?symbol=' + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=ASK' + '&amount=' + this.modifySlAmount;
    }

    this.getamntapi = this.http.get<any>(marketOrderUrl)
      .subscribe(data => {

        // wip(0);
        var result = data;
        if (result.statuscode != '0') {
          this.marketOrderPrice = parseFloat(result.price);
          if (this.flag == 'Buy') {
            if (
              this.marketOrderPrice < this.modifySlTrigger &&
              this.marketOrderPrice < this.modifySlPrice &&
              this.modifySlTrigger < this.modifySlPrice

            ) {
              var inputObj = {};
              inputObj['selling_asset_code'] = localStorage.getItem('selling_crypto_asset').toUpperCase();
              inputObj['buying_asset_code'] = localStorage.getItem('buying_crypto_asset').toUpperCase();
              inputObj['userId'] = localStorage.getItem('user_id');
              inputObj['modify_type'] = 'edit';
              inputObj['stoploss_id'] = this.modifySlOffer;
              inputObj['stop_loss_price'] = this.modifySlPrice;
              inputObj['trigger_price'] = this.modifySlTrigger;
              inputObj['quantity'] = this.modifySlAmount;
              inputObj['txn_type'] = '1';
              inputObj['uuid'] = localStorage.getItem('uuid');

              var jsonString = JSON.stringify(inputObj);
              this.modifystoplossapi = this.http.post<any>(this.data.WEBSERVICE + '/userTrade/ModifyStopLossBuySell', jsonString, { headers: { "Content-Type": "application/json" } })
                .subscribe(data => {
                  this.data.loader = false;
                  var result = data;
                  if (result.error.error_data != '0') {
                    this.data.alert(result.error.error_msg, 'danger');
                  } else {
                    this.data.alert(result.error.error_msg, 'success');
                    this.getStopLossOfferForBuy();
                  }

                });
            } else {
              this.data.alert('*Market order price should be less than trigger price & trigger price should be less than stop loss price', 'warning');
            }
          } else {
            if (
              this.marketOrderPrice > this.modifySlTrigger &&
              this.marketOrderPrice > this.modifySlPrice &&
              this.modifySlTrigger > this.modifySlPrice
            ) {
              var inputObj = {};
              inputObj['selling_asset_code'] = localStorage.getItem('buying_crypto_asset').toUpperCase();
              inputObj['buying_asset_code'] = localStorage.getItem('selling_crypto_asset').toUpperCase();
              inputObj['userId'] = localStorage.getItem('user_id');
              inputObj['modify_type'] = 'edit';
              inputObj['stoploss_id'] = this.modifySlOffer;
              inputObj['stop_loss_price'] = this.modifySlPrice;
              inputObj['trigger_price'] = this.modifySlTrigger;
              inputObj['quantity'] = this.modifySlAmount;
              inputObj['txn_type'] = '2';
              inputObj['uuid'] = localStorage.getItem('uuid');

              var jsonString = JSON.stringify(inputObj);
              this.stoploss2api = this.http.post<any>(this.data.WEBSERVICE + '/userTrade/ModifyStopLossBuySell', jsonString, { headers: { "Content-Type": "application/json" } })
                .subscribe(data => {
                  this.data.loader = false;
                  var result = data;
                  if (result.error.error_data != '0') {
                    this.data.alert(result.error.error_msg, 'danger');
                  } else {
                    this.data.alert(result.error.error_msg, 'success');
                    $('#trade').click();
                  }
                });
            } else {
              this.data.alert('*Market order price should be greater than trigger price & trigger price should be greater than stop loss price', 'warning');
            }
          }
        } else {
          this.data.alert('*Orderbook depth reached, price not found', 'warning');
        }
      });
  }

  delStoploss(content, id, q, p, t, flag) {
    this.modalService.open(content, { centered: true });
    this.modifySlAmount = q;
    this.modifySlPrice = p;
    this.modifySlTrigger = t;
    this.modifySlOffer = id;
    this.flag = flag;
  }

  removeStoploss() {
    this.data.alert('Loading...', 'dark');
    this.stopLossBuyingAsset = localStorage.getItem('buying_crypto_asset');
    this.stopLossSellingAsset = localStorage.getItem('selling_crypto_asset');
    var inputObj = {};
    inputObj['selling_asset_code'] = (this.stopLossSellingAsset).toUpperCase();
    inputObj['buying_asset_code'] = (this.stopLossBuyingAsset).toUpperCase();
    inputObj['userId'] = localStorage.getItem('user_id');
    inputObj['modify_type'] = 'delete';
    inputObj['stoploss_id'] = this.modifySlOffer;
    inputObj['stop_loss_price'] = this.modifySlPrice;
    inputObj['trigger_price'] = this.modifySlTrigger;
    inputObj['quantity'] = this.modifySlAmount;
    inputObj['uuid'] = localStorage.getItem('uuid');

    if (this.flag == 'buy') {
      inputObj['txn_type'] = '1';
    } else {
      inputObj['txn_type'] = '2';
    }

    var jsonString = JSON.stringify(inputObj);
    this.stoplossdelapi = this.http.post<any>(this.data.WEBSERVICE + '/userTrade/ModifyStopLossBuySell', jsonString, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(data => {
        this.data.loader = false;
        var result = data;
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          this.data.alert(result.error.error_msg, 'success');
          $('#trade').click();
        }

      });
  }

  /* Method defination to handle close button in my trade */
  handleCloseButton = (param,content) => {
    console.log('*********** CLOSED BUTTON CLICKED  **************')
    console.log(param);
    this.selectedCounterBuySellTxn = param
    if (param.action.toUpperCase() == 'BUY') {
       this.selectedCounterType = 'Buy'
    } else {
      this.selectedCounterType = 'Sell'
    }
    this.modalService.open(content, { centered: true });

  }
  /* Method defination for confirm close button */
  handleConfirmCloseButton = () =>{
    document.body.classList.add("overlay")
    let param = this.selectedCounterBuySellTxn;
    let txnSide = '';
    let marginType : string = null;
    if (param.action.toUpperCase() == 'BUY') {
      txnSide = 'BID'
    } else {
      txnSide = 'ASK'
    }
    if(param.offer_type == 5){
      marginType = '1';
    }else if(param.offer_type == 6){
      marginType = '2';
    }
    // this.http.get<any>("https://futures-stream.paybito.com/fSocketStream/api/marketPrice" + '?symbol=' + param.asset_pair + '&side=' + txnSide + '&amount=' + parseFloat(param.amount).toFixed(6), {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     //'authorization': 'BEARER ' + localStorage.getItem('access_token'),
    //   }
    // })
    //   .subscribe(data => {
    //     var result = data;
    //     if (result.statuscode != '0') {

          var inputObj = {};
          inputObj['userId'] = localStorage.getItem('user_id');
          inputObj['selling_asset_code'] = (param.buying_asset_code).toUpperCase();
          inputObj['buying_asset_code'] = (param.selling_asset_code).toUpperCase();
          inputObj['amount'] = parseFloat(param.amount);
          inputObj['price'] = this.selectedCounterBuySellTxn.price;
          inputObj["offerType"] = 'P';
          if (param.action.toUpperCase() == 'BUY') {
            inputObj['txn_type'] = '2';
          } else {
            inputObj['txn_type'] = '1';
          }
          inputObj['assetCode'] = param.assetcode;
          inputObj['portfolioId'] = param.mpTransactionId;
          inputObj['marginType'] = marginType;
          inputObj['assetPair'] = param.asset_pair;
          inputObj['leverage'] = param.leverage;
          inputObj['uuid'] = localStorage.getItem('uuid')
          var jsonString = JSON.stringify(inputObj);
          if ((parseFloat(this.selectedCounterBuySellTxn.price) * parseFloat(param.amount)) >= .001) {
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
                  document.body.classList.remove("overlay")
                  this.data.alert(result.error.error_msg, 'danger');
                } else {
                  this.data.alert(result.error.error_msg, 'success');
                  this.data.renderDataForMyTradeFutures();
                  if (parseInt(localStorage.getItem('selected_leverage').slice(0, -1)) > 1) {
                    this.data.renderAvailableBalance(this.data.selectedSellingAssetText, localStorage.getItem('selected_leverage_margin_type'), localStorage.getItem('selected_leverage').slice(0, -1),'futures')
                   // this.data.alert(result.error.error_msg, 'success');
                    
                  }
                }
              });
            } else {
              this.data.loader = false;
              document.body.classList.remove("overlay")
              this.data.alert('Offer Value is lesser than permissible value', 'warning');
            }
        //   }
        //   else {
        //     document.body.classList.remove("overlay")
        //     this.data.alert(result.message, 'danger');
        //   }
          
        // })
  }

  /* Method defination for checking if PNL is positive or negative */
  handlePnlPositiveValue = (param) => {
    let pnl = param.split('(');
    pnl = pnl[1].split('%')
    //console.log("PNL VALUE => ",pnl)
    let isPositive = false
    if (parseFloat(pnl) >= 0) {
      isPositive = true
    } else {
      isPositive = false
    }
    return isPositive
  }

  
  getLiqPrice(m) {
    let liqPrice = m.liqPrice
    let result = false
    if(parseFloat(liqPrice)>0){
      //liqPrice = (parseFloat(liqPrice)).toFixed(2)
      result = true
      //console.log(m);
      if(m.action.toUpperCase() == 'BUY'){
        if(parseFloat(liqPrice) > parseFloat(m.price)){
          result = false;
        }else{
          result = true;
        }
      }else{
        if(parseFloat(liqPrice) < parseFloat(m.price)){
          result = false;
        }else{
          result = true;
        }
      }
    }else{
     // liqPrice = '-'
     result = false
    }
    return result;
  }

   /* Method defination for opening fee modal on clicking on fee button */
   handleOpenFeeModal = (template) => {
    document.body.classList.add("overlay")
    this.http.get<any>(this.data.WEBSERVICE + '/fMargin/fundingHomeView', {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.data.loader = false;
        var result = response;
        this.exchangeFees = result.P_FUNDING_CURRENCY;
       
        this.http.get<any>(this.data.WEBSERVICE + '/fTrade/userWiseTradingFees?uuid=' + localStorage.getItem('uuid'), {
          headers: {
            "Content-Type": "application/json",
            authorization: "BEARER " + localStorage.getItem("access_token")
          }
        })
          .subscribe(response => {
            this.data.loader = false;
            var res = response;
            
           if(res.userTradingFees != null && res.userTradingFees != undefined && res.userTradingFees.length != 0){
             this.userExchnageFee = {
              totalVolume :parseFloat(res.userTradingFees[0].totalVolume ).toFixed(this.data.getSpecificCurrencyPrecision('USD')),
              totalFees:parseFloat(res.userTradingFees[0].totalFees).toFixed(this.data.getSpecificCurrencyPrecision('USD')),
              totalIntAccrued:parseFloat(res.userTradingFees[0].totalIntAccrued).toFixed(this.data.getSpecificCurrencyPrecision('USD')),
              totalIntEarned:res.userTradingFees[0].totalIntEarned
             }
           }else{
            this.userExchnageFee = {totalVolume : 0,totalFees:0,totalIntAccrued:0,totalIntEarned:0}

           }
            this.modalService.open(template, { centered: true,size: 'lg' });
            document.body.classList.remove("overlay")
            //}
          }, reason => {
            if (reason.error.error == 'invalid_token') {
              this.data.logout();
              document.body.classList.remove("overlay")
              this.data.alert('Session Timeout. Login Again', 'warning');
            } else {
              this.data.alert('Could Not Connect To Server', 'danger');
              document.body.classList.remove("overlay")
            }
          });
        
        //}
      }, reason => {
        if (reason.error.error == 'invalid_token') {
          this.data.logout();
          document.body.classList.remove("overlay")
          this.data.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.data.alert('Could Not Connect To Server', 'danger');
          document.body.classList.remove("overlay")
        }
      });


  }

   
  ngOnDestroy() {
    if (this.data.source4 != undefined) {
      this.data.source4.close();
    }
    if (this.data.source5 != undefined) {
      this.data.source5.close();
    }
    if (this.data.source6 != undefined) {
      this.data.source6.close();
    }
    if (this.data.source7 != undefined) {
      this.data.source7.close();
    }
    if (this.countryApi != undefined) {
      this.countryApi.unsubscribe();
    }
    if (this.stoplossdelapi != undefined) {
      this.stoplossdelapi.unsubscribe();
    }
    if (this.offerpricechkapi != undefined) {
      this.offerpricechkapi.unsubscribe();
    }
    if (this.trademangeoffrapi != undefined) {
      this.trademangeoffrapi.unsubscribe();
    }
    if (this.trademngofferapi != undefined) {
      this.trademngofferapi.unsubscribe();
    }
    if (this.getamntapi != undefined) {
      this.getamntapi.unsubscribe();
    }
    if (this.modifystoplossapi != undefined) {
      this.modifystoplossapi.unsubscribe();
    }
  }

  buySellDivChangeStatus(status){
    this.buySellDivStatus = status;
  }

  checkValueMyTrade(isChecked){
    console.log('check checkbox', isChecked.target.checked)
    this.myTradeTableAllPairs = isChecked.target.checked;
    if(this.myTradeTableAllPairs == true){
      this.callMyTradeAllPairsAPI();
    }

  }

  callMyTradeAllPairsAPI(){
    this.Nodata1 = true;
    this.isloading = true;
    this.tradehistrybyIdNewData = [];
    this.stoplossdelapi = this.http.get<any>('https://stream.paybito.com/StreamingApi/rest/getFutureTradeByAccountIDAll?userID='+localStorage.getItem('user_id') , {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .subscribe(data => {

          this.tradehistrybyIdNewData = data.tradeListResult;
          this.Nodata1 = false;
          this.isloading = false;

          console.log('future trade', data)
  
        });
  }

  checkValueMyOffer(isChecked){
    console.log('check checkbox', isChecked.target.checked)
    this.myOfferTableAllPairs = isChecked.target.checked;
    if(this.myOfferTableAllPairs == true){
     this.callMyOfferAllPairsAPI();
    }
  }
  callMyOfferAllPairsAPI(){
    this.stoplossdelapi = this.http.get<any>('https://stream.paybito.com/StreamingApi/rest/getFutureOfferByAccountIDAll?userID='+localStorage.getItem('user_id'), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(data => {

        this.tradeofferbyIdNewData = data.tradeListResult;

      });
  }


  getTradeNavHist(){

    var hist = localStorage.getItem('dTradeNavHist');
    if(hist == null || hist == undefined || hist == ''){
      hist = 'hist'
    }

    this.activeIdString = hist;
    
  }


  saveLastTabTradeComp(id){
  localStorage.setItem('dTradeNavHist',id)
  }
}
