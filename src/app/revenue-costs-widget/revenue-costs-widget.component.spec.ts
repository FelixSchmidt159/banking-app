import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueCostsWidgetComponent } from './revenue-costs-widget.component';

describe('RevenueCostsWidgetComponent', () => {
  let component: RevenueCostsWidgetComponent;
  let fixture: ComponentFixture<RevenueCostsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueCostsWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueCostsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
