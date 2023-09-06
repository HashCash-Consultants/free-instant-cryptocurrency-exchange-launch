import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-manage-copy-trading-my-payouts',
  templateUrl: './manage-copy-trading-my-payouts.component.html',
  styleUrls: ['./manage-copy-trading-my-payouts.component.css']
})
export class ManageCopyTradingMyPayoutsComponent implements OnInit {

  Themecolor: string = 'Dark';
  payoutHistory: any;
  usdtAmount: any;
  usdtAddress: any;

  constructor(private modalService: NgbModal, public route: Router, public http: HttpClient, public data: CoreDataService) { }

  ngOnInit() {
    this.getPayoutHistory();
  }
  themeChangedHandler(e) {

  }

  getPayoutHistory() {

    // http://52.8.225.30:8971/CopyTradingService/rest/getPayoutHistory/36765(GET)

    this.http.get<any>(this.data.COPYTRADINGSERVICE + '/apiKey/getPayoutHistory/' + localStorage.getItem('user_id'),
      {
        headers:
        {
          'content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
      .subscribe(response => {

        console.log('get all api keys', response.payOutHistoryList)

        this.payoutHistory = response.payOutHistoryList;



      })

  }

  saveUSDT() {

    // http://52.8.225.30:8971/CopyTradingService/rest/addpayoutHistory(POST)

    // var jsonString;

    var addAPI = {};
    addAPI['amountInUsd'] = this.usdtAmount;
    addAPI['payoutAddress'] = this.usdtAddress;
    addAPI['customerId'] = localStorage.getItem('user_id');


    var jsonString = JSON.stringify(addAPI);



    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/apiKey/addpayoutHistory',
      jsonString, {
        headers:
        {
          'content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
    })
      .subscribe(response => {

        // console.log('get all api keys', response.payOutHistoryList)

        // this.payoutHistory = response.payOutHistoryList;



      })

  }

}
