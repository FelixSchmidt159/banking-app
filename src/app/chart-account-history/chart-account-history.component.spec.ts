import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAccountHistoryComponent } from './chart-account-history.component';

describe('ChartAccountHistoryComponent', () => {
  let component: ChartAccountHistoryComponent;
  let fixture: ComponentFixture<ChartAccountHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartAccountHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAccountHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
