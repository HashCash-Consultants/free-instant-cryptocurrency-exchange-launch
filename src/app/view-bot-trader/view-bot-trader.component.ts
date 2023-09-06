import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-view-bot-trader',
  templateUrl: './view-bot-trader.component.html',
  styleUrls: ['./view-bot-trader.component.css']
})
export class ViewBotTraderComponent implements OnInit {

  Themecolor: string = 'Dark';
  traderName: string;
  traderDetails: any = {};
  subscriptionPrice: any;
  apiId: string;
  type: string;
  traderRole: string;
  follow: string;
  constructor(private modalService: NgbModal, public route: Router, public http: HttpClient, public data: CoreDataService, private activeRoute: ActivatedRoute) {

    this.apiId = this.activeRoute.snapshot.paramMap.get('b1');
    this.type = this.activeRoute.snapshot.paramMap.get('c1');
    this.follow = this.activeRoute.snapshot.paramMap.get('follow');


    console.log('hhh', this.traderName)

  }

  ngOnInit() {

    this.getTraderDetails()
    this.traderRole = localStorage.getItem('traderRole');

  }

  getTraderDetails() {
    var updateAPI = {};

    updateAPI['id'] = this.apiId;
    updateAPI['isBotOrApi'] = this.type;
    updateAPI['customerId'] = localStorage.getItem('user_id');





    var jsonString = JSON.stringify(updateAPI);


    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/marketPlace/GetViewTraderDtls', jsonString,
      {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
      .subscribe(response => {

        this.traderDetails = response.traderDtls[0];



      })
  }
  themeChangedHandler(e) {

  }


  openSubscriptionInfoModal(md, price) {
    this.modalService.open(md, {
      centered: true
    });

    this.subscriptionPrice = price
  }


  subscribe() {


    var updateAPI = {};

    updateAPI['botId'] = this.apiId;
    updateAPI['customerId'] = localStorage.getItem('user_id');
    updateAPI['isBotOrApi'] = 'bots';


    console.log('subs0', updateAPI);


    var jsonString = JSON.stringify(updateAPI);

    this.http.post<any>(this.data.COPYTRADINGSERVICE +'/bot/CreateBotFollowers', jsonString,
    { headers: {
     'Content-Type': 'application/json',
     'authorization': 'BEARER ' + localStorage.getItem('access_token'),
   }}) .subscribe(response => {

        if (response.error.error_data == '0') {
          this.modalService.dismissAll()

          this.data.alert(response.error.error_msg, 'success');
          this.getTraderDetails();


        }
        else {
          this.modalService.dismissAll()

          this.data.alert(response.error.error_msg, 'danger');

        }

        // this.traderDetails = response.traderDtls[0];

        // this.data.



      })

  }

}
