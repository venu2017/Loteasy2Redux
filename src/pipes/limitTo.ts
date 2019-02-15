import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class LimitToPipe {
  transform(value: Array<any>, args: number)  {
    // let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
    // let trail = args.length > 1 ? args[1] : '...';
    let limit = args ? args : 0;
   return value.length > limit ? value.splice(0,value.length-limit):value.length;
  }
}