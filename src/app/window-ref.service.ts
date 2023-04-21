import { Injectable } from '@angular/core';

export interface IcustomWindow extends Window{
  Razorpay: any;
  custom_global_stuff:string;
}
function getWindow():any{
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  get nativeWindow():IcustomWindow{
    return getWindow();
  }
}
