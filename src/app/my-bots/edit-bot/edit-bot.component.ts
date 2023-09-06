import { Component, OnInit, DoCheck } from '@angular/core';
import { CoreDataService } from '../../core-data.service';
import { BodyService } from '../../body.service'
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { BinanceLtpWebsocket } from '../binanceLtpWebsocket';
import { BinanceFutuesLtpWebsocket } from '../binanceFuturesLtpWebsocket';


@Component({
  selector: 'app-edit-bot',
  templateUrl: './edit-bot.component.html',
  styleUrls: ['./edit-bot.component.css']
})
export class EditBotComponent implements OnInit {
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
  botOrder: any;
  botExpireTime: any;
  botExpireTimeType: any;
  marketPriceReachForBotType: any;
  marketPriceReachForBot2Type: any;
  marketPriceReachForBot3Type: any;
  portfolioPercentageProfit1ForTakeProfit1: any;
  portfolioPercentageProfit2ForTakeProfit1: any;
  portfolioPercentageProfit3ForTakeProfit1: any;
  botDetails: string;
  investTimeForDolarCostAverageType: string;
  apiKey: any;
  botActiveStatus: any;
  botStatus: any;
  botId: any;
  botExpiresInDays: any;
  botExpiresInMin: any;
  botExpiresInHrs: any;
  lobTp3CheckBox: boolean;
  lobTp2CheckBox: boolean;
  lobTp1CheckBox: boolean;
  dcaInvestingTimeDays: any;
  dcaInvestingTimeHrs: any;
  dcaInvestingTimeMin: any;

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

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  selectedApiKeyMulti: any;
  multiAPIId: any[];
  multiIdString: string;

  marginType: any = '0';
  marginShowStatus: boolean = false;
  leverage : any = 0;
  marginTypeOptionStatus: boolean;
  exchangeName: any;
  apipublicKey: any;
  apisecretKey: any;
  BinanceLtpDataForPair: any;
  binanceBuySellStatus: string;
  time_frame: any ;
  maximum_trade_count: any;
  botAssetPairBinance: any;
  BinanceBalanceCheckStatus: boolean = false;
  pNlStatus3: boolean = true;
  pNlStatus2: boolean = true;
  pNlStatus: boolean = true;

  constructor(private http: HttpClient, 
    public data: CoreDataService, 
    public main: BodyService, 
    public activeRoute: ActivatedRoute, 
    public route: Router,
    public binanceSocket: BinanceLtpWebsocket,
    public futureBinance: BinanceFutuesLtpWebsocket) {


      this.binanceSocket._connect();


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
  handleOrderType = () => {
    if (this.orderType == 'marketorder') {

    } else if (this.orderType == 'limitorder') {

    }
  }

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
        this.data.alert('Internal Server Error', 'danger')
      });

  }

  ngOnInit() {
  this.getUserTransaction();


    // const firstParam: string = this.activeRoute.snapshot.queryParamMap.get('botData');


    // var firstParam: string = this.activeRoute.snapshot.queryParamMap.get('botData');

    // const obj = JSON.parse(firstParam);





    this.botDetails = localStorage.getItem('botDatalocalSave');

    this.dropdownSettings = {
      singleSelection: false,
      text: "Select API key",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class",
      labelKey: 'apiKeyName',
      primaryKey: 'apiKeyId'
    };

    if (this.botDetails == undefined || this.botDetails == null) {
      this.route.navigateByUrl('my-bots');

    }
    else {

      this.botDetails = JSON.parse(this.botDetails);
      console.log('bot data', this.botDetails)


    }


    this.assignBotValue()




  }


  onItemSelect(item: any) {
    this.multiAPIId = [];
    console.log('all api keys', this.selectedApiKeyMulti);

    for (var i = 0; i < this.selectedApiKeyMulti.length; i++) {
      this.multiAPIId.push((this.selectedApiKeyMulti[i].apiKeyId).toString())

    }
    this.multiIdString = this.multiAPIId.join(",")
    // this.multiAPIId.toString()
    console.log('only id', this.multiIdString);
  }
  OnItemDeSelect(item: any) {
    this.multiAPIId = [];
    console.log('all api keys', this.selectedApiKeyMulti);

    for (var i = 0; i < this.selectedApiKeyMulti.length; i++) {
      this.multiAPIId.push((this.selectedApiKeyMulti[i].apiKeyId).toString())

    }
    this.multiIdString = this.multiAPIId.join(",")
    // this.multiAPIId.toString()
    console.log('only id', this.multiIdString);
  }
  onSelectAll(items: any) {
    this.multiAPIId = [];
    console.log('all api keys', this.selectedApiKeyMulti);

    for (var i = 0; i < this.selectedApiKeyMulti.length; i++) {
      this.multiAPIId.push((this.selectedApiKeyMulti[i].apiKeyId).toString())

    }
    this.multiIdString = this.multiAPIId.join(",")
    // this.multiAPIId.toString()
    console.log('only id', this.multiIdString);
  }
  onDeSelectAll(items: any) {
    this.multiAPIId = [];
    console.log('all api keys', this.selectedApiKeyMulti);

    for (var i = 0; i < this.selectedApiKeyMulti.length; i++) {
      this.multiAPIId.push((this.selectedApiKeyMulti[i].apiKeyId).toString())

    }
    this.multiIdString = this.multiAPIId.join(",")
    // this.multiAPIId.toString()
    console.log('only id', this.multiIdString);
  }




  ngDoCheck() {

    this.Themecolor = localStorage.getItem('themecolor');
   
  }
  themeChangedHandler(val) {

    this.Themecolor = val;

  }



  onItemChange(val) {

    this.deviationPercentageForBot1 = val
  }

  onItemChangebot1(val) {

    this.percentageOfPortfolioForBot1 = val
    var newStr = this.percentageOfPortfolioForBot1.replace('%','')
    // this.singeEntryBinanceFixedPriceCheck('','','LIMIT','PF',newStr,'','');
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

    this.deviationPercentageForBot2 = val;
    var newStr = this.percentageOfPortfolioForBot2.replace('%','');
    var newStr1 = this.percentageOfPortfolioForBot1.replace('%','');

    // this.singeEntryBinanceFixedPriceCheck('','','LIMIT','PF',newStr,'',newStr1);
    this.binanceLimitOrderPriceCheck('', this.deviationPercentageForBot2, 
                        'LIMIT','PF',newStr,
                        newStr1,0,this.percentageOfPortfolioForBot3,
                        this.fixedAmountForBot1,this.fixedAmountForBot2,this.fixedAmountForBot3);

                        this.paybitoLimitOrderPriceCheck('Percent of Portfolio','Limit Order',
                        this.fixedAmountForBot1,this.fixedAmountForBot2,this.fixedAmountForBot3,
                        newStr1,newStr,this.percentageOfPortfolioForBot3,this.deviationPercentageForBot2);
  }
  deviationChangebot3(val) {

    this.deviationPercentageForBot3 = val
  }

  onItemChangebot3(val) {

    this.percentageOfPortfolioForBot3 = val
    var newStr = this.percentageOfPortfolioForBot3.replace('%','');

    var newStr1 = this.percentageOfPortfolioForBot1.replace('%','');
    var newStr2 = this.percentageOfPortfolioForBot2.replace('%','');

    var newStr3 = newStr1 + newStr2


    // this.singeEntryBinanceFixedPriceCheck('','','LIMIT','PF',newStr,'',newStr3);
    var newStr3 = newStr1 + newStr2
    this.binanceLimitOrderPriceCheck('', this.deviationPercentageForBot3, 
    'LIMIT','PF',newStr,
    newStr1,newStr2,0,
    this.fixedAmountForBot1,this.fixedAmountForBot2,this.fixedAmountForBot3);

    this.paybitoLimitOrderPriceCheck('Percent of Portfolio','Limit Order',
                        this.fixedAmountForBot1,this.fixedAmountForBot2,this.fixedAmountForBot3,
                        newStr2,newStr1,newStr,this.deviationPercentageForBot3)
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

    
    this.marketSingleEntryPercentagePriceCheck('','MARKET','Percent of Portfolio',newStr,newStr1,newStr2,'')




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
    
    this.marketSingleEntryPercentagePriceCheck('','MARKET','Percent of Portfolio',newStr,newStr1,newStr2,'')


  }
  perPfprofit3orChangePos(val) {
    this.portfolioPercentageProfit3ForTakeProfit1 = val

    
    var newStr = this.portfolioPercentageProfit1ForTakeProfit1.replace('%','')
    var newStr1 = this.portfolioPercentageProfit2ForTakeProfit1.replace('%','')
    var newStr2 = this.portfolioPercentageProfit3ForTakeProfit1.replace('%','')

    this.MarketTakeProfitBinanceFixedPriceCheck('', '', 'MARKET','PF',newStr2,'',newStr,newStr1);
    
    this.marketSingleEntryPercentagePriceCheck('','MARKET','Percent of Portfolio',newStr,newStr1,newStr2,'')

  }

  positionDollerChangePos(val) {
    this.percentageOfPortfolioForDollarCostAverage = val
    var newStr = this.percentageOfPortfolioForDollarCostAverage.replace('%','')
    this.singeEntryBinanceFixedPriceCheck('','','MARKET','PF',newStr,'','');
    this.paybitoMarketOrderPriceCheck('','Market Order','Percent of Portfolio',newStr,'');


  }






assignApiKeys(e){
  var dataString = e;
  // var dataString = '224,225';

  var dataArray = dataString.split(",");

  console.log('arraaaa', dataArray)

  var customData = []




  // this.selectedApiKeyMulti = [{ "apiKeyId": 224, "apiKeyName": "Arnab Test API II", "error": null }, { "apiKeyId": 225, "apiKeyName": "Arnab Test API III", "error": null }];

  for (var i = 0; i < dataArray.length; i++) {
    var teee = this.selectedApiKey.find(x => x.apiKeyId == parseInt(dataArray[i]));

    customData.push(teee)


  }

  console.log('dgdgdgdgd', customData);
  this.selectedApiKeyMulti = customData
}


  assignBotValue() {



    this.botId = this.botDetails['botId'];

    this.botDetails['customerId'] = localStorage.getItem('user_id');
    this.botName = this.botDetails['botName'];
    this.exchangeName = this.botDetails['exchange_name'];

    this.apipublicKey = this.botDetails['api_key'];
    this.apisecretKey = this.botDetails['secret_key'];






    this.botDescription = this.botDetails['botDescription'];
    this.marketName = this.botDetails['botMarketType'].toUpperCase();

    this.getAssetPair();

    this.apiKey = this.botDetails['apiKeyId'];
    // this.assignApiKeys(this.apiKey);
    this.botAssetPair = this.botDetails['botAssetPair'];
    this.botAssetPairBinance = this.botDetails['botAssetPair'];

    console.log('pair2',this.botAssetPairBinance);
    

    this.botOrder = this.botDetails['botTradeOrder'];
    this.getBinanceBalance();

    this.orderType = this.botDetails['botOrderType'];
    this.botType = this.botDetails['botType'];

    this.leverage = this.botDetails['botLeverage'];
    this.marginType = this.botDetails['botMarginType'];



    var expireType = this.botExpireTimeType

    this.botExpiresInDays = this.botDetails['days_left_to_expire']
    this.botExpiresInMin = this.botDetails['mins_left_to_expire']
    this.botExpiresInHrs = this.botDetails['hours_left_to_expire']

    if (this.botExpiresInDays != 0) {

      this.botExpireTimeType = 'days'
      this.botExpireTime = this.botDetails['days_left_to_expire'];


    }
    if (this.botExpiresInMin != 0) {
      this.botExpireTimeType = 'min'
      this.botExpireTime = this.botDetails['mins_left_to_expire'];

    }
    if (this.botExpiresInHrs != 0) {
      this.botExpireTimeType = 'hrs'
      this.botExpireTime = this.botDetails['hours_left_to_expire'];



    }


    // if(expireType == 'days'){

    //   this.botDetails['botExpiresInDays'] = parseInt(this.botExpireTime) ;
    //   this.botDetails['botExpiresInMin'] = '';
    // this.botDetails['botExpiresInHour'] = '';

    // }
    // if(expireType == 'hrs'){
    //   this.botDetails['botExpiresInDays'] = '';
    //   this.botDetails['botExpiresInMin'] = '';
    // this.botDetails['botExpiresInHour'] =  parseInt(this.botExpireTime) ;

    // }
    // if(expireType == 'min'){
    //   this.botDetails['botExpiresInDays'] = '';
    //   this.botDetails['botExpiresInMin'] =  parseInt(this.botExpireTime) ;
    //   this.botDetails['botExpiresInHour'] = '';

    // }


    this.botActiveStatus = this.botDetails['botIsActive'];
    this.botStatus = this.botDetails['status'];


    this.marketPriceReachForBotType = this.botDetails['lobTp1MarketDirection'];
    this.marketPriceReachForBot1 = this.botDetails['lobTp1PriceEntered'];
    this.deviationFromForBot1 = this.botDetails['lobTp1DeviationFrom'];
    this.deviationPercentageForBot1 = this.botDetails['lobTp1DeviationPer'];
    this.positionSizeForBot1 = this.botDetails['lobTp1PositionSize'];

    this.percentageOfPortfolioForBot1 = this.botDetails['lobTp1PerOfPortfolio'];
    this.fixedAmountForBot1 = this.botDetails['lobTp1FixedAmount'];


    if (this.botDetails['lobTp1DeviationFrom'] == null) {
      this.isProfit1Checked = false;
    }
    else {
      this.isProfit1Checked = true;

    }



    // if(this.positionSizeForBot1 == 'Percent of Portfolio'){
    //   this.botDetails['lobTp1FixedAmount'] = 0;
    // }
    // else{
    //   this.botDetails['lobTp1PerOfPortfolio'] = 0;
    // }

    this.marketPriceReachForBot2Type = this.botDetails['lobTp2MarketDirection'];
    this.marketPriceReachForBot2 = this.botDetails['lobTp2PriceEntered'];
    this.deviationFromForBot2 = this.botDetails['lobTp2DeviationFrom'];
    this.deviationPercentageForBot2 = this.botDetails['lobTp2DeviationPer'];
    this.positionSizeForBot2 = this.botDetails['lobTp2PositionSize'];
    //

    this.percentageOfPortfolioForBot2 = this.botDetails['lobTp2PerOfPortfolio'];
    this.fixedAmountForBot2 = this.botDetails['lobTp2FixedAmount'];

    if (this.botDetails['lobTp2DeviationFrom'] == null) {
      this.isProfit2Checked = false;
    }
    else {
      this.isProfit2Checked = true;

    }

    //

    // if(this.positionSizeForBot2 == 'Percent of Portfolio'){
    // this.botDetails['lobTp2FixedAmount'] = 0;
    // }
    // else{
    //   this.botDetails['lobTp2PerOfPortfolio'] = 0;
    // }



    this.marketPriceReachForBot3Type = this.botDetails['lobTp3MarketDirection'];
    this.marketPriceReachForBot3 = this.botDetails['lobTp3PriceEntered'];
    this.deviationFromForBot3 = this.botDetails['lobTp3DeviationFrom'];
    this.deviationPercentageForBot3 = this.botDetails['lobTp3DeviationPer'];
    this.positionSizeForBot3 = this.botDetails['lobTp3PositionSize'];


    this.percentageOfPortfolioForBot3 = this.botDetails['lobTp3PerOfPortfolio'];
    this.fixedAmountForBot3 = this.botDetails['lobTp3FixedAmount'];

    if (this.botDetails['lobTp3DeviationFrom'] == null) {
      this.isProfit3Checked = false;
    }
    else {
      this.isProfit3Checked = true;

    }


    // if(this.positionSizeForBot3 == 'Percent of Portfolio'){
    // this.botDetails['lobTp3FixedAmount'] = 0;
    // }
    // else{
    //   this.botDetails['lobTp3PerOfPortfolio'] = 0;
    // }



    this.marketPriceReachTypeForSingleEntry = this.botDetails['semoMarketDirection'];
    this.marketPriceReachForSingleEntry = this.botDetails['semoPriceEntered'];
    this.positionSizeForSingleEntry = this.botDetails['semoPositionSize'];



    this.percentageOfPortfolioForSingleEntry = this.botDetails['semoPerOfPortfolio'];
    this.fixedAmountForSingleEntry = this.botDetails['semoFixedAmount'];

    console.log('semo fixed',this.fixedAmountForSingleEntry);
    


    // if(this.positionSizeForSingleEntry == 'Percent of Portfolio'){
    //   this.percentageOfPortfolioForSingleEntry = this.botDetails['semoPerOfPortfolio']  ;
    // this.botDetails['semoFixedAmount'] = 0;
    // }
    // else{
    //   this.botDetails['semoPerOfPortfolio'] = 0;
    // }




    this.marketPriceReachProfit1ForTakeProfit = this.botDetails['tpmoTp1MarketDirection'];
    this.marketPriceProfit1ForTakeProfit = this.botDetails['tpmoTp1PriceEntered'];
    this.plPercentProfit1ForTakeProfit = this.botDetails['tpmoTp1Pnl'];
    this.portfolioPercentageProfit1ForTakeProfit1 = this.botDetails['tpmoTp1PerOfPortfolio'];

    if (this.marketPriceReachProfit1ForTakeProfit == null) {
      this.isProfit1CheckedForTakeProfit = false

    }
    else {
      this.isProfit1CheckedForTakeProfit = true

    }

    this.marketPriceReachProfit2ForTakeProfit = this.botDetails['tpmoTp2MarketDirection'];
    this.marketPriceProfit2ForTakeProfit = this.botDetails['tpmoTp2PriceEntered'];
    this.plPercentProfit2ForTakeProfit = this.botDetails['tpmoTp2Pnl'];
    this.portfolioPercentageProfit2ForTakeProfit1 = this.botDetails['tpmoTp2PerOfPortfolio'];


    if (this.marketPriceReachProfit2ForTakeProfit == null) {
      this.isProfit2CheckedForTakeProfit = false

    }
    else {
      this.isProfit2CheckedForTakeProfit = true

    }

    this.marketPriceReachProfit3ForTakeProfit = this.botDetails['tpmoTp3MarketDirection'];
    this.marketPriceProfit3ForTakeProfit = this.botDetails['tpmoTp3PriceEntered'];
    this.plPercentProfit3ForTakeProfit = this.botDetails['tpmoTp3Pnl'];
    this.portfolioPercentageProfit3ForTakeProfit1 = this.botDetails['tpmoTp3PerOfPortfolio'];

    if (this.marketPriceReachProfit3ForTakeProfit == null) {
      this.isProfit3CheckedForTakeProfit = false

    }
    else {
      this.isProfit3CheckedForTakeProfit = true

    }

    this.positionSizeForDollarCostAverage = this.botDetails['dcaPositionSize'];
    this.percentageOfPortfolioForDollarCostAverage = this.botDetails['dcaPerOfPortfolio'];
    this.fixedAmountForDollarCostAverage = this.botDetails['dcaFixedAmount'];

    if(this.botDetails['dcaFixedAmount'] != null || this.botDetails['dcaFixedAmount'] != 0){
      this.positionSizeForDollarCostAverage = 'Fixed Amount'
    }
    else if(this.botDetails['dcaPositionSize'] != 0 || this.botDetails['dcaPositionSize'] != null ){
      this.positionSizeForDollarCostAverage = 'Percent of Portfolio'
    }
    else{
      //
    }




    // this.dcaInvestingTimeDays = this.investTimeForDolarCostAverage
    // this.dcaInvestingTimeHrs = this.investTimeForDolarCostAverage
    // this.dcaInvestingTimeMin = this.investTimeForDolarCostAverage


    this.dcaInvestingTimeDays = this.botDetails['dcaInvestingTimeDays']
    this.dcaInvestingTimeHrs = this.botDetails['dcaInvestingTimeHrs']
    this.dcaInvestingTimeMin = this.botDetails['dcaInvestingTimeMin']

    if (this.dcaInvestingTimeDays != 0) {

      this.investTimeForDolarCostAverageType = 'days'
      this.investTimeForDolarCostAverage = this.botDetails['dcaInvestingTimeDays'];
    }
    if (this.dcaInvestingTimeMin != 0) {
      this.investTimeForDolarCostAverageType = 'mins'
      this.investTimeForDolarCostAverage = this.botDetails['dcaInvestingTimeMin'];

    }
    if (this.dcaInvestingTimeHrs != 0) {
      this.investTimeForDolarCostAverageType = 'hrs'
      this.investTimeForDolarCostAverage = this.botDetails['dcaInvestingTimeHrs'];



    }

    // this.time_frame = this.botDetails['time_frame'];
    // this.maximum_trade_count = this.botDetails['maximum_trade_count'];





  }

  getBinanceBalance(){
    if(this.exchangeName == 'BINANCE'){
      var curSegment = this.botAssetPair.split("-");
      

      this.botAssetPairTrimmed = curSegment[0] + '-' + curSegment[1];

      console.log('this.botOrder',this.botOrder);

      this.showAsset = curSegment[1]

      if(this.botOrder == 'Buy'){
        console.log('pair1',curSegment[1]);

        if(this.marketName == 'FUTURES'){

    this.futureBinance._connect();


    setTimeout(() => {



      this.getFuturesLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'Buy');

      
    }, 2000);
          



        }
        else{

        this.getLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'Buy');


        }


        
        this.filterAvailableBalanceBinance(curSegment[1]);

        
      }
      else{
        console.log('pair1',curSegment[1]);

        setTimeout(() => {

          this.getFuturesLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'Sell');

    
          
        }, 2000);


        this.filterAvailableBalanceBinance(curSegment[0]);


      }
      
      

    }
    else{

    }
  }




  updateBotApiCall() {

    var updateBot = {}

    updateBot['botId'] = this.botId;
    updateBot['customerId'] = localStorage.getItem('user_id');
    updateBot['botName'] = this.botName;
    updateBot['exchange_name'] = this.exchangeName;

    updateBot['botDescription'] = this.botDescription;
    updateBot['botMarketType'] = this.marketName;
    updateBot['apiKeyId'] = this.apiKey;
    updateBot['botAssetPair'] = this.botAssetPairTrimmed;
    updateBot['botTradeOrder'] = this.botOrder;
    updateBot['botOrderType'] = this.orderType;
    updateBot['botType'] = this.botType;

    if(this.marketName == 'OPTIONS'){
      this.marginType = 2;
    }

    updateBot['botMarginType'] = this.marginType;
    updateBot['botLeverage'] = this.leverage;

    var expireType = this.botExpireTimeType

    if (expireType == 'days') {

      updateBot['botExpiresInDays'] = this.botExpireTime.toString();
      updateBot['botExpiresInMin'] = '';
      updateBot['botExpiresInHour'] = '';
      updateBot['expiration_flag'] = 'D';


    }
    if (expireType == 'hrs') {
      updateBot['botExpiresInDays'] = '';
      updateBot['botExpiresInMin'] = '';
      updateBot['botExpiresInHour'] = this.botExpireTime.toString();
      updateBot['expiration_flag'] = 'H';


    }
    if (expireType == 'min') {
      updateBot['botExpiresInDays'] = '';
      updateBot['botExpiresInMin'] = this.botExpireTime.toString();
      updateBot['botExpiresInHour'] = '';
      updateBot['expiration_flag'] = 'M';


    }


    updateBot['botIsActive'] = 1;
    updateBot['status'] = 0;

    updateBot['id'] = 0;

    updateBot['lobTp1MarketDirection'] = this.marketPriceReachForBotType;
    updateBot['lobTp1PriceEntered'] = parseFloat(this.marketPriceReachForBot1);
    updateBot['lobTp1DeviationFrom'] = this.deviationFromForBot1;
    updateBot['lobTp1DeviationPer'] = parseFloat(this.deviationPercentageForBot1);
    updateBot['lobTp1PositionSize'] = this.positionSizeForBot1;

    if (this.positionSizeForBot1 == 'Percent of Portfolio') {
      updateBot['lobTp1PerOfPortfolio'] = parseFloat(this.percentageOfPortfolioForBot1);
      updateBot['lobTp1FixedAmount'] = 0;
    }
    else {
      updateBot['lobTp1PerOfPortfolio'] = 0;
      updateBot['lobTp1FixedAmount'] = parseFloat(this.fixedAmountForBot1);
    }

    updateBot['lobTp2MarketDirection'] = this.marketPriceReachForBot2Type;
    updateBot['lobTp2PriceEntered'] = parseFloat(this.marketPriceReachForBot2);
    updateBot['lobTp2DeviationFrom'] = this.deviationFromForBot2;
    updateBot['lobTp2DeviationPer'] = parseFloat(this.deviationPercentageForBot2);
    updateBot['lobTp2PositionSize'] = this.positionSizeForBot2;

    if (this.positionSizeForBot2 == 'Percent of Portfolio') {
      updateBot['lobTp2PerOfPortfolio'] = parseFloat(this.percentageOfPortfolioForBot2);
      updateBot['lobTp2FixedAmount'] = 0;
    }
    else {
      updateBot['lobTp2PerOfPortfolio'] = 0;
      updateBot['lobTp2FixedAmount'] = parseFloat(this.fixedAmountForBot2);
    }



    updateBot['lobTp3MarketDirection'] = this.marketPriceReachForBot3Type;
    updateBot['lobTp3PriceEntered'] = parseFloat(this.marketPriceReachForBot3);
    updateBot['lobTp3DeviationFrom'] = this.deviationFromForBot3;
    updateBot['lobTp3DeviationPer'] = parseFloat(this.deviationPercentageForBot3);
    updateBot['lobTp3PositionSize'] = this.positionSizeForBot3;


    if (this.positionSizeForBot3 == 'Percent of Portfolio') {
      updateBot['lobTp3PerOfPortfolio'] = parseFloat(this.percentageOfPortfolioForBot3);
      updateBot['lobTp3FixedAmount'] = 0;
    }
    else {
      updateBot['lobTp3PerOfPortfolio'] = 0;
      updateBot['lobTp3FixedAmount'] = parseFloat(this.fixedAmountForBot3);
    }



    updateBot['semoMarketDirection'] = this.marketPriceReachTypeForSingleEntry;
    updateBot['semoPriceEntered'] = parseFloat(this.marketPriceReachForSingleEntry);
    updateBot['semoPositionSize'] = this.positionSizeForSingleEntry;

    if (this.positionSizeForSingleEntry == 'Percent of Portfolio') {
      updateBot['semoPerOfPortfolio'] = parseFloat(this.percentageOfPortfolioForSingleEntry);
      updateBot['semoFixedAmount'] = 0;
      console.log('in semo pop');
      
    }
    else {
      updateBot['semoPerOfPortfolio'] = 0;
      updateBot['semoFixedAmount'] = parseFloat(this.fixedAmountForSingleEntry);
      console.log('fa');

    }




    updateBot['tpmoTp1MarketDirection'] = this.marketPriceReachProfit1ForTakeProfit;
    updateBot['tpmoTp1PriceEntered'] = parseFloat(this.marketPriceProfit1ForTakeProfit);
    updateBot['tpmoTp1Pnl'] = parseFloat(this.plPercentProfit1ForTakeProfit);
    updateBot['tpmoTp1PerOfPortfolio'] = parseFloat(this.portfolioPercentageProfit1ForTakeProfit1);

    updateBot['tpmoTp2MarketDirection'] = this.marketPriceReachProfit2ForTakeProfit;
    updateBot['tpmoTp2PriceEntered'] = parseFloat(this.marketPriceProfit2ForTakeProfit);
    updateBot['tpmoTp2Pnl'] = parseFloat(this.plPercentProfit2ForTakeProfit);
    updateBot['tpmoTp2PerOfPortfolio'] = parseFloat(this.portfolioPercentageProfit2ForTakeProfit1);

    updateBot['tpmoTp3MarketDirection'] = this.marketPriceReachProfit3ForTakeProfit;
    updateBot['tpmoTp3PriceEntered'] = parseFloat(this.marketPriceProfit3ForTakeProfit);
    updateBot['tpmoTp3Pnl'] = parseFloat(this.plPercentProfit3ForTakeProfit);
    updateBot['tpmoTp3PerOfPortfolio'] = parseFloat(this.portfolioPercentageProfit3ForTakeProfit1);

    updateBot['dcaPositionSize'] = this.positionSizeForDollarCostAverage;
    updateBot['dcaPerOfPortfolio'] = parseFloat(this.percentageOfPortfolioForDollarCostAverage);
    updateBot['dcaFixedAmount'] = parseFloat(this.fixedAmountForDollarCostAverage);


    if (this.investTimeForDolarCostAverageType == 'days') {

      updateBot['dcaInvestingTimeMin'] = 0;
      updateBot['dcaInvestingTimeHrs'] = 0;
      updateBot['dcaInvestingTimeDays'] = parseInt(this.investTimeForDolarCostAverage);

    }
    if (this.investTimeForDolarCostAverageType == 'hrs') {
      updateBot['dcaInvestingTimeMin'] = 0;
      updateBot['dcaInvestingTimeHrs'] = parseInt(this.investTimeForDolarCostAverage);
      updateBot['dcaInvestingTimeDays'] = 0;

    }
    if (this.investTimeForDolarCostAverageType == 'mins') {
      updateBot['dcaInvestingTimeMin'] = parseInt(this.investTimeForDolarCostAverage);
      updateBot['dcaInvestingTimeHrs'] = 0;
      updateBot['dcaInvestingTimeDays'] = 0;

    }


    // updateBot['time_frame'] = this.time_frame;
    // updateBot['maximum_trade_count'] = this.maximum_trade_count;
    updateBot['currency'] = this.showAsset;


    if(this.exchangeName == 'BINANCE'){

      updateBot['marketPrice'] = this.ltpData;
      updateBot['api_key'] = this.apipublicKey;
      updateBot['secret_key'] = this.apisecretKey;

      

    }
    else{
      updateBot['api_key'] = '';
      updateBot['secret_key'] = '';
    }


    updateBot['action'] = 'UPDATE';

    var jsonString = JSON.stringify(updateBot);

    console.log('update bot', updateBot)



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









    // console.log('update bot',updateBot)

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


        

        let selelectedSellingAssetBalance = this.currencyBalance.filter(x => x.assetPair == this.botAssetPair)


      });
  }

  getAvailableBalanceByCurrency(cur){

    if(this.marketName == 'SPOT' && this.exchangeName != 'BINANCE'){
      // this.filterAvailableBalanceFuture()

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
  
          var price = this.currencyBalance.find(element => element.currencyCode == cur);
  
          this.selelectedSellingAssetBalance = price.closingBalance

          console.log('balance 1',this.selelectedSellingAssetBalance);
          
  
  
  
  
        });
      

    }
    else if(this.marketName == 'FUTURES' && this.exchangeName != 'BINANCE'){
      this.filterAvailableBalanceFuture()

    }
    else if(this.marketName == 'OPTIONS' && this.exchangeName != 'BINANCE'){
      this.filterAvailableBalanceOptions()

    }


   
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


    if (this.botOrder == 'Buy') {

      console.log('ttt', this.botAssetPair)

      var curSegment = this.botAssetPair.split("-");

      this.botAssetPairTrimmed = curSegment[0] + '-' + curSegment[1]

      console.log('as sel', this.botAssetPair)


      this.ltpData = curSegment[2];


      var price = this.currencyBalance.find(element => element.currencyCode == curSegment[1]);
      console.log('hdhdhd', price);
      


      if (this.botOrder == 'Buy') {
        this.showAsset = curSegment[1]

      }
      else {
        this.showAsset = curSegment[0]

      }

      if(this.exchangeName == 'BINANCE'){

        console.log('pair3', curSegment[1]);
        

        this.filterAvailableBalanceBinance(curSegment[1]);
        this.getLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'Buy');

  
      }
      else{

      this.selelectedSellingAssetBalance = price.closingBalance


      }

      
    }

    else {

      console.log('ttt', this.botAssetPair)

      var curSegment = this.botAssetPair.split("-");

      this.botAssetPairTrimmed = curSegment[0] + '-' + curSegment[1]

      console.log('as sel', curSegment[0])

      this.ltpData = curSegment[2];


      var price = this.currencyBalance.find(element => element.currencyCode == curSegment[0]);


      if (this.botOrder == 'Buy') {
        this.showAsset = curSegment[1]

      }
      else {
        this.showAsset = curSegment[0]

      }

      if(this.exchangeName == 'BINANCE'){

        console.log('pair4', curSegment[0]);

        this.filterAvailableBalanceBinance(curSegment[0]);
        this.getLtpBinanceDataFromSocket(curSegment[0],curSegment[1],'Sell');

  
      }
      else{

      this.selelectedSellingAssetBalance = price.closingBalance


      }

      
    }







    // console.log('boysss', price)




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

    console.log('djdjdjdjdjdjjdjdjdj');
    

    if (this.botOrder == 'Buy') {

      var curSegment = this.botAssetPair.split("-");

      this.botAssetPairTrimmed = curSegment[3]

      console.log('as', this.botAssetPairTrimmed)

      this.ltpData = curSegment[2];

      console.log('future price', this.currencyBalance);

      try{
        var price = this.currencyBalance.find(element => element.currencyCode == curSegment[1]);

      this.selelectedSellingAssetBalance = price.closingBalance

      }
      catch{

        console.log('not found');
        

      }
      


      

      console.log('boysss', price)


      if (this.botOrder == 'Buy') {
        this.showAsset = curSegment[1]

      }
      else {
        this.showAsset = curSegment[0]

      }

      if(this.exchangeName == 'BINANCE'){

        console.log('pair5', curSegment[1]);
       
        this.filterAvailableBalanceBinance(curSegment[1]);
        

          this.getFuturesLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'Buy');


        
  
      }
      else{

        this.getUserTransactionFuture(this.showAsset)


     }

      // this.getUserTransactionFuture(this.showAsset)


    }
    else {

      var curSegment = this.botAssetPair.split("-");

      this.botAssetPairTrimmed = curSegment[3]

      console.log('as', this.botAssetPairTrimmed)

      this.ltpData = curSegment[2];


      


      if (this.botOrder == 'Buy') {
        this.showAsset = curSegment[1]

      }
      else {
        this.showAsset = curSegment[0]

      }

      if(this.exchangeName == 'BINANCE'){

        console.log('pair6', curSegment[1]);
       
        
        this.filterAvailableBalanceBinance(curSegment[0]);

        this.getFuturesLtpBinanceDataFromSocket(curSegment[1],curSegment[0],'sell');


      

    }
    else{

      this.getUserTransactionFuture(this.showAsset)



   }

      // this.getUserTransactionFuture(this.showAsset)


    }




  }



  getLtpBinanceDataFromSocket(curr1,curr2,status){


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

    console.log('status', status);

    this.binanceBuySellStatus = status
    

    var assetPair = curr2+curr1;
     console.log('fgfggfg',assetPair);
    this.binanceSocket.currentMessage.subscribe((message:any) => {
    // try{

        var pairsData = JSON.parse(message)

        // console.log('tesdtt',  pairsData.symbol);


        if(pairsData.symbol == assetPair){
          // console.log('findsymbol', pairsData);

          if(this.binanceBuySellStatus == 'Buy'){
            console.log('in buy');
            

            this.BinanceLtpDataForPair = pairsData.askprice;
            this.ltpData = this.BinanceLtpDataForPair;


            // this.selelectedSellingAssetBalance = this.BinanceLtpDataForPair


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

      // }
      // catch{
      //   console.log('error');

      // }

    })
    



  }

  getFuturesLtpBinanceDataFromSocket(curr1,curr2,status){

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
    this.futureBinance.currentMessage.subscribe((message:any) => {
    // try{

        var pairsData = JSON.parse(message)

        // console.log('tesdtt',  pairsData.symbol);


        if(pairsData.symbol == assetPair){
          // console.log('findsymbol', pairsData);

          if(this.binanceBuySellStatus == 'Buy'){
            console.log('in buy');
            

            this.BinanceLtpDataForPair = pairsData.askprice;
            this.ltpData = this.BinanceLtpDataForPair;


            // this.selelectedSellingAssetBalance = this.BinanceLtpDataForPair


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

      // }
      // catch{
      //   console.log('error');

      // }

    })
    



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

  filterAvailableBalanceOptions(){

    this.getUserTransactionoptions();


    if(this.botOrder == 'Buy'){

      var curSegment = this.botAssetPair.split("-");

      this.botAssetPairTrimmed = curSegment[0]+'-'+curSegment[1]+'-'+curSegment[2]+'-'+curSegment[3]
      console.log('as array', curSegment)

  
      console.log('as', this.botAssetPairTrimmed)
  
      this.ltpData = curSegment[6];
  
  
      
  
  
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
  
  
      
  
  
      if(this.botOrder == 'Buy'){
        this.showAsset = curSegment[5]
  
      }
      else{
        this.showAsset = curSegment[5]
  
      }

    }


  }


  changeAssetPairForAssetBox() {
    // this.filterAvailableBalance();

    if (this.marketName == 'SPOT') {
      this.filterAvailableBalance();

    }
    else if(this.marketName == 'FUTURES'){
      this.filterAvailableBalanceFuture();
    }
    else{
      this.filterAvailableBalanceOptions();

    }


  }




  validateMarketOrderTPValue() {



    var tp1 = this.portfolioPercentageProfit1ForTakeProfit1.replace('%', '');
    var tp2 = this.portfolioPercentageProfit2ForTakeProfit1.replace('%', '');
    var tp3 = this.portfolioPercentageProfit3ForTakeProfit1.replace('%', '');

    console.log('string', tp1, tp2, tp3);

    if (tp1 == '') {
      tp1 = '0';

    }
    if (tp2 == '') {
      tp2 = '0';

    }
    if (tp3 == '') {
      tp3 = '0';

    }



    var tp1Int = parseInt(tp1)
    var tp2Int = parseInt(tp2)
    var tp3Int = parseInt(tp3)

    if (Number.isNaN(tp1Int)) {
      tp1Int = 0;

    }
    if (Number.isNaN(tp2Int)) {
      tp2Int = 0;

    }
    if (Number.isNaN(tp3Int)) {
      tp3Int = 0;

    }
    // if (tp1Int == NaN) {
    //   tp1Int = 0;

    // }
    // if (tp2Int == NaN) {
    //   tp2Int = 0;

    // }
    // if (tp3Int == NaN) {
    //   tp3Int = 0;

    // }

    console.log('int', tp1Int, tp2Int, tp3Int);


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

    console.log('string', tp1, tp2, tp3);

    if (tp1 == '') {
      tp1 = '0';

    }
    if (tp2 == '') {
      tp2 = '0';

    }
    if (tp3 == '') {
      tp3 = '0';

    }



    var tp1Int = parseInt(tp1)
    var tp2Int = parseInt(tp2)
    var tp3Int = parseInt(tp3)

    // if (tp1Int == NaN) {
    //   tp1Int = 0;

    // }
    // if (tp2Int == NaN) {
    //   tp2Int = 0;

    // }
    // if (tp3Int == NaN) {
    //   tp3Int = 0;

    // }

    if (Number.isNaN(tp1Int)) {
      tp1Int = 0;

    }
    if (Number.isNaN(tp2Int)) {
      tp2Int = 0;

    }
    if (Number.isNaN(tp3Int)) {
      tp3Int = 0;

    }

    console.log('int', tp1Int, tp2Int, tp3Int);


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
    payload['isUpdate'] = 1;
    payload['customerId'] = localStorage.getItem('user_id');
    payload['exchange_name'] = this.exchangeName;



    var jsonString = JSON.stringify(payload);


    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/GetAssetPairs', jsonString, {
      headers: {
      'Content-Type': 'application/json',
      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
     }  
  })
      .subscribe(response => {

        console.log('myyll',response.getAssetPairs)

        this.assetetpairback = response.getAssetPairs;

        console.log('new asse pair',this.assetetpairback);

      

        if(this.marketName == 'SPOT'){
          var bakAsset = this.botAssetPair;
          this.botAssetPairTrimmed = this.botAssetPair;
          var trimmedAsset = this.botAssetPair.replace('-', '');
          console.log('trimmed string',trimmedAsset);

        let filterString = this.assetetpairback.filter(x => x.assetPair == trimmedAsset)

        if (this.botOrder == 'Buy') {
          this.showAsset = filterString[0].baseCurrency
  
        }
        else {
          this.showAsset = filterString[0].currency
  
        }

        // this.showAsset = filterString[0].baseCurrency

        // this.showAsset = filterString[0].currency
        
        console.log('filtered array',filterString);

        this.botAssetPair = bakAsset+'-'+filterString[0].ltp

        this.ltpData = filterString[0].ltp

        console.log('this.currencyBalance', this.botAssetPair);

        this.getAvailableBalanceByCurrency(this.showAsset)

        
        

        console.log('assss',this.botAssetPair);
        


        

          
        }

        if(this.marketName == 'FUTURES' ){


          if(this.exchangeName == 'BINANCE'){

          // this.showAsset = filterString[0].baseCurrency


          }
          else{

            
          var bakAsset = this.botAssetPair;
          this.botAssetPairTrimmed = this.botAssetPair;

          // var trimmedAsset = this.botAssetPair.replace('-', '');
          // console.log('trimmed string',bakAsset);

         let filterString = this.assetetpairback.filter(x => x.assetPair == bakAsset)

         if (this.botOrder == 'Buy') {
          this.showAsset = filterString[0].baseCurrency
  
        }
        else {
          this.showAsset = filterString[0].currency
  
        }

        //  this.showAsset = filterString[0].baseCurrency

        // // this.showAsset = filterString[0].currency
        
         console.log('filtered arrayssssss',filterString);

         this.botAssetPair = filterString[0].currency+'-'+filterString[0].baseCurrency+'-'+filterString[0].ltp+'-'+filterString[0].assetPair

         this.ltpData = filterString[0].ltp
        this.getAvailableBalanceByCurrency(this.showAsset)


         console.log('this.currencyBalance', this.botAssetPair);

        // this.getAvailableBalanceByCurrency(filterString[0].baseCurrency)

        // console.log('assss',this.botAssetPair);
        


          }


        

          
        }

        if(this.marketName == 'OPTIONS'){
          var bakAsset = this.botAssetPair;
          this.botAssetPairTrimmed = this.botAssetPair;

          // var trimmedAsset = this.botAssetPair.replace('-', '');
          // console.log('trimmed string',bakAsset);

         let filterString = this.assetetpairback.filter(x => x.assetPair == bakAsset)

         if (this.botOrder == 'Buy') {
          this.showAsset = filterString[0].baseCurrency
  
        }
        else {
          this.showAsset = filterString[0].currency
  
        }

        //  this.showAsset = filterString[0].baseCurrency

        // // this.showAsset = filterString[0].currency
        
         console.log('filtered arrayyyyyyyyy',filterString);

         this.botAssetPair = filterString[0].assetPair+'-'+filterString[0].currency+'-'+filterString[0].baseCurrency+'-'+filterString[0].ltp;

         this.ltpData = filterString[0].ltp
        this.getAvailableBalanceByCurrency(this.showAsset)


         console.log('this.currencyBalance', this.botAssetPair);

        // this.getAvailableBalanceByCurrency(filterString[0].baseCurrency)

        // console.log('assss',this.botAssetPair);
        


        

        }

        

        
        

      })
  }

  resetSingleEntryValue(){

    this.percentageOfPortfolioForSingleEntry = '';
    this.fixedAmountForSingleEntry = '';

  }

  resetLimitOrderType(){
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
    if(val > 100){

      this.data.alert('Amount cannot be greater than 100','danger');
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

  limitPricePos1(){
    this.lmodtp1PriceErrorGrt = false;
    this.lmodtp1PriceErrorlwr = false;
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

      var prevTotaPercent = parseInt(previousPercent1) + parseInt(previousPercent2) ;

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

  // LimitTakeProfitBinanceFixedPriceCheck(
  //   amount, percent, orderType,
  //   position,positionPercent,
  //   previouesFAmount,previouesFAmount1,previousPercent){

  //     if(previouesFAmount == ''){
  //       previouesFAmount == 0;
  //     }
  //     if(previouesFAmount1 == ''){
  //       previouesFAmount1 == 0;
  //     }

  //     var prevTotaAmount = parseInt(previouesFAmount) + parseInt(previouesFAmount1) ;



  //   this.binanceLimitOrderPriceCheck(amount,percent,orderType,position,positionPercent,prevTotaAmount,previousPercent);


  // }


  // LimitTakeProfitBinancePercentagePriceCheck(
  //   amount, percent, orderType,
  //   position,positionPercent,
  //   previouesFAmount,previousPercent,previousPercent1){

  //     if(previousPercent == ''){
  //       previousPercent == 0;
  //     }
  //     if(previousPercent1 == ''){
  //       previousPercent1 == 0;
  //     }

  //     var prevTotaPercent = parseInt(previousPercent) + parseInt(previousPercent1) ;

  //   this.binanceLimitOrderPriceCheck(amount,percent,orderType,position,positionPercent,previouesFAmount,prevTotaPercent);


  // }



  binanceLimitOrderPriceCheck(amount, percent,
     orderType,position,positionPercent,
     previousPercent1,previousPercent2,previousPercent3,
     previouesFAmount1,previouesFAmount2,previouesFAmount3){

    if(this.exchangeName == 'BINANCE'){

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
