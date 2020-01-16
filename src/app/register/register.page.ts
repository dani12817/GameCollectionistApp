import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';

import { AuthService } from '../../providers/auth.service';
import { UserService } from '../../providers/user.service';

import { FormClass } from '../../shared/form-class';
import { matchPasswords } from '../../shared/validators/password-validation';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {
  registerForm: FormClass;
  userAvatar: {file: File, url: string | ArrayBuffer} = {file: null, url: null};
  reader = new FileReader()
  
  validationMessages = {
    'name': { required: 'El nombre es obligatorio.' },
    'nickname': { required: 'El nickname es obligatorio.' },
    'email': { required: 'El email es obligatorio.' },
    'password': { required: 'La contraseña es obligatoria.', maxlength: 'La contraseña tiene que tener al menos 6 caracteres.' },
    'password-match': { required: 'Las contraseñas no coinciden.', matchOther: 'Las contraseñas no coinciden.' },
  };

  constructor(private authService: AuthService, private userService: UserService, public navCtrl: NavController, private toastCtrl: ToastController) {
    this.registerForm = new FormClass(new FormGroup({
      'name': new FormControl({value: '', disabled: false}, [Validators.required]),
      'nickname': new FormControl({value: '', disabled: false}, [Validators.required]),
      'email': new FormControl({value: '', disabled: false}, [Validators.required]),
      'password': new FormControl({value: '', disabled: false}, [Validators.required, Validators.maxLength(8)]),
      'password-match': new FormControl({value: '', disabled: false}, [Validators.required, matchPasswords('password')]),
    }), this.validationMessages);
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

  async doRegisterEmail() {
    let user = await this.userService.getUser(this.registerForm.get('nickname').value);
    try {
      if (user) {
        (await this.toastCtrl.create({ message: 'El \'nickname\' ya está en uso.', duration: 3000 })).present();
      } else {
        user = await this.authService.registerUser(this.registerForm.getValue(), this.userAvatar.file);
        console.log("doRegisterEmail", user);
        (await this.toastCtrl.create({ message: 'Registro Correcto', duration: 3000 })).present();
        this.navCtrl.navigateRoot('/login');
      }
    } catch(err) {
      console.error(err);
      if (err.code == 'auth/email-already-in-use') { (await this.toastCtrl.create({ message: 'El Email introducido ya está en uso.', duration: 3000 })).present(); }
    }
  }
}
