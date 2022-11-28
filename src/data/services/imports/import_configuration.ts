import Project from "@/data/models/api/Project";
import ImportError from "@/data/models/ImportError";
import i18n from "@/i18n";
import Value, {ValueQuantity} from "@/data/models/api/Value";

export const checkAllValuesCreatedAndAdd = (project: Project) => {
  project.groups.forEach(group => {
    group.keys.forEach(key => {
      if (key.isPlural) {
        //IF KEY *IS* PLURAL, KEY.VALUES.LENGTH SHOULD BE EQUAL TO 3 * project.languages.length
        //OTHERWISE, ADD MISSING EMPTY VALUES TO KEY
        const correctNumberOfValues = key.values.length === 3 * project.languages.length;

        if (!correctNumberOfValues) {
          const missingLanguages = project.languages.filter(language => key.values.find(value => value.languageName === language.name) === undefined);

          missingLanguages.forEach(language => {
            project.warnings.push(new ImportError(i18n.tc("import_errors.no_values_found", null, {key: key.name, language: language.name})));

            Object.values(ValueQuantity).forEach(quantity => {
              key.values.push(Value.map({name: "", quantityString: quantity, languageName: language.name, keyId: key.id}));
            });
          });
        }
      } else {
        //IF KEY *IS NOT* PLURAL, KEY.VALUES.LENGTH SHOULD BE EQUAL TO project.languages.length
        //OTHERWISE, ADD MISSING EMPTY VALUES TO KEY
        const correctNumberOfValues = key.values.length === project.languages.length;

        if (!correctNumberOfValues) {
          const missingLanguages = project.languages.filter(language => key.values.find(value => value.languageName === language.name) === undefined);

          missingLanguages.forEach(language => {
            project.warnings.push(new ImportError(i18n.tc("import_errors.no_values_found", null, {key: key.name, language: language.name})));

            key.values.push(Value.map({name: "", languageName: language.name, keyId: key.id}));
          });
        }
      }
    });
  });
};
