import {Component, OnInit} from '@angular/core';
import {Account, Iban, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';
import {UserService} from '../services/user-service';

@Component({
  selector: 'app-revenue-costs-widget',
  templateUrl: './revenue-costs-widget.component.html',
  styleUrls: ['./revenue-costs-widget.component.scss']
})
export class RevenueCostsWidgetComponent implements OnInit {
  ibanArr: Iban[];
  account: Account;
  transactions: Transaction[];

  current = new Date();
  options: any;
  mergeOptions = {};
  data = [
    {
      value: 0,
      itemStyle: {color: 'red'},
    },
    {
      value: 0,
      itemStyle: {color: 'green'},
    }
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const dataAxis = [
      'Ausgaben',
      'Einnahmen'
    ];
    const yMax = 4;
    const dataShadow = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.data.length; i++) {
      dataShadow.push(yMax);
    }

    this.options = {
      xAxis: {
        data: dataAxis,
        axisLabel: {
          inside: false,
          color: '#000',
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
        },
        z: 10,
      },
      yAxis: {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params) => {
          const tar = params[1];
          return tar.name + '<br/>' + tar.value + ' €';
        }
      },
      grid: {
        top: 30,
        bottom: 30,
      },
      series: [
        {
          // For shadow
          name: '',
          type: 'bar',
          itemStyle: {
            color: 'rgba(0,0,0,0.05)'
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false,
        },
        {
          type: 'bar',
          data: this.data,
          label: {
            show: true,
            position: 'outside'
          },
        },
      ],
    };
  }

  getAccount(account: Account): void {
    this.account = account;
    this.ibanArr = this.userService.getIbans(this.account);
    // TODO: Change to n: 10 as soon as backend is finished
    const request: TransactionRequest = {n: 1000, stored: false};
    this.userService.getTransactions(request, this.ibanArr).subscribe((response: TransactionResponse[]) => {
      this.transactions = this.userService.sortTransactions(response);
      this.calculateIncomeAndOutgoing();
    });
  }

  calculateIncomeAndOutgoing(): void {
    let income = 0;
    let outgoing = 0;
    this.transactions.filter((t: Transaction) => {
      const tempDate = new Date(t.timestamp);
      if (tempDate.getMonth() === this.current.getMonth() && t.amount > 0) {
        income = income + t.amount;
      }
      else if (tempDate.getMonth() === this.current.getMonth() && t.amount < 0) {
        outgoing = outgoing + t.amount;
      }
      return tempDate.getMonth() === this.current.getMonth() && t.amount > 0;
    });
    this.data[1].value = income;
    this.data[0].value = outgoing;

    this.mergeOptions = {
      series: [
        {
          name: '',
          type: 'bar',
          itemStyle: {
            color: 'rgba(0,0,0,0.05)'
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          animation: false,
        },
        {
          type: 'bar',
          data: this.data,
          label: {
            show: true,
            position: 'outside'
          },
        },
      ]
    };
  }

}
