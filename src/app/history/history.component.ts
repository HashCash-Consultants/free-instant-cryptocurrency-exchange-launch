import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { BodyService } from '../body.service';
import {
  HttpClient
} from '@angular/common/http';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  Themecolor: string = 'Dark';
  historyDetailsMod: any = [];
  activeIdString: string;

  constructor(public main:BodyService, private http: HttpClient, public data:CoreDataService,) { }

  noOfItemPerPage;
  timeSpan = 'all';
  collection;
  page=1;
  fpage=1;
  modalService:any;
  totalCount;
  ftotalCount;
  historyDetails;
  historyTableTr;
  selectedCurrencyText;
  status:any;
  selectedCurrency;
  pgn: any = [];
  fpgn;
  action;
  assetPair;
  value;
  totalValue;
  gst;
  txnCharge;
  tradePrice;
  transactionTimestamp;
  tradeQty;
  txnId;
  marginTransactionId;
  marginTimeStamp;
  marginFullName;
  marginDescription;
  marginTxnType;
  marginDebit;
  margincrebit;
  marginoperationMode;
  marginTransactionValues;
  selectedMarginType='1';
  public futuresTxnList : Array<string> = []
  public futuresTxnListHeader : Array<string> = []
  public spotTxnList : Array<string> = []
  public optionTxnList : Array<string> = [];
  public optionTxnListHeader : Array<string> = [];

  

  ngOnInit() {
    this.Themecolor = localStorage.getItem('themecolor');

    this.getHistoryCompNavHist();

    /* showing loader on page load */
    document.body.classList.add("overlay")
    this.main.getDashBoardInfo();
    //  this.main.transactionHistory(1,this.Themecolor);
   // this.marginTransactionHistory(this.selectedMarginType);
    // this.gettradingInvoice();
    this.collection = this.main.noOfItemPerPage;
    /*** calling method for rendering futures txn history ****/
    this.renderFuturesTxnHistory();
     /*** calling method for rendering option txn history ****/
     this.renderOptionsTxnHistory();
    /*** calling method for rendering spot txn history ****/
    //this.renderSpotTransactionHistory('1');
   // $('.historyTableBody').html(this.historyTableTr);

   this.transactionHistory(1);

    $(document).ready(function(){
      $(document).on('click','.gift-js-open-modal',function () {
                this.txnId=$(this).data('txnid');
                console.log('ttttttttt',this.txnId)
                var tradeinputObj = {};
                tradeinputObj['transactionId'] = this.txnId;
                        var jsonString = JSON.stringify(tradeinputObj);
                        $.ajax({
                          url: 'https://accounts.paybito.com/api/transaction/tradingInvoice',
                          type: 'POST',
                          dataType: 'json',
                          contentType: "application/json",
                          data: jsonString,
                        // wip(1);
                        // this.http.post<any>(this.data.WEBSERVICE + '/transaction/tradingInvoice', jsonString, {
                          beforeSend: function (xhr) {
                            xhr.setRequestHeader("authorization", "bearer" + localStorage.getItem('access_token'));
                          },
                          success: function (result) {
                            var response = result;
                            if (response.error.error_data != '0') {
                              alert(response.error.error_msg);
                            } else {
                             
                              $('.actiondata').text(response.tradeInvoice.action);
                              $('.assetpairdata').text(response.tradeInvoice.assetPair);
                              $('.tradeqtydata').text(response.tradeInvoice.tradeQty);
                              $('.tradepricedata').text(response.tradeInvoice.tradePrice);
                              $('.valuedata').text(response.tradeInvoice.value);
                              $('.txnchrgdata').text(response.tradeInvoice.txnCharge);
                              if(response.tradeInvoice.gst!='0'){
                                $('.gstdata').text(response.tradeInvoice.gst);
                                $('.gstdata').parent().parent().parent().removeClass('gstvalue');
                              }
                              else{
                                $('.gstdata').text(response.tradeInvoice.gst);
                                $('.gstdata').parent().parent().parent().addClass('gstvalue');
                              }
                              
                              $('.totalvaluedata').text(response.tradeInvoice.totalValue);
                              $('.timestampdata').text(response.tradeInvoice.transactionTimestamp);
                                   this.gst=response.tradeInvoice.gst;
                                  $(".send_gift_dashboard_modal").addClass("visible");
                                  $(".send_gift_dashboard_modal-overlay").addClass("new");
                                  
                            }
                          }
                          
                        });
                       
                      });
            $(".gift-js-close-modal").on('click',function () {
                $(".send_gift_dashboard_modal").removeClass("visible");
                $(".send_gift_dashboard_modal-overlay").removeClass("new");
            });

            $(document).on('click',function (event) {
             
                //if you click on anything except the modal itself or the "open modal" link, close the modal
                if (!$(event.target).closest(".send_gift_dashboard_modal,.gift-js-open-modal").length) {
                    $("body").find(".send_gift_dashboard_modal").removeClass("visible");
                    $("body").find(".send_gift_dashboard_modal-overlay").removeClass("new");
                }
            });
    });
  }
  ngDoCheck() {

    this.Themecolor = localStorage.getItem('themecolor');
    // //console.log('saved theme', this.Themecolor)
  }

  themeChangedHandler(val){

    this.Themecolor = val;

  }

 
  pager(pg){
    
    // this.page = pg;
    // this.main.transactionHistory(pg,this.Themecolor);
     this.transactionHistory(pg);
  }
  pagerNext(pg){
   
    pg++;
    this.page = pg;
    // this.main.transactionHistory(pg,this.Themecolor);
    this.transactionHistory(pg);
  }
  pagerPre(pg){
    pg--;
    this.page = pg;
    // this.main.transactionHistory(pg,this.Themecolor);
    this.transactionHistory(pg);
  }
  pagerFutures(pg){
    
     this.fpage = pg;
    this.renderFuturesTxnHistory();
  }
  pagerFuturesNext(pg){
   
    pg++;
    this.fpage = pg;
    this.renderFuturesTxnHistory();
  }
  pagerFuturesPre(pg){
    pg--;
    this.fpage = pg;
    this.renderFuturesTxnHistory();
  }
  pagerOptions(pg){
    
     this.page = pg;
    this.renderOptionsTxnHistory();
  }
  pagerOptionsNext(pg){
   
    pg++;
    this.page = pg;
    this.renderOptionsTxnHistory();
  }
  pagerOptionsPre(pg){
    pg--;
    this.page = pg;
    this.renderOptionsTxnHistory();
  }



  //function for get duration
  getDuration(duration){
      this.main.timeSpan=duration;
      // this.main.transactionHistory('1',this.Themecolor);
      this.transactionHistory('1');

      if(duration=='all'){
          $('.filter-button').removeClass('btn_active');
          $('.all_btn').addClass('btn_active');

      }
       if(duration=='last week'){
           $('.filter-button').removeClass('btn_active');
          $('.last_week_btn').addClass('btn_active');


      }
      if(duration=='last month'){
          $('.filter-button').removeClass('btn_active');
          $('.last_month_btn').addClass('btn_active');
      }

  }

  gettradingInvoice(){
  }

  marginTransactionHistory(param){
    var url = this.data.MARGINURL + "marginFundingTransactionHistory?customerId=" + localStorage.getItem('user_id')+ "&marginType="+param;
    this.http.get<any>(url,{
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
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
  /**** Method defination for rendering futures transaction history ****/
  renderFuturesTxnHistory = () => {
    let payload = {
      no_of_items_per_page : this.collection,
      page_no : this.fpage,
      // userId :  localStorage.getItem('user_id'),
      uuid :  localStorage.getItem('uuid')
    }
    this.http.post<any>(this.data.WEBSERVICE + '/fTrade/userAllTransactions',JSON.stringify(payload),{
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
        .subscribe(data => {
          var result = data;
           if (result.statuscode != '0') {
           this.futuresTxnList = result.transactionHistory
           this.futuresTxnListHeader = result.header
           this.ftotalCount = result.totalRows;
           /* establising login for pagination  */
           this.fpgn = [];
           for (let i = 1; i <= Math.ceil(this.ftotalCount / 20); i++) {
             this.fpgn.push(i);
           }
           }else {
              this.data.alert(result.message, 'danger');
            }
        })
  }
/**** Method defination for rendering options transaction history ****/
renderOptionsTxnHistory = () => {
  let payload = {
    no_of_items_per_page : this.collection,
    page_no : this.page,
    // userId :  localStorage.getItem('user_id'),
    uuid :  localStorage.getItem('uuid')
  }
  this.http.post<any>(this.data.WEBSERVICE + '/optionsTrade/userAllTransactions',JSON.stringify(payload),{
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'BEARER ' + localStorage.getItem('access_token'),
    }
  })
      .subscribe(data => {
        var result = data;
         if (result.statuscode != '0') {
         this.optionTxnList = result.transactionHistory
         this.optionTxnListHeader = result.header
         }else {
            this.data.alert(result.message, 'danger');
          }
      })
}
  /**** Methods defination for transaction history *****/
  renderSpotTransactionHistory(pageNo) {
    /*  this.historyTableTr = `<tr>
     <td colspan="5" class="text-center py-3">
     <img src="./assets/svg-loaders/puff.svg" width="50" alt="">
     </td>
   </tr>`; */
   //  $('.historyTableBody').html(this.historyTableTr);
     var historyObj = {};
     historyObj['pageNo'] = pageNo;
     historyObj['noOfItemsPerPage']=20;
     //historyObj['userId'] = localStorage.getItem('user_id');
     historyObj['uuid'] = localStorage.getItem('uuid');

     historyObj['timeSpan'] = this.main.timeSpan;
     historyObj['transactionType']='all';
     var jsonString = JSON.stringify(historyObj);
     this.http.post<any>(this.data.WEBSERVICE + '/transaction/getUserAllTransaction', jsonString, {
       headers: {
         'Content-Type': 'application/json',
         'authorization': 'BEARER ' + localStorage.getItem('access_token'),
       }
     })
       .subscribe(response => {
         this.historyTableTr = '';
         var result = response;
 
         if (result.error.error_data != '0') {
           this.data.alert(result.error.error_msg, 'danger');
         } else {
           this.spotTxnList = result.userTransactionsResult;
           this.totalCount = result.totalCount;
           if (this.historyDetails != null) {
             var newArr = [];
             for (var i = 0; i < this.historyDetails.length; i++) {
               var timestamp = this.historyDetails[i].transactionTimestamp;
               var dt = new Date(this.historyDetails[i].transactionTimestamp);
               var timestampArr = timestamp.split('.');
               timestamp = this.data.readable_timestamp(timestampArr[0]);
               var action = this.historyDetails[i].action;
               this.selectedCurrency = localStorage.getItem('selected_currency').toUpperCase();
               this.selectedCurrencyText = this.selectedCurrency;
               if (action == 'Buy') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
               if (action == 'Buyoffer') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
               if (action == 'Sell') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
 
               if (action == 'Buydel') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
 
               if (action == 'Selldel') {
                 if (this.historyDetails[i]['creditAmount'] == 0) {
                   var amount = '<span class="text-white">' + (this.historyDetails[i].currency).toUpperCase() + ' '
                     + this.historyDetails[i]['debitAmount'] + ' Dr. </span> ';
                 }
                 else {
                   var amount = '<span class="text-white">' + (this.historyDetails[i].currency).toUpperCase() + ' '
                     + this.historyDetails[i]['creditAmount'] + ' Cr. </span> ';
                 }
               }
               console.log(action);
               if(action == 'Margin'){
                 console.log('In Margin')
                var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
               if(action == 'Funding'){
                var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }

            
               if (action == 'Rollback' || action == 'rollback' || action == 'RollBack') {
                 if (this.historyDetails[i].baseCurrency != 'usd' && this.historyDetails[i].currency != 'usd') {
                   if ((this.historyDetails[i]['creditAmount']) != 0) {
                     if (this.historyDetails[i].baseCurrency == '' || this.historyDetails[i].baseCurrency == '-' || this.historyDetails[i].baseCurrency==null) {
                       var amount = '<span class="text-white">' + (this.historyDetails[i].currency).toUpperCase() + ' '
                         + this.historyDetails[i]['creditAmount'] + ' Cr. </span> ';
                     }
                   }
               }
             }
              
               if (action == 'Buymodify') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
 
             
               if (action == 'Sellmodify') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
 
               if (action == 'Selloffer') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
                var hrefForTxn: any;
               if (action == 'Send' || action == 'Sent') {
                 if (this.historyDetails[i]['debitAmount'] != 0) {
                   var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
                   if (this.historyDetails[i].currencyTxnid != null && this.historyDetails[i].currencyTxnid != 'null') {
                     if ((this.historyDetails[i].currencyTxnid).length >= 10) {
                       hrefForTxn = '<a target="_blank" href="https://blockexplorer.com/tx/' + this.historyDetails[i].currencyTxnid + '">(Check Transaction Block)</a>';
                     }
                   }
                 }
 
               }
               if (action == 'Received' || action == 'Receive') {
                 if (this.historyDetails[i]['creditAmount'] != 0) {
                   var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
                   if (this.historyDetails[i].currencyTxnid != null && this.historyDetails[i].currencyTxnid != 'null') {
                     if ((this.historyDetails[i].currencyTxnid).length >= 10) {
                       hrefForTxn = '<a target="_blank" href="https://blockexplorer.com/tx/' + this.historyDetails[i].currencyTxnid + '">(Check Transaction Block)</a>';
                     }
                   }
                 }
 
               }
               if (action == 'Load') {
                 if(this.historyDetails[i].currency =='USD' || this.historyDetails[i].baseCurrency =='USD'){
                   var amount = ' <span class="text-white">' + this.data.CURRENCYICON + ' ' + this.historyDetails[i].creditAmount + ' Cr.</span>';
                 }
                 else if(this.historyDetails[i].currency =='AED' || this.historyDetails[i].baseCurrency =='AED'){
                   var amount = ' <span class="text-white">' + 'د.إ' + ' ' + this.historyDetails[i].creditAmount + ' Cr.</span>';
                 }
                 else{
                   var amount = ' <span class="text-white">' + '₹' + ' ' + this.historyDetails[i].creditAmount + ' Cr.</span>';
                 }
               }
               if (action == 'Withdraw') {
                 if(this.historyDetails[i].currency =='USD' || this.historyDetails[i].baseCurrency =='USD'){
                   var amount = ' <span class="text-white">' + this.data.CURRENCYICON + ' ' + this.historyDetails[i].debitAmount + ' Dr.</span>';
                 }
                 else if(this.historyDetails[i].currency =='AED' || this.historyDetails[i].baseCurrency =='AED'){
                   var amount = ' <span class="text-white">' + 'د.إ' + ' ' + this.historyDetails[i].debitAmount + ' Dr.</span>';
                 }
                 else{
                   var amount = ' <span class="text-white">' + '₹' + ' ' + this.historyDetails[i].debitAmount + ' Dr.</span>';
                 }
               }
               if (action == 'Decline') {
                 var amount = '<span class="text-white">' + (this.historyDetails[i].currency || this.historyDetails[i].baseCurrency) + ' ' + this.historyDetails[i]['creditAmount'] + ' Cr. </span>';
               }
               if (action == 'Send Decline') {
                 var amount = '<span class="text-white">' + (this.historyDetails[i].currency || this.historyDetails[i].baseCurrency) + ' ' + this.historyDetails[i]['debitAmount'] + ' Dr. </span>';
               }
               if (this.historyDetails[i].status == '0') {
                 status = 'Pending';
                 var statusClass = 'text-orange';
               } else if (this.historyDetails[i].status == '1') {
                 status = 'Confirmed';
                 var statusClass = 'text-green';
               } else{
                 status = this.historyDetails[i].action;
                 var statusClass = 'text-red';
               }
               if (this.historyDetails[i].orderid != null) {
                 var transactionId = this.historyDetails[i].orderid;
               } else {
                 var transactionId = this.historyDetails[i].transactionId;
               }
 
               if (action == 'Buyoffer') {
                 var action: any = 'Buy Offer';
               }
               if (action == 'Selloffer') {
                 var action: any = 'Sell Offer';
               }
 
               
 
               this.historyTableTr += '<tr>';
               this.historyTableTr += '<td style="padding: 10px 0;border-bottom: 1px solid #ddd;">' + timestamp + '</td>';
               this.historyTableTr += '<td style="padding: 10px 0;border-bottom: 1px solid #ddd;">' + transactionId + '</td>';
               if(action =='Buy'||action =='Sell'){
                 this.historyTableTr += '<td style="padding: 10px 0;border-bottom: 1px solid #ddd;" class="text-white">' + action +'<input style="background-color:#00b75a; color:#fff; border-radius:5px;padding:5px 10px;margin:0 25px" type="button" class="actiontoggle gift-js-open-modal" data-txnid="'+this.historyDetails[i].transactionId+'" value="Invoice"></td>';
               }
               else{
                 this.historyTableTr += '<td style="padding: 10px 0;border-bottom: 1px solid #ddd;" class="text-white">' + action +'</td>';
               }
               this.historyTableTr += '<td style="padding: 10px 0;border-bottom: 1px solid #ddd;">' + amount + '</td>';
               this.historyTableTr += '<td style="padding: 10px 0;border-bottom: 1px solid #ddd;" class="' + statusClass + '">' + status + '</td>';
               this.historyTableTr += '</tr>';
              
             }
           } else {
             this.historyTableTr += '<tr><td colspan="5" class="text-center">No Data Exist</td></tr>';
           }
          // $('.historyTableBody').html(this.historyTableTr);
           this.pgn = [];
           for (i = 1; i <= Math.ceil(this.totalCount / 20); i++) {
             this.pgn.push(i);
           }
         }
       }, reason => {
         this.data.logout();
         if (reason.error.error == 'invalid_token') {
 
           this.data.alert('Session Timeout. Login Again', 'warning');
         } else this.data.alert('Session Timeout. Login Again', 'danger');
       });
 
   }
 
   /* Method defination for selecting margin type */
   handleSelectMarginType = (param) => {
    this.selectedMarginType = param
    //this.marginTransactionHistory(this.selectedMarginType);
   }

   transactionHistory(pageNo) {
    /*  this.historyTableTr = `<tr>
     <td colspan="5" class="text-center py-3">
     <img src="./assets/svg-loaders/puff.svg" width="50" alt="">
     </td>
   </tr>`; */
    //  $('.historyTableBody').html(this.historyTableTr);
     var historyObj = {};
     this.historyDetailsMod = [];

     historyObj['pageNo'] = pageNo;
     historyObj['noOfItemsPerPage']=20;
     //historyObj['userId'] = localStorage.getItem('user_id');
     historyObj['uuid'] = localStorage.getItem('uuid');

     historyObj['timeSpan'] = this.main.timeSpan;
     historyObj['transactionType']='all';
     var jsonString = JSON.stringify(historyObj);
     this.http.post<any>(this.data.WEBSERVICE + '/transaction/getUserAllTransaction', jsonString, {
       headers: {
         'Content-Type': 'application/json',
         'authorization': 'BEARER ' + localStorage.getItem('access_token'),
       }
     })
       .subscribe(response => {
         this.historyTableTr = '';
         var result = response;
 
         if (result.error.error_data != '0') {
           this.data.alert(result.error.error_msg, 'danger');
         } else {
           this.historyDetails = result.userTransactionsResult;
           this.totalCount = result.totalCount;
           console.log('history data', this.historyDetails);
           
           if (this.historyDetails != null) {
             for (var i = 0; i < this.historyDetails.length; i++) {
               var timestamp = this.historyDetails[i].transactionTimestamp;
               var dt = new Date(this.historyDetails[i].transactionTimestamp);
               var timestampArr = timestamp.split('.');
               timestamp = timestampArr[0];
               var action = this.historyDetails[i].action;
               this.selectedCurrency = localStorage.getItem('selected_currency').toUpperCase();
               this.selectedCurrencyText = this.selectedCurrency;
               if (action == 'Buy') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
               if (action == 'Buyoffer') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
               if (action == 'Sell') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
 
               if (action == 'Buydel') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
 
               if (action == 'Selldel') {
                 if (this.historyDetails[i]['creditAmount'] == 0) {
                   var amount = '<span class="text-white">' + (this.historyDetails[i].currency).toUpperCase() + ' '
                     + this.historyDetails[i]['debitAmount'] + ' Dr. </span> ';
                 }
                 else {
                   var amount = '<span class="text-white">' + (this.historyDetails[i].currency).toUpperCase() + ' '
                     + this.historyDetails[i]['creditAmount'] + ' Cr. </span> ';
                 }
               }
 
               console.log(action);
                if(action == 'Margin'){
                  console.log('In Margin')
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
                }
                if(action == 'Funding'){
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
                }
            
               if (action == 'Rollback' || action == 'rollback' || action == 'RollBack') {
                 if (this.historyDetails[i].baseCurrency != 'usd' && this.historyDetails[i].currency != 'usd') {
                   if ((this.historyDetails[i]['creditAmount']) != 0) {
                     if (this.historyDetails[i].baseCurrency == '' || this.historyDetails[i].baseCurrency == '-' || this.historyDetails[i].baseCurrency==null) {
                       var amount = '<span class="text-white">' + (this.historyDetails[i].currency).toUpperCase() + ' '
                         + this.historyDetails[i]['creditAmount'] + ' Cr. </span> ';
                     }
                   }
               }
             }
              
               if (action == 'Buymodify') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
 
             
               if (action == 'Sellmodify') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
 
               if (action == 'Selloffer') {
                 var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
               }
                var hrefForTxn: any;
               if (action == 'Send' || action == 'Sent') {
                 if (this.historyDetails[i]['debitAmount'] != 0) {
                   var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
                   if (this.historyDetails[i].currencyTxnid != null && this.historyDetails[i].currencyTxnid != 'null') {
                     if ((this.historyDetails[i].currencyTxnid).length >= 10) {
                       hrefForTxn = '<a target="_blank" href="https://blockexplorer.com/tx/' + this.historyDetails[i].currencyTxnid + '">(Check Transaction Block)</a>';
                     }
                   }
                 }
 
               }
               if (action == 'Received' || action == 'Receive') {
                 if (this.historyDetails[i]['creditAmount'] != 0) {
                   var amount =  '<span class="text-white">'+ this.historyDetails[i]['tradeAssetAmount'] +'</span> ';
                   if (this.historyDetails[i].currencyTxnid != null && this.historyDetails[i].currencyTxnid != 'null') {
                     if ((this.historyDetails[i].currencyTxnid).length >= 10) {
                       hrefForTxn = '<a target="_blank" href="https://blockexplorer.com/tx/' + this.historyDetails[i].currencyTxnid + '">(Check Transaction Block)</a>';
                     }
                   }
                 }
 
               }
               if (action == 'Load') {
                 if(this.historyDetails[i].currency =='USD' || this.historyDetails[i].baseCurrency =='USD'){
                   var amount = ' <span class="text-white">' + this.data.CURRENCYICON + ' ' + this.historyDetails[i].creditAmount + ' Cr.</span>';
                 }
                 else if(this.historyDetails[i].currency =='AED' || this.historyDetails[i].baseCurrency =='AED'){
                   var amount = ' <span class="text-white">' + 'د.إ' + ' ' + this.historyDetails[i].creditAmount + ' Cr.</span>';
                 }
                 else{
                   var amount = ' <span class="text-white">' + '₹' + ' ' + this.historyDetails[i].creditAmount + ' Cr.</span>';
                 }
               }
               if (action == 'Withdraw') {
                 if(this.historyDetails[i].currency =='USD' || this.historyDetails[i].baseCurrency =='USD'){
                   var amount = ' <span class="text-white">' + this.data.CURRENCYICON + ' ' + this.historyDetails[i].debitAmount + ' Dr.</span>';
                 }
                 else if(this.historyDetails[i].currency =='AED' || this.historyDetails[i].baseCurrency =='AED'){
                   var amount = ' <span class="text-white">' + 'د.إ' + ' ' + this.historyDetails[i].debitAmount + ' Dr.</span>';
                 }
                 else{
                   var amount = ' <span class="text-white">' + '₹' + ' ' + this.historyDetails[i].debitAmount + ' Dr.</span>';
                 }
               }
               if (action == 'Decline') {
                 var amount = '<span class="text-white">' + (this.historyDetails[i].currency || this.historyDetails[i].baseCurrency) + ' ' + this.historyDetails[i]['creditAmount'] + ' Cr. </span>';
               }
               if (action == 'Send Decline') {
                 var amount = '<span class="text-white">' + (this.historyDetails[i].currency || this.historyDetails[i].baseCurrency) + ' ' + this.historyDetails[i]['debitAmount'] + ' Dr. </span>';
               }
               if (this.historyDetails[i].status == '0') {
                 status = 'Pending';
                 var statusClass = 'text-orange';
               } else if (this.historyDetails[i].status == '1') {
                 status = 'Confirmed';
                 var statusClass = 'text-green';
               } 
               else if (this.historyDetails[i].status == '2') {
                status = 'Declined';
                var statusClass = 'text-red';
              } 
               
               else{
                 status = this.historyDetails[i].action;
                 var statusClass = 'text-red';
               }
               if (this.historyDetails[i].orderid != null) {
                 var transactionId = this.historyDetails[i].orderid;
               } else {
                 var transactionId = this.historyDetails[i].transactionId;
               }
 
               if (action == 'Buyoffer') {
                 var action: any = 'Buy Offer';
               }
               if (action == 'Selloffer') {
                 var action: any = 'Sell Offer';
               }

               this.historyDetailsMod.push(
                {
                  timestamp:timestamp,
                  transactionId:transactionId,
                  tradeAssetAmount:this.historyDetails[i]['tradeAssetAmount'],
                  action:action,
                  status:status,
                  statusClass:statusClass
                }
               )
               
               
              //    this.historyTableTr += '<tr style="background-color: #31313A ; border-top: 2px solid #24262D;">';
              //  this.historyTableTr += '<td style="padding: 10px 10px;">' + timestamp + '</td>';
              //  this.historyTableTr += '<td style="padding: 10px 0;">' + transactionId + '</td>';
              //  if(action =='Buy'||action =='Sell'){
              //    this.historyTableTr += '<td style="padding: 10px 0;" >' + action +'<input style="background-color:#00b75a; color:#fff; border-radius:5px;padding:5px 10px;margin:0 25px" type="button" class="actiontoggle gift-js-open-modal" data-txnid="'+this.historyDetails[i].transactionId+'" value="Invoice"></td>';
              //  }
              //  else{
              //    this.historyTableTr += '<td style="padding: 10px 0;" >' + action +'</td>';
              //  }
              //  this.historyTableTr += '<td style="padding: 10px 0;">' + this.historyDetails[i]['tradeAssetAmount'] + '</td>';
              //  this.historyTableTr += '<td style="padding: 10px 0;" class="' + statusClass + '">' + status + '</td>';
              //  this.historyTableTr += '</tr>';
 
              
 
               
             }
           } else {
             this.historyTableTr += '<tr><td colspan="5" class="text-center">No Data Exist</td></tr>';
           }
          //  $('.historyTableBody').html(this.historyTableTr);

          console.log('new array', this.historyDetailsMod);
          
           
           document.body.classList.remove("overlay")
          this.pgn = [];
          for (i = 1; i <= Math.ceil(this.totalCount / 20); i++) {
            this.pgn.push(i);
          }

          console.log('new pagination comp', this.pgn);
          
         }
       }, reason => {
         this.data.logout();
         if (reason.error.error == 'invalid_token') {
 
           this.data.alert('Session Timeout. Login Again', 'warning');
         } else this.data.alert('Session Timeout. Login Again', 'danger');
       });
 
   }

   getHistoryCompNavHist(){
    var hist = localStorage.getItem('historyNavHist');
    if(hist == null || hist == undefined || hist == ''){
      hist = 'spot'
    }

    this.activeIdString = hist;
   }

   saveHistoryCompNavHist(id){
    localStorage.setItem('historyNavHist',id)

   }
}