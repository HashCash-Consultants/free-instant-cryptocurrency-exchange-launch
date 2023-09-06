import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  CoreDataService
} from './core-data.service';
// import {
//   TradesComponent
// } from "./trades/trades.component";
import * as $ from 'jquery';
import {
  Router
} from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
//import { OrderBookComponent } from './order-book/order-book.component';

@Injectable({
  providedIn: 'root'
})
export class BodyService {
  cryptoCurrency: any;
  lockOutgoingTransactionStatus: any;
  paybito_phone: string;
  paybito_amount: string;
  paybito_otp: string;
  other_address: string;
  other_amount: string;
  other_otp: string;
  recievingAddress: any = 0;

  selelectedBuyingAssetBalance: any;
  selelectedSellingAssetBalance: any;
  rcvCode: string;
  balance_list: {
    currency: string;
    balance: number;
    send: number;
    receive: number;
  }[];
  CurrencyBalance: {
    currency: string;
    balance: number;
    send: number;
    receive: number;
  }[];
  loader: boolean;
  pgn: any = [];
  trigxBalance: number;
  Themecolor: string;
  historyDetailsMod: any = [];
  phoneCountryCode: any;

  constructor(private http: HttpClient, private data: CoreDataService, private route: Router) {
    //this.orderbk.tradePageSetup();
  }
  //get user transaction
  totalFiatBalance;
  triggerslink: any = 'https://xchain.io/tx/';
  fiatBalanceLabel;
  btcBalance;
  bchBalance;
  hcxBalance;
  iecBalance;
  ethBalance;
  ltcBalance;
  buyPrice;
  btcBalanceInUsd;
  usdBalance;
  eurbalance;
  sgdbalance
  sellPrice;
  buyPriceText;
  sellPriceText;
  fiatBalance;
  fiatBalanceText: string;
  selectedCryptoCurrency;
  selectedCryptoCurrencyBalance;
  triggersBalance;
  bchBalanceInUsd;
  hcxBalanceInUsd;
  iecBalanceInUsd;
  ethBalanceInUsd;
  btcBought;
  btcSold;
  bchBought;
  bchSold;
  hcxBought;
  hcxSold;
  iecBought;
  iecSold;
  ethBought;
  //new etc
  etcBought;
  etcSold;
  etcBalance;
  etcBalanceInUsd;
  //diam
  diamBought;
  diamSold;
  diamBalance;
  diamBalanceInUsd;
  //new bsv balance
  bsvBought;
  bsvSold;
  bsvBalance;
  bsvBalanceInUsd;
  //new currency

  ethSold;
  ltcBought;
  ltcSold;
  noOfItemPerPage = '20';
  timeSpan = 'all';
  balencelist;
  fiatCurrencyList;
  ethBAlance;
  bccBalance;
  xrpBalance;
  aedbalance: any;
  CurrencyId: any;
  usdbalance: any;
  inrbalance: any;
  modalService: any;
  public alertmessage: any;
  shareUrlForFacebook : any;
  shareUrlForWhatsapp : any;
  shareUrlForTwitter : any;
  shareUrlForLinkedIn : any;


  getUserTransaction() {

    var userTransObj = {};
    userTransObj['customerId'] = localStorage.getItem('user_id');
    userTransObj['uuid'] = localStorage.getItem('uuid')
    var jsonString = JSON.stringify(userTransObj);

    this.http.post<any>(this.data.WEBSERVICE + '/transaction/getUserBalance', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token')
      }
    })
      .subscribe(response => {

        var result = response;
        if (result.error.error_data != '0') {
          this.data.alert('Cannot fetch user balance', 'danger');
          console.log('Fetching User balance failed')
        } else {
          this.balencelist = result.userBalanceList;
          if (this.balencelist != null) {
            for (var i = 0; i < this.balencelist.length; i++) {
              if (this.balencelist[i].currencyCode == "USD") {
                this.usdbalance = this.balencelist[i].closingBalance;
                this.CurrencyId = this.balencelist[i].currencyId;
                localStorage.setItem('usdbalance', this.usdbalance);
              }
              if (this.balencelist[i].currencyCode == "SGD") {
                this.sgdbalance = this.balencelist[i].closingBalance;
                this.CurrencyId = this.balencelist[i].currencyId;
                localStorage.setItem('sgdbalance', this.sgdbalance);
              }
              if (this.balencelist[i].currencyCode == "EUR") {
                this.eurbalance = this.balencelist[i].closingBalance;
                this.CurrencyId = this.balencelist[i].currencyId;
                localStorage.setItem('eurbalance', this.eurbalance);
              }
              if (this.balencelist[i].currencyCode == "AED") {
                this.aedbalance = this.balencelist[i].closingBalance;
                this.CurrencyId = this.balencelist[i].currencyId;
                localStorage.setItem('aedbalance', this.aedbalance);
              }
              if (this.balencelist[i].currencyCode == "INR") {
                this.inrbalance = this.balencelist[i].closingBalance;
                this.CurrencyId = this.balencelist[i].currencyId;
                localStorage.setItem('inrbalance', this.inrbalance);
              }
            }
          }
        }

        this.selectedCryptoCurrency = localStorage.getItem('selected_currency');
        /* Checking for only fiat currency */
        let arr = []
        for (var i = 0; i <= this.balencelist.length - 1; i++) {
          if (this.balencelist[i].currencyType == '1') {
            arr.push(this.balencelist[i]);
          }
        }
        this.fiatCurrencyList = arr;

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

  environmentSettingListObj;
  selectedCurrency;
  buyDisclaimer;
  buyTxnDisclaimer;
  sellDisclaimer;
  sellTxnDisclaimer;
  sendDisclaimer;
  sendMiningDisclaimer;
  public indentificationStatus: any;
  public indentificationStatustwo: any;
  bankDetailStatus;
  public userDocStatus: any;
  public userTierDocsStatus: any;


  getDashBoardInfo() {
    var infoObj = {};
    //infoObj['userId'] = localStorage.getItem('user_id');
    infoObj['uuid'] = localStorage.getItem('uuid');
    var jsonString = JSON.stringify(infoObj);
    this.http.post<any>(this.data.WEBSERVICE + '/user/GetUserAppSettings', jsonString, {
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
          localStorage.setItem('user_app_settings_list_tire', JSON.stringify(result.tierWiseTransactionSettingsList));
          this.environmentSettingListObj = JSON.parse(localStorage.getItem('environment_settings_list'));
          this.userDocStatus = result.userAppSettingsResult.user_docs_status;
          this.userTierDocsStatus = result.userAppSettingsResult.userTierDocsStatus;

          if (result.userAppSettingsResult.user_docs_status == '') {
            if(this.route.url == '/identity-verification'){

              this.indentificationStatus = 'You are in Tier 1 , please submit documents for Tier 2 .';
            this.data.alertm('PLEASE SUBMIT DOCUMENTS, ENSURE THAT ALL DOCUMENTS ARE IN JPG , JPEG, PNG, DOC OR PDF FORMAT. GIF and other formats are not permitted.', 'info');

            }
            else{
              // not showing the alert message for other routes
            }
            
            
          }
          if (result.userAppSettingsResult.user_docs_status == '1') {
            this.indentificationStatus = '  Tier 2 Identity verification documents verified.';
          }
          if (result.userAppSettingsResult.user_docs_status == '0') {
            this.indentificationStatus = ' Tier 2 Identity verification documents submitted.';
          }
          if (result.userAppSettingsResult.user_docs_status == '2') {
            this.indentificationStatus = ' Tier 2 Identity verification documents submitted.';
          }
          if (result.userAppSettingsResult.userTierDocsStatus == '') {
            this.indentificationStatustwo = ' You are already verified for Tier 2.';
          }
          if (result.userAppSettingsResult.userTierDocsStatus == '0') {
            this.indentificationStatustwo = ' Tier 3 Identity verification documents submitted. ';

          }
          if (result.userAppSettingsResult.userTierDocsStatus == '1') {
            this.indentificationStatustwo = '  Tier 3 Identity verification documents verified.';
          }
          if (result.userAppSettingsResult.userTierDocsStatus == '2') {
            this.indentificationStatustwo = ' Tier 3 Identity verification documents declined, please submit again.';
          }
          if (result.userAppSettingsResult.bank_details_status == '') {
            this.bankDetailStatus = 'Bank details not submitted.';
          }
          if (result.userAppSettingsResult.bank_details_status == '0') {
            this.bankDetailStatus = 'Bank details  submitted for Verification.';
          }
          if (result.userAppSettingsResult.bank_details_status == '2') {
            this.bankDetailStatus = ' Bank details verified.';
          }
          if (result.userAppSettingsResult.bank_details_status == '3') {
            this.bankDetailStatus = ' Bank documents declined, please submit again.';

          }
          if (
            localStorage.getItem('check_id_verification_status') &&
            result.userAppSettingsResult.user_docs_status == ''
          ) {
          }
          localStorage.setItem('check_id_verification_status', 'false');
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

  ngDoCheck() {

    // themecolor = localStorage.getItem('themecolor');
    // //console.log('saved theme', themecolor)
  }

  verificationTitle;
  verificationText

  userDocVerificationStatus() {
    var userAppSettingsObj = JSON.parse(localStorage.getItem('user_app_settings_list'));
    var userDocStatus = userAppSettingsObj.user_docs_status;
    if (userDocStatus == '') {
      this.verificationTitle = 'Submit ID Verification';
      this.verificationText = 'Please submit Identity verification documents to access all '+this.data.exchange+'features.';
      this.data.alert(this.verificationText, 'danger');
      this.route.navigateByUrl('/identity-verification');
      return false;
    } else if (userDocStatus == '2') {
      this.verificationTitle = 'Submit ID Verification';
      this.verificationText = 'Your Identity verification documents has been declined in the verification process. Please submit again.';
      this.data.alert(this.verificationText, 'warning');
      this.route.navigateByUrl('/identity-verification');
      return false;
    } else if (userDocStatus == '0') {
      this.verificationTitle = 'Document Verification Pending';
      this.verificationText = 'Your Id proof documents have not yet been verified by us. You will have restricted access to the features of the app until they are approved.';
      this.data.alert(this.verificationText, 'info');
      return false;
    } else {
      return true;
    }
  }

  userBankVerificationStatus() {

    var userAppSettingsObj = JSON.parse(localStorage.getItem('user_app_settings_list'));
    var userBankStatus = userAppSettingsObj.bank_details_status;
    if (userBankStatus == '') {
      this.verificationTitle = 'Submit Payment Method';
      this.verificationText = 'Your Payment details are not yet submitted. Please submit your Payment Details to proceed.';

      return false;
    } else if (userBankStatus == '0') {
      this.verificationTitle = 'Payment Being Verified';
      this.verificationText = 'Your Payment details are being verified. This step will be available after verification.';
      return false;
    } else if (userBankStatus == '3') {
      this.verificationTitle = 'Submit Payment Method';
      this.verificationText = 'Your Payment details have been disapproved. Kindly submit the details again to proceed.';
      return false;
    } else {
      return true;
    }
  }
  paginationBtn;
  pagination(totalCount, noOfItemPerPage, functionName) {
    var paginationButtonCount = parseInt(totalCount) / parseInt(noOfItemPerPage);
    this.paginationBtn = '';
    if (Math.ceil(paginationButtonCount) >= 1) {
      for (var i = 1; i <= paginationButtonCount + 1; i++) {
        this.paginationBtn += '<button type="button" class="btn btn-dark font-xs filter-button" onclick="angular.element(this).scope().' + functionName + '(' + i + ')" >' + i + '</button>';
      }
    } else {
      this.paginationBtn += '';
    }
  }

  totalCount;
  historyDetails;
  historyTableTr;
  selectedCurrencyText;
  status: any;

  transactionHistory(pageNo, themecolor) {
    /*  this.historyTableTr = `<tr>
     <td colspan="5" class="text-center py-3">
     <img src="./assets/svg-loaders/puff.svg" width="50" alt="">
     </td>
   </tr>`; */
    $('.historyTableBody').html(this.historyTableTr);
    var historyObj = {};
    historyObj['pageNo'] = pageNo;
    historyObj['noOfItemsPerPage'] = 20;
    //historyObj['userId'] = localStorage.getItem('user_id');
    historyObj['uuid'] = localStorage.getItem('uuid');
    historyObj['timeSpan'] = this.timeSpan;
    historyObj['transactionType'] = 'all';
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
                var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
              }
              if (action == 'Buyoffer') {
                var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
              }
              if (action == 'Sell') {
                var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
              }

              if (action == 'Buydel') {
                var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
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
              if (action == 'Margin') {
                console.log('In Margin')
                var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
              }
              if (action == 'Funding') {
                var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
              }

              if (action == 'Rollback' || action == 'rollback' || action == 'RollBack') {
                if (this.historyDetails[i].baseCurrency != 'usd' && this.historyDetails[i].currency != 'usd') {
                  if ((this.historyDetails[i]['creditAmount']) != 0) {
                    if (this.historyDetails[i].baseCurrency == '' || this.historyDetails[i].baseCurrency == '-' || this.historyDetails[i].baseCurrency == null) {
                      var amount = '<span class="text-white">' + (this.historyDetails[i].currency).toUpperCase() + ' '
                        + this.historyDetails[i]['creditAmount'] + ' Cr. </span> ';
                    }
                  }
                }
              }

              if (action == 'Buymodify') {
                var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
              }


              if (action == 'Sellmodify') {
                var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
              }

              if (action == 'Selloffer') {
                var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
              }
              var hrefForTxn: any;
              if (action == 'Send' || action == 'Sent') {
                if (this.historyDetails[i]['debitAmount'] != 0) {
                  var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
                  if (this.historyDetails[i].currencyTxnid != null && this.historyDetails[i].currencyTxnid != 'null') {
                    if ((this.historyDetails[i].currencyTxnid).length >= 10) {
                      hrefForTxn = '<a target="_blank" href="https://blockexplorer.com/tx/' + this.historyDetails[i].currencyTxnid + '">(Check Transaction Block)</a>';
                    }
                  }
                }

              }
              if (action == 'Received' || action == 'Receive') {
                if (this.historyDetails[i]['creditAmount'] != 0) {
                  var amount = '<span class="text-white">' + this.historyDetails[i]['tradeAssetAmount'] + '</span> ';
                  if (this.historyDetails[i].currencyTxnid != null && this.historyDetails[i].currencyTxnid != 'null') {
                    if ((this.historyDetails[i].currencyTxnid).length >= 10) {
                      hrefForTxn = '<a target="_blank" href="https://blockexplorer.com/tx/' + this.historyDetails[i].currencyTxnid + '">(Check Transaction Block)</a>';
                    }
                  }
                }

              }
              if (action == 'Load') {
                if (this.historyDetails[i].currency == 'USD' || this.historyDetails[i].baseCurrency == 'USD') {
                  var amount = ' <span class="text-white">' + this.data.CURRENCYICON + ' ' + this.historyDetails[i].creditAmount + ' Cr.</span>';
                }
                else if (this.historyDetails[i].currency == 'AED' || this.historyDetails[i].baseCurrency == 'AED') {
                  var amount = ' <span class="text-white">' + 'د.إ' + ' ' + this.historyDetails[i].creditAmount + ' Cr.</span>';
                }
                else {
                  var amount = ' <span class="text-white">' + '₹' + ' ' + this.historyDetails[i].creditAmount + ' Cr.</span>';
                }
              }
              if (action == 'Withdraw') {
                if (this.historyDetails[i].currency == 'USD' || this.historyDetails[i].baseCurrency == 'USD') {
                  var amount = ' <span class="text-white">' + this.data.CURRENCYICON + ' ' + this.historyDetails[i].debitAmount + ' Dr.</span>';
                }
                else if (this.historyDetails[i].currency == 'AED' || this.historyDetails[i].baseCurrency == 'AED') {
                  var amount = ' <span class="text-white">' + 'د.إ' + ' ' + this.historyDetails[i].debitAmount + ' Dr.</span>';
                }
                else {
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
              } else {
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
                  timestamp: timestamp,
                  transactionId: transactionId,
                  tradeAssetAmount: this.historyDetails[i]['tradeAssetAmount'],
                  action: action,
                  status: status,
                  statusClass: statusClass
                }
              )

              if (themecolor == 'Dark') {

                this.historyTableTr += '<tr style="background-color: #31313A ; border-top: 2px solid #24262D;">';
                this.historyTableTr += '<td style="padding: 10px 10px;">' + timestamp + '</td>';
                this.historyTableTr += '<td style="padding: 10px 0;">' + transactionId + '</td>';
                if (action == 'Buy' || action == 'Sell') {
                  this.historyTableTr += '<td style="padding: 10px 0;" >' + action + '<input style="background-color:#00b75a; color:#fff; border-radius:5px;padding:5px 10px;margin:0 25px" type="button" class="actiontoggle gift-js-open-modal" data-txnid="' + this.historyDetails[i].transactionId + '" value="Invoice"></td>';
                }
                else {
                  this.historyTableTr += '<td style="padding: 10px 0;" >' + action + '</td>';
                }
                this.historyTableTr += '<td style="padding: 10px 0;">' + this.historyDetails[i]['tradeAssetAmount'] + '</td>';
                this.historyTableTr += '<td style="padding: 10px 0;" class="' + statusClass + '">' + status + '</td>';
                this.historyTableTr += '</tr>';

              }
              else {
                this.historyTableTr += '<tr class="text-black" style="background-color: #dedede ; border-top: 2px solid #fff;">';
                this.historyTableTr += '<td style="padding: 10px 10px;">' + timestamp + '</td>';
                this.historyTableTr += '<td style="padding: 10px 0;">' + transactionId + '</td>';
                if (action == 'Buy' || action == 'Sell') {
                  this.historyTableTr += '<td style="padding: 10px 0;" >' + action + '<input style="background-color:#00b75a; color:#fff; border-radius:5px;padding:5px 10px;margin:0 25px" type="button" class="actiontoggle gift-js-open-modal" data-txnid="' + this.historyDetails[i].transactionId + '" value="Invoice"></td>';
                }
                else {
                  this.historyTableTr += '<td style="padding: 10px 0;" >' + action + '</td>';
                }
                this.historyTableTr += '<td style="padding: 10px 0;">' + this.historyDetails[i]['tradeAssetAmount'] + '</td>';
                this.historyTableTr += '<td style="padding: 10px 0;" class="' + statusClass + '">' + status + '</td>';
                this.historyTableTr += '</tr>';
              }


            }
          } else {
            this.historyTableTr += '<tr><td colspan="5" class="text-center">No Data Exist</td></tr>';
          }
          $('.historyTableBody').html(this.historyTableTr);
          document.body.classList.remove("overlay")
          this.pgn = [];
          for (i = 1; i <= Math.ceil(this.totalCount / 20); i++) {
            this.pgn.push(i);
          }
        }
      }, reason => {
        this.data.logout();
        if (reason.error.error == 'invalid_token') {
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        } else this.data.alert('Session Timeout. Login Again', 'danger');
      });

  }


  fullName;
  editName;
  userName;
  address;
  country;
  email;
  editEmail;
  phone;
  profilePic;
  joinDate;
  referralCode;

  getUserDetails() {

    this.loader = true;

    var userObj = {};
    userObj['userId'] = localStorage.getItem('user_id');
    userObj['uuid'] = localStorage.getItem('uuid');
    var jsonString = JSON.stringify(userObj);
    this.http.post<any>(this.data.WEBSERVICE + '/user/GetUserDetails', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error.error_data != '0') {
        } else {
          this.loader = false;
          if (result.userResult.middleName != null) {
            this.fullName = result.userResult.firstName + ' ' + result.userResult.middleName + ' ' + result.userResult.lastName;
          } else {
            this.fullName = result.userResult.firstName + ' ' + result.userResult.lastName;
          }
          this.editName = result.userResult.firstName;
          this.userName = result.userResult.firstName;
          this.address = result.userResult.address;
          this.country = result.userResult.country;
          this.email = result.userResult.email;
          this.editEmail = result.userResult.email;
          this.phone = result.userResult.phone;
          this.phoneCountryCode = result.userResult.countryCode;

          localStorage.setItem('phone',this.phone);
          localStorage.setItem('phoneCountryCode',this.phoneCountryCode);
          
          this.referralCode = result.userResult.referralCode;
          this.shareUrlForFacebook = 'https://paybito.com/refer-earn-broker-app.php?uuid=' + result.userResult.uuid +'&type=web';
          
          this.shareUrlForWhatsapp = this.userName + ' has shared a Referral code '+this.referralCode+' and Membership ID '+result.userResult.brokerId+' with you for signing up to PayBito Exchange. %0a%0aThe Referral code is: '+this.referralCode+' %0aYour Membership ID is: '+result.userResult.brokerId+'%0a%0aUse this Referral code %26 Membership ID when signing up to PayBito and earn free cryptocurrencies to your Wallet.%0aClick https://trade.paybito.com/signup?referal_code='+this.referralCode+'%26broker_id='+result.userResult.brokerId+' to go to PayBito signup page.';

          this.shareUrlForTwitter = 'The Referral code is: '+this.referralCode+'. Your Membership ID is: '+result.userResult.brokerId+'. Use this Referral code & Membership ID when signing up to PayBito and earn free cryptocurrencies to your Wallet. Click https://trade.paybito.com/signup?referal_code='+this.referralCode+'&broker_id='+result.userResult.brokerId+' to go to PayBito signup page.'

          let link = encodeURIComponent(this.shareUrlForFacebook)
          console.log('linked in',link)
          this.shareUrlForLinkedIn = 'https://www.linkedin.com/sharing/share-offsite/?url='+link;

          if (localStorage.getItem('profile_pic') != '') {
            this.profilePic = this.data.WEBSERVICE + '/user/' + localStorage.getItem('user_id') + '/file/' + result.userResult.profilePic + '?access_token=' + localStorage.getItem('access_token');
          } else {
            this.profilePic = './assets/img/default.png';
          }
          this.joinDate = this.data.readable_timestamp(result.userResult.created);
          this.CurrencyBalance = result.userBalanceList;
          this.data.handleMetaTagForFacebook('og:url', 'https://trade.paybito.com/signup')
          //this.data.handleMetaTagForFacebook('og:image', 'https://www.paybito.com/wp-content/uploads/2020/11/refer-earn-bg.jpg')
          this.data.handleMetaTagForFacebook('og:title', this.userName + ' has shared a Referral code with you for signing up to PayBito Exchange.')
          this.data.handleMetaTagForFacebook('og:description', 'The Referral code is: '+this.referralCode+'.Your Membership ID is: '+result.userResult.brokerId+'.Use this Referral code when signing up to PayBito and earn free cryptocurrencies to your Wallet.Click here to go to PayBito signup page.When you are logged in, visit the Refer & Earn page from your left hand side menu. You will find your own Referral code there. Refer to your friends using your Referral code. You will continue to earn more cryptocurrencies to your PayBito Wallet.')
          

        }

      }, reason => {
        // console.log('GET USER DETAILS',reason)

        if (reason.name == "HttpErrorResponse") {
          this.data.logout();
          this.data.alert('Session Timeout. Login Again', 'warning');
        } else {
          this.data.alert('Could Not Connect To Server', 'danger');
        }
        setTimeout(() => {
          location.reload();
        }, 1000);

      });
  }

  getCurrencyForSend(elem) {
    this.cryptoCurrency = elem;
    this.selectedCurrency = elem;
    if (this.userDocVerificationStatus() == true) {
      var userAppSettingsObj = JSON.parse(localStorage.getItem('user_app_settings_list'));
      this.lockOutgoingTransactionStatus = userAppSettingsObj.lock_outgoing_transactions;
      if (this.lockOutgoingTransactionStatus == 1) {
        $('.sendOtpSection').show();
        $('.send_btn').show();
      } else {
        $('.sendOtpSection').hide();
        $('.send_btn').show();
      }

      this.paybito_phone = '';
      this.paybito_amount = '';
      this.paybito_otp = '';
      this.other_address = '';
      this.other_amount = '';
      this.other_otp = '';

      $('#sendModal').modal('show');
      this.environmentSettingListObj = JSON.parse(localStorage.getItem('environment_settings_list'));
      this.sendDisclaimer = this.environmentSettingListObj['send_other_min_value'][this.cryptoCurrency + '_description'];
      this.sendMiningDisclaimer = this.environmentSettingListObj['send_other_m_charges'][this.cryptoCurrency + '_description'];
    }

  }
  getCurrencyForRecieve(currency) {
    this.cryptoCurrency = currency;
    $('.receive_address_label, .receive_address, .recieve_qr_code').hide();
    $('.generate_address_btn').hide();
    $('#qr_code').html('');
    if (this.userDocVerificationStatus() == true) {
      this.generateAddress();
    }

  }

  generateAddress() {
    var rcvObj = {};
    rcvObj['customerID'] = localStorage.getItem('user_id');
    rcvObj['crypto_currency'] = this.cryptoCurrency;
    var jsonString = JSON.stringify(rcvObj);
    if (this.cryptoCurrency != 'trigger') {
      this.http.post<any>(this.data.WEBSERVICE + '/userTransaction/ReceiveBTC', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            this.rcvCode = result.customerkeysResult.fromadd;
          }

        });
    } else {
      this.http.post<any>(this.data.WEBSERVICE + '/userTransaction/GetCounterPartyNewAddress', jsonString, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {
          var result = response;
          if (result.error.error_data != '0') {
            this.data.alert(result.error.error_msg, 'danger');
          } else {
            this.rcvCode = result.customerkeysResult.fromadd;
          }

        });

    }

  }

  sessionExpiredLogout() {
    localStorage.clear();
    this.route.navigateByUrl('/login');
    this.data.handlePageReloadForecibily(100)
  }

  invoiceClick() {
    alert('sanu');
  }

}