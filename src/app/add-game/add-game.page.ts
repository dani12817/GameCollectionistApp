import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';

import { FormClass } from '../../shared/form-class';
import { GameService } from '../../providers/game.service';
import { gameRegions, platforms } from '../../shared/constant';

@Component({
  selector: 'app-add-game',
  templateUrl: 'add-game.page.html',
  styleUrls: ['add-game.page.scss'],
})
export class AddGamePage {
  addGameForm: FormClass; gameBoxart;
  gameRegions: string[] = gameRegions;
  platforms: string[] = platforms;
  

  validationMessages = {
    name: { required: 'El nombre es obligatorio.' },
    game_code: { required: 'El código del juego es obligatorio.' },
    region: { required: 'La región es obligatoria.' },
    platform: { required: 'La plataforma es obligatoria.' },
    barcode: { required: 'El código de barras es obligatorio.' },
  };

  constructor(private gameService: GameService, private barcodeScanner: BarcodeScanner, private toastCtrl: ToastController) {
    this.addGameForm = new FormClass(new FormGroup({
      'name': new FormControl({value: '', disabled: false}, [Validators.required]),
      'original_name': new FormControl({value: '', disabled: false}),
      'game_code': new FormControl({value: '', disabled: false}, [Validators.required]),
      'region': new FormControl({value: '', disabled: false}, [Validators.required]),
      'platform': new FormControl({value: '', disabled: false}, [Validators.required]),
      'namecode': new FormControl({value: '', disabled: false}),
      'barcode': new FormControl({value: '', disabled: false}, [Validators.required]),
    }), this.validationMessages);
  }

  openBarcodeScanner() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.addGameForm.get('barcode').setValue(barcodeData.text);
     }).catch(err => console.log('Error', err));
  }

  selectBoxart(event: any) {
    if(event.target.files && event.target.files.length) {
      this.gameBoxart = event.target.files[0];
      console.log("gameBoxart", this.gameBoxart);
    }
  }

  addGame() {
    this.gameService.createGame(this.addGameForm.getValue(), this.gameBoxart).then(async response => {
      (await this.toastCtrl.create({ message: 'Juego Creado', duration: 3000 })).present();
    });
  }
}
