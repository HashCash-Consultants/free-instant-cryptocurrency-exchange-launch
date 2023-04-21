import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { interval, timer } from 'rxjs';


export class DerivativeTvChartWebSocketAPI {
    private messageSource = new BehaviorSubject(' ');
   currentMessage = this.messageSource.asObservable();
  
    reqNo:any;
    buyingasset:any;
    webSocketAPI:any;
    obj:any;
    sellingasset:any;
    ticker:any;
    depth:any;
    trade:any;
    //webSocketEndPoint: string = 'http://localhost:9030/ws';
    webSocketEndPoint: string = 'https://futures-stream.paybito.com:6443/FutureChartStream/ws';
    //webSocketEndPoint: string = 'wss://ws.sandbox.paxos.com/marketdata/BTCUSD';
    topic: string = "/user/topic/stream/tradingView";
    stompClient: any;
    chartComponent;
    assetPair:any;
   
    constructor(){
      
    }
    
    
    
    
    _connect() {
       //// //console.log('TV CONNECT')
        if (localStorage.getItem('access_token') !== null && localStorage.getItem('access_token') !== undefined) {
          //// //console.log('if')
          let ws = new SockJS(this.webSocketEndPoint);
          this.stompClient = Stomp.over(ws);
          const _this = this;
          //// //console.log(_this.stompClient)
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
            });
        }, this.errorCallBack);
        this.stompClient.debug = null
      }else{
        //// //console.log('else')
        // window.location.href = "https://trade.paybito.com/";
      }
        
    };

    _disconnect() {

      try{
        if (this.stompClient !== null) {
          this.stompClient.disconnect();
      }

      }
      catch{

        console.log('connection not established yet')

      }

       
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        //// //console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

	/**
	 * Send message to sever via web socket
	 * @param {*} message 
	 */
    _send(message) {
       // // //console.log('TV MESSAGE SENT')
        this.stompClient.send("/app/sendRequest/tradingView", {}, JSON.stringify(message));
    }

    onMessageReceived(message) {
       // // //console.log('TV MESSAGE RECEIVED')
        var str = JSON.stringify(message.body);
       var obj = JSON.parse(str);
       this.changeMessage(obj);
    }
    
    changeMessage(obj){
        this.messageSource.next(obj);
        
    }

    subscribe() {
        //// //console.log(this.stompClient)
        if (
          localStorage.getItem("buying_crypto_asset") !== null && localStorage.getItem("buying_crypto_asset") !== undefined &&
          localStorage.getItem("selling_crypto_asset") !== null && localStorage.getItem("selling_crypto_asset") !== undefined
        ) {
        //// //console.log('TV MESSAGE SUBS')
          this.buyingasset = localStorage.getItem("buying_crypto_asset").toLocaleLowerCase();
          localStorage.setItem('lastBuyingAsset', this.buyingasset);
          this.sellingasset = localStorage.getItem("selling_crypto_asset").toLocaleLowerCase();
          localStorage.setItem('lastSellingAsset', this.sellingasset);
          this.reqNo = Math.floor((Math.random() * 1000) + 1);
          // var resolutionDataFromStorage = localStorage.getItem('resolutionData');
          var resolutionDataFromStorage = localStorage.getItem('resolutionDataSocket');

          
          let resolutionData = '';
          if(resolutionDataFromStorage == null){
            resolutionData = '1D';
          }
          if(resolutionDataFromStorage == '1D'){
            resolutionData = '1D';
          }
          else if(resolutionDataFromStorage == '1'){
            resolutionData = '1MIN';
          }
          else if(resolutionDataFromStorage == '15'){
            resolutionData = '15MIN';
          }
          else if(resolutionDataFromStorage == '30'){
            resolutionData = '30MIN';
          }
          else if(resolutionDataFromStorage == '60'){
            resolutionData = '1HR';
          }
          else if(resolutionDataFromStorage == '240'){
            resolutionData = '4HR';
          }
          else if(resolutionDataFromStorage == '2D'){
            resolutionData = '2D';

          }
          else if(resolutionDataFromStorage == '3D'){
            resolutionData = '3D';

          }
          else if(resolutionDataFromStorage == '1W'){
            resolutionData = '1W';

          }

          else if(resolutionDataFromStorage == '3W'){
            resolutionData = '3W';

          }

          else if(resolutionDataFromStorage == '1M'){
            resolutionData = '1MON';

          }

          else if(resolutionDataFromStorage == '6M'){
            resolutionData = '6MON';

          }
          else{
            resolutionData = '1D';

          }

        let isUnsubscribeOccured = localStorage.getItem('isUnsubscribeOccuredChart')

          // if(isUnsubscribeOccured == 'true'){

            //console.log('in socket subscribe' + resolutionData + resolutionDataFromStorage)
          const req = {
            "method": "SUBSCRIBE",
            "base":this.sellingasset.toUpperCase(),
            "counter" : this.buyingasset.toUpperCase(),
            "contract": localStorage.getItem("selected_derivative_asset_pair"),
            "actualResolution" : resolutionData,
            "id": this.reqNo
          };
          // setTimeout(() => {
          //   this._send(req);
          // },2000);
          timer(8000).subscribe(()=>{

            this._send(req);
  
          })
          localStorage.setItem('isUnsubscribeOccuredChart','false')

          }
          
    
        // }
      }

      unsubscribe() {
        try {
          if (localStorage.getItem("lastBuyingAsset") && localStorage.getItem("lastSellingAsset")) {
            this.buyingasset = localStorage.getItem("lastBuyingAsset").toLocaleLowerCase();
            this.sellingasset = localStorage.getItem("lastSellingAsset").toLocaleLowerCase();
            this.ticker = '@ticker';
            this.depth = '@depth';
            this.trade = '@trade';
            const req = {
              "method": "UNSUBSCRIBE",
              "params": [
                this.buyingasset + "/" + this.sellingasset + this.ticker,
                this.buyingasset + this.sellingasset + this.depth,
                this.buyingasset + this.sellingasset + this.trade,
              ],
              "id": this.reqNo
            };
            this._send(req);
            localStorage.setItem('isUnsubscribeOccuredChart','true')
            //console.log('unsubscribe try block')
    
          }
          else {
            //console.log('unsubscribe error block')
           // window.location.href = "https://trade.paybito.com/";
          }
        }
        catch (e) {
         // window.location.href = "https://trade.paybito.com/";
        //  location.reload();
        }
    
    
      }
       
      
    
     
}