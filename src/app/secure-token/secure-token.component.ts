import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoreDataService } from '../core-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-secure-token',
  templateUrl: './secure-token.component.html',
  styleUrls: ['./secure-token.component.css']
})
export class SecureTokenComponent implements OnInit {

  signupObj:any;
  email: any;

  constructor(private http:HttpClient, private data:CoreDataService, private route:Router) { }

  ngOnInit() {
  }

            //signup function
      secureToken(isValid){
              if(isValid){
                var tokenObj={};
                tokenObj['email']=this.email;
                var jsonString=JSON.stringify(tokenObj);
                // wip(1);
                //login webservice
                this.http.post<any>(this.data.WEBSERVICE+'/user/SendOtp/securetoken',jsonString,{headers: {
                    'Content-Type': 'application/json'
                  }})
               .subscribe(response=>{
                  // wip(0);

                  var result=response;
                  if(result.error.error_data!='0'){
                    this.data.alert(result.error.error_msg,'danger');
                  }else{
                  this.data.alert('Secure Token sent to registered email','success');
                  this.route.navigateByUrl('/forget-password');
                  }

                },function(reason){
                  // wip(0);
                  this.data.alert('Internal Server Error','danger')
                });
              }else{
                this.data.alert('Please provide valid email','warning');
              }
            }

}
