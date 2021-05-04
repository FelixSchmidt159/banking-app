import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Account, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';
import {UserService} from '../services/user-service';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-accounts-dropdown-lg',
  templateUrl: './accounts-dropdown-lg.component.html',
  styleUrls: ['./accounts-dropdown-lg.component.scss', '../accounts-dropdown/accounts-dropdown.component.scss']
})
export class AccountsDropdownLgComponent implements OnInit {
  @Input() currAcc;
  @Output() currAccChange = new EventEmitter<Account>();
  @Input() accounts;
  transactions: Transaction[];

  constructor(private userService: UserService, private library: FaIconLibrary) {
    library.addIcons(faCaretDown);
  }

  ngOnInit(): void {
    this.userService.getAllAccounts().subscribe(({accounts}) => {
      this.accounts = accounts;
      if (this.currAcc.iban === '') {
        this.currAcc = this.accounts[0];
      }
      this.changeSelectedAccount(this.currAcc);
    });
  }

  changeSelectedAccount(currentAccount: Account): void {
    this.currAcc = currentAccount;
    this.currAccChange.emit(currentAccount);
    this.userService.accountsWidgetSubject.next(currentAccount);

    const request: TransactionRequest = {n: 1000, stored: false};
    this.userService.getTransactions(request, [currentAccount.iban]).subscribe((response: TransactionResponse[]) => {
      this.transactions = this.userService.sortTransactions(response);
      this.transactions.map((trans: Transaction) => {
        trans.timestamp = new Date(trans.timestamp);
      });
      this.userService.transactionFinanceSite.next(this.transactions);
    });
  }

}
