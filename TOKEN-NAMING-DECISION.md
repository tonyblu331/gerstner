# Token naming decision
## Revised prose line-height token

## Decision

Rename the prose line-height token from:

- `--g-leading-prose`

to:

- `--g-prose`

Keep:

- `--g-rhythm`

unchanged.

## Why

`--g-rhythm` and the prose line-height token are not the same thing.

- `--g-rhythm` is a **length**
- `--g-prose` is a **unitless number**

That distinction is load-bearing.

Using `--g-rhythm` directly for prose line-height would collapse two different types into one name and would reintroduce the accessibility bug the spec explicitly forbids.

## New canonical formula

```css
--g-rhythm: calc(var(--g-baseline) * var(--g-leading-steps));
--g-prose:  calc(var(--g-rhythm) / var(--g-type-base));
```

```css
.g-prose {
  line-height: var(--g-prose);
}
```

## Naming rationale

`--g-prose` is shorter, cleaner, and still honest:

- it is only used by the prose path
- it avoids a long token name in the public contract
- it preserves the important distinction from `--g-rhythm`

## Migration rule

For v1 development, support this mapping during the transition:

```css
--g-prose: var(--g-leading-prose);
```

Then remove `--g-leading-prose` before release branches.

## What not to do

Do not rename the prose line-height token to `--g-rhythm`.

That would be semantically wrong because rhythm is spacing length, not prose line-height.

## Human labels

In docs and inspector UI, use:

- **Rhythm** for `--g-rhythm`
- **Prose line height** for `--g-prose`
