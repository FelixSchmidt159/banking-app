import {Component, OnInit} from '@angular/core';
import {Account} from '../api/Api';
import {UserService} from '../services/user-service';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {Router} from '@angular/router';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-accounts-widget',
  templateUrl: './accounts-widget.component.html',
  styleUrls: ['./accounts-widget.component.scss', './../accounts-dropdown/accounts-dropdown.component.scss']
})
export class AccountsWidgetComponent implements OnInit {
  accounts: Account[] = [{iban: '', balance: 0, name: '', accountType: '', limit: 0}];
  selectedAccount = {iban: '', balance: 0, name: '', accountType: '', limit: 0};

  constructor(private userService: UserService, private library: FaIconLibrary, private router: Router) {
    library.addIcons(faPlus);
  }

  ngOnInit(): void {
    this.userService.getAllAccounts().subscribe(({accounts}) => {
      this.accounts = accounts;
      this.selectedAccount = accounts[0];
    });
  }

  async onSubmit(selectedAccount): Promise<void> {
    this.userService.accountsWidgetSubject.next(selectedAccount);
    await this.router.navigateByUrl('/transaction/new_transaction', { state: { acc: selectedAccount }});
  }

  hideAccountSum(acc): boolean {
    return acc.name !== 'Alle Konten';
  }

}
