import ProjectUser from "@/data/models/api/ProjectUser";
import {Role} from "@/data/models/roles/role.enum";

export const mockedAppUser = ProjectUser.map({
  id: "",
  userId: "L5Z8WUmHLqbDeBLVh5jV8fLk0xu1",
  username: "croumy",
  email: "clemence+local@playmoweb.com",
  role: Role.OWNER,
  pending: false,
  invitationId: null
});