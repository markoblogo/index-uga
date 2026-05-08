import { describe, expect, it } from "vitest";
import { computePublishedChange } from "@/lib/index-publish";

describe("computePublishedChange", () => {
  it("returns absolute and percentage change against the previous value", () => {
    expect(computePublishedChange(215.5, 210)).toEqual({
      changeAbs: 5.5,
      changePct: 2.62,
    });
  });

  it("returns null changes when no previous value exists", () => {
    expect(computePublishedChange(215.5, null)).toEqual({
      changeAbs: null,
      changePct: null,
    });
  });
});
