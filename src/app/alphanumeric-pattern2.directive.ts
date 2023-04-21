import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAlphanumericPattern2]'
})
export class AlphanumericPattern2Directive {

  regexStr = '^[a-zA-Z0-9 ]*$';
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
