import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal, NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-add-api-key',
  templateUrl: './add-api-key.component.html',
  styleUrls: ['./add-api-key.component.css']
})
export class AddApiKeyComponent implements OnInit {
  Themecolor: string = 'Dark';
  market: string = '';
  keyName: string = '';
  apiKey: string = '';
  secretKey: string = '';
  keyStatus: number;
  allApiKeys: any;
  apiKeyId: any;
  allApiKeysDropdown: any;
  exchangeName: any = 'BINANCE';
  apiKeyName: any;


  constructor(private modalService: NgbModal, public route: Router, public http: HttpClient, public data: CoreDataService) {


   }

  ngOnInit() {
//     this.exchangeName = this.data.exchange;
// console.log('test name', this.exchangeName);
    this.Themecolor = localStorage.getItem('themecolor');;
    if(this.Themecolor == '' || this.Themecolor == null){
      this.Themecolor = 'Dark';
    }
    this.getAllApiKeys();
    this.getApiName();
  }

  getApiName() {

    this.http.get<any>(this.data.COPYTRADINGSERVICE + '/apiKey/getApiKeyName/' + localStorage.getItem('user_id') + '/' + this.market,
      {
        headers:
        {
          'content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
      .subscribe(response => {

        console.log('get all api keys', response.keyNames)

        this.allApiKeysDropdown = response.keyNames;



      })

  }
  getAllApiKeys() {

    var addAPI = {};

    // addAPI['customerId'] = localStorage.getItem('user_id');





    var jsonString = JSON.stringify(addAPI);

    this.http.get<any>(this.data.COPYTRADINGSERVICE + '/apiKey/getAllApiKey/' + localStorage.getItem('user_id'),
      {
        headers:
        {
          'content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
      .subscribe(response => {

        console.log('get all api keys', response.apiKeyList)

        this.allApiKeys = response.apiKeyList;



      })

  }
  openAddApiKeyModal(md) {
    this.modalService.open(md, {
      centered: true
    });
  }
  goToSettings() {
    this.route.navigateByUrl('/settings');

  }
  openUpdateApiKeyModal(md, keys) {
    console.log('keyss', keys);

    this.apiKeyName = keys.apiKeyName;
    this.market = keys.marketType;
    this.apiKey = keys.apiKey;
    this.secretKey = keys.secretKey;
    this.apiKeyId = keys.apiKeyId;


    console.log('apikeyId', this.apiKey)

    this.modalService.open(md, {
      centered: true
    });




  }

  updateKey() {

    var updateAPI = {};
    updateAPI['apiKey'] = this.apiKey;
    updateAPI['marketType'] = this.market;
    updateAPI['apiKeyName'] = this.apiKeyName;
    updateAPI['secretKey'] = this.secretKey;
    updateAPI['customerId'] = localStorage.getItem('user_id');
    updateAPI['status'] = 1;
    updateAPI['apiKeyId'] = this.apiKeyId;
    updateAPI['exchange_name'] = this.exchangeName;

    updateAPI['action'] = 'UPDATE';



    var jsonString = JSON.stringify(updateAPI);


    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/apiKey/addApiKey', jsonString, {
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
          this.data.alert('API Key updated', 'success');
          this.getAllApiKeys();

        }
        else {
          this.modalService.dismissAll()
          this.resetFields()

          this.data.alert(response.error.error_msg, 'danger');

        }

      })

  }
  deleteApiKey(keys) {


    var x = confirm('Are you sure you want to delete the API key?')

    if (x == true) {

      this.apiKeyName = keys.apiKeyName;
      this.market = keys.marketType;
      this.apiKey = keys.apiKey;
      this.secretKey = keys.secretKey;
      this.apiKeyId = keys.apiKeyId;
      this.exchangeName = keys.exchange_name;

      var deleteAPI = {};
      deleteAPI['apiKey'] = this.apiKey;
      deleteAPI['marketType'] = this.market;
      deleteAPI['apiKeyName'] = this.apiKeyName;
      deleteAPI['secretKey'] = this.secretKey;
      deleteAPI['customerId'] = localStorage.getItem('user_id');
      deleteAPI['status'] = 1;
      deleteAPI['apiKeyId'] = this.apiKeyId;
      deleteAPI['exchange_name'] = this.exchangeName;

      deleteAPI['action'] = 'DELETE';


      var jsonString = JSON.stringify(deleteAPI);


      this.http.post<any>(this.data.COPYTRADINGSERVICE + '/apiKey/addApiKey', jsonString,
        {
          headers: {
            'content-Type': 'application/json',
            'authorization': 'BEARER ' + localStorage.getItem('access_token'),
          }
        })
        .subscribe(response => {

          if (response.error.error_data == '0') {
            this.modalService.dismissAll()
            this.resetFields()
            this.data.alert('API Key Deleted', 'success');
            this.getAllApiKeys();

          }
          else {
            this.modalService.dismissAll()
            this.resetFields()

            this.data.alert(response.error.error_msg, 'danger');

          }

        })

    }
    else {

      // nothing to do

    }



  }


  toggleData(event, keys,) {

    if (event.target.checked == true) {
      this.keyStatus = 1;
    }
    else {
      this.keyStatus = 0;

    }

    this.apiKeyName = keys.apiKeyName;
    this.market = keys.marketType;
    this.apiKey = keys.apiKey;
    this.secretKey = keys.secretKey;
    this.apiKeyId = keys.apiKeyId;
    this.exchangeName = keys.exchange_name;


    var deleteAPI = {};
    deleteAPI['apiKey'] = this.apiKey;
    deleteAPI['marketType'] = this.market;
    deleteAPI['apiKeyName'] = this.apiKeyName;
    deleteAPI['secretKey'] = this.secretKey;
    deleteAPI['customerId'] = localStorage.getItem('user_id');
    deleteAPI['status'] = this.keyStatus;
    deleteAPI['apiKeyId'] = this.apiKeyId;
    deleteAPI['exchange_name'] = this.exchangeName;


    deleteAPI['action'] = 'UPDATE';


    var jsonString = JSON.stringify(deleteAPI);
    console.log('toggle data', jsonString)


    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/apiKey/addApiKey', jsonString,
      {
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
          this.data.alert('Status changed', 'success');
          this.getAllApiKeys();

        }
        else {
          this.modalService.dismissAll()
          this.resetFields()

          this.data.alert(response.error.error_msg, 'danger');

        }

      })

  }


  addApiKey() {
    var addAPI = {};

    addAPI['apiKey'] = this.apiKey;
    addAPI['marketType'] = this.market;
    addAPI['apiKeyName'] = this.apiKeyName;
    addAPI['secretKey'] = this.secretKey;
    addAPI['customerId'] = localStorage.getItem('user_id');
    addAPI['status'] = 1;
    addAPI['exchange_name'] = this.exchangeName;

    addAPI['action'] = 'INSERT';




    var jsonString = JSON.stringify(addAPI);

    console.log('add api', addAPI)
    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/apiKey/addApiKey', jsonString,
      {
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
          this.data.alert('API Key added', 'success');
          this.getAllApiKeys();

        }
        else {
          this.modalService.dismissAll()
          this.resetFields()

          this.data.alert(response.error.error_msg, 'danger');

        }

      })


  }
  resetFields() {

    this.apiKey = '';
    this.market = 'spot';
    this.apiKeyName = '';
    this.secretKey = '';
  }

  showBinancePopup(md) {
    if (this.exchangeName == 'BINANCE') {
      // Open modal
      // this.modalService.dismissAll();
      this.modalService.open(md, {
        centered: true
      });

    }
  }


  themeChangedHandler(e) {

    console.log('changed', e);
    this.Themecolor  = e
  }


  VALIDATION1 (e) {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[ A-Za-z0-9_./,-]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    console.log('ddlld', str);
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
    var regex = new RegExp("^[A-Za-z0-9_./,+-=]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);

    console.log('ddlld', str);

    if (str == '>' || str == ':' || str == ';' || str == '<') {
      return false;
  }
    
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
  }
 

}
