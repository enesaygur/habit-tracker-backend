import { calculateStreak } from "./streak";

describe("calculateStreak", () => {
  test("returns 0 when there are no dates", () => {
    expect(calculateStreak([])).toBe(0);
  });

  test("returns 1 when there is only today's date", () => {
    const today = new Date();
    expect(calculateStreak([today])).toBe(1);
  });

  test("returns correct streak for consecutive days", () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    expect(calculateStreak([today, yesterday, twoDaysAgo])).toBe(3);
  });

  test("returns 0 when the streak is broken (last log was more than a day ago)", () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    expect(calculateStreak([threeDaysAgo, fourDaysAgo])).toBe(0);
  });

  test("stops counting when there is a gap between dates", () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    expect(calculateStreak([today, yesterday, threeDaysAgo])).toBe(2);
  });
});