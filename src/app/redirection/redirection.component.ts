import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreDataService } from '../core-data.service';

@Component({
  selector: 'app-redirection',
  templateUrl: './redirection.component.html',
  styleUrls: ['./redirection.component.css']
})
export class RedirectionComponent implements OnInit {
  redirecUrl: any;

  constructor(private route: Router, private data: CoreDataService, private router: ActivatedRoute) { 

    
    

  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.redirecUrl = params['url'];
      console.log('redirect in const', this.redirecUrl);
     this.route.navigateByUrl(this.redirecUrl);

    });



    // this.redirecUrl = this.router.snapshot.queryParamMap.get('url');
     
    //this.data.reloadPage(this.redirecUrl)
    // this.route.navigateByUrl('/identity-verification');
    

  }

}
