import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreDataService } from '../core-data.service';
import * as $ from 'jquery';
import { StopLossComponent } from '../stop-loss/stop-loss.component';

@Component({
  selector: 'app-portfolio-holdings',
  templateUrl: './portfolio-holdings.component.html',
  styleUrls: ['./portfolio-holdings.component.css']
})
export class PortfolioHoldingsComponent implements OnInit {
  portfolioDetails:any;
  portfolioHeader:any;
  portfolioId:any;
  portfolioDate:any;
  fulName:any;
  currencyName:any;
  baseCurrency:any;
  balance:any;
  price:any;
  portfolioType:any;
  marginTransactionId;
  marginTimeStamp;
  marginFullName;
  marginDescription;
  marginTxnType;
  marginDebit;
  margincrebit;
  marginoperationMode;
  marginTransactionValues;
  portfolioBalance:any;
  portfolioHoldings:any;
  amount:any;
  onlyBuyAmount: any;
  onlyBuyPrice: any;
  onlyBuyTotalPrice: any;
  onlySellAmount: any;
  onlySellPrice: any;
  onlySellTotalPrice: any;
  onlyBuyPrice1:any;
  tradem:any;
  tradep:any;
  curencyName:any;
  baseCurrencyName:any;
  assetcode:any;
  mpTransactionid:any;
  constructor(private stoploss:StopLossComponent,private http: HttpClient,private data:CoreDataService, private modalService: NgbModal,) { }

  ngOnInit() {
    this.data.currentMessage1.subscribe(message1=>{
      if(message1){
        this.tradem = message1;
      }
    })
 
    this.data.currentMessage2.subscribe(message2=>{
     if(message2){
       this.tradep = message2;
     }
   })
    this.portfolioDeatils();
    this.marginTransactionHistory();
    this.userPortfolioBalance();
  }

  portfolioDeatils(){
    var url = this.data.MARGINURL + "portfolioDetails?customerId=" + localStorage.getItem('user_id') + "";
    this.http.get<any>(url)
    .subscribe(response=>{
      this.portfolioHeader = response.header;
      this.portfolioId = this.portfolioHeader[0];
      this.portfolioDate = this.portfolioHeader[1]
      this.fulName = this.portfolioHeader[2];
      this.currencyName = this.portfolioHeader[3];
      this.baseCurrency = this.portfolioHeader[4];
      this.balance = this.portfolioHeader[5];
      this.price = this.portfolioHeader[6];
      this.portfolioType = this.portfolioHeader[7];
      this.portfolioDetails = response.values;
    })
  }

  marginTransactionHistory(){
    var url = this.data.MARGINURL + "marginFundingTransactionHistory?customerId=" + localStorage.getItem('user_id') + "";
    this.http.get<any>(url)
    .subscribe(data=>{
      var response = data.header;
      this.marginTransactionId = response[0];
      this.marginTimeStamp = response[1];
      this.marginFullName = response[2]
      this.marginDescription = response[3];
      this.marginTxnType = response[4];
      this.marginDebit = response[5];
      this.margincrebit = response[6];
      this.marginoperationMode = response[7];
      this.marginTransactionValues = data.values;
    })
  }

  userPortfolioBalance(){
    var url = this.data.MARGINURL + "userPortfolioBalance?customerId=" + localStorage.getItem('user_id') + "";
    this.http.get<any>(url)
    .subscribe(data=>{
      this.portfolioBalance = data.userBalance;
    })
  }

  modalbuy(content,amount,curName, base_currency, assetCode,mpportfolioid){
    this.amount = amount;
    this.curencyName = curName;
    this.baseCurrencyName = base_currency;
    this.assetcode = assetCode;
    this.mpTransactionid = mpportfolioid
    this.modalService.open(content, { centered: true });
  }

  marginReset(){
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
    $(function () {
      $('input.form-control').val('');
    })
    this.stoploss.getUserTransaction();
  }

  portfolioholdingBuy() {
    this.data.alert('Loading...', 'dark');
    this.data.selectedBuyingAssetText = localStorage.getItem('buying_crypto_asset')
    this.data.selectedSellingAssetText = localStorage.getItem('selling_crypto_asset')
    //alert(this.data.selectedBuyingAssetText + '  ' + this.data.selectedSellingAssetText)
    var onlyBuyAmount = this.amount;
    this.http.get<any>(this.data.TRADESERVICE +"?symbol=" + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() +  '&side=BID' + '&amount='+ onlyBuyAmount)
      .subscribe(data => {
        var result = data;
         if (result.statuscode != '0') {
          if (this.data.selectedSellingAssetText == 'USD') {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          } else {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          }
          $('.onlyBuyError').hide();
          $('#marketbuy').prop('disabled', false);
          var inputObj = {}
          inputObj['selling_asset_code'] = (this.baseCurrencyName).toUpperCase();
          inputObj['buying_asset_code'] = (this.curencyName).toUpperCase();
          inputObj['userId'] = localStorage.getItem('user_id');
          inputObj['price'] = this.onlyBuyPrice1;
          inputObj['txn_type'] = '1';
          var jsonString = JSON.stringify(inputObj);
          this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .subscribe(response => {
              var result = response;
              if (result.error.error_data != '0') {
                this.data.alert(result.error.error_msg, 'warning');
                $('.tradeBtn').attr('disabled', true);
              } else {
                var inputObj = {};
                // inputObj['customerId'] = localStorage.getItem('user_id');
                inputObj['uuid'] = localStorage.getItem('uuid');

                inputObj['selling_asset_code'] = (this.baseCurrencyName).toUpperCase();
                inputObj['buying_asset_code'] = (this.curencyName).toUpperCase();
                inputObj['quantity'] = parseFloat(onlyBuyAmount);
                inputObj['price'] = this.onlyBuyPrice1;
                inputObj["offerType"] = 'P';
                inputObj['txnType'] = '1';
                inputObj['assetCode'] = this.assetcode;
                inputObj['portfolioId'] = this.mpTransactionid;
                var jsonString = JSON.stringify(inputObj);
                if ((this.onlyBuyPrice1 * onlyBuyAmount) >= .001) {
                  this.http.post<any>(this.data.MARGINURL + 'createOffer', jsonString, {
                    headers: {
                      'Content-Type': 'application/json',
                      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                    }
                  })
                    .subscribe(data => {
                      this.data.loader = false;
                      var result = data;
                      if (result.error!= '0') {
                          this.data.alert(result.message, 'danger');
                          location.reload();
                      } else {
                        this.marginReset();
                        this.data.alert(result.message, 'success');
                        location.reload();
                      }
                      //this.marginReset();
                    });
                } else {
                  this.marginReset();
                  this.data.loader = false;
                  this.data.alert('Offer Value is lesser than permissible value', 'warning');
                }
              }
              
              
            });
          }
          else {
            this.data.alert(result.message, 'danger');
          }
      })
  }

  portfolioholdingSell() {
    this.data.alert('Loading...', 'dark');
    this.data.selectedBuyingAssetText = localStorage.getItem('buying_crypto_asset')
    this.data.selectedSellingAssetText = localStorage.getItem('selling_crypto_asset')
    var onlySellAmount = this.amount;
    this.http.get<any>(this.data.TRADESERVICE +"?symbol=" + this.data.selectedBuyingAssetText.toUpperCase() + this.data.selectedSellingAssetText.toUpperCase() +  '&side=ASK' + '&amount='+ onlySellAmount)
      .subscribe(data => {
        var result = data;
         if (result.statuscode != '0') {
          if (this.data.selectedSellingAssetText == 'USD') {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          } else {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.tradep);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          }
          $('.onlyBuyError').hide();
          $('#marketbuy').prop('disabled', false);
          var inputObj = {}
          inputObj['selling_asset_code'] = (this.curencyName).toUpperCase();
          inputObj['buying_asset_code'] = (this.baseCurrencyName).toUpperCase();
          inputObj['userId'] = localStorage.getItem('user_id');
          inputObj['price'] = this.onlyBuyPrice1;
          inputObj['txn_type'] = '1';
          var jsonString = JSON.stringify(inputObj);
          this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .subscribe(response => {
              var result = response;
              if (result.error.error_data != '0') {
                this.data.alert(result.error.error_msg, 'warning');
                $('.tradeBtn').attr('disabled', true);
              } else {
                var inputObj = {};
                // inputObj['customerId'] = localStorage.getItem('user_id');
                inputObj['uuid'] = localStorage.getItem('uuid');

                inputObj['selling_asset_code'] = (this.curencyName).toUpperCase();
                inputObj['buying_asset_code'] = (this.baseCurrencyName).toUpperCase();
                inputObj['quantity'] = parseFloat(onlySellAmount);
                inputObj['price'] = this.onlyBuyPrice1;
                inputObj["offerType"] = 'P';
                inputObj['txnType'] = '2';
                inputObj['assetCode'] = this.assetcode;
                inputObj['portfolioId'] = this.mpTransactionid;
                var jsonString = JSON.stringify(inputObj);
                if ((this.onlyBuyPrice1 * onlySellAmount) >= .001) {
                  this.http.post<any>(this.data.MARGINURL + 'createOffer', jsonString, {
                    headers: {
                      'Content-Type': 'application/json',
                      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                    }
                  })
                    .subscribe(data => {
                      this.data.loader = false;
                      var result = data;
                      if (result.error!= '0') {
                          this.data.alert(result.message, 'danger');
                          location.reload();
                      } else {
                        this.marginReset();
                        this.data.alert(result.message, 'success');
                        location.reload();
                      }
                      //this.marginReset();
                    });
                } else {
                  this.marginReset();
                  this.data.loader = false;
                  this.data.alert('Offer Value is lesser than permissible value', 'warning');
                }
              }
              
              
            });
          }
          else {
            this.data.alert(result.message, 'danger');
          }
      })
  }

}
