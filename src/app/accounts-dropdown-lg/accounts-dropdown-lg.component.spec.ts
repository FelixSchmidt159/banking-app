import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsDropdownLgComponent } from './accounts-dropdown-lg.component';

describe('AccountsDropdownLgComponent', () => {
  let component: AccountsDropdownLgComponent;
  let fixture: ComponentFixture<AccountsDropdownLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsDropdownLgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsDropdownLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
