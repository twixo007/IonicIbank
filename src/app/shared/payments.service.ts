import { Injectable } from '@angular/core';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Payment, PaymentCategory, PaymentType } from './payment.model';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  paymentsChanged = new BehaviorSubject<Payment[]>([]);
  /*private payments: Payment[] = [
    new Payment('1',PaymentCategory.Bankomat,
                PaymentType.Debety,
                (new Date('2019-10-26').toDateString()),
                (new Date('2019-10-27').toDateString()),
                 'Bankomat Dlhe Diely', 200),
    new Payment('2',PaymentCategory.Cestovanie,
                PaymentType.Debety,
                (new Date('2019-10-26').toDateString()),
                (new Date('2019-10-27').toDateString()),
                 'Bankomat Dlhe Diely', 50),
    new Payment('3',PaymentCategory.Cestovanie,
                PaymentType.Debety,
                (new Date('2019-10-26').toDateString()),
                (new Date('2019-10-27').toDateString()),
                 'Bankomat Dlhe Diely', 50),
    new Payment('4',PaymentCategory.Ostatne,
                PaymentType.Debety,
                (new Date('2019-10-26').toDateString()),
                (new Date('2019-10-27').toDateString()),
                 'Bankomat Dlhe Diely', 15),
    new Payment('5',PaymentCategory.Supermarket,
                PaymentType.Debety,
                (new Date('2019-10-26').toDateString()),
                (new Date('2019-10-27').toDateString()),
                 'Bankomat Dlhe Diely', 33),
    new Payment('6',PaymentCategory.NakladyNaByvanie,
                PaymentType.Debety,
                (new Date('2019-10-26').toDateString()),
                (new Date('2019-10-27').toDateString()),
                 'Bankomat Dlhe Diely', 250),
    new Payment('7',PaymentCategory.Ostatne,
                PaymentType.Debety,
                (new Date('2019-10-26').toDateString()),
                (new Date('2019-10-27').toDateString()),
                 'Bankomat Dlhe Diely', 25),
    new Payment('8',PaymentCategory.NakladyNaByvanie,
                  PaymentType.Kredity,
                  (new Date('2019-10-23').toDateString()),
                  (new Date('2019-10-25').toDateString()),
                    'Billa Majernikova', 33)
  ];*/
  private payments: Payment[] = [];
  constructor(private http: HttpClient) { }


  getPayments() {
    //console.log(this.payments);
    return this.payments.slice();
  }

  getPayment(index: number) {
    return this.payments.slice()[index];
  }

  getPaymentById(id: string) {
    return { ...this.payments.find(p => p.id === id) };
  }

  storePayments() {
    const payments = this.getPayments();
    this.http
      .put(
        'https://ionic-ibank.firebaseio.com/payments.json',
        payments
      )
      .subscribe(response => {
      });
  }

  fetchPayments() {
    return this.http
      .get<{ [key: string]: Payment }>(
        'https://ionic-ibank.firebaseio.com/payments.json'
      )
      .pipe(
        map(resData => {
          const payments = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              payments.push(
                new Payment(
                  key,
                  resData[key].paymentCategory,
                  resData[key].paymentType,
                  resData[key].dateOfTransaction,
                  resData[key].dateOfMerge,
                  resData[key].place,
                  resData[key].amount,
                )
              );
            }
          }
          this.payments = payments;
          //console.log(this.payments);
          return payments;
          // return [];
        }),
        tap(payment => {
          this.paymentsChanged.next(payment);
        })
      );
  }

  addPayment(newPayment: Payment) {
    let generatedId: string;
    return this.http.post<{name: string}>('https://ionic-ibank.firebaseio.com/payments.json', {...newPayment, id: null})
    .pipe(
      switchMap(resDate => {
        generatedId = resDate.name;
        return this.payments;
      }),
      take(1),
      tap(payment => {
        newPayment.id = generatedId;
        this.payments.push(newPayment);
        this.paymentsChanged.next(this.payments.slice());
      })
    ); 
  }

  getNextId() {
    return this.payments[this.payments.length - 1].id + 1;
  }

  setPayments(payments: Payment[])
  {
    this.payments = payments;
    this.paymentsChanged.next(this.payments.slice());
  }
}