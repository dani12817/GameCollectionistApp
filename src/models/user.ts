export class User {
    name: string;
    admin?: boolean;
    uid: string;
    avatar?: string;
    email: string;
    games?: UserGame[];
    friends?: UserFriend[];
    nickname: string;

    constructor(userData, register?: boolean) {
        if (register) {
            this.email = userData.email;
            this.uid = userData.uid;
            this.avatar = userData.avatar;
            this.name = userData.name;
            this.nickname = userData.nickname;
        } else {
            if (userData.user.email) {
                this.name = userData.user.displayName ? userData.user.displayName : userData.user.email.split('@')[0];
                this.nickname = userData.user.email.split('@')[0];
            }
            this.email = userData.user.email;
            this.uid = userData.user.uid;
            this.avatar = userData.user.photoURL;
        }

        this.admin = false;
        this.games = [];
        this.friends = [];
    }
}

export class UserGame {
    gamecode?: string;
    reference?: firebase.firestore.DocumentReference;
    price?: number;
    currency?: string;
    bought_date?: any;
    type?: string; //'owned' | 'wishlist'
}

export class UserFriend {
    uid?: string;
    reference?: firebase.firestore.DocumentReference;
}
  