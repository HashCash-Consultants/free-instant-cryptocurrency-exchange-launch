import { Component, Input, OnInit } from '@angular/core';
import { CoreDataService } from '../core-data.service';
import { BodyService } from '../body.service'
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-social-drawer',
  templateUrl: './social-drawer.component.html',
  styleUrls: ['./social-drawer.component.css']
})
export class SocialDrawerComponent implements OnInit {

  isDrawerOpen: boolean = false;
  selectedSocialBrand: string = ''
  questionField: string = ''
  @Input() Themecolor = 'Dark';

  constructor(private http: HttpClient, public data: CoreDataService, public main: BodyService) { }

  /* Method defination for selecting social button */
  handleSelectSocialBrand = (param) => {
    this.selectedSocialBrand = param;
    this.questionField = '';
  }

  /* Method defination for posting question button click */
  handlePostQuestion = () => {
    let shareUrl = 'https://www.paybito.com/download-app-paybito.php?uuid=' + localStorage.getItem('uuid') +'&from=exchange';

    if (this.selectedSocialBrand == 'Facebook') {

      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl), '',
        'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');

    } else if (this.selectedSocialBrand == 'Twitter') {
      if (this.questionField != '') {

        let title = this.questionField + '%0a%0aRespond to my above question in the comments. Try out the trading platform I am using. Here is the link to sign up to the platform.'
        window.open("https://twitter.com/share?title=" + title + "&url=" + encodeURIComponent(shareUrl), '',
          'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
      } else {
        this.data.alert('Please provide a valid question', 'danger')
      }

    } else if (this.selectedSocialBrand == 'Whatsapp') {
      if (this.questionField != '') {

        let title = this.questionField + '%0a%0aPlease respond to my above question here. Try out the trading platform I am using. Here is the link to sign up to the platform.'

        window.open('https://api.whatsapp.com/send?text=' + title + '%0a' + encodeURIComponent(shareUrl), '',
          'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
      } else {
        this.data.alert('Please provide a valid question', 'danger')
      }
    } else if (this.selectedSocialBrand == 'LinkedIn') {

      window.open("https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(shareUrl), '',
        'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    }
    this.selectedSocialBrand = '';
    this.questionField = '';

  }
  /* Method defination for toggling drawer */
  handleToggleDrawer = () => {
    this.selectedSocialBrand = '';
    this.questionField = '';
    this.isDrawerOpen = !this.isDrawerOpen;
    if (this.isDrawerOpen) {
      document.getElementById("mySidenav").style.width = "250px";
    } else {
      document.getElementById("mySidenav").style.width = "0";
    }
  }

  ngOnInit() {

  }

}
