import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal, NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreDataService } from '../core-data.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-manage-copy-trading',
  templateUrl: './manage-copy-trading.component.html',
  styleUrls: ['./manage-copy-trading.component.css']
})
export class ManageCopyTradingComponent implements OnInit {

  Themecolor: String = 'Dark';
  profileName: any = localStorage.getItem('user_name');
  description: any = '';
  minCapReq: any = '';
  paidStatus: any = 1;
  allApiKeys: any;
  allTradingBots: any;
  counterCurrency: any;
  apiKeyName: any;
  market: any;
  price: any;
  showInMarketplace: any;
  allowCopyTrading: any;
  cryptos: any;
  isPayable: any;
  subscriptionCharge: any = '';
  apiKeyId: any;
  botName: any;
  flag: string;
  botId: any;
  showInMarketplaceToggleStatus: number;
  allowCopyTradingStatus: number;
  showCryptofollowField: boolean;
  exchangeName: any;

  constructor(private modalService: NgbModal, public route: Router, public http: HttpClient, public data: CoreDataService) { }

  ngOnInit() {

    this.getAPIKeys();
    this.getTradingBots();
    this.getBasecurrencyList();


  }

  getBasecurrencyList() {

    this.http.get<any>(this.data.WEBSERVICE + '/home/getAllCurrency/'+this.data.BROKERID, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        this.counterCurrency = result.currencyList;
        this.cryptos = result.currencyList[0];
      });
  }

  themeChangedHandler(e) {

  }

  publishMarketplaceApi(md, key) {


    this.modalService.open(md, {
      centered: true
    });

    this.apiKeyName = key.apiKeyName;
    this.market = key.marketType;
    this.price = key.price;
    this.showInMarketplace = key.showInMarketplace;
    this.allowCopyTrading = key.allowCopyTrading;
    this.apiKeyId = key.apiKeyId;
    this.showCryptofollowField = false;
    this.exchangeName = key.exchange_name;



    if (this.price == '' || this.price == null || this.price == undefined) {
      this.price = 'Paid'

    }

    console.log('apikeyname', this.apiKeyName)
    console.log('showInMarketplace', this.showInMarketplace)
    console.log('allowCopyTrading', this.allowCopyTrading)




    this.flag = 'API';

  }

  publishMarketplaceBot(md, bot) {
    this.modalService.open(md, {
      centered: true
    });

    this.botName = bot.botName;
    this.market = bot.botMarketType;
    this.price = '';
    this.showInMarketplace = bot.showInMarketplace;
    this.allowCopyTrading = bot.allowCopyTrading;
    this.botId = bot.botId;
    this.cryptos = bot.assetMustHold;
    this.exchangeName = bot.exchange_name;


    this.showCryptofollowField = true;

    if (this.price == '' || this.price == null || this.price == undefined) {
      this.price = 'Paid'

    }

    this.flag = 'bot';



  }
  changeStatus(e) {
    this.paidStatus = e;
    this.subscriptionCharge = '';
    if (this.paidStatus == true) {
      this.paidStatus = 1;
    }
    else {
      this.price = 'Free'
      this.paidStatus = 0;
      this.subscriptionCharge = 0;

    }
  }

  getAPIKeys() {
    this.http.get<any>(this.data.COPYTRADINGSERVICE + '/apiKey/getManageCopyTradingApiKeyView/' + localStorage.getItem('user_id'),
      {
        headers:
        {
          'content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
      .subscribe(response => {

        console.log('get all api keys', response.manageCopyTradingList)

        this.allApiKeys = response.manageCopyTradingList;



      })
  }

  getTradingBots() {

    this.http.get<any>(this.data.COPYTRADINGSERVICE + '/apiKey/getManageCopyTradingBotView/' + localStorage.getItem('user_id'), {
      headers:
      {
        'content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {

        console.log('get all api keys', response.manageCopyTradingList)

        this.allTradingBots = response.manageCopyTradingList;



      })

  }

  addApiKeyFunc() {


    if (this.flag == 'API') {
      this.publishApiKey()
    }
    else {

      this.publishBotKey()


    }








  }



  publishApiKey() {

    if (this.profileName == ''
      || this.description == ''
      || this.minCapReq == ''
    ) {

      this.data.alert('Please fill all the fields', 'danger');


    }
    else {

      if (this.paidStatus == 1 && this.subscriptionCharge == '') {

        this.data.alert('Please add monthly subscription charge', 'danger');


      }
      else {

        var addApiKey = {};
        addApiKey['apiKeyName'] = this.apiKeyName;
        addApiKey['botName'] = '';
        addApiKey['marketType'] = this.market;
        addApiKey['showInMarketplace'] = this.showInMarketplace;
        addApiKey['allowCopyTrading'] = this.allowCopyTrading;
        addApiKey['traderName'] = this.profileName;
        addApiKey['description'] = this.description;
        addApiKey['miniumCapitalRequirement'] = parseInt(this.minCapReq);
        addApiKey['followersCryptos'] = '';
        addApiKey['isPayable'] = this.paidStatus;
        addApiKey['monthlySubcriptionCharge'] = this.subscriptionCharge;
        addApiKey['customerId'] = localStorage.getItem('user_id');
        addApiKey['apiKeyId'] = this.apiKeyId;
        addApiKey['botId'] = 0;
        addApiKey['exchange_name'] = this.exchangeName;



        console.log('addapikey', addApiKey)



        var jsonString = JSON.stringify(addApiKey);

        this.http.post<any>(this.data.COPYTRADINGSERVICE + '/apiKey/addManageCopyTrading', jsonString, {
          headers:
          {
            'content-Type': 'application/json',
            'authorization': 'BEARER ' + localStorage.getItem('access_token'),
          }
        })
          .subscribe(response => {

            if (response.error.error_data == '0') {
              this.modalService.dismissAll()
              this.resetFields()
              this.data.alert(response.error.error_msg, 'success');
              this.getAPIKeys();
              this.getTradingBots();

            }
            else {
              this.modalService.dismissAll()
              this.resetFields()

              this.getAPIKeys();
              this.getTradingBots();

              this.data.alert(response.error.error_msg, 'danger');

            }

          })

      }

    }

  }

  resetFields() {

    this.apiKeyName = '';

    this.market = '';
    // addApiKey['price'] = this.price;
    this.showInMarketplace = '';
    this.allowCopyTrading = '';
    this.profileName = '';
    this.description = '';
    this.minCapReq = ''
    this.cryptos = '';
    this.paidStatus = 1;
    this.subscriptionCharge = '';
    this.apiKeyId = '';
    this.exchangeName = '';
    this.getBasecurrencyList()

  }


  publishBotKey() {


    if (this.profileName == ''
      || this.description == ''
      || this.minCapReq == ''
    ) {

      this.data.alert('Please fill all the fields', 'danger');


    }
    else {

      if (this.paidStatus == 1 && this.subscriptionCharge == '') {

        this.data.alert('Please add monthly subscription charge', 'danger');


      }
      else {

        var addApiKey = {};
        addApiKey['apiKeyName'] = '';
        addApiKey['botName'] = this.botName;
        addApiKey['marketType'] = this.market;
        addApiKey['showInMarketplace'] = this.showInMarketplace;
        addApiKey['allowCopyTrading'] = this.allowCopyTrading;
        addApiKey['traderName'] = this.profileName;
        addApiKey['description'] = this.description;
        addApiKey['miniumCapitalRequirement'] = parseInt(this.minCapReq);
        addApiKey['followersCryptos'] = this.cryptos;
        addApiKey['isPayable'] = this.paidStatus;
        addApiKey['monthlySubcriptionCharge'] = this.subscriptionCharge;
        addApiKey['customerId'] = localStorage.getItem('user_id');
        addApiKey['apiKeyId'] = 0;
        addApiKey['botId'] = this.botId;
        addApiKey['exchange_name'] = this.exchangeName;



        console.log('addapikey', addApiKey)



        var jsonString = JSON.stringify(addApiKey);

        this.http.post<any>(this.data.COPYTRADINGSERVICE + '/apiKey/addManageCopyTrading', jsonString, {
          headers:
          {
            'content-Type': 'application/json',
            'authorization': 'BEARER ' + localStorage.getItem('access_token'),
          }
        })
          .subscribe(response => {

            if (response.error.error_data == '0') {
              this.modalService.dismissAll()
              this.resetFields()
              this.data.alert(response.error.error_msg, 'success');
              this.getAPIKeys();
              this.getTradingBots();
            }
            else {
              this.modalService.dismissAll()
              this.resetFields()
              this.getAPIKeys();
              this.getTradingBots();

              this.data.alert(response.error.error_msg, 'danger');

            }

          })

      }

    }

  }

  changeSatusShowInMarketplace(key, event, flag) {

    if (event.target.checked == true) {
      this.showInMarketplaceToggleStatus = 1
    }
    else {
      this.showInMarketplaceToggleStatus = 0

    }
    this.http.get<any>(this.data.COPYTRADINGSERVICE + '/apiKey/updateManageCopyTradingShowInStatus/' + key + '/' + this.showInMarketplaceToggleStatus + '/' + flag, {
      headers:
      {
        'content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {

        console.log('response', response)

        if (response.error.error_data != 0) {
          this.data.alert(response.error.error_msg, 'danger');
        } else {
          this.data.alert(response.error.error_msg, 'success');

        }

        this.getAPIKeys();
        this.getTradingBots();


      })


  }

  changeSatusAllowInCopyTrading(key, event, flag) {

    if (event.target.checked == true) {
      this.allowCopyTradingStatus = 1
    }
    else {
      this.allowCopyTradingStatus = 0

    }
    this.http.get<any>(this.data.COPYTRADINGSERVICE + '/apiKey/updateManageCopyTradingAllowsStatus/' + key + '/' + this.allowCopyTradingStatus + '/' + flag, {
      headers:
      {
        'content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {

        console.log('response', response)

        if (response.error.error_data != 0) {
          this.data.alert(response.error.error_msg, 'danger');
        } else {
          this.data.alert(response.error.error_msg, 'success');

        }

        this.getAPIKeys();
        this.getTradingBots();



      })


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


  captitalrqValidation(val, id){
    if(val > 100){

      this.data.alert('Amount cannot be greater than 100','danger');
      $("#"+id).val('');
    }
    else if(val == 0){
      this.data.alert('Field value cannot be 0','danger');
      $("#"+id).val('');
    }
  }



}
