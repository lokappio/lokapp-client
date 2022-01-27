import {getRoleClass, getRoleEnum, Role} from "../roles/role.enum";
import RoleProtection from "@/data/models/roles/RoleProtection";

export default class ProjectUser {
    userId: string;
    username: string;
    email: string;
    role: Role;
    pending: boolean;
    invitationId: number | null;

    get roleAbility(): RoleProtection {
        return getRoleClass(this.role);
    }

    get name(): string {
        return this?.username ?? this?.email ?? "";
    }

    public static map(data: Partial<ProjectUser> & {id: string}): ProjectUser {
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