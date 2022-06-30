import TemplateItemKeys from "@/components/molecules/project/template-v-data-table/TemplateItemKeys.vue";
import ContentDetails from "@/components/molecules/project/ContentDetails.vue";
import {setupVueInstance} from "../helpers";
import {Wrapper} from "@vue/test-utils";
import store from "@/store";
import {mockedProject} from "@/data/mocks/project";
import {mockedAppUser} from "@/data/mocks/user";
import {pluralKey, singularKey} from "@/data/mocks/translation";
import Key from "@/data/models/api/Key";

/*describe('update keys', () => {
  let wrapper: Wrapper<any>;

  function saveKeyMock(keyComponentWrapper: Wrapper<any>, reject = false) {
    return (reject ? Promise.reject() : Promise.resolve())
      .then(() => {
        console.log("success");

        const result: Key = Object.assign({}, pluralKey);
        result.id = singularKey.id;
        result.isPlural = true;
        result.name = singularKey.name;

        keyComponentWrapper.vm.$emit("saveKey", result);
      })
      .catch(() => {
        console.log('error');
        keyComponentWrapper.vm.$notify("error", {color: "red"});
        //REVERT PLURAL UPDATE
        keyComponentWrapper.vm.updateKey.isPlural = !keyComponentWrapper.vm.updateKey.isPlural;
      });
  }

  beforeEach(() => {
    store.commit("SET_CURRENT_PROJECT", mockedProject);
    store.commit("SET_APP_USER", mockedAppUser);
    wrapper = setupVueInstance(ContentDetails);
  })

  it('request to update quantity failed', async () => {
    const componentsTemplateKey = wrapper.findAllComponents(TemplateItemKeys);
    expect(componentsTemplateKey.length).toBe(4);

    const firstKeysComponents = componentsTemplateKey.at(0);

    firstKeysComponents.setMethods({
      saveKey() {
        return saveKeyMock(firstKeysComponents, true)
      }
    });

    let buttons = wrapper.findAllComponents({name: "v-btn"});
    let singularButtons = buttons.filter((btn) => btn.text() == "project_detail.simple_key");
    let pluralButtons = buttons.filter((btn) => btn.text() == "project_detail.plural_key");

    expect(singularButtons.length).toBe(1);
    expect(pluralButtons.length).toBe(3);

    await singularButtons.at(0).trigger("click");

    // @ts-ignore
    console.log(firstKeysComponents.vm.updateKey)

    buttons = wrapper.findAllComponents({name: "v-btn"});
    singularButtons = buttons.filter((btn) => btn.text() == "project_detail.simple_key");
    pluralButtons = buttons.filter((btn) => btn.text() == "project_detail.plural_key");

    expect(singularButtons.length).toBe(1);
    expect(pluralButtons.length).toBe(3);
  });

  it('request to update quantity succeed', async () => {
    const componentsTemplateKey = wrapper.findAllComponents(TemplateItemKeys);
    expect(componentsTemplateKey.length).toBe(4);

    const firstKeysComponents = componentsTemplateKey.at(0);

    firstKeysComponents.setMethods({
      saveKey() {
        return saveKeyMock(componentsTemplateKey.at(0))
      }
    });

    let buttons = wrapper.findAllComponents({name: "v-btn"});
    let singularButtons = buttons.filter((btn) => btn.text() == "project_detail.simple_key");
    let pluralButtons = buttons.filter((btn) => btn.text() == "project_detail.plural_key");

    expect(singularButtons.length).toBe(1);
    expect(pluralButtons.length).toBe(3);

    await singularButtons.at(0).trigger("click");

    buttons = wrapper.findAllComponents({name: "v-btn"});
    singularButtons = buttons.filter((btn) => btn.text() == "project_detail.simple_key");
    pluralButtons = buttons.filter((btn) => btn.text() == "project_detail.plural_key");

    expect(singularButtons.length).toBe(0);
    expect(pluralButtons.length).toBe(6);
  })
})*/