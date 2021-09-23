import { getRoleEnum, Role } from "../roles/role.enum";

export default class Invitation {
    role: Role;
    id: number;
    ownerEmail: string;
    ownerUsername: string;
    projectName: string;

    constructor (
        role: Role,
        id: number,
        ownerEmail: string,
        ownerUsername: string,
        projectName: string,
    ) {
        this.role = role;
        this.id = id;
        this.ownerEmail = ownerEmail;
        this.ownerUsername = ownerUsername;
        this.projectName = projectName;
    }

    public static map(json: any): Invitation {
        return new this(getRoleEnum(json.role), json.id, json.owner_email, json.owner_username, json.project_name);
    }
}