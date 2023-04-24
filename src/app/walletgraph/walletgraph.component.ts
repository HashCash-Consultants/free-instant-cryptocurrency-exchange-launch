import { Component, OnInit } from "@angular/core";
// import { HttpClient } from '@angular/common/http';
import ApexCharts from "apexcharts/dist/apexcharts.esm.js";
// import {
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexTitleSubtitle,
//   ApexDataLabels,
//   ApexFill,
//   ApexMarkers,
//   ApexYAxis,
//   ApexXAxis,
//   ApexTooltip
// } from "ng-apexcharts";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-walletgraph",
  templateUrl: "./walletgraph.component.html",
  styleUrls: ["./walletgraph.component.css"],
})
export class WalletgraphComponent implements OnInit {
  // public series: ApexAxisChartSeries;
  // public chart: ApexChart;
  // public dataLabels: ApexDataLabels;
  // public markers: ApexMarkers;
  // public title: ApexTitleSubtitle;
  // public fill: ApexFill;
  // public yaxis: ApexYAxis;
  // public xaxis: ApexXAxis;
  // public tooltip: ApexTooltip;
  chartD: any;
  dateD: any = "1m";
  apiData: any;
  apiUrl: string;
  graphDataInit: any;
  selectedDay: string = "";
  loader: boolean;

  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.graphData(this.chartD, this.dateD);
  }

  graphData(dateDuration: any, chartDuration: any): void {
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth();
    var dt = d.getDate();
    var prdt = y + "-" + m + "-" + dt;
    var nxdt = y + "-" + (m + 1) + "-" + dt;
    this.apiData = {
      fromDate: prdt.toString(),
      toDate: nxdt.toString(),
      chartDuration: "Month",
      userId: localStorage.getItem("user_id"),
    };
    this.chartD = chartDuration;
    this.dateD = dateDuration;
    var currentDates = new Date();
    var currentYear = currentDates.getFullYear();
    var currentMonth = currentDates.getMonth() + 1;
    // alert(currentMonth);
    var currentDate = currentDates.getDate();
    var currentDateInput = currentYear + "-" + currentMonth + "-" + currentDate;

    //Three Months Previous Date
    var threeMonthsPreviousDateUnix = currentDates.setFullYear(currentDates.getFullYear(), currentMonth - 3);
    var threeMonthsPreviousDate = new Date(threeMonthsPreviousDateUnix);
    if (threeMonthsPreviousDate.getMonth() == 0) {
      var threeMonthsPreviousDateInput = threeMonthsPreviousDate.getFullYear() + "-12-" + threeMonthsPreviousDate.getDate();
    } else {
      var threeMonthsPreviousDateInput = threeMonthsPreviousDate.getFullYear() + "-" + threeMonthsPreviousDate.getMonth() + "-" + threeMonthsPreviousDate.getDate();
    }

    //Six Months Previous Date
    var sixMonthsPreviousDateUnix = currentDates.setFullYear(currentYear, currentMonth - 6);
    var sixMonthsPreviousDate = new Date(sixMonthsPreviousDateUnix);
    if (sixMonthsPreviousDate.getMonth() == 0) {
      var sixMonthsPreviousDateInput = sixMonthsPreviousDate.getFullYear() - 1 + "-12-" + sixMonthsPreviousDate.getDate();
    } else {
      var sixMonthsPreviousDateInput = sixMonthsPreviousDate.getFullYear() + "-" + sixMonthsPreviousDate.getMonth() + "-" + sixMonthsPreviousDate.getDate();
    }

    //Year Previous Date
    var twlMonthsPreviousDateUnix = currentDates.setFullYear(currentYear - 1, currentMonth);
    var twlMonthsPreviousDate = new Date(twlMonthsPreviousDateUnix);
    var twlMonthsPreviousDateInput = twlMonthsPreviousDate.getFullYear() + "-" + twlMonthsPreviousDate.getMonth() + "-" + twlMonthsPreviousDate.getDate();

    //last Week Date
    var myDate = new Date();
    var newDate = new Date(myDate.getTime() - 60 * 60 * 24 * 7 * 1000);
    var lastWeekDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();

    //last date
    var yesterdayDateUnix = new Date(Date.now() - 864e5);
    var yesterdayDate = yesterdayDateUnix.getFullYear() + "-" + (yesterdayDateUnix.getMonth() + 1) + "-" + yesterdayDateUnix.getDate();

    //1 month date
    var lastMonthDate = new Date(currentYear, currentMonth - 2, currentDate);
    var lastMonthDateForInput = lastMonthDate.getFullYear() + "-" + (lastMonthDate.getMonth() + 1) + "-" + lastMonthDate.getDate();

    var inputObj = {};
    if (dateDuration == d) {
      // if (dateDuration == "1d") {
      //   var fromDate = yesterdayDate;
      // }
      if (dateDuration == "1m") {
        var fromDate = lastMonthDateForInput;
      }
      if (dateDuration == "3m") {
        var fromDate = threeMonthsPreviousDateInput;
      }
      if (dateDuration == "6m") {
        var fromDate = sixMonthsPreviousDateInput;
      }
      // if (dateDuration == "12m") {
      //   var fromDate = twlMonthsPreviousDateInput;
      // }
      if (dateDuration == "1y") {
        var fromDate = twlMonthsPreviousDateInput;
      }
      // if (dateDuration == "5y") {
      //   var fromDate = yesterdayDate;
      // }
    } else {
      var fromDate = lastMonthDateForInput;
    }

    let fromDateArr = fromDate.split('-');
    console.log('fromDateArr => ', fromDateArr)
    let fromYear = fromDateArr[0];
    let fromMonth = fromDateArr[1];
    let fromDay = fromDateArr[2];
    if (parseInt(fromMonth) < 10) {
      fromMonth = '0' + fromMonth;
    }
    if (parseInt(fromDay) < 10) {
      fromDay = '0' + fromDay;
    }
    fromDate = fromYear + '-' + fromMonth + '-' + fromDay

    let toDateArr = currentDateInput.split('-');
    console.log('toDateArr => ', toDateArr)
    let toYear = toDateArr[0];
    let toMonth = toDateArr[1];
    let toDay = toDateArr[2];
    if (parseInt(toMonth) < 10) {
      toMonth = '0' + toMonth;
    }
    if (parseInt(toDay) < 10) {
      toDay = '0' + toDay;
    }
    currentDateInput = toYear + '-' + toMonth + '-' + toDay

    inputObj["fromDate"] = fromDate;
    inputObj["toDate"] = currentDateInput;
    inputObj["userId"] = localStorage.getItem("user_id");
    inputObj["uuid"] = localStorage.getItem("uuid");
    if (chartDuration == undefined) {
      inputObj["chartDuration"] = "Month";
    } else {
      inputObj["chartDuration"] = chartDuration;
    }
    var jsonString = JSON.stringify(inputObj);
    this.apiUrl = "https://accounts.paybito.com/api/transaction/GetUserPortfolioGraph";
    this.apiData = jsonString;
    this.http
      .post<any>(this.apiUrl, this.apiData, {
        headers: { "content-Type": "application/json" },
      })
      .subscribe((result) => {
        this.graphDataInit = result.response;
        var graphDataArr = [];
        if (this.graphDataInit.length != 0) {
          for (var i = 0; i < this.graphDataInit.length; i++) {
            if (this.graphDataInit != "") {
              graphDataArr.push([this.graphDataInit[i].HIST_DATE, this.graphDataInit[i].VALUE]);
            }
          }
        } else {
          graphDataArr = [];
        }
        var options = {
          series: [
            {
              name: "",
              data: graphDataArr,
            },
          ],
          chart: {
            type: "area",
            stacked: false,
            height: 350,
            zoom: {
              type: "x",
              enabled: true,
              autoScaleYaxis: true,
            },
            toolbar: {
              autoSelected: "zoom",
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 0,
          },
          title: {
            text: "My Portfolio Value",
            align: "center",
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 0,
              stops: [0, 90, 100],
            },
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return val.toFixed(0);
              },
            },
            title: {
              text: "Balance In (USD)",
            },
          },
          xaxis: {
            type: "datetime",
            labels: {
              show: true,
              rotate: -45,
              rotateAlways: false,
              hideOverlappingLabels: true,
              showDuplicates: false,
              trim: false,
              minHeight: 65,
              maxHeight: 220,
            },
            title: {
              text: "Day",
            },
          },

          tooltip: {
            shared: false,
            y: {
              formatter: function (val) {
                return val.toFixed(0);
              },
            },
          },
          grid: {
            show: true,
            borderColor: '#90A4AE',


          },
        };
        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
        document.getElementById("walletblnc").style.display = "block";

      });
  }

  test(event: any): void {
    this.selectedDay = event.target.value;
    document.getElementById("chart").innerHTML = "";
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth();
    var dt = d.getDate();
    var prdt = y + "-" + m + "-" + dt;
    var nxdt = y + "-" + (m + 1) + "-" + dt;
    this.apiData = {
      fromDate: prdt.toString(),
      toDate: nxdt.toString(),
      chartDuration: "Month",
      userId: localStorage.getItem("user_id"),
    };
    this.chartD = this.selectedDay;
    var currentDates = new Date();
    var currentYear = currentDates.getFullYear();
    var currentMonth = currentDates.getMonth() + 1;
    var currentDate = currentDates.getDate();
    var currentDateInput = currentYear + "-" + currentMonth + "-" + currentDate;

    var threeMonthsPreviousDateUnix = currentDates.setFullYear(currentDates.getFullYear(), currentMonth - 3);
    var threeMonthsPreviousDate = new Date(threeMonthsPreviousDateUnix);
    if (threeMonthsPreviousDate.getMonth() == 0) {
      var threeMonthsPreviousDateInput = threeMonthsPreviousDate.getFullYear() + "-12-" + threeMonthsPreviousDate.getDate();
    } else {
      var threeMonthsPreviousDateInput = threeMonthsPreviousDate.getFullYear() + "-" + threeMonthsPreviousDate.getMonth() + "-" + threeMonthsPreviousDate.getDate();
    }

    var sixMonthsPreviousDateUnix = currentDates.setFullYear(currentYear, currentMonth - 6);
    var sixMonthsPreviousDate = new Date(sixMonthsPreviousDateUnix);
    if (sixMonthsPreviousDate.getMonth() == 0) {
      var sixMonthsPreviousDateInput = sixMonthsPreviousDate.getFullYear() - 1 + "-12-" + sixMonthsPreviousDate.getDate();
    } else {
      var sixMonthsPreviousDateInput = sixMonthsPreviousDate.getFullYear() + "-" + sixMonthsPreviousDate.getMonth() + "-" + sixMonthsPreviousDate.getDate();
    }

    var twlMonthsPreviousDateUnix = currentDates.setFullYear(currentYear - 1, currentMonth);
    var twlMonthsPreviousDate = new Date(twlMonthsPreviousDateUnix);
    var twlMonthsPreviousDateInput = twlMonthsPreviousDate.getFullYear() + "-" + twlMonthsPreviousDate.getMonth() + "-" + twlMonthsPreviousDate.getDate();

    var fiveyaerPreviousDateUnix = currentDates.setFullYear(currentYear + 5, currentMonth);
    var fiveYearsPreviousDate = new Date(fiveyaerPreviousDateUnix);
    var fiveYearsPreviousDateInput = fiveYearsPreviousDate.getFullYear() + "-" + fiveYearsPreviousDate.getMonth() + "-" + fiveYearsPreviousDate.getDate();

    var myDate = new Date();
    var newDate = new Date(myDate.getTime() - 60 * 60 * 24 * 7 * 1000);
    var lastWeekDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();

    var yesterdayDateUnix = new Date(Date.now() - 864e5);
    var yesterdayDate = yesterdayDateUnix.getFullYear() + "-" + (yesterdayDateUnix.getMonth() + 1) + "-" + yesterdayDateUnix.getDate();
    var lastMonthDate = new Date(currentYear, currentMonth - 2, currentDate);
    var lastMonthDateForInput = lastMonthDate.getFullYear() + "-" + (lastMonthDate.getMonth() + 1) + "-" + lastMonthDate.getDate();

    var inputObj = {};
    if (this.chartD != undefined) {
      if (this.chartD == "1d") {
        var fromDate = yesterdayDate;
      }
      if (this.chartD == "1m") {
        var fromDate = lastMonthDateForInput;
      }
      if (this.chartD == "3m") {
        var fromDate = threeMonthsPreviousDateInput;
      }
      if (this.chartD == "6m") {
        var fromDate = sixMonthsPreviousDateInput;
      }
      // if (dateDuration == "12m") {
      //   var fromDate = twlMonthsPreviousDateInput;
      // }
      if (this.chartD == "1y") {
        var fromDate = twlMonthsPreviousDateInput;
      }
      if (this.chartD == "5y") {
        var fromDate = fiveYearsPreviousDateInput;
      }
    } else {
      var fromDate = lastMonthDateForInput;
    }

    let fromDateArr = fromDate.split('-');
    console.log('fromDateArr => ', fromDateArr)
    let fromYear = fromDateArr[0];
    let fromMonth = fromDateArr[1];
    let fromDay = fromDateArr[2];
    if (parseInt(fromMonth) < 10) {
      fromMonth = '0' + fromMonth;
    }
    if (parseInt(fromDay) < 10) {
      fromDay = '0' + fromDay;
    }
    fromDate = fromYear + '-' + fromMonth + '-' + fromDay

    let toDateArr = currentDateInput.split('-');
    console.log('toDateArr => ', toDateArr)
    let toYear = toDateArr[0];
    let toMonth = toDateArr[1];
    let toDay = toDateArr[2];
    if (parseInt(toMonth) < 10) {
      toMonth = '0' + toMonth;
    }
    if (parseInt(toDay) < 10) {
      toDay = '0' + toDay;
    }
    currentDateInput = toYear + '-' + toMonth + '-' + toDay


    inputObj["fromDate"] = fromDate;
    inputObj["toDate"] = currentDateInput;
    inputObj["userId"] = localStorage.getItem("user_id");
    inputObj["uuid"] = localStorage.getItem("uuid");
    if (this.chartD == undefined) {
      inputObj["chartDuration"] = "Month";
    } else {
      inputObj["chartDuration"] = this.chartD;
    }
    var jsonString = JSON.stringify(inputObj);
    this.apiUrl = "https://accounts.paybito.com/api/transaction/GetUserPortfolioGraph";
    this.apiData = jsonString;
    this.http
      .post<any>(this.apiUrl, this.apiData, {
        headers: { "content-Type": "application/json" },
      })
      .subscribe((result) => {
        this.graphDataInit = result.response;
        var graphDataArr = [];
        if (this.graphDataInit.length != 0) {
          for (var i = 0; i < this.graphDataInit.length; i++) {
            if (this.graphDataInit != "") {
              graphDataArr.push([this.graphDataInit[i].HIST_DATE, this.graphDataInit[i].VALUE]);
            }
          }
        } else {
          graphDataArr = [];
        }
        var options = {
          series: [
            {
              name: "",
              data: graphDataArr,
            },
          ],
          chart: {
            type: "area",
            stacked: false,
            height: 350,
            zoom: {
              type: "x",
              enabled: true,
              autoScaleYaxis: true,
            },
            toolbar: {
              autoSelected: "zoom",
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 0,
          },
          title: {
            text: "My Portfolio Value",
            align: "center",
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 0,
              stops: [0, 90, 100],
            },
          },
          yaxis: {
            labels: {
              formatter: function (val) {
                return val.toFixed(0);
              },
            },
            title: {
              text: "Balance In (USD)",
            },
          },
          xaxis: {
            type: "datetime",
            labels: {
              show: true,
              rotate: -45,
              rotateAlways: false,
              hideOverlappingLabels: true,
              showDuplicates: false,
              trim: false,
              minHeight: 65,
              maxHeight: 220,
            },
            title: {
              text: "Day",
            },
          },

          tooltip: {
            shared: false,
            y: {
              formatter: function (val) {
                return val.toFixed(0);
              },
            },
          },
        };
        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();

        document.body.classList.remove("overlay");
      });
  }
}
