import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../models/models';
import { UserService } from '../../../providers/providers';


@Component({
  selector: 'app-user-info-tab',
  templateUrl: './user-info-tab.page.html',
  styleUrls: ['./user-info-tab.page.scss'],
})
export class UserInfoTabPage {
  userData: User;

  constructor(private route: ActivatedRoute, private router: Router, private userServ: UserService) {
    this.userServ.getUser(this.router.url.split('/')[2], false).then(response => {
      this.userData = response;
    });
  }
}
