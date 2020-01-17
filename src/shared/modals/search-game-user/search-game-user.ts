import { Component } from '@angular/core';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';

import { UserService } from '../../../providers/user.service';

import { UserGame } from '../../../models/user';

import { FormClass } from '../../form-class';

import { platforms, gameRegions, genres } from '../../constant';

@Component({
  selector: 'search-game-user',
  templateUrl: 'search-game-user.html',
  styleUrls: ['search-game-user.scss'],
})
export class SearchGameUserPage {
  searchForm: FormClass;
  platforms: string[] = platforms;
  regions: string[] = gameRegions;
  genres: string[] = genres;

  constructor(private navParams: NavParams, private modal: ModalController) {
    this.initFrom();
  }

  private initFrom() {
    this.searchForm = new FormClass(new FormGroup({
      'type': new FormControl({value: 'game', disabled: false}),
      'name': new FormControl({value: null, disabled: false}),
      'nickname': new FormControl({value: null, disabled: false}),
      'game_code': new FormControl({value: null, disabled: false}),
      'platform': new FormControl({value: null, disabled: false}),
      'genres': new FormControl({value: null, disabled: false}),
      'region': new FormControl({value: null, disabled: false}),
      'release_date': new FormControl({value: null, disabled: false}),
    }));
    this.searchForm.patchValue(this.navParams.get('filters'));
  }

  resetForm() {
    console.log("resetForm");
    let type = this.searchForm.get('type').value
    this.searchForm.reset();
    this.searchForm.patchValue({type: type})
  }

  submitSearch() {
    this.modal.dismiss({dismissed: true, componentProps: this.searchForm.getValueNotNull()});
  }

  closeModal() {
    this.modal.dismiss({dismissed: true, componentProps: undefined});
  }
}
