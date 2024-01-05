import {getRoleClass, getRoleEnum, Role} from "../roles/role.enum";
import RoleProtection from "@/data/models/roles/RoleProtection";
import Language from "@/data/models/api/Language";

export default class ProjectUser {
    userId: string;
    username: string;
    email: string;
    role: Role;
    pending: boolean;
    invitationId: number | null;
    sourceLanguagesIds: number[] = [];
    targetLanguagesIds: number[] = [];
    sourceLanguages: Language[] = [];
    targetLanguages: Language[] = [];

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
        user.sourceLanguages = data.sourceLanguages ? data.sourceLanguages.map(d => Language.map(d)) : [];
        user.targetLanguages= data.targetLanguages ? data.targetLanguages.map(d => Language.map(d)) : [];
        user.sourceLanguagesIds = data.sourceLanguages ? data.sourceLanguages.map(d => d.id) : [];
        user.targetLanguagesIds = data.targetLanguages ? data.targetLanguages.map(d => d.id) : [];

        return user;
    }
}