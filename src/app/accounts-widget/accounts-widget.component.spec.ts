import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsWidgetComponent } from './accounts-widget.component';

describe('AccountsWidgetComponent', () => {
  let component: AccountsWidgetComponent;
  let fixture: ComponentFixture<AccountsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
