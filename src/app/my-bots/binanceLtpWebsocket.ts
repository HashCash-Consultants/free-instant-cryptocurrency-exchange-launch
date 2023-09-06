import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';


export class BinanceLtpWebsocket {
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
    webSocketEndPoint: string = 'https://copytrading-socket.paybito.com:8443/socket/websocket';
    topic: string = "/topic/name";
    stompClient: any;
    chartComponent;
    assetPair:any;
   
    constructor(){
      
    }
    
    
    
    
    _connect() {
        console.log('binace CONNECT')
       
        //console.log('Access Token : ', localStorage.getItem('access_token'))
        if (localStorage.getItem('access_token') !== null && localStorage.getItem('access_token') !== undefined) {
          console.log('if')
          let ws = new SockJS(this.webSocketEndPoint);
          this.stompClient = Stomp.over(ws);
          const _this = this;
          console.log("STOMP CLIENT",_this.stompClient)
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                // console.log('test data',sdkEvent)
                _this.onMessageReceived(sdkEvent);
            });
        }, this.errorCallBack);
        this.stompClient.debug = null
      }else{
        console.log('else')
        window.location.href = "https://trade.paybito.com/";
      }
        
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

	/**
	 * Send message to sever via web socket
	 * @param {*} message 
	 */
    _send(message) {
        
        this.stompClient.send("/app/sendRequest", {}, JSON.stringify(message));
    }

    onMessageReceived(message) {

        
        var str = JSON.stringify(message.body);
       var obj = JSON.parse(str);
        // console.log('gdgdgdgdgdgdgdgdg',str);

       this.changeMessage(obj);
    }
    
    changeMessage(obj){
        this.messageSource.next(obj);
        
    }

    subscribe(){
       /* this.buyingasset = localStorage.getItem("buying_crypto_asset").toLocaleLowerCase();
       localStorage.setItem('lastBuyingAsset',this.buyingasset);
       this.sellingasset = localStorage.getItem("selling_crypto_asset").toLocaleLowerCase();
       localStorage.setItem('lastSellingAsset',this.sellingasset); */
        // this.assetPair = localStorage.getItem("selected_derivative_asset_pair").toLowerCase();
        // localStorage.setItem('lastAssetPair',this.assetPair);
        // this.ticker = '@ticker';
        // this.depth = '@depth';
        // this.trade = '@trade';
        // this.reqNo = Math.floor((Math.random() * 1000) + 1);
        // const req = {
        //   "method": "SUBSCRIBE",
        //   "params": [
        //     this.assetPair + this.ticker,
        //     this.assetPair + this.depth,
        //     this.assetPair + this.trade,
        //   ],
        //   "id": this.reqNo
        // };
        //this._send(req);
      }

      unsubscribe(){
        try{
          if(localStorage.getItem("lastAssetPair")){
            //this.buyingasset = localStorage.getItem("lastBuyingAsset").toLocaleLowerCase();
            //this.sellingasset = localStorage.getItem("lastSellingAsset").toLocaleLowerCase();
            this.assetPair =localStorage.getItem("selected_derivative_asset_pair").toLowerCase();
             this.ticker = '@ticker';
             this.depth = '@depth';
             this.trade = '@trade';
            const req = {
              "method": "UNSUBSCRIBE",
              "params": [
                this.assetPair + this.ticker,
                this.assetPair + this.depth,
                this.assetPair + this.trade,
              ],
              "id": this.reqNo
            };
            this._send(req);
          }
          else{
           // window.location.href = "https://trade.paybito.com/";
          }
        }
      
        catch(e){
         // window.location.href = "http://54.193.164.152//";
         location.reload();
        }
      }
       
      
    
     
}