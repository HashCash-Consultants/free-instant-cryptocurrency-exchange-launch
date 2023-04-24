import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myfilter',
  pure: false
})
export class SearchPipe implements PipeTransform {

  transform(myBalanceList: any, filter: string): any {
    if(!myBalanceList || !filter){
      return myBalanceList;
    }
    return myBalanceList.filter(b =>b.currencyCode.toLowerCase().startsWith(filter.toLowerCase()) === true);
  }

}
