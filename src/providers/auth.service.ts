import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from "@angular/fire/firestore";

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userLogged: User;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) { }

  loginEmailPass(loginData: {email: string, password: string}) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(loginData.email, loginData.password).then(response => {
        this.getLoggedInUser().then(userLogged => {
          console.log("loginEmailPass signInWithEmailAndPassword", userLogged);
          if (userLogged === undefined) {
            console.log("initializeUser");
            this.userLogged = this.initializeUser(response);
          } else { this.userLogged = userLogged; }
          resolve(response);
        }, err => reject(err));
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
  
  getLoggedInUser(): Promise<User> {
    return new Promise((resolve, reject) => {      
      if(this.userLogged) { resolve(this.userLogged); }
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.afs.collection<User[]>("usersGameLibrary").doc(user.uid).valueChanges().subscribe((userLibrary: User) => {
            this.userLogged = userLibrary;
            resolve(userLibrary);
          });
        } else {
          resolve(null);
        }
      }), (err) => resolve(null);
    });
  }

  initializeUser(userData: firebase.auth.UserCredential): User{
    let user = new User(userData);
    this.afs.collection<User[]>("usersGameLibrary").doc(userData.user.uid).set(Object.assign({}, user));
    return user;
  }
}
