import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../models/models';

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.page.html',
  styleUrls: ['user-profile.page.scss'],
})
export class UserProfilePage {
  userData: User;
  
  constructor(private route: ActivatedRoute) { 
    this.route.data.subscribe((routeData: {userData: User}) => {
      this.userData = routeData.userData;
      console.log("userData", routeData);
    });
  }
}
