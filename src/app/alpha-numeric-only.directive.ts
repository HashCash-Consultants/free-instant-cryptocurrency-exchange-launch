import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphaNumericOnly]'
})
export class AlphaNumericOnlyDirective {

  constructor() { }

  @HostListener("keydown", ["$event"]) public onKeydown(event: KeyboardEvent) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-_ ]+|[\b]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
}

}
