import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filterByName'
  })
  export class FilterNamesPipe implements PipeTransform {

    transform(listOfNames: string[], nameToFilter: string=''): string[] {
          var upperLetter = nameToFilter.toUpperCase();
          if (!listOfNames) return null;
          // console.log('listOfNames', listOfNames, 'nameToFilter', nameToFilter, 'upperLetter', upperLetter );
          if (!nameToFilter || nameToFilter === '') return listOfNames;
          return listOfNames.filter(name => 
            name.toUpperCase().startsWith(upperLetter)
          )
    }
  
  }
