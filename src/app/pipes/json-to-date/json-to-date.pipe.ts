import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonToDate'
})
export class JsonToDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return new Date(value.year, value.month, value.day);
  }

}
