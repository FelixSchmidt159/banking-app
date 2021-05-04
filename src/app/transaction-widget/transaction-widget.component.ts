import {Component} from '@angular/core';
import {UserService} from '../services/user-service';
import {Account, Iban, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-transaction-widget',
  templateUrl: './transaction-widget.component.html',
  styleUrls: ['./transaction-widget.component.scss']
})
export class TransactionWidgetComponent {

  ibanArr: Iban[];
  account: Account;
  transactions: Transaction[];

  constructor(private userService: UserService, private router: Router) {
  }

  checkBalance(amount): string {
    if (amount >= 0) {
      return 'green';
    } else {
      return 'red';
    }
  }

  getAccount(account: Account): void {
    this.account = account;
    this.ibanArr = this.userService.getIbans(this.account);
    // TODO: Change to n: 10 as soon as backend is finished
    const request: TransactionRequest = {n: 1000, stored: false};
    this.userService.getTransactions(request, this.ibanArr).subscribe((response: TransactionResponse[]) => {
      this.transactions = this.userService.sortTransactions(response);
    });
  }

  async onSubmit(): Promise<void> {
    this.userService.accountsWidgetSubject.next(this.account); // delete maybe
    await this.router.navigateByUrl('/transaction/overview', { state: { acc: this.account }});
  }
}
