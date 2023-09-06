import { Component, OnInit } from '@angular/core';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(public data: CoreDataService) { }

  ngOnInit() {
  }

}
