import { Account } from './account';

export class Message {

    fromUser: Account;

    message: string;

    constructor(user : Account, message : string) {
        this.fromUser = user;
        this.message = message;
    }

}
