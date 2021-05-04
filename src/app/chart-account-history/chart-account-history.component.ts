import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Account, Iban, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';
import {UserService} from '../services/user-service';
import { DatePipe } from '@angular/common';
import {FormControl, FormGroup} from '@angular/forms';
import {TableService} from '../services/table-service';

@Component({
  selector: 'app-chart-account-history',
  templateUrl: './chart-account-history.component.html',
  styleUrls: ['./chart-account-history.component.scss']
})
export class ChartAccountHistoryComponent implements OnInit, AfterViewInit {
  account: Account;
  ibanArr: Iban[];
  transactions: Transaction[];
  accounts: Account[] = [{iban: '', balance: 0, name: '', accountType: '', limit: 0}];

  current = new Date();
  datePipe: DatePipe =  new DatePipe('en-US');
  allDays = [];
  dataSeries = [];
  options: any;
  mergeOptions = {series: [], xAxis: {}};

  filterActive = false;
  removable = true;
  showDateError = false;
  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  constructor(private userService: UserService, private tableService: TableService) {}

  ngAfterViewInit(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.showDateError = this.tableService.setShowDateError(this.toDate, this.fromDate, this.filterForm);
    });
  }

  ngOnInit(): void {

    this.calculateXAxisDays(this.current, 30);
    const legend = [];

    this.userService.getAllAccounts().subscribe( ({accounts}) => {
      this.accounts = accounts;

      let i;
      for (i = 0; i < accounts.length; i++) {
        legend.push(accounts[i].name);
        this.dataSeries.push(
          {
            iban: accounts[i].iban,
            name: accounts[i].name,
            data: [],
          }
        );

        this.mergeOptions.series.push(
          {
            name: accounts[i].name,
            type: 'line',
            data: [],
          }
        );
      }

      this.options = {
        title: {
          text: 'Monatsübersicht',
          show: false
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          },
          dataZoom: {
            yAxisIndex: 'none'
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.allDays,
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }, {
          start: 0,
          end: 10
        }],
        series: this.mergeOptions.series
      };

      const request: TransactionRequest = {n: 1000, stored: false};
      this.userService.getTransactions(request, this.userService.getIbans()).subscribe((response: TransactionResponse[]) => {
        this.transactions = this.userService.sortTransactions(response);
        this.addTransactions();
      });

    });


  }

  calculateXAxisDays(fromDate: Date, amountOfDays: number): void {
    this.allDays = [];
    let i;
    for (i = amountOfDays; i >= 0; i--) {
      const newDate = new Date(fromDate.getTime() - i * ( 24 * 60 * 60 * 1000));
      this.allDays.push(this.datePipe.transform(newDate, 'd.M.yy'));
    }
  }

  addTransactions(): void {
    this.transactions.forEach((trans: Transaction) => {
      const index = this.dataSeries.findIndex(b => b.iban === trans.iban);
      this.dataSeries[index].data.push(trans);
    });
    this.sumPerDay(new Date(this.current.getTime() - 30 * ( 24 * 60 * 60 * 1000)), this.current);
  }

  sumPerDay(fromDate: Date, toDate: Date): void {
    let i: number;
    const initFromDate = fromDate;
    this.mergeOptions = {series: [], xAxis: {}};

    this.mergeOptions.xAxis = {
      type: 'category',
      boundaryGap: false,
      data: this.allDays,
    };

    for (i = 0; i < this.accounts.length; i++) {
      this.mergeOptions.series.push(
        {
          name: this.accounts[i].name,
          type: 'line',
          data: [],
        }
      );

      while (fromDate.getTime() <= toDate.getTime()) {
        this.mergeOptions.series[i].data.push(this.filterByDateAndMonth(fromDate, this.accounts[i].iban));
        fromDate = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);
      }
      fromDate = initFromDate;
    }
  }

  filterByDateAndMonth(day: Date, iban: string): number {
    let moneyPerDay = 0;

    const index = this.dataSeries.findIndex(b => b.iban === iban);
    const help = this.dataSeries[index].data;

    let i;
    for (i = 0; i < help.length; i++) {
      const trans = help[i];
      const temp = new Date(trans.timestamp);
      if ( (trans.iban === iban || trans.complementaryIban === iban) &&
        temp.getDate() === day.getDate() &&
        temp.getMonth() === day.getMonth() &&
        temp.getFullYear() === day.getFullYear()) {
        moneyPerDay = moneyPerDay + trans.amount;
      }
    }
    return moneyPerDay;
  }

  get fromDate(): Date {
    return this.filterForm.get('fromDate').value;
  }

  get toDate(): Date {
    return this.filterForm.get('toDate').value;
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filterActive = false;
    this.calculateXAxisDays(this.current, 30);
    this.sumPerDay(new Date(this.current.getTime() - 30 * ( 24 * 60 * 60 * 1000)), this.current);
  }

  getDateRange(): void {
    this.filterActive = true;

    const toDate = this.tableService.getDate('toDate', this.filterForm);
    const fromDate = this.tableService.getDate('fromDate', this.filterForm);

    const DifferenceInTime = toDate.getTime() - fromDate.getTime();
    const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
    this.calculateXAxisDays(toDate, DifferenceInDays);
    this.sumPerDay(fromDate, toDate);

  }

}
