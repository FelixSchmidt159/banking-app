import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsDropdownComponent } from './accounts-dropdown.component';

describe('AccountsDropdownComponent', () => {
  let component: AccountsDropdownComponent;
  let fixture: ComponentFixture<AccountsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
