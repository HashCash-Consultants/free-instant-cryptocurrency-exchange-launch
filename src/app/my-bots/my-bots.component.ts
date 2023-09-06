import { Component, OnInit, DoCheck } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import { BodyService } from '../body.service'
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {
  NgbModal, NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-bots',
  templateUrl: './my-bots.component.html',
  styleUrls: ['./my-bots.component.css']
})
export class MyBotsComponent implements OnInit {
  Themecolor: string;
  allApiKeys: any;
  botStatus: number;
  pageNo: number = 1;
  itemNo: number = 50;
  pgn: any = [];
  no_of_records: any;

  constructor(private http: HttpClient, public data: CoreDataService, public main: BodyService, private modalService: NgbModal, private activeModal: NgbActiveModal, public route: Router) { }

  public allBots: Array<string> = [];


  /* method defination for opening create new bot modal */
  handleOpenCreateBotModal = (elem) => {
    this.modalService.open(elem, {
      centered: true
    });
  }

  /* Method defination for fetchinf all bots list */
  getAllBots = () => {
    let payload = {
      customerId: parseInt(localStorage.getItem('user_id')),
      botId: 0,
      pageNo: this.pageNo,
      itemNo: this.itemNo
    }
    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/GetBotDetails', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        // if (result.error.error_data != '0') {
        //   this.data.alert(result.error.error_msg, 'danger');
        // } else {
        this.allBots = result.botDetails;
        this.no_of_records = result.no_of_records
        this.pgn = [];
        for (let i = 1; i <= Math.ceil(this.no_of_records / this.itemNo); i++) {
          this.pgn.push(i);
        }

        console.log('lengthsss', this.pgn);

        // }
      }, reason => {
        this.data.alert('Internal Server Error', 'danger')
      });
  }


  /* Method defination for fetchinf all bots list */
  getAllApiKeys = () => {
    let payload = {
      customerId: parseInt(localStorage.getItem('user_id')),
      botId: 0
    }
    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/GetApiKey', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        var result = response;
        // if (result.error.error_data != '0') {
        //   this.data.alert(result.error.error_msg, 'danger');
        // } else {
        this.allApiKeys = result.botDetails;
        // }
      }, reason => {
        this.data.alert('Internal Server Error', 'danger')
      });
  }

  ngOnInit() {
    this.getAllBots();
    this.getAllApiKeys();
  }
  ngDoCheck() {

    this.Themecolor = localStorage.getItem('themecolor');
    //console.log('saved theme', this.Themecolor)
  }
  themeChangedHandler(val) {

    this.Themecolor = val;

  }

  gotoEditBot(bot) {
    // alert('This feature is under development');
    // console.log('test')

    var botData = JSON.stringify(bot);

    localStorage.setItem('botDatalocalSave', botData)


    var url = 'my-bots/edit-bot';
    this.route.navigateByUrl(url);

  }


  deleteBot(id) {

    var x = confirm('Are you sure you want to delete the bot?');

    if (x == true) {

      let payload = {
        botId: id
      }

      console.log('botId', payload)
      this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/DeleteBotDetails', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
        .subscribe(response => {

          if (response.error.error_data == 0) {
            this.data.alert(response.error.error_msg, 'success');

          }
          else {

            this.data.alert(response.error.error_msg, 'danger');


          }
          this.getAllBots();

          // var result = response;
          // this.allBots = result.botDetails;
          // }
        }, reason => {
          // this.data.alert('Internal Server Error', 'danger')
        });


    }
    else {
      //nothing to do
    }



  }

  pauseBot(id, status) {

    let payload = {
      botId: id,
      action: status
    }

    console.log('pauseeee', payload)

    // if(isRunning == 1){
    //   var runningStatus = 'pause';
    // }
    // else{
    //   var runningStatus  = 'running';
    // }

    this.http.post<any>(this.data.COPYTRADINGSERVICE + '/bot/PauseResumeBot', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {

        if (response.error.error_data != '0') {
          this.data.alert(response.error.error_msg, 'danger');
        } else {
          this.data.alert(response.error.error_msg, 'success');

        }

        this.getAllBots();


      }, reason => {
        this.data.alert('Internal Server Error', 'danger')
      });

  }


  changeBotIsActiveStatus(event, botId) {
    if (event.target.checked == true) {
      this.botStatus = 1;
    }
    else {
      this.botStatus = 0;

    }

    this.http.get<any>(this.data.COPYTRADINGSERVICE + '/bot/UpdateBotDetails/' + botId + '/' + this.botStatus,
      {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
      .subscribe(response => {

        console.log('response', response)

        if (response.error.error_data != '0') {
          this.data.alert(response.error.error_msg, 'danger');
        } else {
          this.data.alert(response.error.error_msg, 'success');

        }

        //   this.getAPIKeys();
        // this.getTradingBots();

        // this.allTradingBots = response.apiKeyList;



      })
  }

  pager(pg) {

    this.pageNo = pg;
    // this.main.transactionHistory(pg,this.Themecolor);
    this.getAllBots();
  }
  pagerNext(pg) {

    pg++;
    this.pageNo = pg;
    // this.main.transactionHistory(pg,this.Themecolor);
    this.getAllBots();
  }
  pagerPre(pg) {
    pg--;
    this.pageNo = pg;
    // this.main.transactionHistory(pg,this.Themecolor);
    this.getAllBots();
  }


}
