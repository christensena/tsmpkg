# TODO:

Package JSON

- [x] use `@npmcli/package-json` to poke into package.json

Tsconfig

- [ ] Use proper loader so resolves extends etc
- [ ] Poke only essentials in on fix/init (and prompt first)

Checks

- [ ] tsup and export entry points match up (how to get tsup config?)
- [ ] necessary bits in package.json and tsconfig.json

- Init

  - [ ] Less destructive (additive only)
  - [ ] Able to run from generic "pnpm init" package (e.g. cjs mode)

- Fix to fix checks e.g.

  - [x] Sync up exports with tsup (tsup wins)
    - [ ] Use `outExension` lookup if set
  - [ ] Corrections to package.json and tsconfig.json
  - [ ] With pnpm (not sure about others) make
        sure `enable-pre-post-scripts=true` in `.npmrc`

- Dev mode

  - [ ] Do checks (and prompt to run `fix`). Non-zero exit if checks fail.
  - [ ] esbuild-register hook for on-fly transpile so consumers don't have to
        process typescript?
  - [ ] More robust investigation as to permutations of cjs/esm import/require
        etc actually working. Currently the symlink works because node/tsx/esbuild
        follow it and see the .ts. Node doesn't like it obviously.

- Console display

  - [ ] Proper usage help
  - [ ] Show what is happening with fancy emoji
  - [ ] Prompt if doing a change that might be controversial

- Better commonjs support

  - [ ]

- Robust enhancements

  - [ ] Support all forms of tsup config (not exported from tsup tho)
  - [ ] Support string array entry points from tsup

- Other ideas
  - [ ] Check/lint mode (dev will run it anyway)
  - [ ] Non monorepo support
  - [ ] Yarn/npm monorepo support?
  - [ ] New name
