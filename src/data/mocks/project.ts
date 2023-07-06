import Project from "@/data/models/api/Project";
import {commonGroup} from "@/data/mocks/group";
import {frLanguage} from "@/data/mocks/language";

const mockedProject = Project.map({
  id: 1,
  name:"test",
  color:"B662D3",
  description: "une description depuis le dashboard",
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
});
const mockedEmptyProject: Project = Object.assign({}, mockedProject);

mockedProject.groups= [commonGroup];
mockedProject.languages= [frLanguage];

export {mockedProject, mockedEmptyProject}
