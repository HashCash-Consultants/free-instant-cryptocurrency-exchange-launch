import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-otc',
  templateUrl: './otc.component.html',
  styleUrls: ['./otc.component.css']
})
export class OtcComponent implements OnInit {
  selectedBuyingAssetText: string;
  selectedSellingAssetText: string;
  market: boolean;
  onlyBuyAmount: any;
  onlyBuyPrice: any;
  onlyBuyTotalPrice: any;
  onlySellAmount: any;
  onlySellPrice: any;
  onlySellTotalPrice: any;
  selectedCryptoCurrencyBalance: string;
  selelectedBuyingAssetBalance: string = '0';
  selelectedSellingAssetBalance: string = '0';
  currencyBalance;
  valid;
  asset;
  selectedCryptoCurrency: string;
  basecurrency: any;
  onlyBuyPrice1: any;
  onlySellPrice1: any;
  counterCurrency: any;
  base_currency: any;
  counter_currency: any;
  isBuySellEligible: boolean = false;
  isSelectedTabBuy: boolean = true;
  Themecolor:any;
  constructor(public data: CoreDataService, private http: HttpClient, private route1: ActivatedRoute) {
    let sixthParam = this.route1.snapshot.queryParamMap.get('otc');
    sessionStorage.setItem('otcroute', sixthParam);
  }

  ngOnInit() {
    this.Themecolor = localStorage.getItem('themecolor')
    this.getUserTransaction();
    this.getBasecurrencyList();
  }

  ngDoCheck() {
    this.Themecolor = localStorage.getItem('themecolor')
    this.selectedBuyingAssetText = this.data.selectedBuyingAssetText;
    this.selectedSellingAssetText = this.data.selectedSellingAssetText;
    this.asset = this.selectedSellingAssetText;
    if (this.asset === "USD") {
      this.valid = true;
    }
    else {
      this.valid = false;
    }
  }

  reset() {
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';

    //this.getUserTransaction();
  }
  buyText() {
    // $('.sellcurrency').hide();
    // $('.buycurrency').show();
    this.isSelectedTabBuy = true
  }
  sellText() {
    //$('.sellcurrency').show();
    //$('.buycurrency').hide();
    this.isSelectedTabBuy = false
  }

  getBasecurrencyList() {
    this.http.get<any>(this.data.WEBSERVICE + '/home/getAllCurrency', {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        this.counterCurrency = result.currencyList;
      });
  }

  getCounterCurrency(Currency) {
    $('.base').val('select')
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
    $('#base-cur').prop('disabled', false);
    let abcd = this.balencelist.filter(x => x.currencyCode == Currency);
    this.selelectedBuyingAssetBalance = abcd[0].closingBalance;
    this.counter_currency = Currency;
    this.http.get<any>(this.data.WEBSERVICE + "/home/getBaseByCurrency?currency=" + Currency, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(data => {
        var result = data;
        this.basecurrency = result.baseCurrencyList;
      });
  }

  getBaseCurrency(baseCurrency) {
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
    $('#inputOnlyBuyAmount').prop('disabled', false);
    $('#inputOnlySellAmount').prop('disabled', false);

    this.base_currency = baseCurrency;
    let abcde = this.balencelist.filter(x => x.currencyCode == baseCurrency);
    this.selelectedSellingAssetBalance = abcde[0].closingBalance;
    let action = 1;
    if (this.isSelectedTabBuy) {
      action = 1;
    } else {
      action = 2;
    }
    this.getPairWiseBuySellCheck(this.counter_currency, this.base_currency, action)
  }


  getBuyVal(event) {
    var val = event.target.value;
    if (val < 0 || val == "") {
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlyBuyAmount = '';
    } else {

      let action = 1
      if (this.isSelectedTabBuy) {
        action = 1;
      } else {
        action = 2;
      }
      let payload = { "currency": this.counter_currency, "baseCurrency": this.base_currency, "action": action }
      this.http.post<any>(this.data.WEBSERVICE + '/home/marketPrice', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          if (response.error.error_data != 0) {
            this.data.alert(response.error.error_msg, 'danger');
          } else {
            if (action == 1) {
              this.onlyBuyPrice = response.marketPrice;
            } else {
              this.onlySellPrice = response.marketPrice;
            }
            var onlyBuyAmount: any = val;
            if (this.isBuySellEligible) {
              this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.counter_currency + this.base_currency + '&side=BID' + '&amount=' + onlyBuyAmount)
                .subscribe(data => {
                  var result = data;
                  if (result.statuscode != '0') {
                    if (this.data.selectedSellingAssetText == 'USD') {
                      this.onlyBuyPrice = (parseFloat(result.price)).toFixed(4);
                      this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(4);
                      if (this.onlyBuyTotalPrice < 0.001) {
                        $('.onlyBuyErrorM').show();
                        $('#mbuy').prop('disabled', true);

                      }
                      else {
                        $('.onlyBuyErrorM').hide();
                        $('#mbuy').prop('disabled', false);
                      }
                    } else {
                      this.onlyBuyPrice = (parseFloat(result.price)).toFixed(6);
                      this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(6);
                      if (this.onlyBuyTotalPrice < 0.001) {
                        $('.onlyBuyErrorM').show();
                        $('#mbuy').prop('disabled', true);

                      }
                      else {
                        $('.onlyBuyErrorM').hide();
                        $('#mbuy').prop('disabled', false);
                      }
                    }
                    $('.onlyBuyError').hide();
                    $('#mbuy').prop('disabled', false);
                  } else {
                    this.onlyBuyPrice = 0;
                    this.onlyBuyTotalPrice = 0;
                    $('.onlyBuyError').show();
                    $('#mbuy').prop('disabled', true);
                  }
                }, error => {
                  // console.log(error)
              if(error.status == '401'){
                this.data.logout();
                this.data.alert('Session Timeout. Login Again', 'warning');
              }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
                  // this.data.alert(error.message, 'warning');
              }
                });
            } else {
              if (this.data.selectedSellingAssetText == 'USD') {
                this.onlyBuyPrice = (parseFloat(this.onlyBuyPrice)).toFixed(4);
                this.onlyBuyTotalPrice = (parseFloat(this.onlyBuyPrice) * parseFloat(onlyBuyAmount)).toFixed(4);
                if (this.onlyBuyTotalPrice < 0.001) {
                  $('.onlyBuyErrorM').show();
                  $('#mbuy').prop('disabled', true);

                }
                else {
                  $('.onlyBuyErrorM').hide();
                  $('#mbuy').prop('disabled', false);
                }
              } else {
                this.onlyBuyPrice = parseFloat(this.onlyBuyPrice).toFixed(6);
                this.onlyBuyTotalPrice = (parseFloat(this.onlyBuyPrice) * parseFloat(onlyBuyAmount)).toFixed(6);
                if (this.onlyBuyTotalPrice < 0.001) {
                  $('.onlyBuyErrorM').show();
                  $('#mbuy').prop('disabled', true);

                }
                else {
                  $('.onlyBuyErrorM').hide();
                  $('#mbuy').prop('disabled', false);
                }
              }
              $('.onlyBuyError').hide();
              $('#mbuy').prop('disabled', false);
            }
          }

        }, error => {
          // console.log(error)
          if(error.status == '401'){
            this.data.logout();
            this.data.alert('Session Timeout. Login Again', 'warning');
          }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
              // this.data.alert(error.message, 'warning');
          }
        });
    }
  }

  getSellVal(event) {
    var val = event.target.value;
    if (val < 0 || val == "") {
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlySellAmount = '';
    } else {

      let action = 1
      if (this.isSelectedTabBuy) {
        action = 1;
      } else {
        action = 2;
      }
      let payload = { "currency": this.counter_currency, "baseCurrency": this.base_currency, "action": action }
      this.http.post<any>(this.data.WEBSERVICE + '/home/marketPrice', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          if (response.error.error_data != 0) {
            this.data.alert(response.error.error_msg, 'danger');
          } else {
            if (action == 1) {
              this.onlyBuyPrice = response.marketPrice;
            } else {
              this.onlySellPrice = response.marketPrice;
            }
            var onlySellAmount: any = val;
            if (this.isBuySellEligible) {
              this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.counter_currency + this.base_currency + '&side=ASK' + '&amount=' + onlySellAmount)
                .subscribe(data => {

                  var result = data;
                  if (result.statuscode != '0') {
                    if (this.data.selectedSellingAssetText == 'usd') {
                      this.onlySellPrice = (parseFloat(result.price)).toFixed(4);
                      this.onlySellTotalPrice = (parseFloat(result.price) * parseFloat(onlySellAmount)).toFixed(4);
                      if (this.onlySellTotalPrice < 0.001) {
                        $('.onlyBuyErrorM').show();
                        $('#msell').prop('disabled', true);
                      }
                      else {
                        $('.onlyBuyErrorM').hide();
                        $('#msell').prop('disabled', false);
                      }
                    } else {
                      this.onlySellPrice = (parseFloat(result.price)).toFixed(6);
                      this.onlySellTotalPrice = (parseFloat(result.price) * parseFloat(onlySellAmount)).toFixed(6);
                      if (this.onlySellTotalPrice < 0.001) {
                        $('.onlyBuyErrorM').show();
                        $('#msell').prop('disabled', true);

                      }
                      else {
                        $('.onlyBuyErrorM').hide();
                        $('#msell').prop('disabled', false);
                      }
                    }
                    $('.onlySellError').hide();
                    $('#msell').prop('disabled', false);
                  } else {
                    this.onlySellPrice = 0;
                    this.onlySellTotalPrice = 0;
                    $('.onlySellError').show();
                    $('#msell').prop('disabled', true);
                  }
                })
            } else {
              if (this.data.selectedSellingAssetText == 'usd') {
                this.onlySellPrice = (parseFloat(this.onlySellPrice)).toFixed(4);
                this.onlySellTotalPrice = (parseFloat(this.onlySellPrice) * parseFloat(onlySellAmount)).toFixed(4);
                if (this.onlySellTotalPrice < 0.001) {
                  $('.onlyBuyErrorM').show();
                  $('#msell').prop('disabled', true);
                }
                else {
                  $('.onlyBuyErrorM').hide();
                  $('#msell').prop('disabled', false);
                }
              } else {
                this.onlySellPrice = (parseFloat(this.onlySellPrice)).toFixed(6);
                this.onlySellTotalPrice = (parseFloat(this.onlySellPrice) * parseFloat(onlySellAmount)).toFixed(6);
                if (this.onlySellTotalPrice < 0.001) {
                  $('.onlyBuyErrorM').show();
                  $('#msell').prop('disabled', true);

                }
                else {
                  $('.onlyBuyErrorM').hide();
                  $('#msell').prop('disabled', false);
                }
              }
              $('.onlySellError').hide();
              $('#msell').prop('disabled', false);
            }
          }
        }, error => {
         // console.log(error)
         if(error.status == '401'){
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
            // this.data.alert(error.message, 'warning');
        }
        });

    }


  }
  marketSell() {
    this.data.alert('Loading...', 'dark');
    $('.onlyBuyBtn').prop('disabled',true);
    $('.onlySellBtn').prop('disabled',true);
    $('.load').fadeIn();
    $('#msell').attr('disabled', true);
    var onlyBuyAmount = this.onlySellAmount;
    if (this.isBuySellEligible) {
      this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.counter_currency + this.base_currency + '&side=ASK' + '&amount=' + onlyBuyAmount)
        .subscribe(data => {
          var result = data;
          if (this.data.selectedSellingAssetText == 'usd') {
            this.onlySellPrice = (parseFloat(result.price)).toFixed(4);
            this.onlySellPrice1 = parseFloat(result.price1);
          } else {
            this.onlySellPrice = (parseFloat(result.price)).toFixed(6);
            this.onlySellPrice1 = parseFloat(result.price1);
          }
          $('.onlySellError').hide();
          //$('#msell').prop('disabled', false);
          var inputObj = {}
          inputObj['selling_asset_code'] = (this.counter_currency).toUpperCase();
          inputObj['buying_asset_code'] = (this.base_currency).toUpperCase();
          inputObj['userId'] = localStorage.getItem('user_id');
          inputObj['price'] = this.onlySellPrice1;
          inputObj['txn_type'] = '2';
          var jsonString = JSON.stringify(inputObj);
          this.http.post<any>(this.data.WEBSERVICE + '/userTrade/OfferPriceCheck', jsonString, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .subscribe(response => {
              var result = response;
              if (result.error.error_data != '0') {
                if (result.error.error_data == 1)
                  this.data.alert(result.error.error_msg, 'danger');
                else
                  $('#warn').click();
                $('.tradeBtn').attr('disabled', true);
              } else {

                var inputObj = {};
                // inputObj['userId'] = localStorage.getItem('user_id');
                inputObj['selling_asset_code'] = (this.counter_currency).toUpperCase();
                inputObj['buying_asset_code'] = (this.base_currency).toUpperCase();
                inputObj['amount'] = parseFloat(this.onlySellAmount);
                inputObj['price'] = parseFloat(this.onlySellPrice1);
                inputObj["offerType"] = 'M';
                inputObj['txn_type'] = '2';
                inputObj['uuid'] = localStorage.getItem('uuid')
                var jsonString = JSON.stringify(inputObj);
                if ((this.onlySellPrice * this.onlySellAmount) >= .001) {
                  this.http.post<any>(this.data.WEBSERVICE + '/userTrade/TradeCreateOffer', jsonString, {
                    headers: {
                      'Content-Type': 'application/json',
                      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                    }
                  })
                    .subscribe(data => {
                      this.data.loader = false;
                      $('.onlyBuyBtn').prop('disabled',false);
                      $('.onlySellBtn').prop('disabled',false);
                      $('.load').fadeOut();
                      var result = data;
                      if (result.error.error_data != '0') {
                        if (result.error.error_data == 1)
                          this.data.alert(result.error.error_msg, 'danger');
                        else
                          $('#warn').click();
                      } else {
                        this.reset();
                        this.data.alert(result.error.error_msg, 'success');
                      }
                    });
                } else {
                  this.reset();
                  this.data.loader = false;
                  this.data.alert('Offer Value is lesser than permissible value', 'warning');
                  $('.onlyBuyBtn').prop('disabled',false);
                  $('.onlySellBtn').prop('disabled',false);
                }
              }
            });

          // else {
          //   this.onlySellPrice = 0;
          //   $('.onlySellError').show();
          //   $('#msell').prop('disabled', true);
          // }
        });
    } else {
      var inputObj = {};
      inputObj['userId'] = localStorage.getItem('user_id');
      inputObj['baseCurrency'] = this.base_currency.toUpperCase();
      inputObj['currency'] = this.counter_currency.toUpperCase();
      inputObj['amount'] = parseFloat(this.onlySellAmount);
      inputObj['action'] = '2';

      var jsonString = JSON.stringify(inputObj);
      //if ((this.onlyBuyPrice1 * this.onlyBuyAmount) >= .001) {
      this.http.post<any>(this.data.WEBSERVICE + '/home/currencyConversion', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(data => {
          this.data.loader = false;
          $('.onlyBuyBtn').prop('disabled',false);
          $('.onlySellBtn').prop('disabled',false);
          var result = data;
          if (result.error.error_data != '0') {
            if (result.error.error_data == 1)
              this.data.alert(result.error.error_msg, 'danger');
            else
              $('#warn').click();
          } else {
            this.reset();
            this.data.alert(result.error.error_msg, 'success');
          }
          this.reset();
        });


      //}
    }
  }
  marketBuy() {
    this.data.alert('Loading...', 'dark');
    $('.onlyBuyBtn').prop('disabled',true);
    $('.onlySellBtn').prop('disabled',true);
    var onlyBuyAmount = this.onlyBuyAmount;
    if (this.isBuySellEligible) {
      this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.counter_currency + this.base_currency + '&side=BID' + '&amount=' + onlyBuyAmount)
        .subscribe(data => {
          var result = data;
          if (this.data.selectedSellingAssetText == 'usd') {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(4);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          } else {
            this.onlyBuyPrice = (parseFloat(result.price)).toFixed(6);
            this.onlyBuyPrice1 = parseFloat(result.price1);
          }
          $('.onlyBuyError').hide();
          //$('#mbuy').prop('disabled', false);
          var inputObj = {}
          inputObj['selling_asset_code'] = (this.base_currency).toUpperCase();
          inputObj['buying_asset_code'] = (this.counter_currency).toUpperCase();
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
                // inputObj['userId'] = localStorage.getItem('user_id');
                inputObj['selling_asset_code'] = this.base_currency.toUpperCase();
                inputObj['buying_asset_code'] = this.counter_currency.toUpperCase();
                inputObj['amount'] = parseFloat(this.onlyBuyAmount);
                inputObj['price'] = this.onlyBuyPrice1;
                inputObj["offerType"] = 'M';
                inputObj['txn_type'] = '1';
                inputObj['uuid'] = localStorage.getItem('uuid')
                var jsonString = JSON.stringify(inputObj);
                if ((this.onlyBuyPrice1 * this.onlyBuyAmount) >= .001) {
                  this.http.post<any>(this.data.WEBSERVICE + '/userTrade/TradeCreateOffer', jsonString, {
                    headers: {
                      'Content-Type': 'application/json',
                      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                    }
                  })
                    .subscribe(data => {
                      this.data.loader = false;
                      $('.onlyBuyBtn').prop('disabled',false);
                      $('.onlySellBtn').prop('disabled',false);
                      var result = data;
                      if (result.error.error_data != '0') {
                        if (result.error.error_data == 1)
                          this.data.alert(result.error.error_msg, 'danger');
                        else
                          $('#warn').click();
                      } else {
                        this.reset();
                        this.data.alert(result.error.error_msg, 'success');
                      }
                      this.reset();
                    });
                } else {
                  this.reset();
                  this.data.loader = false;
                  this.data.alert('Offer Value is lesser than permissible value', 'warning');
                  $('.onlyBuyBtn').prop('disabled',false);
                  $('.onlySellBtn').prop('disabled',false);
                }
              }
            });

        })
    } else {
      var inputObj = {};
      inputObj['userId'] = localStorage.getItem('user_id');
      inputObj['baseCurrency'] = this.base_currency.toUpperCase();
      inputObj['currency'] = this.counter_currency.toUpperCase();
      inputObj['amount'] = parseFloat(this.onlyBuyAmount);
      inputObj['action'] = '1';

      var jsonString = JSON.stringify(inputObj);
      //if ((this.onlyBuyPrice1 * this.onlyBuyAmount) >= .001) {
      this.http.post<any>(this.data.WEBSERVICE + '/home/currencyConversion', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(data => {
          this.data.loader = false;
          $('.onlyBuyBtn').prop('disabled',false);
          $('.onlySellBtn').prop('disabled',false);
          var result = data;
          if (result.error.error_data != '0') {
            if (result.error.error_data == 1)
              this.data.alert(result.error.error_msg, 'danger');
            else
              $('#warn').click();
          } else {
            this.reset();
            this.data.alert(result.error.error_msg, 'success');
          }
          this.reset();
        });


      //}
    }
  }

  balencelist;
  assetbalance;
  getUserTransaction() {
    var userTransObj = {};
    userTransObj['customerId'] = localStorage.getItem('user_id');
    userTransObj['uuid'] = localStorage.getItem('uuid')
    var jsonString = JSON.stringify(userTransObj);
    this.http.post<any>(this.data.WEBSERVICE + '/transaction/getUserBalance', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        this.balencelist = result.userBalanceList;
        this.currencyBalance = this.balencelist;
        if (this.currencyBalance != null) {
          for (var i = 0; i < this.currencyBalance.length; i++) {
            if (this.currencyBalance[i].currencyCode == "USD") {
              localStorage.setItem('usdbalance', this.currencyBalance[i].closingBalance);

            }
          }

        }
        if (result.error.error_data != '0') {
          this.data.alert('Cannot fetch user balance', 'danger');
        }
        else {
          this.selectedCryptoCurrency = localStorage.getItem('selected_currency');
          localStorage.getItem("selling_crypto_asset");
          localStorage.getItem("buying_crypto_asset");
          for (var i = 0; i <= this.balencelist.length - 1; i++) {
            if (this.balencelist[i].currencyCode == localStorage.getItem("buying_crypto_asset").toUpperCase()) {
              this.selelectedBuyingAssetBalance = this.balencelist[i].closingBalance.toFixed(4);

            }
            if (this.balencelist[i].currencyCode == localStorage.getItem("selling_crypto_asset").toUpperCase()) {
              this.selelectedSellingAssetBalance = this.balencelist[i].closingBalance.toFixed(4);
            }
          }
        }

      }, error => {
      // console.log(error)
      if(error.status == '401'){
        this.data.logout();
        this.data.alert('Session Timeout. Login Again', 'warning');
      }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
          // this.data.alert(error.message, 'warning');
      }
      });
  }

  /*** Method defination for pair wise buy sell checking ***/
  getPairWiseBuySellCheck = (currency, baseCurrency, action) => {

    this.http.get<any>(this.data.WEBSERVICE + '/home/pairWiseBuySellChecking?currency=' + currency + '&baseCurrency=' + baseCurrency, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        if (response.error.error_data != 0) {
          this.data.alert(response.error.error_msg, 'danger');
        } else {
          if (response.buySellFlag == 0) {
            this.isBuySellEligible = false
            let payload = { "currency": currency, "baseCurrency": baseCurrency, "action": action }
            this.http.post<any>(this.data.WEBSERVICE + '/home/marketPrice', JSON.stringify(payload), {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
              }
            })
              .subscribe(response => {
                if (response.error.error_data != 0) {
                  this.data.alert(response.error.error_msg, 'danger');
                } else {
                  if (action == 1) {
                    this.onlyBuyPrice = response.marketPrice;
                    this.onlyBuyAmount = 1;
                    this.onlyBuyTotalPrice = parseFloat(this.onlyBuyPrice) * this.onlyBuyAmount;
                    //$('#inputOnlyBuyAmount').keyup();
                    $('.onlyBuyBtn').removeAttr('disabled')
                  } else {
                    this.onlySellPrice = response.marketPrice;
                    this.onlySellAmount = 1;
                    this.onlySellTotalPrice = parseFloat(this.onlySellPrice) * this.onlySellAmount;
                    $('.onlySellBtn').removeAttr('disabled')
                  }
                }

              }, error => {
               // console.log(error)
              if(error.status == '401'){
                this.data.logout();
                this.data.alert('Session Timeout. Login Again', 'warning');
              }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
                  // this.data.alert(error.message, 'warning');
              }
              });

          } else {
            this.isBuySellEligible = true
          }
        }

      }, error => {
        // console.log(error)
        if(error.status == '401'){
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
            // this.data.alert(error.message, 'warning');
        }
      });
  }

}
