import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-bot',
  templateUrl: './view-bot.component.html',
  styleUrls: ['./view-bot.component.css']
})
export class ViewBotComponent implements OnInit {

  Themecolor: string = 'Dark';
  constructor() { }

  ngOnInit() {
  }
  themeChangedHandler(e){

  }

}
