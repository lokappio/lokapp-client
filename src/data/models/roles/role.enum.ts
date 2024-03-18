import RoleEditor from "./RoleEditor";
import RoleManager from "./RoleManager";
import RoleOwner from "./RoleOwner";
import RoleProtection from "./RoleProtection";
import RoleTranslator from "./RoleTranslator";
import RoleReviewer from "@/data/models/roles/RoleReviewer";

export enum Role {
  OWNER = "owner",
  MANAGER = "manager",
  EDITOR = "editor",
  TRANSLATOR = "translator",
  REVIEWER = "reviewer",
}
export const getRoleEnum = (role: string): Role|undefined => {
  return Object.values(Role).includes(role as Role) ? role as Role : undefined;
}

export const getRoleClass = (role: Role): RoleProtection => {
  switch (role) {
    case Role.OWNER:
      return new RoleOwner();
    case Role.MANAGER:
      return new RoleManager();
    case Role.EDITOR:
      return new RoleEditor();
    case Role.TRANSLATOR:
      return new RoleTranslator();
    case Role.REVIEWER:
      return new RoleReviewer();
    default:
      return new RoleProtection();
  }
}
