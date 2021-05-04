import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionWidgetComponent } from './transaction-widget.component';

describe('TransactionWidgetComponent', () => {
  let component: TransactionWidgetComponent;
  let fixture: ComponentFixture<TransactionWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
