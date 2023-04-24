import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoreDataService } from '../core-data.service';
import { BodyService } from '../body.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  constructor(private http:HttpClient, private data:CoreDataService, private main:BodyService) { }

  ngOnInit() {
    this.main.getDashBoardInfo();
  }

  message;
  subject;

  supportMail(){
    if(this.message!=undefined && this.subject!=undefined){
        var supportObj={};
        supportObj['user_id']=localStorage.getItem('user_id');
        supportObj['email']=localStorage.getItem('email');
        supportObj['subject']=this.subject;
        supportObj['message']=this.message;
        supportObj['name']=localStorage.getItem('user_name');
        var jsonString=JSON.stringify(supportObj);
        this.http.post<any>(this.data.WEBSERVICE+'/user/SendMailToUser',jsonString,{headers: {
                'Content-Type': 'application/json',
                'authorization': 'BEARER '+localStorage.getItem('access_token'),
            }})
        .subscribe(response=>{
            var result=response;
            if(result.error.error_data!='0'){
                 this.data.alert(result.error.error_msg,'danger');
            }else{
                this.data.alert('Mail Sent , We Will Contact You Shortly','success');
                this.subject='';
                this.message='';
            }
        },function(reason){
          if(reason.data.error=='invalid_token'){ this.data.logout();}else{ this.data.alert('Could Not Connect To Server','danger');}
        });

    }else{
        this.data.alert('Please provide proper details','warning');
    }
}

}
