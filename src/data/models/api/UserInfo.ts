
export default class UserInfo {
    id: string;
    username: string;
    email: string;

    constructor(id: string, username: string, email: string) {
        this.id = id
        this.username = username
        this.email = email
    }
    
    public static map(json: any): UserInfo {
        return new this(json.id, json.username, json.email);
    }
}
