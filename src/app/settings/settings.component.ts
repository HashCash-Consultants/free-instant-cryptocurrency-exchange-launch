import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { BodyService } from '../body.service';
import { CoreDataService } from '../core-data.service';
import * as $ from 'jquery';
import { NavbarComponent } from '../navbar/navbar.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { not } from '@angular/compiler/src/output/output_ast';
import { element } from '@angular/core/src/render3/instructions';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    match: boolean = false;
    out: boolean = false;
    twofactorauth: any;
    apikey: any;
    secretkey: any;
    apitype: any;
    apitypeForEdit: any;
    apibox: any;
    apikeyid: any;
    keyid: any;
    apikeylist: any;
    searchIDs: any;
    keysearchid: any;
    keyapi: any;
    googelauthcode: any;
    interval;
    abc: any;
    isGetCodeButtonDisabled: boolean = false;
    passwordValidationError: string = ''
    passwordValidationErrorForNewPassword: string = ''
    Themecolor: string;
    twoFactorOtp: string = '';
    twoFactorOtpSpecific: string = '';
    emailOtpSpecific: string = '';
    purposeForGoogleAuthSubmit: string = '';
    editapikeyObj: any;
    deleteapikeyObj: any;
    exist2FaKey: any;
    specificModalStatus: any;
    messageotpSpecific;
    countdownForEmailOtpUsedInSmsAuthModal;
    countdownForEmailOtpUsedInSaveApiModal;
    intervalSpecific;
    intervalForPhoneVerification;
    intervalForNewPhoneVerification;
    abcSpecific: any;
    abcForPhoneVerification: any;
    abcForNewPhoneVerification: any;
    phoneVerificationcountdownmessage: string = '';
    newPhoneVerificationcountdownmessage: string = '';
    isGetCodeButtonDisabledSpecific: boolean = false;
    isGetCodeButtonDisabledForSmsAuth: boolean = false;
    isPhoneAuthEditButtonEnabled: boolean = true;
    isPhoneAuthSendOtpButtonEnabled: boolean = false;
    showConfirmButton: boolean = false;
    isPhoneVerifyTimerOn: boolean = false;
    editablePhone: any = '';
    otpForNewMobileVerify: any = '';
    selectedCountryPhone = '1';
    emailOtpForSms: any = '';
    emailOtpForSaveApi: any = '';
    phoneOtpForSms: any = '';
    phoneOtpForSaveApi: any = '';
    isGetCodeForSmsOtpEnabled: boolean = true;
    isGetCodeForSmsOtpEnabledForSaveApi: boolean = true;
    isGetCodeForSmsOtpEnabledForEditApi: boolean = true;
    intervalMessage: string = ''
    intervalMessageForSaveApi: string = ''
    intervalMessageForEditApi: string = ''
    gaOtpForSms: string = '';
    gaOtpForSaveApi: string = '';
    smsOtpForRegisteredNo: string = '';
    smsOtpForNewNo: string = '';
    isDisableSendOtpButtonForRegisteredPhone: boolean = false;
    isDisableSendOtpButtonForNewPhone: boolean = false;
    ipRestrictStatus: number = 0
    apitypecreate: any
    ipListTemp: any = [];
    ipListConfirm: any = [];
    apiKeyNameForEdit: any;
    apiPublicKeyForEdit: any;
    apiSecretKeyForEdit: any;
    apiKeyIdForEdit: any;
    isReadForEdit: any;
    isDepositForEdit: any;
    isFuturesTradeForEdit: any;
    isWithdrawForEdit: any;
    isOptionsTradeForEdit: any;
    apiKeyDataForEdit: any
    intervalMessageForDeleteApi: string = '';
    isGetCodeForSmsOtpEnabledForDeleteApi: boolean = false
    @ViewChild('smsAuthModalForPhoneChange') smsAuthModalForPhoneChange: any;
    @ViewChild('ipAddressModal') ipAddressModal: any;
    @ViewChild('editApiModal') editApiModal: any;
    @ViewChild('afterEditAuthModal') afterEditAuthModal: any;
    @ViewChild('preDeleteAuthModal') preDeleteAuthModal: any;
    @ViewChild('authCode') authCode: any;

    emailOtpForEdit: string = '';
    phoneOtpForEdit: string = '';
    gaOtpForEdit: string = '';
    emailOtpForDelete: string = '';
    phoneOtpForDelete: string = '';
    gaOtpForDelete: string = '';
    registeredPhone: string = '';
    isEditButtonForApiDisable: boolean = false;
    constructor(private http: HttpClient, private main: BodyService, public data: CoreDataService, private modalService: NgbModal) { }

    settingsObj: any = {

    };

    ngOnInit() {
       
        var authobjkey = {};
        this.main.getDashBoardInfo();
        this.getUserAppSetting();
        this.getApiKeyList();

        setTimeout(() => {

            this.allApiTypeKey();
            
        }, 2000);
        $('.bs-example').hide();
        $(document).on('keyup', '.keyname', function () {
            this.keyapi = $(this).val();
            localStorage.setItem('apikey', this.keyapi);
        });

        $(document).on('keyup', '#orangeForm-passkey', function () {
            this.googelauthcode = $(this).val();
            localStorage.setItem('googleauthcode', this.googelauthcode);
        });
    }

    ngDoCheck() {

        this.Themecolor = localStorage.getItem('themecolor');
        // //console.log('saved theme', this.Themecolor)
    }

    themeChangedHandler(val) {

        this.Themecolor = val;

    }

    openAfterEditAuthModal = () => {
        this.phoneOtpForEdit = '';
        this.modalService.open(this.afterEditAuthModal, { centered: true });

    }
    openAuthModalForDelete = () => {
        this.phoneOtpForDelete = '';
        this.modalService.open(this.preDeleteAuthModal, { centered: true });

    }

    getApiKeyList() {
        var apikeylistObj = {};
        apikeylistObj['userId'] = localStorage.getItem('user_id');
        apikeylistObj['uuid'] = localStorage.getItem('uuid');
        var jsonString = JSON.stringify(apikeylistObj);
        this.http.post<any>(this.data.WEBSERVICE + '/user/getUserWiseApiKeyDetails', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        })
            .subscribe(response => {
                var result = response;
                this.apikeylist = result.apiKeyDetailsList;
                if (result.apiKeyDetailsList == '') {
                    $('.allapikey').hide();
                    $('.listapikey').hide();
                } else {
                    $('.allapikey').show();
                    $('.listapikey').show();
                }
            });
    }

    /* Method defination for showing hidden phone number */
    showHiddenPhonenumber = () => {
        let phone = this.main.phone;
        //console.log(phone)
        let result = '';
        if (phone != undefined && phone != null) {
            for (let i = 0; i < phone.length; i++) {
                if (i > 3 && i <= 8) {
                    result += '*';
                } else {
                    result += phone[i]
                }
            }
        }
        return result;
    }

    getNumber(e) {
        console.log('phone number', e);

    }
    telInputObject(e) {
        console.log('telInputObject', e);

    }

    onCountryChange(e) {
        console.log('countryCode', e);
        this.selectedCountryPhone = e.dialCode
        //this.checkPhone();
        // phoneObj['phone'] = this.selectedCountryPhone + phoneValue;


    }
    checkPhone() {
        if (this.editablePhone != '' && this.editablePhone != undefined) {
            // wip(1);
            var phoneValue = this.selectedCountryPhone + this.editablePhone;
            var phoneObj = {};
            phoneObj['phone'] = this.editablePhone;
            phoneObj['countryCode'] = this.selectedCountryPhone;

            var jsonString = JSON.stringify(phoneObj);

            this.http.post<any>(this.data.WEBSERVICE + '/user/CheckPhone', jsonString, {
                headers: {

                    'Content-Type': 'application/json'
                }
            })
                .subscribe(response => {
                    // wip(0);
                    var result = response;
                    if (result.error.error_data != '0') {
                        this.data.alert(result.error.error_msg, 'danger');
                    } else {
                        if (result.userResult.checkEmailPhoneFlag == 1) {
                            this.data.alert('Phone No. already registered , please try with another phone no.', 'warning');
                            this.editablePhone = this.main.phone;
                        } else {

                        }
                    }
                }, reason => {
                    // wip(0);
                    this.data.alert('Internal Server Error', 'danger')

                });
        } else {
            this.data.alert('Please Provide Phone No.', 'warning')
        }

    }
    handleValidatePhoneNo = () => {
        let reg = /^[0-9]{8,15}$/gm
        this.editablePhone = parseInt(this.editablePhone)
        // console.log(this.editablePhone)
        if (((this.editablePhone).toString()).length > 15) {
            this.editablePhone = parseInt(((this.editablePhone).toString()).slice(0, -1));
        }
        if (isNaN(this.editablePhone)) {
            this.editablePhone = '';
        }
    }

    handleEditableField = () => {
        this.isPhoneAuthEditButtonEnabled = false;
        this.isPhoneAuthSendOtpButtonEnabled = true;
        // let countryCodePlusPhone = this.main.phone;
        //let phone = countryCodePlusPhone.substr(countryCodePlusPhone.length - 10)
        //let countrycode = countryCodePlusPhone.substr(0,(countryCodePlusPhone.length - phone.length))
        //this.selectedCountryPhone = countrycode;
        // console.log(phone)
        // this.editablePhone = phone
    }


    validateApiKeyName = (e) => {
        let reg = /^[A-Za-z\s]{3,40}$/gm
        let value = e.target.value;
        if (!value.match(reg)) {
            this.isEditButtonForApiDisable = true
        } else {
            this.isEditButtonForApiDisable = false

        }
    }


    /* Method defination for calling method for get code while toggling verification popup*/
    async handleSendSmsOtpForSmsAuthVerification() {
        let payload = {
            phone: this.editablePhone,
            uuid: localStorage.getItem('uuid'),
            countryCode: this.selectedCountryPhone
        }
        let isOtpSendToPhone = await this.data.handleSendOtpInSms(payload, 'changephonemobileotp');
        if (isOtpSendToPhone) {
            this.callbackAfterSendingOtpInSms();
        } else {

        }
    }
    async handleSendSmsOtpForSaveApiVerification() {
        this.isGetCodeForSmsOtpEnabledForSaveApi = false;
        let payload = {
            phone: localStorage.getItem('phone'),
            countryCode : localStorage.getItem('phoneCountryCode')

        }
        let isOtpSendToPhone = await this.data.handleSendOtpInSms(payload, 'createapikey');
        if (isOtpSendToPhone) {
            var timeleft = this.data.timeIntervalForSms;
            let interval:any;
            var s = timer(1000, 1000);
            let abc = s.subscribe(val => {
                interval = timeleft - val;
                this.intervalMessageForSaveApi = 'Resend in ' + interval + ' seconds';

                this.isGetCodeForSmsOtpEnabledForSaveApi = false;

                if (interval == 0 || interval < 0) {
                    this.isGetCodeForSmsOtpEnabledForSaveApi = true;
                    this.intervalMessageForSaveApi = ''
                    abc.unsubscribe();
                }
            });
        } else {

        }
    }
    async handleSendSmsOtpForEditApiVerification() {
        let payload = {
            phone: localStorage.getItem('phone'),
            countryCode : localStorage.getItem('phoneCountryCode')

        }
        let isOtpSendToPhone = await this.data.handleSendOtpInSms(payload, 'updateapikey');
        if (isOtpSendToPhone) {
            var timeleft = this.data.timeIntervalForSms;
            this.interval;
            var s = timer(1000, 1000);
            let abc = s.subscribe(val => {
                this.interval = timeleft - val;
                this.intervalMessageForEditApi = 'Resend in ' + this.interval + ' seconds';

                this.isGetCodeForSmsOtpEnabledForEditApi = false;

                if (this.interval == 0 || this.interval < 0) {
                    this.isGetCodeForSmsOtpEnabledForEditApi = true;
                    this.intervalMessageForEditApi = ''
                    abc.unsubscribe();
                }
            });
        } else {

        }
    }
    async handleSendSmsOtpForDeleteApiVerification() {
        let payload = {
            phone: localStorage.getItem('phone'),
            countryCode : localStorage.getItem('phoneCountryCode')

        }
        let isOtpSendToPhone = await this.data.handleSendOtpInSms(payload, 'deleteapikey');
        if (isOtpSendToPhone) {
            var timeleft = this.data.timeIntervalForSms;
            this.interval;
            var s = timer(1000, 1000);
            this.abc = s.subscribe(val => {
                this.interval = timeleft - val;
                this.intervalMessageForDeleteApi = 'Resend in ' + this.interval + ' seconds';

                this.isGetCodeForSmsOtpEnabledForDeleteApi = false;

                if (this.interval == 0 || this.interval < 0) {
                    this.isGetCodeForSmsOtpEnabledForDeleteApi = true;
                    this.intervalMessageForDeleteApi = ''
                    this.abc.unsubscribe();
                }
            });
        } else {

        }
    }

    /* Method defination for get code for phone verify */
    async handleSendOtpForPhoneVerification() {
        if (this.editablePhone != '') {
            let payload = {
                phone: this.editablePhone,
                uuid: localStorage.getItem('uuid'),
                countryCode: this.selectedCountryPhone

            }
            let isOtpSendToPhone = await this.data.handleSendOtpInSms(payload, 'changephonemobileotp');
            if (isOtpSendToPhone) {
                this.isDisableSendOtpButtonForRegisteredPhone = true
                this.isDisableSendOtpButtonForNewPhone = true
                this.smsOtpForRegisteredNo = '';
                this.registeredPhone = localStorage.getItem('phone')
                this.modalService.open(this.smsAuthModalForPhoneChange, { centered: true, backdrop: false, keyboard: false });
                //this.isPhoneAuthSendOtpButtonEnabled = false
                let timeleft = this.data.timeIntervalForSms;
                this.intervalForPhoneVerification;
                var s = timer(1000, 1000);
                this.abcForPhoneVerification = s.subscribe(val => {
                    this.isPhoneVerifyTimerOn = true
                    this.intervalForPhoneVerification = timeleft - val;
                    this.phoneVerificationcountdownmessage = 'Resend in ' + this.intervalForPhoneVerification + ' seconds';
                    if (this.intervalForPhoneVerification == 0 || this.intervalForPhoneVerification < 0) {
                        this.phoneVerificationcountdownmessage = ''
                        // this.isPhoneAuthSendOtpButtonEnabled = false
                        this.isPhoneVerifyTimerOn = false
                        this.abcForPhoneVerification.unsubscribe();
                        this.isDisableSendOtpButtonForRegisteredPhone = false
                        this.isDisableSendOtpButtonForNewPhone = false

                    }
                });
            } else {

            }

        } else {
            this.data.alert('Please provide valid phone number', 'danger');
        }
    }

    async handleSendOtpForNewPhone() {
        let payload = {
            newPhone: this.editablePhone,
            uuid: localStorage.getItem('uuid'),
            countryCode: this.selectedCountryPhone

        }
        let isOtpSendToPhone = await this.data.handleSendOtpInSms(payload, 'changephonemobileotp');
        if (isOtpSendToPhone) {
            this.isDisableSendOtpButtonForNewPhone = true;
            let timeleft = this.data.timeIntervalForSms;
            this.intervalForPhoneVerification;
            var s = timer(1000, 1000);
            /* this.abcForPhoneVerification = s.subscribe(val => {
                this.isPhoneVerifyTimerOn = true
                this.intervalForPhoneVerification = timeleft - val;
                this.phoneVerificationcountdownmessage = 'Resend in ' + this.intervalForPhoneVerification + ' seconds';
                if (this.intervalForPhoneVerification == 0 || this.intervalForPhoneVerification < 0) {
                    this.phoneVerificationcountdownmessage = ''
                    // this.isPhoneAuthSendOtpButtonEnabled = false
                    this.isPhoneVerifyTimerOn = false
                    this.abcForPhoneVerification.unsubscribe();
                    this.isDisableSendOtpButtonForNewPhone = false
                }
            }); */
        } else {

        }
    }

   

    /* function defination for resend new phone otp */
    async resendNewPhoneOtp() {
        let payload = {
            newPhone: this.editablePhone,
            uuid: localStorage.getItem('uuid'),
            countryCode: this.selectedCountryPhone

        }
        let isOtpSendToPhone = await this.data.handleSendOtpInSms(payload, 'changephonemobileotp');
        if (isOtpSendToPhone) {
            this.isDisableSendOtpButtonForNewPhone = true;
            let timeleft = this.data.timeIntervalForSms;
            this.intervalForPhoneVerification;
            var s = timer(1000, 1000);
            this.abcForPhoneVerification = s.subscribe(val => {
                this.isPhoneVerifyTimerOn = true
                this.intervalForPhoneVerification = timeleft - val;
                this.phoneVerificationcountdownmessage = 'Resend in ' + this.intervalForPhoneVerification + ' seconds';
                if (this.intervalForPhoneVerification == 0 || this.intervalForPhoneVerification < 0) {
                    this.phoneVerificationcountdownmessage = ''
                    // this.isPhoneAuthSendOtpButtonEnabled = false
                    this.isPhoneVerifyTimerOn = false
                    this.abcForPhoneVerification.unsubscribe();
                    this.isDisableSendOtpButtonForNewPhone = false
                }
            });
        } else {

        }
    }

    resetPhoneOtpTimer = () => {
        this.phoneVerificationcountdownmessage = ''
        // this.isPhoneAuthSendOtpButtonEnabled = false
        this.isPhoneVerifyTimerOn = false
        this.abcForPhoneVerification.unsubscribe();
        this.isDisableSendOtpButtonForNewPhone = false;
        this.phoneVerificationcountdownmessage = ''
        this.isDisableSendOtpButtonForRegisteredPhone = false
    }

    /* Method defination for chnaging mobile no */
    confirmOtpCallbackForVerifingNewMobile = () => {
        let payload = {
            uuid: localStorage.getItem('uuid'),
            phoneOtp: this.smsOtpForRegisteredNo,
            newPhoneOtp : this.smsOtpForNewNo,
            phone: this.editablePhone,
            countryCode: this.selectedCountryPhone


        }
        
        this.http.post<any>(this.data.WEBSERVICE + '/user/ChangePhoneNo', JSON.stringify(payload), {
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
                    this.data.alert('Phone number updated successfully', 'success')
                    location.reload();
                }

            });

    }

    /* handle verification for confirm button */
    handleConfirmButton = () => {
        if (this.editablePhone != '' && this.smsOtpForNewNo != '') {
            this.confirmOtpCallbackForVerifingNewMobile();

        } else {
            this.data.alert('Please provide valid details', 'danger');
        }
    }

    resetMobileVerifySection = () => {
        this.isPhoneAuthEditButtonEnabled = true
        this.isPhoneAuthSendOtpButtonEnabled = false
        this.showConfirmButton = false
        this.otpForNewMobileVerify = ''
    }

    generateKeys() {
        // $('.bs-example').show();
        // $('.apikeycheckcreate-READ').attr('checked', 'checked');
        let payload = {
            uuid: localStorage.getItem('uuid'),
            otp: $('#orangeForm-email').val(),
            phoneOtp: $('#orangeForm-phoneOtp').val(),
            securityCode: $('#orangeForm-passkey').val(),
            keyName: $('#signupInputname').val()
        }

        this.http
            .post<any>(this.data.WEBSERVICE + "/user/generateKeys", JSON.stringify(payload), {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                }
            })
            .subscribe(
                response => {
                    var result = response;
                    if (result.error.error_data != '0') {
                        this.data.alert(result.error.error_msg, 'danger')
                    } else {
                        this.apikey = result.apiKey;
                        this.secretkey = result.secretKey;
                        this.data.alert('API Created sucessfully', 'success');
                        this.getApiKeyList();
                        $('.bs-example').show();
                        $('.apikeycheckcreate-READ').attr('checked', 'checked');
                    }
                });
    }

    allApiTypeKey() {
        this.http
            .get<any>(this.data.WEBSERVICE + "/user/allApiType", {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .subscribe(
                response => {
                    this.apitype = response.apiTypeList;

                    console.log('all apisss type before', this.apitype);

                    if (this.data.isSpot != 1) {

                        this.removeObjectWithId(this.apitype, 4);

                    }
                    if (this.data.isFutures != 1) {

                        this.removeObjectWithId(this.apitype, 5);

                    }
                    if (this.data.isOptions != 1) {

                        this.removeObjectWithId(this.apitype, 6);

                    }
                    console.log('all apisss type after', this.apitype);


                });
    }


    removeObjectWithId(arr, id) {
        const objWithIdIndex = arr.findIndex((obj) => obj.apiTypeId === id);

        if (objWithIdIndex > -1) {
            arr.splice(objWithIdIndex, 1);
        }

        this.apitype = arr;

        return arr;
    }

    handleIpCheckSelection = (param) => {
        //console.log('ipRestrictStatus',this.ipRestrictStatus)
        this.ipListTemp = [];
        this.ipListConfirm = [];
        if (param == 1) {
            // this.modalService.open(this.ipAddressModal, { centered: true });
            this.ipRestrictStatus = 1
        } else {
            this.ipRestrictStatus = 0

        }
    }

    handleAddIpAddress = (e) => {
        let ip = e.target.value;
        //console.log(ip)
        let reg = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/gm
        if (e.keyCode == 13) {
            if (ip != '' && ip.match(reg)) {
                if (this.ipListTemp.length <= 10) {
                    this.ipListTemp.push(ip);
                    e.target.value = '';
                } else {
                    this.data.alert('You can provide only 10 IPs max', 'danger');
                }
            } else {
                this.data.alert('Enter valid IPV4 address', 'danger');
            }
        }
    }

    handleDeleteIp = (ip) => {
        let index = this.ipListTemp.indexOf(ip);
        if (index > -1) {
            this.ipListTemp.splice(index, 1);
        }
    }

    handleConfirmIpSave = () => {
        this.ipRestrictStatus = 1
        this.ipListConfirm = this.ipListTemp;
    }

    oldPassword;
    newPassword;

    /* Method defination for opening the modal before chnaging password */
    confirmBeforeResetPassword = (isValid, template) => {
        if (isValid) {
            this.modalService.open(template, { centered: true });
        } else {
            this.data.alert('Please provide valid details', 'success');
        }
    }

    handleOpenTwoFactorModal = (template, purpose) => {
        let twoFactorAuth = localStorage.getItem('twoFactorAuth');
        this.purposeForGoogleAuthSubmit = purpose
        this.twoFactorOtp = ''
        if (twoFactorAuth == '1') {

            this.modalService.open(template, { centered: true });
        } else {
            this.data.alert('Please turn on Two Factor Authentication from Settings first', 'danger');
        }

    }
    handleOpenTwoFactorModalForSaveApi = (template, purpose) => {
        let twoFactorAuth = localStorage.getItem('twoFactorAuth');
        this.purposeForGoogleAuthSubmit = purpose
        this.twoFactorOtp = ''
        if (twoFactorAuth == '1') {

            this.modalService.open(template, { centered: true });
        } else {
            this.data.alert('Please turn on Two Factor Authentication from Settings first', 'danger');
        }

    }

    async handleTwoFactorAuthSubmit() {
        var a = await this.data.checkUserBlockStatus()
        if (a == true) {

            if (this.purposeForGoogleAuthSubmit == 'changePassword') {
                this.changePassword()
            } else if (this.purposeForGoogleAuthSubmit == 'saveAPI') {
                this.saveApiKey();

            } else if (this.purposeForGoogleAuthSubmit == 'deleteAPI') {
                this.deleteApiKeyCall();
            }
        }
    }
    changePassword() {
        var changePasswordObj = {};
        //changePasswordObj['userId'] = localStorage.getItem('user_id');
        changePasswordObj['uuid'] = localStorage.getItem('uuid');
        changePasswordObj['password'] = this.oldPassword;
        changePasswordObj['newPassword'] = this.newPassword;
        changePasswordObj['otp'] = this.twoFactorOtp;
        var jsonString = JSON.stringify(changePasswordObj);
        // wip(1);
        this.http.post<any>(this.data.WEBSERVICE + '/user/ChangePassword', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        })
            .subscribe(response => {
                // wip(0);
                this.twoFactorOtp = ''
                var result = response;
                if (result.error.error_data != '0') {
                    this.data.alert(result.error.error_msg, 'danger');
                } else {
                    this.data.alert('Password Changed Successfully,You will be logged out', 'success');
                    setTimeout(() => {
                        this.data.logout();
                    }, 3000);
                }
            }, function (reason) {
                // wip(0);
                if (reason.data.error == 'invalid_token') { this.data.logout(); } else { this.data.alert('Could Not Connect To Server', 'danger'); }
            });


    }
    retypePassword;

    matchPassword() {
        if (this.retypePassword != undefined) {
            let reg = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!@.])[a-zA-Z0-9$!.@]{8,35}$/gm
            //console.log(this.newPassword.match(reg) , this.retypePassword.match(reg))
            if (this.newPassword != '') {
                if (this.newPassword.match(reg) != null && this.retypePassword.match(reg) != null) {
                    this.passwordValidationError = ''
                    this.passwordValidationErrorForNewPassword = ''
                    if (this.newPassword == this.retypePassword) {
                        $('.match_error').css('color', 'green');
                        $('.match_error').html('<i class="fa fa-check"></i> Password Matched');
                        $('.generate_password_otp_btn').removeAttr('disabled');
                        this.match = true;
                    } else {
                        $('.match_error').css('color', 'red');
                        $('.match_error').html('<i class="fa fa-times"></i> Password Mismatched');
                        $('.generate_password_otp_btn').attr('disabled', 'disabled');
                        this.match = false;
                    }
                } else {
                    this.passwordValidationErrorForNewPassword = 'The password should be of minimum 8, maximum 35 characters and must contain at least one uppercase, one lowercase, a number and a special character (only $ @  . ! are allowed in special characters).'
                    $('.match_error').css('color', 'red');
                    $('.match_error').html(this.passwordValidationError);
                    this.match = false

                }
            } else {
                this.match = false
                this.retypePassword = this.retypePassword.slice(0, -1);
            }
        } else {
            this.match = false
            $('.match_error').html('');
            $('.generate_password_otp_btn').attr('disabled', 'disabled');
        }

    }
    lockOutgoingTransactionStatus;
    twoFactorStatus;
    twoFactorStatusForView;
    phoneAuthStatusFromApplicationEnd;
    phoneAuthStatusFromUiEnd;
    incomingTransactionAlert;
    pinLock;
    soundAlert;
    alertRate;
    rateAlert;
    vibrateAlert;
    indentificationStatus;
    bankDetailStatus;
    google_auth_otp;
    twoFactorAuthKey;
    twoFactorSecureToken;
    messageotp;

    getUserAppSetting() {
        this.data.alert('Loading...', 'dark');
        var settingObj = {};
        //settingObj['userId'] = localStorage.getItem('user_id');
        settingObj['uuid'] = localStorage.getItem('uuid');
        var jsonString = JSON.stringify(settingObj);
        // wip(1);
        this.http.post<any>(this.data.WEBSERVICE + '/user/GetUserAppSettings', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        })
            .subscribe(response => {
                this.data.loader = false;
                var result = response;
                if (result.userAppSettingsResult.txnCurrencyId == '8') {
                    $('#enablehcx').attr('checked', true);
                    $('#disablehcx').attr('checked', false);
                }
                else {
                    $('#enablehcx').attr('checked', false);
                    $('#disablehcx').attr('checked', true);
                }
                localStorage.setItem('txncurrencyId', result.userAppSettingsResult.txnCurrencyId);
                if (result.error.error_data != '0') {
                    this.data.alert(result.error.error_msg, 'danger');
                } else {
                    this.lockOutgoingTransactionStatus = result.userAppSettingsResult.lock_outgoing_transactions;
                    this.twoFactorStatus = result.userAppSettingsResult.two_factor_auth;
                    this.twoFactorStatusForView = result.userAppSettingsResult.two_factor_auth;
                    this.phoneAuthStatusFromApplicationEnd = localStorage.getItem('userSmsAuthStatus');
                    this.phoneAuthStatusFromUiEnd = localStorage.getItem('userSmsAuthStatus');
                    this.incomingTransactionAlert = result.userAppSettingsResult.incoming_transactions_alert;
                    this.pinLock = result.userAppSettingsResult.pin_lock;
                    this.soundAlert = result.userAppSettingsResult.sound_alert;
                    this.alertRate = result.userAppSettingsResult.alert_rate;
                    this.rateAlert = result.userAppSettingsResult.rate_alert;
                    this.vibrateAlert = result.userAppSettingsResult.vibrate_alert;
                    if (result.userAppSettingsResult.user_docs_status == '') {
                        this.indentificationStatus = 'Identity verification documents not submitted.';
                    }
                    if (result.userAppSettingsResult.user_docs_status == '1') {
                        this.indentificationStatus = 'Identity verification documents verified.';
                    }
                    if (result.userAppSettingsResult.user_docs_status == '0') {
                        this.indentificationStatus = ' Identity verification documents submitted for Verification.';
                    }
                    if (result.userAppSettingsResult.user_docs_status == '2') {
                        this.indentificationStatus = ' Identity verification documents declined, please submit again.';
                    }
                    if (result.userAppSettingsResult.bank_details_status == '') {
                        this.bankDetailStatus = 'Bank details not submitted.';
                    }
                    if (result.userAppSettingsResult.bank_details_status == '0') {
                        this.bankDetailStatus = 'Bank details  submitted for Verification.';
                    }
                    if (result.userAppSettingsResult.bank_details_status == '2') {
                        this.indentificationStatus = ' Bank details verified.';
                    }
                    if (result.userAppSettingsResult.bank_details_status == '3') {
                        this.bankDetailStatus = ' Identity verification documents declined, please submit again.';
                    }
                    /*  if (this.twoFactorStatus == 0) {
                         $('.twoFactorTrueEffect').hide();
                         $('.twoFactorFalseEffect').show();
                     }
                     if (this.twoFactorStatus == 1) {
                         $('.twoFactorFalseEffect').hide();
                         $('.twoFactorTrueEffect').show();
 
                     } */
                    if (this.twoFactorStatusForView == 0) {
                        $('.twoFactorTrueEffect').hide();
                        $('.twoFactorFalseEffect').show();
                    }
                    if (this.twoFactorStatusForView == 1) {
                        $('.twoFactorFalseEffect').hide();
                        $('.twoFactorTrueEffect').show();

                    }
                    if (this.phoneAuthStatusFromUiEnd == 0) {
                        $('.twoFactorTrueEffect').hide();
                        $('.twoFactorFalseEffect').show();
                    }
                    if (this.phoneAuthStatusFromUiEnd == 1) {
                        $('.twoFactorFalseEffect').hide();
                        $('.twoFactorTrueEffect').show();

                    }

                }
            }, function (reason) {
                // wip(0);
                if (reason.data.error == 'invalid_token') { this.data.logout(); } else {
                    this.data.logout();
                    this.data.alert('Could Not Connect To Server', 'danger');
                }
            });
    }

    updateUserAppSettings() {
        var updateSettingObj = {};
        updateSettingObj['userId'] = localStorage.getItem('user_id');
        updateSettingObj['lock_outgoing_transactions'] = this.lockOutgoingTransactionStatus;
        updateSettingObj['two_factor_auth'] = this.twoFactorStatus;
        updateSettingObj['rate_alert'] = this.rateAlert;
        updateSettingObj['vibrate_alert'] = this.vibrateAlert;
        updateSettingObj['incoming_transactions_alert'] = this.incomingTransactionAlert;
        updateSettingObj['pin_lock'] = this.pinLock;
        updateSettingObj['sound_alert'] = this.soundAlert;
        updateSettingObj['alert_rate'] = this.alertRate;
        updateSettingObj['uuid'] = localStorage.getItem('uuid');
        if (this.exist2FaKey == "1") {
            updateSettingObj['otp'] = this.emailOtpSpecific;
            updateSettingObj['securityCode'] = this.twoFactorOtpSpecific;
        }
        if (this.twoFactorStatus == "0" || this.twoFactorStatus == 0) {
            updateSettingObj['otp'] = this.emailOtpSpecific;
            updateSettingObj['securityCode'] = this.twoFactorOtpSpecific;
        }
        var jsonString = JSON.stringify(updateSettingObj);
        // wip(1);

        this.http.post<any>(this.data.WEBSERVICE + '/user/SaveUserAppSettings', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        })
            .subscribe(response => {
                // wip(0);
                var result = response;
                if (result.error.error_data != '0') {
                    this.data.alert(result.error.error_msg, 'danger');
                } else {
                    this.getUserAppSetting();
                    if (this.twoFactorStatus == '0') {

                        this.data.alert('Two factor verification turned off. Login Again', 'info');
                    } else {
                        this.data.alert('Two factor verification turned on. Login Again', 'info');

                    }
                    setTimeout(() => {
                        this.data.logout();
                    }, 400);
                }
            }, function (reason) {
                // wip(0);
                if (reason.data.error == 'invalid_token') { this.data.logout(); } else {
                    this.data.logout();
                    this.data.alert('Could Not Connect To Server', 'danger');
                }
            });
    }

    changeStatusFor2FactorAuth(content) {
        // this.twoFactorStatus = !this.twoFactorStatus;
        if (this.twoFactorStatus == '0') {
            this.twoFactorStatus == 1
        } else {
            this.twoFactorStatus == 0
        }
        this.emailOtpSpecific = '';
        this.twoFactorOtpSpecific = ''
        console.log(this.twoFactorStatusForView, this.twoFactorStatus)
        if (this.twoFactorStatusForView == '0') {
            this.out = false;
            //this.googleTwoFactorAuth(content);
            this.handleOtpPopupfor2FactorAuth(content, 'pre')
        } else {
            this.out = true;
            this.twoFactorStatus = '0';
            this.lockOutgoingTransactionStatus = '0';
            //this.updateUserAppSettings();
            this.handleOtpPopupfor2FactorAuth(content, 'post')
            //this.data.alert('Two factor verification turned off. Login Again', 'info');
            /* setTimeout(() => {
                this.data.logout();
            }, 400); */

        }

    }



    handleOtpPopupfor2FactorAuth = (content, flag) => {
        this.exist2FaKey = localStorage.getItem('exist2FaKey')
        this.specificModalStatus = flag
        this.modalService.open(content, { centered: true });
    }
    handleOtpPopupSubmitfor2FactorAuth = (content) => {

        if (this.specificModalStatus == 'pre') {
            this.googleTwoFactorAuth(content);
        }
    }


    changeStatusForLockOutgoingTransaction() {
        this.lockOutgoingTransactionStatus = !this.lockOutgoingTransactionStatus;
        if (this.lockOutgoingTransactionStatus == true) {
            this.lockOutgoingTransactionStatus = '1';
        } else {
            this.lockOutgoingTransactionStatus = '0';
        }
        var updateSettingObj = {};
        updateSettingObj['userId'] = localStorage.getItem('user_id');
        updateSettingObj['lock_outgoing_transactions'] = this.lockOutgoingTransactionStatus;
        updateSettingObj['two_factor_auth'] = this.twoFactorStatus;
        updateSettingObj['rate_alert'] = this.rateAlert;
        updateSettingObj['vibrate_alert'] = this.vibrateAlert;
        updateSettingObj['incoming_transactions_alert'] = this.incomingTransactionAlert;
        updateSettingObj['pin_lock'] = this.pinLock;
        updateSettingObj['sound_alert'] = this.soundAlert;
        updateSettingObj['alert_rate'] = this.alertRate;
        updateSettingObj['uuid'] = localStorage.getItem('uuid');
        if (this.exist2FaKey == "1") {
            updateSettingObj['otp'] = this.emailOtpSpecific;
            updateSettingObj['securityCode'] = this.twoFactorOtpSpecific;
        }
        if (this.twoFactorStatus == "0" || this.twoFactorStatus == 0) {
            updateSettingObj['otp'] = this.emailOtpSpecific;
            updateSettingObj['securityCode'] = this.twoFactorOtpSpecific;
        }
        var jsonString = JSON.stringify(updateSettingObj);
        // wip(1);
        this.http.post<any>(this.data.WEBSERVICE + '/user/SaveUserAppSettings', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        })
            .subscribe(response => {
                var result = response.data;
                if (result.error.error_data != '0') {
                } else {
                    this.getUserAppSetting();
                }
            }, function (reason) {
                if (reason.data.error == 'invalid_token') { this.data.logout(); } else {
                    this.data.logout();
                    this.data.alert('Could Not Connect To Server');
                }
            });
    }

    googleTwoFactorAuth(content) {
        var inputObj = {};
        inputObj['userId'] = localStorage.getItem('user_id');
        inputObj['uuid'] = localStorage.getItem('uuid');
        inputObj['otp'] = this.emailOtpSpecific;
        if (this.exist2FaKey == '1') {
            inputObj['securityCode'] = this.twoFactorOtpSpecific;
        }
        var jsonString = JSON.stringify(inputObj);
        this.http.post<any>(this.data.WEBSERVICE + '/user/GetTwoFactorykey', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        })
            .subscribe(response => {
                var result = response;
                this.twofactorauth = result.twoFactorAuth;
                if (result.error.error_data != '0') {
                    this.data.alert(result.error.error_msg, 'danger');
                } else {
                    $('#google_auth_qr_code').html('');
                    this.google_auth_otp = '';
                    this.twoFactorSecureToken = result.userResult.twoFactorAuthKey
                    this.twoFactorAuthKey = 'otpauth://totp/' + localStorage.getItem('email') + '?secret=' + result.userResult.twoFactorAuthKey + '&issuer='+this.data.exchange;
                    this.modalService.open(content, {
                        centered: true,
                        backdrop: 'static',
                        keyboard: false,
                    });
                    $('.google_auth_qr').show();
                }
            }, function (reason) {
                if (reason.data.error == 'invalid_token') { this.data.logout(); } else {
                    this.data.logout();
                    this.data.alert('Could Not Connect To Server', 'danger');
                }
            });
    }

    copySecureCode = () => {
        // Get the text field
        let copyText = document.getElementById("twoFactorSecureToken") as HTMLInputElement;

        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        // navigator.clipboard.writeText(copyText.value);
        window.navigator['clipboard'].writeText(copyText.value);

        // Alert the copied text
        //alert("Copied the text: " + copyText.value);
    }

    sendGoogleAuthOtp(content) {
        this.emailOtpSpecific = '';
        this.twoFactorOtpSpecific = '';
        if (this.google_auth_otp != undefined) {
            var inputObj = {};
            inputObj['email'] = localStorage.getItem('email');
            inputObj['otp'] = this.google_auth_otp;
            var jsonString = JSON.stringify(inputObj);
            // wip(1);
            this.http.post<any>(this.data.WEBSERVICE + '/user/CheckTwoFactor', jsonString, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                }
            })
                .subscribe(response => {
                    var result = response;
                    if (result.error.error_data != '0') {
                        this.twoFactorStatus = '0';
                        this.data.alert(result.error.error_msg, 'danger');
                    } else {
                        this.modalService.dismissAll();
                        this.twoFactorStatus = '1';
                        this.updateUserAppSettings();
                        // this.data.alert('Two factor verification updated. Login Again', 'success');
                        // this.data.logout();
                        //this.handleOtpPopupfor2FactorAuth(content, 'post')
                    }
                }, function (reason) {
                    if (reason.data.error == 'invalid_token') { this.data.logout(); } else {
                        this.data.logout();
                        this.data.alert('Could Not Connect To Server', 'danger');
                    }
                });
        } else {
            alert('Please Enter Otp');
        }
    }

    cancelSettings() {
        $('#googleAuthModal').modal('hide');
        if (this.twoFactorStatus == true) {
            this.twoFactorStatus = '0';
            this.lockOutgoingTransactionStatus = '0';
            this.updateUserAppSettings();
        } else {
            this.twoFactorStatus = '1';
            this.updateUserAppSettings();
        }
    }

    passModal(content) {
        this.modalService.open(content, { centered: true });
    }

    Delete(Api) {
        this.modalService.open(Api, { centered: true });
    }
    editModal(checkboxedit) {
        this.modalService.open(checkboxedit, { centered: true });
    }

    Create(key) {
        if (this.twoFactorStatus != 0 && this.apikeylist.length < 15) {
            this.modalService.open(key, { centered: true });
        }
        else if (this.twoFactorStatus == 0 && this.apikeylist.length < 15) {
            alert("Please turn on your two factor authentication");
        }
        else {
            alert("You have exceeded the maximum number of API keys");
        }

    }


    ShowHideDiv() {
        var abc = $("input[name='optionsRadios']:checked").val();

        if (abc == 'option2') {
            $('.textboxes').show();
        }
        else {
            $('.textboxes').hide();
        }
    }

    getCodeFromEmail(param) {
        var getotpObj = {};
        getotpObj["email"] = localStorage.getItem("email");
        var jsonString = JSON.stringify(getotpObj);
        this.isGetCodeButtonDisabledSpecific = true;
        this.isGetCodeButtonDisabledForSmsAuth = true;
        this.isGetCodeButtonDisabled = true;
        this.http
            .post<any>(this.data.WEBSERVICE + "/user/ResendOTP/" + param, jsonString, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .subscribe(
                response => {
                    var result = response;
                    if (result.error.error_data != '0') {
                        this.data.alert(result.error.error_msg, 'danger');
                        this.isGetCodeButtonDisabledSpecific = false;
                        this.isGetCodeButtonDisabledForSmsAuth = false;
                    } else {
                        this.messageotp = 'Enter the 8 digit code received by ' + localStorage.getItem("email");
                        var timeleft = this.data.timeIntervalForEmail;
                        this.interval;
                        var s = timer(1000, 1000);
                        this.abc = s.subscribe(val => {
                            this.interval = timeleft - val;
                            this.messageotpSpecific = 'Resend in ' + this.interval + ' seconds';
                            this.countdownForEmailOtpUsedInSmsAuthModal = 'Resend in ' + this.interval + ' seconds'
                            this.countdownForEmailOtpUsedInSaveApiModal = 'Resend in ' + this.interval + ' seconds'
                            $('#countermsg').html("<div class='text-center'>" + 'Resend in ' + this.interval + ' seconds' + "</div>");
                            this.isGetCodeButtonDisabled = true;
                            this.isGetCodeButtonDisabledSpecific = true;
                            $('#countermsg').css('display', 'block');

                            if (this.interval == 0 || this.interval < 0) {
                                $('#countermsg').css('display', 'none');
                                this.isGetCodeButtonDisabled = false;
                                this.isGetCodeButtonDisabledSpecific = false;
                                this.isGetCodeButtonDisabledForSmsAuth = false;
                                this.messageotpSpecific = ''
                                this.countdownForEmailOtpUsedInSmsAuthModal = ''
                                this.countdownForEmailOtpUsedInSaveApiModal = ''
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

    checkauthenticationOtp() {
        $('.bs-example').show();
        $('.apikeycheckcreate-READ').attr('checked', 'checked');
        var otpObj = {};
        otpObj['userId'] = localStorage.getItem('user_id');
        otpObj['uuid'] = localStorage.getItem('uuid');
        otpObj['otp'] = $('#orangeForm-email').val();
        var jsonString = JSON.stringify(otpObj);
        // wip(1);
        this.http.post<any>(this.data.WEBSERVICE + '/user/verifyOtp', jsonString, {
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
                    var authObj = {};
                    authObj['email'] = localStorage.getItem('email');
                    authObj['otp'] = localStorage.getItem('googleauthcode');
                    var jsonString = JSON.stringify(authObj);
                    this.http.post<any>(this.data.WEBSERVICE + '/user/CheckTwoFactor', jsonString, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).subscribe(response => {
                        var result = response;
                        if (result.error.error_data != '0') {
                            this.data.alert(result.error.error_msg, 'danger');
                        }
                        else {
                            this.generateKeys();
                        }
                    });
                }
            });
    }

    saveApiKey() {
        var favorite = [];
        $.each($("input[name='apikeycheck']:checked"), function () {
            favorite.push($(this).val());
        });
        var authObj = {};
        authObj['userId'] = localStorage.getItem('user_id');
        authObj['uuid'] = localStorage.getItem('uuid');
        authObj['keyName'] = $('#signupInputname').val();
        authObj['apiKey'] = $('.apikey').val();
        authObj['secretKey'] = $('.secretkey').val();
        authObj['securityCode'] = this.twoFactorOtp;
        for (var i = 0; i < favorite.length; i++) {
            if (favorite[i] == 1) {
                authObj['isRead'] = 1;
            }
            if (favorite[i] == 2) {
                authObj['isDeposit'] = 1;
            }
            if (favorite[i] == 3) {
                authObj['isWithdraw'] = 1;
            }
            if (favorite[i] == 4) {
                authObj['isSpotTrade'] = 1;
            }
            if (favorite[i] == 5) {
                authObj['isFuturesTrade'] = 1;
            }
            if (favorite[i] == 6) {
                authObj['isOptionsTrade'] = 1;
            }
        }

        var jsonString = JSON.stringify(authObj);
        // wip(1);
        this.http.post<any>(this.data.WEBSERVICE + '/user/updateKeys', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        }).subscribe(response => {
            var result = response;
            if (result.error.error_data != '0') {
                this.data.alert(result.error.error_msg, 'danger');
            }
            else {
                this.data.alert('Updated successfully', 'success');
                this.modalService.dismissAll();
                this.apikeyid = result.id;
            }
        });
    }

    updateApiKeys = () => {

        var favorite = [];
        $.each($("input[name='keyapicheckedit']:checked"), function () {
            favorite.push($(this).val());
        });
        var authObj = {};
        authObj['userId'] = localStorage.getItem('user_id');
        authObj['uuid'] = localStorage.getItem('uuid');
        authObj['id'] = this.apiKeyDataForEdit.id;
        authObj['keyName'] = $('#keyNameForEdit').val();
        authObj['apiKey'] = this.apiKeyDataForEdit.publicKey;
        authObj['secretKey'] = this.apiKeyDataForEdit.secretKey;
        authObj['securityCode'] = this.gaOtpForEdit;
        authObj['otp'] = this.emailOtpForEdit;
        authObj['phoneOtp'] = this.phoneOtpForEdit;

        authObj['action'] = 'UPDATE';
        console.log(favorite)
        for (let i = 1; i <= 6; i++) {
            // console.log(i,favorite.indexOf(i));
            if (i == 1) {
                if (favorite.indexOf('1') != -1) {
                    authObj['isRead'] = 1;
                } else {
                    authObj['isRead'] = 0;
                }
            } else if (i == 2) {
                if (favorite.indexOf('2') != -1) {
                    authObj['isDeposit'] = 1;
                } else {
                    authObj['isDeposit'] = 0;
                }
            } else if (i == 3) {
                if (favorite.indexOf('3') != -1) {
                    authObj['isWithdraw'] = 1;
                } else {
                    authObj['isWithdraw'] = 0;
                }
            } else if (i == 4) {
                if (favorite.indexOf('4') != -1) {
                    authObj['isSpotTrade'] = 1;
                } else {
                    authObj['isSpotTrade'] = 0;
                }
            } else if (i == 5) {
                if (favorite.indexOf('5') != -1) {
                    authObj['isFuturesTrade'] = 1;
                } else {
                    authObj['isFuturesTrade'] = 0;
                }
            } else if (i == 6) {
                if (favorite.indexOf('6') != -1) {
                    authObj['isOptionsTrade'] = 1;
                } else {
                    authObj['isOptionsTrade'] = 0;
                }
            }
        }


        if (this.ipListTemp.length > 0) {
            let ipString = '';
            for (let i = 0; i < this.ipListTemp.length; i++) {
                ipString += this.ipListTemp[i] + ','
            }
            authObj['ipAddress'] = ipString.slice(0, -1)
        } else {
            authObj['ipAddress'] = ''
        }

        var jsonString = JSON.stringify(authObj);
        console.log(jsonString);
        // wip(1);
        this.http.post<any>(this.data.WEBSERVICE + '/user/updateKeys', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        }).subscribe(response => {
            var result = response;
            if (result.error.error_data != '0') {
                this.data.alert(result.error.error_msg, 'danger');
            }
            else {
                this.data.alert('Updated successfully', 'success');
                this.modalService.dismissAll();
                this.getApiKeyList();
                $('.bs-example').hide();
            }
        });
    }

    confirmDelete() {
        var deleteapikeyObj = {};
        deleteapikeyObj['userId'] = localStorage.getItem('user_id');
        deleteapikeyObj['uuid'] = localStorage.getItem('uuid');
        var jsonString = JSON.stringify(deleteapikeyObj);
        // wip(1);
        this.http.post<any>(this.data.WEBSERVICE + '/user/deleteAllApiKeysByUser', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        }).subscribe(response => {
            var result = response;
            if (result.error.error_data != '0') {
                this.data.alert(result.error.error_msg, 'danger');
            }
            else {
                this.data.alert('list of api key deleted successfully', 'success');
                location.reload();
            }

            if (result == '') {
                $('#submit_btn').css('display', 'none');
                $('.listofapi').css('display', 'none');
            }
            else {
                $('#submit_btn').css('display', 'block');
                $('.listofapi').css('display', 'block');
            }

        });
    }

    deleteSingleApiKey(event: any) {
        var keyid = event.target.dataset.id;
        var deleteapikeyObj = {};
        deleteapikeyObj['userId'] = localStorage.getItem('user_id');
        deleteapikeyObj['uuid'] = localStorage.getItem('uuid');
        deleteapikeyObj['action'] = 'DELETE';
        deleteapikeyObj['id'] = keyid;
        this.deleteapikeyObj = deleteapikeyObj

    }
    deleteApiKeyCall = () => {
        this.deleteapikeyObj['securityCode'] = this.gaOtpForDelete;
        this.deleteapikeyObj['otp'] = this.emailOtpForDelete;
        this.deleteapikeyObj['phoneOtp'] = this.phoneOtpForDelete;
        var jsonString = JSON.stringify(this.deleteapikeyObj);
        // wip(1);
        this.http.post<any>(this.data.WEBSERVICE + '/user/updateKeys', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        }).subscribe(response => {
            var result = response;
            if (result.error.error_data != '0') {
                this.data.alert(result.error.error_msg, 'danger');
            }
            else {
                this.data.alert('Deleted successfully', 'success');
                location.reload();
            }
        });
    }

    functionname(apikeylist, type) {
        //console.log(apikeylist, type)
        if (apikeylist.isRead == 1 && type.apiTypeId == 1) {
            return true;
        }
        if (apikeylist.isDeposit == 1 && type.apiTypeId == 2) {
            return true;
        }
        if (apikeylist.isWithdraw == 1 && type.apiTypeId == 3) {
            return true;
        }
        if (apikeylist.isSpotTrade == 1 && type.apiTypeId == 4) {
            return true;
        }
        if (apikeylist.isFuturesTrade == 1 && type.apiTypeId == 5) {
            return true;
        }
        if (apikeylist.isOptionsTrade == 1 && type.apiTypeId == 6) {
            return true;
        }
    }

    chnageapikeyfunc(e, apikeylist, type) {
        if (type.apiTypeId == 1) {
            apikeylist.isRead = e.target.checked ? 1 : 0
        }
        if (type.apiTypeId == 2) {
            apikeylist.isDeposit = e.target.checked ? 1 : 0
        }
        if (type.apiTypeId == 3) {
            apikeylist.isWithdraw = e.target.checked ? 1 : 0
        }
        if (type.apiTypeId == 4) {
            apikeylist.isSpotTrade = e.target.checked ? 1 : 0
        }
        if (type.apiTypeId == 5) {
            apikeylist.isFuturesTrade = e.target.checked ? 1 : 0
        }
        if (type.apiTypeId == 6) {
            apikeylist.isOptionsTrade = e.target.checked ? 1 : 0
        }
    }


    editApiKey(apikeylist, i) {

        var editid = apikeylist.id;
        var editapikeyObj = {};
        editapikeyObj['userId'] = localStorage.getItem('user_id');
        editapikeyObj['action'] = 'UPDATE';
        // editapikeyObj['keyName'] = apikeylist.keyName;
        editapikeyObj['keyName'] = (<HTMLInputElement>document.getElementById("apiKeyName[" + i + "]")).value;



        editapikeyObj['id'] = editid;
        if (apikeylist.isRead == 1) {
            editapikeyObj['isRead'] = '1';
        }
        if (apikeylist.isDeposit == 1) {
            editapikeyObj['isDeposit'] = '1';
        }
        if (apikeylist.isWithdraw == 1) {
            editapikeyObj['isWithdraw'] = '1';
        }
        if (apikeylist.isSpotTrade == 1) {
            editapikeyObj['isSpotTrade'] = '1';
        }
        if (apikeylist.isFuturesTrade == 1) {
            editapikeyObj['isFuturesTrade'] = '1';
        }
        if (apikeylist.isOptionsTrade == 1) {
            editapikeyObj['isOptionsTrade'] = '1';
        }

        console.log('editss', editapikeyObj);


        this.editapikeyObj = editapikeyObj

    }

    editApiKeyCall = () => {
        this.editapikeyObj['securityCode'] = this.twoFactorOtp;
        this.editapikeyObj['uuid'] = localStorage.getItem('uuid');
        var jsonString = JSON.stringify(this.editapikeyObj);
        this.http.post<any>(this.data.WEBSERVICE + '/user/updateKeys', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        }).subscribe(response => {
            var result = response;
            if (result.error.error_data != '0') {
                this.data.alert(result.error.error_msg, 'danger');
            }
            else {
                this.data.alert('Updated successfully', 'success');
                this.modalService.dismissAll();
            }
        });
    }

    cancelApiKey() {
        location.reload();
    }

    copy(inputElement) {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
    }

    setradio(e: string): void {
        if (e == 'On') {
            var inputObj = {};
            //inputObj['userId'] = localStorage.getItem('user_id');
            inputObj['uuid'] = localStorage.getItem('uuid');
            inputObj['currencyId'] = '8';
            var jsonString = JSON.stringify(inputObj);
            // wip(1);
            this.http.post<any>(this.data.WEBSERVICE + '/user/changeTransactionChargeCurrency', jsonString, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                }
            })
                .subscribe(response => {
                    // wip(0);
                    var result = response;
                    if (result.error.error_data == 1) {
                        this.data.alertm(result.error.error_msg, 'danger');
                        setTimeout(function () {
                            location.reload();
                        }, 10000);

                    } else {
                        this.data.alert('Change Success', 'success');

                    }
                });
        }
        else {
            var inputObj = {};
            //inputObj['userId'] = localStorage.getItem('user_id');
            inputObj['uuid'] = localStorage.getItem('uuid');
            inputObj['currencyId'] = '0';
            var jsonString = JSON.stringify(inputObj);
            // wip(1);
            this.http.post<any>(this.data.WEBSERVICE + '/user/changeTransactionChargeCurrency', jsonString, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'BEARER ' + localStorage.getItem('access_token'),
                }
            })
                .subscribe(response => {
                    // wip(0);
                    var result = response;
                    if (result.error.error_data != '0') {

                        // this.toastr.error(result.error.error_msg, 'danger', {
                        //     timeOut: 15000,
                        //   });
                        this.data.alertm(result.error.error_msg, 'danger');
                        setTimeout(function () {
                            location.reload();
                        }, 10000);

                    } else {
                        this.data.alert('Change Success', 'success');
                    }
                });
        }
    }
    /* Method defination for show/hide password */
    handleShowHidePassword = () => {
        $(".showHide-password").each(function () {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });
    }

    /* handle deactivate confirm  popup open */
    handleDeactivateConfirmPopup = (template) => {
        this.modalService.open(template, { centered: true });
    }

    /* Method defination for calling API to deactivate account */
    handleDeactivateAccount = () => {
        var inputObj = {};
        inputObj['userId'] = localStorage.getItem('user_id');
        inputObj['uuid'] = localStorage.getItem('uuid');
        var jsonString = JSON.stringify(inputObj);
        this.http.post<any>(this.data.WEBSERVICE + '/user/blockAccount', jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        })
            .subscribe(response => {
                // wip(0);
                var result = response;
                if (result.error.error_data != '0') {
                    this.data.alertm(result.error.error_msg, 'danger');
                } else {
                    this.data.alert('Account Deactivated Successfully,You will be logged out', 'success');
                    setTimeout(() => {
                        this.data.logout();
                    }, 3000);
                }
            });
    }

    /* ethod defination for callback after sms otp send */
    callbackAfterSendingOtpInSms = () => {
        var timeleft = this.data.timeIntervalForSms;
        this.interval;
        var s = timer(1000, 1000);
        this.abc = s.subscribe(val => {
            this.interval = timeleft - val;
            this.intervalMessage = 'Resend in ' + this.interval + ' seconds';

            this.isGetCodeForSmsOtpEnabled = false;

            if (this.interval == 0 || this.interval < 0) {
                this.isGetCodeForSmsOtpEnabled = true;
                this.intervalMessage = ''
                this.abc.unsubscribe();
            }
        });

    }

    /* Handle verification popup on sms auth toggle */
    handlePhoneValidationOff = (content) => {
        if (this.twoFactorStatusForView == 1) {
            this.phoneOtpForSms = '';
            //this.phoneAuthStatusFromUiEnd = '0';
            this.modalService.open(content, { centered: true });
        } else {
            this.data.alert('Please enable 2FA first', 'danger')
        }
    }

    /* Method defination for making phone validation on*/
    handlePhoneValidationOn = () => {
        //this.phoneAuthStatusFromUiEnd = '1';
        this.handleSubmitPhoneValidationStatus('on')
    }

    /* Method defination for calling API for setting phone validation status */
    handleSubmitPhoneValidationStatus = (type) => {
        let payload = {
            uuid: localStorage.getItem('uuid'),
        }
        if (type == 'on') {
            payload['phoneValidation'] = 1

        } else {
            payload['phoneValidation'] = 0
            payload['securityCode'] = this.gaOtpForSms;
        }

        this.http.post<any>(this.data.WEBSERVICE + '/user/updatePhoneValidation', JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER ' + localStorage.getItem('access_token'),
            }
        })
            .subscribe(response => {
                // wip(0);
                var result = response;
                if (result.error.error_data != '0') {
                    this.data.alertm(result.error.error_msg, 'danger');
                    this.phoneAuthStatusFromUiEnd = localStorage.getItem('userSmsAuthStatus')
                } else {
                    this.data.alert('Phone number authentication has been turned ' + type + ', please login to continue', 'success');
                    if (type == 'on') {

                        this.phoneAuthStatusFromUiEnd = '1'
                    } else {
                        this.phoneAuthStatusFromUiEnd = '0'
                    }
                    setTimeout(() => {
                        this.data.logout();
                    }, 3000);
                }
            });

    }

    /* Method defination for opening edit api modal */
    handleOpenEditApiModal = (param) => {
        // console.log(param);
        this.apiKeyDataForEdit = param;
        this.apitypeForEdit = this.apitype
        let ipAddress = param.ipAddress;
        let ipAddressArr = [];
        if (ipAddress != null && ipAddress != '') {
            ipAddressArr = ipAddress.split(',');
        } else {
            ipAddressArr = [];
        }
        this.ipListTemp = ipAddressArr;
        this.modalService.open(this.editApiModal, { centered: true });
    }


}