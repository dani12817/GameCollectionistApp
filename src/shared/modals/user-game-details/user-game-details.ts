import { Component } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';

import { UserService } from '../../../providers/user.service';

import { UserGame } from '../../../models/user';

import { FormClass } from '../../form-class';
import { currencies } from '../../constant';

@Component({
  selector: 'user-game-details',
  templateUrl: 'user-game-details.html',
  styleUrls: ['user-game-details.scss'],
})
export class UserGameDetailsPage {
  userGame: UserGame; currencies = currencies;
  userGameForm: FormClass;

  constructor(private userService: UserService, navParams: NavParams, private modal: ModalController, private toastCtrl: ToastController) {
    this.userGame = navParams.get('userGame');
    this.initFrom();
  }

  private initFrom() {
    this.userGameForm = new FormClass(new FormGroup({
      'price': new FormControl({value: null, disabled: false}),
      'currency': new FormControl({value: null, disabled: false}),
      'bought_date': new FormControl({value: null, disabled: false})
    }));
    this.userGameForm.patchValue(this.userGame);
  }

  objectKeys(element: any) {
    return Object.keys(element);
  }

  async submitUserGame() {
    this.userGame.price = this.userGameForm.get('price').value;
    this.userGame.currency = this.userGameForm.get('currency').value;
    this.userGame.bought_date = this.userGameForm.get('bought_date').value;
    console.log("userGame", this.userGame);
    await this.userService.editGameOnLibrary(this.userGame);
    (await this.toastCtrl.create({message: 'Datos del Juego actualizados.', duration: 3000})).present();
    this.closeModal(this.userGame)
  }

  closeModal(data?) {
    this.modal.dismiss({dismissed: true, componentProps: data});
  }
}
