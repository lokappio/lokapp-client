import Key from "@/data/models/api/Key";
import Value, {TranslationStatus, ValueQuantity} from "@/data/models/api/Value";

describe("key", () => {

  const keyNotPlural: Key = Key.map({
    "isPlural": false,
    values: [
      Value.map({
        "id": 2,
        "name": "test",
        "quantityString": null,
        "languageName": "en",
        "status": TranslationStatus.MODIFIED,
      }),
      Value.map({
        "id": 1,
        "name": "test",
        "quantityString": null,
        "languageName": "en",
        "status": TranslationStatus.VALIDATED,
      }),
      Value.map({
        "id": 3,
        "name": "test",
        "quantityString": null,
        "languageName": "fr",
        "status": TranslationStatus.VALIDATED,
      })
    ]
  });

  it("Should get valueStatuses for non plural", async () => {
    const valueStatuses = keyNotPlural.valueStatuses();
    expect(valueStatuses.size).toBe(2);
    expect(valueStatuses.get("en").size).toBe(1);
    expect(valueStatuses.get("fr").size).toBe(1);
    expect(valueStatuses.get("en").get(TranslationStatus.MODIFIED)).toBe(1);
    expect(valueStatuses.get("en").get(TranslationStatus.VALIDATED)).toBe(undefined);
    expect(valueStatuses.get("fr").get(TranslationStatus.VALIDATED)).toBe(1);
    expect(valueStatuses.get("fr").get(TranslationStatus.MODIFIED)).toBe(undefined);
  });

  const keyPlural: Key = Key.map({
    "isPlural": true,
    values: [
      Value.map({
        "id": 14,
        "name": "test",
        "quantityString": ValueQuantity.other,
        "languageName": "fr",
        "status": TranslationStatus.MODIFIED,
      }),
      Value.map({
        "id": 13,
        "name": "test",
        "quantityString": ValueQuantity.one,
        "languageName": "fr",
        "status": TranslationStatus.INVALIDATED,
      }),
      Value.map({
        "id": 12,
        "name": "test",
        "quantityString": ValueQuantity.zero,
        "languageName": "fr",
        "status": TranslationStatus.VALIDATED,
      }),
      Value.map({
        "id": 11,
        "name": "test",
        "quantityString": ValueQuantity.one,
        "languageName": "fr",
        "status": TranslationStatus.VALIDATED,
      }),
      Value.map({
        "id": 10,
        "name": "test",
        "quantityString": ValueQuantity.other,
        "languageName": "fr",
        "status": TranslationStatus.VALIDATED,
      }),
      Value.map({
        "id": 4,
        "name": "test",
        "quantityString": ValueQuantity.other,
        "languageName": "en",
        "status": TranslationStatus.VALIDATED,
      }),
      Value.map({
        "id": 3,
        "name": "test",
        "quantityString": ValueQuantity.one,
        "languageName": "en",
        "status": TranslationStatus.MODIFIED,
      }),
      Value.map({
        "id": 2,
        "name": "test",
        "quantityString": ValueQuantity.zero,
        "languageName": "en",
        "status": TranslationStatus.INVALIDATED,
      }),
      Value.map({
        "id": 1,
        "name": "test",
        "quantityString": ValueQuantity.one,
        "languageName": "en",
        "status": TranslationStatus.VALIDATED,
      }),
      Value.map({
        "id": 0,
        "name": "test",
        "quantityString": ValueQuantity.other,
        "languageName": "en",
        "status": TranslationStatus.INVALIDATED,
      })
    ]
  });

  it("Should get valueStatuses for plural", async () => {
    const valueStatuses = keyPlural.valueStatuses();
    expect(valueStatuses.size).toBe(2);
    expect(valueStatuses.get("en").size).toBe(3);
    expect(valueStatuses.get("fr").size).toBe(3);
    expect(valueStatuses.get("en").get(TranslationStatus.MODIFIED)).toBe(1);
    expect(valueStatuses.get("en").get(TranslationStatus.VALIDATED)).toBe(1);
    expect(valueStatuses.get("en").get(TranslationStatus.INVALIDATED)).toBe(1);
    expect(valueStatuses.get("fr").get(TranslationStatus.VALIDATED)).toBe(1);
    expect(valueStatuses.get("fr").get(TranslationStatus.MODIFIED)).toBe(1);
    expect(valueStatuses.get("fr").get(TranslationStatus.INVALIDATED)).toBe(1);
  });
});
