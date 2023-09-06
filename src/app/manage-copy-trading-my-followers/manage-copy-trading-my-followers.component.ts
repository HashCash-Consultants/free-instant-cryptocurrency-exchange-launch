import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-manage-copy-trading-my-followers',
  templateUrl: './manage-copy-trading-my-followers.component.html',
  styleUrls: ['./manage-copy-trading-my-followers.component.css']
})
export class ManageCopyTradingMyFollowersComponent implements OnInit {

  Themecolor: string = 'Dark';
  myFollowers: any = {};

  constructor(private modalService: NgbModal, public route: Router, public http: HttpClient, public data: CoreDataService) { }

  ngOnInit() {
    this.getMyFollowers();
  }


  getMyFollowers() {



    this.http.get<any>(this.data.COPYTRADINGSERVICE + '/apiKey/getMyFollowersDetails/' + localStorage.getItem('user_id'),
      {
        headers:
        {
          'content-Type': 'application/json',
          'authorization': 'BEARER ' + localStorage.getItem('access_token'),
        }
      })
      .subscribe(response => {

        console.log('get all api keys', response)

        this.myFollowers = response;



      })
  }
  themeChangedHandler(e) {

  }

}
