import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ChartComponent } from './chart/chart.component';
import { BehaviorSubject } from 'rxjs';
import { OrderBookComponent } from './order-book/order-book.component';
import { Router } from '@angular/router';
import { interval, timer } from 'rxjs';



export class WebSocketAPI {
  private messageSource = new BehaviorSubject(' ');
  currentMessage = this.messageSource.asObservable();

  reqNo: any;
  buyingasset: any;
  webSocketAPI: any;
  obj: any;
  sellingasset: any;
  ticker: any;
  depth: any;
  trade: any;
  //webSocketEndPoint: string = 'http://localhost:9030/ws';
  webSocketEndPoint: string = 'https://stream.paybito.com:5443/SocketStream/ws';
  //webSocketEndPoint: string = 'wss://ws.sandbox.paxos.com/marketdata/BTCUSD';
  topic: string = "/user/topic/stream";
  topicForBtcUsd: string = "/topic/stream/BTCUSD"

  stompClient: any;
  chartComponent;

  constructor() {

  }




  _connect() {
    //console.log('Access Token : ', localStorage.getItem('access_token'))
    if (localStorage.getItem('access_token') !== null && localStorage.getItem('access_token') !== undefined) {
      //console.log('if')
      let ws = new SockJS(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      const _this = this;
      //console.log(_this.stompClient)
      _this.stompClient.connect({}, function (frame) {
        //console.log('here in connect')
        let topic = '';
        if (
          localStorage.getItem('buying_crypto_asset') != undefined && localStorage.getItem('buying_crypto_asset') != '' && localStorage.getItem('buying_crypto_asset') != 'undefined' && localStorage.getItem('selling_crypto_asset') != undefined && localStorage.getItem('selling_crypto_asset') != '' && localStorage.getItem('selling_crypto_asset') != 'undefined'
        ) {
          if (localStorage.getItem('buying_crypto_asset').toUpperCase() == 'BTC' && localStorage.getItem('selling_crypto_asset').toUpperCase() == 'USD') {
            // alert('in if')
            topic = _this.topicForBtcUsd
          } else {
            // alert('in else')
            topic = _this.topic
          }
          _this.stompClient.subscribe(topic, function (sdkEvent) {
            //console.log('in subscribe')
            _this.onMessageReceived(sdkEvent);
          });

        }
      }, this.errorCallBack);
      this.stompClient.debug = null

    } else {
      //console.log('else')
      // location.href = this.data.brokerDomain;
    }
  };

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    //console.log("errorCallBack -> " + error)
    // console.log('Access Token : ',localStorage.getItem('access_token'))
    if (localStorage.getItem('access_token') !== null && localStorage.getItem('access_token') !== undefined) {
      setTimeout(() => {
        this._connect();
      }, 5000);
    } else {
      // location.href = this.data.brokerDomain;
    }
  }

  /**
   * Send message to sever via web socket
   * @param {*} message 
   */
  _send(message) {
    let send = ''
    if (
      localStorage.getItem('buying_crypto_asset') != undefined && localStorage.getItem('buying_crypto_asset') != '' && localStorage.getItem('buying_crypto_asset') != 'undefined' && localStorage.getItem('selling_crypto_asset') != undefined && localStorage.getItem('selling_crypto_asset') != '' && localStorage.getItem('selling_crypto_asset') != 'undefined'
    ) {

      if (localStorage.getItem('buying_crypto_asset').toUpperCase() == 'BTC' && localStorage.getItem('selling_crypto_asset').toUpperCase() == 'USD') {
        send = "/app/sendRequest/BTCUSD"
      } else {
        send = "/app/sendRequest"
      }
      this.stompClient.send(send, {}, JSON.stringify(message));
    }
  }

  onMessageReceived(message) {
    //let str = JSON.stringify(message.body);
    //let obj = JSON.parse(str);
    this.changeMessage(JSON.parse(JSON.stringify(message.body)));
  }

  changeMessage(obj) {
    this.messageSource.next(obj);

  }

  subscribe() {
    //console.log(this.stompClient)
    if (
      localStorage.getItem("buying_crypto_asset") !== null && localStorage.getItem("buying_crypto_asset") !== undefined &&
      localStorage.getItem("selling_crypto_asset") !== null && localStorage.getItem("selling_crypto_asset") !== undefined
    ) {
      this.buyingasset = localStorage.getItem("buying_crypto_asset").toLocaleLowerCase();
      localStorage.setItem('lastBuyingAsset', this.buyingasset);
      this.sellingasset = localStorage.getItem("selling_crypto_asset").toLocaleLowerCase();
      localStorage.setItem('lastSellingAsset', this.sellingasset);
      this.ticker = '@ticker';
      this.depth = '@depth';
      this.trade = '@trade';
      this.reqNo = Math.floor((Math.random() * 1000) + 1);
      const req = {
        "method": "SUBSCRIBE",
        "params": [
          this.buyingasset + "/" + this.sellingasset + this.ticker,
          this.buyingasset + this.sellingasset + this.depth,
          this.buyingasset + this.sellingasset + this.trade,
        ],
        "id": this.reqNo
      };
      timer(10000).subscribe(() => {

        this._send(req);

      })
      localStorage.setItem('isUnsubscribeOccured', 'false')

    }
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
        timer(10000).subscribe(() => {

          this._send(req);

        })
        localStorage.setItem('isUnsubscribeOccured', 'true')

      }
      else {
        // window.location.href = this.data.brokerDomain;
      }
    }
    catch (e) {
      // window.location.href = this.data.brokerDomain;
      location.reload();
    }


  }

}