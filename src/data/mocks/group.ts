import Group from "@/data/models/api/Group";
import {pluralKey, singularKey} from "@/data/mocks/translation";

const commonGroup = Group.map({
  id: 1,
  name: 'common',
});

commonGroup.keys = [singularKey, pluralKey];

export {commonGroup};