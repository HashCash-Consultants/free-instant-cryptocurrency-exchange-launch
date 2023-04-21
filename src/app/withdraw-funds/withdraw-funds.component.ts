import { Component, OnInit, DoCheck } from "@angular/core";
import { BodyService } from "../body.service";
import { HttpClient } from "@angular/common/http";
import { Subscription, timer } from 'rxjs';
import { CoreDataService } from "../core-data.service";
import { StopLossComponent } from "../stop-loss/stop-loss.component";
import * as $ from "jquery";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-withdraw-funds",
  templateUrl: "./withdraw-funds.component.html",
  styleUrls: ["./withdraw-funds.component.css"]
})
export class WithdrawFundsComponent implements OnInit {
  public currencyBalance: any;
  public usdbalance: any;
  public tranchargeUsd: any;
  public tranchargeAed: any;
  public tranchargeEur: any;
  public tranchargeSgd: any;
  public tranchargeInr: any
  constructor(
    public main: BodyService,
    private http: HttpClient,
    private modalService: NgbModal,
    public data: CoreDataService,
    public _StopLossComponent: StopLossComponent
  ) {
    
  }
  environmentSettingListObj;
  environmentSettingListObj1;
  withdrawMaxValue;
  withdrawMinValue;
  withdrawDisclaimer;
  withdrawTxnChargeDisclaimer;
  currencyId: any;
  CurrencyCode: any;
  aedbalance: any;
  eurbalance: any;
  sgdbalance: any;
  inrbalance: any;
  currencyValue: any;
  isValidAmount : boolean = false
  public maxvalue;
  public minvalue;
  public maxvalueAed;
  public minvalueAed;
  public maxvalueEur;
  public minvalueEur;
  public maxvalueSgd;
  public minvalueSgd;
  public minvalueInr;
  public maxvalueInr;
  public ifsccode;
  public ibanno;
  accountNo;
  beneficiaryName;
  bankName;
  routingNo;
  bankAddress;
  accountType;
  lockOutgoingTransactionStatus;
  withdrawOtp;
  bankid;
  withdrawtradelist
  totalCount;
  page=1
  pgn = [];
  noOfItemPerPage = '20';
  Themecolor:any;
  twoFactorOtp:string='';
  smsOtp:string='';
  emailOtp:string = ''
  messageotp;
  messageotpforsms;
  interval;
  intervalForSms;
  abc: any;
  abcForSms: any;
  isGetCodeButtonDisabled: boolean = false;
  isGetCodeButtonForSmsDisabled: boolean = false;




  ngOnInit() {
    this.Themecolor = localStorage.getItem('themecolor')
    this.main.getUserTransaction();
    this.main.getDashBoardInfo();
    this.getBankDetails();
    this.appsettingscall();
    this.getWithdrawalTradeHistory();
    this.currencyBalance = this.main.balencelist;
    console.log('balance : ',this.currencyBalance,this.main.balencelist)
    if (this.currencyBalance != null) {
      for (var i = 0; i < this.currencyBalance.length; i++) {
        if (this.currencyBalance[i].currencyCode == "USD") {
          this.usdbalance = this.currencyBalance[i].closingBalance;
          this.CurrencyCode = this.currencyBalance[i].currencyCode;
          this.currencyId = this.currencyBalance[i].currencyId;
        }
        if (this.currencyBalance[i].currencyCode == "AED") {
          this.aedbalance = this.currencyBalance[i].closingBalance;
          this.CurrencyCode = this.currencyBalance[i].currencyCode;
          this.currencyId = this.currencyBalance[i].currencyId;
        }
        if (this.currencyBalance[i].currencyCode == "INR") {
          this.inrbalance = this.currencyBalance[i].closingBalance;
          this.CurrencyCode = this.currencyBalance[i].currencyCode;
          this.currencyId = this.currencyBalance[i].currencyId;
        }
        if (this.currencyBalance[i].currencyCode == "EUR") {
          this.eurbalance = this.currencyBalance[i].closingBalance;
          this.CurrencyCode = this.currencyBalance[i].currencyCode;
          this.currencyId = this.currencyBalance[i].currencyId;
        }
        if (this.currencyBalance[i].currencyCode == "SGD") {
          this.sgdbalance = this.currencyBalance[i].closingBalance;
          this.CurrencyCode = this.currencyBalance[i].currencyCode;
          this.currencyId = this.currencyBalance[i].currencyId;
        }
      }
    }

  }
  ngDocheck(){
    this.Themecolor = localStorage.getItem('themecolor')
    /* Checking for fiat */
    let balanceList = this.main.balencelist
    console.log('balanceList',balanceList)
    let arr = [];
    for(let i=0;i<balanceList.length;i++){
      if(balanceList[i].currencyType == '1'){
        arr.push(balanceList[i]);
      }
    }
    this.currencyBalance = arr;
  }

  themeChangedHandler(val){

    this.Themecolor = val;

  }

  getCodeFromEmail() {
    var getotpObj = {};
    getotpObj["email"] = localStorage.getItem("email");
    getotpObj["uuid"] = localStorage.getItem('uuid');

    var jsonString = JSON.stringify(getotpObj);
    this.isGetCodeButtonDisabled = true;
    this.http
        .post<any>(this.data.WEBSERVICE + "/user/ResendOTP/withdraw", jsonString, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .subscribe(
            response => {
                var result = response;
                if (result.error.error_data != '0') {
                    this.data.alert(result.error.error_msg, 'danger');
                    this.isGetCodeButtonDisabled = false;
                } else {
                    
                    var timeleft = this.data.timeIntervalForEmail;
                    this.interval;
                    var s = timer(1000, 1000);
                    this.abc = s.subscribe(val => {
                        this.interval = timeleft - val;
                        
                        this.messageotp = 'Resend in ' + this.interval + ' seconds';
                        this.isGetCodeButtonDisabled = true;
                       

                        if (this.interval == 0 || this.interval < 0) {
                          this.messageotp = ''
                            this.isGetCodeButtonDisabled = false;
                            this.abc.unsubscribe();
                        }
                    });
                }
            },
            reason => {
                this.data.alert('Session Timeout. Login Again', 'warning');
            }
        );
}

validateWithdrawAmount = () => {
  let reg = /^(0|[1-9]\d*)(\.\d+)?(e-?(0|[1-9]\d*))?$/i
  if (this.withdraw_fund_amount.match(reg)) {
    this.isValidAmount = true
  }else{
    this.isValidAmount = false
  }
}

async getCodeFromSmsForExternalWallet(){
  let payload = {
    phone : localStorage.getItem('phone')
  }
  let isOtpSend = await this.data.handleSendOtpInSms(payload, 'withdrawmobileotp');
  if(isOtpSend){

    var timeleft = this.data.timeIntervalForSms;
          this.intervalForSms;
          var s = timer(1000, 1000);
          this.abcForSms = s.subscribe(val => {
            this.intervalForSms = timeleft - val;

            this.messageotpforsms = 'Resend in ' + this.intervalForSms + ' seconds';
            this.isGetCodeButtonForSmsDisabled = true;


            if (this.intervalForSms == 0 || this.intervalForSms < 0) {
              this.messageotpforsms = ''
              this.isGetCodeButtonForSmsDisabled = false;
              this.abcForSms.unsubscribe();
            }
          });
  }
}

  getWithdrawalTradeHistory() {
    var withdrawtradehistoryObj = {};
    // withdrawtradehistoryObj['userId'] = localStorage.getItem('user_id');
    withdrawtradehistoryObj['uuid'] = localStorage.getItem('uuid');
    withdrawtradehistoryObj['pageNo'] = this.page.toString();
    withdrawtradehistoryObj['noOfItemsPerPage'] = this.noOfItemPerPage;
    var jsonString = JSON.stringify(withdrawtradehistoryObj);
    this.http.post<any>(this.data.WEBSERVICE + '/transaction/getWithdrawalDetails', jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        if (result.error.error_data != '0') {
          this.data.alert(result.error.error_msg, "danger");
        } else {
          this.withdrawtradelist = result.withdrawalListResult;
          this.totalCount = result.totalCount
        }
      }
      )
  }


  appsettingscall() {
    var infoObj = {};
    // infoObj['userId'] = localStorage.getItem('user_id');
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
          this.environmentSettingListObj = JSON.parse(localStorage.getItem('environment_settings_list'));
          if (this.environmentSettingListObj["withdrawal_min_value1"].currencyId == '1') {
            this.withdrawDisclaimer = this.environmentSettingListObj["withdrawal_min_value1"].description;
            this.withdrawTxnChargeDisclaimer = this.environmentSettingListObj["withdrawal_txn_charges1"].description;
            this.withdrawMaxValue = this.environmentSettingListObj["withdrawal_max_value1"].value;
            this.withdrawMinValue = this.environmentSettingListObj["withdrawal_min_value1"].value;
            var Tiretype = localStorage.getItem('UserTiretype');
            localStorage.setItem('user_app_settings_list_tire', JSON.stringify(result.tierWiseTransactionSettingsList));
            for (var i = 0; i < result.tierWiseTransactionSettingsList.length; i++) {
              if (result.tierWiseTransactionSettingsList[i].currencyId == '1' && result.tierWiseTransactionSettingsList[i].tierType == Tiretype) {
                this.maxvalue = result.tierWiseTransactionSettingsList[i].dailySendLimit;
                this.minvalue = result.tierWiseTransactionSettingsList[i].minLimit;
                this.tranchargeUsd = result.tierWiseTransactionSettingsList[i].txnCharge;
              }
              if (result.tierWiseTransactionSettingsList[i].currencyId == '28' && result.tierWiseTransactionSettingsList[i].tierType == Tiretype) {
                this.maxvalueAed = result.tierWiseTransactionSettingsList[i].dailySendLimit;
                this.minvalueAed = result.tierWiseTransactionSettingsList[i].minLimit;
                this.tranchargeAed = result.tierWiseTransactionSettingsList[i].txnCharge;
              }

              if (result.tierWiseTransactionSettingsList[i].currencyId == '35' && result.tierWiseTransactionSettingsList[i].tierType == Tiretype) {
                this.maxvalueInr = result.tierWiseTransactionSettingsList[i].dailySendLimit;
                this.minvalueInr = result.tierWiseTransactionSettingsList[i].minLimit;
                this.tranchargeInr = result.tierWiseTransactionSettingsList[i].txnCharge;
              }
              if (result.tierWiseTransactionSettingsList[i].currencyId == '164' && result.tierWiseTransactionSettingsList[i].tierType == Tiretype) {
                this.maxvalueEur = result.tierWiseTransactionSettingsList[i].dailySendLimit;
                this.minvalueEur = result.tierWiseTransactionSettingsList[i].minLimit;
                this.tranchargeEur = result.tierWiseTransactionSettingsList[i].txnCharge;
              }
              if (result.tierWiseTransactionSettingsList[i].currencyId == '165' && result.tierWiseTransactionSettingsList[i].tierType == Tiretype) {
                this.maxvalueSgd = result.tierWiseTransactionSettingsList[i].dailySendLimit;
                this.minvalueSgd = result.tierWiseTransactionSettingsList[i].minLimit;
                this.tranchargeSgd = result.tierWiseTransactionSettingsList[i].txnCharge;
              }
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

  getBankDetails() {

    var bankDetailsObj = {};
    // bankDetailsObj["userId"] = localStorage.getItem("user_id");
    bankDetailsObj["uuid"] = localStorage.getItem("uuid");
    var jsonString = JSON.stringify(bankDetailsObj);
    this.http
      .post<any>(
        this.data.WEBSERVICE + "/user/GetUserBankDetails",
        jsonString,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "BEARER " + localStorage.getItem("access_token")
          }
        }
      )
      .subscribe(
        response => {
          // wip(0);
          var result = response;
          if (result.error.error_data != "0") {
            this.data.alert(result.error.error_msg, "danger");
          } else {
            this.accountNo = result.bankDetails.account_no;
            this.accountType = result.bankDetails.accountType;
            this.beneficiaryName = result.bankDetails.benificiary_name;
            this.bankName = result.bankDetails.bank_name;
            this.bankid = result.bankDetails.bankDetailsId;
            this.routingNo = result.bankDetails.routing_no;
            this.ifsccode = result.bankDetails.ifscCode;
            this.ibanno = result.bankDetails.swiftCode
            this.bankAddress = result.bankDetails.bankAddress;
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
  
  withdraw_fund_amount;
  currencyID = 1;
  handleOpenTwoFactorModal = (template) => {
        let twoFactorAuth = localStorage.getItem('twoFactorAuth');
        let smsAuth = localStorage.getItem('userSmsAuthStatus');

        this.twoFactorOtp = ''
        this.smsOtp = ''
        this.emailOtp = ''
        if(twoFactorAuth == '1' &&  smsAuth == '1'){

            this.modalService.open(template, { centered: true });
        }else{
            this.data.alert('Please turn on Two Factor Authentication and Phone Verification from Settings first', 'danger');
        }
    
}
  
 async withdrawFund() {
    var a = await this.data.checkUserBlockStatus();
    console.log('blocked statussss', a);

    if(a == true){

      $('#loaderimgusd').css({ 'display': 'block' });
    $('.usdbtn-ldr').attr('disabled', true);
    if (
      this.main.userBankVerificationStatus()
    ) {
      if (this.withdraw_fund_amount != undefined) {
        if (this.CurrencyCode == 'USD') {
          if (
            parseFloat(this.withdraw_fund_amount) >=
            parseFloat(this.minvalue) &&
            parseFloat(this.withdraw_fund_amount) <=
            parseFloat(this.maxvalue)
          ) {
            var withdawObj = {};
            //withdawObj["userId"] = localStorage.getItem("user_id");
            withdawObj["uuid"] = localStorage.getItem("uuid");
            withdawObj[
              "currencyId"
            ] = this.currencyId;
            withdawObj["sendAmount"] = this.withdraw_fund_amount;
            withdawObj["userBankId"] = this.bankid;
            /* if (this.lockOutgoingTransactionStatus == 1) {
              withdawObj["otp"] = this.withdrawOtp;
            } */
            withdawObj["otp"] = this.emailOtp;
            withdawObj["securityCode"] = this.twoFactorOtp;
            withdawObj["mobileOtp"] = this.smsOtp;
            var jsonString = JSON.stringify(withdawObj);
            this.http
              .post<any>(
                this.data.WEBSERVICE + "/transaction/createWithdrawalOrder",
                jsonString,
                {
                  headers: {
                    "Content-Type": "application/json",
                    authorization:
                      "BEARER " + localStorage.getItem("access_token")
                  }
                }
              )
              .subscribe(
                response => {
                  $('#loaderimgusd').css({ 'display': 'none' });
                  $('.usdbtn-ldr').attr('disabled', false);
                  // wip(0);
                  var result = response;
                  if (result.error.error_data != "0") {
                    this.data.alert(result.error.error_msg, "dark");
                  } else {
                    this.withdraw_fund_amount = "";
                    this.data.alert("Withdrawal Done Successfully", "success");
                    this.modalService.dismissAll();
                    this.main.getUserTransaction();
                    this.getWithdrawalTradeHistory();
                  }
                },
                function (reason) {
                  if (reason.data.error == "invalid_token") {
                    this.logout();
                  } else {
                    this.data.alert('Session Timeout. Login Again', 'warning');
                  }
                }
              );
          } else {
            this.data.alert("Please Provide Proper Amount", "danger");
          }
        }
        else if (this.CurrencyCode == 'AED') {
          $('#loaderimgaed').css({ 'display': 'block' });
          $('.aedbtn-ldr').attr('disabled', true);
          if (
            parseFloat(this.withdraw_fund_amount) >=
            parseFloat(this.minvalueAed) &&
            parseFloat(this.withdraw_fund_amount) <=
            parseFloat(this.maxvalueAed)
          ) {
            var withdawObj = {};
            //withdawObj["userId"] = localStorage.getItem("user_id");
            withdawObj["uuid"] = localStorage.getItem("uuid");
            withdawObj[
              "currencyId"
            ] = this.currencyId;
            withdawObj["sendAmount"] = this.withdraw_fund_amount;
            withdawObj["userBankId"] = this.bankid;
            /* if (this.lockOutgoingTransactionStatus == 1) {
              withdawObj["otp"] = this.withdrawOtp;
            } */
            withdawObj["otp"] = this.emailOtp;
            withdawObj["securityCode"] = this.twoFactorOtp;
            withdawObj["mobileOtp"] = this.smsOtp;

            var jsonString = JSON.stringify(withdawObj);
            this.http
              .post<any>(
                this.data.WEBSERVICE + "/transaction/createWithdrawalOrder",
                jsonString,
                {
                  headers: {
                    "Content-Type": "application/json",
                    authorization:
                      "BEARER " + localStorage.getItem("access_token")
                  }
                }
              )
              .subscribe(
                response => {
                  $('#loaderimgaed').css({ 'display': 'none' });
                  $('.aedbtn-ldr').attr('disabled', false);
                  var result = response;
                  if (result.error.error_data != "0") {
                    this.data.alert(result.error.error_msg, "dark");
                  } else {
                    this.withdraw_fund_amount = "";

                    this.data.alert("Withdrawal Done Successfully", "success");
                    this.modalService.dismissAll();
                    this.main.getUserTransaction();
                    this.getWithdrawalTradeHistory();

                  }
                },
                function (reason) {
                  // wip(0);
                  if (reason.data.error == "invalid_token") {
                    this.logout();
                  } else {
                    alert("Could Not Connect To Server");
                  }
                }
              );
          } else {
            this.data.alert("Please Provide Proper Amount", "danger");
          }

        }
        else if (this.CurrencyCode == 'EUR') {
          $('#loaderimgeur').css({ 'display': 'block' });
          $('.eurbtn-ldr').attr('disabled', true);
          if (
            parseFloat(this.withdraw_fund_amount) >=
            parseFloat(this.minvalueEur) &&
            parseFloat(this.withdraw_fund_amount) <=
            parseFloat(this.maxvalueEur)
          ) {
            var withdawObj = {};
            //withdawObj["userId"] = localStorage.getItem("user_id");
            withdawObj["uuid"] = localStorage.getItem("uuid");
            withdawObj[
              "currencyId"
            ] = this.currencyId;
            withdawObj["sendAmount"] = this.withdraw_fund_amount;
            withdawObj["userBankId"] = this.bankid;
           /*  if (this.lockOutgoingTransactionStatus == 1) {
              withdawObj["otp"] = this.withdrawOtp;
            } */
            withdawObj["otp"] = this.emailOtp;
            withdawObj["securityCode"] = this.twoFactorOtp;
            withdawObj["mobileOtp"] = this.smsOtp;

            var jsonString = JSON.stringify(withdawObj);
            this.http
              .post<any>(
                this.data.WEBSERVICE + "/transaction/createWithdrawalOrder",
                jsonString,
                {
                  headers: {
                    "Content-Type": "application/json",
                    authorization:
                      "BEARER " + localStorage.getItem("access_token")
                  }
                }
              )
              .subscribe(
                response => {
                  $('#loaderimgeur').css({ 'display': 'none' });
                  $('.eurbtn-ldr').attr('disabled', false);
                  var result = response;
                  if (result.error.error_data != "0") {
                    this.data.alert(result.error.error_msg, "dark");
                  } else {
                    this.withdraw_fund_amount = "";

                    this.data.alert("Withdrawal Done Successfully", "success");
                    this.modalService.dismissAll();
                    this.main.getUserTransaction();
                    this.getWithdrawalTradeHistory();

                  }
                },
                function (reason) {
                  // wip(0);
                  if (reason.data.error == "invalid_token") {
                    this.logout();
                  } else {
                    alert("Could Not Connect To Server");
                  }
                }
              );
          } else {
            this.data.alert("Please Provide Proper Amount", "danger");
          }

        }
        else if (this.CurrencyCode == 'SGD') {
          $('#loaderimgsgd').css({ 'display': 'block' });
          $('.sgdbtn-ldr').attr('disabled', true);
          if (
            parseFloat(this.withdraw_fund_amount) >=
            parseFloat(this.minvalueEur) &&
            parseFloat(this.withdraw_fund_amount) <=
            parseFloat(this.maxvalueEur)
          ) {
            var withdawObj = {};
            //withdawObj["userId"] = localStorage.getItem("user_id");
            withdawObj["uuid"] = localStorage.getItem("uuid");
            withdawObj[
              "currencyId"
            ] = this.currencyId;
            withdawObj["sendAmount"] = this.withdraw_fund_amount;
            withdawObj["userBankId"] = this.bankid;
            /* if (this.lockOutgoingTransactionStatus == 1) {
              withdawObj["otp"] = this.withdrawOtp;
            } */
            withdawObj["otp"] = this.emailOtp;
            withdawObj["securityCode"] = this.twoFactorOtp;
            withdawObj["mobileOtp"] = this.smsOtp;

            var jsonString = JSON.stringify(withdawObj);
            this.http
              .post<any>(
                this.data.WEBSERVICE + "/transaction/createWithdrawalOrder",
                jsonString,
                {
                  headers: {
                    "Content-Type": "application/json",
                    authorization:
                      "BEARER " + localStorage.getItem("access_token")
                  }
                }
              )
              .subscribe(
                response => {
                  $('#loaderimgsgd').css({ 'display': 'none' });
                  $('.sgdbtn-ldr').attr('disabled', false);
                  var result = response;
                  if (result.error.error_data != "0") {
                    this.data.alert(result.error.error_msg, "dark");
                  } else {
                    this.withdraw_fund_amount = "";

                    this.data.alert("Withdrawal Done Successfully", "success");
                    this.modalService.dismissAll();
                    this.main.getUserTransaction();
                    this.getWithdrawalTradeHistory();

                  }
                },
                function (reason) {
                  // wip(0);
                  if (reason.data.error == "invalid_token") {
                    this.logout();
                  } else {
                    alert("Could Not Connect To Server");
                  }
                }
              );
          } else {
            this.data.alert("Please Provide Proper Amount", "danger");
          }

        }

        else {
          $('#loaderimginr').css({ 'display': 'block' });
          $('.inrbtn-ldr').attr('disabled', true);
          if (
            parseFloat(this.withdraw_fund_amount) >=
            parseFloat(this.minvalueInr) &&
            parseFloat(this.withdraw_fund_amount) <=
            parseFloat(this.maxvalueInr)
          ) {
            var withdawObj = {};
            //withdawObj["userId"] = localStorage.getItem("user_id");
            withdawObj["uuid"] = localStorage.getItem("uuid");
            withdawObj[
              "currencyId"
            ] = this.currencyId;
            withdawObj["sendAmount"] = this.withdraw_fund_amount;
            withdawObj["userBankId"] = this.bankid;
           /*  if (this.lockOutgoingTransactionStatus == 1) {
              withdawObj["otp"] = this.withdrawOtp;
            } */
            withdawObj["otp"] = this.emailOtp;
            withdawObj["securityCode"] = this.twoFactorOtp;
            withdawObj["mobileOtp"] = this.smsOtp;

            var jsonString = JSON.stringify(withdawObj);
            // wip(1);
            this.http
              .post<any>(
                this.data.WEBSERVICE + "/transaction/createWithdrawalOrder",
                jsonString,
                {
                  headers: {
                    "Content-Type": "application/json",
                    authorization:
                      "BEARER " + localStorage.getItem("access_token")
                  }
                }
              )
              .subscribe(
                response => {
                  $('#loaderimginr').css({ 'display': 'none' });
                  $('.inrbtn-ldr').attr('disabled', false);
                  var result = response;
                  if (result.error.error_data != "0") {
                    this.data.alert(result.error.error_msg, "dark");
                  } else {
                    this.withdraw_fund_amount = "";

                    this.data.alert("Withdrawal Done Successfully", "success");
                    this.modalService.dismissAll();
                    this.main.getUserTransaction();
                    this.getWithdrawalTradeHistory();

                  }
                },
                function (reason) {
                  // wip(0);
                  if (reason.data.error == "invalid_token") {
                    this.logout();
                  } else {
                    this.data.alert('Session Timeout. Login Again', 'warning');
                  }
                }
              );
          } else {
            this.data.alert("Please Provide Proper Amount", "danger");
          }

        }

      } else {
        this.data.alert("Please Provide Proper Amount", "warning");
      }
    } else {
      $("#wfn").attr("disabled", true);
      this.data.alert("Your Bank info verification is currently pending with us. Withdrawals can be processed once the verification is completed.", "warning");
    }
    }
    
  }


  determineLockStatusForWithdraw(template) {
    var userAppSettingsObj = JSON.parse(
      localStorage.getItem("user_app_settings_list")
    );

    this.lockOutgoingTransactionStatus =
      userAppSettingsObj.lock_outgoing_transactions;
    /* if (this.lockOutgoingTransactionStatus == 1) {
      this.data.alert("You are not eligble to withdraw", "danger");
    } else { */
      var inputval = this.withdraw_fund_amount;
      var appsettingtireOBj = JSON.parse(localStorage.getItem("user_app_settings_list_tire"));
      var Tiretype = localStorage.getItem('UserTiretype');

      for (var i = 0; i < appsettingtireOBj.length; i++) {
        if (this.CurrencyCode == 'USD') {
          if (appsettingtireOBj[i].currencyId == '1' && appsettingtireOBj[i].tierType == Tiretype) {

            this.tranchargeUsd = appsettingtireOBj[i].txnCharge;
            var transactioncharge = (inputval * this.tranchargeUsd) / 100;
            //var totalamout = parseFloat(inputval) + transactioncharge;
            var totalamout = parseFloat(inputval);
            this.usdbalance = localStorage.getItem('usdbalance');
            //var withdrowamt = this.usdbalance - ((this.usdbalance * this.tranchargeUsd)/100);
            var withdrowamt = parseFloat(this.usdbalance);
            if (totalamout >= this.usdbalance) {
              if(withdrowamt<0){
                this.data.alert("Insuffucient Funds", "danger");
              }else{
                this.data.alert("Your maximum available withdrawal amount is $ " + withdrowamt.toFixed(2), "danger");
              }              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }else if(withdrowamt<parseFloat(inputval)){
              this.data.alert("Insuffucient Funds", "danger");
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }else if(withdrowamt < 0){
              this.data.alert("Insuffucient Funds", "danger");
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }
            else {
              this.handleOpenTwoFactorModal(template);
            }
          }
        }
        if (this.CurrencyCode == 'AED') {
          if (appsettingtireOBj[i].currencyId == '28' && appsettingtireOBj[i].tierType == Tiretype) {
            this.tranchargeAed = appsettingtireOBj[i].txnCharge;
            var transactioncharge = (inputval * this.tranchargeAed) / 100;
            //var totalamout = parseFloat(inputval) + transactioncharge;
            var totalamout = parseFloat(inputval) ;
            this.aedbalance = localStorage.getItem('aedbalance');
            //var withdrowamt = this.aedbalance - ((this.aedbalance * this.tranchargeUsd)/100);
            var withdrowamt = parseFloat(this.aedbalance);
            if (totalamout >= this.aedbalance) {
              if(withdrowamt<0){
                this.data.alert("Insuffucient Funds", "danger");
              }else{
                this.data.alert("Your maximum available withdrawal amount is  " + withdrowamt.toFixed(2) +"د.إ ", "danger");
              }
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }else if(withdrowamt<parseFloat(inputval)){
              this.data.alert("Insuffucient Funds", "danger");
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }else if(withdrowamt < 0){
              this.data.alert("Insuffucient Funds", "danger");
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }
            else {
              this.handleOpenTwoFactorModal(template);
            }
          }
        }
        if (this.CurrencyCode == 'SGD') {
          if (appsettingtireOBj[i].currencyId == '28' && appsettingtireOBj[i].tierType == Tiretype) {
            this.tranchargeSgd = appsettingtireOBj[i].txnCharge;
            var transactioncharge = (inputval * this.tranchargeSgd) / 100;
            //var totalamout = parseFloat(inputval) + transactioncharge;
            var totalamout = parseFloat(inputval);
            this.sgdbalance = localStorage.getItem('sgdbalance');
            //var withdrowamt = this.sgdbalance - ((this.sgdbalance * this.tranchargeUsd)/100);
            var withdrowamt = parseFloat(this.sgdbalance);
            if (totalamout >= this.sgdbalance) {
              if(withdrowamt<0){
                this.data.alert("Insuffucient Funds", "danger");
              }else{
                this.data.alert("Your maximum available withdrawal amount is SGD " + withdrowamt.toFixed(2), "danger");
              }
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }else if(withdrowamt<parseFloat(inputval)){
              this.data.alert("Insuffucient Funds", "danger");
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }else if(withdrowamt < 0){
              this.data.alert("Insuffucient Funds", "danger");
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }
            else {
              this.handleOpenTwoFactorModal(template);
            }
          }
        }
        if (this.CurrencyCode == 'EUR') {
          if (appsettingtireOBj[i].currencyId == '164' && appsettingtireOBj[i].tierType == Tiretype) {
            this.tranchargeEur = appsettingtireOBj[i].txnCharge;
            var transactioncharge = (inputval * this.tranchargeEur) / 100;
            //var totalamout = parseFloat(inputval) + transactioncharge;
            var totalamout = parseFloat(inputval) ;
            this.eurbalance = localStorage.getItem('eurbalance');
            //var withdrowamt = this.eurbalance - ((this.eurbalance * this.tranchargeUsd)/100);
            var withdrowamt = parseFloat(this.eurbalance);
            if (totalamout >= this.eurbalance) {
              if(withdrowamt<0){
                this.data.alert("Insuffucient Funds", "danger");
              }else{
                this.data.alert("Your maximum available withdrawal amount is €" + withdrowamt.toFixed(2), "danger");
              }
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }else if(withdrowamt<parseFloat(inputval)){
              this.data.alert("Insuffucient Funds", "danger");
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }else if(withdrowamt < 0){
              this.data.alert("Insuffucient Funds", "danger");
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }
            else {
              this.handleOpenTwoFactorModal(template);
            }
          }
        }
        if (this.CurrencyCode == 'INR') {
          if (appsettingtireOBj[i].currencyId == '35' && appsettingtireOBj[i].tierType == Tiretype) {

            this.tranchargeInr = appsettingtireOBj[i].txnCharge;
            var transactioncharge = (inputval * this.tranchargeInr) / 100;
            //var totalamout = parseFloat(inputval) + transactioncharge;
            var totalamout = parseFloat(inputval);
            this.inrbalance = localStorage.getItem('inrbalance');
            //var withdrowamt = this.inrbalance - ((this.inrbalance * this.tranchargeUsd)/100);
            var withdrowamt = parseFloat(this.inrbalance);
            if (totalamout >= this.inrbalance) {
              if(withdrowamt<0){
                this.data.alert("Insuffucient Funds", "danger");
              }else{
                this.data.alert("Your maximum available withdrawal amount is ₹" + withdrowamt.toFixed(2), "danger");
              }
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }else if(withdrowamt<parseFloat(inputval)){
              this.data.alert("Insuffucient Funds", "danger");
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }else if(withdrowamt < 0){
              this.data.alert("Insuffucient Funds", "danger");
              this.modalService.dismissAll();
              this.withdraw_fund_amount = "";
            }
            else {
              this.handleOpenTwoFactorModal(template);
            }
          }
        }
      }
      //  this.withdrawFund();
    //}
  }

  resendOtpForOutgoing() {
    var otpObj = {};
    otpObj["email"] = localStorage.getItem("email");
    otpObj["uuid"] = localStorage.getItem('uuid');

    var jsonString = JSON.stringify(otpObj);
    this.http
      .post<any>(this.data.WEBSERVICE + "/user/ResendOTP/withdraw", jsonString, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .subscribe(
        response => {
          var result = response;
          if (result.error.error_data != "0") {
            this.data.alert(result.error.error_msg, "danger");
          } else {
            $(".send_btn").show();
            $(".get_Otp_btn").hide();
          }
        },
        reason => {
          this.data.logout();
          //   wip(0);
          this.data.alert('Session Timeout. Login Again', 'warning');
          // this.data.alert("Could Not Connect To Server", "danger");
        }
      );
  }

  getWithdrawModal(md, elem, bal, cId) {
    this.currencyId = cId;
    this.CurrencyCode = elem;
    this.currencyValue = bal;
    this.modalService.open(md, {
      centered: true
    });
  }

  pager(pg){
    
    //this.page = pg;
   this.getWithdrawalTradeHistory();
 }
 pagerNext(pg){
  
   pg++;
   this.page = pg;
   this.getWithdrawalTradeHistory();
 }
 pagerPre(pg){
   pg--;
   this.page = pg;
   this.getWithdrawalTradeHistory();
 }
}

