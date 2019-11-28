import { Injectable } from '@angular/core';
import { Account } from './account.model';
import { Subject } from 'rxjs';
import { PaymentType } from './payment.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  /*private account = new Account('SK20 1100 0000 00 13 1234 5678', 3337.23);*/
  private account: Account = new Account(null, null);
  accountChanged = new Subject<Account>();
  constructor(private http: HttpClient) { }

  getAccount() {
    return this.account;
  }

  storeAccount() {
    const account = this.getAccount();
    this.http
      .put(
        'https://ionic-ibank.firebaseio.com/account.json',
        account
      )
      .subscribe(response => {
      });
  }

  fetchAccount() {
    return this.http
      .get<Account>(
        'https://ionic-ibank.firebaseio.com/account.json'
      ).pipe(tap(acc => {
        this.updateAccount(acc);
      }));
  }

  verifyPayment(platba: number) {
    if ( (this.account.balance - platba)  >= 0 ) {
      return true;
    }
    return false;
  }

  onAccountBalanceChange(platba: number, type: PaymentType) {
    if (type === PaymentType.Debety) {
      this.account.balance -= platba;
    } else if (type === PaymentType.Kredity) {
      this.account.balance += platba;
    }
    this.updateAccount(this.account);
  }

  updateAccount(acc: Account) {
    this.account = acc;
    this.accountChanged.next(this.account);
    this.storeAccount();
  }

}
