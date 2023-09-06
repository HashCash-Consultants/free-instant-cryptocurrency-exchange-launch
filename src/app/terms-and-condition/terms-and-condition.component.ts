import { Component, OnInit } from '@angular/core';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.css']
})
export class TermsAndConditionComponent implements OnInit {

  constructor(public data:CoreDataService) { }

  ngOnInit() {
  }

}
