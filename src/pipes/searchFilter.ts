import {Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
@Injectable()
export class SearchFilter implements PipeTransform {
    transform(items: any[], args: any[]): any {
        return items.filter(item => item.resto.Name.indexOf(args[0]) !== -1);
    }
}