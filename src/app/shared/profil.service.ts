import { Injectable } from '@angular/core';
import { Profil } from './profil.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  profilChanged = new Subject<Profil>();

  /*private user = new Profil('bc',
                       'Matej',
                       'Randik',
                       666666, '0917070406', 'matej.randik@gmail.com', 'Dolny Hricov', 'Mladeze 394', '01341', 'Slovensko');*/
  private user = new Profil(null, null, null,null,null,null,null,null,null,null);


  constructor(private http: HttpClient) {
   }

   storeProfile() {
    const profile = this.getProfil();
    this.http
      .put(
        'https://ionic-ibank.firebaseio.com/profile.json', profile)
      .subscribe(response => {
      });
  }

  fetchProfile() {
    return this.http
      .get<Profil>(
        'https://ionic-ibank.firebaseio.com/profile.json'
      ).pipe(tap(profil => {
        this.updateProfil(profil);
      }));
  }

  getProfil() {
    return this.user;
  }

  updateProfil(user: Profil) {
    this.user = user;
    this.storeProfile();
    this.profilChanged.next(this.user);
  }

}
