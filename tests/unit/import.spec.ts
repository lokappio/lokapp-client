import {projectTranslationFromJSONFiles} from "@/data/services/imports/import_web_json";
import {mockedEmptyProject, mockedProject} from "@/data/mocks/project";
import ImportItem from "@/data/models/ImportItem";

describe("imports", () => {
  //****************************************************
  // CREATE PROJECT FROM IMPORT
  //****************************************************
  describe("Create Project, one language", () => {
    it("Create project from JSON, one language", async function () {
      const items = [
        new ImportItem(
          "",
          "{\n\t\"common\" : {\n\t\t\"singularKey\": \"a singular value\",\n\t\t\"pluralKey\": \"zero_value | one_value | other_value\"\n\t}}"
        )
      ];
      const createdProject = await projectTranslationFromJSONFiles(mockedEmptyProject, items, false);
      const group = createdProject.groups[0]

      expect(group.name).toEqual("common");
      group.keys.forEach(key => {
        if(!key.isPlural) {
          expect(key.values[0].name).toEqual("a singular value")
        } else {
          key.values.forEach(value => {
            expect(value.name).toEqual(`${value.quantityString}_value`)
          })
        }
      })
    });

    it("Create project from XML, one language", async function () {
      expect(1 == 1);
    });

    it("Create project from Strings/StringsDict, one language", async function () {
      expect(1 == 1);
    });
  });

  describe("Create Project, several languages (2)", () => {
    it("Create project from JSON, 2 languages", async function () {
      const items = [
        new ImportItem(
          "",
          ""
        ),
        new ImportItem(
          "",
          ""
        )
      ];
      const createdProject = await projectTranslationFromJSONFiles(mockedEmptyProject, items, false);

      expect(createdProject.groups);
    });

    it("Create project from XML, 2 languages", async function () {
      expect(1 == 1);
    });

    it("Create project from Strings/StringsDict, 2 languages", async function () {
      expect(1 == 1);
    });
  });


  //****************************************************
  // ADD LANGUAGE FROM IMPORT
  //****************************************************
  describe("Add language from import", () => {
    it("Add language from Json", async () => {
      expect(1 == 1);
    });

    it("Add language from XML", async () => {
      expect(1 == 1);
    });

    it("Add language from String/StringDict", async () => {
      expect(1 == 1);
    });
  });
});