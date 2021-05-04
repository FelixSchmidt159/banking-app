import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
  Account,
  Balance,
  Iban,
  PriorBalanceRequest,
  Transaction,
  TransactionRequest,
  TransactionResponse
} from '../api/Api';
import {AppSettings} from '../../app-settings';
import {forkJoin, Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {

  accountsWidgetSubject = new Subject<Account>();
  transactionWidgetSubject = new Subject<Account>();
  transactionFinanceSite = new Subject<Transaction[]>();

  constructor(private router: Router, private http: HttpClient) {
  }

  public getTransactions(request: TransactionRequest, ibanArr: Iban[]): Observable<TransactionResponse[]> {

    const obs: Array<Observable<TransactionResponse>> = [];
    for (const iban of ibanArr) {
      obs.push(
        this.http.post<TransactionResponse>
        (AppSettings.baseUrl + '/transactions/' + iban, request));

    }
    return forkJoin<Observable<TransactionResponse>[]>(obs);
  }

  public getAllAccounts(): Observable<{ accounts: Account[] }> {
    const path = AppSettings.baseUrl + '/accounts';
    return this.http.get<{ accounts: Account[] }>(path);
  }

  public getBalances(request: PriorBalanceRequest, ibanArr: Iban[]):
    Observable<Balance[][]> {

    const obs: Array<Observable<Balance[]>> = [];
    for (const iban of ibanArr) {
      obs.push(
        this.http.post<Balance[]>
        (AppSettings.baseUrl + '/balances/' + iban, request));

    }
    return forkJoin<Observable<Balance[]>[]>(obs);

  }

  public sendTransaction(request: Transaction, method: string): Observable<void> {
    const path = AppSettings.baseUrl + '/transaction';
    return this.http.request<void>(method, path, {body: request}) as Observable<void>;
  }

  public getIbans(account?: Account): Iban[] {
    if (account == null || account.name === 'Alle Konten') {
      return JSON.parse(sessionStorage.getItem('user')).accounts;
    }
    return [account.iban];
  }

  public sortTransactions(response: TransactionResponse[]): Transaction[] {
    let transactions: Transaction[] = [];
    for (const transactionResponse of response) {
      transactions = transactions.concat(transactionResponse.transactions);
    }
    transactions = this.sort(transactions);
    return transactions;
  }

  compare = (v1: Date, v2: Date) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  sort(transactions: Transaction[]): Transaction[] {
    return [...transactions].sort((a, b) => {
      const res = this.compare(a.timestamp, b.timestamp);
      return -res;
    });
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
    return trans1.timestamp.getTime() === trans2.timestamp.getTime();
  }

}
