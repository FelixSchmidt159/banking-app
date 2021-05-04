import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TransferOrdersComponent} from './transfer-orders.component';


describe('TransferOrdersComponent', () => {
  let component: TransferOrdersComponent;
  let fixture: ComponentFixture<TransferOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferOrdersComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
