import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Optional, Input } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, interval } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { Subscription } from 'rxjs';
import{OptionsDashboardComponent } from '../options-dashboard/options-dashboard.component';
import{OptionsStoplossComponent } from '../options-stoploss/options-stoploss.component';

@Component({
  selector: 'app-options-trade',
  templateUrl: './options-trade.component.html',
  styleUrls: ['./options-trade.component.css']
})
export class OptionsTradeComponent implements OnInit {
  url: any;
  currency: any;
  selectedSellingAssetText: any;
  selectedBuyingAssetText: any;
  marketTradeBodyHtml: any;
  transactionType: any;
  myTradeTableDisplayStatus: any = 0;
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
  public modifyLeverage: any;
  public modifyMarginType: any;
  public delLeverage: any;
  public delMarginType: any;
  selectedTab: any = '1';
  selectedCounterBuySellTxn : any;
  selectedCounterType:any
  exchangeFees: Array<string> = [];
  userExchnageFee : Object = {};
  selectedCounterCurrencyPrecision:any;
  selectedBaseCurrencyPrecision:any;
  buySellDivStatus: any = 'all';
  tradeofferbyIdBuy: any = [];
  tradeofferbyIdSell: any = [];
  filterMyOfferStatus: any = 'ALL';

  myTradeTableAllPairs: boolean = false;
  myOfferTableAllPairs: boolean = false;
  tradehistrybyIdNewData: any;
  tradeofferbyIdNewData: any;
  myStopLimitAllPairs: boolean = false;
  buydataNew: any = [];
  buyselldata: any[];
  filterStatusForOpenOrder: any = 0;
  allStoplimitButtonStatus: boolean = true;
  allbuySelldata: any;
  buydataStream: any;
  selldataStream: any;
  assetPairForStopLossModifyDelete : any = '';



  @Input() Themecolor = 'Dark';
  activeIdString: string;


  constructor(public data: CoreDataService,
    private http: HttpClient,
    private modalService: NgbModal,
    private nav: NavbarComponent,
    public dash: OptionsDashboardComponent,
    private _StopLossComponent: OptionsStoplossComponent,
    @Optional() private ref: ChangeDetectorRef) { }

  ngOnInit() {
    // this.Themecolor = this.dash.Themecolor;
    this.getTradeNavHist()
    this.data.getAllPrecision();
    /* calling API to render data before event source for my trade, my offer and stop limit */
    this.data.renderDataForMyTradeOptions(); 
    this.changemode();
    this.callAllStopLimitOffers();

     /** setting precision for selected **/
     this.selectedCounterCurrencyPrecision = this.data.getSpecificCurrencyPrecision(localStorage.getItem('buying_crypto_asset').toUpperCase())
     this.selectedBaseCurrencyPrecision = this.data.getSpecificCurrencyPrecision(localStorage.getItem('selling_crypto_asset').toUpperCase())

    // this.Themecolor = this.dash.Themecolor
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
      this.isloading = false
        // this.GetTradeDetail();
        this.data.renderDataForMyTradeOptions();

    }, 1000);
    this.myTradeTableDisplayStatus = 0;
    //this.getOfferLists();
    setTimeout(() => {
      document.body.classList.remove("overlay");
    }, 5000);
    
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
    // this.Themecolor = this.dash.Themecolor;

    // this.changemode();
    // this.Themecolor = this.dash.Themecolor
    ////console.log('docheck',this.Themecolor)
    this.tradehistrybyId  = this.data.optionsMyTradeData;
    this.tradeofferbyId  = this.data.optionsMyOfferData;
    // this.buydata = this.data.optionsSpotLimitBuyData;
    // this.selldata = this.data.optionsSpotLimitSellData;
    /** setting precision for selected **/
    this.selectedCounterCurrencyPrecision = this.data.getSpecificCurrencyPrecision(localStorage.getItem('buying_crypto_asset').toUpperCase())
    this.selectedBaseCurrencyPrecision = this.data.getSpecificCurrencyPrecision(localStorage.getItem('selling_crypto_asset').toUpperCase())

    if(this.tradeofferbyId == undefined){
      this.tradeofferbyId = [];
    }
    else{
          this.tradeofferbyIdBuy = this.tradeofferbyId.filter(function (e) {
          return e.txn_type == 1;
      });

      this.tradeofferbyIdSell = this.tradeofferbyId.filter(function (e) {
        return e.txn_type == 2;
    });
        }

    this.ref.detectChanges();

  }

  getTradePrice(m) {
    return (parseFloat(m.price)).toFixed(parseInt(this.selectedCounterCurrencyPrecision));
  }

  getTradeAmount(m) {
    return (parseFloat(m.amount)).toFixed(parseInt(this.selectedCounterCurrencyPrecision));
  }
  getLiqPrice(m) {
    let liqPrice = m.liqPrice
    let result = false
    if(parseFloat(liqPrice)>0){
      //liqPrice = (parseFloat(liqPrice)).toFixed(2)
      result = true
      ////console.log(m);
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




  randomNoForOrderBook(minVal: any, maxVal: any): number {
    var minVal1: number = parseInt(minVal);
    var maxVal1: number = parseInt(maxVal);
    return Math.floor(Math.random() * (maxVal1 - minVal1 + 2) + minVal1);
  }

  reload() {
    // this.GetTradeDetail();
    this.getOfferLists();
    this.data.renderDataForMyTradeOptions()
  }

  GetTradeDetail() {
    // var userId = localStorage.getItem('user_id');
    // this.flag1 = false;
    // //alert(localStorage.getItem("selected_options_asset_pair"))
    // let assetPair = '';
    // if(localStorage.getItem("selected_options_asset_pair") == null || localStorage.getItem("selected_options_asset_pair") == undefined){
    //   let optionsAssets = JSON.parse(localStorage.getItem('options_assets'))
    //   assetPair = optionsAssets.Values[0].assetPair;
    // }else{
    //   assetPair = localStorage.getItem("selected_options_asset_pair")
    // }
    // //var url=" https://stream.paybito.com/FStreamingApi/rest/getTradeHistoryById?userID="+userId+"&buyingAssetCode="+this.data.selectedBuyingAssetText.toLowerCase()+"&sellingAssetCode="+this.data.selectedSellingAssetText.toLowerCase()+"&pageNo=1&noOfItemsPerPage=10";
    // var url = " https://stream.paybito.com/StreamingApi/rest/getOTradeHistoryById?userID=" + userId + "&assetPair=" + assetPair + "&pageNo=1&noOfItemsPerPage=10";
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
    //   ////console.log(this.data.source4)
    //   this.data.source4.onmessage = (event: MessageEvent) => {
    //     //console.log('*****************************')
    //     var response = JSON.parse(event.data);
    //     //console.log(response)
    //     this.flag1 = false;
    //     //console.log(response.tradeListResult)
    //     this.tradehistrybyId = response.tradeListResult;
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
      this.data.renderDataForMyTradeOptions()
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
    // // var url=" https://stream.paybito.com/FStreamingApi/rest/getOfferByAccountID?userID="+userId+"&buyingAssetCode="+this.data.selectedBuyingAssetText.toLocaleLowerCase()+"&sellingAssetCode="+this.data.selectedSellingAssetText.toLowerCase()+"&pageNo=1&noOfItemsPerPage=10";
    // var url = " https://stream.paybito.com/StreamingApi/rest/getOOffersByAccountID?userID=" + userId + "&assetPair=" + localStorage.getItem("selected_options_asset_pair");
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
    inputObj['uuid'] = localStorage.getItem('uuid');
    //inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
    var jsonString = JSON.stringify(inputObj);
    this.http.post<any>(this.data.WEBSERVICE + '/optionsTrade/GetOfferByID', jsonString, { headers: { 'Content-Type': 'application/json' } })
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
    inputObj['uuid'] = localStorage.getItem('uuid');
    // inputObj['leverage'] = localStorage.getItem('selected_leverage').slice(0, -1);
    var jsonString = JSON.stringify(inputObj);
    this.http.post<any>(this.data.WEBSERVICE + '/optionsTrade/GetOfferByID', jsonString, { headers: { 'Content-Type': 'application/json',authorization: "BEARER " + localStorage.getItem("access_token") } })
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
    /* if (this.modifyType == 1) {
     
      inputObjPC['assetPair'] = localStorage.getItem('selected_options_asset_pair')
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.modifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }
    else {
     
      inputObjPC['assetPair'] = localStorage.getItem('selected_options_asset_pair')
      inputObjPC["userId"] = localStorage.getItem("user_id");
      inputObjPC["price"] = this.modifyPrice;
      inputObjPC["txn_type"] = this.modifyType;
    }

    var jsonString = JSON.stringify(inputObjPC);
    this.offerpricechkapi = this.http
      .post<any>(
        this.data.WEBSERVICE + "/optionsTrade/OfferPriceCheck",
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
        } else { */

    var inputObj = {};
    inputObj["offer_id"] = this.manageOfferId;
    // inputObj["userId"] = localStorage.getItem("user_id");
    if (this.modifyType == 1) {
      inputObj["selling_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj["buying_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObj["assetPair"] = localStorage.getItem("selected_options_asset_pair");
    } else {
      inputObj["buying_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj["selling_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObj["assetPair"] = localStorage.getItem("selected_options_asset_pair");
    }
    inputObj["amount"] = this.modifyAmount;
    inputObj["price"] = this.modifyPrice;
    inputObj["txn_type"] = this.modifyType;
    inputObj["leverage"] = this.modifyLeverage;
    inputObj['uuid'] = localStorage.getItem('uuid')
    if (parseInt(this.modifyLeverage) > 1) {
      inputObj["marginType"] = this.modifyMarginType;
    }
    inputObj["offerType"] = 'L';

    var jsonString = JSON.stringify(inputObj);
    this.trademangeoffrapi = this.http
      .post<any>(
        this.data.WEBSERVICE + '/optionsTrade/TradeManageOffer',
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
            // this.GetTradeDetail();
            this.data.renderDataForMyTradeOptions();
            this.getOfferLists();
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
    /*  }
   }) */
  }

  manageOfferAmount() {
    this.data.alert("Loading...", "dark");
    var inputObjPC = {};
    /*  if (this.modifyType == 1) {
       
       inputObjPC['assetPair'] = localStorage.getItem('selected_options_asset_pair')
       inputObjPC["userId"] = localStorage.getItem("user_id");
       inputObjPC["price"] = this.tabmodifyPrice;
       inputObjPC["txn_type"] = this.modifyType;
     }
     else {
      
       inputObjPC['assetPair'] = localStorage.getItem('selected_options_asset_pair')
       inputObjPC["userId"] = localStorage.getItem("user_id");
       inputObjPC["price"] = this.tabmodifyPrice;
       inputObjPC["txn_type"] = this.modifyType;
     }
 
     var jsonString = JSON.stringify(inputObjPC);
     this.offerpricechkapi = this.http
       .post<any>(
         this.data.WEBSERVICE + "/optionsTrade/OfferPriceCheck",
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
         } else { */

    var inputObj = {};
    inputObj["offer_id"] = this.manageOfferId;
    // inputObj["userId"] = localStorage.getItem("user_id");
    if (this.modifyType == 1) {
      inputObj["selling_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj["buying_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObj["assetPair"] = localStorage.getItem("selected_options_asset_pair");
    } else {
      inputObj["buying_asset_code"] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj["selling_asset_code"] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObj["assetPair"] = localStorage.getItem("selected_options_asset_pair");
    }
    inputObj["amount"] = this.tabmodifyamount;
    inputObj["price"] = this.tabmodifyPrice;
    inputObj["txn_type"] = this.modifyType;
    inputObj["leverage"] = this.modifyLeverage;
    inputObj['uuid'] = localStorage.getItem('uuid')
    if (parseInt(this.modifyLeverage) > 1) {
      inputObj["marginType"] = this.modifyMarginType;
    }
    inputObj["action"] = 'amountupdate';
    inputObj["offerType"] = 'L';

    var jsonString = JSON.stringify(inputObj);
    this.trademangeoffrapi = this.http
      .post<any>(
        this.data.WEBSERVICE + '/optionsTrade/TradeManageOffer',
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
            // this.GetTradeDetail();
            this.data.renderDataForMyTradeOptions()
            this.getOfferLists();
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
    /* }

  }) */

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

  deleteTrade(content, offerId, txnType, price, amount, margin, leverage) {
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
    // inputObj['userId'] = localStorage.getItem('user_id');
    if (this.delTxnType == 2) {
      inputObj['selling_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObj['buying_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj["assetPair"] = localStorage.getItem("selected_options_asset_pair");
    }
    if (this.delTxnType == 1) {
      inputObj['selling_asset_code'] = this.data.selectedSellingAssetText.toUpperCase();
      inputObj['buying_asset_code'] = this.data.selectedBuyingAssetText.toUpperCase();
      inputObj["assetPair"] = localStorage.getItem("selected_options_asset_pair");
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
    this.trademngofferapi = this.http.post<any>(this.data.WEBSERVICE + '/optionsTrade/TradeManageOffer', jsonString, {
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
    var userId = localStorage.getItem('user_id');
    this.flag4 = true;
    var transactiontype = '2';
    var url = "https://stream.paybito.com/StreamingApi/rest/getStopLossBuySell?userID=" + userId + "&buyingAssetCode=" + this.data.selectedSellingAssetText.toUpperCase() + "&sellingAssetCode=" + this.data.selectedBuyingAssetText.toUpperCase() + "&txnType=" + transactiontype;
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
    if (userId != "") {
      this.data.source7 = new EventSource(url);
      var result: any = new Object();
      this.data.source7.onmessage = (event: MessageEvent) => {
        var response = JSON.parse(event.data);
        this.flag4 = false;
        var selldata = JSON.parse(response.apiResponse);
        this.selldata = selldata.response;
        if (!this.ref['destroyed']) {
          this.ref.detectChanges();
        }
      }
    }
  }

  getStopLossOfferForBuy() {
    this.flag3 = true;
    var userId = localStorage.getItem('user_id');
    var transactiontype = '1';
    var url = "https://stream.paybito.com/StreamingApi/rest/getStopLossBuySell?userID=" + userId + "&buyingAssetCode=" + this.data.selectedBuyingAssetText.toUpperCase() + "&sellingAssetCode=" + this.data.selectedSellingAssetText.toUpperCase() + "&txnType=" + transactiontype;
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

    if (url != "") {
      // this.data.source6 = new EventSource(url);
      // var result: any = new Object();
      // this.data.source6.onmessage = (event: MessageEvent) => {
      //   var response = JSON.parse(event.data);
      //   this.flag3 = false;
      //   var buydata = JSON.parse(response.apiResponse);
      //   this.buydata = buydata.response;
      //   if (!this.ref['destroyed']) {
      //     this.ref.detectChanges();
      //   }
      // }
    }
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

  modifyStoploss(content, id, q, p, t, flag,assetPair) {
    this.modalService.open(content, { centered: true });
    this.modifySlAmount = q;
    this.modifySlPrice = p;
    this.modifySlTrigger = t;
    this.modifySlOffer = id;
    this.flag = flag;
    this.assetPairForStopLossModifyDelete = assetPair;
  }

  manageStoploss() {
    this.data.alert('Loading...', 'dark');
    if (this.flag == 'Buy') {
      var marketOrderUrl = this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_options_asset_pair') + '&side=BID&amount=' + this.modifySlAmount
    } else {
      var marketOrderUrl = this.data.FUTURESOCKETSTREAMURL+ '/marketPrice?symbol=' + localStorage.getItem('selected_options_asset_pair') + '&side=ASK&amount=' + this.modifySlAmount
    }

    this.getamntapi = this.http.get<any>(marketOrderUrl)
      .subscribe(data => {

        // wip(0);
        var result = data;
        if (result.statuscode != '0') {
          this.marketOrderPrice = parseFloat(result.price);
          if (this.flag == '1') {
            console.log( 'Market order < trigger ',this.marketOrderPrice,this.modifySlTrigger)
            console.log( 'Market order < stop loss',this.marketOrderPrice,this.modifySlPrice)
            console.log( 'trigger < stoploss',this.modifySlTrigger,this.modifySlPrice)
            if (
              this.marketOrderPrice < this.modifySlTrigger &&
              this.marketOrderPrice < this.modifySlPrice &&
              this.modifySlTrigger < this.modifySlPrice

            ) {
              var inputObj = {};
              inputObj['selling_asset_code'] = localStorage.getItem('selling_crypto_asset').toUpperCase();
              inputObj['buying_asset_code'] = localStorage.getItem('buying_crypto_asset').toUpperCase();
              // inputObj['userId'] = localStorage.getItem('user_id');
              inputObj['modify_type'] = 'edit';
              inputObj['stoploss_id'] = this.modifySlOffer;
              inputObj['stop_loss_price'] = this.modifySlPrice;
              inputObj['trigger_price'] = this.modifySlTrigger;
              inputObj['quantity'] = this.modifySlAmount;
              //inputObj['txn_type'] = '1';
              inputObj['uuid'] = localStorage.getItem('uuid');

              var jsonString = JSON.stringify(inputObj);
              this.modifystoplossapi = this.http.post<any>(this.data.WEBSERVICE + '/optionsTrade/ModifyStopLossBuySell', jsonString, { headers: { "Content-Type": "application/json","authorization": "BEARER " + localStorage.getItem("access_token") } })
                .subscribe(data => {
                  this.data.loader = false;
                  var result = data;
                  if (result.error.error_data != '0') {
                    this.data.alert(result.error.error_msg, 'danger');
                  } else {
                    this.data.alert(result.error.error_msg, 'success');
                    this.callAllStopLimitOffers();
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
              // inputObj['userId'] = localStorage.getItem('user_id');
              inputObj['modify_type'] = 'edit';
              inputObj['stoploss_id'] = this.modifySlOffer;
              inputObj['stop_loss_price'] = this.modifySlPrice;
              inputObj['trigger_price'] = this.modifySlTrigger;
              inputObj['quantity'] = this.modifySlAmount;
              //inputObj['txn_type'] = '2';
              inputObj['uuid'] = localStorage.getItem('uuid');

              var jsonString = JSON.stringify(inputObj);
              this.stoploss2api = this.http.post<any>(this.data.WEBSERVICE + '/optionsTrade/ModifyStopLossBuySell', jsonString, { headers: { "Content-Type": "application/json","authorization": "BEARER " + localStorage.getItem("access_token") } })
                .subscribe(data => {
                  this.data.loader = false;
                  var result = data;
                  if (result.error.error_data != '0') {
                    this.data.alert(result.error.error_msg, 'danger');
                  } else {
                    this.data.alert(result.error.error_msg, 'success');
                    this.callAllStopLimitOffers();
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

  delStoploss(content, id, q, p, t, flag,assetPair) {
    this.modalService.open(content, { centered: true });
    this.modifySlAmount = q;
    this.modifySlPrice = p;
    this.modifySlTrigger = t;
    this.modifySlOffer = id;
    this.flag = flag;
    this.assetPairForStopLossModifyDelete = assetPair;
    console.log(q,p,t,id,flag,assetPair)
  }

  removeStoploss() {
    this.data.alert('Loading...', 'dark');
    this.stopLossBuyingAsset = localStorage.getItem('buying_crypto_asset');
    this.stopLossSellingAsset = localStorage.getItem('selling_crypto_asset');
    var inputObj = {};
    inputObj['selling_asset_code'] = (this.stopLossSellingAsset).toUpperCase();
    inputObj['buying_asset_code'] = (this.stopLossBuyingAsset).toUpperCase();
    // inputObj['userId'] = localStorage.getItem('user_id');
    inputObj['modify_type'] = 'delete';
    inputObj['stoploss_id'] = this.modifySlOffer;
    inputObj['stop_loss_price'] = this.modifySlPrice;
    inputObj['trigger_price'] = this.modifySlTrigger;
    inputObj['quantity'] = this.modifySlAmount;
    inputObj['uuid'] = localStorage.getItem('uuid');

    inputObj['txn_type'] = this.flag;

    var jsonString = JSON.stringify(inputObj);
    this.stoplossdelapi = this.http.post<any>(this.data.WEBSERVICE + '/optionsTrade/ModifyStopLossBuySell', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        "authorization": "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(data => {
        this.data.loader = false;
        var result = data;
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, 'danger');
        } else {
          this.data.alert(result.error.error_msg, 'success');
          this.callAllStopLimitOffers();
        }

      });
  }

  checkValueStopLimit(isChecked) {
    console.log('check checkbox', isChecked.target.checked)
    this.myStopLimitAllPairs = isChecked.target.checked;
    if (this.myStopLimitAllPairs == true) {
      this.callStopLimitAllPairsAPI();
    }else{
      this.callAllStopLimitOffers();
    }
  }

  handleStopLimitAllButton = () => {
    if (this.myStopLimitAllPairs == true) {
      this.callStopLimitAllPairsAPI();
    }else{
      this.callAllStopLimitOffers();
    }
  }

  callAllStopLimitOffers() {
    //console.log('my tstr')
    //this.allStoplimitButtonStatus = true;

    let payload = {
      uuid : localStorage.getItem('uuid'),
      assetPair : localStorage.getItem("selected_options_asset_pair")
    }
    this.stoplossdelapi = this.http.post<any>(this.data.WEBSERVICE + "/optionsTrade/GetStopLossBuySell",JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
       // console.log('getall buy sell data', data)
        let apiResponse = JSON.parse(data.apiResponse);
        this.buyselldata = apiResponse.stopLossList;

        console.log('Iteration for stop loss data',this.buyselldata);
      

        this.buydata = this.buyselldata.filter(function (el) {
          return el.action == 1

        });

        this.selldata = this.buyselldata.filter(function (el) {
          return el.action == 2

        });

        console.log('Iteration buy',this.buydata);
        console.log('Iteration sell',this.selldata);



      })


  }


  callStopLimitAllPairsAPI() {
    this.stoplossdelapi = this.http.get<any>('https://stream.paybito.com/StreamingApi/rest/getStopLimitByAccountIDAll?userID=' + localStorage.getItem('user_id'), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(data => {

        this.buydataNew = data.tradeListResult;
        console.log(this.buydataNew.length,typeof(this.buydataNew.length))
        //this.clickAllButton();

        //  console.log('ttttt', data)
        this.handleClickAllButton('spotStopLimitAllButton')
        

      });
  }

/* method for establishing click event and perform programiticcaly click on all filter button*/

handleClickAllButton = (param) => {
  let elem = document.getElementById(param)
   //console.log(elem);
   var evt = document.createEvent('MouseEvents');
   evt.initMouseEvent('mousedown', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
   if(elem != null && elem != undefined){
     elem.dispatchEvent(evt);

     elem.click();
     elem.click();
     
   }
}
clickAllButton() {
  //let el: HTMLElement = this.allButtonClick.nativeElement;
  //console.log(el)
  this.callAllStopLimitOffers();
  //el.click();
  // $('#allButtonClick').click();

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
    // this.http.get<any>(this.data.FUTURESOCKETSTREAMURL+ "/marketPrice" + '?symbol=' + param.asset_pair + '&side=' + txnSide + '&amount=' + parseFloat(param.amount).toFixed(6), {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     //'authorization': 'BEARER ' + localStorage.getItem('access_token'),
    //   }
    // })
    //   .subscribe(data => {
    //     var result = data;
    //     if (result.statuscode != '0') {

          var inputObj = {};
          // inputObj['userId'] = localStorage.getItem('user_id');
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
    ////console.log("PNL VALUE => ",pnl)
    let isPositive = false
    if (parseFloat(pnl) >= 0) {
      isPositive = true
    } else {
      isPositive = false
    }
    return isPositive
  }
  /* Method defination for opening fee modal on clicking on fee button */
  handleOpenFeeModal = (template) => {
    document.body.classList.add("overlay")
    this.http.get<any>(this.data.WEBSERVICE + '/optionsMargin/fundingHomeView', {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.data.loader = false;
        var result = response;
        this.exchangeFees = result.P_FUNDING_CURRENCY;
       
        this.http.get<any>(this.data.WEBSERVICE + '/optionsTrade/userWiseTradingFees?uuid=' + localStorage.getItem('uuid'), {
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
    //console.log('check checkbox', isChecked.target.checked)
    this.myTradeTableAllPairs = isChecked.target.checked;
    if(this.myTradeTableAllPairs == true){
      this.callMyTradeAllPairsAPI();
    }

  }

  callMyTradeAllPairsAPI(){
    this.Nodata1 = true;
    this.isloading = true;
    this.tradehistrybyIdNewData = [];
    this.stoplossdelapi = this.http.get<any>('https://stream.paybito.com/StreamingApi/rest/getOptionTradeByAccountIDAll?userID='+localStorage.getItem('user_id'), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .subscribe(data => {

          this.tradehistrybyIdNewData = data.tradeListResult;
          this.Nodata1 = false;
          this.isloading = false;

        });
  }
  checkValueMyOffer(isChecked){
    //console.log('check checkbox', isChecked.target.checked)
    this.myOfferTableAllPairs = isChecked.target.checked;
    if(this.myOfferTableAllPairs == true){
     this.callMyOfferAllPairsAPI();
    }
  }
  callMyOfferAllPairsAPI(){
    this.stoplossdelapi = this.http.get<any>('https://stream.paybito.com/StreamingApi/rest/getOptionOfferByAccountIDAll?userID='+localStorage.getItem('user_id'), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(data => {

        this.tradeofferbyIdNewData = data.tradeListResult;

      //  //console.log('ttttt', data)

      });
  }


  getTradeNavHist(){

    var hist = localStorage.getItem('oTradeNavHist');
    if(hist == null || hist == undefined || hist == ''){
      hist = 'trades'
    }

    this.activeIdString = hist;
    
  }


  saveLastTabTradeComp(id){
  localStorage.setItem('oTradeNavHist',id)
  }

}
