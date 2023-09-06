import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-derivative-trade-book',
  templateUrl: './derivative-trade-book.component.html',
  styleUrls: ['./derivative-trade-book.component.css']
})
export class DerivativeTradeBookComponent implements OnInit {


  buyingAssetIssuer: string;
  sellingAssetIssuer: string;
  bidBody: string;
  askBody: string;
  orderBookUrl: string;
  count: any;
  lowprice: any;
  highprice;
  any = 0;
  chartlist: any = 0;
  ctpdata: any = 0;
  ltpdata: any = 0;
  act: any;
  rocdata: any;
  volumndata: any;
  marketTradeBodyHtml: any;
  public biddata: any;
  public askdata: any;
  public source1: any;
  urlBid: any;
  urlAsk: any;
  selectedBuyingCryptoCurrencyName: string;
  selectedSellingCryptoCurrencyName: string;
  sellingAssetType: string;
  buyingAssetType: string;
  source12: any;
  source: any;
  token: any;
  itemcount: any;
  rocreact: any;
  filterCurrency: any;
  header: any;
  assets: any;
  currency_code: any;
  base_currency: any;
  assetPair: any;
  assetPairName: any;
  selectedBuyingAssetText: string;
  selectedSellingAssetText: string;
  assetpairbuy: string;
  assetpairsell: string;
  responseBuySell: any;
  assetcount = [];
  assetetpair = [];
  assetetpairback = [];
  orderbiddata = [];
  orderaskdata = [];
  roccolor;
  ltpcolor;
  message: any;
  subscription: any;
  subscription1: any;
  tickerSubscription: any;
  amountPrecision: any;
  pricePrecision: any;
  p;
  s;
  tradep;
  tradem;
  assetCode;
  currencyId;
  // Themecolor: any;
  allAssetPairList: any = []
  @Input() Themecolor = 'Dark';
  @Input() marketTradeRecords:any;

  constructor() { }

  ngOnInit() {
  }

  getPrice(m) {
    this.p = localStorage.getItem('priceprc');
    return (parseFloat(m.price)).toFixed(parseInt(this.p));
  }

  getAmount(m) {
    this.s = localStorage.getItem('amountprc');
    return (parseFloat(m.amount)).toFixed(parseInt(this.s));
  }
  
 




  getTradePrice(m) {
    this.tradep = localStorage.getItem('priceprc');
    return (parseFloat(m.price)).toFixed(parseInt(this.tradep));
  }

  getTradeAmount(m) {
    this.tradem = localStorage.getItem('amountprc');
    return (parseFloat(m.quantity)).toFixed(parseInt(this.tradem));
  }

}
