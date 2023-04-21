import { Component, OnInit } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import { BodyService } from '../body.service';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {
    routing_no: any;
    Themecolor: string;

  constructor(public data:CoreDataService, public main:BodyService, private http:HttpClient, private modalService:NgbModal) { }

  ngOnInit() {
    this.main.getDashBoardInfo();
    this.getBankDetails();
  }
  ngDoCheck() {

    this.Themecolor = localStorage.getItem('themecolor');
    // //console.log('saved theme', this.Themecolor)
    this.restrictCopyPaste()
  }
  themeChangedHandler(val){

    this.Themecolor = val;

  }
  accountNo;
  beneficiaryName;
  bankName;
  routingNo;
  beneficiary_name;
  bank_name;
  account_no;
  IFSC_code;
  bankDetailsForm;
  bankAddress;
  accountType = "";

    //get bank details
  getBankDetails(){
      this.data.alert('Loading...','dark');
        var bankDetailsObj={};
        //bankDetailsObj['userId']=localStorage.getItem('user_id');
        bankDetailsObj['uuid']=localStorage.getItem('uuid');
        var jsonString=JSON.stringify(bankDetailsObj);
        // wip(1);
        this.http.post<any>(this.data.WEBSERVICE+'/user/GetUserBankDetails',jsonString,{headers: {
              'Content-Type': 'application/json',
              'authorization': 'BEARER '+localStorage.getItem('access_token'),
            }})
        .subscribe(response=>{
            this.data.loader = false;
            // wip(0);
            var result=response;
            if(result.error.error_data!='0'){
                 this.data.alert(result.error.error_msg,'error');
            }else{

                this.account_no=result.bankDetails.account_no;
                this.beneficiary_name=result.bankDetails.benificiary_name;
                this.bank_name=result.bankDetails.bank_name;
                this.routing_no=result.bankDetails.routing_no;
                this.accountNo=result.bankDetails.account_no;
                this.beneficiaryName=result.bankDetails.benificiary_name;
                this.bankAddress = result.bankDetails.bankAddress
                this.accountType = result.bankDetails.accountType
                this.bankName=result.bankDetails.bank_name;
                if(result.bankDetails.routing_no !=""){
                    this.routing_no=result.bankDetails.routing_no;
                    $("#bankno").val('ROUTING NO');
                }
                else if(result.bankDetails.swiftCode !=""){
                    this.routing_no=result.bankDetails.swiftCode; 
                    $("#bankno").val('SWIFT CODE');  
                }
                else {
                    this.routing_no=result.bankDetails.ifscCode; 
                    $("#bankno").val('IFSC CODE');  

                }
                      
                
                $('.update_bank_details_btn').hide();
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
    clearfield(){
        this.routing_no="";
    }
  checkBankInputfield(nameField){
      if(nameField=='beneficiary_name'){
          if(this.beneficiaryName!=this.beneficiary_name){
              $('.update_bank_details_btn').show();
          }else{
              $('.update_bank_details_btn').hide();
          }
      }
      if(nameField=='bank_name'){
          if(this.bankName!=this.bank_name){
              $('.update_bank_details_btn').show();
          }else{
              $('.update_bank_details_btn').hide();
          }
      }
      if(nameField=='account_no'){
          if(this.accountNo!=this.account_no){
              $('.update_bank_details_btn').show();
          }else{
              $('.update_bank_details_btn').hide();
          }
      }
      if(nameField=='routing_no'){
          if(this.routingNo!=this.IFSC_code){
              $('.update_bank_details_btn').show();
          }else{
              $('.update_bank_details_btn').hide();
          }
      }
  }

  updateBankDetails(content){
    //  console.log(this.bankAddress,this.accountType)
    if(this.beneficiary_name !='' && this.bank_name !='' && this.account_no  !='' && this.routing_no !='' && this.bankAddress != '' && this.accountType != ''){
      this.modalService.open(content,{centered:true});
    }
    else{
        this.data.alert('All fields are mandatory. Please fill up and submit again','warning');
    }
 }

 yesConfirm(){
    if(this.beneficiary_name !='' && this.bank_name !='' && this.account_no  !='' && this.routing_no !='' && this.bankAddress != '' && this.accountType != ''){
     
        var userId=parseInt(localStorage.getItem('user_id'));
        var bankno=$("#bankno option:selected" ).text();
        var updateBankObj={};
        if(bankno=='ROUTING NO'){
         updateBankObj['routing_no']=this.routing_no;

        }
       else  if(bankno=='IFSC CODE'){
        updateBankObj['ifscCode']=this.routing_no;
       }
       else if(bankno=='IBAN NO'){
        updateBankObj['ibanNo']=this.routing_no;
       }
       else if(bankno=='SWIFT CODE'){
        updateBankObj['swiftCode']=this.routing_no;
       }

        //updateBankObj['userId']=userId;
        updateBankObj['uuid']=localStorage.getItem('uuid');
        updateBankObj['benificiary_name']=this.beneficiary_name;
        updateBankObj['bank_name']=this.bank_name;
        updateBankObj['account_no']=this.account_no;
        updateBankObj['bankAddress']=this.bankAddress;
        updateBankObj['accountType']=this.accountType;
        //TODO: Add swift code
        var jsonString=JSON.stringify(updateBankObj);
        
        this.http.post<any>(this.data.WEBSERVICE+'/user/UpdateUserBankDetails',jsonString,{headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER '+localStorage.getItem('access_token'),
            }})
       .subscribe(response=>{
        // wip(0);
        var result=response;
        if(result.error.error_data!='0'){
             this.data.alert(result.error.error_msg,'dark');
        }else{
            this.data.alert('Bank Details Updated','success');
            this.getBankDetails();
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
        }else{
        this.data.alert('You have not made any changes','warning');
        }
 }

  // Only AlphaNumeric
  keyPressAlphaNumeric(event) {
    console.log('ggg');
    
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9À-ÿ ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  restrictCopyPaste(){
    $('input.disablecopypaste').bind('copy paste', function (e) {
        e.preventDefault();
     });
  }

}
