import { Component, OnInit } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-copy-trading-history',
  templateUrl: './copy-trading-history.component.html',
  styleUrls: ['./copy-trading-history.component.css']
})
export class CopyTradingHistoryComponent implements OnInit {

  Themecolor: string = 'Dark';
  public chart: any;
  tradeApiKeyStatus: boolean = true;
  botTraderStatus: boolean;
  traderName: any;
  exchanageName: any = 'BINANCE'
  timePeriod: any = 'All Time';
  traderNameFilter: any = '';
  marketType: any = '';
  basecurrency: any = 'All';
  viewType: any = ''
  botSelect: any = ''
  botList: any;
  pageNo: number = 1;
  itemNo: number = 50;
  pgn: any = [];
  no_of_records: any;
  botTableList: any[];
  orderView: boolean = true;
  marketSelected: boolean = false
  exchangeSelected: boolean = false
  botSelected: boolean = false
  apiPublicKey: any;
  apiSecretKey: any;
  getDataButton: boolean = false
  apiKeyId: any;
  orderdtls: any;


  constructor(public route:Router, public http:HttpClient, public data: CoreDataService) { }

  ngOnInit() {

  }

  changeBotdrop(){
    this.botSelect = ''
    if(this.botSelect == ''){
      this.botSelected = false;
      this.viewType = '';
    }
  }


  getBotList(){
    if(this.marketType != ''){
      this.marketSelected = true;
      this.exchangeSelected = true;
    }
    console.log('bot',this.botSelect);
    
    
    
    var addAPI = {};
    addAPI['marketType'] = this.marketType;
    addAPI['exchange_name'] = this.exchanageName;
    addAPI['customerId'] = localStorage.getItem('user_id');
    addAPI['role'] =  localStorage.getItem('traderRole')




    var jsonString = JSON.stringify(addAPI);



    this.http.post<any>(this.data.COPYTRADINGSERVICE+'/bot/getBotsForHistory', jsonString, 
    {  headers:
      {
        'content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      } })
    .subscribe(response => {

      this.botList = response;

      // if(this.botList.length > 0){
      //   this.botSelected = true
      // }



    })
  }
  enableViewDrop(){

  }
  enableBotDrop(){
    if(this.botSelect != ''){
      this.botSelected = true;
    }

  }
  getList(){

    if(this.viewType == 1){
      this.orderView = true;
    }
    else{
      this.orderView = false;

    }

    var addAPI = {};
    addAPI['pageNo'] = this.pageNo;
    addAPI['view_type'] = this.viewType;
    addAPI['customerId'] = localStorage.getItem('user_id');
    addAPI['botId'] = this.botSelect;
    addAPI['itemNo'] = this.itemNo;

    // addAPI['pageNo'] = this.pageNo;
    // addAPI['view_type'] = 2;
    // addAPI['customerId'] = 35575;
    // addAPI['botId'] = '590';
    // addAPI['itemNo'] = this.itemNo;


    
    var jsonString = JSON.stringify(addAPI);



    this.http.post<any>(this.data.COPYTRADINGSERVICE+'/bot/getTradesOffresForHistory', jsonString, 
    {  headers:
      {
        'content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      } })
    .subscribe(response => {

      this.botTableList = response.tradeOfferViews;
      this.no_of_records = response.no_of_records
      this.apiPublicKey = response.apiKey
      this.apiSecretKey = response.secretKey
      this.apiKeyId = response.apiKeyId

      this.orderdtls = response.orderdtls[0];



          this.pgn = [];
          for (let i = 1; i <= Math.ceil(this.no_of_records / this.itemNo); i++) {
             this.pgn.push(i);
           }
           console.log('paapapa',this.pgn);
           

      

    })
    
  }

  pager(pg){
    
    this.pageNo = pg;
   // this.main.transactionHistory(pg,this.Themecolor);
     this.getList();
 }
 pagerNext(pg){
  
   pg++;
   this.pageNo = pg;
   // this.main.transactionHistory(pg,this.Themecolor);
    this.getList();
 }
 pagerPre(pg){
   pg--;
   this.pageNo = pg;
   // this.main.transactionHistory(pg,this.Themecolor);
    this.getList();
 }


 removeBotHistory(exchangeName, orderId, symbol){





  var addAPI = {};
  addAPI['apiKey'] = this.apiPublicKey;
  addAPI['secretKey'] = this.apiSecretKey;
  addAPI['exchange_name'] = exchangeName;
  addAPI['market'] = this.marketType;
  addAPI['orderId'] = orderId;
  addAPI['symbol'] = symbol;
  addAPI['customerId'] = localStorage.getItem('user_id');
  addAPI['apiKeyId'] = this.apiKeyId;


  



  
  var jsonString = JSON.stringify(addAPI);


  console.log('tseees',jsonString);
  



  this.http.post<any>(this.data.COPYTRADINGSERVICE+'/bot/cancelOrderForOther', jsonString, 
  {  headers:
    {
      'content-Type': 'application/json',
      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
    } })
  .subscribe(response => {

    if(response.statusCode == 1){
      this.data.alert(response.message, 'success');

    }
    else{
      this.data.alert(response.message, 'danger');


    }


    this.getList();
         

    

  })

 }


 removeBotHistoryPaybito(exchangeName, orderId, symbol,txn_type,PRICE){



  if(this.marketType == 'Spot'){


    var inputObj = {};
    var newtxn


    inputObj['offer_id'] = orderId;
    if (txn_type == 'buy') {
      inputObj['selling_asset_code'] = this.orderdtls.SELLING_ASSET_CODE.toUpperCase();
      inputObj['buying_asset_code'] = this.orderdtls.BUYING_ASSET_CODE.toUpperCase();
      newtxn = 1;
  
    }
    else {

      inputObj['selling_asset_code'] = this.orderdtls.BUYING_ASSET_CODE.toUpperCase();
      inputObj['buying_asset_code'] = this.orderdtls.SELLING_ASSET_CODE.toUpperCase();
      newtxn = 2;

      
  
    }
  inputObj['amount'] = '0';
  inputObj['txn_type'] = newtxn;
  inputObj['price'] = PRICE;
  inputObj['uuid'] = localStorage.getItem('uuid')
  inputObj['assetCode'] = this.orderdtls.ASSET_CODE;
  inputObj['orderType'] = this.orderdtls.ORDER_TYPE;


  







var jsonString = JSON.stringify(inputObj);


console.log('tseees',jsonString);




this.http.post<any>(this.data.WEBSERVICE + '/userTrade/TradeManageOffer', jsonString, 
{  headers:
  {
    'content-Type': 'application/json',
    'authorization': 'BEARER ' + localStorage.getItem('access_token'),
  } })
.subscribe(result => {

  if (result.error.error_data != '0') {
    this.getList();
    this.data.alert(result.error.error_msg, 'warning');
  } else {
    this.data.alert(result.error.error_msg, 'success');
    this.getList();

    

  }
       

  

  })  

  }
  else{


    
  //   var inputObj = {};

  //   var newtxn
  //   inputObj['offer_id'] = orderId;
  // if (txn_type == 'buy') {
  //   inputObj['selling_asset_code'] = this.orderdtls.BUYING_ASSET_CODE.toUpperCase();
  //   inputObj['buying_asset_code'] = this.orderdtls.SELLING_ASSET_CODE.toUpperCase();
  //   newtxn = 1;

  // }
  // else {
  //   inputObj['selling_asset_code'] = this.orderdtls.SELLING_ASSET_CODE.toUpperCase();
  //   inputObj['buying_asset_code'] = this.orderdtls.BUYING_ASSET_CODE.toUpperCase();
  //   newtxn = 2;

  // }
  // inputObj['amount'] = '0';
  // inputObj['assetCode'] = this.orderdtls.ASSET_CODE;

  // inputObj['txn_type'] = newtxn;
  // inputObj['price'] = PRICE;
  // inputObj['uuid'] = localStorage.getItem('uuid')



  var inputObj = {};
          inputObj["offer_id"] = orderId;
          // inputObj["userId"] = localStorage.getItem("user_id");
          if (txn_type == 'buy') {
            inputObj['selling_asset_code'] = this.orderdtls.SELLING_ASSET_CODE.toUpperCase();
            inputObj['buying_asset_code'] = this.orderdtls.BUYING_ASSET_CODE.toUpperCase();
            
          newtxn = 1;

          } else {
            inputObj['selling_asset_code'] = this.orderdtls.BUYING_ASSET_CODE.toUpperCase();
            inputObj['buying_asset_code'] = this.orderdtls.SELLING_ASSET_CODE.toUpperCase();
            
          newtxn = 2;

          }
          inputObj["assetPair"] = this.orderdtls.ASSET_PAIR;

          inputObj['amount'] = '0';
          inputObj['txn_type'] = newtxn;
          inputObj['price'] = PRICE;
          inputObj["offerType"] = this.orderdtls.OFFER_TYPE;
          inputObj['leverage'] = this.orderdtls.LEVERAGE;
          inputObj['uuid'] = localStorage.getItem('uuid')
          inputObj['marginType'] = this.orderdtls.MARGIN_TYPE;
          inputObj['assetCode'] = this.orderdtls.ASSET_CODE;
          inputObj['orderType'] = this.orderdtls.ORDER_TYPE;







var jsonString = JSON.stringify(inputObj);


console.log('tseees',jsonString);




this.http.post<any>(this.data.WEBSERVICE + '/fTrade/TradeManageOffer', jsonString, 
{  headers:
  {
    'content-Type': 'application/json',
    'authorization': 'BEARER ' + localStorage.getItem('access_token'),
  } })
.subscribe(result => {

  if (result.error.error_data != '0') {
    this.data.alert(result.error.error_msg, 'warning');
    this.getList();

  } else {
    this.data.alert(result.error.error_msg, 'success');
    this.getList();

    

  }
       

  

  })  



  }





 }

}
