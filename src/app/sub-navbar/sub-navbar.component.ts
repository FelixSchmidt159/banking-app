import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth-service';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-sub-navbar',
  templateUrl: './sub-navbar.component.html',
  styleUrls: ['./sub-navbar.component.scss']
})
export class SubNavbarComponent implements OnInit {
  collapsed = true;
  mobile = false;

  constructor(public authService: AuthService, public breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 990px)').subscribe(result => {
      this.mobile = result.matches;
    });
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }

}
