import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAlphaNumericOnly]'
})
export class AlphaNumericOnlyDirective {

//   constructor() { }

//   @HostListener("keydown", ["$event"]) public onKeydown(event: KeyboardEvent) {
//     var inp = String.fromCharCode(event.keyCode);

//     // if (/[^0-9a-zA-Z\-\s]+|[\b]/.test(inp)) {
//     //   return true;
//     // } else {
//     //   event.preventDefault();
//     //   return false;
//     // }

    
 
// }

regexStr = '^[a-zA-Z0-9 _,-/]*$';
@Input() isAlphaNumeric: boolean;

constructor(private el: ElementRef) {}

@HostListener('keypress', ['$event']) onKeyPress(event) {
  return new RegExp(this.regexStr).test(event.key);
}

@HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
  this.validateFields(event);
}

validateFields(event) {
  console.log(event.target.value);
  setTimeout(() => {
    this.el.nativeElement.value = this.el.nativeElement.value
      .replace(/[^A-Za-z ]/g, '')
      .replace(/\s/g, '');
    event.preventDefault();
  }, 100);
}

}
