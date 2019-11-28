import { Component, OnInit, OnDestroy, NgZone, ViewChild } from '@angular/core';
import { Profil } from '../shared/profil.model';
import { Account } from '../shared/account.model';
import { Subscription } from 'rxjs';
import { AccountService } from '../shared/account.service';
import { ProfilService } from '../shared/profil.service';
import { PaymentsService } from '../shared/payments.service';
import { NavController, Events, ModalController } from '@ionic/angular';
import { ChartComponent } from '../components/chart/chart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('chart', {static: false}) chart: ChartComponent;
  user: Profil;
  account: Account;
  igProfileChanged: Subscription;
  igAccountChanged: Subscription;
  constructor(private accountService: AccountService,
              private profilService: ProfilService,
              private paymentsService: PaymentsService,
              private navCtrl: NavController,
              private zone: NgZone,
              public events: Events,
              private modalCtrl: ModalController
              ){ }

  ngOnInit() {
    this.user = this.profilService.getProfil();
    this.igProfileChanged = this.profilService.profilChanged.subscribe(
      (user: Profil) => {
        this.user = user;
      }
    );
    this.account = this.accountService.getAccount();
    this.igAccountChanged = this.accountService.accountChanged.subscribe(
      (account: Account) => {
        this.account = account;
      }
    );
  }

  ionViewWillEnter() {
    this.chart.ngAfterViewInit();
  }

  ngOnDestroy(): void {
    this.igProfileChanged.unsubscribe();
    this.igAccountChanged.unsubscribe();
  }

}
