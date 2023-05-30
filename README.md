# TODO:

- [x] use `@npmcli/package-json` to poke into package.json
- [ ] use `tsconfig` and `types-tsconfig` or something to parse tsconfig.json
- [ ] Checks on dev
  - [ ] tsup and export entry points match up (how to get tsup config?)
  - [ ] necessary bits in package.json and tsconfig.json
- [ ] Less destructive init (additive only)
- [ ] Fix to fix checks e.g.
  - [ ] Sync up exports with tsup (tsup wins)
  - [ ] Corrections to package.json and tsconfig.json
  - [ ] With pnpm (not sure about others) make
        sure `enable-pre-post-scripts=true` in `.npmrc`
