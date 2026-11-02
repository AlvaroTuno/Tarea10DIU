import { describe, expect, it } from "vitest";
import { calcWeighted, validateScores, weightsSum } from "./paes";
import { WEIGHTS_2026_CON_M2, WEIGHTS_2026_SIN_M2 } from "@/data/careers";

const base = { nem: "800", ranking: "800", lectora: "700", m1: "900", m2: "600", ciencias: "650", historia: "700" };

describe("PAES simulator", () => {
  it("weights sum to 100%", () => {
    expect(weightsSum(WEIGHTS_2026_CON_M2)).toBe(1);
    expect(weightsSum(WEIGHTS_2026_SIN_M2)).toBe(1);
  });
  it("computes the weighted score with best elective", () => {
    // 800*.15+800*.2+700*.1+900*.35+600*.1+700*.1 = 120+160+70+315+60+70
    expect(calcWeighted(base, WEIGHTS_2026_CON_M2).total).toBe(795);
    expect(calcWeighted(base, WEIGHTS_2026_CON_M2).electivaUsed).toBe("historia");
  });
  it("rejects out of range scores", () => {
    expect(validateScores({ ...base, m1: "1001" }, WEIGHTS_2026_CON_M2).m1).toBeDefined();
    expect(validateScores({ ...base, nem: "99" }, WEIGHTS_2026_CON_M2).nem).toBeDefined();
  });
  it("requires M2 only when the career weights it", () => {
    expect(validateScores({ ...base, m2: "" }, WEIGHTS_2026_CON_M2).m2).toBeDefined();
    expect(validateScores({ ...base, m2: "" }, WEIGHTS_2026_SIN_M2).m2).toBeUndefined();
  });
  it("requires at least one elective", () => {
    expect(validateScores({ ...base, ciencias: "", historia: "" }, WEIGHTS_2026_CON_M2).ciencias).toBeDefined();
  });
});
