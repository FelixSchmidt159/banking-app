import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Account} from '../api/Api';
import {UserService} from '../services/user-service';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-accounts-dropdown',
  templateUrl: './accounts-dropdown.component.html',
  styleUrls: ['./accounts-dropdown.component.scss']
})
export class AccountsDropdownComponent implements OnInit {

  @Output() currAcc = new EventEmitter<Account>();
  accounts: Account[] = [{iban: '', balance: 0, name: '', accountType: '',  limit: 0 }];
  selectedAccount: Account = {iban: '', balance: 0, name: '', accountType: '',  limit: 0 };

  constructor(private userService: UserService, private library: FaIconLibrary) {
    library.addIcons(faCaretDown);
  }

  ngOnInit(): void {
    this.userService.getAllAccounts().subscribe(( { accounts } ) => {
      this.accounts = accounts;
      this.selectedAccount = accounts[0];
      this.addAllAccountsEntry();
      this.changeSelectedAccount(this.selectedAccount);
    });
  }

  addAllAccountsEntry(): void {
    let sum = 0;
    for (const acc of this.accounts) {
      sum = sum + acc.balance;
    }
    this.accounts.splice(0, 0, {iban: '', balance: sum, name: 'Alle Konten', accountType: 'All',  limit: 0 });
  }

  changeSelectedAccount(currentAccount: Account): void {
    this.selectedAccount = currentAccount;
    this.currAcc.emit(currentAccount);
  }

}
