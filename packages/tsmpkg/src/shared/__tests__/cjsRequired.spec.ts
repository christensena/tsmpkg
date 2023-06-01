import { describe, expect, it } from "vitest";
import { cjsRequired } from "../introspections.js";

describe("cjsRequired", () => {
  describe("format not specified", () => {
    it("returns false", () => {
      expect(cjsRequired({ tsup: {} })).toBe(false);
    });
  });

  describe("format is 'esm'", () => {
    it("returns false", () => {
      expect(cjsRequired({ tsup: { format: "esm" } })).toBe(false);
    });
  });

  describe("format is 'cjs'", () => {
    it("returns true", () => {
      expect(cjsRequired({ tsup: { format: "cjs" } })).toBe(true);
    });
  });

  describe('format is ["esm"]', () => {
    it("returns false", () => {
      expect(cjsRequired({ tsup: { format: ["esm"] } })).toBe(false);
    });
  });

  describe('format is ["cjs"]', () => {
    it("returns false", () => {
      expect(cjsRequired({ tsup: { format: ["cjs"] } })).toBe(true);
    });
  });

  describe('format is ["esm", "cjs"]', () => {
    it("returns true", () => {
      expect(cjsRequired({ tsup: { format: ["esm", "cjs"] } })).toBe(true);
    });
  });
});
