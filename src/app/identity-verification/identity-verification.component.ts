import { Component, OnInit, ViewChild } from "@angular/core";
import { BodyService } from "../body.service";
import { HttpClient } from "@angular/common/http";
import { CoreDataService } from "../core-data.service";
import * as $ from "jquery";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { split } from "lodash";
@Component({
  selector: "app-identity-verification",
  templateUrl: "./identity-verification.component.html",
  styleUrls: ["./identity-verification.component.css"],
})
export class IdentityVerificationComponent implements OnInit {
  public theradioI: boolean;
  public theradioB: boolean;
  private usedtlapi: Subscription;
  private kyc2api: Subscription;
  private userupdatedocapi: Subscription;
  public profiilepic: any;
  public addressproof: any;
  public idf: any;
  public idb: any;
  date: any = "";
  month: any = "";
  year: any = "";
  taxNumber: any = "";
  showIframe: boolean;
  JWtoken: string;
  countryApi: Subscription;
  social_no: any;
  profilepicStatus: boolean = false;
  addressStatus: boolean = false;
  Themecolor: string;
  kycSubmitButtonTwo: boolean = false;
  kycSubmitButtonOne: boolean = false;
  docname1: boolean = false;
  docname2: boolean= false;
  ppname: boolean = false;
  adddoc: boolean = false;
  iddocf: boolean = false;
  iddocb: boolean = false;
  tier3Step4Status: boolean = false;
  lastButtonSubmitStatus: boolean;
  profilePhotoStatus: boolean = false;
  bankFileStatusT2: boolean;
  TaxFileStatusT2: boolean;

  @ViewChild('myModal') myModal : any;

  constructor(public main: BodyService, private http: HttpClient, public data:CoreDataService, private modalService: NgbModal, private route: Router) { }

  ngOnInit() {
    document.body.classList.add('overlay')
    this.main.getDashBoardInfo();
    this.getIdentityDetails();
    this.getLoc();
    this.checkAndShowPaymentRenewPopup()

    // this.main.getUserDetails();
    // this.main.indentificationStatustwo = true;
  }

  panCardPic: any;
  aadharCardFront: any;
  aadharCardBack: any;
  bankStatement: any;
  taxStatement: any;
  divshow: boolean = false;
  public preliminaryObjectPayload: object = {};
  contries: any;
  public preliminaryInfoProcessStep: string = "2";
  public preliminaryFormDataPayload: any = new FormData();
  public preliminaryInfoProcessStepForTier3: string = "1";
  public preliminaryFormDataPayloadForTier3: any = new FormData();
  public tier3UserType: any;
  public isTier3PreStageEnable : boolean =  true;

  checkAndShowPaymentRenewPopup(){

    this.http
      .get<any>(this.data.WEBSERVICE + "/home/brokerSubscriptionStatus?brokerId=" + this.data.BROKERID, {
        headers: {
          Authorization: "BEARER " + localStorage.getItem("access_token"),
        },
      })
      .subscribe(

        (result) => {
          if(result.paymentStatus == 2){
            this.modalService.open(this.myModal, { centered: true,backdrop: 'static',
               keyboard: false });
          }
        }
        

      )
  }

  ngDoCheck() {

    this.Themecolor = localStorage.getItem('themecolor');
    if(this.Themecolor == null || this.Themecolor == undefined){
      this.Themecolor = 'Dark';
    }
    this.restrictCopyPaste();
    // //console.log('saved theme', this.Themecolor)
  }
  themeChangedHandler(val){

    // console.log('hello', val);
    

    // if(val == null){
    //   this.Themecolor = 'Dark';
    // }

    this.Themecolor = val;

  }

  handleClickForDetails1 = () => {
    // this.data.loader = true;
    this.http
      .get<any>(this.data.WEBSERVICE + "/home/generateJWToken?uuid=" + localStorage.getItem("uuid"), {
        headers: {
          Authorization: "BEARER " + localStorage.getItem("access_token"),
        },
      })
      .subscribe(
        (result) => {
          this.data.loader = false;
          this.showIframe = true;

          //console.log(result.token)
          /* URL for stagging */
          //this.JWtoken = 'https://staging-kyc.mexdigital.com?token=' + result.token;
          /* URL for production */
          this.JWtoken = "https://kyc.mexdigital.com?token=" + result.token;
          /* 
           if (result.error.error_data != "0") {
             this.data.alert(result.error.error_msg, "dark");
           } else {
             this.data.alert(
               "Identity Verification Documents Submitted",
               "success"
             );
             this.getIdentityDetails();
           } */
        },
        (error) => {
          console.log(error);
          this.data.alert(error.message, "danger");
        }
      );
  };

  handleClickForDetails = () => {
    this.showIframe = true;
  };

  getLoc() {
    this.countryApi = this.http.get<any>("./assets/data/country.json").subscribe((data) => {
      this.contries = data;
    });
  }

  /* Method defination for setting step */
  handleNextStepButton = (process) => {
    console.log(this.preliminaryObjectPayload);
    if (process == "1") {
      let firstName = $("#firstName").val();
      let middleName = $("#middleName").val();
      let lastName = $("#lastName").val();
      if (firstName != "" && lastName != "") {
        this.preliminaryObjectPayload["firstName"] = firstName;
        this.preliminaryObjectPayload["middleName"] = middleName;
        this.preliminaryObjectPayload["lastName"] = lastName;
        console.log(this.preliminaryObjectPayload);
        this.preliminaryInfoProcessStep = "2";
      } else {
        this.data.alert("First name and last name is mandatory", "danger");
      }
    } else if (process == "2") {
      let address = $("#address").val();
      let city = $("#city").val();
      let state = $("#state").val();
      let country = $("#country").val();
      let zip = $("#zip").val();
      if (address != "" && city != "" && state != "" && country != "" && zip != "") {
        this.preliminaryObjectPayload["address"] = address;
        this.preliminaryObjectPayload["city"] = city;
        this.preliminaryObjectPayload["state"] = state;
        this.preliminaryObjectPayload["country"] = country;
        this.preliminaryObjectPayload["zip"] = zip;
        //this.preliminaryObjectPayload["userId"] = localStorage.getItem("user_id");
        this.preliminaryObjectPayload["uuid"] = localStorage.getItem("uuid");
        this.preliminaryObjectPayload["userDocsStatus"] = "0";
        console.log(this.preliminaryObjectPayload);
        this.preliminaryInfoProcessStep = "5";
      } else {
        this.data.alert("All fields are mandatory", "danger");
      }
    } else if (process == '5') {
      let date = $('#datePre').val()
      let month = $('#monthPre').val()
      let year = $('#yearPre').val()
      let ssn = $('#ssnPre').val().replace(/-/g, "")
      if (date != "" && month != "" && year != "" && ssn != "") {
        this.preliminaryObjectPayload["dob"] = month + '-' + date + '-' + year;
        this.preliminaryObjectPayload["ssn"] = ssn;
        this.preliminaryFormDataPayload.append("user", JSON.stringify(this.preliminaryObjectPayload));
        this.preliminaryInfoProcessStep = "3";
      } else {
        this.data.alert("All fields are mandatory", "danger");
      }
    } else if (process == "3") {
      let addressProof = $("#addressProof")[0].files[0];
      console.log(addressProof);
      if (addressProof != undefined && addressProof != "") {
        this.preliminaryFormDataPayload.append("addressProof", addressProof);
        this.preliminaryInfoProcessStep = "4";
      } else {
        this.data.alert("Please provide valid address proof", "danger");
      }
    } else if (process == "4") {
      let idProofFront = $("#idProofFront")[0].files[0];
      let idProofBack = $("#idProofBack")[0].files[0];
      if (idProofFront != undefined && idProofFront != "" && idProofBack != undefined && idProofBack != "") {
        this.preliminaryFormDataPayload.append("idProofFront", idProofFront);
        this.preliminaryFormDataPayload.append("idProofBack", idProofBack);
        console.log("payload data for upload", this.preliminaryFormDataPayload);
        this.lastButtonSubmitStatus = true;
        this.http.post<any>(this.data.WEBSERVICE + "/user/addUserKYCDetails", this.preliminaryFormDataPayload, {
          headers: {
            Authorization: "BEARER " + localStorage.getItem("access_token")
          }
        })
          .subscribe(
            result => {
              this.data.loader = false;
              if (result.error.error_data != "0") {
                this.data.alert(result.error.error_msg, "dark");
                this.lastButtonSubmitStatus = false;
                
              } else {
                this.data.alert(
                  'Identity Details updated successfully',
                  "success"
                );
                // this.lastButtonSubmitStatus = false;

                setTimeout(() => {
                  this.data.reloadPage(this.route.url);
                }, 3000);
              }
            },
            error => {
              this.data.alert('some error', "danger");
            }
          );
      } else {
        this.data.alert("Please provide valid address proof", "danger");
      }
    }
  };

  /* Method defination for handlind tier 3 steps for new user */
  handleTier3Steps = (process) => {
    if(process == '1'){
      this.preliminaryInfoProcessStepForTier3 = '2'
    }else if(process == '2'){
      if($("input[name='type']:checked").val() != undefined){
        this.preliminaryFormDataPayloadForTier3.append('userId',localStorage.getItem("user_id"))
        // this.preliminaryFormDataPayloadForTier3.append('uuid',localStorage.getItem("uuid"))

        this.preliminaryFormDataPayloadForTier3.append('userType',$("input[name='type']:checked").val())
        this.preliminaryInfoProcessStepForTier3 = '3';
      }else{
        this.data.alert('Please select a valid type','danger')
      }
      
    }else if(process == '3'){
      if($("#bankStatementPre")[0].files[0] != undefined){
        this.preliminaryFormDataPayloadForTier3.append('bankStatement',$("#bankStatementPre")[0].files[0])
        this.preliminaryInfoProcessStepForTier3 = '4';
      }else{
        this.data.alert('Please select a valid type','danger')
      }
    }else {
      this.tier3Step4Status = true;
      if( $("#taxIdentificationPre").val() != '' && $("#taxIdentificationPre").val() != undefined && $("#taxStatementPre")[0].files[0] != undefined){
        this.preliminaryFormDataPayloadForTier3.append('tin',$("#taxIdentificationPre").val())
        this.preliminaryFormDataPayloadForTier3.append('taxStatement',$("#taxStatementPre")[0].files[0])
        this.preliminaryFormDataPayloadForTier3.append('uuid',localStorage.getItem("uuid"))

       console.log(this.preliminaryFormDataPayloadForTier3)
        this.http
        .post<any>(this.data.WEBSERVICE + "/user/submitKyc", this.preliminaryFormDataPayloadForTier3, {
          headers: {
            authorization: "BEARER " + localStorage.getItem("access_token"),
          },
        })
        .subscribe((response) => {
          // wip(0);

          this.data.loader = false;
          var result = response;
          if (result.error.error_data != "0") {
            this.data.alert(result.error.error_msg, "danger");
          } else {
            this.data.alert("Identity Verification Documents for Tier 3 Submitted", "success");
            //this.getIdentityDetails();
            // this.main.getUserDetails();
            // this.reset();

            setTimeout(() => {
            this.data.reloadPage(this.route.url);
            }, 3000);
          }
        });
      }else{
        this.data.alert('Please select a valid type','danger')
      }
    }
  }

  /* Method defination to check only number */
  handleOnlyNumber = (e) => {
    let param = e.target.value;
    let reg = "^[0-9]*$";
    console.log(param, param.match(reg));
    if (!param.match(reg)) {
      e.target.value = param.slice(0, -1);
    }
  };
  /* Method defination for validating zipcode */
  handleValidateZipCode = (e) => {
    let country = $("#country").val();
    if (country != "CA") {
      this.handleOnlyNumber(e);
    } else {
    }
  };

  getIdentityDetails() {
    this.data.alert("Loading...", "dark");
    var identityObj = {};

    identityObj["userId"] = localStorage.getItem("user_id");
    identityObj["uuid"] = localStorage.getItem("uuid");
    var jsonString = JSON.stringify(identityObj);
    this.usedtlapi = this.http
      .post<any>(this.data.WEBSERVICE + "/user/GetUserDetails", jsonString, {
        headers: {
          "Content-Type": "application/json",
          authorization: "BEARER " + localStorage.getItem("access_token"),
        },
      })
      .subscribe(
        (response) => {
          this.data.loader = false;
          var result = response;
          if (result.error.error_data) {
            this.data.alert(result.error.error_msg, "danger");
          } else {
            if (result.userResult.profilePic != "" || result.userResult.profilePic != null) {
              this.main.profilePic =
                this.data.WEBSERVICE + "/user/" + localStorage.getItem("user_id") + "/file/" + result.userResult.profilePic + "?access_token=" + localStorage.getItem("access_token");
              this.tier3UserType = result.userResult.userTierType;
              if (result.userResult.userTierType == 3 ) {
                document.getElementById("tiertwo").style.display = "block";
                this.isTier3PreStageEnable = false;
              }else if( result.userResult.userTierType == 2){
                if(result.userResult.userTierDocsStatus == '0'){
                  document.getElementById("tiertwo").style.display = "block";
                  this.isTier3PreStageEnable = false;
                }else{
                  document.getElementById("tiertwo").style.display = "none";
                  this.isTier3PreStageEnable = true;
                }
              } else {
                //todo it will be none
                document.getElementById("tiertwo").style.display = "none";
                this.isTier3PreStageEnable = false;
              }
            } else {
              this.main.profilePic = "./assets/img/default.png";
            }
            if (result.userResult.userType == 1) {
              (<HTMLInputElement>document.getElementById("Itype")).checked = true;
              (<HTMLInputElement>document.getElementById("Btyp")).checked = false;
            } else {
              (<HTMLInputElement>document.getElementById("Btyp")).checked = true;
              (<HTMLInputElement>document.getElementById("Itype")).checked = false;
            }
            // if((result.userResult.tin).search("-")==0){
            //   (<HTMLInputElement>document.getElementById("tinno")).value = result.userResult.tin
            //    }else{
            //     (<HTMLInputElement>document.getElementById("tinno")).value = (result.userResult.tin).split("-")[0];
            //    this.year=(result.userResult.tin).slice((result.userResult.tin).length-4)
            //    this.month=(result.userResult.tin).slice((result.userResult.tin).search("-")+1,(result.userResult.tin).search("-")+3)
            //    this.date=(result.userResult.tin).slice((result.userResult.tin).search("-")+3,(result.userResult.tin).search("-")+5)
            //    }

            (<HTMLInputElement>document.getElementById("tinno")).value = result.userResult.tin;
            this.bankStatement = result.userResult.bankStatement;
            this.taxStatement = result.userResult.taxStatement;

            this.profiilepic = result.userResult.profilePic;
            this.addressproof = result.userResult.addressProofDoc;
            this.idf = result.userResult.idProofFront;
            this.idb = result.userResult.idProofBack;
            if(this.taxStatement == '' || this.taxStatement == null){
              this.preliminaryInfoProcessStepForTier3 = '1';
            }
            else{
              this.preliminaryInfoProcessStepForTier3 = '2';

            }

            if (result.userResult.ssn != "undefined" && result.userResult.ssn != undefined && result.userResult.ssn != null) {
              this.social_no = result.userResult.ssn;
              this.social_no = this.social_no.slice(0,3)+"-"+this.social_no.slice(3,5)+"-"+this.social_no.slice(5);

            }
            let dob = result.userResult.dob;
            if (dob != undefined && dob != null && dob != "undefined") {
              let dobArray = dob.split("-");
              this.month = dobArray[0];
              this.date = dobArray[1];
              this.year = dobArray[2];
            }
            if (result.userResult.profilePic != "" || result.userResult.profilePic != null) {
              this.panCardPic =
                this.data.WEBSERVICE + "/user/" + localStorage.getItem("user_id") + "/file/" + result.userResult.idProofDoc + "?access_token=" + localStorage.getItem("access_token");
            } else {
              this.panCardPic = "./assets/img/file-empty-icon.png";
              this.profilepicStatus = true;
            }
            if (result.userResult.addressProofDoc != "" || result.userResult.addressProofDoc != null) {
              this.aadharCardFront =
                this.data.WEBSERVICE + "/user/" + localStorage.getItem("user_id") + "/file/" + result.userResult.addressProofDoc + "?access_token=" + localStorage.getItem("access_token");
            } else {
              this.aadharCardFront = "./assets/img/file-empty-icon.png";
            }
            if (result.userResult.addressProofDoc2 != "" || result.userResult.addressProofDoc2 != null) {
              this.aadharCardBack =
                this.data.WEBSERVICE + "/user/" + localStorage.getItem("user_id") + "/file/" + result.userResult.addressProofDoc2 + "?access_token=" + localStorage.getItem("access_token");
            } else {
              this.aadharCardBack = "./assets/img/file-empty-icon.png";
              this.addressStatus = true;
            }
             if (result.userResult.taxStatement != null) {
              // document.getElementById("docname1").style.display = "block";
              this.docname1 = true;
            }
            if (result.userResult.bankStatement != null) {
              // document.getElementById("docname2").style.display = "block";
              this.docname2 = true;

            }
            if (result.userResult.profilePic != null) {
              // document.getElementById("ppname").style.display = "block";
              this.ppname = true;

            }
            if (result.userResult.addressProofDoc != null) {
              // document.getElementById("adddoc").style.display = "block"; 
              this.adddoc = true;

            }
            if (result.userResult.idProofFront != null) {
              // document.getElementById("iddocf").style.display = "block";
              this.iddocf = true;

            }
            if (result.userResult.idProofBack != null) {
              // document.getElementById("iddocb").style.display = "block";
              this.iddocb = true;

            }
            {/* if (result.userResult.taxStatement != null) {
              document.getElementById("docname1").style.display = "block";
            }
            if (result.userResult.bankStatement != null) {
              document.getElementById("docname2").style.display = "block";
            }
            if (result.userResult.profilePic != null) {
              document.getElementById("ppname").style.display = "block";
            }
            if (result.userResult.addressProofDoc != null) {
              document.getElementById("adddoc").style.display = "block"; 
            }
            if (result.userResult.idProofFront != null) {
              document.getElementById("iddocf").style.display = "block";
            }
            if (result.userResult.idProofBack != null) {
              document.getElementById("iddocb").style.display = "block";
            } */}
            
            document.body.classList.remove('overlay')
          }
        },
        (error) => {
          this.data.logout();
          this.data.loader = false;
          this.data.alert("Session Timeout. Login Again", "warning");
        }
      );
  }
  radioOn() {
    (<HTMLInputElement>document.getElementById("Btyp")).checked = false;
    (<HTMLInputElement>document.getElementById("Itype")).checked = true;
  }
  radioOff() {
    (<HTMLInputElement>document.getElementById("Btyp")).checked = true;
    (<HTMLInputElement>document.getElementById("Itype")).checked = false;
  }

  tiretwoSubmit() {
    // debugger;
    // if(this.month === "" || this.date === "" || this.year === ""){
    //   this.data.alert("incorrect DOB","dark");
    //   return;
    // }
    this.kycSubmitButtonTwo = true;

    this.data.alert("Loading...", "dark");
    var ft = new FormData();
    var selValue = $("input[type='radio']:checked").val();
    var useId = localStorage.getItem("user_id");

    var timno = $(".tinno").val().toString();

    var file5 = $(".bank_statement_doc")[0].files[0];
    var file6 = $(".tax_statement_pic")[0].files[0];
    if (selValue != undefined && useId != undefined && timno != undefined && file5 != undefined && file6 != undefined && timno != "") {
      ft.append("userType", selValue);
      // ft.append("userId", localStorage.getItem("user_id"));
      ft.append("uuid", localStorage.getItem("uuid"));
      ft.append("tin", timno);
      if ($(".bank_statement_doc")[0].files[0] != undefined) {
        ft.append("bankStatement", $(".bank_statement_doc")[0].files[0]);
      } else {
        ft.append("bankStatement", "");
      }

      if ($(".tax_statement_pic")[0].files[0] != undefined) {
        ft.append("taxStatement", $(".tax_statement_pic")[0].files[0]);
      } else {
        ft.append("taxStatement", "");
      }


      this.kyc2api = this.http
        .post<any>(this.data.WEBSERVICE + "/user/submitKyc", ft, {
          headers: {
            authorization: "BEARER " + localStorage.getItem("access_token"),
          },
        })
        .subscribe((response) => {
          // wip(0);

          this.data.loader = false;
          var result = response;
          if (result.error.error_data != "0") {
          this.kycSubmitButtonTwo = false;

            this.data.alert(result.error.error_msg, "danger");
          } else {
          this.kycSubmitButtonTwo = false;

            this.data.alert("Identity Verification Documents for Tier 3 Submitted", "success");
            $("#file5").val("");
            $("#file6").val("");
            this.TaxFileStatusT2 = false;
            this.bankFileStatusT2 = false;
            this.kycSubmitButtonTwo = false;


            this.getIdentityDetails();
            // this.main.getUserDetails();
            // this.reset();

            // setTimeout(() => {
            // this.data.reloadPage(this.route.url);
            // }, 1500);
          }
        });
    } else {
      this.data.loader = false;
      this.data.alert("Please submit all detail to update", "warning");
    }
  }

  upload(content) {

    /* if (this.month === "" || this.date === "" || this.year === "") {
      setTimeout(() => {
        this.data.alert("Please provide a valid date of birth", "danger");
        return;
      }, 2000);

    }
    else if (this.social_no === "" || this.social_no == undefined) {
      this.data.alert("SSN or PASSPORT Number can not be blank", "danger");
    }
    else if (
      $(".profile_pic")[0].files[0] != undefined ||
      $(".pan_card_pic")[0].files[0] != undefined ||
      $(".aadhar_card_front_side")[0].files[0] != undefined ||
      $(".aadhar_card_back_side")[0].files[0] != undefined ||
      this.date != "" ||
      this.year != "" ||
      this.month != "" ||
      this.social_no != ""
    ) {
      this.modalService.open(content);
    } else {
      this.data.alert("Please submit a detail to update", "warning");
    } */
    this.modalService.open(content);
  }
  uploadDocs() {

    this.kycSubmitButtonOne = true;
    this.profilePhotoStatus = false

    this.data.alert("Loading...", "dark");
    var fd = new FormData();
    fd.append("userId", localStorage.getItem("user_id"));
    fd.append("uuid", localStorage.getItem("uuid"));
    if(this.social_no != undefined || this.social_no != ''){
      fd.append("ssn", this.social_no.replace(/-/g, ""));
    }
    if ($(".profile_pic")[0].files[0] != undefined) {
      fd.append("profile_pic", $(".profile_pic")[0].files[0]);
    } else {
      //fd.append("profile_pic", "");
    }
    console.log($(".pan_card_pic")[0])
    if($(".pan_card_pic")[0] != undefined){
      if ($(".pan_card_pic")[0].files[0] != undefined) {
        fd.append("idProofFront", $(".pan_card_pic")[0].files[0]);
      } else {
        //fd.append("id_proof_doc", "");
      }
    } 
    if($(".aadhar_card_front_side")[0] != undefined){
      if ($(".aadhar_card_front_side")[0].files[0] != undefined) {
        fd.append("idProofBack", $(".aadhar_card_front_side")[0].files[0]);
      } else {
        //fd.append("address_proof_doc", "");
      }
    }
    if($(".aadhar_card_back_side")[0] != undefined){
      if ($(".aadhar_card_back_side")[0].files[0] != undefined) {
        fd.append("addressProof", $(".aadhar_card_back_side")[0].files[0]);
      } else {
        //fd.append("address_proof_doc_2", ""); 
      }
    }
    if(this.month != undefined || this.date != undefined || this.year != undefined){
      fd.append("dob", this.month + "-" + this.date + "-" + this.year);
    }

    // fd["dob"]=this.month+"-"+this.date+"-"+this.year;

    console.log('form data',fd);
    


    this.userupdatedocapi = this.http
      .post<any>(this.data.WEBSERVICE + "/user/UpdateUserDocs", fd, {
        headers: {
          Authorization: "BEARER " + localStorage.getItem("access_token"),
        },
      })
      .subscribe(
        (result) => {
          this.data.loader = false;
          $(".id_file").val("");
          if (result.error.error_data != "0") {
            this.data.alert(result.error.error_msg, "danger");
            this.kycSubmitButtonOne = false;

          } else {
            // this.kycSubmitButtonOne = false;

            this.data.alert("Profile photo uploaded successfully.", "success");
            this.main.getUserDetails();
            //this.getIdentityDetails();
            setTimeout(() => {
              this.data.reloadPage(this.route.url);
            }, 1500);
          }
        },
        (error) => {
          this.data.alert("some error", "danger");
        }
      );
  }

  getSizePp(content) {
    var sz = $("#" + content)[0].files[0];
    this.profilePhotoStatus = true;
    if (sz.type == "image/jpeg" || sz.type == "image/png") {
      if (sz.size > 6000000) {
        this.data.alert("File size should be less than 6MB", "warning");
        $("#" + content).val("");
    this.profilePhotoStatus = false;

      }
    } else {
      this.data.alert("File should be in JPG ,JPEG or PNG . " + sz.type.split("/")[1].toUpperCase() + " is not allowed", "warning");
      $("#" + content).val("");
    this.profilePhotoStatus = false;

    }
  }
  getSize(content) {
    var sz = $("#" + content)[0].files[0];
    if (sz.type == "image/jpeg" || sz.type == "image/png" || sz.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || sz.type == "application/pdf") {
      if (sz.size > 6000000) {
        this.data.alert("File size should be less than 6MB", "warning");
        $("#" + content).val("");
      }
    } else {
      this.data.alert("File should be in JPG ,JPEG, DOC,PNG or PDF . " + sz.type.split("/")[1].toUpperCase() + " is not allowed", "warning");
      $("#" + content).val("");
    }
  }
  getSizeforT2(content) {
    var sz = $("#" + content)[0].files[0];
    if (sz.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || sz.type == "application/pdf") {
      if (sz.size > 6000000) {
        this.data.alert("File size should be less than 6MB", "warning");
        $("#" + content).val("");
      }
    } else {
      this.data.alert("File should be in DOC or PDF. " + sz.type.split("/")[1].toUpperCase() + " is not allowed", "warning");
      $("#" + content).val("");
    }
  }
  getSizeforT2StatusChangeBank(content){
    this.bankFileStatusT2 = true;
    var sz = $("#" + content)[0].files[0];
    if (sz.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || sz.type == "application/pdf") {
      if (sz.size > 6000000) {
        this.data.alert("File size should be less than 6MB", "warning");
        $("#" + content).val("");
        this.bankFileStatusT2 = false;

      }
    } else {
      this.data.alert("File should be in DOC or PDF. " + sz.type.split("/")[1].toUpperCase() + " is not allowed", "warning");
      $("#" + content).val("");
      this.bankFileStatusT2 = false;

    }

  }
  getSizeforT2StatusChangeTax(content){
    this.TaxFileStatusT2 = true;
    var sz = $("#" + content)[0].files[0];
    if (sz.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || sz.type == "application/pdf") {
      if (sz.size > 6000000) {
        this.data.alert("File size should be less than 6MB", "warning");
        $("#" + content).val("");
        this.TaxFileStatusT2 = false;

      }
    } else {
      this.data.alert("File should be in DOC or PDF. " + sz.type.split("/")[1].toUpperCase() + " is not allowed", "warning");
      $("#" + content).val("");
      this.TaxFileStatusT2 = false;

    }

  }
  ngOnDestroy() {
    if (this.usedtlapi != undefined) {
      this.usedtlapi.unsubscribe();
    }
    if (this.kyc2api != undefined) {
      this.kyc2api.unsubscribe();
    }
    if (this.userupdatedocapi != undefined) {
      this.userupdatedocapi.unsubscribe();
    }
  }
  reset() {
    this.year = "";
    this.month = "";
    this.date = "";
    this.taxNumber = "";
    // this.timno="";
    $("#file6").val(null);
    $("#file5").val(null);
    $("#tinno").val(null);
  }

  //   monthvalidation() {
  //     if (this.month < 1 || this.month > 12) {
  //       this.month = "";
  //     } else if (this.month.length < 2) {
  //       this.month = "0" + this.month;
  //     }
  //     this.datevalidation();
  //   }

  //   datevalidation() {
  //     let month = 0,
  //       year = 2000;
  //     if (this.date < 1 || this.date > 31) {
  //       this.date = "";
  //       return;
  //     }
  //     if (this.month != "") {
  //       month = this.month - 1;
  //     }
  //     if (this.year != "") {
  //       year = this.year;
  //     }

  //     if (!this.isValidDate(year, month, this.date)) {
  //       this.date = "";
  //     }
  //      else if (this.date.length < 2) {
  //       this.date = "0" + this.date;
  //     }
  //   }

  //   isValidDate(year, month, day) {
  //     // console.log(month+"-"+day+"-"+year)
  //     var d = new Date(year, month, day);
  //     console.log(d.getFullYear,this.year,d.getMonth,this.month,d.getDate,this.date,"dateCheck")
  //     if (d.getFullYear() == year || d.getMonth() == month || d.getDate() == day) {
  //       console.log("inifdatecheck")
  //       return true;
  //     }else{
  //       console.log("inelsedatecheck")
  //     return false;
  //   }
  // }

  //   yearvalidation() {
  //     const d = new Date();
  //     let year = d.getFullYear();

  //     if (this.year.length < 4) {
  //       this.year = "";
  //     }

  //     if (this.year < 1900 || this.year > year) {
  //       this.year = "";
  //     }

  //     this.datevalidation();
  //   }
  monthvalidation() {
    if (this.month < 1 || this.month > 12) {
      this.month = "";
      this.data.alert("Month can not be more than 12", "danger");
    }
    else if (this.month.length < 2) {
      this.month = "0" + this.month;
    }
    this.datevalidation();
  }


  datevalidation() {
    let month = 0, year = 2000;
    if (this.date < 1 || this.date > 31) {
      this.date = "";
      this.data.alert("Incorrect Date", "danger");
      return;
    }
    if (this.month != "") {
      month = this.month - 1;
    }
    if (this.year != "") {
      year = this.year;
    }

    if (!this.isValidDate(year, month, this.date)) {
      this.date = "";
      this.data.alert("Incorrect Date", "danger");
    }
    else if (this.date.length < 2) {
      this.date = "0" + this.date;
    }


  }

  isValidDate(year, month, day) {
    // console.log(month+"-"+day+"-"+year)
    var d = new Date(year, month, day);
    if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
      return true;
    }
    return false;

  }

  yearvalidation() {
    // debugger;

    const d = new Date();
    let year = d.getFullYear();

    if (this.year.length < 4) {
      this.year = "";
      // this.data.alert("incorrect DOB","dark");
    }

    if (this.year < 1920) {
      this.year = "";
      this.data.alert("Dob should be more than 1920", "danger");
    }
    if (this.year >= year - 17) {

      this.data.alert("Age should be equal or more than 17", "danger");
      this.year = "";
    }

    this.datevalidation();
  }


  addDashes(f)
  {
      var f_val = f;
      f_val = f_val.slice(0,3)+"-"+f_val.slice(3,5)+"-"+f_val.slice(5);

      if(f_val.length == 11){
        this.social_no = f_val
      }
  
      console.log('format',f_val);
      
      console.log('format length',f_val.length);
      
  }

  restrictCopyPaste(){
    $('input.disablecopypaste').bind('copy paste', function (e) {
        e.preventDefault();
     });
  }


}


