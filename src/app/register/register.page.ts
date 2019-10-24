import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';

import { FormClass } from '../../shared/form-class';
import { AuthService } from '../../providers/auth.service';
import { matchPasswords } from '../../shared/validators/password-validation';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {
  registerForm: FormClass;
  

  validationMessages = {
    email: { required: 'El nombre es obligatorio.' },
    password: { required: 'La contraseña es obligatoria.' },
    'password-match': { required: 'Las contraseñas no coinciden.', matchOther: 'Las contraseñas no coinciden.' },
  };

  constructor(private authService: AuthService, public navCtrl: NavController, private toastCtrl: ToastController) {
    this.registerForm = new FormClass(new FormGroup({
      'email': new FormControl({value: '', disabled: false}, [Validators.required]),
      'password': new FormControl({value: '', disabled: false}, [Validators.required]),
      'password-match': new FormControl({value: '', disabled: false}, [Validators.required, matchPasswords('password')]),
    }), this.validationMessages);
  }

  doRegisterEmail() {
    this.authService.registerUser(this.registerForm.getValue()).then(async response => {
      console.log("doRegisterEmail", response);
      (await this.toastCtrl.create({ message: 'Registro Correcto', duration: 3000 })).present();
      this.navCtrl.navigateRoot('/login');
    }).catch(err => console.error(err));
  }
}
