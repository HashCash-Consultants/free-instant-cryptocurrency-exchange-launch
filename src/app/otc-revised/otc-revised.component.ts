import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-otc-revised',
  templateUrl: './otc-revised.component.html',
  styleUrls: ['./otc-revised.component.css']
})
export class OtcRevisedComponent implements OnInit {
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
  marketPrice: any;
  showQuoteAreaForBuy: boolean = false;
  showQuoteAreaForSell: boolean = false;
  intervalForBuy: any;
  intervalForSell: any;
  showRefreshButtonForBuy: boolean = false;
  showRefreshButtonForSell: boolean = false;
  countdown: any = 3;
  exchangeFees: Array<string> = [];
  userExchnageFee: Object = {};
  Themecolor:any;
  constructor(public data: CoreDataService, private http: HttpClient, private route1: ActivatedRoute, private modalService: NgbModal) {
    let sixthParam = this.route1.snapshot.queryParamMap.get('otc');
    sessionStorage.setItem('otcroute', sixthParam);
  }

  ngOnInit() {
    this.Themecolor = localStorage.getItem('themecolor')
    this.getUserTransaction('onload');
    this.getBasecurrencyList();
    this.data.getAllAssetPairCurrencyPrecisionList();
    this.selelectedSellingAssetBalance = ''
    this.selelectedBuyingAssetBalance = ''
    
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
    /* check for countdown is zero or not */
    if (this.countdown == 0) {
      this.showRefreshButtonForBuy = true;
      clearInterval(this.intervalForBuy);
      this.showRefreshButtonForSell = true;
      clearInterval(this.intervalForSell);
      this.countdown = 3
    }

    /* checking for theme color */
    $('.nav-link').each(function (i, obj) {
      let Themecolor = localStorage.getItem('themecolor')
      if($(this).hasClass('active')){
        if(Themecolor == 'Dark'){
          console.log('in if')
          $(this).removeClass('active-light')
          $(this).addClass('active')
        }else{
          console.log('in else')
          $(this).addClass('active-light')
          $(this).removeClass('active')
        }
      }
    });
    
  }

  reset() {
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = 0;
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = 0;
    //this.getUserTransaction();
    this.showQuoteAreaForBuy = false;
    this.showQuoteAreaForSell = false;
  }
  buyText() {
    // $('.sellcurrency').hide();
    // $('.buycurrency').show();
    this.isSelectedTabBuy = true
    this.selelectedSellingAssetBalance = ''
    this.base_currency = ''
  }
  sellText() {
    //$('.sellcurrency').show();
    //$('.buycurrency').hide();
    this.isSelectedTabBuy = false
    this.selelectedBuyingAssetBalance = ''
    this.counter_currency = ''
  }

  getBasecurrencyList() {
    this.http.get<any>(this.data.WEBSERVICE + '/home/getAllCurrency/'+this.data.BROKERID, {
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


  getBuyVal(data) {
    clearInterval(this.intervalForBuy)
    this.countdown = 3
    var val = data;
    if (val < 0 || val == "") {
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlyBuyAmount = '';
    } else {

      this.showRefreshButtonForBuy = false
      var onlyBuyAmount: any = val;
      if (this.isBuySellEligible) {
        this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.counter_currency + this.base_currency + '&side=BID' + '&amount=' + onlyBuyAmount)
          .subscribe(data => {
            var result = data;
            if (result.statuscode != '0') {
              if (this.data.selectedSellingAssetText == 'USD') {
                this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
                this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
                if (this.onlyBuyTotalPrice < 0.001) {
                  $('.onlyBuyErrorM').show();
                  $('#mbuy').prop('disabled', true);

                }
                else {
                  $('.onlyBuyErrorM').hide();
                  $('#mbuy').prop('disabled', false);
                }

              } else {
                this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
                this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
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
            this.intervalForBuy = setInterval(() => {
              console.log(this.countdown)
              this.countdown--
            }, 1000)
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
          this.onlyBuyPrice = this.marketPrice
          this.onlyBuyPrice = (parseFloat(this.onlyBuyPrice)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
          this.onlyBuyTotalPrice = (parseFloat(this.onlyBuyPrice) * parseFloat(onlyBuyAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
          if (this.onlyBuyTotalPrice < 0.001) {
            $('.onlyBuyErrorM').show();
            $('#mbuy').prop('disabled', true);

          }
          else {
            $('.onlyBuyErrorM').hide();
            $('#mbuy').prop('disabled', false);
          }

        } else {
          this.onlyBuyPrice = this.marketPrice
          this.onlyBuyPrice = parseFloat(this.onlyBuyPrice).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
          this.onlyBuyTotalPrice = (parseFloat(this.onlyBuyPrice) * parseFloat(onlyBuyAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
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
        this.intervalForBuy = setInterval(() => {
          console.log(this.countdown)
          this.countdown--
        }, 1000)
      }

    }
  }

  getSellVal(data) {
    clearInterval(this.intervalForSell)
    this.countdown = 3
    console.log(data)
    var val = data;
    if (val < 0 || val == "") {
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlySellAmount = '';
    } else {

      this.showRefreshButtonForSell = false
      var onlySellAmount: any = val;
      if (this.isBuySellEligible) {
        this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.counter_currency + this.base_currency + '&side=ASK' + '&amount=' + onlySellAmount)
          .subscribe(data => {

            var result = data;
            if (result.statuscode != '0') {
              if (this.data.selectedSellingAssetText == 'usd') {
                this.onlySellPrice = (parseFloat(result.price)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
                this.onlySellTotalPrice = (parseFloat(result.price) * parseFloat(onlySellAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
                if (this.onlySellTotalPrice < 0.001) {
                  $('.onlyBuyErrorM').show();
                  $('#msell').prop('disabled', true);
                }
                else {
                  $('.onlyBuyErrorM').hide();
                  $('#msell').prop('disabled', false);
                }
              } else {
                this.onlySellPrice = (parseFloat(result.price)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
                this.onlySellTotalPrice = (parseFloat(result.price) * parseFloat(onlySellAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
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
            this.intervalForSell = setInterval(() => {
              console.log(this.countdown)
              this.countdown--
            }, 1000)
          })
      } else {
        if (this.data.selectedSellingAssetText == 'usd') {
          this.onlySellPrice = this.marketPrice
          this.onlySellPrice = (parseFloat(this.onlySellPrice)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
          console.log(this.onlySellPrice, onlySellAmount)
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
          this.onlySellPrice = this.marketPrice
          this.onlySellPrice = (parseFloat(this.onlySellPrice)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
          this.onlySellTotalPrice = (parseFloat(this.onlySellPrice) * parseFloat(onlySellAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
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
        this.intervalForSell = setInterval(() => {
          console.log(this.countdown)
          this.countdown--
        }, 1000)
      }
    }


  }
  marketSell() {
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    this.data.alert('Loading...', 'dark');
    $('.load').fadeIn();
    $('#msell').attr('disabled', true);
    var onlyBuyAmount = this.onlySellAmount;
    if (this.isBuySellEligible) {
      this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.counter_currency + this.base_currency + '&side=ASK' + '&amount=' + onlyBuyAmount)
        .subscribe(data => {
          var result = data;
          if (result.statuscode != '0') {
            if (this.data.selectedSellingAssetText == 'usd') {
              this.onlySellPrice = (parseFloat(result.price)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
              this.onlySellPrice1 = parseFloat(result.price1);
            } else {
              this.onlySellPrice = (parseFloat(result.price)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
              this.onlySellPrice1 = parseFloat(result.price1);
            }
            $('.onlySellError').hide();
            // $('#msell').prop('disabled', false);
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
                    //$('#warn').click();
                    this.data.alert(result.error.error_msg, 'danger');
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
                  inputObj['assetCode'] = this.data.getAssetCode(this.counter_currency.toUpperCase(), this.base_currency.toUpperCase());
                  inputObj['baseCurrencyId'] = this.data.getAssetId(this.counter_currency.toUpperCase(), this.base_currency.toUpperCase())['baseCurrencyId'];
                  inputObj['currencyId'] = this.data.getAssetId(this.counter_currency.toUpperCase(), this.base_currency.toUpperCase())['currencyId'];
                  inputObj['uuid'] = localStorage.getItem('uuid')
                  var jsonString = JSON.stringify(inputObj);
                  if ((this.onlySellPrice1 * this.onlySellAmount) >= .001) {
                    this.http.post<any>(this.data.WEBSERVICE + '/userTrade/TradeCreateOffer', jsonString, {
                      headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                      }
                    })
                      .subscribe(data => {
                        this.data.loader = false;
                        $('.onlyBuyBtn').prop('disabled', false);
                        $('.onlySellBtn').prop('disabled', false);
                        $('.load').fadeOut();
                        var result = data;
                        if (result.error.error_data != '0') {
                          if (result.error.error_data == 1)
                            this.data.alert(result.error.error_msg, 'danger');
                          else
                            //$('#warn').click();
                            this.data.alert(result.error.error_msg, 'danger');
                        } else {
                          this.getUserTransaction('sell');
                          this.reset();
                          this.data.alert(result.error.error_msg, 'success');
                        }
                      });
                  } else {
                    this.reset();
                    this.data.loader = false;
                    this.data.alert('Offer Value is lesser than permissible value', 'warning');
                    $('.onlyBuyBtn').prop('disabled', false);
                    $('.onlySellBtn').prop('disabled', false);
                  }
                }
              });

          } else {
            this.onlySellPrice = 0;
            this.onlySellTotalPrice = 0;
            $('.onlyBuyError').show();
            $('#mbuy').prop('disabled', true);
          }
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
          $('.onlyBuyBtn').prop('disabled', false);
          $('.onlySellBtn').prop('disabled', false);
          var result = data;
          if (result.error.error_data != '0') {
            if (result.error.error_data == 1)
              this.data.alert(result.error.error_msg, 'danger');
            else
              //$('#warn').click();
              this.data.alert(result.error.error_msg, 'danger');
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
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    var onlyBuyAmount = this.onlyBuyAmount;
    if (this.isBuySellEligible) {
      this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.counter_currency + this.base_currency + '&side=BID' + '&amount=' + onlyBuyAmount)
        .subscribe(data => {
          var result = data;
          if (result.statuscode != '0') {
            if (this.data.selectedSellingAssetText == 'usd') {
              this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
              this.onlyBuyPrice1 = parseFloat(result.price1);
            } else {
              this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency+this.base_currency)['pricePrecision']);
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
                  inputObj['assetCode'] = this.data.getAssetCode(this.counter_currency.toUpperCase(), this.base_currency.toUpperCase());
                  inputObj['baseCurrencyId'] = this.data.getAssetId(this.counter_currency.toUpperCase(), this.base_currency.toUpperCase())['baseCurrencyId'];
                  inputObj['currencyId'] = this.data.getAssetId(this.counter_currency.toUpperCase(), this.base_currency.toUpperCase())['currencyId'];
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
                        $('.onlyBuyBtn').prop('disabled', false);
                        $('.onlySellBtn').prop('disabled', false);
                        var result = data;
                        if (result.error.error_data != '0') {
                          if (result.error.error_data == 1)
                            this.data.alert(result.error.error_msg, 'danger');
                          else
                            //$('#warn').click();
                            this.data.alert(result.error.error_msg, 'danger');
                        } else {
                          this.reset();
                          this.data.alert(result.error.error_msg, 'success');
                          this.getUserTransaction('buy');
                        }
                        this.reset();
                      });
                  } else {
                    this.reset();
                    this.data.loader = false;
                    this.data.alert('Offer Value is lesser than permissible value', 'warning');
                    $('.onlyBuyBtn').prop('disabled', false);
                    $('.onlySellBtn').prop('disabled', false);
                  }
                }
              });
          } else {
            this.onlyBuyPrice = 0;
            this.onlyBuyTotalPrice = 0;
            $('.onlyBuyError').show();
            $('#mbuy').prop('disabled', true);
          }
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
          $('.onlyBuyBtn').prop('disabled', false);
          $('.onlySellBtn').prop('disabled', false);
          var result = data;
          if (result.error.error_data != '0') {
            if (result.error.error_data == 1)
              this.data.alert(result.error.error_msg, 'danger');
            else
              //$('#warn').click();
              this.data.alert(result.error.error_msg, 'danger');
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
  getUserTransaction(type) {
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
             // this.selelectedBuyingAssetBalance = this.balencelist[i].closingBalance.toFixed(this.data.getSpecificCurrencyPrecision(this.balencelist[i].currencyCode));

            }
            if (this.balencelist[i].currencyCode == localStorage.getItem("selling_crypto_asset").toUpperCase()) {
             // this.selelectedSellingAssetBalance = this.balencelist[i].closingBalance.toFixed(this.data.getSpecificCurrencyPrecision(this.balencelist[i].currencyCode));
            }
          }
          if(type == 'buy'){
            this.getBaseCurrency(this.base_currency)

          }else if(type == 'sell'){
            this.getCounterCurrency(this.counter_currency)
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
                    this.marketPrice = response.marketPrice;
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

  /* Method defination for handle get quote for buy */
  handleGetQuoteForBuy = () => {
    clearInterval(this.intervalForBuy);
    this.countdown = 3;
    if (this.onlyBuyAmount != '' && this.onlyBuyAmount != 0) {
      this.showQuoteAreaForBuy = true;
      this.showRefreshButtonForBuy = false
      this.intervalForBuy = setInterval(() => {
        console.log(this.countdown)
        this.countdown--
      }, 1000)
    } else {
      this.data.alert('Please provide valid amount', 'warning');
    }
  }
  /* Method defination for handle get quote for sell */
  handleGetQuoteForSell = () => {
    clearInterval(this.intervalForSell);
    this.countdown = 3;
    if (this.onlySellAmount != '' && this.onlySellAmount != 0) {
      this.showQuoteAreaForSell = true;
      this.showRefreshButtonForSell = false
      this.intervalForSell = setInterval(() => {
        console.log(this.countdown)
        this.countdown--
      }, 1000)
    } else {
      this.data.alert('Please provide valid amount', 'warning');
    }
  }

  /* Method defination for cancel request for buy */
  handleCancelRequestForBuy = () => {
    this.onlyBuyAmount = 0;
    this.showQuoteAreaForBuy = false;
    clearInterval(this.intervalForBuy);
    this.countdown = 3
  }
  /* Method defination for cancel request for sell */
  handleCancelRequestForSell = () => {
    this.onlySellAmount = 0;
    this.showQuoteAreaForSell = false;
    clearInterval(this.intervalForSell);
    this.countdown = 3
  }

  /* Method defination for opening fee modal on clicking on fee button */
  handleOpenFeeModal = (template) => {
    document.body.classList.add("overlay")
    this.http.get<any>(this.data.WEBSERVICE + '/userTrade/volumeWiseTradingFees', {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.data.loader = false;
        var result = response;
        this.exchangeFees = result.value;
        this.http.get<any>(this.data.WEBSERVICE + '/userTrade/userVolumeWiseTradingFees?uuid=' + localStorage.getItem('uuid'), {
          headers: {
            "Content-Type": "application/json",
            authorization: "BEARER " + localStorage.getItem("access_token")
          }
        })
          .subscribe(response => {
            this.data.loader = false;
            var res = response;
            /* if (result.error.error_data != '0') {
              this.data.alert(result.error.error_msg, 'danger');
            } else { */
            if (res.userTradingFees != null && res.userTradingFees != undefined && res.userTradingFees.length != 0) {
              this.userExchnageFee = {
                totalVolume: parseFloat(res.userTradingFees[0].totalVolume).toFixed(this.data.getSpecificCurrencyPrecision('USD')),
                totalFees: parseFloat(res.userTradingFees[0].totalFees).toFixed(this.data.getSpecificCurrencyPrecision('USD')),
                makerFee: res.userTradingFees[0].makerFee,
                takerFee: res.userTradingFees[0].takerFee
              }
            } else {
              this.userExchnageFee = { totalVolume: 0, totalFees: 0, makerFee: 0, takerFee: 0 }
            }
            this.modalService.open(template, { centered: true, size: 'lg' });
            document.body.classList.remove("overlay")
            //}
          }, reason => {
            if (reason.error.error == 'invalid_token') {
              this.data.logout();
              document.body.classList.remove("overlay")
              this.data.alert('Session Timeout. Login Again', 'warning');
            } else {
              this.data.alert('Could Not Connect To Server', 'danger');
              document.body.classList.remove("overlay")
            }
          });

        //}
      }, reason => {
        if (reason.error.error == 'invalid_token') {
          this.data.logout();
          document.body.classList.remove("overlay")
          this.data.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.data.alert('Could Not Connect To Server', 'danger');
          document.body.classList.remove("overlay")
        }
      });


  }

  


}
