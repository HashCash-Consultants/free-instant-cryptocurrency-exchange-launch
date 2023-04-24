import { Component, OnInit } from '@angular/core';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor(public data:CoreDataService) { }

  ngOnInit() {
  }

}
