import { Component, OnInit, OnDestroy } from '@angular/core';
import { Payment, PaymentType } from '../shared/payment.model';
import { Subscription } from 'rxjs';
import { PaymentsService } from '../shared/payments.service';
import { IonItemSliding, MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit, OnDestroy {
  loadedPayments: Payment[];
  listedLoadedPayments: Payment[];
  filteredPayments: Payment[];
  isLoading = false;
  subscription: Subscription;
  
  constructor(private paymentsService: PaymentsService, private menuCtrl: MenuController) { }

  ngOnInit() {
    this.subscription = this.paymentsService.paymentsChanged.subscribe(
      (payment: Payment[]) => {
        this.loadedPayments = payment.reverse();
        this.filteredPayments = this.loadedPayments;
        this.listedLoadedPayments = this.loadedPayments.slice(1);
      }
    );
    this.loadedPayments = this.paymentsService.getPayments().reverse();
    this.filteredPayments = this.loadedPayments;
    this.listedLoadedPayments = this.loadedPayments.slice(1);
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.paymentsService.fetchPayments().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.filteredPayments = this.loadedPayments;
      this.listedLoadedPayments = this.filteredPayments.slice(1);
    } else if (event.detail.value === 'kredits') {
      this.filteredPayments = this.loadedPayments.filter(payment => payment.paymentType === PaymentType.Kredity);
      this.listedLoadedPayments = this.filteredPayments.slice(1);
    } else if (event.detail.value === 'debets') {
      this.filteredPayments = this.loadedPayments.filter(payment => payment.paymentType === PaymentType.Debety);
      this.listedLoadedPayments = this.filteredPayments.slice(1);
    }
  }

  getColor(payment: Payment) {
    return payment.paymentType === PaymentType.Kredity ? 'green' : 'red';
  }

  getSign(payment: Payment) {
    return payment.paymentType === PaymentType.Kredity ? '+' : '-';
  }
  



}
