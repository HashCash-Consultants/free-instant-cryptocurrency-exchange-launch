import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import {
    widget,
    IChartingLibraryWidget,
    ChartingLibraryWidgetOptions,
    LanguageCode,
    Timezone,
    IBasicDataFeed,
    ResolutionString,
    ResolutionBackValues,
    HistoryDepth
} from '../../assets/charting_library/charting_library.min';
import { CoreDataService } from "../core-data.service";
//import { DashboardComponent } from "../dashboard/dashboard.component";
import { TvChartWebSocketAPI } from "./TvChartWebSocketAPI";

//import { TradeHistoryService } from './trade-history.service';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { interval, timer } from 'rxjs';


@Component({
    selector: 'app-tv-chart-container',
    templateUrl: './tv-chart-container.component.html',
    styleUrls: ['./tv-chart-container.component.css']
})
export class TvChartContainerComponent implements OnInit, OnDestroy {

    @Input() theme = 'Dark';

    private _symbol: ChartingLibraryWidgetOptions['symbol'] =  ':' + localStorage.getItem("buying_crypto_asset") + '/' + localStorage.getItem("selling_crypto_asset");
    private _interval: ChartingLibraryWidgetOptions['interval'] = '1D';
    private _datafeedUrl = 'https://accounts.paybito.com/ChartApi/spot';
    private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = './assets/charting_library/';
    private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = '';
    private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
    private _clientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
    private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
    private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
    private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
    private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
    private _tvWidget: IChartingLibraryWidget | null = null;
    private buyingAsset: any;
    private sellingAsset: any;
    Themecolor: any;
    Datafeed:IBasicDataFeed;
    timezone:Timezone='Etc/UTC';
    supportedResolutions:string[] = ["1", "15", "30", "60", "240", "1D", "2D", "3D", "1W", "3W", "1M", "6M"]
    historyDepthReturn:HistoryDepth;
    config = {
        supported_resolutions: this.supportedResolutions
    };

    constructor(public data: CoreDataService, public chartSocket: TvChartWebSocketAPI, private http: HttpClient) { }
    @Input()
    set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
        this._symbol = symbol || this._symbol;
    }

    @Input()
    set interval(interval: ChartingLibraryWidgetOptions['interval']) {
        this._interval = interval || this._interval;
    }

    @Input()
    set datafeedUrl(datafeedUrl: string) {
        this._datafeedUrl = datafeedUrl || this._datafeedUrl;
    }

    @Input()
    set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
        this._libraryPath = libraryPath || this._libraryPath;
    }

    @Input()
    set chartsStorageUrl(chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']) {
        this._chartsStorageUrl = chartsStorageUrl || this._chartsStorageUrl;
    }

    @Input()
    set chartsStorageApiVersion(chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']) {
        this._chartsStorageApiVersion = chartsStorageApiVersion || this._chartsStorageApiVersion;
    }

    @Input()
    set clientId(clientId: ChartingLibraryWidgetOptions['client_id']) {
        this._clientId = clientId || this._clientId;
    }

    @Input()
    set userId(userId: ChartingLibraryWidgetOptions['user_id']) {
        this._userId = userId || this._userId;
    }

    @Input()
    set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
        this._fullscreen = fullscreen || this._fullscreen;
    }

    @Input()
    set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
        this._autosize = autosize || this._autosize;
    }

    @Input()
    set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
        this._containerId = containerId || this._containerId;
    }

    changeThemeColor(theme) {
        this.Themecolor = theme;
        this.loadTradingViewData()
        if (theme == 'Dark') {
            const widgetOptions: ChartingLibraryWidgetOptions = {
                symbol: this._symbol,
                //datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl, 100000),
                datafeed: this.Datafeed,
                interval: this._interval,
                container_id: this._containerId,
                library_path: this._libraryPath,
                locale: 'en',
                disabled_features: ['use_localstorage_for_settings', 'header_saveload', 'header_settings', 'header_compare', 'header_symbol_search', 'header_chart_type', 'widget_logo'],
                enabled_features: ['hide_left_toolbar_by_default', 'header_indicators'],
                charts_storage_url: this._chartsStorageUrl,
                charts_storage_api_version: this._chartsStorageApiVersion,
                client_id: this._clientId,
                user_id: this._userId,
                fullscreen: this._fullscreen,
                autosize: this._autosize,
                theme: "Dark",
                overrides: {
                    // "mainSeriesProperties.showCountdown": true,
                    "paneProperties.background": "#131722",
                    "paneProperties.vertGridProperties.color": "#242323",
                    "paneProperties.horzGridProperties.color": "#242323",
                    "symbolWatermarkProperties.transparency": 90,
                    "scalesProperties.textColor": "#AAA",
                    "mainSeriesProperties.candleStyle.wickUpColor": '#21CB80',
                    "mainSeriesProperties.candleStyle.wickDownColor": '#F5475D',
                }

            };

            const tvWidget = new widget(widgetOptions);
            this._tvWidget = tvWidget;
        }
        else {
            const widgetOptions: ChartingLibraryWidgetOptions = {
                symbol: this._symbol,
                //datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl, 100000),
                datafeed: this.Datafeed,
                interval: this._interval,
                container_id: this._containerId,
                library_path: this._libraryPath,
                locale: 'en',
                disabled_features: ['use_localstorage_for_settings', 'header_saveload', 'header_settings', 'header_compare', 'header_symbol_search', 'header_chart_type', 'widget_logo'],
                enabled_features: ['hide_left_toolbar_by_default', 'header_indicators'],
                charts_storage_url: this._chartsStorageUrl,
                charts_storage_api_version: this._chartsStorageApiVersion,
                client_id: this._clientId,
                user_id: this._userId,
                fullscreen: this._fullscreen,
                autosize: this._autosize,
                theme: "Light",
                overrides: {
                    // "mainSeriesProperties.showCountdown": true,
                    "paneProperties.background": "#fafafa",
                    "paneProperties.vertGridProperties.color": "#dedede",
                    "paneProperties.horzGridProperties.color": "#dedede",
                    "symbolWatermarkProperties.transparency": 90,
                    "scalesProperties.textColor": "#AAA",
                    "mainSeriesProperties.candleStyle.wickUpColor": '#21CB80',
                    "mainSeriesProperties.candleStyle.wickDownColor": '#F5475D',
                }

            };

            const tvWidget = new widget(widgetOptions);
            this._tvWidget = tvWidget;
        }
        // // console.log('now theme is ', theme);

    }

    callWebSocket = () => {
        this.chartSocket._connect();

        if (this.chartSocket.stompClient != null) {
            // setTimeout(() => {
                this.chartSocket.subscribe();
            // }, 1000);
        }
        

    }

    ngOnInit() {
        localStorage.setItem('resolutionData', '1D')
        this.buyingAsset = localStorage.getItem("buying_crypto_asset").toLocaleUpperCase();
        this.sellingAsset = localStorage.getItem("selling_crypto_asset").toLocaleUpperCase();
        this._symbol = ':' + this.buyingAsset.toUpperCase() + '/' + this.sellingAsset.toUpperCase();
        var test = localStorage.getItem('themecolor');
        this.Themecolor = test
        this.callWebSocket();

        this.loadTradingViewData();

        this.tvChartInitialize();


          window.onbeforeunload = () => this.ngOnDestroy();

    }

    ngDoCheck() {
        this.Themecolor = localStorage.getItem('themecolor').toString();

        // if(this.Themecolor == 'Dark'){
        //     // console.log('is is dark');

        // }
        // else{
        //     // console.log('is is light');

        // }

        if (
            localStorage.getItem("buying_crypto_asset") !== undefined && localStorage.getItem("buying_crypto_asset") !== null &&
            localStorage.getItem("selling_crypto_asset") !== undefined && localStorage.getItem("selling_crypto_asset") !== null
        ) {

            this.buyingAsset = localStorage.getItem("buying_crypto_asset").toLocaleUpperCase();
            this.sellingAsset = localStorage.getItem("selling_crypto_asset").toLocaleUpperCase();
        }
        /* if (localStorage.getItem("buying_crypto_asset") != 'BTC') {
            this._tvWidget.chart().setSymbol(this._symbol, () => {

            });
        }*/
        //this.changeTheme(); 
        /* checking for if asset pair has been chnaged */
        let isAssetPairChangedRecently = localStorage.getItem('isAssetPairChangedRecently')
        if (isAssetPairChangedRecently == 'true') {
             this.chartSocket.unsubscribe();
            let toTimestamp = Math.floor(Date.now() / 1000)
            this.loadTradingViewData()
            // setTimeout(() => {
                this.chartSocket.subscribe();
                
            // }, 0);
            $('.loading-paybito').css('display', 'block');
            localStorage.setItem('isAssetPairChangedRecently', 'false')
            this.buyingAsset = localStorage.getItem("buying_crypto_asset").toLocaleUpperCase();
            this.sellingAsset = localStorage.getItem("selling_crypto_asset").toLocaleUpperCase();
            this._symbol = ':' + this.buyingAsset.toUpperCase() + '/' + this.sellingAsset.toUpperCase();
            this._tvWidget.chart().setSymbol(this._symbol, () => {
                $('.loading-paybito').css('display', 'none');
            });
        }
        let isUnsubscribeOccured = localStorage.getItem('isUnsubscribeOccuredChart')

        if(isUnsubscribeOccured == 'true'){
            //console.log('chart has unsubscribe')
            // setTimeout(() => {
                this.chartSocket.subscribe();
            // }, 0);
        }

       
    }
    

    changeTheme() {

        // // console.log('now in light theme');

        this._tvWidget.onChartReady(() => {
            // this._symbol = (this.buyingAsset) + '/' + this.sellingAsset;
            var test = localStorage.getItem('themecolor').toString();
            this.Themecolor = test;
            if (test == "Light") {
                // console.log('now in light theme');

                this._tvWidget.changeTheme('Light');
            }
            else {
                // console.log('now in dark theme');

                this._tvWidget.changeTheme('Dark');
            }
        });

    }

    ngOnDestroy() {
        //this.chartSocket.unsubscribe();
        //this.chartSocket._disconnect();
        if (this._tvWidget !== null) {
            this._tvWidget.remove();
            this._tvWidget = null;
        }
        if (this.chartSocket.stompClient != null) {
            this.chartSocket.unsubscribe();
            // timer(5000).subscribe(()=>{
                this.chartSocket._disconnect();  
            // });
          }
    }


    tvChartInitialize() {


        var themecolor = localStorage.getItem('themecolor');
        this.Themecolor = themecolor;
        //// //console.log('saved theme', themecolor)
        if (themecolor == null || themecolor == undefined) {

            const widgetOptions: ChartingLibraryWidgetOptions = {
                symbol: this._symbol,
                 //datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl, 850000),
                 datafeed: this.Datafeed,
                interval: this._interval,
                container_id: this._containerId,
                library_path: this._libraryPath,
                locale: 'en',
                disabled_features: ['use_localstorage_for_settings', 'header_saveload', 'header_settings', 'header_compare', 'header_symbol_search', 'header_chart_type', 'widget_logo'],
                enabled_features: ['hide_left_toolbar_by_default', 'header_indicators'],
                charts_storage_url: this._chartsStorageUrl,
                charts_storage_api_version: this._chartsStorageApiVersion,
                client_id: this._clientId,
                user_id: this._userId,
                fullscreen: this._fullscreen,
                autosize: this._autosize,
                theme: "Dark",
                overrides: {
                    // "mainSeriesProperties.showCountdown": true,
                    "paneProperties.background": "#131722",
                    "paneProperties.vertGridProperties.color": "#242323",
                    "paneProperties.horzGridProperties.color": "#242323",
                    "symbolWatermarkProperties.transparency": 90,
                    "scalesProperties.textColor": "#AAA",
                    "mainSeriesProperties.candleStyle.wickUpColor": '#21CB80',
                    "mainSeriesProperties.candleStyle.wickDownColor": '#F5475D',
                }

            };

            const tvWidget = new widget(widgetOptions);
            this._tvWidget = tvWidget;

            tvWidget.onChartReady(() => {
                tvWidget.headerReady().then(() => {
                    const button = tvWidget.createButton();
                });
            });

            setTimeout(() => {
                $('.loading-paybito').css('display', 'none');
            }, 6000);


        }
        else {
            if (themecolor == 'Dark') {

                const widgetOptions: ChartingLibraryWidgetOptions = {
                    symbol: this._symbol,
                    // datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl, 100000),
                datafeed: this.Datafeed,

                    interval: this._interval,
                    container_id: this._containerId,
                    library_path: this._libraryPath,
                    locale: 'en',
                    disabled_features: ['use_localstorage_for_settings', 'header_saveload', 'header_settings', 'header_compare', 'header_symbol_search', 'header_chart_type', 'widget_logo'],
                    enabled_features: ['hide_left_toolbar_by_default', 'header_indicators'],
                    charts_storage_url: this._chartsStorageUrl,
                    charts_storage_api_version: this._chartsStorageApiVersion,
                    client_id: this._clientId,
                    user_id: this._userId,
                    fullscreen: this._fullscreen,
                    autosize: this._autosize,
                    theme: "Dark",
                    overrides: {
                        // "mainSeriesProperties.showCountdown": true,
                        "paneProperties.background": "#131722",
                        "paneProperties.vertGridProperties.color": "#242323",
                        "paneProperties.horzGridProperties.color": "#242323",
                        "symbolWatermarkProperties.transparency": 90,
                        "scalesProperties.textColor": "#AAA",
                        "mainSeriesProperties.candleStyle.wickUpColor": '#21CB80',
                        "mainSeriesProperties.candleStyle.wickDownColor": '#F5475D',
                    }

                };

                const tvWidget = new widget(widgetOptions);
                this._tvWidget = tvWidget;

                tvWidget.onChartReady(() => {
                    tvWidget.headerReady().then(() => {
                        const button = tvWidget.createButton();
                    });
                });

                setTimeout(() => {
                    $('.loading-paybito').css('display', 'none');
                }, 6000);

            }
            if (themecolor == 'Light') {

                const widgetOptions: ChartingLibraryWidgetOptions = {
                    symbol: this._symbol,
                   // datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl, 850000),
                    datafeed: this.Datafeed,
                    interval: this._interval,
                    container_id: this._containerId,
                    library_path: this._libraryPath,
                    locale: 'en',
                    disabled_features: ['use_localstorage_for_settings', 'header_saveload', 'header_settings', 'header_compare', 'header_symbol_search', 'header_chart_type', 'widget_logo'],
                    enabled_features: ['hide_left_toolbar_by_default', 'header_indicators'],
                    charts_storage_url: this._chartsStorageUrl,
                    charts_storage_api_version: this._chartsStorageApiVersion,
                    client_id: this._clientId,
                    user_id: this._userId,
                    fullscreen: this._fullscreen,
                    autosize: this._autosize,
                    theme: "Light",
                    overrides: {
                        // "mainSeriesProperties.showCountdown": true,
                        "paneProperties.background": "#fafafa",
                        "paneProperties.vertGridProperties.color": "#dedede",
                        "paneProperties.horzGridProperties.color": "#dedede",
                        "symbolWatermarkProperties.transparency": 90,
                        "scalesProperties.textColor": "#AAA",
                        "mainSeriesProperties.candleStyle.wickUpColor": '#21CB80',
                        "mainSeriesProperties.candleStyle.wickDownColor": '#F5475D',
                    }

                };

                const tvWidget = new widget(widgetOptions);
                this._tvWidget = tvWidget;

                tvWidget.onChartReady(() => {
                    tvWidget.headerReady().then(() => {
                        const button = tvWidget.createButton();
                    });
                });

                setTimeout(() => {
                    $('.loading-paybito').css('display', 'none');
                }, 6000);

            }
        }




    }

    loadTradingViewData(){

        this.Datafeed = 
        {
          
          onReady: cb => {
             setTimeout(() =>cb(this.config) , 0);
            
              
            },
            searchSymbols: async(userInput, exchange, symbolType, onResultReadyCallback) => {
            },
            resolveSymbol: async(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
              
              var split_data = symbolName.split(/[:/]/);
              
              var symbol_stub = {
                name: symbolName,
                description: `${split_data[1]}/${split_data[2]}`,
                type: 'crypto',
                session: '24x7',
                timezone: this.timezone,
                ticker: symbolName,
                exchange: split_data[0],
                minmov: 1,
                pricescale: 100000000,
                has_intraday: true,
                intraday_multipliers: ['1', '60'],
                supported_resolutions:  this.supportedResolutions,
                volume_precision: 8,
                full_name:'full_name',
                listed_exchange:'listed_exchange'
              }
              
              symbol_stub.pricescale = 100;
              setTimeout(function() {
                onSymbolResolvedCallback(symbol_stub)
                // console.log('Resolved Symbol ', JSON.stringify(symbol_stub));
              }, 0)
              
          
            },
            getBars: async(symbolInfo, resolution, from, to, onHistoryCallback) => {
                console.log('get bars calling')

                try{

                     
                  
                   //console.log('resolution' + resolution)
                let toTimestamp = Math.floor(Date.now() / 1000)
            //   let oneYearFromNow : any = new Date();
            //   oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 1);
            //   let fromTimestamp = (Math.floor(oneYearFromNow / 1000))
  
              this.http.get<any>(this._datafeedUrl + '/history?symbol=' + localStorage.getItem("buying_crypto_asset").toUpperCase() + '%2F' + localStorage.getItem("selling_crypto_asset").toUpperCase() + '&resolution='+resolution+'&from='+from+'&to=' + toTimestamp).subscribe((data:any=[]) => {
                    // console.log('history of paybito', data)
                    var bars = [];
      
                  

                    try{

                        let responseLength = data.c.length
                          for(let i = 0 ;i<responseLength;i++){
                            //   let obj = {
                              
              
                            //   close: data.c[i],
                            //   high : data.h[i],
                            //   low : data.l[i],
                            //   open: data.o[i],
                            //   time: data.t[i]*1000,
                            //   volume: data.v[i]*0.7,
                              
                            //   }
                            //   bars.push(obj)
    
                            bars = [...bars, {
                                close: data.c[i],
                              high : data.h[i],
                              low : data.l[i],
                              open: data.o[i],
                              time: data.t[i]*1000,
                              volume: data.v[i]*0.7,
                            }]
                              }
                              
                        //  if (bars.length) {
                        //       onHistoryCallback(bars, {noData: false})
                        //     } else {
                        //       onHistoryCallback([], {noData: true})
                        //     }
    
                            console.log('inside get bars',bars.length)
    
    
                        if(bars.length >= 1){
                            console.log('if block inside get bars')
    
                            onHistoryCallback(bars, { noData: false });
    
                          } else {
                            console.log('else block inside get bars')
    
                            onHistoryCallback([], { noData: true });
    
                          }
                        onHistoryCallback([], { noData: true });
    
    
                      }
                  catch{

                    console.log('error in data length', data)


                  }
                      
                  
                    
                  })
  
      
        

                }

                catch{
                    console.log('error in date format')

                }

               
              
          
            },
            subscribeBars: (symbolInfo, resolution, onRealtimeCallback,) => {
               console.log('subscribeBars Runnning', resolution)
            //    this.chartSocket._connect()
                this.chartSocket.currentMessage.subscribe((message:string = '') => {
                    setInterval(() => {


                    },5000)
                    try {
                        let mes = JSON.parse(message)
                         onRealtimeCallback({
                    
    
    
                            time: parseFloat(mes.t[0])*1000,
                            open: parseFloat(mes.o[0]),
                            high: parseFloat(mes.h[0]),
                            low: parseFloat(mes.l[0]),
                            close: parseFloat(mes.c[0]),
                            volume: parseFloat(mes.v[0])*0.7
                        });
    
    
                    } catch(e) {

                       }
                    
                    
                    
                       
                   
                }) 
              },
            unsubscribeBars: subscriberUID => {
             console.log('unsubscribeBars Running')
              this.chartSocket.unsubscribe();
            //   this.chartSocket._disconnect(); 


          
            //   this.socketService.unsubscribeBars(subscriberUID)
            },
            calculateHistoryDepth:(resolution: ResolutionString): HistoryDepth | undefined =>{
                console.log('calculate History depth is running ');
                console.log('resolution '+ resolution);
                localStorage.setItem('resolutionDataSocket', resolution)

                if (resolution === "1D") {
                  return {
                      resolutionBack: 'M',
                      intervalBack: 6
                  };
                }
                if(resolution=='3D'){
                  return {
                    resolutionBack: 'M',
                    intervalBack: 6
                  };
                }
                if(parseInt(resolution) < 60 ){
                  //this.historyDepthReturn.resolutionBack = 'D';
                  //this.historyDepthReturn.intervalBack = 1;
                  return {resolutionBack: 'D', intervalBack: 1};
                }
                else{
                  return undefined;
                }
                
               
              },
            
            // getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
            //   //optional
            //   // console.log('getMarks Running')
            // },
            // getTimescaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
            //   //optional
            //   // console.log('getTimeScaleMarks Running')
            // },
            // getServerTime: cb => {
            //   // console.log('getServerTime Running')
            // }
        }
      }

   
}