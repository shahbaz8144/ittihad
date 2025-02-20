import { Injectable } from '@angular/core';
import { 
  format, 
  isToday, 
  isYesterday, 
  startOfToday, 
  startOfWeek, 
  subWeeks, 
  subMonths, 
  startOfMonth, 
  isBefore, 
  isAfter 
} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateCategorizerService {

  constructor() { }

  categorizeDates(dates: Date[]): { [key: string]: Date[] } {
    const categories: { [key: string]: Date[] } = {
      'Today': [],
      'Yesterday': [],
      'Sunday': [],
      'Monday': [],
      'Tuesday': [],
      'Wednesday': [],
      'Thursday': [],
      'Friday': [],
      'Saturday': [],
      'Last Week': [],
      'Two Weeks Ago': [],
      'Three Weeks Ago': [],
      'Last Month': [],
      'Older': [],
    };

    const today = startOfToday();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startOfCurrentWeek = startOfWeek(today);
    const startOfLastWeek = startOfWeek(subWeeks(today, 1));
    const startOfTwoWeeksAgo = startOfWeek(subWeeks(today, 2));
    const startOfThreeWeeksAgo = startOfWeek(subWeeks(today, 3));
    const startOfLastMonth = startOfMonth(subMonths(today, 1));

    for (const date of dates) {
      if (isToday(date)) {
        categories['Today'].push(date);
      } else if (isYesterday(date)) {
        categories['Yesterday'].push(date);
      } else if (isAfter(date, startOfCurrentWeek)) {
        const dayName = format(date, 'EEEE'); // Get day name
        categories[dayName].push(date);
      } else if (isBefore(date, today) && isAfter(date, startOfLastWeek)) {
        categories['Last Week'].push(date);
      } else if (isBefore(date, startOfLastWeek) && isAfter(date, startOfTwoWeeksAgo)) {
        categories['Two Weeks Ago'].push(date);
      } else if (isBefore(date, startOfTwoWeeksAgo) && isAfter(date, startOfThreeWeeksAgo)) {
        categories['Three Weeks Ago'].push(date);
      } else if (isBefore(date, startOfThreeWeeksAgo) && isAfter(date, startOfLastMonth)) {
        categories['Last Month'].push(date);
      } else {
        categories['Older'].push(date);
      }
    }

    return categories;
  }
}