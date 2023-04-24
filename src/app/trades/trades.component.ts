import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Optional, Input } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, interval } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { StopLossComponent } from '../stop-loss/stop-loss.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TradesComponent implements OnInit {
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
  tabmodifyMarginType: any;
  modifyVolume: any;
  tabmodifyVolume: any;
  manageOfferId: any;
  modifyType: any;
  delOfferId: any;
  delTxnType: any;
  delOfferType: any;
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
  buydata = [];
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
  tradePrice: any;
  marginstoplimitprice: any;
  marginTriggerPrice: any;
  marginSellstoplimitprice: any;
  marginSellTriggerPrice: any;
  isloading = false;
  isStopLimitModifyEnable: boolean = false
  exchangeFees: Array<string> = [];
  userExchnageFee: Object = {};
  buySellDivStatus: string = 'all';
  tradeofferbyIdBuy: any = [];
  tradeofferbyIdSell: any = [];
  filterMyOfferStatus: any = 'ALL';
  buyselldata: any[];
  myTradeTableAllPairs: any;
  tradehistrybyIdNewData: any;
  myOfferTableAllPairs: any;
  tradeofferbyIdNewData: any;
  myStopLimitAllPairs: boolean = false;
  buydataNew: any = [];
  filterStatusForOpenOrder: any = 0;
  allStoplimitButtonStatus: boolean = true;
  allbuySelldata: any;
  buydataStream: any;
  selldataStream: any;
  activeIdString: string;

  @Input() Themecolors = 'Dark';
  constructor(
    public data: CoreDataService,
    private http: HttpClient,
    private modalService: NgbModal,
    private nav: NavbarComponent,
    public dash: DashboardComponent,
    private _StopLossComponent: StopLossComponent,
    @Optional() private ref: ChangeDetectorRef) {

    // this.activeIdString="2"
  }

  ngOnInit() {
    // this.Themecolors = this.dash.Themecolor;
    this.getTradeNavHist();
    //this.callAllStopLimitOffers();


    /* calling API to render data before event source for my trade, my offer and stop limit */
    this.data.renderDataForMyTradeSpot();


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
      this.isloading = false,
        this.GetTradeDetail();
    }, 2000);
    this.myTradeTableDisplayStatus = 0;
    //this.getOfferLists();


  }

  convertToNumber(val) {
    return (parseFloat(val)).toFixed(parseInt(this.tradep));

  }
  convertToNumberP(val) {
    return (parseFloat(val)).toFixed(parseInt(this.tradep));

  }

  ngDoCheck() {
    var buyData = [];
    // this.Themecolors = this.dash.Themecolor;

    this.changemode();
    this.tradehistrybyId = this.data.spotMyTradeData;
    this.tradeofferbyId = this.data.spotMyOfferData;
    // buyData = this.data.spotSpotLimitBuyData;
    // this.selldata = this.data.spotSpotLimitSellData;

    // this.buyselldata = this.data.spotSpotLimitBuyData1;
    //   this.buydata = buyData.filter(function (e) {
    //     return e.action == 'buy';
    // });

    if (this.tradeofferbyId == undefined) {
      this.tradeofferbyId = []
    }
    else {
      this.tradeofferbyIdBuy = this.tradeofferbyId.filter(function (e) {
        return e.txn_type == 1;
      });

      this.tradeofferbyIdSell = this.tradeofferbyId.filter(function (e) {
        return e.txn_type == 2;
      });
    }

    // console.log('tradeofferbyId', this.tradeofferbyId)


  }

  filterMyOffer(text_type) {
    this.filterMyOfferStatus = text_type;
    if (text_type == 'ALL') {
      $('.txnrow').show();

    }
    else if (text_type == 1) {
      $('.typeBuy').show();
      $('.typeSell').hide();
    }
    else {
      $('.typeBuy').hide();
      $('.typeSell').show();
    }
  }

  getTradePrice(m) {
    return (parseFloat(m.price)).toFixed(parseInt(this.tradep));
  }

  getTradeAmount(m) {
    return (parseFloat(m.amount)).toFixed(parseInt(this.tradem));
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
    //this.getOfferLists();
  }

  GetTradeDetail() {
    // var userId = localStorage.getItem('user_id');
    // this.flag1 = false;
    // var url = "https://stream.paybito.com/StreamingApi/rest/getTradeHistoryById?userID=" + userId + "&buyingAssetCode=" + this.data.selectedBuyingAssetText.toLowerCase() + "&sellingAssetCode=" + this.data.selectedSellingAssetText.toLowerCase() + "&pageNo=1&noOfItemsPerPage=10";
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
    //   this.data.source4.onmessage = (event: MessageEvent) => {
    //     var response = JSON.parse(event.data);
    //     this.flag1 = false;
    //     this.tradehistrybyId = response.tradeListResult;
    //     if (!this.ref['destroyed']) {
    //       this.ref.detectChanges();
    //     }
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
      this.data.renderDataForMyTradeSpot()
      $('#myTradeBody').children('.filter').show();
      $('.tradeall').show();

    }
    if (this.myTradeTableDisplayStatus == 1) {
      if (this.data.source4 != undefined) {
        this.data.source4.close();
      }
      $('#myTradeBody').children('.filter').show();
      $('#myTradeBody').children('tr.sell').hide();
      $('#myTradeBody').children('tr.short-sell').hide();
      $('.filterbuy').show();
      $('.filtersell').hide();

    }
    if (this.myTradeTableDisplayStatus == 2) {
      if (this.data.source4 != undefined) {
        this.data.source4.close();

      }
      $('#myTradeBody').children('.filter').show();
      $('#myTradeBody').children('tr.buy').hide();
      $('#myTradeBody').children('tr.long-buy').hide();
      $('.filterbuy').hide();
      $('.filtersell').show();
    }
  }

  getOfferLists() {
    // this.tradeofferbyId = "";
    // this.flag2 = false;
    // if (
    //   this.data.selectedBuyingAssetText !== null && this.data.selectedBuyingAssetText !== undefined && this.data.selectedSellingAssetText !== null && this.data.selectedSellingAssetText !== undefined
    // ) {
    //   var userId = localStorage.getItem('user_id');
    //   var url = "https://stream.paybito.com/StreamingApi/rest/getOfferByAccountID?userID=" + userId + "&buyingAssetCode=" + this.data.selectedBuyingAssetText.toLocaleLowerCase() + "&sellingAssetCode=" + this.data.selectedSellingAssetText.toLowerCase() + "&pageNo=1&noOfItemsPerPage=10";
    //   if (this.data.source4 != undefined) {
    //     this.data.source4.close();

    //   }
    //   if (this.data.source5 != undefined) {

    //     this.data.source5.close();
    //   }

    //   if (this.data.source6 != undefined) {
    //     this.data.source6.close();
    //   }
    //   if (this.data.source7 != undefined) {
    //     this.data.source7.close();
    //   }
    //   if (url != "") {
    //     this.flag2 = true;
    //     this.data.source5 = new EventSource(url);
    //     var result: any = new Object();
    //     this.data.source5.onmessage = (event: MessageEvent) => {
    //       var response = JSON.parse(event.data);
    //       this.flag2 = false;
    //       this.tradeofferbyId = response.tradeListResult;
    //       if (!this.ref['destroyed']) {
    //         this.ref.detectChanges();
    //       }
    //       if (this.tradeofferbyId == null) {
    //         this.flag2 = false;
    //         this.Nodata2 = true;
    //       }
    //       else {
    //         this.flag2 = false;
    //         this.Nodata2 = false;
    //       }
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
    this.http.post<any>(this.data.WEBSERVICE + '/userTrade/GetOfferByID', jsonString, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(response => {
        this.data.loader = false;
        var result = response;
        this.backupdata = { ...result };
        if (result.error.error_data != '0') {
          document.body.classList.remove("overlay")
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          this.manageOfferId = offerId;
          document.body.classList.remove("overlay")
          this.modifyAmount = parseFloat(result.tradeResult.amount);
          this.tabmodifyamount = parseFloat(result.tradeResult.amount);
          this.modifyPrice = parseFloat(result.tradeResult.price);
          this.tabmodifyPrice = parseFloat(result.tradeResult.price);
          this.tabmodifyVolume = parseFloat(this.tabmodifyamount) * parseFloat(this.tabmodifyPrice);
          this.modifyVolume = parseFloat(this.modifyAmount) * parseFloat(this.modifyPrice);
          this.modifyType = result.tradeResult.txn_type;
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
    this.http.post<any>(this.data.WEBSERVICE + '/userTrade/GetOfferByID', jsonString, { headers: { 'Content-Type': 'application/json' } })
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
          if (result.tradeResult.offerType == '3') {
            this.tabmodifyMarginType = '1';
          } else if (result.tradeResult.offerType == '4') {
            this.tabmodifyMarginType = '2';
          }
          console.log('**************************', this.tabmodifyMarginType)
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
      inputObjPC[
        "selling_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.modifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }
    else {
      inputObjPC[
        "selling_asset_code"
      ] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase(); //
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.modifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }

    var jsonString = JSON.stringify(inputObjPC);
    // this.offerpricechkapi = this.http
    //   .post<any>(
    //     this.data.WEBSERVICE + "/userTrade/OfferPriceCheck",
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
    } else {
      inputObj["buying_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj["selling_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
    }
    inputObj["amount"] = this.modifyAmount;
    inputObj["price"] = this.modifyPrice;
    inputObj["txn_type"] = this.modifyType;
    inputObj['uuid'] = localStorage.getItem('uuid')
    var jsonString = JSON.stringify(inputObj);
    this.trademangeoffrapi = this.http
      .post<any>(
        this.data.WEBSERVICE + "/userTrade/TradeManageOffer",
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
            // $(".reset").click();
            // this.data.alert(result.error.error_msg, "success");
            // this.GetTradeDetail();
            // // this.getOfferLists();
            // $("#trade").click();
            //this._StopLossComponent.getUserTransaction();
            this.data.alert(result.error.error_msg, 'success');
            if (localStorage.getItem('tradeNavHist') == 'open') {
              this.data.renderDataForMyOfferSpot();
            } else if (localStorage.getItem('tradeNavHist') == 'stop') {
              this.data.renderDataForStopLimitSpot('buy');
            } else {
              this.data.renderDataForMyTradeSpot();
            }
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

  marginManageOfferPrice() {
    this.data.alert("Loading...", "dark");
    var inputObjPC = {};
    if (this.modifyType == 1) {
      inputObjPC[
        "selling_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.modifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }
    else {
      inputObjPC[
        "selling_asset_code"
      ] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase(); //
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.modifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }

    var jsonString = JSON.stringify(inputObjPC);
    this.offerpricechkapi = this.http
      .post<any>(
        this.data.WEBSERVICE + "/userTrade/OfferPriceCheck",
        jsonString,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .subscribe(response => {

        var result = response;
        if (result.error.error_data != "0") {
          this.data.alert(result.error.error_msg, "warning");
          $(".tradeBtn").attr("disabled", true);
        } else {

          var inputObj = {};
          inputObj["offer_id"] = this.manageOfferId;
          inputObj["userId"] = localStorage.getItem("user_id");
          inputObj["uuid"] = localStorage.getItem("uuid");

          if (this.modifyType == 1) {
            inputObj["selling_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
            inputObj["buying_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
          } else {
            inputObj["buying_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
            inputObj["selling_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
          }
          inputObj["amount"] = this.modifyAmount;
          inputObj["price"] = this.modifyPrice;
          inputObj["txn_type"] = this.modifyType;
          inputObj["marginType"] = this.tabmodifyMarginType;
          inputObj["offerType"] = 'U';
          inputObj['assetCode'] = localStorage.getItem('assetCode');
          var jsonString = JSON.stringify(inputObj);
          this.trademangeoffrapi = this.http
            .post<any>(
              this.data.LENDINGURL + "manageOffer",
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
                if (result.error != "0") {
                  this.data.alert(result.message, "danger");
                } else {
                  $(".reset").click();
                  this.data.alert(result.message, "success");
                  this.GetTradeDetail();
                  // this.getOfferLists();
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
        }
      })
  }

  manageOfferAmount() {
    this.data.alert("Loading...", "dark");
    var inputObjPC = {};
    if (this.modifyType == 1) {
      inputObjPC[
        "selling_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.tabmodifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }
    else {
      inputObjPC[
        "selling_asset_code"
      ] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase(); //
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.tabmodifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }

    var jsonString = JSON.stringify(inputObjPC);
    // this.offerpricechkapi = this.http
    //   .post<any>(
    //     this.data.WEBSERVICE + "/userTrade/OfferPriceCheck",
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
    } else {
      inputObj["buying_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj["selling_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
    }
    inputObj["amount"] = this.tabmodifyamount;
    inputObj["price"] = this.tabmodifyPrice;
    inputObj["txn_type"] = this.modifyType;
    inputObj["action"] = 'amountupdate';
    inputObj['uuid'] = localStorage.getItem('uuid')
    var jsonString = JSON.stringify(inputObj);
    this.trademangeoffrapi = this.http
      .post<any>(
        this.data.WEBSERVICE + "/userTrade/TradeManageOffer",
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
            // $(".reset").click();
            // this.data.alert(result.error.error_msg, "success");
            // this.GetTradeDetail();
            // //this.getOfferLists();
            // $("#trade").click();
            // this._StopLossComponent.getUserTransaction();
            this.data.alert(result.error.error_msg, 'success');
            if (localStorage.getItem('tradeNavHist') == 'open') {
              this.data.renderDataForMyOfferSpot();
            } else if (localStorage.getItem('tradeNavHist') == 'stop') {
              this.data.renderDataForStopLimitSpot('buy');
            } else {
              this.data.renderDataForMyTradeSpot();
            }
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

  marginManageOfferAmount() {
    this.data.alert("Loading...", "dark");
    var inputObjPC = {};
    if (this.modifyType == 1) {
      inputObjPC[
        "selling_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.tabmodifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
      inputObjPC["marginType"] = this.tabmodifyMarginType;
    }
    else {
      inputObjPC[
        "selling_asset_code"
      ] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObjPC[
        "buying_asset_code"
      ] = this.data.selectedSellingAssetText.toUpperCase(); //
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.tabmodifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
      inputObjPC["marginType"] = this.tabmodifyMarginType;
    }

    var jsonString = JSON.stringify(inputObjPC);
    this.offerpricechkapi = this.http
      .post<any>(
        this.data.WEBSERVICE + "/userTrade/OfferPriceCheck",
        jsonString,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .subscribe(response => {

        var result = response;
        if (result.error.error_data != "0") {
          this.data.alert(result.error.error_msg, "warning");
          $(".tradeBtn").attr("disabled", true);
        } else {

          var inputObj = {};
          inputObj["offer_id"] = this.manageOfferId;
          inputObj["userId"] = localStorage.getItem("user_id");
          inputObj["uuid"] = localStorage.getItem("uuid");

          if (this.modifyType == 1) {
            inputObj["selling_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
            inputObj["buying_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
          } else {
            inputObj["buying_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
            inputObj["selling_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
          }
          inputObj["amount"] = this.tabmodifyamount;
          inputObj["price"] = this.tabmodifyPrice;
          inputObj["txn_type"] = this.modifyType;
          inputObj["offerType"] = 'U';
          inputObj['assetCode'] = localStorage.getItem('assetCode');
          inputObj["action"] = 'amountupdate';
          inputObj["marginType"] = this.tabmodifyMarginType;
          var jsonString = JSON.stringify(inputObj);
          this.trademangeoffrapi = this.http
            .post<any>(
              this.data.LENDINGURL + "manageOffer",
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
                if (result.error != "0") {
                  this.data.alert(result.message, "danger");
                } else {
                  $(".reset").click();
                  this.data.alert(result.message, "success");
                  this.GetTradeDetail();
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
        }

      })

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

  deleteTrade(content, offerId, txnType, price, amount, offerType) {
    this.delOfferId = offerId;
    this.delTxnType = txnType;
    this.delOfferType = offerType;
    this.delPrice = price;
    this.delbal = amount;
    this.modalService.open(content, { centered: true });
  }

  marginDeleteTrade(content, offerId, txnType, price, amount, offerType) {
    this.delOfferId = offerId;
    this.delTxnType = txnType;
    this.delOfferType = offerType;
    this.delPrice = price;
    this.delbal = amount;
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
    }
    if (this.delTxnType == 1) {
      inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
    }
    inputObj['amount'] = '0';
    inputObj['txn_type'] = this.delTxnType;
    inputObj['price'] = this.delPrice;
    inputObj['uuid'] = localStorage.getItem('uuid')
    var jsonString = JSON.stringify(inputObj);
    this.trademngofferapi = this.http.post<any>(this.data.WEBSERVICE + '/userTrade/TradeManageOffer', jsonString, {
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
          // $('.reset').click();
          // this.data.alert(result.error.error_msg, 'success');
          // $('#trade').click();
          this._StopLossComponent.getUserTransaction();
          this.data.alert(result.error.error_msg, 'success');
          if (localStorage.getItem('tradeNavHist') == 'open') {
            this.data.renderDataForMyOfferSpot();
          } else if (localStorage.getItem('tradeNavHist') == 'stop') {
            this.data.renderDataForStopLimitSpot('buy');
          } else {
            this.data.renderDataForMyTradeSpot();
          }

        }
      }, reason => {
        if (reason.error.error == 'invalid_token') {
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        } else this.data.alert('Could Not Connect To Server', 'danger');
      });
  }

  delMarginOffer() {
    this.data.alert('Loading...', 'dark');
    $('.load').fadeIn();
    var inputObj = {};
    inputObj['offer_id'] = this.delOfferId;
    inputObj['userId'] = localStorage.getItem('user_id');
    inputObj["uuid"] = localStorage.getItem("uuid");

    if (this.delTxnType == 2) {
      inputObj['selling_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObj['buying_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
    }
    if (this.delTxnType == 1) {
      inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
    }
    inputObj['amount'] = '0';
    inputObj['txn_type'] = this.delTxnType;
    inputObj['price'] = this.delPrice;
    inputObj["offerType"] = 'D';
    inputObj["marginType"] = this.delOfferType;
    inputObj['assetCode'] = localStorage.getItem('assetCode');
    var jsonString = JSON.stringify(inputObj);
    this.trademngofferapi = this.http.post<any>(this.data.LENDINGURL + 'manageOffer', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        this.data.loader = false;
        $('.load').fadeOut();
        var result = response;
        if (result.error != '0') {
          this.data.alert(result.message, 'warning');
        } else {
          this.GetTradeDetail();
          this._StopLossComponent.getUserTransaction();
          $('.reset').click();
          this.data.alert(result.message, 'success');
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
    //     var selldata = response.stopLossList;
    //     this.selldata = selldata;
    //     this.selldata = this.selldata.filter(function (e) {
    //       return e.action == 'sell';
    //   });
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
    //     var buydata = response.stopLossList;
    //     this.buydata = buydata;
    //     this.buydata = this.buydata.filter(function (e) {
    //       return e.action == 'buy';
    //   });
    //     if (!this.ref['destroyed']) {
    //       this.ref.detectChanges();
    //     }
    //   }
    // }
  }



  getStopLossOfferForBuySell() {
    //  console.log('in fuc1');

    //   this.buyselldata = []
    //   this.flag3 = true;
    //   var userId = localStorage.getItem('user_id');
    //   var transactiontype = '1';
    //   var url = "https://stream.paybito.com/StreamingApi/rest/getStopLossBuySell?userID=" + userId + "&buyingAssetCode=" + this.data.selectedBuyingAssetText.toUpperCase() + "&sellingAssetCode=" + this.data.selectedSellingAssetText.toUpperCase();
    //   if (this.data.source4 != undefined) {
    //     this.data.source4.close();

    //   }
    //   if (this.data.source5 != undefined) {

    //     this.data.source5.close();
    //   }

    //   if (this.data.source6 != undefined) {
    //     this.data.source6.close();
    //   }
    //   if (this.data.source7 != undefined) {
    //     this.data.source6.close();
    //   }

    //   console.log('in fuc2');

    //   if (url != "") {
    //  console.log('in fuc3');

    //     this.data.source6 = new EventSource(url);
    //     var result: any = new Object();
    //     this.data.source6.onmessage = (event: MessageEvent) => {
    //       var response = JSON.parse(event.data);
    //       this.flag3 = false;
    //      var buyselldata = response.stopLossList;

    //       // buyselldata.forEach(v => {v.action = 'Buy';});
    //       this.buyselldata = buyselldata;
    //       console.log('event source buy',this.buyselldata);

    //       if (!this.ref['destroyed']) {
    //         this.ref.detectChanges();
    //       }


    //     }
    //   }
    //  console.log('in fuc4');
    //  this.flag3 = false;


    //   this.getsellDataEventSource();


  }

  getsellDataEventSource() {

    // var userId = localStorage.getItem('user_id');
    // this.flag3 = true;
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

    // //if (this.data.source7 != undefined) {
    // //}
    // if (userId != "") {
    //   var selldata =[];
    //   this.data.source7 = new EventSource(url);
    //   var result: any = new Object();
    //   this.data.source7.onmessage = (event: MessageEvent) => {

    //     var response = JSON.parse(event.data);
    //     this.flag3 = false;
    //     selldata = response.stopLossList;


    //     selldata.forEach(v => {v.action = 'Sell';});
    //     // this.buyselldata.splice(1,0, selldata);
    //     //this.buyselldata = selldata;
    //     // this.buyselldata = this.buyselldata.filter((item) => item.action !== 'Sell');

    //     // for(let i = 0; i<selldata.length; i++){
    //     //   this.buyselldata.push(selldata[i]);

    //     // }
    //   // console.log('event source sell',this.buyselldata);
    //   this.flag3 = false;


    //     if (!this.ref['destroyed']) {
    //       this.ref.detectChanges();
    //     }
    //   }
    // }
    // if (url != "") {
    //   console.log('in fuc3');

    //      this.data.source6 = new EventSource(url);
    //      var result: any = new Object();
    //      this.data.source6.onmessage = (event: MessageEvent) => {
    //        var response = JSON.parse(event.data);
    //        this.flag3 = false;
    //       var buyselldata = response.stopLossList;

    //        buyselldata.forEach(v => {v.action = 'Sell';});
    //        this.buyselldata = buyselldata;
    //        console.log('event source sell',this.buyselldata);

    //        if (!this.ref['destroyed']) {
    //          this.ref.detectChanges();
    //        }


    //      }
    //    }

  }

  getStoplossPrice(s) {
    return (parseFloat(s.stopLossPrice)).toFixed(parseInt(this.tradep));
  }
  getStoplossTriggerPrice(s) {
    return (parseFloat(s.triggerPrice)).toFixed(parseInt(this.tradep));
  }
  getStoplossAmount(s) {
    return (parseFloat(s.quantity)).toFixed(parseInt(this.tradem));
  }
  getStoplossPriceNew(s) {
    return (parseFloat(s.stop_loss_price)).toFixed(parseInt(this.tradep));
  }
  getStoplossTriggerPriceNew(s) {
    return (parseFloat(s.trigger_price)).toFixed(parseInt(this.tradep));
  }

  modifyStoploss(content, id, q, p, t, flag) {
    this.modalService.open(content, { centered: true });
    this.modifySlAmount = q;
    this.modifySlPrice = p;
    this.modifySlTrigger = t;
    this.modifySlOffer = id;
    this.flag = flag;
  }

  marginModifyStoploss(content, id, q, p, t, tradeprice, flag) {
    //debugger;
    this.isStopLimitModifyEnable = false;
    this.modalService.open(content, { centered: true });

    this.modifySlAmount = q;
    this.modifySlPrice = p;
    this.modifySlTrigger = t;
    this.modifySlOffer = id;
    this.tradePrice = tradeprice;
    this.flag = flag;
    this.marginstoplimitprice = this.tradePrice * 0.85;
    this.marginTriggerPrice = this.tradePrice * 0.86;
    this.marginSellstoplimitprice = this.tradePrice * 1.15;
    this.marginSellTriggerPrice = this.tradePrice * 1.14;
  }


  marginManageStoploss() {
    this.data.alert('Loading...', 'dark');
    if (this.flag.toLocaleLowerCase() == 'buy') {
      var marketOrderUrl = this.data.TRADESERVICE + '?symbol=' + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=BID' + '&amount=' + this.modifySlAmount;
    } else {
      var marketOrderUrl = this.data.TRADESERVICE + '?symbol=' + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() + '&side=ASK' + '&amount=' + this.modifySlAmount;
    }

    this.getamntapi = this.http.get<any>(marketOrderUrl)
      .subscribe(data => {

        // wip(0);
        var result = data;
        if (result.statuscode != '0') {
          // this.marketOrderPrice = parseFloat(result.price);
          if (this.flag.toLocaleLowerCase() == 'buy') {
            if (
              this.modifySlPrice > this.marginstoplimitprice && (this.modifySlTrigger >= this.marginTriggerPrice &&
                this.modifySlTrigger > this.modifySlPrice)
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
              this.data.alertm('*Stopploss Price greater than 15 % less of Trade Price and Trigger Price greater than (Stopploss Price and 14 % less of Trade Price)', 'warning');
            }
          } else {
            if (
              (this.modifySlPrice < this.marginSellstoplimitprice) &&
              (this.modifySlTrigger <= this.marginSellTriggerPrice &&
                this.modifySlTrigger < this.modifySlPrice)
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
              this.data.alertm('*Stopploss Price greater than 15 % less of Trade Price and Trigger Price greater than (Stopploss Price and 14 % less of Trade Price)', 'warning');
            }
          }
        } else {
          this.data.alert('*Orderbook depth reached, price not found', 'warning');
        }
      });
  }


  manageStoploss() {
    this.data.alert('Loading...', 'dark');
    if (this.flag.toLocaleLowerCase() == 'buy') {
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
          if (this.flag.toLocaleLowerCase() == 'buy') {
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
              this.data.alert('*Market order price should be less than stop price and limit price should be greater than stop price', 'warning');

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
              this.data.alert('*Market order price should be greater than stop price and limit price should be less than stop price', 'warning');
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

    if (this.flag.toLocaleLowerCase() == 'buy') {
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


  /*** Method defination for checkink only number****/
  handleCheckOnlyNumber = (e, declimit) => {

    //console.log(declimit)
    let field = e.target.value;
    let fieldArr = field.split('.')
    console.log(fieldArr)
    if (fieldArr[1].length === declimit) {

    } else {
      fieldArr[1] = fieldArr[1].substring(0, 6)
      e.target.value = fieldArr[0] + '.' + fieldArr[1];
    }

    if (this.flag.toLocaleLowerCase() === 'buy') {
      console.log('15% of Trade Price ' + this.marginstoplimitprice)
      console.log('14% of Trade Price ' + this.marginTriggerPrice)
      console.log('current Stop Limit ' + this.modifySlPrice)
      console.log('current Trigger ' + this.modifySlTrigger)
      if (
        this.modifySlPrice > this.marginstoplimitprice && (this.modifySlTrigger >= this.marginTriggerPrice &&
          this.modifySlTrigger > this.modifySlPrice)
      ) {
        this.isStopLimitModifyEnable = true
      } else {
        this.isStopLimitModifyEnable = false
      }
    } else if (this.flag.toLocaleLowerCase() === 'sell') {
      console.log('15% of Trade Price ' + this.marginSellstoplimitprice)
      console.log('14% of Trade Price ' + this.marginSellTriggerPrice)
      console.log('current Stop Limit ' + this.modifySlPrice)
      console.log('current Trigger ' + this.modifySlTrigger)
      if (
        (this.modifySlPrice < this.marginSellstoplimitprice) &&
        (this.modifySlTrigger <= this.marginSellTriggerPrice &&
          this.modifySlTrigger < this.modifySlPrice)
      ) {
        this.isStopLimitModifyEnable = true
      } else {
        this.isStopLimitModifyEnable = false
      }
    }

  }

  /* Method defination for opening fee modal on clicking on fee button */
  handleOpenFeeModal = (template) => {
    document.body.classList.add("overlay")
    this.http.get<any>(this.data.WEBSERVICE + '/userTrade/volumeWiseTradingFees', {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.data.loader = false;
        var result = response;
        this.exchangeFees = result.value;
        this.http.get<any>(this.data.WEBSERVICE + '/userTrade/userVolumeWiseTradingFees?uuid=' + localStorage.getItem('uuid'), {
          headers: {
            "Content-Type": "application/json",
            authorization: "BEARER " + localStorage.getItem("access_token")
          }
        })
          .subscribe(response => {
            this.data.loader = false;
            var res = response;
            /* if (result.error.error_data != '0') {
              this.data.alert(result.error.error_msg, 'danger');
            } else { */
            if (res.userTradingFees != null && res.userTradingFees != undefined && res.userTradingFees.length != 0) {
              this.userExchnageFee = {
                totalVolume: parseFloat(res.userTradingFees[0].totalVolume).toFixed(this.data.getSpecificCurrencyPrecision('USD')),
                totalFees: parseFloat(res.userTradingFees[0].totalFees).toFixed(this.data.getSpecificCurrencyPrecision('USD')),
                makerFee: res.userTradingFees[0].makerFee,
                takerFee: res.userTradingFees[0].takerFee
              }
            } else {
              this.userExchnageFee = { totalVolume: 0, totalFees: 0, makerFee: 0, takerFee: 0 }
            }
            this.modalService.open(template, { centered: true, size: 'lg' });
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

  buySellDivChangeStatus(status) {
    this.buySellDivStatus = status;
    if (status == 'all') {
      $('.stoploss').show();
    }
    else if (status == 'buy') {
      $('.filterbuy').show();
      $('.filtersell').hide();
    }
    else {
      $('.filterbuy').hide();
      $('.filtersell').show();
    }

  }

  getBuySellData() {
    this.data.renderDataForBuySellStopLimitSpot();
  }

  checkValueMyTrade(isChecked) {
    console.log('check checkbox', isChecked.target.checked)
    this.myTradeTableAllPairs = isChecked.target.checked;
    if (this.myTradeTableAllPairs == true) {
      this.callMyTradeAllPairsAPI();
    }

  }

  callMyTradeAllPairsAPI() {
    this.Nodata1 = true;
    this.isloading = true;
    this.tradehistrybyIdNewData = [];
    this.stoplossdelapi = this.http.get<any>('https://stream.paybito.com/StreamingApi/rest/getTradeByAccountIDAll?userID=' + localStorage.getItem('user_id'), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(data => {

        this.tradehistrybyIdNewData = data.tradeListResult;
        this.Nodata1 = false;
        this.isloading = false;

        //  console.log('ttttt', data)

      });
  }
  checkValueMyOffer(isChecked) {
    console.log('check checkbox', isChecked.target.checked)
    this.myOfferTableAllPairs = isChecked.target.checked;
    if (this.myOfferTableAllPairs == true) {
      this.callMyOfferAllPairsAPI();
    }
  }
  callMyOfferAllPairsAPI() {
    this.stoplossdelapi = this.http.get<any>('https://stream.paybito.com/StreamingApi/rest/getOfferByAccountIDAll?uuid=' + localStorage.getItem('uuid'), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(data => {

        this.tradeofferbyIdNewData = data.tradeListResult;

        //  console.log('ttttt', data)

      });
  }


  checkValueStopLimit(isChecked) {
    console.log('check checkbox', isChecked.target.checked)
    this.myStopLimitAllPairs = isChecked.target.checked;
    if (this.myStopLimitAllPairs == true) {
      this.callStopLimitAllPairsAPI();
    }
  }

  callStopLimitAllPairsAPI() {
    this.stoplossdelapi = this.http.get<any>('https://stream.paybito.com/StreamingApi/rest/getStopLimitByAccountIDAll?userID=' + localStorage.getItem('user_id'), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(data => {

        this.buydataNew = data.tradeListResult;

        //  console.log('ttttt', data)

      });
  }

  callAllStopLimitOffers() {
    console.log('my tstr')
    //this.allStoplimitButtonStatus = true;


    this.stoplossdelapi = this.http.get<any>("https://stream.paybito.com/StreamingApi/rest/getStopLossBuySellRest?userID=" + localStorage.getItem('user_id') + "&buyingAssetCode=" + this.data.selectedBuyingAssetText.toUpperCase() + "&sellingAssetCode=" + this.data.selectedSellingAssetText.toUpperCase(), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(data => {
        console.log('getall buy sell data', data)
        this.buyselldata = data.stopLossList;


        this.buydata = this.buyselldata.filter(function (el) {
          return el.action == 'buy'

        });

        this.selldata = this.buyselldata.filter(function (el) {
          return el.action == 'sell'

        });

      })


  }

  getTradeNavHist() {

    var hist = localStorage.getItem('tradeNavHist');
    if (hist == null || hist == undefined || hist == '') {
      hist = 'hist'
    }

    this.activeIdString = hist;

  }


  saveLastTabTradeComp(id) {
    localStorage.setItem('tradeNavHist', id)
  }
}
