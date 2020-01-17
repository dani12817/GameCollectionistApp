import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController, NavController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { OCR, OCRSourceType } from '@ionic-native/ocr/ngx';

import { AddOtherModalPage } from '../../shared/modals/add-other-modal/add-other-modal.page';

import { Game } from '../../models/game';
import { GameService } from '../../providers/game.service';
import { UserService } from '../../providers/user.service';

import { FormClass } from '../../shared/form-class';
import { gameRegions, platforms, genres } from '../../shared/constant';
import { noWhitespaceValidator } from '../../shared/validators/form-validators';
import { GameMethods } from '../../shared/game-methods';

@Component({
  selector: 'app-add-game',
  templateUrl: 'add-game.page.html',
  styleUrls: ['add-game.page.scss'],
})
export class AddGamePage {
  gameData: Game = new Game(); /*pendingGame: boolean = true; editGame: boolean = false;*/
  gameAction: string = 'requestGame';
  addGameForm: FormClass; gameBoxart = null; gameBoxartURL;
  gameRegions: string[] = gameRegions;
  platforms: string[] = platforms;
  genres: string[] = genres;
  gameMeth = GameMethods;

  reader = new FileReader();

  validationMessages = {
    name: {required: 'El nombre es obligatorio.'},
    game_code: {required: 'El código del juego es obligatorio.', whitespace: 'No tiene que haber espacios en blanco'},
    genres: {required: 'Se tiene que seleccionar al menos un género.'},
    region: {required: 'La región es obligatoria.'},
    platform: {required: 'La plataforma es obligatoria.'},
    barcode: {required: 'El código de barras es obligatorio.'},
  };

  constructor(private gameService: GameService, private barcodeScanner: BarcodeScanner, private toastCtrl: ToastController, private navCtrl: NavController,
  private camera: Camera, private ocr: OCR, private router: Router, private route: ActivatedRoute, private userService: UserService, private modal: ModalController) {
    this.addGameForm = new FormClass(new FormGroup({
      'name': new FormControl({value: '', disabled: false}, [Validators.required]),
      'original_name': new FormControl({value: '', disabled: false}),
      'game_code': new FormControl({value: '', disabled: false}, [Validators.required, noWhitespaceValidator]),
      'genres': new FormControl({value: '', disabled: false}, [Validators.required]),
      'release_date': new FormControl({value: '', disabled: false}),
      'region': new FormControl({value: '', disabled: false}, [Validators.required]),
      'platform': new FormControl({value: '', disabled: false}, [Validators.required]),
      'namecode': new FormControl({value: '', disabled: false}),
      'barcode': new FormControl({value: '', disabled: false}, [Validators.required]),
      'other_platforms': new FormControl({value: [], disabled: false}),
      'other_regions': new FormControl({value: [], disabled: false}),
      'collectors_edition': new FormControl({value: false, disabled: false}),
    }), this.validationMessages);
    
    if (this.router.url.includes('create') || this.router.url.includes('edit') || this.router.url.includes('pending')) {
      // this.editGame = this.router.url.includes('edit');
      if (this.router.url.includes('edit')) { this.gameAction = 'editGame'; }
      if (this.router.url.includes('create')) { this.gameAction = 'createGame'; }
      if (this.router.url.includes('pending')) { this.gameAction = 'pendingGame'; }
      /*this.pendingGame = false;*/this.gameBoxart = undefined;
      this.addGameForm.formGroup.get('name').setValidators([]);
      this.addGameForm.formGroup.get('genres').setValidators([]);
      this.addGameForm.formGroup.get('region').setValidators([]);
      this.addGameForm.formGroup.get('platform').setValidators([]);
      this.addGameForm.formGroup.updateValueAndValidity();
    }
    
    this.route.data.subscribe((routeData: {gameData: Game}) => {
      if (routeData.gameData) { this.gameData = routeData.gameData; } else { this.gameData = new Game(); }

      this.addGameForm.patchValue(this.gameData);
      this.gameBoxartURL = this.gameData.image;

      if (this.gameData === null || this.gameData === undefined) { this.router.navigate(['/home']); }
      this.userService.gameOnLibrary(this.gameData.game_code).then(response => {
        this.gameData.userGame = response;
      }).catch(err => console.error(err));
    });
  }

  showBackButton(): boolean {
    if (this.gameAction === 'pendingGame' || this.gameAction === 'editGame') {
      return true;
    } else { return false; }
  }

  readGameCodeFromImage() {
    let options: CameraOptions = {
      quality: 100,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
    }
    
    this.camera.getPicture(options).then(imageData => {
      this.ocr.recText(OCRSourceType.NORMFILEURL, imageData).then(recognizedText => {
        console.log("recognizedText", recognizedText);
        let gameCode = '';
        for (const wordtext of recognizedText.words.wordtext) { gameCode += wordtext; }
        this.addGameForm.get('game_code').setValue(gameCode);
      }).catch(err => console.log('Error', err));
    }).catch(err => console.log('Error', err));
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
      this.reader.readAsDataURL(this.gameBoxart); 
      this.reader.onload = (_event) => { 
        this.gameBoxartURL = this.reader.result;
      }
      console.log("gameBoxart", this.gameBoxart);
    }
  }

  removeNewBoxart() {
    this.gameBoxart = null;
    this.gameBoxartURL = this.gameData.image; 
  }

  async addGame() {
    try {
      if (this.gameData.game_code) {
        if (this.gameAction === 'pendingGame') {
          await this.deleteUpdateGame(true, true);
          console.log("deleteUpdateGame finished");
        } else if (this.gameData.game_code !== this.addGameForm.get('game_code').value) {
          let gameExists: boolean = await this.gameService.gameExist(this.addGameForm.get('game_code').value);
          if (gameExists) {
            (await this.toastCtrl.create({message: 'El nuevo código de juego introducido ya existe', duration: 3000})).present();
          } else {
            await this.deleteUpdateGame(false, true);
          }
        } else {
          this.updateGame();
        }
      } else {
        let gameExists: boolean = await this.gameService.gameExist(this.addGameForm.get('game_code').value);
        if(gameExists) {
          (await this.toastCtrl.create({message: 'El juego ya existe o está pendiente de aprobación.', duration: 3000})).present();
        } else {
          await this.gameService.createGame(this.addGameForm.getValue(), this.gameBoxart, (this.gameAction === 'requestGame'));
          (await this.toastCtrl.create({message: 'Petición de Juego enviada', duration: 3000})).present();
          this.navCtrl.navigateRoot('/home');
        }
      }
    } catch (err) { console.error(err); }

    /*if (this.gameData.game_code) {
      if (this.router.url.includes('pending')) {
        this.gameService.deleteGame(this.gameData.game_code, true).then(() => {
          this.updateGame();
        }).catch(err => console.error(err));
      } else if (this.gameData.game_code !== this.addGameForm.get('game_code').value) {
        this.gameService.gameExist(this.addGameForm.get('game_code').value).then(async gameExist => {
          if(gameExist) {
            (await this.toastCtrl.create({message: 'El nuevo código de juego ya existe', duration: 3000})).present();
          } else {
            this.gameService.deleteGame(this.gameData.game_code).then(() => {
              this.updateGame();
            }).catch(err => console.error(err));
          }
        }).catch(err => console.error(err));
      } else {
        this.updateGame();
      }
    } else {
      this.gameService.gameExist(this.addGameForm.get('game_code').value).then(async gameExist => {
        if(gameExist) {
          (await this.toastCtrl.create({message: 'El juego ya existe y está pendiente de aprobación.', duration: 3000})).present();
        } else {
          this.gameService.createGame(this.addGameForm.getValue(), this.gameBoxart, this.pendingGame).then(async response => {
            (await this.toastCtrl.create({message: 'Petición de Juego enviada', duration: 3000})).present();
            this.navCtrl.navigateRoot('/home');
          }).catch(err => console.error(err));;
        }
      }).catch(err => console.error(err));
    }*/
  }

  removeOtherListElement(element, otherListField: string) {
    let otherList: {game_code: string, region?: string, platform?: string}[] = this.addGameForm.get(otherListField).value;
    otherList.splice(otherList.indexOf(element), 1);
  }

  private updateGame() {
    let newGameData = Object.assign(this.gameData, this.addGameForm.getValue());
    this.gameService.updateGame(newGameData, this.gameBoxart).then(async response => {
      (await this.toastCtrl.create({message: 'Juego Actualizado.', duration: 3000})).present();
      this.router.navigate(['/edit-game', response.game_code]);
    }).catch(err => console.error(err));
  }

  async deleteUpdateGame(pending: boolean, update?: boolean): Promise<void> {
    console.log('before deleteGame');
    await this.gameService.deleteGame(this.gameData.game_code, pending);
    console.log('after deleteGame');
    if (update) { this.updateGame(); } else {
      this.navCtrl.setDirection('root');
      this.router.navigate(pending ? ['/pending-games'] : ['/home']);
    }
  }

  async openModal(type: string) {
    const modal = await this.modal.create({component: AddOtherModalPage, componentProps: {type: type, game: this.gameData}});
    modal.present();

    const { data } = await modal.onWillDismiss();
    console.log("onWillDismiss", data);
    if (data.componentProps !== undefined) {
      let otherList: {game_code: string, region?: string, platform?: string}[] = this.addGameForm.get(type).value;
      otherList.push(data.componentProps);
    }
  }
}
