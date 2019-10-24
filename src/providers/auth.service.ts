import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  params;

  constructor(public afAuth: AngularFireAuth) { }

  loginEmailPass(loginData: {email: string, password: string}) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(loginData.email, loginData.password).then(response => {
        resolve(response);
      }, err => reject(err));
    });
  }

  registerUser(loginData: {email: string, password: string}){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(loginData.email, loginData.password).then(response => {
        resolve(response);
      }, err => reject(err));
    })
   }

  loginSocialNetwork(provider) {
    this.afAuth.auth.signInWithRedirect(provider);
  }
}
