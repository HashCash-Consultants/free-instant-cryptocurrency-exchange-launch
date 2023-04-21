import {
  Component,
  OnInit,Input
} from '@angular/core';
import {
  BodyService
} from '../body.service';
import {
  CoreDataService
} from '../core-data.service';
import {
  HttpClient
} from '@angular/common/http';
import * as $ from 'jquery';
import {
  NgbModal,NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { StopLossComponent } from "../stop-loss/stop-loss.component";
import { Subscription } from 'rxjs';
@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Hello, {{name}}!</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) {}
}
@Component({
  selector: 'app-deposit-funds',
  templateUrl: './deposit-funds.component.html',
  styleUrls: ['./deposit-funds.component.css']
})
export class DepositFundsComponent implements OnInit {

  invoiceList: any;
  public transactionid: any;
  public MSID: any;
  public currencyBalance:any;
  public usdbalance:any;
  public balencelist;
  private paymentorder: Subscription;
  private getappsettingApi: Subscription;
  private Invoicelistapi: Subscription;
  private adminbankdtlapi: Subscription;
  public bankname: any;
  public beneficiaryAddress: any;
  public banks = [];
  totalCount;
  orderNo;
  page=1
  noOfItemPerPage = '20';
  CURRENCYNAME;
  depositDisclaimer;
  loadMaxValue;
  loadMinValue;
  invoiceOrderNo;
  invoiceAmount;
  currencyId:any;
  aedbalance:any;
  inrbalance:any;
  eurbalance:any;
  sgdbalance:any;
  CurrencyCode:any;
  currencyValue:any;
  public bankID:any;
  public Bankdetails: any;
  public Baddress: any;
  public maxvalue;
public minvalue;
public maxvalueAed;
public minvalueAed;
public maxvalueInr;
public minvalueInr;
public maxvalueEur;
public minvalueEur;
public maxvalueSgd;
public minvalueSgd;
public bnkcurrency;
bankName;
  routingNo;
  ibanNo;
  accountNo;
  bankUserName;
  bankAddress;
  currentbalence;
  currencyname;
  swiftCode;
  beneficiaryName;
  dep_amount;
  disclaim: boolean;
  password;
  TransactionId;
  fname;
  lname;
  Name;
  email;
  IbanNo;
  ifscCode;
  accountType;
  invoiceOrderNoI="";
  invoiceAmountI="";
  bankNameI="";
  accountNoI="";
  routingNoI="=";
  beneficiaryNameI="";
  swiftCodeI="";
  currencynameI="";
  ibanNoI="";
  ifscCodeI="";
  accountTypeI="";
  displableOrderNo = "";
  displableBankName = "";
  displableAccNo = "";
  displableIbanNo = "";
  displableIfscCode = "";
  displableRoutingNo = "";
  displableBeneficiaryName = "";
  displableSwiftCode = "";
  displableAccountType = "";
  displayableCurrencyCode = "";
  displableBankAddress = "";
  displableBeneficiaryAddress = "";
  pgn = [];
  Themecolor:any;

  constructor(private modalService: NgbModal,private router: Router, private route: ActivatedRoute, public main: BodyService, public data: CoreDataService, private http: HttpClient,private _StopLossComponent:StopLossComponent) {
    this.main.getUserTransaction();
  }
  //fiatBalanceText: string;

 
public environmentSettingListObj;
  ngOnInit() {
    this.Themecolor = localStorage.getItem('themecolor')
    this.paymentOrderList(1);
    this.getAdminBankDetails();
    this.appsettingscall();
    this.currencyBalance =this.main.balencelist;
    this.usdbalance = localStorage.getItem('usdbalance');
    if(this.currencyBalance!=null){
      for(var i=0;i<this.currencyBalance.length;i++){
        if(this.currencyBalance[i].currencyCode=="USD"){
          this.usdbalance=this.currencyBalance[i].closingBalance;
          this.CurrencyCode = this.currencyBalance[i].currencyCode;
        }
        if(this.currencyBalance[i].currencyCode=="AED"){
          this.aedbalance = this.currencyBalance[i].closingBalance;
          this.CurrencyCode = this.currencyBalance[i].currencyCode;
        }
        if(this.currencyBalance[i].currencyCode=="INR"){
          this.inrbalance = this.currencyBalance[i].closingBalance;
          this.CurrencyCode = this.currencyBalance[i].currencyCode;
        }
        if(this.currencyBalance[i].currencyCode=="EUR"){
          this.eurbalance = this.currencyBalance[i].closingBalance;
          this.CurrencyCode = this.currencyBalance[i].currencyCode;
        }
        if(this.currencyBalance[i].currencyCode=="SGD"){
          this.sgdbalance = this.currencyBalance[i].closingBalance;
          this.CurrencyCode = this.currencyBalance[i].currencyCode;
        }
      }
    }

    this.CURRENCYNAME = this.data.CURRENCYNAME;

    var environmentSettingListObj = JSON.parse(localStorage.getItem('environment_settings_list'));
  }
  ngDoCheck(){
    this.Themecolor = localStorage.getItem('themecolor')
  }
  themeChangedHandler(val){

    this.Themecolor = val;

  }

  appsettingscall() {
    var infoObj = {};
    //infoObj['userId'] = localStorage.getItem('user_id');
    infoObj['uuid'] = localStorage.getItem('uuid');
    var jsonString = JSON.stringify(infoObj);
    this.getappsettingApi=this.http.post<any>(this.data.WEBSERVICE + '/user/GetUserAppSettings', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error.error_data != '0') {
        } else {
          var storeDashboardInfo = JSON.stringify(result);
          var environmentSettingsListObj: any = {};
          localStorage.setItem('user_app_settings_list', JSON.stringify(result.userAppSettingsResult));
          for (var i = 0; i < result.settingsList.length; i++) {
            environmentSettingsListObj['' + result.settingsList[i].name + result.settingsList[i].currencyId + ''] = result.settingsList[i];
          }
          environmentSettingsListObj = JSON.stringify(environmentSettingsListObj);
          localStorage.setItem('environment_settings_list', environmentSettingsListObj);
          this.environmentSettingListObj = JSON.parse(localStorage.getItem('environment_settings_list'));
          if(this.environmentSettingListObj["load_max_value1"].currencyId=='1'){
            this.depositDisclaimer = this.environmentSettingListObj["load_max_value1"].description;
            this.loadMaxValue =this.environmentSettingListObj["load_max_value1"].value;
            this.loadMinValue = this.environmentSettingListObj["load_min_value1"].value;

            var Tiretype= localStorage.getItem('UserTiretype');
            
            for (var i = 0; i < result.tierWiseTransactionSettingsList.length; i++) {
              if(result.tierWiseTransactionSettingsList[i].currencyId=='1'&& result.tierWiseTransactionSettingsList[i].tierType==Tiretype){
               this.maxvalue=result.tierWiseTransactionSettingsList[i].dailySendLimit;
               this.minvalue=result.tierWiseTransactionSettingsList[i].minLimit;
              
              }
              if(result.tierWiseTransactionSettingsList[i].currencyId=='28'&& result.tierWiseTransactionSettingsList[i].tierType==Tiretype){
               this.maxvalueAed=result.tierWiseTransactionSettingsList[i].dailySendLimit;
               this.minvalueAed=result.tierWiseTransactionSettingsList[i].minLimit;
              }

              if(result.tierWiseTransactionSettingsList[i].currencyId=='35'&& result.tierWiseTransactionSettingsList[i].tierType==Tiretype){
                this.maxvalueInr=result.tierWiseTransactionSettingsList[i].dailySendLimit;
                this.minvalueInr=result.tierWiseTransactionSettingsList[i].minLimit;
               }
              if(result.tierWiseTransactionSettingsList[i].currencyId=='164'&& result.tierWiseTransactionSettingsList[i].tierType==Tiretype){
                this.maxvalueEur=result.tierWiseTransactionSettingsList[i].dailySendLimit;
                this.minvalueEur=result.tierWiseTransactionSettingsList[i].minLimit;
               }
              if(result.tierWiseTransactionSettingsList[i].currencyId=='165'&& result.tierWiseTransactionSettingsList[i].tierType==Tiretype){
                this.maxvalueSgd=result.tierWiseTransactionSettingsList[i].dailySendLimit;
                this.minvalueSgd=result.tierWiseTransactionSettingsList[i].minLimit;
               }
          
           }
          }
        }
      },error=>{
       // console.log(error)
       if(error.status == '401'){
        this.data.logout();
        this.data.alert('Session Timeout. Login Again', 'warning');
      }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
          // this.data.alert(error.message, 'warning');
      }
    });
  }

  deposit_amount;
  orderNoToShow;

  
  async depositAmount(content) {

    var a = true;
    console.log('blockedddddd', a);

    if(a == true){

      this.data.alert("Loading...", "dark");
      if (this.deposit_amount != undefined || this.bankID=="Select Bank Name") {
        if(this.bankname!=undefined ||this.bankID=="Select Bank Name"){
          if(this.bankname!=""){
        if (this.main.userBankVerificationStatus()) {
          $('.generatePaymentOrderBtn').prop('disabled',true);
        if(this.CurrencyCode=='USD'){
          if (parseFloat(this.deposit_amount) <= parseFloat(this.maxvalue) && parseFloat(this.deposit_amount) >= parseFloat(this.minvalue)) {
           
            var depositObj = {};
            depositObj['sendAmount'] = this.deposit_amount;
            depositObj['currencyId'] = this.currencyId;
            //depositObj['userId'] = localStorage.getItem('user_id');
            depositObj['bankId'] = this.bankID; 
            depositObj['uuid'] = localStorage.getItem('uuid'); 
            var jsonString = JSON.stringify(depositObj);
            this.paymentorder = this.http.post<any>(this.data.WEBSERVICE + '/transaction/createPaymentOrder', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
              }
            })
              .subscribe(response => {
                var result = response;
                $('.generatePaymentOrderBtn').prop('disabled',false);
                if (result.error.error_data != '0') {
                  this.deposit_amount = '';
                  this.data.alert(result.error.error_msg, 'warning');
                } else {
                  this.modalService.open(content, {
                    centered: true
                  });
                  this.deposit_amount = '';
                 
                  if(this.bankname=="Bank of America"){
                 
                    document.getElementById('sft-viz').style.display='block';
                  }
                  else {
                    document.getElementById('sft-viz').style.display='none';
                  }
                  this.paymentOrderList(1);
                  this.main.getUserTransaction();
                  this.getAdminBankDetails();
                  this.orderNoToShow = result.paymentOrdersListResult[0].order_no;
                  this.bankname=this.bankname;
                  
                  
                }
              }, function (reason) {
                $('.generatePaymentOrderBtn').prop('disabled',false);
                if (reason.data.error == 'invalid_token') {
                  this.data.logout();
                } else {
                  this.data.logout();
                  this.data.alert('Session Timeout. Login Again', 'warning');
                }
              });
  
          } else {
            console.log('in here')
            $('.generatePaymentOrderBtn').prop('disabled',false);
            // this.data.alert(this.depositDisclaimer, 'warning');
            this.data.alert('Minimum of $'+this.minvalue+' and $'+this.maxvalue+' can be deposited', 'warning');

          
          }
        }
        else if(this.CurrencyCode=='AED'){
          if (parseFloat(this.deposit_amount) <= parseFloat(this.maxvalueAed) && parseFloat(this.deposit_amount) >= parseFloat(this.minvalueAed)) {
          
            var depositObj = {};
            depositObj['sendAmount'] = this.deposit_amount;
            depositObj['currencyId'] = this.currencyId;
            //depositObj['userId'] = localStorage.getItem('user_id');
            depositObj['bankId'] = this.bankID;
            depositObj['uuid'] = localStorage.getItem('uuid');
            var jsonString = JSON.stringify(depositObj);
            this.paymentorder = this.http.post<any>(this.data.WEBSERVICE + '/transaction/createPaymentOrder', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
              }
            })
              .subscribe(response => {
                var result = response;
                $('.generatePaymentOrderBtn').prop('disabled',false);
                if (result.error.error_data != '0') {
                  this.deposit_amount = '';
                  this.data.alert(result.error.error_msg, 'warning');
                } else {
                  this.modalService.open(content, {
                    centered: true
                  });
                  this.deposit_amount = '';
                  
                  if(this.bankname=="Bank of America"){
                 
                    document.getElementById('sft-viz').style.display='block';
                  }
                  else {
                    document.getElementById('sft-viz').style.display='none';
                  }
                  this.paymentOrderList(1);
                  this.main.getUserTransaction();
                  this.getAdminBankDetails();
                  this.orderNoToShow = result.paymentOrdersListResult[0].order_no;
                  this.bankname=this.bankname;
                  
                }
              }, function (reason) {
                $('.generatePaymentOrderBtn').prop('disabled',false);
                if (reason.data.error == 'invalid_token') {
                  this.data.logout();
                } else {
                  this.data.logout();
                  this.data.alert('Could Not Connect To Server', 'danger');
                }
              });
  
          } else {
            $('.generatePaymentOrderBtn').prop('disabled',false);
            // this.data.alert(this.depositDisclaimer, 'warning');
            this.data.alert('Minimum of $'+this.minvalue+' and $'+this.maxvalue+' can be deposited', 'warning');

            
          }
  
        }
        else if(this.CurrencyCode=='EUR'){
          if (parseFloat(this.deposit_amount) <= parseFloat(this.maxvalueEur) && parseFloat(this.deposit_amount) >= parseFloat(this.minvalueEur)) {
          
            var depositObj = {};
            depositObj['sendAmount'] = this.deposit_amount;
            depositObj['currencyId'] = this.currencyId;
            //depositObj['userId'] = localStorage.getItem('user_id');
            depositObj['bankId'] = this.bankID;
            depositObj['uuid'] = localStorage.getItem('uuid');
            var jsonString = JSON.stringify(depositObj);
            this.paymentorder = this.http.post<any>(this.data.WEBSERVICE + '/transaction/createPaymentOrder', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
              }
            })
              .subscribe(response => {
                var result = response;
                $('.generatePaymentOrderBtn').prop('disabled',false);
                if (result.error.error_data != '0') {
                  this.deposit_amount = '';
                  this.data.alert(result.error.error_msg, 'warning');
                } else {
                  this.modalService.open(content, {
                    centered: true
                  });
                  this.deposit_amount = '';
                  
                  if(this.bankname=="Bank of America"){
                 
                    document.getElementById('sft-viz').style.display='block';
                  }
                  else {
                    document.getElementById('sft-viz').style.display='none';
                  }
                  this.paymentOrderList(1);
                  this.main.getUserTransaction();
                  this.getAdminBankDetails();
                  this.orderNoToShow = result.paymentOrdersListResult[0].order_no;
                  this.bankname=this.bankname;
                  
                }
              }, function (reason) {
                $('.generatePaymentOrderBtn').prop('disabled',false);
                if (reason.data.error == 'invalid_token') {
                  this.data.logout();
                } else {
                  this.data.logout();
                  this.data.alert('Could Not Connect To Server', 'danger');
                }
              });
  
          } else {
            $('.generatePaymentOrderBtn').prop('disabled',false);
            // this.data.alert(this.depositDisclaimer, 'warning');
            this.data.alert('Minimum of $'+this.minvalue+' and $'+this.maxvalue+' can be deposited', 'warning');

            
          }
  
        }
        else if(this.CurrencyCode=='SGD'){
          if (parseFloat(this.deposit_amount) <= parseFloat(this.maxvalueSgd) && parseFloat(this.deposit_amount) >= parseFloat(this.minvalueSgd)) {
          
            var depositObj = {};
            depositObj['sendAmount'] = this.deposit_amount;
            depositObj['currencyId'] = this.currencyId;
            //depositObj['userId'] = localStorage.getItem('user_id');
            depositObj['bankId'] = this.bankID;
            depositObj['uuid'] = localStorage.getItem('uuid');
            var jsonString = JSON.stringify(depositObj);
            this.paymentorder = this.http.post<any>(this.data.WEBSERVICE + '/transaction/createPaymentOrder', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
              }
            })
              .subscribe(response => {
                $('.generatePaymentOrderBtn').prop('disabled',false);
                var result = response;
                if (result.error.error_data != '0') {
                  this.deposit_amount = '';
                  this.data.alert(result.error.error_msg, 'warning');
                } else {
                  this.modalService.open(content, {
                    centered: true
                  });
                  this.deposit_amount = '';
                  
                  if(this.bankname=="Bank of America"){
                 
                    document.getElementById('sft-viz').style.display='block';
                  }
                  else {
                    document.getElementById('sft-viz').style.display='none';
                  }
                  this.paymentOrderList(1);
                  this.main.getUserTransaction();
                  this.getAdminBankDetails();
                  this.orderNoToShow = result.paymentOrdersListResult[0].order_no;
                  this.bankname=this.bankname;
                  
                }
              }, function (reason) {
                $('.generatePaymentOrderBtn').prop('disabled',false);
                if (reason.data.error == 'invalid_token') {
                  this.data.logout();
                } else {
                  this.data.logout();
                  this.data.alert('Could Not Connect To Server', 'danger');
                }
              });
  
          } else {
            $('.generatePaymentOrderBtn').prop('disabled',false);
            // this.data.alert(this.depositDisclaimer, 'warning');
            this.data.alert('Minimum of $'+this.minvalue+' and $'+this.maxvalue+' can be deposited', 'warning');

            
          }
  
        }
        else{
          if (parseFloat(this.deposit_amount) <= parseFloat(this.maxvalueInr) && parseFloat(this.deposit_amount) >= parseFloat(this.minvalueInr)) {
          
            var depositObj = {};
            depositObj['sendAmount'] = this.deposit_amount;
            depositObj['currencyId'] = this.currencyId;
            //depositObj['userId'] = localStorage.getItem('user_id');
            depositObj['bankId'] = this.bankID;
            depositObj['uuid'] = localStorage.getItem('uuid');
            var jsonString = JSON.stringify(depositObj);
            this.paymentorder = this.http.post<any>(this.data.WEBSERVICE + '/transaction/createPaymentOrder', jsonString, {
              headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
              }
            })
              .subscribe(response => {
                $('.generatePaymentOrderBtn').prop('disabled',false);
                var result = response;
                if (result.error.error_data != '0') {
                  this.deposit_amount = '';
                  this.data.alert(result.error.error_msg, 'warning');
                } else {
                 
                  this.modalService.open(content, {
                    centered: true
                  });
                  this.deposit_amount = '';
                  
                  if(this.bankname=="Bank of America"){
                 
                    document.getElementById('sft-viz').style.display='block';
                  }
                  else {
                   
                    document.getElementById('sft-viz').style.display='none';
                  }
                  this.paymentOrderList(1);
                  this.main.getUserTransaction();
                  this.getAdminBankDetails();
                  this.orderNoToShow = result.paymentOrdersListResult[0].order_no;
                  this.bankname=this.bankname;
                
                }
              }, function (reason) {
                $('.generatePaymentOrderBtn').prop('disabled',false);
                if (reason.data.error == 'invalid_token') {
                  this.data.logout();
                } else {
                  this.data.logout();
                  this.data.alert('Session Timeout. Login Again', 'warning');
                }
              });
  
          } else {
            $('.generatePaymentOrderBtn').prop('disabled',false);
            // this.data.alert(this.depositDisclaimer, 'warning');
            this.data.alert('Minimum of $'+this.minvalue+' and $'+this.maxvalue+' can be deposited', 'warning');

            
          }
  
        }
        } else {
          $('#payn').attr('disabled', true);
          this.data.alert('Your Bank info verification is currently pending with us. Deposits can be processed once the verification is completed.', 'warning');
        }
      }
      else{
        this.data.alert('Please select Bank Name', 'warning');
      }
      }
      else{
        this.data.alert('Please select Bank Name', 'warning');
      }
      } else {
        this.data.alert('Please Provide Deposit Amount', 'info');
      }

    }
    // else{

    // }
   

   
  }
claearbankdetails(){
  this.accountNo = "";
  this.routingNo ="";
  this.swiftCode="";
  this.beneficiaryName="";
  this.bankname="";
  this.ibanNo="";
  this.accountType="";
  this.routingNo='';
  this.beneficiaryAddress = '';
  this.Baddress = '';
  this.ifscCode = '';
 
  this.modalService.dismissAll();
 

  
}

  paymentOrderList(pageNo) {
    var paymentOrderObj = {};
    //paymentOrderObj['userId'] = localStorage.getItem('user_id');
    paymentOrderObj['uuid'] = localStorage.getItem('uuid');
    paymentOrderObj['pageNo'] = pageNo.toString();
    paymentOrderObj['noOfItemsPerPage'] = this.noOfItemPerPage;
    var jsonString = JSON.stringify(paymentOrderObj);
   this.Invoicelistapi= this.http.post<any>(this.data.WEBSERVICE + '/transaction/getInvoicesList', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error.error_data != '0') {
        } else {
          var paymentOrdersListResult = result.invoicesListResult;
          var paymentOrderListHtml = '';
          this.totalCount = result.totalCount;
          $('.payment_order_list_body').html('');
          if (paymentOrdersListResult != null) {
            this.invoiceList = paymentOrdersListResult;
            for (var i = 0; i < paymentOrdersListResult.length; i++) {
              var timestamp = paymentOrdersListResult[i].created;
              if (paymentOrdersListResult[i].status == '15') {
                var status = 'Order Received';
                var actionText = 'View Invoice';
                var actionTextColor = 'text-blue';
              }
              if (paymentOrdersListResult[i].status == '16') {
                var status = 'Reference Updated';
                var actionText = 'Update Reference Number';
                var actionTextColor = 'text-yellow';
              }
              if (paymentOrdersListResult[i].status == '17') {
                var status = 'Order Confirm';
                var actionText = 'Order Confirm';
                var actionTextColor = 'text-green';
              }
              this.orderNo = paymentOrdersListResult[i].order_no;
              paymentOrderListHtml += '<tr>';
              paymentOrderListHtml += '<td>' + timestamp + '</td>';
              paymentOrderListHtml += '<td>' + this.orderNo + '</td>';
              paymentOrderListHtml += '<td class="text-white">' + ' ' + (paymentOrdersListResult[i].fiat_amount).toFixed(4) + '</td>';
              paymentOrderListHtml += '<td><span class="text-blue" data-order-id="' + this.orderNo + '" data-invoice-id="' + paymentOrdersListResult[i].invoice_id + '" onclick="angular.element(this).scope().getInvoiceDetails(this)" style="cursor:pointer;">View Invoice</span></td>';
              paymentOrderListHtml += '</tr>';
            }
            this.main.pagination(this.totalCount, this.noOfItemPerPage, 'paymentOrderList');
          } else {
            paymentOrderListHtml += '<tr colspan="5">No Data Exist</tr>';
          }
          this.pgn = [];
          for (i = 1; i <= Math.ceil(this.totalCount / 20); i++) {
            this.pgn.push(i);
          }
          console.log(this.pgn)
        }
      },error=>{
        // console.log(error)
        if(error.status == '401'){
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        }else if(error.status != '200' && error.status != '429' && error.status != '403' ){
            // this.data.alert(error.message, 'warning');
        }
    });
  }

  
  
  getAdminBankDetails() {
    var bankDetailsObj = {};
    bankDetailsObj['userId'] = localStorage.getItem('user_id');
    var jsonString = JSON.stringify(bankDetailsObj);
    this.adminbankdtlapi = this.http.post<any>(this.data.WEBSERVICE + '/user/GetAdminBankDetails', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error != '') {
          this.data.alert('Eroor', 'danger');
        } else {
          var bankdetl = response.adminBankDetails;
          this.Bankdetails = response.adminBankDetails;
          var x = bankdetl.length;
          for (var i = 0; i <= x - 1; i++) {
            this.banks[i] = { 'bankname': bankdetl[i].bankName, "bankId": bankdetl[i].bankId};
          }
        }
      },error=>{
        this.data.logout();
        this.data.alert('Session Timeout. Login Again', 'warning');
    });

  }
  gebankdtl(event) {
   this.claearbankdetails();
    var bankID = event;
    var x = this.Bankdetails.length;
    for (var i = 0; i < x; i++) {
      if (bankID == this.Bankdetails[i].bankId) {
        if(bankID=='1'){
        document.getElementById('swft-no').style.display='none';
        this.accountNo = this.Bankdetails[i].accountNo;
        this.routingNo = this.Bankdetails[i].routingNo;
        this.accountType = this.Bankdetails[i].accountType;
        this.ibanNo = this.Bankdetails[i].ibanNo;
        this.ifscCode = this.Bankdetails[i].ifscCode;
        this.Baddress = this.Bankdetails[i].bankAddress;
        this.bankname=this.Bankdetails[i].bankName;
        this.beneficiaryName=this.Bankdetails[i].beneficiaryName;
        this.beneficiaryAddress=this.Bankdetails[i].beneficiaryAddress;
        this.swiftCode=this.Bankdetails[i].swiftCode;
        this.bankID=this.Bankdetails[i].bankId;
        this.bnkcurrency=this.Bankdetails[i].currencyId;
        
        }
        else{
        document.getElementById('swft-no').style.display='none';
       this.accountNo = this.Bankdetails[i].accountNo;
       this.routingNo = this.Bankdetails[i].routingNo;
       this.accountType = this.Bankdetails[i].accountType;
       this.ibanNo = this.Bankdetails[i].ibanNo;
       this.ifscCode = this.Bankdetails[i].ifscCode;
       this.Baddress = this.Bankdetails[i].bankAddress;
       this.bankname=this.Bankdetails[i].bankName;
       this.beneficiaryName=this.Bankdetails[i].beneficiaryName;
       this.beneficiaryAddress=this.Bankdetails[i].beneficiaryAddress;
       this.bankID=this.Bankdetails[i].bankId;
       this.bnkcurrency=this.Bankdetails[i].currencyId;
        }
      }
      
      else if(bankID=="Select Bank Name"){
        this.bnkcurrency="";
        this.accountType="";
        this.bankname="";
        this.accountNo = "";
        this.accountType="";
        this.routingNo ="";
        this.ibanNo ="";
        this.ifscCode="";
        this.swiftCode="";
        this.beneficiaryName="";
        this.Baddress = "";
      }
    }
  }
  
  invoice(content,id,amount,bankname,accountNo,RoutingNo,bfnm,swiftCode,currencyCode,ibnNo,ifscCode,accountType) {
  
    this.invoiceOrderNoI = id;
    this.invoiceAmountI = amount;
    this.bankNameI=bankname;
    this.accountNoI=accountNo;
    this.routingNoI=RoutingNo;
    this.beneficiaryNameI = bfnm;
    this.swiftCodeI=swiftCode;
    this.currencynameI = currencyCode;
    this.ibanNoI = ibnNo;
    this.ifscCodeI = ifscCode;
    this.accountTypeI = accountType;
   
    this.modalService.open(content, {
      centered: true
    });
    
    if(this.bankNameI=="Bank of America"){
      document.getElementById('swft-noI').style.display='block';
    }
    else{
      document.getElementById('swft-noI').style.display='none';
    }
   
  }


  /**** Method defination to show pament order popup ****/
   
  handleShowPaymentOrder(content,id,amount,bankname,accountNo,RoutingNo,bfnm,swiftCode,currencyCode,ibnNo,ifscCode,accountType,bankAddress,beneficiaryAddress) {
  
    this.displableOrderNo = id;
    this.invoiceAmountI = amount;
    this.displableBankName=bankname;
    this.displableAccNo=accountNo;
    this.displableRoutingNo=RoutingNo;
    this.displableBeneficiaryName = bfnm;
    this.displableSwiftCode=swiftCode;
    this.displayableCurrencyCode = currencyCode;
    this.displableIbanNo = ibnNo;
    this.displableIfscCode = ifscCode;
    this.displableAccountType = accountType;
    this.displableBankAddress = bankAddress;
    this.displableBeneficiaryAddress = beneficiaryAddress;
   
    this.modalService.open(content, {
      centered: true
    });
    
    if(this.displableBankName=="Bank of America"){
      document.getElementById('swft-noI').style.display='block';
    }
    else{
      document.getElementById('swft-noI').style.display='none';
    }
   
  }

  myFunction() {
    var checkBox = document.getElementById("disclaim");
    var text = document.getElementById("text");
    this.TransactionId = localStorage.getItem('user_id') + Date.now();
    var checked = document.forms["uc-cart-checkout-form"]["disclaim"].checked;
    if (checked == true) {
      this.disclaim = true;
    } else {
      this.disclaim = false;
    }
  }

  Opendisclaimer(depodisc, CURRENCYNAME, balence) {
    this.modalService.open(depodisc, {
      centered: true
    });
    this.currencyname = CURRENCYNAME;
    this.currentbalence = balence;
    this.dep_amount = ((<HTMLInputElement>document.getElementById("deposit_amount")).value);
    this.Name = localStorage.getItem('user_name');
    var temp=this.Name.split(" ")
    this.fname=temp[0];
    this.lname=temp[1];
    if(this.lname=="undefined" || this.lname=="")
    this.lname = '';
    this.email = localStorage.getItem('email');
  }

  getDepositModal(md, elem, bal,cId){
    this.CurrencyCode = elem;
    this.currencyValue = bal;
   this.currencyId=cId;
   localStorage.setItem("currencyId",this.currencyId);
   
   for(let i=0;i<this.Bankdetails.length;i++){
     let bank = this.Bankdetails[i];
     console.log(bank)
     if(bank.currencyId == this.currencyId){
      (<HTMLInputElement>document.getElementById("bankNameSelectField")).value = bank.bankId
      this.gebankdtl(bank.bankId);
      this.modalService.open(md, {
        centered: true
      });
      break;
     }
   }
     
 }

 pager(pg){
    
   //this.page = pg;
  this.paymentOrderList(pg);
}
pagerNext(pg){
 
  pg++;
  this.page = pg;
  this.paymentOrderList(pg);
}
pagerPre(pg){
  pg--;
  this.page = pg;
  this.paymentOrderList(pg);
}

  ngOnDestroy() {
    if (this.getappsettingApi != undefined) {
      this.getappsettingApi.unsubscribe();
    }
    if (this.paymentorder != undefined) {
      this.paymentorder.unsubscribe();
    }
    if (this.Invoicelistapi != undefined) {
      this.Invoicelistapi.unsubscribe();
    }
    if (this.Invoicelistapi != undefined) {
      this.Invoicelistapi.unsubscribe();
    }
  }
}