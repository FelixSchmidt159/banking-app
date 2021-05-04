import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {Transaction} from '../api/Api';
import {UserService} from './user-service';

@Injectable({providedIn: 'root'})

export class TableService {

  constructor(private userService: UserService) { }

  getDate(date: string, form: FormGroup): Date {
    const tempDate = new Date();
    if (date === 'fromDate') {
      tempDate.setFullYear(
        form.value.fromDate.year,
        form.value.fromDate.month - 1,
        form.value.fromDate.day
      );
      tempDate.setHours(0, 0, 0);
    } else {
      tempDate.setFullYear(
        form.value.toDate.year,
        form.value.toDate.month - 1,
        form.value.toDate.day
      );
      tempDate.setHours(23, 59, 59);
    }
    return tempDate;
  }

  checkBalance(amount: number): string {
    if (amount >= 0) {
      return 'green';
    } else {
      return 'red';
    }
  }

  setShowDateError(toDateIn, fromDateIn, form: FormGroup): boolean {
    if (toDateIn != null && fromDateIn != null) {
      const toDate = this.getDate('toDate', form);
      const fromDate = this.getDate('fromDate', form);

      return fromDate > toDate;
    } else {
      return false;
    }
  }

  checkFutureDate(date): boolean {
    const tempDate = new Date(date);
    const now = new Date();
    return now < tempDate;
  }

  germanRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 von ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} von ${length}`;
  }

  isLastPage(dataSource: MatTableDataSource<Transaction>): boolean {
    if (dataSource.paginator !== undefined && !dataSource.paginator.hasNextPage()) {
      return true;
    }
    return false;
  }

  concatArrays(transactions: Transaction[], newTransactions: Transaction[]): Transaction[] {
    // concat arrays and sort them
    transactions = newTransactions.concat(transactions);
    transactions = this.userService.sort(transactions);

    // delete duplicates
    for (let i = 0; i < transactions.length - 1; i++) {
      if (this.userService.compareTransactions(transactions[i], transactions[i + 1])) {
        transactions.splice(i + 1, 1);
      }
    }

    return transactions;
  }

}
