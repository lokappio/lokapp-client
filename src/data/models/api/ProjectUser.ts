import { getRoleEnum, Role } from "../roles/role.enum";

export default class ProjectUser {
    userId: string;
    username: string;
    email: string;
    role: Role;
    pending: boolean;
    invitationId: number | null;

    constructor(
        userId: string,
        username: string,
        email: string,
        role: Role,
        pending: boolean,
        invitationId: number | null) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.role = role;
        this.pending = pending;
        if (this.pending === false) {
            this.invitationId = null;
        } else {
            this.invitationId = invitationId;
        }
    }

    public static map(json: any): ProjectUser {
        return new ProjectUser(json.userId, json.username, json.email, getRoleEnum(json.role), json.pending, json.invitationId);
    }
}