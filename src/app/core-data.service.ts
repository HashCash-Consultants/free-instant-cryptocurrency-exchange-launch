import {
  Inject,
  Injectable
} from '@angular/core';
import * as $ from 'jquery';
import {
  Router
} from '@angular/router';
import {
  UserIdleService
} from 'angular-user-idle';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';

import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service/cookie-service/cookie.service';
import { DOCUMENT } from '@angular/common';

// import domain from '../assets/';  


@Injectable({
  providedIn: 'root'
})
export class CoreDataService {
  CURRENCYICON: any = '$ ';
  CURRENCYNAME: any = 'USD';
  exchange: any = '';
  logo: any = './assets/img/logo-white-paybito.png';
  environment: any = 'live';
  ADDR = "http://52.53.237.92:8080/main.html#!/";
  loader: boolean = false;
  reason: any;
  selectedBuyingCryptoCurrencyName: string;
  selectedSellingCryptoCurrencyName: string;
  selectedCryptoCurrencySymbol: string;
  triggersBalance: any = 0;
  selectedBuyingAssetText: string;
  selectedSellingAssetText: string;
  environment_settings_list: string;
  selelectedBuyingAssetBalance: any;
  selelectedSellingAssetBalance: any;
  selectedContractBalance: any;
  selectedBuyingCryptoCurrencyissuer: string;
  selectedSellingCryptoCurrencyissuer: string;
  ctpdata: string;
  ltpdata: string;
  lowprice: string;
  highprice: string;
  changescreencolor: boolean = false;
  rocdata;
  markprice;
  indexprice;
  isMarkPricePositive;
  isIndexPricePositive;
  act;
  react;
  cur;
  ACTION;
  rocreact;
  negetive;
  volumndata;
  indicatorGroup1: any = ['ATR', 'BBAND', 'MACD', 'EMA', 'ROC', 'KDJ', 'MFI', 'CMF'];
  indicatorGroup2: any = ['ARN', 'CHO', 'HA', 'KCH', 'SSMA', 'SOSC', 'Willams %r', 'TRIX'];
  interval: any;
  time: any;
  url: boolean = false;
  resize: boolean = false;
  icon: any;
  WEBSERVICE: string;
  REPORTSERVISE: string;
  TRADESERVICE: string;
  LENDINGURL: string;
  COPYTRADINGBOTURL: string;
  FUTURELENDINGURL: string;
  MARGINURL: string;
  FUTUREMARGINURL: string;
  OPTIONSMARGINURL: string;
  OPTIONSLENDINGURL: string;
  settings: any;
  count: any;
  source2: any;
  source3: any;
  source4: any;
  source5: any;
  source6: any;
  source7: any;
  userId;
  abc: any;
  accessToken;
  refreshToken;
  expiresIn;
  x;
  spotMyTradeData: any;
  spotMyOfferData: any;
  spotSpotLimitBuyData: any;
  spotSpotLimitSellData: any;
  futuresMyTradeData: any;
  futuresMyOfferData: any;
  futuresSpotLimitBuyData: any;
  futuresSpotLimitSellData: any;
  optionsMyTradeData: any;
  optionsMyOfferData: any;
  optionsSpotLimitBuyData: any;
  optionsSpotLimitSellData: any;
  BROKERID: string = '';
  selelectedMarginWalletBalance: any;
  GOOGLECLIENTID: any = '745537630536-mpu63dt7rsdcia6jece33jlvavkls3g2.apps.googleusercontent.com';
  LINKEDINCLIENTID: any = '86n39gg96l3mq3';
  LINKEDINSECRETID: any = 'LaMhjR4SJckFyg1M';
  LINKEDINREDIRECTURI: any = 'https://trade.paybito.com/'
  ASSETICONBASEURL:any = 'https://brokersexchange.s3.us-west-1.amazonaws.com/currency_logo/'


  private countryPhone: Array<string> = [];
  private selectedCountryPhone: string = "+1";
  private searchstringCountryPhone: string = "";
  orderbookPrice: any = 0;
  private messageSource = new BehaviorSubject(' ');
  currentMessage = this.messageSource.asObservable();

  private messageSource1 = new BehaviorSubject(' ');
  currentMessage1 = this.messageSource1.asObservable();

  private messageSource2 = new BehaviorSubject(' ');
  currentMessage2 = this.messageSource2.asObservable();
  spotSpotLimitBuyData1 = [];
  timeIntervalForSms = 300
  timeIntervalForEmail = 300
  brokerlogo: string;
  BROKERLOADER: string;
  supportUrl: any;
  isSpot: number = 0;
  isFutures: number = 0;
  isOptions: number = 0;
  isConvert: number = 0;
  isOtc: number = 0;
  isCopyTrade: number;
  isPayment: any;
  companyName: any;
  FUTURESOCKETSTREAMURL: string;
  COPYTRADINGSERVICEURL: string;
  COPYTRADINGSERVICE: string;
  orderbookSellPrice: any;
  brokerBaseUrl: string;
  domainDetails: any;
  brokerDomain: any;


  constructor(private route: Router, private userIdle: UserIdleService, 
    private http: HttpClient,
    public cookie: CookieService,
    @Inject(DOCUMENT) private _document: HTMLDocument,

    ) {
    var alertPl = `<div class="alertPlace"></div>`;
    $('html').append(alertPl).fadeIn();
    switch (this.environment) {
      case 'live':
        /*         this.MARGINURL = "https://api.paybito.com/Margin/"; */
        this.WEBSERVICE = "https://accounts.paybito.com/api";
        this.MARGINURL = this.WEBSERVICE + "/margin/";
        this.FUTUREMARGINURL = this.WEBSERVICE + "/fMargin/";
        /* this.LENDINGURL = "https://api.paybito.com/Margin/trade/"; */
        this.LENDINGURL = this.WEBSERVICE + "/margin/";
        this.FUTURELENDINGURL = this.WEBSERVICE + "/fMargin/";
        this.TRADESERVICE = "https://stream.paybito.com/SocketStream/api/marketPrice";
        this.COPYTRADINGBOTURL = 'https://accounts.paybito.com/CopyTradingBot';
        this.COPYTRADINGSERVICEURL = 'https://accounts.paybito.com/CopyTradingService';
        this.FUTURESOCKETSTREAMURL = 'https://futures-stream.paybito.com/fSocketStream/api';
        this.COPYTRADINGSERVICE = this.WEBSERVICE + "/copyTrading";
        //this.CHARTSERVISE = "https://api.paybito.com/TrendSpriceVolume/paybito/";
        // this.REPORTSERVISE = "https://api.paybito.com/ReportModule/report/";
        this.REPORTSERVISE = this.WEBSERVICE + "/report/";
        this.OPTIONSMARGINURL = this.WEBSERVICE + "/optionsMargin/";
        this.OPTIONSLENDINGURL = this.WEBSERVICE + "/optionsMargin/";
        this.BROKERID = '';
        break;
    }


    const parsedUrl = new URL(window.location.href);
    const baseUrl = parsedUrl.origin;
    this.brokerBaseUrl = baseUrl;
     console.log('domain',baseUrl);



    this.http.get("assets/domain.json").subscribe((data:any) =>{
      // console.log('domain',data);
       this.domainDetails = data.domains;
    // console.log('domain',this.domainDetails.products);
    var newData = this.domainDetails.filter(x => x.domain === this.brokerBaseUrl);
   
   
    console.log('domainsss details',newData);

     this.BROKERID = newData[0].BrokerId;
     this.brokerDomain = newData[0].domain;

     console.log('domainsss brokerId',this.BROKERID);
     console.log('domainsss domain',this.brokerDomain);

     localStorage.setItem('BROKERID',this.BROKERID);

     var brokerId = localStorage.getItem('BROKERID');
     if(brokerId == null || brokerId == '' || brokerId == undefined){
       
     }
     else{
       // console.log('brokerid from storage', brokerId)
       this.BROKERID = brokerId;
 
       // calling broker details as brokerid is already saved in memory;
       this.getBrokerWhitelabelDetails()
 
     }


    })

   



 

    this.getSettings();
  }

  getBrokerWhitelabelDetails(){

    this.brokerlogo = './assets/loading-11.gif';

    console.log('calling broker details');
    this.http.get<any>(this.WEBSERVICE +'/home/getBrokerWiseExchangeInfo?brokerId='+this.BROKERID,{
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .subscribe(data => {

        this.brokerlogo = data.value[0].exchange_logo+'?timestamp='+Date.now();
        this.BROKERLOADER = data.value[0].exchange_loader_icon+'?timestamp='+Date.now();
        this.exchange = data.value[0].exchange;
        this.supportUrl = data.value[0].support_link;
        this.companyName = data.value[0].company_name;
        this.logo = data.value[0].exchange_logo;
        
        this._document.getElementById('appFavicon').setAttribute('href', this.BROKERLOADER);

        

        
      })

    

  }

  getSettings() {
    this.http.get<any>('./assets/settings.json')
      .subscribe(data => {
        this.settings = data;
      })
  }


  checkDashPermission(e){

    console.log('dashhh', e);

    
    this.brokerlogo = './assets/loading-11.gif';

    this.BROKERID = localStorage.getItem('BROKERID');

    console.log('calling broker details');
    var inputObj = {};
    inputObj['brokerId'] = localStorage.getItem('BROKERID');
    inputObj['uuid'] = localStorage.getItem('uuid');
    this.http.post<any>(this.WEBSERVICE +'/user/brokerCryptoMarket',JSON.stringify(inputObj),{
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token')
      }
    }
    )
      .subscribe(data => {

        this.isSpot = data.brokerCryptoMarket.spot;
        this.isFutures = data.brokerCryptoMarket.futures;
        this.isOptions = data.brokerCryptoMarket.options;

        this.isConvert = data.brokerCryptoMarket.convert;
        this.isOtc = data.brokerCryptoMarket.otc;
        this.isCopyTrade = data.brokerCryptoMarket.copyTrade;
        this.isPayment = data.brokerCryptoMarket.payments;


        // this.isConvert = 1;
        // this.isOtc = 1;
        // this.isCopyTrade = 1;

        // this.isSpot = 0;
        // this.isFutures = data.brokerCryptoMarket.futures;
        // this.isOptions = data.brokerCryptoMarket.options;

        // this.isConvert = 0;
        // this.isOtc = 0;
        // this.isCopyTrade = 1;




        
        
        
    if(e == 'spot'){
      if (this.isSpot == 1){

        //nothing to change

      }
      else{

        this.route.navigateByUrl('/settings')
        this.alert("You don't have permission to view that page", 'danger')

      }
    }
    else if(e == 'futures'){

      console.log('in future block');
      
      if (this.isFutures == 1){
        //nothing to change

      }
      else{
        this.route.navigateByUrl('/settings')
        this.alert("You don't have permission to view that page", 'danger')

      }
    }
    else if(e == 'options'){
      if (this.isOptions == 1){
        //nothing to change

      }
      else{
        this.route.navigateByUrl('/settings')
        this.alert("You don't have permission to view that page", 'danger')


      }
    }

    else if(e == 'convert'){
      if (this.isConvert == 1){
        //nothing to change

      }
      else{
        this.route.navigateByUrl('/settings')
        this.alert("You don't have permission to view that page", 'danger')


      }
    }

    else if(e == 'otc'){
      if (this.isOtc == 1){
        //nothing to change

      }
      else{
        this.route.navigateByUrl('/settings')
        this.alert("You don't have permission to view that page", 'danger')


      }
    }

    else if(e == 'copyTrade'){
      if (this.isCopyTrade == 1){
        //nothing to change

      }
      else{
        this.route.navigateByUrl('/settings')
        this.alert("You don't have permission to view that page", 'danger')


      }
    }
    else{
      console.log('from nav to nav');
      
    }


        
console.log('isSpot', this.isSpot);

        
      })

    
    


  }
  async getAllBrokerMarkets(){

    // this.brokerlogo = './assets/loading-11.gif';

    this.BROKERID = localStorage.getItem('BROKERID');

    console.log('calling broker details');
    var inputObj = {};
    inputObj['brokerId'] = localStorage.getItem('BROKERID');
    inputObj['uuid'] = localStorage.getItem('uuid');


    


    const response1 = await this.http.post<any>(this.WEBSERVICE +'/user/brokerCryptoMarket',JSON.stringify(inputObj),{
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token')
      }
    }).toPromise();
      // .subscribe(data => {

       


        this.isSpot = response1.brokerCryptoMarket.spot;
        this.isFutures = response1.brokerCryptoMarket.futures;
        this.isOptions = response1.brokerCryptoMarket.options;

        this.isConvert = response1.brokerCryptoMarket.convert;
        this.isOtc = response1.brokerCryptoMarket.otc;
        this.isCopyTrade = response1.brokerCryptoMarket.copyTrade;
        this.isPayment = response1.brokerCryptoMarket.payments;

        // this.isSpot = 1;
        // this.isFutures = 0;
        // this.isOptions = 1;
        
        

        
      // })

     

  }


 async getAllBrokerDetails(){

    this.brokerlogo = './assets/loading-11.gif';

    this.BROKERID = localStorage.getItem('BROKERID');

    console.log('calling broker details');
    var inputObj = {};
    inputObj['brokerId'] = localStorage.getItem('BROKERID');
    inputObj['uuid'] = localStorage.getItem('uuid');


    


    const response1 = await this.http.post<any>(this.WEBSERVICE +'/user/brokerCryptoMarket',JSON.stringify(inputObj),{
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token')
      }
    }).toPromise();
      

        this.isSpot = response1.brokerCryptoMarket.spot;
        this.isFutures = response1.brokerCryptoMarket.futures;
        this.isOptions = response1.brokerCryptoMarket.options;
        this.isConvert = response1.brokerCryptoMarket.convert;
        this.isOtc = response1.brokerCryptoMarket.otc;
        this.isCopyTrade = response1.brokerCryptoMarket.copyTrade;
        this.isPayment = response1.brokerCryptoMarket.payments;


        // this.isSpot = 0;
        // this.isFutures = 0;
        // this.isOptions = 0;

        
      
     

  }


  Stop() {
    clearInterval(this.x);
    $('#logoutWarncl').click();
    $('.d-block').removeClass('show');
    $('.d-block').siblings().removeClass("modal-backdrop");
    this.userId = localStorage.getItem('user_id');
    let body = new URLSearchParams();
    body.set('username', localStorage.getItem('uuid'));
    var password = localStorage.getItem('password');
    body.set('password', password);
    body.set('grant_type', 'password');
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('authorization', 'Basic cGF5Yml0by13ZWItY2xpZW50OlB5Z2h0bzM0TEpEbg==')
    };
    this.http.post<any>(this.WEBSERVICE + '/oauth/token', body.toString(), options)
      .subscribe(dataAuth => {
        this.accessToken = dataAuth.access_token;
        this.refreshToken = dataAuth.refresh_token;
        this.expiresIn = dataAuth.expires_in;
        localStorage.setItem('access_token', this.accessToken);
        localStorage.setItem('refresh_token', this.refreshToken);
        clearInterval(this.x);
        this.Countdown();
      },
        reason => {
          this.alert(reason, 'danger');
        });
  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  changeMessage1(message1: string) {
    this.messageSource1.next(message1)
  }

  changeMessage2(message2: string) {
    this.messageSource2.next(message2)
  }

  Countdown() {
    var now = new Date().getTime();
    var starttime = Math.round(now / 1000);
    //var countDowntime = starttime + 3600;
    var countDowntime = starttime + 6000;
    console.log('CountDownTime', countDowntime)
    this.x = setInterval(function () {
      var now = new Date().getTime();
      var starttime = Math.round(now / 1000);
      this.distance = countDowntime - starttime;
      if (this.distance == 20) {
        $('#logoutWarn').click();
      }
      if (this.distance == 0) {
        clearInterval(this.x);
        $('#logoutWarncl').click();
        localStorage.clear();
        window.location.href = "https://trade.paybito.com/";
      }
    }, 1000)
  }

  /* Method defination for checking if user is blocked or not */
  async checkUserBlockStatus() {
    let payload = {
      uuid: localStorage.getItem('uuid')
    }

    console.log('response kk');


    const response = await this.http.post<any>(this.WEBSERVICE + '/user/userAccountStatus', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json', 'authorization': 'BEARER ' + localStorage.getItem('access_token'),

      }
    }).toPromise().catch((reason: any) => {
      if (reason.status == 401 || reason.status == '401') {
        this.logout()
        this.alert('Session Timeout. Login Again', 'warning');
      }
    });


    console.log('response kk', response);



    if (response.error.error_data != '0') {
      this.alert(response.error.error_msg, 'error');
      return false;
    } else {
      console.log(response)
      if (response.status != 1) {
        this.logout();
        this.alert('Your user has been blocked by Admin', 'danger');
        return false;
      }
      else {
        return true;
      }
    }


  }


  readable_timestamp(t) {
    var t: any = t.split(/[- :]/);
    var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    d.setMinutes(d.getMinutes() - 330);
    t = d.toTimeString();
    t = t.split(" ");
    return d.toDateString() + " " + t[0];
  }

  Deletecookies() {
    // alert('in delete cookie func');

    var cookieName = 'Username';
    var cookieName1 = 'userId';
    var cookieName2 = 'ssecca';
    document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.paybito.com;path=/';
    document.cookie = cookieName1 + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.paybito.com;path=/';
    document.cookie = cookieName2 + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.paybito.com;path=/';


  }

  logout() {



    var themecolor = localStorage.getItem('themecolor');
    setTimeout(() => {
      // this.Deletecookies();
      localStorage.clear();
    }, 5000);

    var myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    document.cookie = 'isLoggedin' + "=" + false + ";expires=" + myDate + ";domain=.paybito.com;path=/";


    var myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    document.cookie = 'isLoggedinfalse' + "=" + false + ";expires=" + myDate + ";domain=.paybito.com;path=/";


    localStorage.setItem('themecolor', themecolor);
    this.route.navigateByUrl('/');
    //this.handlePageReloadForecibily(100)
    localStorage.setItem('isReloadPage', 'true');





  }

  alert(msg, type, time = 8000) {
    this.reason = msg;
    this.icon = 'puff';
    if (msg == 'Loading...') {
      this.loader = true;
      setTimeout(() => {
        this.loader = false;
      }, 10000);
    } else {
      $('.alert:first').fadeOut();
      var htx = `<div class="alert alert-` + type + ` my-2" role="alert">` + msg + ` <span class="ml-2" style="cursor:pointer;" onclick="removeAlertMessage(this)"><i class="fa fa-times-circle" aria-hidden="true" ></i></span></div>`;
      $('.alertPlace').append(htx).fadeIn();
      setTimeout(() => {
        $('.alert:last').remove().fadeOut();
      }, time);
    }
  }

  alertm(msg, type) {
    this.reason = msg;
    this.icon = 'puff';
    if (msg == 'Loading...') {
      this.loader = true;
      setTimeout(() => {
        this.loader = false;
      }, 8000);
    } else {
      $('.alert:first').fadeOut();
      var htx = `<div class="alert alert-` + type + ` my-2" role="alert">` + msg + `</div>`;
      $('.alertPlace').append(htx).fadeIn();
      setTimeout(() => {
        $('.alert:last').remove().fadeOut();
      }, 8000);
    }
  }
  /* method defination for available ba;lance */
  renderAvailableBalance = (currency, marginType, leverage, operation) => {
    console.log('Call')
    let baseUrl = '';
    if (operation == 'futures') {
      baseUrl = this.FUTURELENDINGURL + 'getMarginWalletByCurrency?uuid=' + localStorage.getItem('uuid') + '&currencyName=' + currency + '&marginType=' + marginType + '&leverage=' + leverage
    } else {
      baseUrl = this.OPTIONSLENDINGURL + 'getMarginWalletByCurrency?uuid=' + localStorage.getItem('uuid') + '&currencyName=' + currency + '&marginType=' + marginType + '&leverage=' + leverage
    }
    this.http.get<any>(baseUrl, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        this.selelectedSellingAssetBalance = data.availableBalance.toFixed(this.getSpecificCurrencyPrecision(currency));
        this.selelectedMarginWalletBalance = data.marginWalletBalance.toFixed(this.getSpecificCurrencyPrecision(currency));
        this.selelectedBuyingAssetBalance = this.selelectedSellingAssetBalance
        this.selectedContractBalance = this.selelectedSellingAssetBalance
      })
  }
  /* Method defination for get all precesion */
  getAllPrecision = () => {
    this.http.get<any>(this.WEBSERVICE + '/home/currencyPrecision')
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

  /* Method defination for get currency precisinon by asset pair */
  getAllAssetPairCurrencyPrecisionList() {
    this.http.get<any>(this.WEBSERVICE + '/home/assetpairPrecision', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        if (data.error.error_data != '0') {
          this.alert('error', data.error.error_msg);
        } else {
          localStorage.setItem('asset_pair_precision_list', JSON.stringify(data.assetPairList));
        }
      })
  }
  /* Method defination for getting specific asset pair precision */
  getSpecificAssetPairPrecision = (param) => {
    let list = JSON.parse(localStorage.getItem('asset_pair_precision_list'));
    let obj = {};
    for (let i = 0; i < list.length; i++) {
      if (list[i].assetPair.toUpperCase() == param.toUpperCase()) {
        obj['amountPrecision'] = list[i].amountPrecision;
        obj['pricePrecision'] = list[i].pricePrecision;
        break;
      }
    }
    return obj;
  }

  /* Method for rendering county code dropdown */
  renderCountryCodeDropdown = () => {
    let phone = [];
    this.http.get<any>('./assets/data/country-phone.json')
      .subscribe(data => {
        let arr = [];
        /* for(let i=0;i<data.length;i++){
          if(this.searchstringCountryPhone == ''){
            arr.push(data[i])
          }else{
            if((data[i].name).toLowerCase().indexOf((this.searchstringCountryPhone).toLowerCase()) != -1 || data[i].dial_code.indexOf(this.searchstringCountryPhone) != -1){
              arr.push(data[i])
            }
          }
        } */
        this.countryPhone = data;
      })
  }

  /* handle phone country code searh */
  handlePhoneContryCodeSearch = (param) => {
    //console.log(param);
    this.searchstringCountryPhone = param;
    console.log(this.searchstringCountryPhone)
    this.renderCountryCodeDropdown();
  }
  /* method defination to retrieve orderbook price on click */
  fetchOrderPrice = (price) => {


    this.orderbookSellPrice = price
    console.log('price', this.orderbookSellPrice);

  }
  fetchOrderPriceSell = (price) => {

    this.orderbookPrice = price
    console.log('price sell', this.orderbookPrice);


  }
  /* Method defination for handing toop tip */
  handleInfoSection = (param) => {
    //alert(param)
    //console.log($('#' + param).attr('style').indexOf('none'));
    if (($('#' + param).attr('style').indexOf('none') != -1)) {
      $('#' + param).show();
    } else {
      $('#' + param).hide();
    }
  }

  /* get assetcode by asset name */
  getAssetCode = (counter, base) => {
    let assets = localStorage.getItem('spot_assets')
    assets = JSON.parse(assets);
    let assetCode = '';
    for (let i = 0; i < assets.length; i++) {
      if (counter.toUpperCase() == (assets[i]['currencyCode']).toUpperCase() && base.toUpperCase() == (assets[i]['baseCurrency']).toUpperCase()) {
        assetCode = assets[i]['assetCode'];
        break;
      }
    }
    return assetCode;
  }

  /* get base and counter id of pair */
  getAssetId = (counter, base) => {
    let assets = localStorage.getItem('spot_assets')
    assets = JSON.parse(assets);
    let assetId = {};
    for (let i = 0; i < assets.length; i++) {
      if (counter.toUpperCase() == (assets[i]['currencyCode']).toUpperCase() && base.toUpperCase() == (assets[i]['baseCurrency']).toUpperCase()) {
        assetId['baseCurrencyId'] = assets[i]['baseCurrencyId'];
        assetId['currencyId'] = assets[i]['currencyId'];
        break;
      }
    }
    return assetId;
  }

  /* function defination to call API for my trade for spot */
  renderDataForMyTradeSpot = () => {
    this.http.get<any>("https://stream.paybito.com/StreamingApi/rest/getTradeHistoryByIdRest?uuid=" + localStorage.getItem('uuid') + "&buyingAssetCode=" + this.selectedBuyingAssetText.toLowerCase() + "&sellingAssetCode=" + this.selectedSellingAssetText.toLowerCase() + "&pageNo=1&noOfItemsPerPage=10", {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;
        /* if (result.error.error_data != '0') {
          this.alert(result.error.error_msg, 'danger');
        } else { */
        this.spotMyTradeData = res.tradeListResult
        document.body.classList.remove("overlay")
        //}
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.logout();
          this.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.alert('Could Not Connect To Server', 'danger');
        }
      });
  }
  /* function defination to call API for my offer for spot */
  renderDataForMyOfferSpot = () => {
    this.http.get<any>("https://stream.paybito.com/StreamingApi/rest/getOfferByAccountIDRest?userID=" + localStorage.getItem('user_id') + "&buyingAssetCode=" + this.selectedBuyingAssetText.toLocaleLowerCase() + "&sellingAssetCode=" + this.selectedSellingAssetText.toLowerCase() + "&pageNo=1&noOfItemsPerPage=10", {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;
        /* if (result.error.error_data != '0') {
          this.alert(result.error.error_msg, 'danger');
        } else { */
        this.spotMyOfferData = response.tradeListResult;
        document.body.classList.remove("overlay")
        //}
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.logout();
          this.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.alert('Could Not Connect To Server', 'danger');
        }
      });
  }
  /* function defination to call API for stop limit for spot */
  renderDataForStopLimitSpot = (param) => {
    let transactiontype = '';
    let payload = {}
    payload['uuid'] = localStorage.getItem('uuid');


    if (param == 'buy') {
      transactiontype = '1';
      payload['buying_asset_code'] = localStorage.getItem('buying_crypto_asset').toUpperCase();
      // inputObj['userId'] = localStorage.getItem('user_id');
      payload['selling_asset_code'] = localStorage.getItem('selling_crypto_asset').toUpperCase();

      payload['txn_type'] = transactiontype;

    } else {
      transactiontype = '2';
      payload['buying_asset_code'] = localStorage.getItem('selling_crypto_asset').toUpperCase();
      // inputObj['userId'] = localStorage.getItem('user_id');
      payload['selling_asset_code'] = localStorage.getItem('buying_crypto_asset').toUpperCase();

      payload['txn_type'] = transactiontype;

    }
    this.http.post<any>(this.WEBSERVICE + '/userTrade/GetStopLossBuySell', JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;
        /* if (result.error.error_data != '0') {
          this.alert(result.error.error_msg, 'danger');
        } else { */
        if (param == 'buy') {
          let buydata = response.stopLossList;
          this.spotSpotLimitBuyData = buydata;
        } else {
          let selldata = response.stopLossList;
          this.spotSpotLimitSellData = selldata;
        }
        document.body.classList.remove("overlay")
        //}
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.logout();
          this.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.alert('Could Not Connect To Server', 'danger');
        }
      });
  }




  renderDataForBuySellStopLimitSpot = () => {
    this.spotSpotLimitBuyData1 = [];
    let transactiontype1 = '';
    let url1 = ''
    let transactiontype2 = '';
    let url2 = ''
    //if(param == 'buy'){
      let payload = {}
      payload['uuid'] = localStorage.getItem('uuid');
  
  
        let transactiontype = '1';
        payload['buying_asset_code'] = localStorage.getItem('buying_crypto_asset').toUpperCase();
        // inputObj['userId'] = localStorage.getItem('user_id');
        payload['selling_asset_code'] = localStorage.getItem('selling_crypto_asset').toUpperCase();
  
        payload['txn_type'] = transactiontype;
  
      
      this.http.post<any>(this.WEBSERVICE + '/userTrade/GetStopLossBuySell', JSON.stringify(payload),  {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;

        let buydata = response.stopLossList;
        buydata.forEach(v => { v.action = 'Buy'; });
        this.spotSpotLimitBuyData1 = buydata;
        // console.log('first subscribe',this.spotSpotLimitBuyData1);

        // for(let i = 0; i<buydata.length; i++){
        //   this.spotSpotLimitBuyData1.push(buydata[i]);
        //   this.spotSpotLimitBuyData1.push({action : 'Buy'});



        // }


        console.log('alldata first', this.spotSpotLimitBuyData1)



        this.getSelldata();

        document.body.classList.remove("overlay")
        //}
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.logout();
          this.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.alert('Could Not Connect To Server', 'danger');
        }
      });
  }

  getSelldata() {

    let payload = {}
    payload['uuid'] = localStorage.getItem('uuid');

      let transactiontype = '2';
      payload['buying_asset_code'] = localStorage.getItem('selling_crypto_asset').toUpperCase();
      // inputObj['userId'] = localStorage.getItem('user_id');
      payload['selling_asset_code'] = localStorage.getItem('buying_crypto_asset').toUpperCase();

      payload['txn_type'] = transactiontype;

    this.http.post<any>(this.WEBSERVICE + '/userTrade/GetStopLossBuySell', JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;

        let selldata = response.stopLossList;
        selldata.forEach(v => { v.action = 'Sell'; });

        for (let i = 0; i < selldata.length; i++) {
          this.spotSpotLimitBuyData1.push(selldata[i]);

        }

        // console.log('alldata',this.spotSpotLimitBuyData1)
      })
  }

  /* function defination to call API for my trade for futures */
  renderDataForMyTradeFutures = () => {
    this.http.get<any>("https://stream.paybito.com/StreamingApi/rest/getFTradeHistoryByIdRest?uuid=" + localStorage.getItem('uuid') + "&assetPair=" + localStorage.getItem("selected_derivative_asset_pair") + "&pageNo=1&noOfItemsPerPage=10", {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;
        /* if (result.error.error_data != '0') {
          this.alert(result.error.error_msg, 'danger');
        } else { */
        this.futuresMyTradeData = res.tradeListResult
        document.body.classList.remove("overlay")
        //}
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.logout();
          this.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.alert('Could Not Connect To Server', 'danger');
        }
      });
  }
  /* function defination to call API for my offer for futures */
  renderDataForMyOfferFutures = () => {
    this.http.get<any>("https://stream.paybito.com/StreamingApi/rest/getFOffersByAccountIDRest?uuid=" + localStorage.getItem('uuid') + "&assetPair=" + localStorage.getItem("selected_derivative_asset_pair"), {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;
        /* if (result.error.error_data != '0') {
          this.alert(result.error.error_msg, 'danger');
        } else { */
        this.futuresMyOfferData = response.tradeListResult;
        document.body.classList.remove("overlay")
        //}
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.logout();
          this.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.alert('Could Not Connect To Server', 'danger');
        }
      });
  }
  /* function defination to call API for stop limit for futures */
  renderDataForStopLimitFutures = (param) => {
    let transactiontype = '';
    if (param == 'buy') {
      transactiontype = '1';
    } else {
      transactiontype = '2';
    }
    this.http.get<any>("https://stream.paybito.com/StreamingApi/rest/getFStopLossBuySellRest?userID=" + localStorage.getItem('user_id') + "&buyingAssetCode=" + this.selectedSellingAssetText.toUpperCase() + "&sellingAssetCode=" + this.selectedBuyingAssetText.toUpperCase() + "&txnType=" + transactiontype, {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;
        /* if (result.error.error_data != '0') {
          this.alert(result.error.error_msg, 'danger');
        } else { */
        document.body.classList.remove("overlay")
        if (param == 'buy') {
          let buydata = JSON.parse(response.apiResponse);
          this.futuresSpotLimitBuyData = buydata.response;
        } else {
          let selldata = JSON.parse(response.apiResponse);
          this.futuresSpotLimitSellData = selldata.response;
        }
        //}
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.logout();
          this.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.alert('Could Not Connect To Server', 'danger');
        }
      });
  }

  /* function defination to call API for my trade for options */
  renderDataForMyTradeOptions = () => {
    let assetPair = '';
    if (localStorage.getItem("selected_options_asset_pair") == null || localStorage.getItem("selected_options_asset_pair") == undefined) {
      let optionsAssets = JSON.parse(localStorage.getItem('options_assets'))
      assetPair = optionsAssets.Values[0].assetPair;
    } else {
      assetPair = localStorage.getItem("selected_options_asset_pair")
    }
    this.http.get<any>("https://stream.paybito.com/StreamingApi/rest/getOTradeHistoryByIdRest?uuid=" + localStorage.getItem('uuid') + "&assetPair=" + assetPair + "&pageNo=1&noOfItemsPerPage=10", {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;
        /* if (result.error.error_data != '0') {
          this.alert(result.error.error_msg, 'danger');
        } else { */
        this.optionsMyTradeData = res.tradeListResult
        document.body.classList.remove("overlay")
        //}
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.logout();
          this.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.alert('Could Not Connect To Server', 'danger');
        }
      });
  }
  /* function defination to call API for my offer for options */
  renderDataForMyOfferOptions = () => {
    this.http.get<any>("https://stream.paybito.com/StreamingApi/rest/getOOffersByAccountIDRest?uuid=" + localStorage.getItem('uuid') + "&assetPair=" + localStorage.getItem("selected_options_asset_pair"), {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;
        /* if (result.error.error_data != '0') {
          this.alert(result.error.error_msg, 'danger');
        } else { */
        this.optionsMyOfferData = response.tradeListResult;
        document.body.classList.remove("overlay")
        //}
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.logout();
          this.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.alert('Could Not Connect To Server', 'danger');
        }
      });
  }
  /* function defination to call API for stop limit for options */
  renderDataForStopLimitOptions = (param) => {
    let transactiontype = '';
    if (param == 'buy') {
      transactiontype = '1';
    } else {
      transactiontype = '2';
    }
    this.http.get<any>("https://stream.paybito.com/StreamingApi/rest/getFStopLossBuySellRest?userID=" + localStorage.getItem('user_id') + "&buyingAssetCode=" + this.selectedSellingAssetText.toUpperCase() + "&sellingAssetCode=" + this.selectedBuyingAssetText.toUpperCase() + "&txnType=" + transactiontype, {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.loader = false;
        var res = response;
        /* if (result.error.error_data != '0') {
          this.alert(result.error.error_msg, 'danger');
        } else { */
        if (param == 'buy') {
          let buydata = JSON.parse(response.apiResponse);
          this.optionsSpotLimitBuyData = buydata.response;
        } else {
          let selldata = JSON.parse(response.apiResponse);
          this.optionsSpotLimitSellData = selldata.response;
        }
        document.body.classList.remove("overlay")
        //}
      }, reason => {
        document.body.classList.remove("overlay")
        if (reason.error.error == 'invalid_token') {
          this.logout();
          this.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.alert('Could Not Connect To Server', 'danger');
        }
      });
  }


  /* method defination for checking differece between start and end date for report */
  handleReportDateDiff = (from, to) => {
    console.log(from)
    var fromdateLoc = new Date(from);
    //var todateLoc = new Date(to);
    var todateLoc = new Date();
    console.log(fromdateLoc, todateLoc);
    var dayDiff = Math.floor((Date.UTC(todateLoc.getFullYear(), todateLoc.getMonth(), todateLoc.getDate()) - Date.UTC(fromdateLoc.getFullYear(), fromdateLoc.getMonth(), fromdateLoc.getDate())) / (1000 * 60 * 60 * 24));
    console.log(dayDiff);
    return dayDiff;
  }


  /* method defination for chnaging meta tag */
  handleMetaTagForFacebook = (key, value) => {
    if (document.querySelector('meta[property="' + key + '"]') != undefined && document.querySelector('meta[property="' + key + '"]') != null) {
      document.querySelector('meta[property="' + key + '"]').setAttribute("content", value);
    }
  }
  /* method defination for fetching meta tag */
  getFacebookMetaTagValue = (key) => {
    return document.querySelector('meta[property="' + key + '"]')['content'];
  }

  /* Method defination for force page reload*/
  handlePageReloadForecibily = (time) => {
    document.body.classList.add('overlay');
    setTimeout(() => {
      window.location.reload();
    }, time);
  }

  /* Method defination for checking number field validation */
  handleNumberFieldValidation = (e) => {
    let numberValue = parseInt(e.target.value);
    console.log('numberValue', numberValue)
    if (numberValue < 0 && !isNaN(numberValue)) {
      e.target.value = ''
    }
  }

  /* method defination for sending otp through sms */
  async handleSendOtpInSms(payload, param) {
    /* let payload = {};
    payload["phone"] = phone;
    if (param == 'changephonemobileotp' || param == 'newPhone') {
      payload["uuid"] = localStorage.getItem('uuid');
    }else if(param == 'registrationmobileotp'){
      payload['userId'] = localStorage.getItem('signup_user_id')
    } */
    var jsonString = JSON.stringify(payload);

    const response = await this.http
      .post<any>(this.WEBSERVICE + "/user/sendMobileOtp/" + param, jsonString, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .toPromise();
    var result = response;
    if (result.error.error_data != '0') {
      this.alert(result.error.error_msg, 'danger');
      return false;
    } else {
      if (param == 'changephonemobileotp') {
        this.alert('Input OTP has sent to your both registered & new phone no', 'success');
      } else {
        this.alert('Input OTP sent to your existing phone no', 'success');
      }

      return true

    }

  }
  /* method defination for sending otp through sms */
  async handleConfirmOtpInSmsForLogin(param, phone, countryCode, otp, password, socialMediaId) {
    let payload = {};
    payload["phone"] = phone;
    payload["countryCode"] = countryCode;

    payload["phoneOtp"] = otp;
    if (socialMediaId != '') {
      payload["socialMediaId"] = socialMediaId;
    }
    if (password != '') {
      payload["password"] = password;
    }
    var jsonString = JSON.stringify(payload);

    const response = await this.http
      .post<any>(this.WEBSERVICE + "/user/validateMobileOtp/" + param, jsonString, {
        headers: {
          "Content-Type": "application/json"
        }
      }).toPromise();
    var result = response;
    if (result.error.error_data != '0') {
      this.alert(result.error.error_msg, 'danger');
      return false;
    } else {
      if (param == 'loginverifymobileotp') {
        localStorage.setItem('loginData', JSON.stringify(result));
      }
      return true;

    }
  }

  async handleValidateSmsOtp(urlParam, payload) {

    var jsonString = JSON.stringify(payload);

    const response = await this.http
      .post<any>(this.WEBSERVICE + "/user/validateMobileOtp/" + urlParam, jsonString, {
        headers: {
          "Content-Type": "application/json"
        }
      }).toPromise();
    var result = response;
    if (result.error.error_data != '0') {
      this.alert(result.error.error_msg, 'danger');
      return false;
    } else {
      return true;

    }
  }




}
