import { Component, OnInit, DoCheck } from '@angular/core';
import { CoreDataService } from '../../core-data.service';
import { BodyService } from '../../body.service'
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { BinanceLtpWebsocket } from '../binanceLtpWebsocket';
import { BinanceFutuesLtpWebsocket } from '../binanceFuturesLtpWebsocket';
import { E } from '@angular/core/src/render3';


@Component({
  selector: 'app-create-new-bot',
  templateUrl: './create-new-bot.component.html',
  styleUrls: ['./create-new-bot.component.css']
})
export class CreateNewBotComponent implements OnInit {
  Themecolor: string;
  botName: string = '';
  botDescription: string = '';
  marketName: string = '';

  public orderType: string = '';
  public isProfit1Checked: boolean = false;
  public isProfit2Checked: boolean = false;
  public isProfit3Checked: boolean = false;
  public isProfit1CheckedForTakeProfit: boolean = false;
  public isProfit2CheckedForTakeProfit: boolean = false;
  public isProfit3CheckedForTakeProfit: boolean = false;
  public fixedAmountForSingleEntryError: boolean = false;
  selectedCrypto: string = 'BTC';
  selectedFiat: string = 'USD';
  botType: string = '';
  selectedApiKey: any;
  marketPriceReachForBot1: string = '';
  pairPriceForBot1: string = '';
  deviationFromForBot1: string = '';
  deviationPercentageForBot1: string = ''
  positionSizeForBot1: string = ''
  percentageOfPortfolioForBot1: string = ''
  fixedAmountForBot1: string = ''
  marketPriceReachForBot2: string = '';
  pairPriceForBot2: string = '';
  deviationFromForBot2: string = '';
  deviationPercentageForBot2: string = ''
  positionSizeForBot2: string = ''
  percentageOfPortfolioForBot2: string = ''
  fixedAmountForBot2: string = ''
  marketPriceReachForBot3: string = '';
  pairPriceForBot3: string = '';
  deviationFromForBot3: string = '';
  deviationPercentageForBot3: string = ''
  positionSizeForBot3: string = ''
  percentageOfPortfolioForBot3: string = ''
  fixedAmountForBot3: string = ''
  marketPriceForSingleEntry: string = ''
  marketPriceReachForSingleEntry: string = ''
  marketPriceReachTypeForSingleEntry: string = ''
  positionSizeForSingleEntry: string = ''
  percentageOfPortfolioForSingleEntry: string = ''
  fixedAmountForSingleEntry: string = ''
  positionSizeForDollarCostAverage: string = ''
  percentageOfPortfolioForDollarCostAverage: string = ''
  fixedAmountForDollarCostAverage: string = ''
  investTimeForDolarCostAverage: string = '';
  investDurationForDollarCostAverage: string = '';
  percentageOfPortfolioProfit1ForTakeProfit: string = ''
  percentageOfPortfolioProfit2ForTakeProfit: string = ''
  percentageOfPortfolioProfit3ForTakeProfit: string = ''
  marketPriceReachProfit1ForTakeProfit: string = ''
  marketPriceReachProfit2ForTakeProfit: string = ''
  marketPriceReachProfit3ForTakeProfit: string = ''
  marketPriceProfit1ForTakeProfit: any = ''
  marketPriceProfit2ForTakeProfit: any = ''
  marketPriceProfit3ForTakeProfit: any = ''
  plPercentProfit1ForTakeProfit: any
  plPercentProfit2ForTakeProfit: any
  plPercentProfit3ForTakeProfit: any
  apiList: Array<string> = [];
  assetetpair: any[];
  assetetpairback: any[];
  filterCurrency: any;
  header: any;
  assets: any;
  roccolor: boolean;
  ltpcolor: boolean;
  selectedMarginType: any;
  balencelist: any;
  currencyBalance: any;
  selectedCryptoCurrency: string;
  selelectedBuyingAssetBalance: any;
  selelectedSellingAssetBalance: any;
  botAssetPair: any = '';
  botOrder: any = '';
  botExpireTime: any;
  botExpireTimeType: any = 'min';
  marketPriceReachForBotType: any = '';
  marketPriceReachForBot2Type: any = '';
  marketPriceReachForBot3Type: any = '';
  portfolioPercentageProfit1ForTakeProfit1: string = '0';
  portfolioPercentageProfit2ForTakeProfit1: string = '0';
  portfolioPercentageProfit3ForTakeProfit1: string = '0';
  apiKey: any;
  investTimeForDolarCostAverageType: string;

  marketOrderTPError: boolean = false
  chartlist: any;
  ltpData: any;

  lmodtp1PriceErrorGrt: boolean = false;
  lmodtp1PriceErrorlwr: boolean = false;
  lmodtp2PriceErrorlwr: boolean;
  lmodtp2PriceErrorGrt: boolean;
  lmodtp3PriceErrorGrt: boolean;
  lmodtp3PriceErrorlwr: boolean;
  botAssetPairTrimmed: string;
  showAsset: any;
  moSngEntErrorGrt: boolean;
  moSngEntErrorlwr: boolean;
  limitOrderTPError: boolean;
  modtp1PriceErrorGrt: boolean;
  modtp1PriceErrorlwr: boolean;
  modtp2PriceErrorlwr: boolean;
  modtp2PriceErrorGrt: boolean;
  modtp3PriceErrorGrt: boolean;
  modtp3PriceErrorlwr: boolean;
  time_frame: any = 'Every Minute';
  maximum_trade_count: any;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  selectedApiKeyMulti: any;
  multiAPIId: any[];
  multiIdString: string;
  marginType: any = '0';
  marginShowStatus: boolean = false;
  leverage : any = 2;
  marginTypeOptionStatus: boolean;
  baseAssetPair: string;
  exchangeName: any = 'PAYBITO';
  expirationFlag: any;
  apipublicKey: any;
  apisecretKey: any;
  BinanceLtpDataForPair: any;
  binanceBuySellStatus: any;
  BinanceBalanceCheckStatus: boolean = false;
  pNlStatus: boolean = true;
  pNlStatus2: boolean = true;

  pNlStatus3: boolean = true;


  constructor(private http: HttpClient, 
    public data: CoreDataService,
     public main: BodyService, 
     public route: Router,
     public binanceSocket: BinanceLtpWebsocket, public futureBinance: BinanceFutuesLtpWebsocket) { 



     

      // this.binanceSocket.currentMessage.subscribe(message => {

      //   console.log('tesdtt',message);
        
      // })

    
  }



  /* Method defination for bot check */
  handleBotSelection = (botName, e) => {
    // console.log(botName,e.target.checked)
    if (botName == 'profit1') {
      if (e.target.checked) {
        this.isProfit1Checked = true
        this.deviationPercentageForBot1 = ''
        this.marketPriceReachForBotType = ''
        this.marketPriceReachForBot1 = ''
        this.deviationFromForBot1 = ''
        this.deviationPercentageForBot1 = ''
        this.deviationPercentageForBot1 = ''
        this.positionSizeForBot1 = ''
        this.percentageOfPortfolioForBot1 = ''
        this.percentageOfPortfolioForBot1 = ''
        this.fixedAmountForBot1 = ''
      } else {
        this.isProfit1Checked = false
        this.deviationPercentageForBot1 = ''
        this.marketPriceReachForBotType = ''
        this.marketPriceReachForBot1 = ''
        this.deviationFromForBot1 = ''
        this.deviationPercentageForBot1 = ''
        this.deviationPercentageForBot1 = ''
        this.positionSizeForBot1 = ''
        this.percentageOfPortfolioForBot1 = ''
        this.percentageOfPortfolioForBot1 = ''
        this.fixedAmountForBot1 = ''

      }
    } else if (botName == 'profit2') {
      if (e.target.checked) {
        this.isProfit2Checked = true
        this.deviationPercentageForBot2 = ''
        this.marketPriceReachForBot2Type = ''
        this.marketPriceReachForBot2 = ''
        this.deviationFromForBot2 = ''
        this.positionSizeForBot2 = ''
        this.percentageOfPortfolioForBot2 = ''
        this.percentageOfPortfolioForBot2 = ''
        this.fixedAmountForBot2 = ''

      } else {
        this.isProfit2Checked = false
        this.deviationPercentageForBot2 = ''
        this.marketPriceReachForBot2Type = ''
        this.marketPriceReachForBot2 = ''
        this.deviationFromForBot2 = ''
        this.positionSizeForBot2 = ''
        this.percentageOfPortfolioForBot2 = ''
        this.percentageOfPortfolioForBot2 = ''
        this.fixedAmountForBot2 = ''

      }
    } else if (botName == 'profit3') {
      if (e.target.checked) {
        this.isProfit3Checked = true
        this.deviationPercentageForBot3 = ''
        this.marketPriceReachForBot3Type = ''
        this.marketPriceReachForBot3 = ''
        this.deviationFromForBot3 = ''
        this.positionSizeForBot3 = ''
        this.percentageOfPortfolioForBot3 = ''
        this.percentageOfPortfolioForBot3 = ''
        this.fixedAmountForBot3 = ''

      } else {
        this.isProfit3Checked = false
        this.deviationPercentageForBot3 = ''
        this.marketPriceReachForBot3Type = ''
        this.marketPriceReachForBot3 = ''
        this.deviationFromForBot3 = ''
        this.positionSizeForBot3 = ''
        this.percentageOfPortfolioForBot3 = ''
        this.percentageOfPortfolioForBot3 = ''
        this.fixedAmountForBot3 = ''

      }
    } else if (botName == 'profit1ForTakeProfit') {
      if (e.target.checked) {
        this.isProfit1CheckedForTakeProfit = true
        this.portfolioPercentageProfit1ForTakeProfit1 = '';
        this.marketPriceReachProfit1ForTakeProfit = 'above';
        this.marketPriceProfit1ForTakeProfit = '';
        this.plPercentProfit1ForTakeProfit = '';

      } else {
        this.isProfit1CheckedForTakeProfit = false
        this.portfolioPercentageProfit1ForTakeProfit1 = '';
        this.marketPriceReachProfit1ForTakeProfit = '';
        this.marketPriceProfit1ForTakeProfit = '';
        this.plPercentProfit1ForTakeProfit = '';

      }
    } else if (botName == 'profit2ForTakeProfit') {
      if (e.target.checked) {
        this.isProfit2CheckedForTakeProfit = true
        this.portfolioPercentageProfit2ForTakeProfit1 = '';
        this.marketPriceReachProfit2ForTakeProfit = 'above';
        this.marketPriceProfit2ForTakeProfit = '';
        this.plPercentProfit2ForTakeProfit = '';


      } else {
        this.isProfit2CheckedForTakeProfit = false
        this.portfolioPercentageProfit2ForTakeProfit1 = '';
        this.marketPriceReachProfit2ForTakeProfit = '';
        this.marketPriceProfit2ForTakeProfit = '';
        this.plPercentProfit2ForTakeProfit = '';


      }
    } else if (botName == 'profit3ForTakeProfit') {
      if (e.target.checked) {
        this.isProfit3CheckedForTakeProfit = true
        this.portfolioPercentageProfit3ForTakeProfit1 = '';
        this.marketPriceReachProfit3ForTakeProfit = 'above';
        this.marketPriceProfit3ForTakeProfit = '';
        this.plPercentProfit3ForTakeProfit = '';


      } else {
        this.isProfit3CheckedForTakeProfit = false
        this.portfolioPercentageProfit3ForTakeProfit1 = '';
        this.marketPriceReachProfit3ForTakeProfit = '';
        this.marketPriceProfit3ForTakeProfit = '';
        this.plPercentProfit3ForTakeProfit = '';


      }
    }
    //console.log('resultant',this.isProfit1Checked,this.isProfit2Checked,this.isProfit3Checked);

  }
  /* Method defination for selected order type */
  // handleOrderType = () => {
  //   if(this.orderType == 'marketorder'){

  //   }else if(this.orderType == 'limitorder'){

  //   }
  // }

  /* Method defination for get all API key list */
  getAllApiKeys = () => {

    // this.selectedApiKey = [{'apiKeyId':12,'apiKeyName': 'API test 1'},{'apiKeyId':15,'apiKeyName': 'API test 2'}]
    let payload = {
      customerId: parseInt(localStorage.getItem('user_id')),
      marketType: this.marketName,
      exchange_name:this.exchangeName
    }
    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/GetApiKey', JSON.stringify(payload), {
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

          this.selectedApiKey = response.keyDetails

        }
      }, reason => {
        this.data.alert('Internal Server Error', 'danger');
        this.data.logout();
      });

  }

  ngOnInit() {

    this.getUserTransaction()


    this.dropdownList = [
      {"id":1,"itemName":"India"},
      {"id":2,"itemName":"Singapore"},
      {"id":3,"itemName":"Australia"},
      {"id":4,"itemName":"Canada"},
      {"id":5,"itemName":"South Korea"},
      {"id":6,"itemName":"Germany"},
      {"id":7,"itemName":"France"},
      {"id":8,"itemName":"Russia"},
      {"id":9,"itemName":"Italy"},
      {"id":10,"itemName":"Sweden"}
    ];

this.dropdownSettings = { 
          singleSelection: true,
          text:"Select API key",
          selectAllText:'Select All',
          unSelectAllText:'UnSelect All',
          enableSearchFilter: true,
          classes:"myclass custom-class",
          labelKey:'apiKeyName',
          primaryKey:'apiKeyId'
        }; 
  
  }

  onItemSelect(item:any){
    this.multiAPIId = [];
    console.log('all api keys', this.selectedApiKeyMulti);

    this.apipublicKey = this.selectedApiKeyMulti[0].api_key;
    this.apisecretKey = this.selectedApiKeyMulti[0].secret_key;

    console.log('all api keys', this.apipublicKey, this.apisecretKey);



  
    for(var i = 0; i<this.selectedApiKeyMulti.length; i++){
      this.multiAPIId.push((this.selectedApiKeyMulti[i].apiKeyId).toString())
  
    }
    this.multiIdString = this.multiAPIId.join(",")
    // this.multiAPIId.toString()
    console.log('only id', this.multiIdString );
}
OnItemDeSelect(item:any){
  this.multiAPIId = [];
  console.log('all api keys', this.selectedApiKeyMulti);

  for(var i = 0; i<this.selectedApiKeyMulti.length; i++){
    this.multiAPIId.push((this.selectedApiKeyMulti[i].apiKeyId).toString())

  }
  this.multiIdString = this.multiAPIId.join(",")
  // this.multiAPIId.toString()
  console.log('only id', this.multiIdString );
  this.apipublicKey = ''
  this.apisecretKey = ''
}
onSelectAll(items: any){
  this.multiAPIId = [];
  console.log('all api keys', this.selectedApiKeyMulti);

  for(var i = 0; i<this.selectedApiKeyMulti.length; i++){
    this.multiAPIId.push((this.selectedApiKeyMulti[i].apiKeyId).toString())

  }
  this.multiIdString = this.multiAPIId.join(",")
  // this.multiAPIId.toString()
  console.log('only id', this.multiIdString );
}
onDeSelectAll(items: any){
  this.multiAPIId = [];
  console.log('all api keys', this.selectedApiKeyMulti);

  for(var i = 0; i<this.selectedApiKeyMulti.length; i++){
    this.multiAPIId.push((this.selectedApiKeyMulti[i].apiKeyId).toString())

  }
  this.multiIdString = this.multiAPIId.join(",")
  // this.multiAPIId.toString()
  console.log('only id', this.multiIdString );
  this.apipublicKey = ''
  this.apisecretKey = ''
}



 

  getLTPdataSpot(buy, sell) {

    // localStorage.setItem('buying_crypto_asset','BTC');
    // localStorage.setItem('selling_asset','USD');


    this.http.get<any>("https://stream.paybito.com/SocketStream/api/get24hTicker?counter=" + buy + "&base=" + sell, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    }).subscribe(data => {
      var result = data;
      // if (this.currency_code == 'BTC' || this.base_currency == 'USDT') {
      this.chartlist = result[0];
      if (this.chartlist) {
        this.data.ctpdata = this.chartlist.ctp;
        this.data.ltpdata = this.chartlist.ltp;

      }
    })


  }
  ngDoCheck() {

    this.Themecolor = localStorage.getItem('themecolor');
    //console.log('saved theme', this.Themecolor)

    // $(".changeButtonColor").on('çlick', function(){

    //   $(this).css('background-color', 'grey');

    // })
  }
  themeChangedHandler(val) {

    this.Themecolor = val;

  }

  getAssetPair() {
    var payload = {}
    var marketType = 1;
    var txnType = 1;

    if(this.marketName == 'SPOT'){

      marketType = 1;

      this.marginShowStatus = false;
      this.marginType = 0;
      this.leverage = 0;
      this.marginTypeOptionStatus = false;
      this.leverage = 0


    }
    else if(this.marketName == 'FUTURES'){

      if(this.exchangeName == 'BINANCE'){

        marketType = 2;
      this.marginShowStatus = false;
      this.marginTypeOptionStatus = false;

      this.leverage = ''

      }
      else{
        
      marketType = 2;
      this.marginShowStatus = true;
      this.marginTypeOptionStatus = false;

      // this.leverage = ''
      if(this.leverage ==''){
        this.leverage = 2
      // console.log('in else 5',this.leverage);


      }
      else{
        this.leverage = this.leverage
        // console.log('in else 6',this.leverage);

      }
      }
      

    }
    else{

      console.log('in else');
      
      this.marginType = 2;
      marketType = 3;
      this.marginShowStatus = true;
      this.marginTypeOptionStatus = true;
      if(this.leverage ==''){
        this.leverage = 2
      
        console.log('in else 2');
      


      }
      else{
        this.leverage = this.leverage
        console.log('in else 3');


      }

    }

    if(this.marginShowStatus == true){
      console.log('in else 4',this.leverage);

      // this.leverage = 2
      if(this.leverage ==''){
        this.leverage = 2
      console.log('in else 5',this.leverage);


      }
      else{
        this.leverage = this.leverage
        console.log('in else 6',this.leverage);

      }

    }
    else{
      this.leverage = ''

    }

    if(this.botOrder == 'Buy'){

      txnType = 1

    }
    
    else{

      txnType = 2
      
    }
    payload['marketType'] = marketType;
    payload['txnType'] = txnType;
    payload['isUpdate'] = 0;
    payload['customerId'] = localStorage.getItem('user_id');
    payload['exchange_name'] = this.exchangeName;


    var jsonString = JSON.stringify(payload);


    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/GetAssetPairs', jsonString, {  headers: {
      'Content-Type': 'application/json',
      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
    } })
      .subscribe(response => {

        console.log('myyll',response.getAssetPairs)

        this.assetetpairback = response.getAssetPairs;

      })


    // if (this.marketName == 'spot') {


    //   this.getNewCurrency('ALL');
    //   this.getUserTransaction()

    // }
    // if (this.marketName == 'futures') {

    //   this.getNewCurrencyFuture('ALL');
    //   this.getUserTransaction();
    //   // this.getNewCurrency();
    // }
    // if (this.marketName == 'options') {

    //   this.getNewCurrencyOption('ALL');
    //   this.getUserTransaction();
    //   // this.getNewCurrency();
    // }

    this.getAllApiKeys()
  }


  onItemChange(val) {

    this.deviationPercentageForBot1 = val
  }

  onItemChangebot1(val) {

    this.percentageOfPortfolioForBot1 = val
    var newStr = this.percentageOfPortfolioForBot1.replace('%','')
    this.binanceLimitOrderPriceCheck('', this.deviationPercentageForBot1, 
                         'LIMIT','PF',newStr,
                         0,this.percentageOfPortfolioForBot2,this.percentageOfPortfolioForBot3,
                         this.fixedAmountForBot1,this.fixedAmountForBot2,this.fixedAmountForBot3);

    
    


     this.paybitoLimitOrderPriceCheck('Percent of Portfolio','Limit Order',
     this.fixedAmountForBot1,this.fixedAmountForBot2,this.fixedAmountForBot3,
     newStr,this.percentageOfPortfolioForBot2,this.percentageOfPortfolioForBot3,this.deviationPercentageForBot1);
  }


  onDeviationChangebot2(val) {

    this.deviationPercentageForBot2 = val
  }

  onItemChangebot2(val) {

    this.percentageOfPortfolioForBot2 = val;
    var newStr = this.percentageOfPortfolioForBot2.replace('%','');
    var newStr1 = this.percentageOfPortfolioForBot1.replace('%','');

    this.binanceLimitOrderPriceCheck('', this.deviationPercentageForBot2, 
                        'LIMIT','PF',newStr,
                        newStr1,0,this.percentageOfPortfolioForBot3,
                        this.fixedAmountForBot1,this.fixedAmountForBot2,this.fixedAmountForBot3)

                        this.paybitoLimitOrderPriceCheck('Percent of Portfolio','Limit Order',
                        this.fixedAmountForBot1,this.fixedAmountForBot2,this.fixedAmountForBot3,
                        newStr1,newStr,this.percentageOfPortfolioForBot3,this.deviationPercentageForBot2);

    // this.singeEntryBinanceFixedPriceCheck('','','LIMIT','PF',newStr,'',newStr1);

  }
  deviationChangebot3(val) {

    this.deviationPercentageForBot3 = val
  }

  onItemChangebot3(val) {

    this.percentageOfPortfolioForBot3 = val;
    var newStr = this.percentageOfPortfolioForBot3.replace('%','');

    var newStr1 = this.percentageOfPortfolioForBot1.replace('%','');
    var newStr2 = this.percentageOfPortfolioForBot2.replace('%','');

    var newStr3 = newStr1 + newStr2
    this.binanceLimitOrderPriceCheck('', this.deviationPercentageForBot3, 
    'LIMIT','PF',newStr,
    newStr1,newStr2,0,
    this.fixedAmountForBot1,this.fixedAmountForBot2,this.fixedAmountForBot3);

    this.paybitoLimitOrderPriceCheck('Percent of Portfolio','Limit Order',
                        this.fixedAmountForBot1,this.fixedAmountForBot2,this.fixedAmountForBot3,
                        newStr2,newStr1,newStr,this.deviationPercentageForBot3)

    

    // this.singeEntryBinanceFixedPriceCheck('','','LIMIT','PF',newStr,'',newStr3);
  }




  perPforChangePos(val) {

    this.percentageOfPortfolioForSingleEntry = val
    var newStr = this.percentageOfPortfolioForSingleEntry.replace('%','')
    this.singeEntryBinanceFixedPriceCheck('','','MARKET','PF',newStr,'','');
    this.paybitoMarketOrderPriceCheck('','Market Order','Percent of Portfolio',newStr,'');
  }

  perPfprofit1orChangePos(val) {
    this.portfolioPercentageProfit1ForTakeProfit1 = val
    // this.portfolioPercentageProfit2ForTakeProfit1 = val
    // this.portfolioPercentageProfit3ForTakeProfit1 = val

    var newStr = this.portfolioPercentageProfit1ForTakeProfit1.replace('%','')
    var newStr1 = this.portfolioPercentageProfit2ForTakeProfit1.replace('%','')
    var newStr2 = this.portfolioPercentageProfit3ForTakeProfit1.replace('%','')

    console.log('tesst',newStr,newStr1,newStr2);

    this.MarketTakeProfitBinanceFixedPriceCheck('', '', 'MARKET','PF',newStr,'',newStr1,newStr2);
      
    

    
    this.marketSingleEntryPercentagePriceCheck('','Market Order','Percent of Portfolio',newStr,newStr1,newStr2,'')

    


  }
  perPfprofit2orChangePos(val) {
    this.portfolioPercentageProfit2ForTakeProfit1 = val


    console.log('yyy',this.portfolioPercentageProfit2ForTakeProfit1);
    console.log('zzz',this.portfolioPercentageProfit1ForTakeProfit1);

    console.log('xxx',this.portfolioPercentageProfit3ForTakeProfit1);

    

    var newStr = this.portfolioPercentageProfit1ForTakeProfit1.replace('%','')
    var newStr1 = this.portfolioPercentageProfit2ForTakeProfit1.replace('%','')
    var newStr2 = this.portfolioPercentageProfit3ForTakeProfit1.replace('%','')

    
    this.MarketTakeProfitBinanceFixedPriceCheck('', '', 'MARKET','PF',newStr1,'',newStr,newStr2);
    
    this.marketSingleEntryPercentagePriceCheck('','Market Order','Percent of Portfolio',newStr,newStr1,newStr2,'')


  }
  perPfprofit3orChangePos(val) {
    this.portfolioPercentageProfit3ForTakeProfit1 = val

    var newStr = this.portfolioPercentageProfit1ForTakeProfit1.replace('%','')
    var newStr1 = this.portfolioPercentageProfit2ForTakeProfit1.replace('%','')
    var newStr2 = this.portfolioPercentageProfit3ForTakeProfit1.replace('%','')

    this.MarketTakeProfitBinanceFixedPriceCheck('', '', 'MARKET','PF',newStr2,'',newStr,newStr1);

    
    this.marketSingleEntryPercentagePriceCheck('','Market Order','Percent of Portfolio',newStr,newStr1,newStr2,'')
    // this.marketSingleEntryPercentagePriceCheck('','MARKET','Percent of Portfolio',newStr,newStr1,newStr2,'')



  }

  positionDollerChangePos(val) {
    this.percentageOfPortfolioForDollarCostAverage = val
    var newStr = this.percentageOfPortfolioForDollarCostAverage.replace('%','')
    this.singeEntryBinanceFixedPriceCheck('','','MARKET','PF',newStr,'','')
    this.paybitoMarketOrderPriceCheck('','Market Order','Percent of Portfolio',newStr,'');


  }







  resetApiKey(){

    this.selectedApiKeyMulti = [];

    console.log('gg',this.selectedApiKeyMulti);
    

  }






  createBotApiCall() {

    var createBot = {}

    createBot['botId'] = '';

    
    createBot['customerId'] = localStorage.getItem('user_id');
    createBot['botName'] = this.botName;


    createBot['botDescription'] = this.botDescription;
    createBot['botMarketType'] = this.marketName;
    createBot['apiKeyId'] = this.multiIdString;
    createBot['botAssetPair'] = this.botAssetPairTrimmed;
    createBot['botTradeOrder'] = this.botOrder;
    createBot['botOrderType'] = this.orderType;
    createBot['botType'] = this.botType;

    if(this.marketName == 'OPTIONS'){
      this.marginType = 2;
    }

    createBot['botMarginType'] = this.marginType;
    createBot['botLeverage'] = this.leverage;




    var expireType = this.botExpireTimeType

    if(this.botExpireTime == null || this.botExpireTime == '' ){
      this.botExpireTime = 0;
    }

    if (expireType == 'days') {

      createBot['botExpiresInDays'] = parseInt(this.botExpireTime);
      createBot['botExpiresInMin'] = '';
      createBot['botExpiresInHour'] = '';
      createBot['expiration_flag'] = 'D';

    }
    if (expireType == 'hrs') {
      createBot['botExpiresInDays'] = '';
      createBot['botExpiresInMin'] = '';
      createBot['botExpiresInHour'] = parseInt(this.botExpireTime);
      createBot['expiration_flag'] = 'H';


    }
    if (expireType == 'min') {
      createBot['botExpiresInDays'] = '';
      createBot['botExpiresInMin'] = parseInt(this.botExpireTime);
      createBot['botExpiresInHour'] = '';
      createBot['expiration_flag'] = 'M';


    }


    createBot['botIsActive'] = 1;
    createBot['status'] = 0;

    createBot['id'] = 0;

    createBot['lobTp1MarketDirection'] = this.marketPriceReachForBotType;
    createBot['lobTp1PriceEntered'] = parseFloat(this.marketPriceReachForBot1);
    createBot['lobTp1DeviationFrom'] = this.deviationFromForBot1;
    createBot['lobTp1DeviationPer'] = parseFloat(this.deviationPercentageForBot1);
    createBot['lobTp1PositionSize'] = this.positionSizeForBot1;

    if (this.positionSizeForBot1 == 'Percent of Portfolio') {
      createBot['lobTp1PerOfPortfolio'] = parseFloat(this.percentageOfPortfolioForBot1);
      createBot['lobTp1FixedAmount'] = 0;
    }
    else {
      createBot['lobTp1PerOfPortfolio'] = 0;
      createBot['lobTp1FixedAmount'] = parseFloat(this.fixedAmountForBot1);
    }

    createBot['lobTp2MarketDirection'] = this.marketPriceReachForBot2Type;
    createBot['lobTp2PriceEntered'] = parseFloat(this.marketPriceReachForBot2);
    createBot['lobTp2DeviationFrom'] = this.deviationFromForBot2;
    createBot['lobTp2DeviationPer'] = parseFloat(this.deviationPercentageForBot2);
    createBot['lobTp2PositionSize'] = this.positionSizeForBot2;

    if (this.positionSizeForBot2 == 'Percent of Portfolio') {
      createBot['lobTp2PerOfPortfolio'] = parseFloat(this.percentageOfPortfolioForBot2);
      createBot['lobTp2FixedAmount'] = 0;
    }
    else {
      createBot['lobTp2PerOfPortfolio'] = 0;
      createBot['lobTp2FixedAmount'] = parseFloat(this.fixedAmountForBot2);
    }



    createBot['lobTp3MarketDirection'] = this.marketPriceReachForBot3Type;
    createBot['lobTp3PriceEntered'] = parseFloat(this.marketPriceReachForBot3);
    createBot['lobTp3DeviationFrom'] = this.deviationFromForBot3;
    createBot['lobTp3DeviationPer'] = parseFloat(this.deviationPercentageForBot3);
    createBot['lobTp3PositionSize'] = this.positionSizeForBot3;


    if (this.positionSizeForBot3 == 'Percent of Portfolio') {
      createBot['lobTp3PerOfPortfolio'] = parseFloat(this.percentageOfPortfolioForBot3);
      createBot['lobTp3FixedAmount'] = 0;
    }
    else {
      createBot['lobTp3PerOfPortfolio'] = 0;
      createBot['lobTp3FixedAmount'] = parseFloat(this.fixedAmountForBot3);
    }



    createBot['semoMarketDirection'] = this.marketPriceReachTypeForSingleEntry;
    createBot['semoPriceEntered'] = parseFloat(this.marketPriceReachForSingleEntry);
    createBot['semoPositionSize'] = this.positionSizeForSingleEntry;

    if (this.positionSizeForSingleEntry == 'Percent of Portfolio') {
      createBot['semoPerOfPortfolio'] = parseFloat(this.percentageOfPortfolioForSingleEntry);
      createBot['semoFixedAmount'] = 0;
    }
    else {
      createBot['semoPerOfPortfolio'] = 0;
      createBot['semoFixedAmount'] = parseFloat(this.fixedAmountForSingleEntry);
    }




    createBot['tpmoTp1MarketDirection'] = this.marketPriceReachProfit1ForTakeProfit;
    createBot['tpmoTp1PriceEntered'] = parseFloat(this.marketPriceProfit1ForTakeProfit);


    if(this.pNlStatus == true){
      createBot['tpmoTp1Pnl'] = -(parseFloat(this.plPercentProfit1ForTakeProfit));

    }
    else{
      createBot['tpmoTp1Pnl'] = parseFloat(this.plPercentProfit1ForTakeProfit);


    }



    createBot['tpmoTp1PerOfPortfolio'] = parseFloat(this.portfolioPercentageProfit1ForTakeProfit1);

    createBot['tpmoTp2MarketDirection'] = this.marketPriceReachProfit2ForTakeProfit;
    createBot['tpmoTp2PriceEntered'] = parseFloat(this.marketPriceProfit2ForTakeProfit);

    if(this.pNlStatus2 == true){
      createBot['tpmoTp2Pnl'] = -(parseFloat(this.plPercentProfit2ForTakeProfit));

    }
    else{
       createBot['tpmoTp2Pnl'] = parseFloat(this.plPercentProfit2ForTakeProfit);


    }


    createBot['tpmoTp2PerOfPortfolio'] = parseFloat(this.portfolioPercentageProfit2ForTakeProfit1);

    createBot['tpmoTp3MarketDirection'] = this.marketPriceReachProfit3ForTakeProfit;
    createBot['tpmoTp3PriceEntered'] = parseFloat(this.marketPriceProfit3ForTakeProfit);

    if(this.pNlStatus3 == true){
      createBot['tpmoTp3Pnl'] = -(parseFloat(this.plPercentProfit3ForTakeProfit));

    }
    else{
       createBot['tpmoTp3Pnl'] = parseFloat(this.plPercentProfit3ForTakeProfit);


    }

    // createBot['tpmoTp3Pnl'] = parseFloat(this.plPercentProfit3ForTakeProfit);

    createBot['tpmoTp3PerOfPortfolio'] = parseFloat(this.portfolioPercentageProfit3ForTakeProfit1);

    createBot['dcaPositionSize'] = this.positionSizeForDollarCostAverage;
    createBot['dcaPerOfPortfolio'] = parseFloat(this.percentageOfPortfolioForDollarCostAverage);
    createBot['dcaFixedAmount'] = parseFloat(this.fixedAmountForDollarCostAverage);


    if (this.investTimeForDolarCostAverageType == 'days') {

      createBot['dcaInvestingTimeMin'] = 0;
      createBot['dcaInvestingTimeHrs'] = 0;
      createBot['dcaInvestingTimeDays'] = parseInt(this.investTimeForDolarCostAverage);

    }
    if (this.investTimeForDolarCostAverageType == 'hrs') {
      createBot['dcaInvestingTimeMin'] = 0;
      createBot['dcaInvestingTimeHrs'] = parseInt(this.investTimeForDolarCostAverage);
      createBot['dcaInvestingTimeDays'] = 0;

    }
    if (this.investTimeForDolarCostAverageType == 'mins') {
      createBot['dcaInvestingTimeMin'] = parseInt(this.investTimeForDolarCostAverage);
      createBot['dcaInvestingTimeHrs'] = 0;
      createBot['dcaInvestingTimeDays'] = 0;

    }

    // createBot['time_frame'] = this.time_frame;
    // if(this.maximum_trade_count == null || this.maximum_trade_count == ''){
    //   this.maximum_trade_count = 0;
    // }
    // createBot['maximum_trade_count'] = this.maximum_trade_count;
    


   



    createBot['exchange_name'] = this.exchangeName;
    createBot['currency'] = this.showAsset;

     
    if(this.exchangeName == 'BINANCE'){

      createBot['marketPrice'] = this.ltpData;
      createBot['api_key'] = this.apipublicKey;
      createBot['secret_key'] = this.apisecretKey;


    }
    else{
      createBot['api_key'] = '';
      createBot['secret_key'] = '';
    }

    

    createBot['action'] = 'INSERT';
    // createBot['message'] = 0;
    // createBot['returnId'] = 0;
    // createBot['lastinsertid'] = 0;

    var jsonString = JSON.stringify(createBot);

    console.log('create bot', createBot)



    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/CreateNewBot', jsonString,
     { headers: {
      'Content-Type': 'application/json',
      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
    }})
      .subscribe(response => {

        if (response.error.error_data == 0) {
          this.data.alert(response.error.error_msg, 'success');

          this.route.navigateByUrl('/my-bots');



        }
        else {


          this.data.alert(response.error.error_msg, 'danger');

        }

      })









    console.log('createbot', createBot)

  }


  getNewCurrency(currency) {


    this.assetetpair = [];
    this.assetetpairback = [];
    this.http.get<any>('https://accounts.paybito.com/CacheService/api/getAssetsData?Name=Assets&BrokerId='+this.data.BROKERID)
      .subscribe(responseCurrency => {
        this.filterCurrency = JSON.parse(responseCurrency.value);
        localStorage.setItem('spot_assets', JSON.stringify(this.filterCurrency.Values))
        this.header = this.filterCurrency.Header;
        this.assets = this.filterCurrency.Values;
        let basecur = this.assets.filter(x => x.baseCurrency == 'USD' && x.currencyCode == 'BTC')
        this.data.changeMessage1(basecur[0].amountPrecision);
        this.data.changeMessage2(basecur[0].pricePrecision);
        if (localStorage.getItem('buying_crypto_asset') == undefined ||
          localStorage.getItem('buying_crypto_asset') == null ||
          localStorage.getItem('buying_crypto_asset') == 'undefined' ||
          localStorage.getItem('buying_crypto_asset') == 'null' ||
          localStorage.getItem('buying_crypto_asset') == '' ||
          localStorage.getItem('selling_crypto_asset') == undefined ||
          localStorage.getItem('selling_crypto_asset') == null ||
          localStorage.getItem('selling_crypto_asset') == 'undefined' ||
          localStorage.getItem('selling_crypto_asset') == 'null' ||
          localStorage.getItem('selling_crypto_asset') == '') {
          localStorage.setItem('amountprc', basecur[0].amountPrecision);
          localStorage.setItem('priceprc', basecur[0].pricePrecision);
          localStorage.setItem('assetCode', basecur[0].assetCode);
        } else {
          localStorage.setItem('amountprc', localStorage.getItem('amountprc'));
          localStorage.setItem('priceprc', localStorage.getItem('priceprc'));
          localStorage.setItem('assetCode', localStorage.getItem('assetCode'));
        }

        if (localStorage.getItem('amountprc') == undefined ||
          localStorage.getItem('amountprc') == null ||
          localStorage.getItem('amountprc') == 'undefined' ||
          localStorage.getItem('amountprc') == 'null' ||
          localStorage.getItem('amountprc') == '') {
          localStorage.setItem('amountprc', basecur[0].amountPrecision);
          localStorage.setItem('priceprc', basecur[0].pricePrecision);
          localStorage.setItem('assetCode', basecur[0].assetCode);
        }
        var basrcurrency = currency;
        var x;
        for (var i = 0; i <= this.assets.length - 1; i++) {
          if (basrcurrency == this.assets[i].baseCurrency) {

            this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade1': this.assets[i].ltpValue, lasttrade2: this.assets[i].ltpConvValue, 'lpricecolor': this.ltpcolor, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'RocColor': this.roccolor, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode });
            this.assetetpairback = [...this.assetetpair];
          }

          else if (basrcurrency == 'ALL') {


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
        }
      })
  }



  getUserTransaction() {


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
        console.log('closing balance list', this.currencyBalance)



      });
  }

  getUserTransactionFuture(cur) {


    var userTransObj = {};
    userTransObj['customerId'] = localStorage.getItem('user_id');
    userTransObj['uuid'] = localStorage.getItem('uuid')
    if (this.selectedMarginType != undefined && this.selectedMarginType != null) {
      userTransObj['marginType'] = this.selectedMarginType;
    }
    var jsonString = JSON.stringify(userTransObj);
    this.http.get<any>(this.data.FUTURELENDINGURL + 'getMarginWalletByCurrency?uuid=' + localStorage.getItem('uuid') + '&currencyName=' + cur + '&marginType=' + this.marginType + '&leverage=' + this.leverage, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        this.balencelist = result.availableBalance;
        this.selelectedSellingAssetBalance = result.availableBalance;

        // this.currencyBalance = this.balencelist;
        // console.log('closing balance list', this.currencyBalance)



      });
  }

  getUserTransactionoptions() {


    var userTransObj = {};
    userTransObj['customerId'] = localStorage.getItem('user_id');
    userTransObj['uuid'] = localStorage.getItem('uuid')
    if (this.selectedMarginType != undefined && this.selectedMarginType != null) {
      userTransObj['marginType'] = this.selectedMarginType;
    }
    var jsonString = JSON.stringify(userTransObj);
    this.http.get<any>(this.data.OPTIONSLENDINGURL + 'getMarginWalletByCurrency?uuid=' + localStorage.getItem('uuid') + '&currencyName=USDT&marginType=' + this.marginType + '&leverage=' + this.leverage, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        this.balencelist = result.availableBalance;
        this.selelectedSellingAssetBalance = result.availableBalance;


      });
  }


  filterAvailableBalanceBinance(pair){

    if(this.marketName == 'SPOT'){
      let payload = {
        apikey: this.apipublicKey,
        secretkey:this.apisecretKey
  
        // apikey: 'dzCoDTswTYvpIsd20kawFcVFfif2CxQPPVsfTRikAqaeuQbbwD3Umd9dzvwCeQUS',
        // secretkey:'qqIARf66paJwAebwuJ/ih9XYiXr+tf8Dab9A3YmsH4qBzODqdGaQsT0Df+yIBMkVSUL7+5vv2qxxUNZtWQDk54zBZyVstwLXNpVtd53GggLZuTXxW7tu0XskClr/Mm1ywSwQ2C7r9idygl/Q'
  
        
      }
      this.http.post<any>(this.data.COPYTRADINGSERVICE+'/apiKey/getBalances', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
  
          var price = response.find(element => element.asset == pair);
  
          this.selelectedSellingAssetBalance = price.free;
  
          console.log('balance',this.selelectedSellingAssetBalance);
          
  
        })

    }
    else{
      let payload = {
        apikey: this.apipublicKey,
        secretkey:this.apisecretKey
  
        // apikey: 'dzCoDTswTYvpIsd20kawFcVFfif2CxQPPVsfTRikAqaeuQbbwD3Umd9dzvwCeQUS',
        // secretkey:'qqIARf66paJwAebwuJ/ih9XYiXr+tf8Dab9A3YmsH4qBzODqdGaQsT0Df+yIBMkVSUL7+5vv2qxxUNZtWQDk54zBZyVstwLXNpVtd53GggLZuTXxW7tu0XskClr/Mm1ywSwQ2C7r9idygl/Q'
  
        
      }
      this.http.post<any>(this.data.COPYTRADINGSERVICE+'/apiKey/getBalancesForFutures', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
  
          // var price = response.find(element => element.asset == pair);
  
          this.selelectedSellingAssetBalance = response.marginBalance;
  
          console.log('balance',this.selelectedSellingAssetBalance);
          
  
        })
    }


 

  }


  getLtpBinanceDataFromSocket(curr1,curr2,status){

    // this.binanceSocket._disconnect();

    console.log('in spot socket');
    

    try{
      
    this.binanceSocket._disconnect();



    }
    catch{
      console.log('spot socket not connected');
      
    }

    try{
      this.futureBinance._disconnect();



    }
    catch{
      console.log('future socket not connected');
      
    }

    setTimeout(() => {
    this.binanceSocket._connect();
      
    }, 250);



    console.log('curr1555', curr1 + curr2);

    this.ltpData ='';
    var assetPair = '';
    
    console.log('status', status);

    this.binanceBuySellStatus = status
    

    assetPair = curr2+curr1;
    localStorage.setItem('binanceLtpAssetPair',assetPair);
    // console.log('fgfggfg',assetPair);
    if(assetPair == undefined || assetPair == 'undefined'){

    }
    else{
    // this.binanceSocket._disconnect();

      this.binanceSocket.currentMessage.subscribe((message:any) => {
        // try{
           
            // let assetPair = curr2+curr1;

            try{
              var pairsData = JSON.parse(message)

            }
            catch{
              console.log('json error');
              
            }

    
            // console.log('tesdtt',  assetPair);
            // console.log('tesdtt123',  pairsData.symbol);

            var ltpAssetLocalStorage = localStorage.getItem('binanceLtpAssetPair')

    
            setTimeout(() => {
              
            
    
            if(pairsData.symbol == ltpAssetLocalStorage){
              // console.log('findsymbol', pairsData);
    
              if(this.binanceBuySellStatus == 'Buy'){
                // console.log('in buy');
                
    
                this.BinanceLtpDataForPair = pairsData.askprice;
                this.ltpData = this.BinanceLtpDataForPair;
    
                // console.log('test ltpdata',this.ltpData);
                
                // this.selelectedSellingAssetBalance = this.BinanceLtpDataForPair
    
    
              }
              else{
                // console.log('in sell');
    
                this.BinanceLtpDataForPair = pairsData.bidprice;
                this.ltpData = this.BinanceLtpDataForPair
    
                // this.selelectedSellingAssetBalance = this.BinanceLtpDataForPair
    
    
              }
    
    
    
              
            }
            else{
              //nothing
            }

          }, 2000);
    
          // }
          // catch{
          //   console.log('error');
    
          // }
    
        })

    }

    



  }


  getFuturesLtpBinanceDataFromSocket(curr1,curr2,status){

    console.log('changes in future socket');
    

    this.ltpData = '';
    try{
      
      this.binanceSocket._disconnect();
  
  
  
      }
      catch{
        console.log('spot socket not connected');
        
      }
  
      try{
        this.futureBinance._disconnect();
  
  
  
      }
      catch{
        console.log('future socket not connected');
        
      }

    setTimeout(() => {
    this.futureBinance._connect();
      
    }, 250);



    



    console.log('status', status);

    this.binanceBuySellStatus = status
    

    var assetPair = curr2+curr1;
    // console.log('fgfggfg',assetPair);

    localStorage.setItem('binanceFutureLtpAssetPair',assetPair);

    setTimeout(() => {

      this.futureBinance.currentMessage.subscribe((message:any) => {
        // try{
    
            // var pairsData = JSON.parse(message)
    
            try{
              var pairsData = JSON.parse(message)
              
    
              
    
            }
            catch{
              console.log('json error');
              
            }
    
            
    
            console.log('paresd json',pairsData);
    
    
            var ltpAssetLocalStorage = localStorage.getItem('binanceFutureLtpAssetPair')
    
              console.log('ltpAssetLocalStorageFuture', ltpAssetLocalStorage);
    
           if(pairsData.symbol == ltpAssetLocalStorage){
             // console.log('findsymbol', pairsData);
    
             if(this.binanceBuySellStatus == 'Buy'){
               console.log('in buy');
               
    
               this.BinanceLtpDataForPair = pairsData.askprice;
               this.ltpData = this.BinanceLtpDataForPair;
    
    
               }
             else{
               console.log('in sell');
    
               this.BinanceLtpDataForPair = pairsData.bidprice;
               this.ltpData = this.BinanceLtpDataForPair
    
               // this.selelectedSellingAssetBalance = this.BinanceLtpDataForPair
    
    
             }
    
    
    
             
           }
    
           
           else{
             //nothing
           }
    
            // console.log('tesdtt',  pairsData.symbol);
    
          
    
          // }
          // catch{
          //   console.log('error');
    
          // }
    
        })
      
    }, 2000);

    
    



  }




  filterAvailableBalance() {

    this.marketPriceReachForBotType = '';
    this.lmodtp1PriceErrorGrt = false;
    this.lmodtp1PriceErrorlwr = false;

    this.marketPriceReachForBot2Type = '';
    this.lmodtp2PriceErrorGrt = false;
    this.lmodtp2PriceErrorlwr = false;

    this.marketPriceReachForBot3Type = '';
    this.lmodtp3PriceErrorGrt = false;
    this.lmodtp3PriceErrorlwr = false;

    this.marketPriceReachForSingleEntry = '';
    this.moSngEntErrorGrt = false;
    this.moSngEntErrorlwr = false;

    this.marketPriceProfit1ForTakeProfit = '';
    this.modtp1PriceErrorGrt = false;
    this.modtp1PriceErrorlwr = false;

    this.marketPriceProfit2ForTakeProfit = '';
    this.modtp2PriceErrorGrt = false;
    this.modtp2PriceErrorlwr = false;

    this.marketPriceProfit3ForTakeProfit = '';
    this.modtp3PriceErrorGrt = false;
    this.modtp3PriceErrorlwr = false;

   

      if(this.botOrder == 'Buy'){

        console.log('ttt', this.botAssetPair)
  
        var curSegment = this.botAssetPair.split("-");
    
        this.botAssetPairTrimmed = curSegment[0]+'-'+curSegment[1]
    
        console.log('as sel', curSegment[1])
  
    
        this.ltpData = curSegment[2];
    
    
        var price = this.currencyBalance.find(element => element.currencyCode == curSegment[1]);

        if(this.botOrder == 'Buy'){
          this.showAsset = curSegment[1]
    
        }
        else{
          this.showAsset = curSegment[0]
    
        }
        if(this.exchangeName == 'BINANCE'){

          if(this.marketName == 'SPOT'){

            this.filterAvailableBalanceBinance(curSegment[1]);
          this.getLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'Buy');

          }
          else{
            this.filterAvailableBalanceBinance(curSegment[1]);
            this.getFuturesLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'Buy');


          }

          
    
        }
        else{

        this.selelectedSellingAssetBalance = price.closingBalance
        


        }
        
    
    
        
  
      }
  
      else{
  
        console.log('ttt', this.botAssetPair)
  
        var curSegment = this.botAssetPair.split("-");
    
        this.botAssetPairTrimmed = curSegment[0]+'-'+curSegment[1]
    
        console.log('as sel', curSegment[0])
    
        this.ltpData = curSegment[2];
    
    
        var price = this.currencyBalance.find(element => element.currencyCode == curSegment[0]);
    
        // this.selelectedSellingAssetBalance = price.closingBalance
    
        if(this.botOrder == 'Buy'){
          this.showAsset = curSegment[1]
    
        }
        else{
          this.showAsset = curSegment[0]
    
        }

        console.log('i sell selllll');
        

        
        if(this.exchangeName == 'BINANCE'){

          if(this.marketName == 'SPOT'){

            this.filterAvailableBalanceBinance(curSegment[0]);
          this.getLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'sell');

          }
          else{
            this.filterAvailableBalanceBinance(curSegment[0]);
            this.getFuturesLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'sell');


          }
    
        }
        else{

        this.selelectedSellingAssetBalance = price.closingBalance


        }
  
      }

    


  }

  filterAvailableBalanceFuture() {

    


    this.marketPriceReachForBotType = '';
    this.lmodtp1PriceErrorGrt = false;
    this.lmodtp1PriceErrorlwr = false;

    this.marketPriceReachForBot2Type = '';
    this.lmodtp2PriceErrorGrt = false;
    this.lmodtp2PriceErrorlwr = false;

    this.marketPriceReachForBot3Type = '';
    this.lmodtp3PriceErrorGrt = false;
    this.lmodtp3PriceErrorlwr = false;

    this.marketPriceReachForSingleEntry = '';
    this.moSngEntErrorGrt = false;
    this.moSngEntErrorlwr = false;

    this.marketPriceProfit1ForTakeProfit = '';
    this.modtp1PriceErrorGrt = false;
    this.modtp1PriceErrorlwr = false;

    this.marketPriceProfit2ForTakeProfit = '';
    this.modtp2PriceErrorGrt = false;
    this.modtp2PriceErrorlwr = false;

    this.marketPriceProfit3ForTakeProfit = '';
    this.modtp3PriceErrorGrt = false;
    this.modtp3PriceErrorlwr = false;

    // var price = this.currencyBalance.find(element => element.currencyCode == this.botAssetPair);
    this.selelectedSellingAssetBalance = '';
    // console.log('boysss', price)

    if(this.botOrder == 'Buy'){

      var curSegment = this.botAssetPair.split("-");

      this.botAssetPairTrimmed = curSegment[3];
  
      console.log('as', this.botAssetPairTrimmed)
  
      this.ltpData = curSegment[2];
  
  
      // var price = this.currencyBalance.find(element => element.currencyCode == curSegment[1]);
  
      // this.selelectedSellingAssetBalance = price.closingBalance
  
      //  console.log('boysss', price)
  
  
      if(this.botOrder == 'Buy'){
        this.showAsset = curSegment[1]
  
      }
      else{
        this.showAsset = curSegment[1]
  
      }

      if(this.exchangeName == 'BINANCE'){

      this.botAssetPairTrimmed = curSegment[0]+'-'+curSegment[1];


       
        this.filterAvailableBalanceBinance(curSegment[1]);
        

          this.getFuturesLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'Buy');


        
  
      }
      else{

        this.getUserTransactionFuture(this.showAsset)


     }


    }
    else{

      var curSegment = this.botAssetPair.split("-");

      this.botAssetPairTrimmed = curSegment[3]
  
      console.log('as', this.botAssetPairTrimmed)
  
      this.ltpData = curSegment[2];
  
  
    
      if(this.botOrder == 'Buy'){
        this.showAsset = curSegment[1]
  
      }
      else{
        this.showAsset = curSegment[1]
  
      }

      if(this.exchangeName == 'BINANCE'){

      this.botAssetPairTrimmed = curSegment[0]+'-'+curSegment[1];
       
        
        this.filterAvailableBalanceBinance(curSegment[1]);

        this.getFuturesLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'sell');


      

    }
    else{

      this.getUserTransactionFuture(this.showAsset)



   }



    }


  

  }

  filterAvailableBalanceOptions(){

    this.getUserTransactionoptions();


    if(this.botOrder == 'Buy'){

      var curSegment = this.botAssetPair.split("-");

      this.botAssetPairTrimmed = curSegment[0]+'-'+curSegment[1]+'-'+curSegment[2]+'-'+curSegment[3]
      console.log('as array', curSegment)

  
      console.log('as', this.botAssetPairTrimmed)
  
      this.ltpData = curSegment[6];
  
  
      // var price = this.currencyBalance.find(element => element.currencyCode == curSegment[5]);
  
      // this.selelectedSellingAssetBalance = price.closingBalance
  
      //  console.log('boysss', price)
  
  
      if(this.botOrder == 'Buy'){
        this.showAsset = curSegment[5]
  
      }
      else{
        this.showAsset = curSegment[5]
  
      }

    }
    else{

      var curSegment = this.botAssetPair.split("-");

      this.botAssetPairTrimmed = curSegment[0]+'-'+curSegment[1]+'-'+curSegment[2]+'-'+curSegment[3]
      console.log('as array', curSegment)

  
      console.log('as', this.botAssetPairTrimmed)
  
      this.ltpData = curSegment[6];
  
  
      // var price = this.currencyBalance.find(element => element.currencyCode == curSegment[5]);
  
      // this.selelectedSellingAssetBalance = price.closingBalance
  
      //  console.log('boysss', price)
  
  
      if(this.botOrder == 'Buy'){
        this.showAsset = curSegment[5]
  
      }
      else{
        this.showAsset = curSegment[5]
  
      }

    }


  }



  getNewCurrencyFuture(currency) {


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
        if (localStorage.getItem('amountprc') == undefined ||
          localStorage.getItem('amountprc') == null ||
          localStorage.getItem('amountprc') == 'undefined' ||
          localStorage.getItem('amountprc') == 'null' ||
          localStorage.getItem('amountprc') == '') {
          localStorage.setItem('amountprc', basecur[0].amountPrecision);
          localStorage.setItem('priceprc', basecur[0].pricePrecision);
          localStorage.setItem('assetCode', basecur[0].assetCode);
        }

        var basrcurrency = currency;
        var x;
        for (var i = 0; i <= this.assets.length - 1; i++) {
          if (basrcurrency == this.assets[i].baseCurrency) {

            this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade1': this.assets[i].ltpValue, lasttrade2: this.assets[i].ltpConvValue, 'lpricecolor': this.ltpcolor, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'RocColor': this.roccolor, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode, 'assetPair': this.assets[i].assetPair, 'assetPairName': this.assets[i].assetPairName, 'currencyId': this.assets[i].currencyId });
            this.assetetpairback = [...this.assetetpair];
          }

          else if (basrcurrency == 'ALL') {


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
        // this.handleSetLeverageMinMaxValue('2', '125');
      })
  }



  getNewCurrencyOption(currency) {




    this.assetetpair = [];
    this.assetetpairback = [];
    this.http.get<any>('https://accounts.paybito.com/CacheService/api/getData?Name=OptionsAssets')
      .subscribe(responseCurrency => {
        console.log('options_values3', this.assets)

        localStorage.setItem('options_assets', responseCurrency.value)
        this.filterCurrency = JSON.parse(responseCurrency.value);
        this.header = this.filterCurrency.Header;

        console.log('options_values2', this.assets)

        this.assets = this.filterCurrency.Values;
        console.log('options_values', this.assets)
        if (this.assets == undefined) {
          this.assets = []
        }

        let basecur = this.assets.filter(x => x.baseCurrency == 'USDT' && x.currencyCode == 'BTC')
        if (basecur.length == 0) {

        }
        else {
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
          if (this.header == this.assets[i].contractValue) {

            this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade1': this.assets[i].ltpValue, lasttrade2: this.assets[i].ltpConvValue, 'lpricecolor': this.ltpcolor, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'RocColor': this.roccolor, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode, 'assetPair': this.assets[i].assetPair, 'assetPairName': this.assets[i].assetPairName, 'currencyId': this.assets[i].currencyId });
            this.assetetpairback = [...this.assetetpair];
            console.log('no offer', this.assetetpairback)
          }

          else if (currency == 'ALL') {


            //if (this.assets[i].currencyType == '1') {
            var lastprice = parseFloat(this.assets[i].ltpValue) + '/' + this.assets[i].ltpConvValue;
            this.assetetpair.push({ 'currencycode': this.assets[i].currencyCode, 'basecurrency': this.assets[i].baseCurrency, 'lasttrade1': this.assets[i].ltpValue, lasttrade2: this.assets[i].ltpConvValue, 'lpricecolor': this.ltpcolor, 'roc': this.assets[i].roc, 'volume': this.assets[i].volume, 'amountPrecision': this.assets[i].amountPrecision, 'pricePrecision': this.assets[i].pricePrecision, 'assetCode': this.assets[i].assetCode, 'assetPair': this.assets[i].assetPair, 'assetPairName': this.assets[i].assetPairName, 'currencyId': this.assets[i].currencyId });
            this.assetetpairback = [...this.assetetpair];
            console.log('no offer1', this.assetetpairback)

            //}
          }


        }
        // console.log('assetPairBack2',this.assetetpairback)




      })
  }

  changeAssetPairForAssetBox() {
    // this.filterAvailableBalance();

    if(this.marketName == 'SPOT'){
      this.filterAvailableBalance();

    }
    else{
      this.filterAvailableBalanceFuture();
    }


  }




  validateMarketOrderTPValue() {



    var tp1 = this.portfolioPercentageProfit1ForTakeProfit1.replace('%', '');
    var tp2 = this.portfolioPercentageProfit2ForTakeProfit1.replace('%', '');
    var tp3 = this.portfolioPercentageProfit3ForTakeProfit1.replace('%', '');

    console.log('string',tp1,tp2,tp3);

    if(tp1 == ''){
      tp1 = '0';

    }
    if(tp2 == ''){
      tp2 = '0';

    }
    if(tp3 == ''){
      tp3 = '0';

    }
    


    var tp1Int = parseInt(tp1)
    var tp2Int = parseInt(tp2)
    var tp3Int = parseInt(tp3)

    if(Number.isNaN(tp1Int)){
      tp1Int = 0;

    }
    if(Number.isNaN(tp2Int)){
      tp2Int = 0;

    }
    if(Number.isNaN(tp3Int)){
      tp3Int = 0;

    }

    console.log('int',tp1Int,tp2Int,tp3Int);


    var total = tp1Int + tp2Int + tp3Int;

    if (total > 100) {
      this.marketOrderTPError = true
    }
    else {
      this.marketOrderTPError = false

    }


    console.log('added', total)





  }

  validateLimitOrderTPValue() {



    var tp1 = this.deviationPercentageForBot1.replace('%', '');
    var tp2 = this.deviationPercentageForBot2.replace('%', '');
    var tp3 = this.deviationPercentageForBot3.replace('%', '');

    console.log('string',tp1,tp2,tp3);

    if(tp1 == ''){
      tp1 = '0';

    }
    if(tp2 == ''){
      tp2 = '0';

    }
    if(tp3 == ''){
      tp3 = '0';

    }
    


    var tp1Int = parseInt(tp1)
    var tp2Int = parseInt(tp2)
    var tp3Int = parseInt(tp3)

    // if(tp1Int == NaN){
    //   tp1Int = 0;

    // }
    // if(tp2Int == NaN){
    //   tp2Int = 0;

    // }
    // if(tp3Int == NaN){
    //   tp3Int = 0;

    // }

    if(Number.isNaN(tp1Int)){
      tp1Int = 0;

    }
    if(Number.isNaN(tp2Int)){
      tp2Int = 0;

    }
    if(Number.isNaN(tp3Int)){
      tp3Int = 0;

    }

    console.log('int',tp1Int,tp2Int,tp3Int);


    var total = tp1Int + tp2Int + tp3Int;

    if (total > 100) {
      this.limitOrderTPError = true
    }
    else {
      this.limitOrderTPError = false

    }


    console.log('added', total)





  }


  lmodtp1PriceChk() {
    // this.lmodtp1PriceErrorGrt = false;
    // this.lmodtp1PriceErrorlwr = false;
    // this.marketPriceReachForBot1 = '';


    if (this.marketPriceReachForBotType == 'above') {

      this.lmodtp1PriceErrorlwr = false

      if (this.marketPriceReachForBot1 <= this.ltpData) {

        this.lmodtp1PriceErrorGrt = true;
      }
      else {

        this.lmodtp1PriceErrorGrt = false;
      }

    }
    else {
      this.lmodtp1PriceErrorGrt = false

      if (this.marketPriceReachForBot1 >= this.ltpData) {

        this.lmodtp1PriceErrorlwr = true;
      }
      else {

        this.lmodtp1PriceErrorlwr = false;
      }

    }
  }


  lmodtp2PriceChk(){

    if (this.marketPriceReachForBot2Type == 'above') {
      this.lmodtp2PriceErrorlwr = false;


      if (this.marketPriceReachForBot2 <= this.ltpData) {

        this.lmodtp2PriceErrorGrt = true;
      }
      else {

        this.lmodtp2PriceErrorGrt = false;
      }

    }
    else {
      this.lmodtp2PriceErrorGrt = false;


      if (this.marketPriceReachForBot2 >= this.ltpData) {

        this.lmodtp2PriceErrorlwr = true;
      }
      else {

        this.lmodtp2PriceErrorlwr = false;
      }

    }

  }

  lmodtp3PriceChk(){

    if (this.marketPriceReachForBot3Type == 'above') {
      this.lmodtp3PriceErrorlwr = false;


      if (this.marketPriceReachForBot3 <= this.ltpData) {

        this.lmodtp3PriceErrorGrt = true;
      }
      else {

        this.lmodtp3PriceErrorGrt = false;
      }

    }
    else {

      this.lmodtp3PriceErrorGrt = false;


      if (this.marketPriceReachForBot3 >= this.ltpData) {

        this.lmodtp3PriceErrorlwr = true;
      }
      else {

        this.lmodtp3PriceErrorlwr = false;
      }

    }

  }
  modSngPriceChk(){

    if (this.marketPriceReachTypeForSingleEntry == 'above') {

      this.moSngEntErrorlwr = false;


      if (this.marketPriceReachForSingleEntry <= this.ltpData) {

        this.moSngEntErrorGrt = true;
      }
      else {

        this.moSngEntErrorGrt = false;
      }

    }
    else {
      this.moSngEntErrorGrt = false;


      if (this.marketPriceReachForSingleEntry >= this.ltpData) {

        this.moSngEntErrorlwr = true;
      }
      else {

        this.moSngEntErrorlwr = false;
      }

    }

  }

  moLtpPosChkTp1(){

    if((this.botOrder == 'Buy' && this.marketPriceReachProfit1ForTakeProfit == 'above') || (this.botOrder == 'Sell' && this.marketPriceReachProfit1ForTakeProfit == 'below')){
      this.pNlStatus = true;
    }
    else{
      this.pNlStatus = false;

    }

    if (this.marketPriceReachProfit1ForTakeProfit == 'above') {
      this.modtp1PriceErrorlwr = false;


      if (this.marketPriceProfit1ForTakeProfit <= this.ltpData) {

        this.modtp1PriceErrorGrt = true;
      }
      else {

        this.modtp1PriceErrorGrt = false;
      }

    }
    else {

      this.modtp1PriceErrorGrt = false;


      if (this.marketPriceProfit1ForTakeProfit >= this.ltpData) {

        this.modtp1PriceErrorlwr = true;
      }
      else {

        this.modtp1PriceErrorlwr = false;
      }

    }

  }

  moLtpPosChkTp2(){

    if((this.botOrder == 'Buy' && this.marketPriceReachProfit2ForTakeProfit == 'above') || (this.botOrder == 'Sell' && this.marketPriceReachProfit2ForTakeProfit == 'below')){
      this.pNlStatus2 = true;
    }
    else{
      this.pNlStatus2 = false;

    }

    if (this.marketPriceReachProfit2ForTakeProfit == 'above') {

      this.modtp2PriceErrorlwr = false;


      if (this.marketPriceProfit2ForTakeProfit <= this.ltpData) {

        this.modtp2PriceErrorGrt = true;
      }
      else {

        this.modtp2PriceErrorGrt = false;
      }

    }
    else {

      this.modtp2PriceErrorGrt = false;


      if (this.marketPriceProfit2ForTakeProfit >= this.ltpData) {

        this.modtp2PriceErrorlwr = true;
      }
      else {

        this.modtp2PriceErrorlwr = false;
      }

    }

  }

  moLtpPosChkTp3(){

    if((this.botOrder == 'Buy' && this.marketPriceReachProfit3ForTakeProfit == 'above') || (this.botOrder == 'Sell' && this.marketPriceReachProfit3ForTakeProfit == 'below')){
      this.pNlStatus3 = true;
    }
    else{
      this.pNlStatus3 = false;

    }

    if (this.marketPriceReachProfit3ForTakeProfit == 'above') {

      this.modtp3PriceErrorlwr = false;


      if (this.marketPriceProfit3ForTakeProfit <= this.ltpData) {

        this.modtp3PriceErrorGrt = true;
      }
      else {

        this.modtp3PriceErrorGrt = false;
      }

    }
    else {

      this.modtp3PriceErrorGrt = false;


      if (this.marketPriceProfit3ForTakeProfit >= this.ltpData) {

        this.modtp3PriceErrorlwr = true;
      }
      else {

        this.modtp3PriceErrorlwr = false;
      }

    }

  }

  singleEntryFixedPriceChk(){

    if(this.fixedAmountForSingleEntry > this.selelectedSellingAssetBalance){
      this.fixedAmountForSingleEntryError = true;
    }
    else{
      this.fixedAmountForSingleEntryError = false;

    }


    
  }


  priceAndPnLValidationtp1(){



    if((this.botOrder == 'Buy' && this.marketPriceReachProfit1ForTakeProfit == 'below') || (this.botOrder == 'Sell' && this.marketPriceReachProfit1ForTakeProfit == 'below')){
      

      var a = (( parseFloat(this.ltpData)- parseFloat(this.marketPriceProfit1ForTakeProfit) )/parseFloat(this.ltpData)) * 100
      console.log('typedData',parseFloat(this.marketPriceProfit1ForTakeProfit));

      console.log('ltpData',parseFloat(this.ltpData));

      console.log('substract', parseFloat(this.ltpData)- parseFloat(this.marketPriceProfit1ForTakeProfit) );
      console.log('full calc1',(( parseFloat(this.ltpData)- parseFloat(this.marketPriceProfit1ForTakeProfit) )/parseFloat(this.ltpData)));
  
  
      
      this.plPercentProfit1ForTakeProfit = a;
    }
    else{


      var a = ((parseFloat(this.marketPriceProfit1ForTakeProfit)  - parseFloat(this.ltpData))/parseFloat(this.ltpData)) * 100
    console.log('typedData',parseFloat(this.marketPriceProfit1ForTakeProfit));
    console.log('ltpData',parseFloat(this.ltpData));
    console.log('substract',parseFloat(this.marketPriceProfit1ForTakeProfit)  - parseFloat(this.ltpData));
    console.log('full calc1',((parseFloat(this.marketPriceProfit1ForTakeProfit)  - parseFloat(this.ltpData))/parseFloat(this.ltpData)));


    
    this.plPercentProfit1ForTakeProfit = a;



      

    }



    


  }

  PnLAndValidationtp1(){



    console.log('plPer', parseFloat(this.plPercentProfit1ForTakeProfit) );
    console.log('ltpData',parseFloat(this.ltpData));



    //buy-below sell-below  -(((parseFloat(this.plPercentProfit1ForTakeProfit) * parseFloat(this.ltpData) ) / 100) - parseFloat(this.ltpData))
    




   if((this.botOrder == 'Buy' && this.marketPriceReachProfit1ForTakeProfit == 'below') || (this.botOrder == 'Sell' && this.marketPriceReachProfit1ForTakeProfit == 'below')){
    var a  = -(((parseFloat(this.plPercentProfit1ForTakeProfit) * parseFloat(this.ltpData) ) / 100) - parseFloat(this.ltpData))

  }
  else{
    var a  = ((parseFloat(this.plPercentProfit1ForTakeProfit) * parseFloat(this.ltpData) ) / 100) + parseFloat(this.ltpData)


  }

     console.log('multi',parseFloat(this.plPercentProfit1ForTakeProfit) * parseFloat(this.ltpData));
     console.log('devide',(parseFloat(this.plPercentProfit1ForTakeProfit) * parseFloat(this.ltpData))/100);
     console.log('full calc2',((parseFloat(this.plPercentProfit1ForTakeProfit) * parseFloat(this.ltpData) ) / 100) + parseFloat(this.ltpData));




    this.marketPriceProfit1ForTakeProfit = a


  }



  priceAndPnLValidationtp2(){

    if((this.botOrder == 'Buy' && this.marketPriceReachProfit2ForTakeProfit == 'below') || (this.botOrder == 'Sell' && this.marketPriceReachProfit2ForTakeProfit == 'below')){
    
    var a = ( parseFloat(this.ltpData)-(parseFloat(this.marketPriceProfit2ForTakeProfit) )/parseFloat(this.ltpData)) * 100

    }
    else{
      var a = ((parseFloat(this.marketPriceProfit2ForTakeProfit)  - parseFloat(this.ltpData))/parseFloat(this.ltpData)) * 100

    }

    console.log('pnlData', a);
    
    this.plPercentProfit2ForTakeProfit = a;


  }

  PnLAndValidationtp2(){

    if((this.botOrder == 'Buy' && this.marketPriceReachProfit2ForTakeProfit == 'below') || (this.botOrder == 'Sell' && this.marketPriceReachProfit2ForTakeProfit == 'below')){
      var a  = -(((parseFloat(this.plPercentProfit2ForTakeProfit) * parseFloat(this.ltpData) ) / 100) - parseFloat(this.ltpData))
  
    }
    else{
      var a  = ((parseFloat(this.plPercentProfit2ForTakeProfit) * parseFloat(this.ltpData) ) / 100) + parseFloat(this.ltpData)
  
  
    }

   this.marketPriceProfit2ForTakeProfit = a;


  }



  priceAndPnLValidationtp3(){

    if((this.botOrder == 'Buy' && this.marketPriceReachProfit3ForTakeProfit == 'below') || (this.botOrder == 'Sell' && this.marketPriceReachProfit3ForTakeProfit == 'below')){
    
      var a = ( parseFloat(this.ltpData)-(parseFloat(this.marketPriceProfit3ForTakeProfit) )/parseFloat(this.ltpData)) * 100
  
      }
      else{
        var a = ((parseFloat(this.marketPriceProfit3ForTakeProfit)  - parseFloat(this.ltpData))/parseFloat(this.ltpData)) * 100
  
      }



    // var a = ((parseFloat(this.marketPriceProfit3ForTakeProfit)  - parseFloat(this.ltpData))/parseFloat(this.ltpData)) * 100
    // console.log('pnlData', a);
    
    this.plPercentProfit3ForTakeProfit = a;


  }

  PnLAndValidationtp3(){


    if((this.botOrder == 'Buy' && this.marketPriceReachProfit3ForTakeProfit == 'below') || (this.botOrder == 'Sell' && this.marketPriceReachProfit3ForTakeProfit == 'below')){
      var a  = -(((parseFloat(this.plPercentProfit3ForTakeProfit) * parseFloat(this.ltpData) ) / 100) - parseFloat(this.ltpData))
  
    }
    else{
      var a  = ((parseFloat(this.plPercentProfit3ForTakeProfit) * parseFloat(this.ltpData) ) / 100) + parseFloat(this.ltpData)
  
  
    }

   this.marketPriceProfit3ForTakeProfit = a;


  }


  resetLimitOrderType(){
    this.BinanceBalanceCheckStatus = false;
    this.botType = '';
    this.marketPriceReachForBotType = '';
    this.marketPriceReachForBot1 = '';
    this.deviationFromForBot1 = '';
    this.deviationPercentageForBot1 = '';
    this.positionSizeForBot1 = '';
    this.percentageOfPortfolioForBot1 = '';
    this.fixedAmountForBot1 = '';

    this.marketPriceReachForBot2 = '';
    this.deviationFromForBot2 = '';
    this.deviationPercentageForBot2 = '';
    this.positionSizeForBot2 = '';
    this.percentageOfPortfolioForBot2 = '';
    this.fixedAmountForBot2 = '';

    this.marketPriceReachForBot3 = '';
    this.deviationFromForBot3 = '';
    this.deviationPercentageForBot3 = '';
    this.positionSizeForBot3 = '';
    this.percentageOfPortfolioForBot3 = '';
    this.fixedAmountForBot3 = '';


    this.marketPriceReachTypeForSingleEntry = '';
    this.marketPriceReachForSingleEntry = '';
    this.positionSizeForSingleEntry = '';
    this.percentageOfPortfolioForSingleEntry = '';
    this.fixedAmountForSingleEntry = '';

    this.positionSizeForDollarCostAverage = '';
    this.percentageOfPortfolioForDollarCostAverage = '';
    this.fixedAmountForDollarCostAverage = '';
    this.investTimeForDolarCostAverage = '';
    this.investTimeForDolarCostAverageType = '';




    this.marketPriceReachProfit1ForTakeProfit = '';
    this.marketPriceProfit1ForTakeProfit = '';
    this.plPercentProfit1ForTakeProfit = '';
    this.portfolioPercentageProfit1ForTakeProfit1 = '';

    this.marketPriceReachProfit2ForTakeProfit = '';
    this.marketPriceProfit2ForTakeProfit = '';
    this.plPercentProfit2ForTakeProfit = '';
    this.portfolioPercentageProfit2ForTakeProfit1 = '';

    this.marketPriceReachProfit3ForTakeProfit = '';
    this.marketPriceProfit3ForTakeProfit = '';
    this.plPercentProfit3ForTakeProfit = '';
    this.portfolioPercentageProfit3ForTakeProfit1 = '';

    this.marketPriceReachProfit3ForTakeProfit = '';
    this.marketPriceReachProfit2ForTakeProfit = '';
    this.marketPriceReachProfit1ForTakeProfit = '';

    this.isProfit1CheckedForTakeProfit = false;
    this.isProfit2CheckedForTakeProfit = false;
    this.isProfit3CheckedForTakeProfit = false;

    this.isProfit1Checked = false;
    this.isProfit2Checked = false;
    this.isProfit3Checked = false;




  }

  leverageCheck(){
    console.log('in funccc');

    console.log(this.leverage);
    
    
    if(this.leverage < 2){
      this.leverage = 2;
    }
    if(this.leverage > 125){
      this.leverage = 125;

    }
  }

  changeMargintype(){
    if(this.marketName == 'SPOT'){


    }
    else if(this.marketName == 'FUTURES'){
      
      this.filterAvailableBalanceFuture();

    }
    else{
      this.filterAvailableBalanceOptions();

    }
  }

  ngOnDestroy() {

    try{
      // this.binanceSocket.unsubscribe();

      this.binanceSocket._disconnect();
      this.futureBinance._disconnect();

     
      
    }
    catch{
        
    }
  }




  VALIDATION1 (e) {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[ A-Za-z0-9_./,-]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (str == '>' || str == ':' || str == ';' || str == '<') {
      return false;
  }
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
  }

  VALIDATION2 (e) {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[ A-Za-z0-9_./,-]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (str == '>' || str == ':' || str == ';' || str == '<') {
      return false;
  }
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
  }

  fixedAmountminmaxCheck(val,id){

    console.log(val);
    

    if(val< 0.0002){

      this.data.alert('Amount should be greater than 0.0002','danger');
      $("#"+id).val('');
    }

  }

  percentageValidation(val,id){

    console.log(val);
    

    if(val > 100){

      this.data.alert('Amount cannot be greater than 100','danger');
      $("#"+id).val('');
    }


  }

  cheeckpnlValidation(val,id){

    if(val > 100){

      this.data.alert('Amount cannot be greater than 100','danger');
      $("#"+id).val('');
    }

  }


  deviationValidationCheck(val,id){
    if(val > 50){

      this.data.alert('Amount cannot be greater than 50','danger');
      $("#"+id).val('');
    }
  }

  investingTimeCheck(val,id){
    if(val == 0){

      this.data.alert('Field value cannot be 0','danger');
      $("#"+id).val('');
      
    }
    else if(this.botExpireTimeType == 'min'){

      if(this.botExpireTime <= 0 || this.botExpireTime >59){
      this.data.alert('Field value cannot must be greater than 0 and less than 60.','danger');
      $("#"+id).val('');

      }

    }
    else if(this.botExpireTimeType == 'hrs'){

      if(this.botExpireTime <= 0 || this.botExpireTime >23){
        this.data.alert('Field value cannot must be greater than 0 and less than 24.','danger');
        $("#"+id).val('');
  
        }
    }
  }

  limitPricePos1(id){
    this.lmodtp1PriceErrorGrt = false;
    this.lmodtp1PriceErrorlwr = false;
    $("#"+id).val('');

  }

  MarketTakeProfitBinanceFixedPriceCheck(
    amount, percent, orderType,
    position,positionPercent,
    previouesFAmount,previousPercent1,previousPercent2){

      if(previousPercent1 == ''){
        previousPercent1 = 0;
      }
      if(previousPercent2 == ''){
        previousPercent2 = 0;
      }

      console.log('ju1',previousPercent1);
      console.log('ju2',previousPercent2);

      

      var prevTotaPercent = parseInt(previousPercent1) + parseInt(previousPercent2) ;

      console.log('vvvvvsv',prevTotaPercent);
      

    this.singeEntryBinanceFixedPriceCheck(amount,percent,orderType,position,positionPercent,previouesFAmount,prevTotaPercent);


  }

  singeEntryBinanceFixedPriceCheck(amount, percent, orderType,position,positionPercent,previouesFAmount,previousPercent){

    if(this.exchangeName == 'BINANCE'){

      var trimmedPercent = percent.replace('%','')

      let payload = {
        symbol: this.botAssetPairTrimmed,
        side: this.botOrder,
        exchange:this.exchangeName,
        market: this.marketName,
        amount: amount,
        percent:trimmedPercent,
        orderType: orderType,
        apiKey: this.apipublicKey,
        secretKey:this.apisecretKey,
        currency: this.showAsset,
        position: position,
        positionPercent:positionPercent,
        previouesFAmount: previouesFAmount,
        previousPercent:previousPercent,
  
        // "symbol":"XRP-USDT",
        // "side":"SELL",
        // "exchange":"BINANCE",
        // "market":"SPOT",
        // "amount":"0.0001",
        // "percent":"10",
        // "orderType":"LIMIT",
        // "apiKey":"dzCoDTswTYvpIsd20kawFcVFfif2CxQPPVsfTRikAqaeuQbbwD3Umd9dzvwCeQUS",
        // "secretKey":"qJDsXLpMN5PMBCE5gJAVLGIxuZhM7if2t7uyPaRnchCxv9Ft0v6k90ivR963u7r8",
        // "currency":"XRP",
        // "position":"PF",
        // "positionPercent":"25"
  
      }
  
      console.log('postttt',payload);
      
  
  
      this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/checkAmountForOther', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          var result = response;
  
          console.log('result',result);

          if(result.statusCode == 1){
            this.BinanceBalanceCheckStatus = false;
            this.data.alert(result.message,'success')

          }
          else{
            this.BinanceBalanceCheckStatus = true;
            this.data.alert(result.message,'danger')

          }
          
  
        })

    }

    


  }

  marketSingleEntryPercentagePriceCheck(amount, orderType,position,percentValue1,percentValue2,percentValue3,deviationPercent){

    if(percentValue1 == ''){
      percentValue1 = 0;
    }
    if(percentValue2 == ''){
      percentValue2 = 0;
    }
    if(percentValue3 == ''){
      percentValue3 = 0;
    }
   

    var totalPercent = parseFloat(percentValue1)+parseFloat(percentValue2)+parseFloat(percentValue3);

    this.paybitoMarketOrderPriceCheck(amount, orderType,position,totalPercent,deviationPercent)

  }



  paybitoMarketOrderPriceCheck(amount, orderType,position,percentValue,deviationPercent){

    if(this.exchangeName == 'PAYBITO'){

      let payload = {
        symbol: this.botAssetPairTrimmed,
        order: this.botOrder,
        market: this.marketName,
        orderType: orderType,
        customerId: parseInt(localStorage.getItem('user_id')),
        currency: this.showAsset,
        positionSize: position,
        fixedAmount:amount,
        percentValue: percentValue,
        deviationPercent:deviationPercent,
        marginType: this.marginType,
        leverage:this.leverage,
  
      }

      console.log('test',payload);





      this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/balanceCheckForOwnExchange', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          var result = response;
  
          console.log('result',result);
          
          // this.BinanceBalanceCheckStatus = result.statusCode;

          if(result.statusCode == 1){
            this.BinanceBalanceCheckStatus = false;
            this.data.alert(result.message,'success')

          }
          else{
            this.BinanceBalanceCheckStatus = true;
            this.data.alert(result.message,'danger')

            

          }
        })
      

    }


   
  }







  binanceLimitOrderPriceCheck(amount, percent,
     orderType,position,positionPercent,
     previousPercent1,previousPercent2,previousPercent3,
     previouesFAmount1,previouesFAmount2,previouesFAmount3){

    if(this.exchangeName == 'BINANCE'){

      console.log('percent', percent);
      

      // if(previouesFAmount == ''){
      //   previouesFAmount = 0;
      // }

      if(previouesFAmount1 == ''){
        previouesFAmount1 = 0;
      }
      if(previouesFAmount2 == ''){
        previouesFAmount2 = 0;
      }
      if(previouesFAmount3 == ''){
        previouesFAmount3 = 0;
      }
      if(previousPercent1 == ''){
        previousPercent1 = 0;
      }
      if(previousPercent2 == ''){
        previousPercent2 = 0;
      }
      if(previousPercent3 == ''){
        previousPercent3 = 0;
      }

      var totalPrevAmount = parseFloat(previouesFAmount1)+parseFloat(previouesFAmount2)+parseFloat(previouesFAmount3);
      var totalPrevPercent = parseFloat(previousPercent1)+parseFloat(previousPercent2)+parseFloat(previousPercent3);


      var trimmedPercent = percent.replace('%','')



      let payload = {
        symbol: this.botAssetPairTrimmed,
        side: this.botOrder,
        exchange:this.exchangeName,
        market: this.marketName,
        amount: amount,
        percent:trimmedPercent,
        orderType: orderType,
        apiKey: this.apipublicKey,
        secretKey:this.apisecretKey,
        currency: this.showAsset,
        position: position,
        positionPercent:positionPercent,
        previouesFAmount: totalPrevAmount,
        previousPercent:totalPrevPercent,
  
        }
  
      console.log('postttt',payload);
      
  
  
      this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/checkAmountForOther', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          var result = response;
  
          console.log('result',result);
          
          // this.BinanceBalanceCheckStatus = result.statusCode;

          if(result.statusCode == 1){
            this.BinanceBalanceCheckStatus = false;
            this.data.alert(result.message,'success')

          }
          else{
            this.BinanceBalanceCheckStatus = true;
            this.data.alert(result.message,'danger')

            

          }
        })

    }

    


  }

  paybitoLimitOrderPriceCheck(positionSize,orderType, fixedAmount1,fixedAmount2,fixedAmount3,
    percentValue1,percentValue2,percentValue3,deviationPercent){

      if(this.exchangeName == 'PAYBITO'){


        if(percentValue1 == ''){
          percentValue1 = 0;
        }
        if(percentValue2 == ''){
          percentValue2 = 0;
        }
        if(percentValue3 == ''){
          percentValue3 = 0;
        }
        if(fixedAmount1 == ''){
          fixedAmount1 = 0;
        }
        if(fixedAmount2 == ''){
          fixedAmount2 = 0;
        }
        if(fixedAmount3 == ''){
          fixedAmount3 = 0;
        }



      var fixedAmount = parseFloat(fixedAmount1)+parseFloat(fixedAmount2)+parseFloat(fixedAmount3);
      var percentValue = parseFloat(percentValue1)+parseFloat(percentValue2)+parseFloat(percentValue3);

   


      var trimmedPercent = deviationPercent.replace('%','')



      let payload = {
        symbol: this.botAssetPairTrimmed,
        order: this.botOrder,
        market:this.marketName,
        orderType: orderType,
        customerId: parseInt(localStorage.getItem('user_id')),
        currency:this.showAsset,
        positionSize: positionSize,
        fixedAmount: fixedAmount,
        percentValue:percentValue,
        deviationPercent: trimmedPercent,
        marginType: this.marginType,
        leverage:this.leverage,
  
        
  
      }
  
      console.log('postttt limit',payload);

      this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/balanceCheckForOwnExchange', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          var result = response;
  
          console.log('result',result);
          
          // this.BinanceBalanceCheckStatus = result.statusCode;

          if(result.statusCode == 1){
            this.BinanceBalanceCheckStatus = false;
            this.data.alert(result.message,'success')

          }
          else{
            this.BinanceBalanceCheckStatus = true;
            this.data.alert(result.message,'danger')

            

          }
        })

      }

  }

  


}
