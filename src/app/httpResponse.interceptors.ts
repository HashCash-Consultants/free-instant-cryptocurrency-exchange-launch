import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HTTP_INTERCEPTORS,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
  } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError, finalize, tap } from 'rxjs/operators';
import { CoreDataService } from './core-data.service';
import { Router } from '@angular/router';


@Injectable()
export class HttpResponseInterceptors implements HttpInterceptor {

  constructor(public route: Router) {
    console.log('err response', this.route.url);
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): any{
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    return next.handle(request).pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {

            console.log('err response', err.status);
            


          
            
  
            if (err.status === 401 || err.status === 403 || err.status === 0) {


              if(this.route.url == '/' 
              || this.route.url == '' 
              || this.route.url == '/login' 
              || this.route.url == '/signup'
              || this.route.url == '/otp'
              || this.route.url == '/forgot-password'
  
              ){

                //do not reload the page
  
              }
              else{

                var themecolor = localStorage.getItem('themecolor');

                setTimeout(() => {
                  this.Deletecookies();
                  localStorage.clear();
                }, 5000);
                localStorage.setItem('themecolor', themecolor);
                this.route.navigateByUrl('/');
                //this.handlePageReloadForecibily(100)
                localStorage.setItem('isReloadPage', 'true');

              }

            }
  
            // return the error back to the caller
            return throwError(err);
          }
        }),
        finalize(() => {
          // any cleanup or final activities
        }),
        
      );
  }




  Deletecookies() {
    var cookieName = 'Username';
    var cookieName1 = 'userId';
    var cookieName2 = 'ssecca';
    document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.paybito.com;path=/';
    document.cookie = cookieName1 + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.paybito.com;path=/';
    document.cookie = cookieName2 + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.paybito.com;path=/';
  }
}



// export const LoadingInterceptor = {
//   provide: HTTP_INTERCEPTORS,
//   useClass: LoadingIndicatorInterceptor,
//   multi: true,
// };
