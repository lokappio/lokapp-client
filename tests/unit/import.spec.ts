import {projectTranslationFromJSONFiles} from "@/data/services/imports/import_web_json";
import {mockedEmptyProject, mockedProject} from "@/data/mocks/project";
import ImportItem, {ItemIOS} from "@/data/models/ImportItem";
import Project from "@/data/models/api/Project";
import {projectTranslationFromXMLFiles} from "@/data/services/imports/import_android_xml";
import {projectTranslationFromStringsFiles} from "@/data/services/imports/import_ios_strings";

describe("imports", () => {
  //****************************************************
  // CREATE PROJECT FROM IMPORT
  //****************************************************
  describe("Create Project, one language", () => {
    function checkValues(createdProject: Project) {
      const group = createdProject.groups[0];

      expect(group.name).toEqual("groupName");
      group.keys.forEach(key => {
        if (!key.isPlural) {
          expect(key.values[0].name).toEqual("singular");
        } else {
          key.values.forEach(value => {
            expect(value.name).toEqual(`${value.quantityString}_value`);
          });
        }
      });
    }

    it("Create project from JSON, one language", async function () {
      const items = [
        new ImportItem(
          "fr",
          "{\n\t\"groupName\" : {\n\t\t\"singularKey\": \"singular\",\n\t\t\"pluralKey\": \"zero_value | one_value | other_value\"\n\t}}"
        )
      ];
      const createdProject = await projectTranslationFromJSONFiles(mockedEmptyProject, items, false);
      checkValues(createdProject);
    });

    it("Create project from XML, one language", async function () {
      const items = [
        new ImportItem(
          "fr",
          "<resources>\n\t<!--groupName-->\n\t<plural name=\"groupName_pluralKey\">\n\t\t<item quantity=\"other\">other_value</item>\n\t\t<item quantity=\"one\">one_value</item>\n\t\t<item quantity=\"zero\">zero_value</item>\n\t</plural>\n\t<string name=\"groupName_singularKey\">singular</string>\n</ressources>"
        )
      ];
      const createdProject = await projectTranslationFromXMLFiles(mockedEmptyProject, items, false);
      checkValues(createdProject);
    });

    it("Create project from Strings/StringsDict, one language", async function () {
      const items = [
        new ImportItem(
          "fr",
          [
            new ItemIOS(
              "strings",
              "// MARK: - groupName \n\"groupName_keyName\" = \"singular\";",
            ),
            new ItemIOS(
              "stringsdict",
              "<plist version=\"1.0\">\n<dict>\n\t<!-- MARK: - groupName -->\n\t<key>groupName_key</key>\n\t<dict>\n\t\t...\n\t\t<dict>\n\t\t\t...\n\t\t\t<key>other</key>\n\t\t\t<string>other_value</string>\n\t\t\t<key>one</key>\n\t\t\t<string>one_value</string>\n\t\t\t<key>zero</key>\n\t\t\t<string>zero_value</string>\n\t\t\t...\n\t\t</dict>\n\t</dict>\n</dict>\n</plist>"
            )
          ],
          true
        )
      ];
      const createdProject = await projectTranslationFromStringsFiles(mockedEmptyProject, items, false);
      checkValues(createdProject);
    });
  });

  describe("Create Project, several languages (2)", () => {
    function checkValues(createdProject: Project) {
      const group = createdProject.groups[0];

      expect(group.name).toEqual("groupName");
      group.keys.forEach(key => {
          key.values.forEach(value => {
            if(key.isPlural) {
              expect(value.name).toEqual(`${value.quantityString}_value_${value.languageName}`);
            } else {
              expect(value.name).toEqual(`singular_${value.languageName}`);
            }
          });
      });
    }

    it("Create project from JSON, 2 languages", async function () {
      const items = [
        new ImportItem(
          "fr",
          "{\n\t\"groupName\" : {\n\t\t\"singularKey\": \"singular_fr\",\n\t\t\"pluralKey\": \"zero_value_fr | one_value_fr | other_value_fr\"\n\t}}"
        ),
        new ImportItem(
          "en",
          "{\n\t\"groupName\" : {\n\t\t\"singularKey\": \"singular_en\",\n\t\t\"pluralKey\": \"zero_value_en | one_value_en | other_value_en\"\n\t}}"
        )
      ];
      const createdProject = await projectTranslationFromJSONFiles(mockedEmptyProject, items, false);

      checkValues(createdProject)
    });

    it("Create project from XML, 2 languages", async function () {
      const items = [
        new ImportItem(
          "fr",
          "<resources>\n\t<!--groupName-->\n\t<plural name=\"groupName_pluralKey\">\n\t\t<item quantity=\"other\">other_value_fr</item>\n\t\t<item quantity=\"one\">one_value_fr</item>\n\t\t<item quantity=\"zero\">zero_value_fr</item>\n\t</plural>\n\t<string name=\"groupName_singularKey\">singular_fr</string>\n</ressources>"
        ),
        new ImportItem(
          "en",
          "<resources>\n\t<!--groupName-->\n\t<plural name=\"groupName_pluralKey\">\n\t\t<item quantity=\"other\">other_value_en</item>\n\t\t<item quantity=\"one\">one_value_en</item>\n\t\t<item quantity=\"zero\">zero_value_en</item>\n\t</plural>\n\t<string name=\"groupName_singularKey\">singular_en</string>\n</ressources>"
        )
      ];
      const createdProject = await projectTranslationFromXMLFiles(mockedEmptyProject, items, false);

      checkValues(createdProject)
    });

    it("Create project from Strings/StringsDict, 2 languages", async function () {
      const items = [
        new ImportItem(
          "fr",
          [
            new ItemIOS(
              "strings",
              "// MARK: - groupName \n\"groupName_keyName\" = \"singular_fr\";",
            ),
            new ItemIOS(
              "stringsdict",
              "<plist version=\"1.0\">\n<dict>\n\t<!-- MARK: - groupName -->\n\t<key>groupName_key</key>\n\t<dict>\n\t\t...\n\t\t<dict>\n\t\t\t...\n\t\t\t<key>other</key>\n\t\t\t<string>other_value_fr</string>\n\t\t\t<key>one</key>\n\t\t\t<string>one_value_fr</string>\n\t\t\t<key>zero</key>\n\t\t\t<string>zero_value_fr</string>\n\t\t\t...\n\t\t</dict>\n\t</dict>\n</dict>\n</plist>"
            )
          ],
          true
        ),
        new ImportItem(
          "en",
          [
            new ItemIOS(
              "strings",
              "// MARK: - groupName \n\"groupName_keyName\" = \"singular_en\";",
            ),
            new ItemIOS(
              "stringsdict",
              "<plist version=\"1.0\">\n<dict>\n\t<!-- MARK: - groupName -->\n\t<key>groupName_key</key>\n\t<dict>\n\t\t...\n\t\t<dict>\n\t\t\t...\n\t\t\t<key>other</key>\n\t\t\t<string>other_value_en</string>\n\t\t\t<key>one</key>\n\t\t\t<string>one_value_en</string>\n\t\t\t<key>zero</key>\n\t\t\t<string>zero_value_en</string>\n\t\t\t...\n\t\t</dict>\n\t</dict>\n</dict>\n</plist>"
            )
          ],
          true
        )
      ];
      const createdProject = await projectTranslationFromStringsFiles(mockedEmptyProject, items, false);

      checkValues(createdProject)
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