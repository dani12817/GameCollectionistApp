import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../providers/user.service';
import { AuthService } from '../../providers/auth.service';

import { FormClass } from '../../shared/form-class';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-data',
  templateUrl: 'user-data.page.html',
  styleUrls: ['user-data.page.scss'],
})
export class UserDataPage {
  userDataForm: FormClass; userData: User;
  userAvatar: {file: File, url: string | ArrayBuffer} = {file: null, url: null};
  reader = new FileReader()
  
  validationMessages = {
    'name': { required: 'El nombre es obligatorio.' },
  };

  constructor(private route: ActivatedRoute, private userService: UserService, private authService: AuthService, private toastCtrl: ToastController) {
    this.route.data.subscribe((routeData: {userData: User}) => {
      this.userDataForm = new FormClass(new FormGroup({
        'name': new FormControl({value: '', disabled: false}, [Validators.required]),
        'nickname': new FormControl({value: '', disabled: false}),
        'email': new FormControl({value: '', disabled: false}),
      }), this.validationMessages);
      this.userDataForm.patchValue(routeData.userData);
      
      this.userData = routeData.userData;
      this.userAvatar.url = this.userData.avatar;
    });
  }

  selectAvatar(event: any) {
    if(event.target.files && event.target.files.length) {
      this.userAvatar.file = event.target.files[0];
      this.reader.readAsDataURL(this.userAvatar.file); 
      this.reader.onload = (_event) => { 
        this.userAvatar.url = this.reader.result; 
      }
    }
  }

  async submitUserData() {
    try {
      let userData: User = this.userDataForm.getValue();
      this.userData.name = userData.name;
      let user = await this.userService.updateUser(this.userData, this.userAvatar);
      this.authService.userLogged = user;
      (await this.toastCtrl.create({ message: 'Cambios guardados correctamente', duration: 3000 })).present();
    } catch(err) {
      console.error(err);
    }
  }
}
