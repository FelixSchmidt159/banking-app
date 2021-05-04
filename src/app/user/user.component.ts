import {Component, OnInit} from '@angular/core';
import {Account, UserData} from '../api/Api';
import {UserService} from '../services/user-service';

export class Widget {
  typ: string;
  id: number;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
  public accounts: Account[];
  public widgets: Widget[] = [];
  public counter = 0;
  public userdata: UserData;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getAllAccounts().subscribe(( { accounts } ) => {
      this.accounts = accounts;
    });

    this.userdata = JSON.parse(sessionStorage.getItem('user'));
  }

  addComponent(): void {
    const newWidget = new Widget();
    newWidget.typ = 'empty';
    this.counter += 1;
    newWidget.id = this.counter;
    this.widgets.push(newWidget);
  }


}
