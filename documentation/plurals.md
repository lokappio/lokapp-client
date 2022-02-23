# Plurals

The Lokapp client can handle both singular and plural values.

When creating a plural value, only `"one"`, `"other"` and `"zero"` quantities are handled.

## Switch between simple and plural keys

When switching from a plural translation_key to a simple one, only the `"other"` value will be kept and stored as a single value.

Other values for `"one"` and `"zero"` quantities will be lost.
