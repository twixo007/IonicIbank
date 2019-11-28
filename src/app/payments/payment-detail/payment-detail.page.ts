import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/shared/payment.model';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PaymentsService } from 'src/app/shared/payments.service';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.page.html',
  styleUrls: ['./payment-detail.page.scss'],
})
export class PaymentDetailPage implements OnInit {
  payment: Payment;
  constructor(private navCtrl: NavController,
              private route: ActivatedRoute,
              private paymentService: PaymentsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('paymentId')) {
        this.navCtrl.navigateBack('/payments');
        return;
      }
      this.payment = this.paymentService.getPaymentById(paramMap.get('paymentId'));
    });
  }

}
