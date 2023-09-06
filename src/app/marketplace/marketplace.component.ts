import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Chart} from 'chart.js';
import 'chartjs-plugin-crosshair';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  Themecolor: string = 'Dark';
  public chart: any;
  tradeApiKeyStatus: boolean = true;
  botTraderStatus: boolean;
  traderName: any;
  exchanageName: any = 'All Exchanges'
  timePeriod: any = 'All Time';
  traderNameFilter: any = '';
  marketType: any = 'All Markets';
  basecurrency: any = 'All';
  minTrade: any = '';
  isFollowStatus: number = 0;
  traderApiMarketCard: any;
  traderBotsMarketCard: any;
  traderRole: string;
  chartBody: any = [];
  chartBodyTrimmed: any = [];
  chartBodyTrimmed1: any = [];
  chartBodyBot: any =[];
  chartBodyBotTrimmed: any = [];

  chartBodyBotTrimmed1: any = [];
  subscriptionPrice: any;
  baseCurrencyFromApi : any;
  apiBotId: any;
  isBotApi: any;

  constructor(private modalService: NgbModal,public route:Router, public http:HttpClient, public data: CoreDataService) { }

  ngOnInit() {

    this.traderRole = localStorage.getItem('traderRole');

    console.log('roles',this.traderRole)


    this.getApiMarketData();
    this.getBotMarketData();
    
    // setTimeout(() => {
    //  this.createChart();
      
    // }, 2000);
    this.getTraderName()



  }


  followCheckBox(event){

    if(event.target.checked == true){
      this.isFollowStatus = 1;
    }
    else{
      this.isFollowStatus = 0;

    }

  }




  getTraderName(){

    this.http.get<any>('https://accounts.paybito.com/CopyTradingService/rest/GetTraderName', { headers: { 'content-Type': 'application/json' } })
    .subscribe(response => {

      console.log('get all traders', response.traderNameDetails)

      this.traderName = response.traderNameDetails;



    })

  }


  changeScreenBot(e){
    if(e == 1){
      this.tradeApiKeyStatus = true;
      this.botTraderStatus = false;
      console.log('here1')
      this.createChart();

     

    }
    else{
      this.tradeApiKeyStatus = false;
      this.botTraderStatus = true;
      console.log('here2')
      this.createChartBot();

      


    }
  }


  createChartBot(){

        
    setTimeout(() => {

      // Set to false to disable plugin
      const CROSSHAIR_ENABLED = false;
      let pluginOptions: any;

      // If enable, set some plugin options
      if(CROSSHAIR_ENABLED){
        pluginOptions = {
          line: {
            color: '#0000FF',
          }
        }
      } 
      // Else if plugin is disable
      else {
        pluginOptions = false;
      }

      console.log('bot daraaa',this.chartBodyBotTrimmed1)
      
      for(let x = 0;x<=this.chartBodyBotTrimmed1.length;x++){
        let iter = this.chartBodyBotTrimmed1[x];
        if(iter != undefined){
          console.log('per iteration ==> ',x,iter)
          let arr = [];
          iter.forEach(element => {
            console.log(element)
             let refinedString = element.slice(1,-1);
             //console.log('refinedString',refinedString);
             let refinedValue = refinedString.split(',')
            // console.log('refinedValue',refinedValue)
            let obj = {
              x:parseInt(refinedValue[0]),
              y:refinedValue[1],
            }
            arr.push(obj)
            console.log(x,' ==== >',arr)
            this.traderBotsMarketCard[x]['chartBodyModified'] = arr;
          });

        }
      }
      console.log('xxxxx',this.traderBotsMarketCard)
      for(var i = 0 ; i<=this.traderBotsMarketCard.length; i++){
       
        const ctx = (<HTMLCanvasElement>document.getElementById('myChartBot'+i)).getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'line',
        data : {
          datasets : [{
             /*  data : [{
                x : 1552581000000,
                y : 150
              },], */
              data:this.traderBotsMarketCard[i].chartBodyModified,
              // backgroundColor : "#FF0000",
              borderColor : "#008ffb",
              fill : false,
              pointRadius : 2,
              borderWidth : 3
          }]

          
        },
        options: {
          plugins: {
            // Set the plugin options, or false
            crosshair: pluginOptions,
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              // gridLines: { color: "#2c313c" },
            //  ticks: {
            //     fontColor: "#2c313c", 
            //   },
              type: 'time',
              display: true,
              
              scaleLabel: {
                display: false,
                labelString: 'Time'
              }
            }],
            yAxes: [{
              // gridLines: { color: "#2c313c" },
              // ticks: {
              //   fontColor: "#2c313c", 
              // },
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Value'
              }
            }]
          },
          tooltips: {
            mode: 'index'
          }
        }
      });

      }


      

      
      
    }, 2000);
         

  }


  createChart(){

 
    
    setTimeout(() => {

      // Set to false to disable plugin
      const CROSSHAIR_ENABLED = false;
      let pluginOptions: any;

      // If enable, set some plugin options
      if(CROSSHAIR_ENABLED){
        pluginOptions = {
          line: {
            color: '#0000FF',
          }
        }
      } 
      // Else if plugin is disable
      else {
        pluginOptions = false;
      }
      
      for(let x = 0;x<=this.chartBodyTrimmed1.length;x++){
        let iter = this.chartBodyTrimmed1[x];
        if(iter != undefined){
          console.log('per iteration ==> ',x,iter)
          let arr = [];
          iter.forEach(element => {
            console.log(element)
             let refinedString = element.slice(1,-1);
             //console.log('refinedString',refinedString);
             let refinedValue = refinedString.split(',')
            // console.log('refinedValue',refinedValue)
            let obj = {
              x:parseInt(refinedValue[0]),
              y:refinedValue[1],
            }
            arr.push(obj)
            console.log(x,' ==== >',arr)
            this.traderApiMarketCard[x]['chartBodyModified'] = arr;
          });

        }
      }
      console.log('fffffff',this.traderApiMarketCard)
      for(var i = 0 ; i<=this.traderApiMarketCard.length; i++){
       
        const ctx = (<HTMLCanvasElement>document.getElementById('myChart'+i)).getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'line',
        data : {
          datasets : [{
             /*  data : [{
                x : 1552581000000,
                y : 150
              },], */
              data:this.traderApiMarketCard[i].chartBodyModified,
              // backgroundColor : "#FF0000",
              borderColor : "#008ffb",
              fill : false,
              pointRadius : 2,
              borderWidth : 3
          }]

          
        },
        options: {
          plugins: {
            // Set the plugin options, or false
            crosshair: pluginOptions,
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              // gridLines: { color: "#2c313c" },
            //  ticks: {
            //     fontColor: "#2c313c", 
            //   },
              type: 'time',
              display: true,
              
              scaleLabel: {
                display: false,
                labelString: 'Time'
              }
            }],
            yAxes: [{
              // gridLines: { color: "#2c313c" },
              // ticks: {
              //   fontColor: "#2c313c", 
              // },
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Value'
              }
            }]
          },
          tooltips: {
            mode: 'index'
          }
        }
      });

      }


      

      
      
    }, 2000);
         

  }

  gotoViewTrader(e,j,follow){

    this.route.navigate(['/view-traders', e,j,follow]);
    // this.route.navigateByUrl('/view-traders/'+e);
    
  }
  gotoViewBotTrader(e,j,follow){

    this.route.navigate(['/view-bot-traders', e,j,follow]);
    // this.route.navigateByUrl('/view-traders/'+e);
    
  }
  gotoViewBot(){
    this.route.navigateByUrl('/view-bots');
    
  }


  getApiMarketData(){


    var updateAPI = {};
    updateAPI['timeRange'] = this.timePeriod;
    updateAPI['traderName'] = this.traderNameFilter;
    updateAPI['allMarket'] = this.marketType;
    updateAPI['baseCurrency'] = this.basecurrency;
    updateAPI['minTradeQty'] = this.minTrade;
    updateAPI['showFollowedOnly'] = this.isFollowStatus;
    updateAPI['exchange_name'] = this.exchanageName;

    updateAPI['customerId'] = localStorage.getItem('user_id');


    
    
    var jsonString = JSON.stringify(updateAPI);


    this.http.post<any>('https://accounts.paybito.com/CopyTradingService/rest/GetMarketPlaceApiKeyChartHeader/apiKey', jsonString, { headers: { 'content-Type': 'application/json' } })
    .subscribe(response => {

      this.traderApiMarketCard = response.getChartHeader;

      for(var i = 0; i<this.traderApiMarketCard.length; i++){
      console.log('chartBody',this.traderApiMarketCard[i].chartBody)

       this.chartBody.push(this.traderApiMarketCard[i].chartBody);
        }

      console.log('chartBodyArray',this.chartBody)


      for(var j = 0 ; j<this.chartBody.length; j++){
        // var removeFirst = this.chartBody[j].split('|')

        
            var removeFirst = this.chartBody[j].split('|')
      console.log('removeFirst',removeFirst);
      this.chartBodyTrimmed1.push(removeFirst)

     }

       console.log('this.chartBodyTrimmed NOW',this.chartBodyTrimmed1)

      this.createChart();
      




      

    })

  }

  getApiMarketDataFilter(){

    this.traderApiMarketCard = []
    this.chartBody = []
    this.chartBodyTrimmed1 = []


    var updateAPI = {};
    updateAPI['timeRange'] = this.timePeriod;
    updateAPI['traderName'] = this.traderNameFilter;
    updateAPI['allMarket'] = this.marketType;
    updateAPI['baseCurrency'] = this.basecurrency;
    updateAPI['minTradeQty'] = this.minTrade;
    updateAPI['showFollowedOnly'] = this.isFollowStatus;
    updateAPI['exchange_name'] = this.exchanageName;

    updateAPI['customerId'] = localStorage.getItem('user_id');


    
    
    var jsonString = JSON.stringify(updateAPI);


    this.http.post<any>('https://accounts.paybito.com/CopyTradingService/rest/GetMarketPlaceApiKeyChartHeader/apiKey', jsonString, { headers: { 'content-Type': 'application/json' } })
    .subscribe(response => {

      this.traderApiMarketCard = response.getChartHeader;
        // this.createChart()

        for(var i = 0; i<this.traderApiMarketCard.length; i++){
          console.log('chartBody',this.traderApiMarketCard[i].chartBody)
    
           this.chartBody.push(this.traderApiMarketCard[i].chartBody);
            }
    
          console.log('chartBodyArray',this.chartBody)
    
    
          for(var j = 0 ; j<this.chartBody.length; j++){
            // var removeFirst = this.chartBody[j].split('|')

           
            var removeFirst = this.chartBody[j].split('|')
          console.log('removeFirst',removeFirst);
          this.chartBodyTrimmed1.push(removeFirst)
    
         }
    
           console.log('this.chartBodyTrimmed NOW',this.chartBodyTrimmed1)
    
          this.createChart();

      

    })

  }


  getBotMarketData(){


    var updateAPI = {};
    updateAPI['timeRange'] = this.timePeriod;
    updateAPI['traderName'] = this.traderNameFilter;
    updateAPI['allMarket'] = this.marketType;
    updateAPI['baseCurrency'] = this.basecurrency;
    updateAPI['minTradeQty'] = this.minTrade;
    updateAPI['showFollowedOnly'] = this.isFollowStatus;
    updateAPI['exchange_name'] = this.exchanageName;

    updateAPI['customerId'] = localStorage.getItem('user_id');

    
    
    var jsonString = JSON.stringify(updateAPI);


    this.http.post<any>('https://accounts.paybito.com/CopyTradingService/rest/GetMarketPlaceApiKeyChartHeader/bots', jsonString, { headers: { 'content-Type': 'application/json' } })
    .subscribe(response => {

      this.traderBotsMarketCard = response.getChartHeader;


      for(var i = 0; i<this.traderBotsMarketCard.length; i++){
        console.log('chartBodyBot',this.traderBotsMarketCard[i].chartBody)
  
         this.chartBodyBot.push(this.traderBotsMarketCard[i].chartBody);
          }
  
        console.log('chartBodyBotArray',this.chartBodyBot)
  
  
        for(var j = 0 ; j<this.chartBodyBot.length; j++){
          // var removeFirst = this.chartBodyBot[j].split('|')
         
           var removeFirstBot = this.chartBodyBot[j].split('|')

        console.log('removeFirstBot',removeFirstBot);
        this.chartBodyBotTrimmed1.push(removeFirstBot)
  
       }
  
         console.log('this.chartBodyBotTrimmed NOW',this.chartBodyBotTrimmed1)
  
        this.createChartBot();




      // this.createChart();

      

    })

  }




  getBotMarketDataFilter(){

    this.traderBotsMarketCard = []
    this.chartBodyBot = []
    this.chartBodyBotTrimmed1 = []
    this.traderBotsMarketCard = [];


    
    var updateAPI = {};
    updateAPI['timeRange'] = this.timePeriod;
    updateAPI['traderName'] = this.traderNameFilter;
    updateAPI['allMarket'] = this.marketType;
    updateAPI['baseCurrency'] = this.basecurrency;
    updateAPI['minTradeQty'] = this.minTrade;
    updateAPI['showFollowedOnly'] = this.isFollowStatus;
    updateAPI['exchange_name'] = this.exchanageName;

    updateAPI['customerId'] = localStorage.getItem('user_id');

    
    
    var jsonString = JSON.stringify(updateAPI);


    this.http.post<any>('https://accounts.paybito.com/CopyTradingService/rest/GetMarketPlaceApiKeyChartHeader/bots', jsonString, { headers: { 'content-Type': 'application/json' } })
    .subscribe(response => {

      this.traderBotsMarketCard = response.getChartHeader;
      for(var i = 0; i<this.traderBotsMarketCard.length; i++){
        console.log('chartBodyBot',this.traderBotsMarketCard[i].chartBody)
  
         this.chartBodyBot.push(this.traderBotsMarketCard[i].chartBody);
          }
  
        console.log('chartBodyBotArray',this.chartBodyBot)
  
  
        for(var j = 0 ; j<this.chartBodyBot.length; j++){
          
          var removeFirstBot = this.chartBodyBot[j].split('|')

          console.log('removeFirstBot',removeFirstBot);
        this.chartBodyBotTrimmed1.push(removeFirstBot)
  
       }
  
         console.log('this.chartBodyBotTrimmed NOW',this.chartBodyBotTrimmed1)
  
        this.createChartBot();


      

    })

  }


  openSubscriptionInfoModal(md, price, id, isBotApi){
    this.modalService.open(md, {
      centered: true
    });

    this.subscriptionPrice = price
    this.apiBotId = id;
    this.isBotApi = isBotApi;
  }

  getBaseCurrency(){
    if(this.marketType == 'Spot'){

    
      this.getAllBaseCurrency(1);

    }
    if(this.marketType == 'Futures'){
      this.getAllBaseCurrency(2);
      
    }
    if(this.marketType == 'Options'){
      this.getAllBaseCurrency(3);
      
    }

  }

  getAllBaseCurrency(e){


    this.http.get<any>(this.data.WEBSERVICE+'/home/baseCurrenciesByMarket/'+e, 
    { headers: {
      'Content-Type': 'application/json',
      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
    } }
    )
    .subscribe(response => {

      console.log('get all traders', response.assetPairList)

      this.baseCurrencyFromApi = response.assetPairList;



    })

  }

  followTrader(){
    
    var updateAPI = {};
    
    updateAPI['botId'] = this.apiBotId;
    updateAPI['customerId'] = localStorage.getItem('user_id');
    updateAPI['isBotOrApi'] = this.isBotApi;


    console.log('subs0',updateAPI);
    
    
    var jsonString = JSON.stringify(updateAPI);

     

    this.http.post<any>('https://accounts.paybito.com/CopyTradingBot/rest/CreateBotFollowers', jsonString, { headers: { 'content-Type': 'application/json' } })
    .subscribe(response => {

      if(response.error.error_data == '0'){
        this.modalService.dismissAll()

        this.data.alert(response.error.error_msg, 'success');
        // this.getTraderDetails();
        // this.getApiMarketData();
        // this.getBotMarketData();
        location.reload();

      }
      else{
        this.modalService.dismissAll()

        this.data.alert(response.error.error_msg, 'danger');
        location.reload();


      }

      

      

    })
  }




}
