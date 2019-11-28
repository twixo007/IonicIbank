import { Component, OnInit, OnDestroy } from '@angular/core';
import { Profil } from '../shared/profil.model';
import { Subscription } from 'rxjs';
import { ProfilService } from '../shared/profil.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit, OnDestroy {
  user: Profil;
  private igProfileChanged: Subscription;

  ngOnDestroy(): void {
    this.igProfileChanged.unsubscribe();
  }
  constructor(private userProfilService: ProfilService,
              private route: ActivatedRoute,
              private router: Router,
              ) { }

  ngOnInit() {
    this.user = this.userProfilService.getProfil();
    this.igProfileChanged = this.userProfilService.profilChanged.subscribe(
      (user: Profil) => {
        this.user = user;
      }
    );
  }

  onEdit() {
    this.router.navigate(['/', 'profil', 'profil-edit']);
  }

}
