import {getRoleEnum, Role} from "../roles/role.enum";

export default class ProjectUser {
    userId: string;
    username: string;
    email: string;
    role: Role;
    pending: boolean;
    invitationId: number | null;

    public static map(data: Partial<ProjectUser>): ProjectUser {
        const user: ProjectUser = new ProjectUser();

        user.userId = data.userId ?? data.id;
        user.username = data.username;
        user.email = data.email;
        user.role = getRoleEnum(data.role);
        user.pending = data.pending;
        user.invitationId = data.invitationId;

        return user;
    }
}