import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appBuystoplimitdierctive]'
})
export class BuystoplimitdierctiveDirective {


  @Input() limit = 8;
  //private regex: RegExp = new RegExp(/^\d*\.?\d{0,6}$/g);

  //private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]{1,2})?$/);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    let abcd = next.split(".")[1];

    if (abcd.length && abcd.length > this.limit) {
      event.preventDefault();
    }
    // if (next && !String(next).match(this.regex)) {
    //   event.preventDefault();
    // }
  }
/* Start here*/
  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {

    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    let abcd = next.split(".")[1];
    //console.log(`next 0th element => `,next[0])
    //console.log(`next 1th element => `,next[1])
    const dotSymbol = ".";
    if (next[0] === dotSymbol) {
      (this.el.nativeElement as HTMLInputElement).value = '0.';
    }

 
  }
/* ends here */

}
