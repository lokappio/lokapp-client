
export default class User {
    id: string;
    username: string;
    email: string;

    constructor(id: string, username: string, email: string) {
        this.id = id
        this.username = username
        this.email = email
    }
    
    public static map(json: any): User {
        return new this(json.id, json.username, json.email);
    }
}
