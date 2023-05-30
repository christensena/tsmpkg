import PackageJson from "@npmcli/package-json";

export const check = (pkg: PackageJson) => {
  const { content } = pkg;
  const errors: string[] = [];

  if (content.main) {
    errors.push("`main` field is not required on a es module package.");
  }
  if (content.type !== "module") {
    errors.push("`type` field must be `module`.");
  }

  if (!content.module) {
    errors.push("`module` field must be provided.");
  }

  // TODO: better to attempt a path resolve
  if (
    content.files &&
    !content?.files.find((f) => ["dist", "./dist", "dist/"].includes(f))
  ) {
    errors.push("`files` must include `dist`");
  }

  return errors;
};
