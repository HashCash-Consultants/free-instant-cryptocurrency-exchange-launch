import { Component } from '@angular/core';
import { CoreDataService } from './core-data.service';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Router,NavigationEnd } from '@angular/router';
import { TradesComponent } from './trades/trades.component';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
declare function changeColor(componentName): any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private modalService: NgbModal, private data: CoreDataService, private http: HttpClient, private route: Router, private trade: TradesComponent,private titleService: Title ) {

    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.route.url != '/dashboard') {
        clearInterval(this.trade.tradeInterval);
      }
      if(this.route.url === '/'){
        this.titleService.setTitle('Broker Exchange');  
      }
      // route path taken for changing color dynamicly in google tnaslate icon
      if (this.route.url === '/' || this.route.url === '/login'|| this.route.url==='/otp'||
      this.route.url === '/signup' ||this.route.url === '/social-signup' || this.route.url.indexOf('/signup/') >-1
      )
      {
        changeColor(false);
      }
      else{
        changeColor(true);
      }
    });
  }

  warn(warn) {
    this.modalService.open(warn);
  }
}