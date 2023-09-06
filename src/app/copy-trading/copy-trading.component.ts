import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-copy-trading',
  templateUrl: './copy-trading.component.html',
  styleUrls: ['./copy-trading.component.css']
})
export class CopyTradingComponent implements OnInit {

  copyTraderStatus:boolean = false;
  traderStatus: boolean = true;
  Themecolor: any = 'Dark';

  constructor(public route:Router, public data: CoreDataService) { }

  
   
  ngOnInit() {
    this.Themecolor = localStorage.getItem('themecolor');;
    if(this.Themecolor == '' || this.Themecolor == null){
      this.Themecolor = 'Dark';
    }
    this.setTraderRole('trader')
  }
  themeChangedHandler(event){

    console.log('changed', event);
    this.Themecolor = event
    
  }


  setTraderRole(e){
    localStorage.setItem('traderRole',e)
  }


  selectTrader(){

    this.setTraderRole('trader')

    this.traderStatus = true;
    this.copyTraderStatus = false;

  }
  selectCopyTrader(){

    this.setTraderRole('copyTrader')
    this.copyTraderStatus = true;
    this.traderStatus = false;

  }

  gotoAddApiKey(){
    this.route.navigateByUrl('/add-apiKey');

  }
  goToMarketplace(){
    this.route.navigateByUrl('/marketplace');

  }
  goToManageCopyTradng(){
    this.route.navigateByUrl('/manage-copytrading');

  }
  goToMyFollowers(){
    this.route.navigateByUrl('/my-followers');

  }
  goToMyPayouts(){
    this.route.navigateByUrl('/my-payouts');

  }
  goToMyBots(){
    this.route.navigateByUrl('/my-bots');

  }
  goToWhomIFollow(){
    this.route.navigateByUrl('/whom-I-follow');

  }

  goToMyHistory(){
    this.route.navigateByUrl('/copy-trading-history');

  }

  



}
