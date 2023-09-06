import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { BodyService } from '../body.service';
import { CoreDataService } from '../core-data.service';
import {
  HttpClient
} from '@angular/common/http';
import { d } from '@angular/core/src/render3';
import { first } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import {
  NgbModal,NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  fiancialyear: any;
  reportlist: any;
  futurereportlist: any;
  optioneportlist: any;
  urlForMailingReport: any;
  fromdate: any;
  ffromdate: any;
  ofromdate: any;
  usr: any;
  model: any;
  startdata: any;
  sldata: any;
  transtiondata: any;
  price: any;
  keys: any;
  sumfdt: any;
  fsumfdt: any;
  sumtdt: any;
  fsumtdt: any;
  keyval: any;
  results: any;
  fresults: any;
  headerdata: any;
  fromDate: any;
  ffromDate: any;
  ofromDate: any;
  reportid: any;
  datastore: any;
  reportarray: any = "";
  selectyear: any = "0"
  fselectyear: any = "0"
  oselectyear: any = "0"
  reportkeys: any;
  futurereportkeys: any;
  todate: any;
  ftodate: any;
  otodate: any;
  toDate: any;
  ftoDate: any;
  otoDate: any;
  fundingheader: any;
  fundingheaderfuture: any;
  fundingheaderoption: any;
  year: number;
  month: number;
  newheader: any;
  datavalue: any;
  selectpdf: any = "selectoption";
  downloadUrl: any = 'javascript:void(0)';
  fdownloadUrl: any = 'javascript:void(0)';
  odownloadUrl: any = 'javascript:void(0)';
  oresults: any;
  page = 1;
  // day: number;
  ID: any;
  item: any;
  public show: any;
  public fshow: any;
  public oshow: any;
  repu: any;
  frepu: any;
  public buttonName: any = 'Show';
  currentDate: any = new Date().toISOString().slice(0, 10);
  currentYear: any = new Date().getFullYear();
  currentMonth: any = (new Date().getMonth()) + 1;
  currentDay: any = new Date().getDate();
  showExportButton = 0;
  fshowExportButton = 0;
  oshowExportButton = 0;
  totalCount = 0;
  noOfItemsPerPage = 10;
  showingRowValue = 10;
  showPrevButton = 0;
  showNextButton = 0;
  pagiArr = [];
  pagiLength: any;
  futurereportarray: any = '';
  optionsreportarray: any = "";
  showSpotReport: boolean = false;
  showFutureReport: boolean = false;

  optionreportarray: any = '';
  showOptionReport: boolean = false;
  result: any;
  Themecolor: string;

  constructor(
    private http: HttpClient,
    public data:CoreDataService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getreportdata();
    this.getfuturereportdata();
    this.getoptionreportdata();
    this.financialyear();
  }
  

  ngDoCheck() {

    this.Themecolor = localStorage.getItem('themecolor');
    // //console.log('saved theme', this.Themecolor)
  }
  themeChangedHandler(val) {

    this.Themecolor = val;

  }

  reset() {
    this.fromdate = this.fromdate = this.fromdate = '';

    this.reportarray = this.selectyear = '';

    this.todate = this.todate = this.todate = '';
    this.model = this.model = this.model = '';
    $(function () {
      $('input.form-control').val('');
    })
  }

  fundBuy(content) {
    if (this.reportarray && this.fromdate && this.todate) {
      open(content);
    } else {
      alert("Please Fillup all the given field")
    }
  }

 

  getreportdata() {
    this.http.get<any>(this.data.REPORTSERVISE + 'viewAllMaster', {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        //  this.reportkeys = Object.keys(response);
        //  this.reportlist = (response);
        this.reportlist = response.ResultSet.body
      })
  }
  getfuturereportdata() {
    this.http.get<any>(this.data.REPORTSERVISE + 'futureReportMaster', {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        //  this.futurereportkeys = Object.keys(response);
        //  this.futurereportlist = (response);
        this.futurereportlist = response;
        //  console.log('here',this.futurereportlist)
      })
  }
  getoptionreportdata() {
    this.http.get<any>(this.data.REPORTSERVISE + 'optionsReportMaster', {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        //  this.futurereportkeys = Object.keys(response);
        //  this.optioneportlist = (response);
        this.optioneportlist = response;
      })
  }
  finddata(datastore, reportarray, pageNo,content1,content2) {
    this.page = pageNo != 0 ? pageNo : this.page;
    console.log('pages', this.page)
    var usr = localStorage.getItem('uuid');
    // debugger;
    this.repu = reportarray;
    var ds = this.fromdate;
    var dp = this.todate;
    if (ds == undefined && dp == undefined) {
      this.sumfdt = '1' + '1' + this.selectyear;
      this.sumtdt = '31' + '12' + this.selectyear + 1;
    } else {
      this.fromDate = ds.day + '-' + ds.month + '-' + ds.year;
      this.toDate = dp.day + '-' + dp.month + '-' + dp.year;

      this.sumfdt = ds.month + ds.year;
      this.sumtdt = dp.month + dp.year;

    }
    if (this.repu == 6) {
      this.sumfdt = '0';
      this.sumtdt = '1';
    }

    // console.log(`this.sumtdt > this.sumfdt`,this.sumtdt > this.sumfdt,`  => `,this.sumtdt,  this.sumfdt)
    // console.log(`this.sumtdt == this.sumfdt`,this.sumtdt == this.sumfdt,`  => `,this.sumtdt , this.sumfdt)
     //console.log(`dp.day>=ds.day`,dp.day>=ds.day,`  => `,dp.day,ds.day)
     //console.log(`dp.year > ds.year`,dp.year > ds.year,`  => `,dp.year , ds.year)
    if ((this.sumtdt > this.sumfdt) || (this.sumfdt == this.sumtdt && dp.day >= ds.day) || (dp.year > ds.year)) {
      
      //console.log('Date difference => ',this.data.handleReportDateDiff(ds.month + '/' + ds.day + '/' + ds.year,dp.month + '/' + dp.day + '/' + dp.year));
      if (this.repu != 6) {
        if(this.data.handleReportDateDiff(ds.month + '/' + ds.day + '/' + ds.year,dp.month + '/' + dp.day + '/' + dp.year)<=7){

          this.http.get<any>(this.data.REPORTSERVISE + 'viewRepotDetails/' + usr + '/' + reportarray + '/' + this.fromDate + '/' + this.toDate + '/' + 2022 + '/' + this.page, {
            headers: {
              "Content-Type": "application/json",
              authorization: "BEARER " + localStorage.getItem("access_token")
            }
          })
            .subscribe(response => {
              // this.headerdata = Object.keys(response);
              // this.keyval = Object.values(response[0]);
              // this.datastore = this.keyval[0];
              // this.fundingheader = this.keyval[1];
              // this.results = Object.keys(this.fundingheader);
              // this.showExportButton=1;
              // this.fshowExportButton=0;
              // this.showFutureReport=false;
              // this.showSpotReport=true;
              // this.totalCount=response[0]['Row count'][0];
              //   this.pagiArr=[];
              //   for(var i = 1; i <= Math.ceil(this.totalCount / 25); i++){
              //     this.pagiArr.push(i);
              //  }
              //   this.pagiLength=(this.pagiArr).length;
              this.datastore = response.ResultSet.body[0].Header;
              // console.log('imhere',this.datastore)
              this.fundingheader = response.ResultSet.body[0].Results;
              this.showExportButton = 1;
              this.fshowExportButton = 0;
              this.showFutureReport = false;
              this.showOptionReport = false;
              this.showSpotReport = true;
              this.pagiArr = [];
              this.totalCount = response.ResultSet.body[0]['Page count'][0]
              for (var i = 1; i <= Math.ceil(this.totalCount); i++) {
                this.pagiArr.push(i);
              }
              this.pagiLength = (this.pagiArr).length;
              console.log("page", this.pagiArr)
            });
        }else{
          this.urlForMailingReport = 'https://accounts.paybito.com/api/report/viewRepotDetailsServer2/' + usr + '/' + reportarray + '/' + this.fromDate + '/' + this.toDate + '/' + 2022 + '?access_token=' + localStorage.getItem("access_token");
          this.modalService.open(content1, {
            centered: true
          });
        }
        
      }
      else {
        this.urlForMailingReport = 'https://accounts.paybito.com/api/report/viewRepotDetailsServer2/' + usr + '/' + reportarray + '/' + 0 + '/' + 0 + '/' +  this.selectyear + '?access_token=' + localStorage.getItem("access_token");

        this.modalService.open(content1, {
          centered: true
        });
        /* this.fromDate = '0';
        this.toDate = '0';
        this.http.get<any>(this.data.REPORTSERVISE + 'viewRepotDetails/' + usr + '/' + reportarray + '/' + this.fromDate + '/' + this.toDate + '/' + this.selectyear + '/' + this.page, {
          headers: {
            "Content-Type": "application/json",
            authorization: "BEARER " + localStorage.getItem("access_token")
          }
        })
          .subscribe(response => {
            // this.headerdata = Object.keys(response);
            // this.keyval = Object.values(response[0]);
            // this.datastore = this.keyval[0];
            // this.fundingheader = this.keyval[1];
            // this.results = Object.keys(this.fundingheader);
            // this.showExportButton=1;
            // this.fshowExportButton=0;
            // this.showFutureReport=false;
            // this.showOptionReport=false;
            //     this.showSpotReport=true;
            //   this.totalCount=response[0]['Row count'][0];
            //     this.pagiArr=[];
            //     for(var i = 1; i <= Math.ceil(this.totalCount / 25); i++){
            //       this.pagiArr.push(i);
            //    }
            //     this.pagiLength=(this.pagiArr).length;
            this.datastore = response.ResultSet.body[0].Header;
            this.fundingheader = response.ResultSet.body[0].Results;
            this.showExportButton = 1;
            this.fshowExportButton = 0;
            this.showFutureReport = false;
            this.showOptionReport = false;
            this.showSpotReport = true;
          }); */
      }
      if (this.repu != 6) {
        this.downloadUrl = this.data.REPORTSERVISE + 'viewRepotDetails/' + localStorage.getItem('uuid') + '/' + this.repu + '/' + this.fromDate + '/' + this.toDate + '/' + '2022' + '?access_token=' + localStorage.getItem("access_token");
      } else {
        this.downloadUrl = this.data.REPORTSERVISE + 'viewRepotDetails/' + localStorage.getItem('uuid') + '/' + this.repu + '/0/0/' + this.selectyear + '/?access_token=' + localStorage.getItem("access_token");
      }

    }
    else {
      this.data.alert("From Date is greater than To date",'warning');
      this.sumtdt = '';
      this.sumfdt = '';
    }

  }
  finddatafuture(datastore, futurereportarray, pageNo,content1,content2) {
    this.page = pageNo != 0 ? pageNo : this.page;
    var usr = localStorage.getItem('uuid');
    this.frepu = futurereportarray;
    console.log('report type', this.frepu)
    var ds = this.ffromdate;
    var dp = this.ftodate;

    if (ds == undefined && dp == undefined) {
      this.fsumfdt = '1' + '1' + this.selectyear;
      this.fsumtdt = '31' + '12' + this.selectyear + 1;
    } else {
      this.ffromDate = ds.day + '-' + ds.month + '-' + ds.year;
      this.ftoDate = dp.day + '-' + dp.month + '-' + dp.year;

      this.fsumfdt = ds.month + ds.year;
      this.fsumtdt = dp.month + dp.year;

    }
    /* if(this.repu==6){
      this.sumfdt='0';
      this.sumtdt='1';
    } */
    let url = '';
    // console.log(`this.sumtdt > this.sumfdt`,this.sumtdt > this.sumfdt,`  => `,this.sumtdt,  this.sumfdt)
    // console.log(`this.sumtdt == this.sumfdt`,this.sumtdt == this.sumfdt,`  => `,this.sumtdt , this.sumfdt)
    //console.log(`dp.day>=ds.day`,dp.day>=ds.day,`  => `,dp.day,ds.day)
    //console.log(`dp.year > ds.year`,dp.year > ds.year,`  => `,dp.year , ds.year)
    if ((this.fsumtdt > this.fsumfdt) || (this.fsumfdt == this.fsumtdt && dp.day >= ds.day) || (dp.year > ds.year)) {
      if (this.frepu != '2') {
        url = this.data.REPORTSERVISE + 'viewFuturesRepotDetails/' + usr + '/' + futurereportarray + '/' + this.ffromDate + '/' + this.ftoDate + '/0/' + this.page
        this.urlForMailingReport = 'https://accounts.paybito.com/api/report/viewFuturesRepotDetailsServer2/' + usr + '/' + futurereportarray + '/' + this.ffromDate + '/' + this.ftoDate + '/' + 2022 ;

      } else {
        url = this.data.REPORTSERVISE + 'viewFuturesRepotDetails/' + usr + '/' + futurereportarray + '/0/0/' + this.fselectyear + '/' + this.page
        this.urlForMailingReport = 'https://accounts.paybito.com/api/report/viewFuturesRepotDetailsServer2/' + usr + '/' + futurereportarray + '/' + 0 + '/' + 0 + '/' +  this.fselectyear ;

      }
      if(this.frepu != '2'  && this.data.handleReportDateDiff(ds.month + '/' + ds.day + '/' + ds.year,dp.month + '/' + dp.day + '/' + dp.year)<=7){
      this.http.get<any>(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: "BEARER " + localStorage.getItem("access_token")
        }
      })
        .subscribe(response => {
          // this.headerdata = Object.keys(response);
          // this.keyval = Object.values(response[0]);
          // this.datastore = this.keyval[0];
          // //this.fundingheaderfuture = this.keyval[1];
          // this.fundingheaderfuture = response[0].Header;
          // this.fresults = response[0].Results;
          // this.showExportButton=0;
          // this.fshowExportButton=1;
          // this.showFutureReport=true;
          // this.showSpotReport=false;
          // this.showOptionReport=false;
          this.totalCount = response.ResultSet.body[0]['Page count'][0]
          console.log('pagef', this.totalCount)
          this.pagiArr = [];
          for (var i = 1; i <= Math.ceil(this.totalCount); i++) {
            this.pagiArr.push(i);
          }
          this.pagiLength = (this.pagiArr).length;
          this.fundingheaderfuture = response.ResultSet.body[0].Header;
          this.fresults = response.ResultSet.body[0].Results;
          this.showExportButton = 0;
          this.fshowExportButton = 1;
          this.showFutureReport = true;
          this.showSpotReport = false;
          this.showOptionReport = false;
        });
        if (this.frepu != 2) {
          this.fdownloadUrl = this.data.REPORTSERVISE + 'viewFuturesRepotDetails/' + localStorage.getItem('uuid') + '/' + futurereportarray + '/' + this.ffromDate + '/' + this.ftoDate + '/' + '2022' + '?access_token=' + localStorage.getItem("access_token");
        } else {
          this.fdownloadUrl = this.data.REPORTSERVISE + 'viewFuturesRepotDetails/' + localStorage.getItem('uuid') + '/' + futurereportarray + '/0/0/' + this.fselectyear + '/?access_token=' + localStorage.getItem("access_token");
        }
      }else{
        this.modalService.open(content1, {
          centered: true
        });
      }
      

    }
    else {
      this.data.alert("From Date is greater than To date",'warning');
      this.sumtdt = '';
      this.sumfdt = '';
    }

  }
  optionfuture(datastore, optionsreportarray, pageNo,content1,content2) {


    this.page = pageNo != 0 ? pageNo : this.page;
    var usr = localStorage.getItem('uuid');
    this.frepu = optionsreportarray;
    var ds = this.ofromdate;
    var dp = this.otodate;

    if (ds == undefined && dp == undefined) {
      this.fsumfdt = '1' + '1' + this.selectyear;
      this.fsumtdt = '31' + '12' + this.selectyear + 1;
    } else {
      this.ofromDate = ds.day + '-' + ds.month + '-' + ds.year;
      this.otoDate = dp.day + '-' + dp.month + '-' + dp.year;

      this.fsumfdt = ds.month + ds.year;
      this.fsumtdt = dp.month + dp.year;

    }
    /* if(this.repu==6){
      this.sumfdt='0';
      this.sumtdt='1';
    } */
    let url = ''
    // console.log(`this.sumtdt > this.sumfdt`,this.sumtdt > this.sumfdt,`  => `,this.sumtdt,  this.sumfdt)
    // console.log(`this.sumtdt == this.sumfdt`,this.sumtdt == this.sumfdt,`  => `,this.sumtdt , this.sumfdt)
    //console.log(`dp.day>=ds.day`,dp.day>=ds.day,`  => `,dp.day,ds.day)
    //console.log(`dp.year > ds.year`,dp.year > ds.year,`  => `,dp.year , ds.year)
    if ((this.fsumtdt > this.fsumfdt) || (this.fsumfdt == this.fsumtdt && dp.day >= ds.day) || (dp.year > ds.year)) {
      if (this.frepu != '2') {
        url = this.data.REPORTSERVISE + 'viewOptionsRepotDetails/' + usr + '/' + optionsreportarray + '/' + this.ofromDate + '/' + this.otoDate + '/0/' + this.page
        this.urlForMailingReport = 'https://accounts.paybito.com/api/report/viewOptionsRepotDetailsServer2/' + usr + '/' + optionsreportarray + '/' + this.ofromDate + '/' + this.otoDate + '/' + 2022 ;
      } else {
        url = this.data.REPORTSERVISE + 'viewOptionsRepotDetails/' + usr + '/' + optionsreportarray + '/0/0/' + this.oselectyear + '/' + this.page
        this.urlForMailingReport = 'https://accounts.paybito.com/api/report/viewOptionsRepotDetailsServer2/' + usr + '/' + optionsreportarray + '/' + 0 + '/' + 0 + '/' +  this.oselectyear ;

      }
      if(this.frepu != '2'  && this.data.handleReportDateDiff(ds.month + '/' + ds.day + '/' + ds.year,dp.month + '/' + dp.day + '/' + dp.year)<=7){

        this.http.get<any>(url, {
          headers: {
            "Content-Type": "application/json",
            authorization: "BEARER " + localStorage.getItem("access_token")
          }
        })
          .subscribe(response => {
            // this.headerdata = Object.keys(response);
            // this.keyval = Object.values(response[0]);
            // this.datastore = this.keyval[0];
            // //this.fundingheaderfuture = this.keyval[1];
            // this.fundingheaderoption = response[0].Header;
            // this.oresults = response[0].Results;
            // this.showExportButton=0;
            // this.oshowExportButton=1;
            // this.showFutureReport=false;
            // this.showSpotReport=false;
            // this.showOptionReport=true;
            this.totalCount = response.ResultSet.body[0]['Page count'][0]
            this.pagiArr = [];
            for (var i = 1; i <= Math.ceil(this.totalCount); i++) {
              this.pagiArr.push(i);
            }
            this.pagiLength = (this.pagiArr).length;
            // this.result=response;
            // console.log('re',this.result)
            this.fundingheaderoption = response.ResultSet.body[0].Header;
            // console.log('here1',this.fundingheaderoption)
            this.oresults = response.ResultSet.body[0].Results;
            this.showExportButton = 0;
            this.oshowExportButton = 1;
            this.showFutureReport = false;
            this.showSpotReport = false;
            this.showOptionReport = true;
  
          });
  
        /*  if(this.frepu!=6){ */
        //this.odownloadUrl=this.data.REPORTSERVISE+'viewRepotDetails/'+localStorage.getItem('uuid')+'/'+this.frepu+'/'+this.ffromDate+'/'+this.ftoDate+'/2018';
        /*  }else{
           this.fdownloadUrl=this.data.REPORTSERVISE+'viewRepotDetails/'+localStorage.getItem('uuid')+'/'+this.frepu+'/0/0/'+this.selectyear;
         } */
        if (this.frepu != 2) {
          this.odownloadUrl = this.data.REPORTSERVISE + 'viewOptionsRepotDetails/' + localStorage.getItem('uuid') + '/' + optionsreportarray + '/' + this.ofromDate + '/' + this.otoDate + '/' + '2022' + '?access_token=' + localStorage.getItem("access_token");
        } else {
          this.odownloadUrl = this.data.REPORTSERVISE + 'viewOptionsRepotDetails/' + localStorage.getItem('uuid') + '/' + optionsreportarray + '/0/0/' + this.oselectyear + '/?access_token=' + localStorage.getItem("access_token");
        }
      }else{
        this.modalService.open(content1, {
          centered: true
        });
      }

    }
    else {
      this.data.alert("From Date is greater than To date",'warning');
      this.sumtdt = '';
      this.sumfdt = '';
    }

  }

  OnChange(val) {
    if (val == 6)
      this.show = 1;
    else {
      this.show = 0;
    }
  }
  OnChangeFuture(val) {
    if (val == 2)
      this.fshow = 1;
    else {
      this.fshow = 0;
    }
  }
  OnChangeOptions(val) {
    if (val == 2)
      this.oshow = 1;
    else {
      this.oshow = 0;
    }
  }


  exportTableToCSV(table, filename) {
    var $headers = $(table).find('tr:has(th)')
      , $rows = $(table).find('tr:has(td)')
      , tmpColDelim = String.fromCharCode(11)
      , tmpRowDelim = String.fromCharCode(0)
      , colDelim = '","'
      , rowDelim = '"\r\n"';
    var csv = '"';
    csv += formatRows($headers.map(grabRow));
    csv += rowDelim;
    csv += formatRows($rows.map(grabRow)) + '"';
    var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
    $('#downloadCSVBtn')
      .attr({
        'download': filename
        , 'href': csvData
      });
    function formatRows(rows) {
      return rows.get().join(tmpRowDelim)
        .split(tmpRowDelim).join(rowDelim)
        .split(tmpColDelim).join(colDelim);
    }
    function grabRow(i, row) {
      var $row = $(row);
      var $cols = $row.find('td');
      if (!$cols.length) $cols = $row.find('th');
      return $cols.map(grabCol)
        .get().join(tmpColDelim);
    }
    function grabCol(j, col) {
      var $col = $(col),
        $text = $col.text();
      return $text.replace('"', '""');
    }
  }



  pager(pg) {
    this.page = pg;
    this.finddata(this.datastore, this.reportarray, 0,'disclosureModal','resultModal');
  }
  pagerNext(pg) {
    pg++;
    this.page = pg;
    this.finddata(this.datastore, this.reportarray, 0,'disclosureModal','resultModal');

  }
  pagerPre(pg) {
    pg--;
    this.page = pg;
    this.finddata(this.datastore, this.reportarray, 0,'disclosureModal','resultModal');
  }
  // pagination future
  pagerf(pg) {
    this.page = pg;
    this.finddatafuture(this.datastore, this.futurereportarray, 0,'disclosureModal','resultModal');
  }
  pagerNextf(pg) {
    pg++;
    this.page = pg;
    this.finddatafuture(this.datastore, this.futurereportarray, 0,'disclosureModal','resultModal');

  }
  pagerPref(pg) {
    pg--;
    this.page = pg;
    this.finddatafuture(this.datastore, this.futurereportarray, 0,'disclosureModal','resultModal');
  }
  //  pagination option
  pagero(pg) {
    this.page = pg;
    this.optionfuture(this.datastore, this.optionsreportarray, 0,'disclosureModal','resultModal');
  }
  pagerNexto(pg) {
    pg++;
    this.page = pg;
    this.optionfuture(this.datastore, this.optionsreportarray, 0,'disclosureModal','resultModal');

  }
  pagerPreo(pg) {
    pg--;
    this.page = pg;
    this.optionfuture(this.datastore, this.optionsreportarray, 0,'disclosureModal','resultModal');
  }

  financialyear() {
    this.http.get<any>(this.data.REPORTSERVISE + 'financialYearList', {
      headers: {
        "Content-Type": "application/json",
        authorization: "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        this.fiancialyear = response.ResultSet.body;
      })
  }

  pagi(num) {
    this.page = parseInt(num);
    this.finddata(this.datastore, this.reportarray, 0,'disclosureModal','resultModal');
  }

  downloadCsvFromBackend() {
    if (this.repu != 6) {
      var downloadUrl = this.data.REPORTSERVISE + 'viewRepotDetails/' + localStorage.getItem('uuid') + '/' + this.repu + '/' + this.fromDate + '/' + this.toDate + '/2022' + '?access_token=' + localStorage.getItem("access_token");
    } else {
      var downloadUrl = this.data.REPORTSERVISE + 'viewRepotDetails/' + localStorage.getItem('uuid') + '/' + this.repu + '/0/0/' + this.selectyear + '?access_token=' + localStorage.getItem("access_token");
    }
    this.http.get<any>(downloadUrl)
      .subscribe(response => {

      })

  }

  /* Method defination for sending repot from API */
  handleReportForSendingViaEmail = (url,content) => {
    document.body.classList.add('overlay')
    this.http.get<any>(url, {
      headers: {
        "Content-Type": "application/json",
        "authorization": "BEARER " + localStorage.getItem("access_token")
      }
    })
      .subscribe(response => {
        document.body.classList.remove('overlay')
        this.modalService.open(content, {
          centered: true
        });
      })
  }
}
