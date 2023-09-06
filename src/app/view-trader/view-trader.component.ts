import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-view-trader',
  templateUrl: './view-trader.component.html',
  styleUrls: ['./view-trader.component.css']
})
export class ViewTraderComponent implements OnInit {
  

  Themecolor: string = 'Dark';
  traderName: string;
  traderDetails: any = {};
  subscriptionPrice: any;
  type: string;
  apiId: string;
  follow: string;
  traderRole: string;
  constructor(private modalService: NgbModal,public route:Router, public http:HttpClient, public data: CoreDataService,private activeRoute: ActivatedRoute ) {

    this.apiId = this.activeRoute.snapshot.paramMap.get('p1');
    this.type = this.activeRoute.snapshot.paramMap.get('q1');
    this.follow = this.activeRoute.snapshot.paramMap.get('follow');


    console.log('hhh',this.traderName)
    console.log('iii',this.type)
    console.log('fff',this.follow)



   }

  ngOnInit() {

    this.traderRole = localStorage.getItem('traderRole');

    console.log('role',this.traderRole)


    this.getTraderDetails()

  }

  getTraderDetails(){
    var updateAPI = {};
    
    updateAPI['id'] = this.apiId;
    updateAPI['isBotOrApi'] = this.type;
    updateAPI['customerId'] = localStorage.getItem('user_id');



    
    
    var jsonString = JSON.stringify(updateAPI);


    this.http.post<any>('https://accounts.paybito.com/CopyTradingService/rest/GetViewTraderDtls', jsonString, { headers: { 'content-Type': 'application/json' } })
    .subscribe(response => {

      this.traderDetails = response.traderDtls[0];

      // console.log('hdhdh',this.traderDetails)

      // if(response.error.error_data == '0'){


        
      // }
      // else{
      //   this.data.alert(response.error.error_msg, 'danger');

      // }

    })
  }
  themeChangedHandler(e){

  }

  openSubscriptionInfoModal(md, price){
    this.modalService.open(md, {
      centered: true
    });

    this.subscriptionPrice = price
  }

  subscribe(){


    var updateAPI = {};
    
    updateAPI['botId'] = this.apiId;
    updateAPI['customerId'] = localStorage.getItem('user_id');
    updateAPI['isBotOrApi'] = 'apiKey';


    console.log('subs0',updateAPI);
    
    
    var jsonString = JSON.stringify(updateAPI);

    this.http.post<any>('https://accounts.paybito.com/CopyTradingBot/rest/CreateBotFollowers', jsonString, { headers: { 'content-Type': 'application/json' } })
    .subscribe(response => {

      if(response.error.error_data == '0'){
        this.modalService.dismissAll()

        this.data.alert(response.error.error_msg, 'success');
        this.getTraderDetails();


      }
      else{
        this.modalService.dismissAll()

        this.data.alert(response.error.error_msg, 'danger');

      }

      // this.traderDetails = response.traderDtls[0];

      // this.data.

      

    })

  }

}
