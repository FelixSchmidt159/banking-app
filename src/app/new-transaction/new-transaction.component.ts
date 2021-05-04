import {Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user-service';
import {Account, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';
import {NgbDatepickerConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit {
  account: Account = {iban: '', balance: 0.00, name: '', accountType: '', limit: 0};
  accounts: Account[] = [{iban: '', balance: 0, name: '', accountType: '', limit: 0}];
  accountObs: Observable<any>;
  savedTransactions: Transaction[];
  paymentUsageContent = false;
  transactionForm: FormGroup;
  savedTransactionsForm: FormGroup;
  minDate = undefined;
  tempDate = new Date();
  userdata = JSON.parse(sessionStorage.getItem('user'));
  httpType = '';
  checked = false;
  tanModal: NgbModalRef;
  @ViewChild('successContent') successContent: ElementRef;
  @ViewChild('failContent') failContent: ElementRef;
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  errorMsg = '';

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private config: NgbDatepickerConfig,
              private modalService: NgbModal,
              private route: ActivatedRoute) {
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  ngOnInit(): void {
    this.accountObs = this.route.paramMap
      .pipe(map(() => window.history.state));

    this.userService.getAllAccounts().subscribe(({accounts}) => {
      this.accounts = accounts;

      this.accountObs.subscribe(a => {
        if (a.acc !== undefined) {
          this.account = a.acc;
        } else {
          this.account = this.accounts[0];
        }
      });
    });

    const tempDate = new Date();
    this.transactionForm = this.fb.group({
      timestamp: [{
        year: tempDate.getFullYear(),
        month: tempDate.getMonth() + 1,
        day: tempDate.getDate()
      }, Validators.required],
      amount: [Validators.required],
      text: new FormArray([]),
      textType: ['Zahlungsreferenz'],
      type: [''],
      iban: [''],
      complementaryIban: ['', Validators.required],
      complementaryName: [''],
    });
    this.onChangeTextType(1);

    this.savedTransactionsForm = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    });

    const request: TransactionRequest = {n: 1000, stored: true};
    this.userService.getTransactions(request, this.userService.getIbans()).subscribe((response: TransactionResponse[]) => {
      this.savedTransactions = this.userService.sortTransactions(response);
    });
  }

  setPaymentUsageContent(paymentUsageContent: boolean): void {
    this.paymentUsageContent = paymentUsageContent;
  }

  get transaction(): { [p: string]: AbstractControl } {
    return this.transactionForm.controls;
  }

  get transactionArray(): FormArray {
    return this.transaction.text as FormArray;
  }

  get savedTrans(): { [p: string]: AbstractControl } {
    return this.savedTransactionsForm.controls;
  }

  get savedTransCheckArray(): FormArray {
    return this.savedTrans.checkArray as FormArray;
  }

  storeTransaction(requestType: string, content?: TemplateRef<any>): void {
    this.sendTransaction(requestType, content);
  }

  sendSavedTrans(): void {
    let i = 0;
    for (const trans of this.savedTransCheckArray.value) {
      if (trans !== null && trans.iban !== '' && trans.amount > 0) {
        this.userService.sendTransaction(trans, 'POST').subscribe(() => {
          this.savedTransactions.forEach((item: Transaction) => {
            if (this.compareTransactions(item, trans)) {
              this.savedTransactions.splice(i, 1);
              return;
            }
            i++;
          });
          i = 0;
          this.fetchAccount();
        });
      }
    }
    this.savedTransCheckArray.reset();
  }

  deleteSavedTrans(): void {
    let i = 0;
    for (const trans of this.savedTransCheckArray.value) {
      if (trans !== null && trans.iban !== '' && trans.amount > 0) {
        this.userService.sendTransaction(trans, 'DELETE').subscribe((tran: void) => {
          this.savedTransactions.forEach((item: Transaction) => {
            if (this.compareTransactions(item, trans)) {
              this.savedTransactions.splice(i, 1);
              return;
            }
            i++;
          });
          i = 0;
        });
      }
    }
    this.savedTransCheckArray.reset();
  }

  convertValues(): void {
    this.transactionForm.value.iban = this.account.iban;

    this.tempDate.setFullYear(
      this.transactionForm.value.timestamp.year,
      this.transactionForm.value.timestamp.month - 1,
      this.transactionForm.value.timestamp.day
    );
    if (typeof this.transactionForm.value.timestamp !== 'string') {
      this.transactionForm.value.timestamp = this.tempDate.toISOString();
      this.transactionForm.value.text = this.transactionForm.value.text.map(x => x.text).join('\n');
    }
  }

  sendTransaction(requestType: string, content?: TemplateRef<any>): void {
    if (this.transactionForm.valid) {
      this.httpType = requestType;
      this.convertValues();

      this.userService.sendTransaction(this.transactionForm.value, requestType).subscribe(() => {
        if (this.tanModal !== undefined) {
          this.tanModal.close();
        }
        if (requestType === `PUT`) {
          this.savedTransactions.push(this.transactionForm.value);
        } else {
          this.fetchAccount();
          this.openVerticallyCentered(this.successContent);
        }
        this.onClear();
      }, error => {
        this.modalService.dismissAll();
        if (this.tanModal !== undefined) {
          this.tanModal.close();
        }
        this.errorMsg = error.error.error;
        this.openVerticallyCentered(this.failContent);
        this.onClear();

        // TODO: Uncomment if transaction should be stored if limit was exceeded
        // if (error.status === 403) {
        //   if (error.error.error === 'limit exceeded') {
        //     this.sendTransaction('PUT', content);
        //   } else {
        //     this.openVerticallyCentered(content);
        //     this.onClear();
        //   }
        // }
      });
    }
  }

  fetchAccount(): void {
    this.userService.getAllAccounts().subscribe(({accounts}) => {
      this.accounts = accounts;
      this.account = accounts.filter((a: Account) => a.iban === this.account.iban)[0];
    });
  }

  onChangeTextType(e): void {
    const numberOfRows = e;
    if (this.transactionArray.length < numberOfRows) {
      for (let i = this.transactionArray.length; i < numberOfRows; i++) {
        this.transactionArray.push(this.fb.group({
          text: [''],
        }));
      }
    } else {
      for (let i = this.transactionArray.length; i >= numberOfRows; i--) {
        this.transactionArray.removeAt(i);
      }
    }
  }

  onClear(): void {
    this.tempDate = new Date();
    this.transactionForm.controls.timestamp.reset({
      year: this.tempDate.getFullYear(),
      month: this.tempDate.getMonth() + 1, day: this.tempDate.getDate()
    }, Validators.required);
    this.transactionForm.controls.amount.reset(Validators.required);
    this.transactionArray.reset();
    this.transactionForm.controls.textType.reset('Zahlungsreferenz');
    this.transactionForm.controls.type.reset('');
    this.transactionForm.controls.complementaryIban.reset('', Validators.required);
    this.transactionForm.controls.complementaryName.reset('');
    this.setPaymentUsageContent(false);
    this.onChangeTextType(1);
  }

  onCheckboxChange(data: Transaction, check?: boolean, e?): void {
    let i = 0;
    let found = false;
    if (check || (e !== undefined && e.target.checked)) {
      i = 0;
      this.savedTransCheckArray.controls.forEach((item: FormControl) => {
        if (this.compareTransactions(item.value, data)) {
          found = true;
        }
        i++;
      });
      if (!found) {
        this.savedTransCheckArray.push(new FormControl(data));
      }
    } else {
      i = 0;
      this.savedTransCheckArray.controls.forEach((item: FormControl) => {
        if (this.compareTransactions(item.value, data)) {
          this.savedTransCheckArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  checkIfCheckboxSelected(): boolean {
    return this.savedTransCheckArray.length <= 0;
  }

  openVerticallyCentered(content): void {
    this.tanModal = this.modalService.open(content, {centered: true});
  }

  getMoneyPerIban(iban: string): number {
    let money = 0;
    this.savedTransCheckArray.value.map((trans: Transaction) => {
      if (trans !== null && iban === trans.iban) {
        money += trans.amount;
      }
    });
    return money;
  }

  allMarked(): number {
    let money = 0;
    this.savedTransCheckArray.value.map((trans: Transaction) => {
      if (trans !== null) {
        money += trans.amount;
      }
    });
    return money;
  }

  compareTransactions(trans1: Transaction, trans2: Transaction): boolean {
    if (trans1 === null || trans2 === null) {
      return false;
    }
    if (trans1.type !== trans2.type) {
      return false;
    }
    if (trans1.text !== trans2.text) {
      return false;
    }
    if (trans1.complementaryName !== trans2.complementaryName) {
      return false;
    }
    if (trans1.complementaryIban !== trans2.complementaryIban) {
      return false;
    }
    if (trans1.amount !== trans2.amount) {
      return false;
    }
    if (trans1.textType !== trans2.textType) {
      return false;
    }
    if (trans1.iban !== trans2.iban) {
      return false;
    }
    return trans1.timestamp === trans2.timestamp;
  }

  checkAll(): void {
    this.savedTransactions.forEach((item: Transaction) => {
      this.onCheckboxChange(item, true);
    });
  }

  uncheckAll(): void {
    this.savedTransactions.forEach((item: Transaction) => {
      this.onCheckboxChange(item, false);
    });

    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  setChecked(bool: boolean): void {
    this.checked = bool;
    if (!bool) {
      this.uncheckAll();
    } else {
      this.checkAll();
    }
  }

  checkSavedTransactions(): boolean {
    if (this.savedTransactions !== undefined) {
      return (this.savedTransactions.length > 0);
    }
    return false;
  }

  savedTransactionsContainsIban(iban: string): boolean {
    let t;
    for (t of this.savedTransactions) {
      if (t.iban === iban) {
        return true;
      }
    }
    return false;
  }

  checkLimit(amount): string {
    if (this.account.limit === undefined) {
      this.account.limit = 0;
    }
    if (this.account.balance - amount < this.account.limit) {
      return 'red';
    }
    return '';
  }

  checkLimits(): boolean {
    let available = 0;
    let limitExceeded = false;
    this.accounts.map((a: Account) => {
      if (a.iban !== null) {
        available = this.getAvailableAmount(a.iban);
        if (available < 0) {
          limitExceeded = true;
        }
      }
    });
    return limitExceeded;
  }

  findAccountByIban(iban: string): Account {
    let account: Account = null;
    this.accounts.map((a: Account) => {
      if (a !== null && a.iban === iban) {
        account = a;
      }
    });
    return account;
  }

  getAvailableAmount(iban: string): number {
    const currentBalance = this.findAccountByIban(iban).balance;
    let available = 0;
    let limit = 0;
    if (this.findAccountByIban(iban) !== null) {
      limit = this.findAccountByIban(iban).limit;
    }
    available = currentBalance - this.getMoneyPerIban(iban) - limit;
    return available;
  }

}
