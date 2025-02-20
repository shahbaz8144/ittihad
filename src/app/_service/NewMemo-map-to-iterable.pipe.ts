// map-to-iterable.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mapToIterable',
})
export class NewMapToIterablePipe implements PipeTransform {
    transform(value: any, arg: string): any {
        if (!value) {
            return [];
        }
        const iterable: { key: string; value: any }[] = [];
        const distinctNames = [...new Set(value.map(item => item[arg]))];
        distinctNames.forEach(element => {
            let _grparray = [];
            _grparray = value.filter(x => x[arg] == element);
            iterable.push({ key: element.toString(), value: _grparray });
        });
        return iterable;
    }
}
