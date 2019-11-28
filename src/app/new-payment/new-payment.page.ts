import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaymentsService } from '../shared/payments.service';
import { AccountService } from '../shared/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Payment, PaymentCategory, PaymentType } from '../shared/payment.model';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.page.html',
  styleUrls: ['./new-payment.page.scss'],
})
export class NewPaymentPage implements OnInit {
  newPaymentForm: FormGroup;
  constructor(private paymentService: PaymentsService,
              private accountService: AccountService, private router: Router,
              private route: ActivatedRoute,
              private componentFactoryResolver: ComponentFactoryResolver,
              private navCtrl: NavController,
              private alertController: AlertController) { }

  ngOnInit() {
    this.initForm();
  }
  onSubmit() {
    if (!this.newPaymentForm.valid) {
      return;
    }
    const value = this.newPaymentForm.value;
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);
    if (this.accountService.verifyPayment(value.suma)) {
      const newPayment = new Payment(null,PaymentCategory.PlatbaPrevodom,
                                      PaymentType.Debety,
                                      (today.toDateString()),
                                      (tomorrow.toDateString()),
                                      value.description, value.suma);
      this.accountService.onAccountBalanceChange(value.suma, PaymentType.Debety);
      this.paymentService.addPayment(newPayment).subscribe(() => {
        this.onCancel();
      });
    }
    else {
      this.presentAlertConfirm();
    }
  }

  onCancel() {
    this.navCtrl.pop();
    this.router.navigateByUrl('/home');
  }

  initForm() {
    this.newPaymentForm = new FormGroup({
      prijemca: new FormControl(null , {
        validators: [Validators.pattern('[0-9]{4}[0-9]{3}[0-9]{3}'), Validators.required]
      }),
      suma: new FormControl(null, {
        validators: [Validators.required, Validators.min(1)]
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(180)]
      }),
    });
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Nedostatok zdrojov',
      message: '<strong>Na účte nieje dostatatočný zostatok</strong>!!!',
      buttons: [ {
          text: 'Okay',
          handler: () => {
            this.newPaymentForm = new FormGroup({
              prijemca: new FormControl(this.newPaymentForm.value.prijemca),
              suma: new FormControl(null),
              description: new FormControl(this.newPaymentForm.value.description)
            });
          }
        }
      ]
    });

    await alert.present();
  }
}




