import { describe, expect, it } from "vitest";
import {
  academicFields,
  addressFields,
  personalFields,
  preferenceFields,
  profileCompletion,
  type CustomerProfile,
} from "./model";
import { accountName, initials, customerRoutes } from "./navigation";
const form = (values: Record<string, string>) => {
  const f = new FormData();
  for (const [key, value] of Object.entries(values)) f.append(key, value);
  return f;
};
describe("student profile data", () => {
  it("separates optional student details from identity", () => {
    expect(academicFields(form({})).account_class).toBeNull();
    expect(() => academicFields(form({ study_year: "2.5" }))).toThrow();
    expect(() => academicFields(form({ graduation_year: "1899" }))).toThrow();
    expect(() => academicFields(form({ account_class: "Admin" }))).toThrow();
    const academic = academicFields(
      form({ account_class: "Student", college_name: "  Campus  ", study_year: "3" }),
    );
    expect(academic.college_name).toBe("Campus");
    expect(academic.study_year).toBe(3);
    expect(personalFields(form({ full_name: " Test Student " }))).toEqual({
      full_name: "Test Student",
      display_name: null,
      phone_number: null,
    });
  });
  it("validates category preferences and the supported delivery region", () => {
    expect(() => preferenceFields(form({ preferred_categories: "unknown" }))).toThrow();
    expect(() => addressFields(form({ phone: "9000000000", pin: "011001" }))).toThrow();
    expect(addressFields(form({ phone: "9000000000", pin: "411001" })).pin).toBe("411001");
  });
  it("summarizes only the profile details applicable to the account", () => {
    expect(
      profileCompletion({ full_name: "Taylor", account_class: "Professional" } as CustomerProfile),
    ).toEqual({ filled: 2, total: 2 });
    expect(
      profileCompletion({
        full_name: "Taylor",
        account_class: "Student",
        college_name: "School",
      } as CustomerProfile),
    ).toEqual({ filled: 3, total: 5 });
  });
  it("provides bounded identity labels and distinct navigable routes", () => {
    expect(accountName(null)).toBe("Customer");
    expect(accountName("legacy@example.invalid")).toBe("Customer");
    expect(initials("Samira Example Student")).toBe("SS");
    expect(new Set(customerRoutes.map((r) => r.href)).size).toBe(customerRoutes.length);
  });
});
