import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Profil } from 'src/app/shared/profil.model';
import { Subscription } from 'rxjs';
import { ProfilService } from 'src/app/shared/profil.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validatable } from '@amcharts/amcharts4/core';

@Component({
  selector: 'app-profil-edit',
  templateUrl: './profil-edit.page.html',
  styleUrls: ['./profil-edit.page.scss'],
})
export class ProfilEditPage implements OnInit {
  editForm: FormGroup;
  profil: Profil;
  igProfileChanged: Subscription;
  constructor(private profilService: ProfilService, private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }
  onSubmit() {
    this.profil = this.editForm.value;
    this.profilService.updateProfil(this.profil);
    this.onCancel();
  }

  onCancel() {
    this.router.navigateByUrl('/profil');
  }

  initForm() {
    const user = this.profilService.getProfil();


    this.editForm = new FormGroup({
      pid: new FormControl(user.pid),
      title: new FormControl(user.title  , {
        validators: [Validators.pattern('[a-zA-Z]*')]
      }),
      name: new FormControl(user.name, {
        validators: [Validators.pattern('[a-zA-Z]*'), Validators.required]
      }),
      surname: new FormControl(user.surname, {
        validators: [Validators.pattern('[a-zA-Z]*'), Validators.required]
      }),
      email: new FormControl(user.email, {
        validators: [Validators.email, Validators.required]
      }),
      city: new FormControl(user.city, {
        validators: [Validators.pattern('[a-zA-Z ]*'), Validators.required]
      }),
      street: new FormControl(user.street, {
        validators: [Validators.pattern('[a-zA-Z 0-9]*'), Validators.required]
      }),
      phoneNumber: new FormControl(user.phoneNumber, {
        validators: [Validators.pattern('[0-9]{4}[0-9]{3}[0-9]{3}'), Validators.required]
      }),
      state: new FormControl(user.state, {
        validators: [Validators.pattern('[a-zA-Z ]*'), Validators.required]
      }),
      psc: new FormControl(user.psc, {
        validators: [Validators.required, Validators.pattern('[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}')]
      }),

    });
  }

}
