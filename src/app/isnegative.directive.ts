import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appIsnegative]'
})
export class IsnegativeDirective {

  constructor() { }
    @HostListener('keydown', ['$event'])
    onKeyDown(e:any){
      if(e.key === '-'){
        e.preventDefault();
      }
    }
}
