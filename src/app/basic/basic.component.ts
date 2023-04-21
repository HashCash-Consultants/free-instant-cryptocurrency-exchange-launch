import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { element } from '@angular/core/src/render3/instructions';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit {
  selectedBuyingAssetText: string;
  selectedSellingAssetText: string;
  market: boolean;
  onlyBuyAmount: any;
  onlyBuyPrice: any = 0;
  onlyBuyTotalPrice: any = 0;
  onlySellAmount: any;
  onlySellPrice: any;
  onlySellTotalPrice: any;
  selectedCryptoCurrencyBalance: string;
  selelectedBuyingAssetBalance: any = '0';
  selelectedSellingAssetBalance: any = '0';
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
  exchangeFees: Array<string> = [];
  userExchnageFee: Object = {};
  buySellPillsClassStatus: boolean = false;
  Themecolor: any;
  accountType: string = "Buying";
  buttonType: string = "Buy";
  buttonTypeSmall: string = "buy";
  constructor(public data: CoreDataService, private http: HttpClient, private route1: ActivatedRoute, private modalService: NgbModal, public meta: Meta) {

    let fifthParam = this.route1.snapshot.queryParamMap.get('basic');
    sessionStorage.setItem('basicroute', fifthParam);

    this.meta.addTags
      ([
      { name: 'description', content: 'Paybito Pro Futures - Start crypto future trading in one of the most trusted crypto exchanges in the world with 500+ crypto markets, Up to 125:1 Leverage, and low trading fees. ' },
        
      ]);
  }

  ngOnInit() {
    this.Themecolor = localStorage.getItem('themecolor')
    this.getUserTransaction();
    this.selelectedBuyingAssetBalance = 0;
    this.selelectedSellingAssetBalance = 0;
    this.getBasecurrencyList();
    this.data.getAllAssetPairCurrencyPrecisionList();
    //  to hide tab in the basic component page
    setTimeout(() => {
      let elm = document.getElementById('marketTab');
      elm.getElementsByTagName('ul')[0].style.pointerEvents = 'none'
    }, 200);
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


    /* checking for buy sell pill tab data which is active */
    $('.nav-link').each(function (i, obj) {
      if ($(this).hasClass('active')) {
        let tabTitle = $(this).html();
        if (tabTitle.indexOf('Buy') != -1) {
          $(this).parent().parent().parent().removeClass('sell-pills-basic')
          $(this).parent().parent().parent().addClass('buy-pills-basic')
          this.isSelectedTabBuy = true;
          $('.sellbtn').addClass('sellspan');
          $('.sellbtn').removeClass('sellspanactive');
          $('.buybtn').addClass('buyspanactive');
          $('.buybtn').removeClass('buyspan');
        } else if (tabTitle.indexOf('Sell') != -1) {
          $(this).parent().parent().parent().removeClass('buy-pills-basic')
          $(this).parent().parent().parent().addClass('sell-pills-basic')
          this.isSelectedTabBuy = false;
          $('.sellbtn').removeClass('sellspan');
          $('.sellbtn').addClass('sellspanactive');
          $('.buybtn').removeClass('buyspanactive');
          $('.buybtn').addClass('buyspan');
        }
      }
    });

    /* color chnages on basis of themes for buy and sell pill background*/
    if (this.Themecolor == 'Dark') {
      //console.log('in if')
      $('.sell-pills-basic').find('a').css('background-color', '#24262d !important')
      $('.buy-pills-basic').find('a').css('background-color', '#24262d !important')
    } else {
      //console.log('in else')
      $('.sell-pills-basic').find('a').css('background-color', '#f8f9fa !important')
      $('.buy-pills-basic').find('a').css('background-color', '#f8f9fa !important')
    }
  }

  reset() {
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
  }

  buyText() {
    $('.sellcurrency').hide();
    $('.buycurrency').show();
    this.isSelectedTabBuy = true
    $('.buywith').val('Select')
    this.selectedBuyingAssetText = '0'
    this.selectedSellingAssetText = '0'
    this.counter_currency = ''
    this.base_currency = ''
    this.selelectedBuyingAssetBalance = 0;
    this.selelectedSellingAssetBalance = 0;
    //console.log('buy')
    this.reset();
    this.accountType = 'Buying';
    this.buttonType = 'Buy'
    this.buttonTypeSmall = 'buy'
  }
  sellText() {
    $('.sellcurrency').show();
    $('.buycurrency').hide();
    this.isSelectedTabBuy = false
    $('.buywith').val('Select')
    this.selectedBuyingAssetText = '0'
    this.selectedSellingAssetText = '0'
    this.counter_currency = ''
    this.base_currency = ''
    this.selelectedBuyingAssetBalance = 0;
    this.selelectedSellingAssetBalance = 0;
    this.accountType = 'Selling';
    this.buttonType = 'Sell'
    this.buttonTypeSmall = 'sell'

    // console.log('sell')
    this.reset();
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
    $('.base').val('Select');
    this.onlyBuyAmount = this.onlyBuyPrice = this.onlyBuyTotalPrice = '';
    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
    $('#base-cur-basic').prop('disabled', false);
    $('#base-cur-bas').prop('disabled', false);
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
        this.getUserTransaction();
      });
  }
  getCounterCurrencyforsell(Currency) {

    this.onlySellAmount = this.onlySellPrice = this.onlySellTotalPrice = '';
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
        this.getUserTransaction();
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


  /* getBuyVal(event) {
     var val = event.target.value;
     console.log(val)
     console.log(this.onlyBuyPrice)
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
               console.log('in if')
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
                   this.data.logout();
                   this.data.alert('Session Timeout. Login Again', 'warning');
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
                 this.onlyBuyPrice = (parseFloat(this.onlyBuyPrice)).toFixed(6);
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
           this.data.logout();
           this.data.alert('Session Timeout. Login Again', 'warning');
         });
     }
 
   }*/

  getBuyVal(event) {
    var val = event.target.value;
    let reg = /^(0|[1-9]\d*)(\.\d+)?(e-?(0|[1-9]\d*))?$/i
    if (val < 0 || val == "") {
      this.data.alert('Amount cannot be negative or blank', 'warning');
      this.onlyBuyAmount = '';
    } else {
      var onlyBuyAmount: any = val;
      if (onlyBuyAmount.match(reg)) {
        if (this.isBuySellEligible) {
          this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.counter_currency + this.base_currency + '&side=BID' + '&amount=' + onlyBuyAmount)
            .subscribe(data => {
              var result = data;
              if (result.statuscode != '0') {
                if (this.data.selectedSellingAssetText == 'USD') {
                  this.onlyBuyPrice = this.marketPrice;
                  this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
                  this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
                  if (this.onlyBuyTotalPrice < 0.001) {
                    $('.onlyBuyErrorM').show();
                    $('#mbuy').prop('disabled', true);

                  }
                  else {
                    $('.onlyBuyErrorM').hide();
                    $('#mbuy').prop('disabled', false);
                  }
                } else {
                  this.onlyBuyPrice = this.marketPrice;
                  this.onlyBuyPrice = (parseFloat(result.price)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
                  this.onlyBuyTotalPrice = (parseFloat(result.price) * parseFloat(onlyBuyAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
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
            this.onlyBuyPrice = this.marketPrice;
            this.onlyBuyPrice = (parseFloat(this.onlyBuyPrice)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
            this.onlyBuyTotalPrice = (parseFloat(this.onlyBuyPrice) * parseFloat(onlyBuyAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
            if (this.onlyBuyTotalPrice < 0.001) {
              $('.onlyBuyErrorM').show();
              $('#mbuy').prop('disabled', true);

            }
            else {
              $('.onlyBuyErrorM').hide();
              $('#mbuy').prop('disabled', false);
            }
          } else {
            let action = 1;
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
                  this.onlyBuyPrice = response.marketPrice;
                  this.onlyBuyPrice = (parseFloat(response.marketPrice)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
                  this.onlyBuyTotalPrice = (parseFloat(response.marketPrice) * parseFloat(onlyBuyAmount)).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
                  if (this.onlyBuyTotalPrice < 0.001) {
                    $('.onlyBuyErrorM').show();
                    $('#mbuy').prop('disabled', true);

                  }
                  else {
                    $('.onlyBuyErrorM').hide();
                    $('#mbuy').prop('disabled', false);
                  }
                }

              }, error => {
                //console.log(error)
              if(error.status == '401'){
                this.data.logout();
                this.data.alert('Session Timeout. Login Again', 'warning');
              }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
                  // this.data.alert(error.message, 'warning');
              }
              });

          }
          $('.onlyBuyError').hide();
          $('#mbuy').prop('disabled', false);
        }
      }
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
      /* let payload = { "currency": this.counter_currency, "baseCurrency": this.base_currency, "action": action }
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
              this.marketPrice = response.marketPrice
            } else {
              this.onlySellPrice = response.marketPrice;
              this.marketPrice = response.marketPrice
            } */
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
          let action = 1;
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
                this.onlySellPrice = response.marketPrice;
                this.onlySellTotalPrice = (parseFloat(response.marketPrice) * parseFloat(onlySellAmount)).toFixed(6);
                if (this.onlySellTotalPrice < 0.001) {
                  $('.onlyBuyErrorM').show();
                  $('#msell').prop('disabled', true);

                }
                else {
                  $('.onlyBuyErrorM').hide();
                  $('#msell').prop('disabled', false);
                }
              }

            }, error => {
                //console.log(error)
                if(error.status == '401'){
                  this.data.logout();
                  this.data.alert('Session Timeout. Login Again', 'warning');
                }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
                    // this.data.alert(error.message, 'warning');
                }
            });

        }
        $('.onlySellError').hide();
        $('#msell').prop('disabled', false);
      }
      /*   }
        }, error => {
         this.data.logout();
         this.data.alert('Session Timeout. Login Again', 'warning');
       }); */

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
          if (this.base_currency.toLowerCase() == 'usd') {
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
                inputObj['userId'] = localStorage.getItem('user_id');
                inputObj['selling_asset_code'] = (this.counter_currency).toUpperCase();
                inputObj['buying_asset_code'] = (this.base_currency).toUpperCase();
                inputObj['amount'] = parseFloat(this.onlySellAmount);
                inputObj['price'] = parseFloat(this.onlySellPrice1);
                inputObj["offerType"] = 'M';
                inputObj['txn_type'] = '2';
                inputObj['assetCode'] = this.data.getAssetCode((this.counter_currency).toUpperCase(), (this.base_currency).toUpperCase());
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
                          $('#warn').click();
                      } else {
                        this.reset();
                        this.data.alert(result.error.error_msg, 'success');
                        this.renderUpdatedBalance('sell');
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
          $('.onlyBuyBtn').prop('disabled', false);
          $('.onlySellBtn').prop('disabled', false);
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
          this.renderUpdatedBalance('sell');
        });


      //}
    }
  }
  marketBuy() {
    $('.onlyBuyBtn').prop('disabled', true);
    $('.onlySellBtn').prop('disabled', true);
    this.data.alert('Loading...', 'dark');
    var onlyBuyAmount = this.onlyBuyAmount;
    if (this.isBuySellEligible) {
      this.http.get<any>(this.data.TRADESERVICE + "?symbol=" + this.counter_currency + this.base_currency + '&side=BID' + '&amount=' + onlyBuyAmount)
        .subscribe(data => {
          var result = data;
          if (this.base_currency.toLowerCase() == 'usd') {
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
                inputObj['userId'] = localStorage.getItem('user_id');
                inputObj['selling_asset_code'] = this.base_currency.toUpperCase();
                inputObj['buying_asset_code'] = this.counter_currency.toUpperCase();
                inputObj['amount'] = parseFloat(this.onlyBuyAmount);
                inputObj['price'] = this.onlyBuyPrice1;
                inputObj["offerType"] = 'M';
                inputObj['txn_type'] = '1';
                inputObj['assetCode'] = this.data.getAssetCode((this.counter_currency).toUpperCase(), (this.base_currency).toUpperCase());
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
                          $('#warn').click();
                      } else {
                        this.reset();
                        this.data.alert(result.error.error_msg, 'success');
                      }
                      this.reset();
                      this.renderUpdatedBalance('buy');
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
              $('#warn').click();
          } else {
            this.reset();
            this.data.alert(result.error.error_msg, 'success');
          }
          this.reset();
          this.renderUpdatedBalance('buy');
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
            // if (this.currencyBalance[i].currencyCode == "USD") {
            //   localStorage.setItem('usdbalance', this.currencyBalance[i].closingBalance);
            // }
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
              var buyingCrptoBalance = this.balencelist[i].closingBalance.toFixed(4);

            }
            if (this.balencelist[i].currencyCode == localStorage.getItem("selling_crypto_asset").toUpperCase()) {
              var sellingCrptoBalance = this.balencelist[i].closingBalance.toFixed(4);
            }
          }
        }

      }, error => {
         //console.log(error)
         if(error.status == '401'){
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
            // this.data.alert(error.message, 'warning');
        }
      });
  }
  /* Method defination for fetching balance after trade */
  renderUpdatedBalance = (action) => {
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
        if (result.error.error_data != '0') {
          this.data.alert('Cannot fetch user balance', 'danger');
        }
        else {

          let balance = result.userBalanceList;
          for (var i = 0; i <= balance.length - 1; i++) {
            if (action == 'buy') {
              console.log(balance[i].currencyCode, this.counter_currency.toUpperCase())
              if (balance[i].currencyCode == this.base_currency.toUpperCase()) {
                this.selelectedSellingAssetBalance = balance[i].closingBalance;
                break;
              }
            } else {
              if (balance[i].currencyCode == this.counter_currency.toUpperCase()) {
                this.selelectedBuyingAssetBalance = balance[i].closingBalance;
                break;
              }
            }

          }
        }

      }, error => {
          //console.log(error)
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
                    this.onlyBuyPrice = parseFloat(response.marketPrice).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
                    this.marketPrice = response.marketPrice
                    this.onlyBuyAmount = 1;
                    this.onlyBuyTotalPrice = (parseFloat(response.marketPrice) * this.onlyBuyAmount).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
                    //$('#inputOnlyBuyAmount').keyup();
                    $('.onlyBuyBtn').removeAttr('disabled')
                  } else {
                    this.onlySellPrice = parseFloat(response.marketPrice).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
                    this.onlySellAmount = 1;
                    this.onlySellTotalPrice = (parseFloat(response.marketPrice) * this.onlySellAmount).toFixed(this.data.getSpecificAssetPairPrecision(this.counter_currency + this.base_currency)['pricePrecision']);
                    $('.onlySellBtn').removeAttr('disabled')
                  }
                }

              }, error => {
                  //console.log(error)
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
        this.data.logout();
        this.data.alert('Session Timeout. Login Again', 'warning');
      });
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

  makeClassToggle(status) {
    // console.log('button clicked');
    this.buySellPillsClassStatus = status;


  }

}
