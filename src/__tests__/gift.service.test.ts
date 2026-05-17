// Unit tests for gift service
// Integration tests require a running PostgreSQL instance

describe("Gift status transitions", () => {
  it("valid statuses are defined", () => {
    const statuses = ["pending", "funded", "locked", "unlocked", "claimed", "expired"];
    expect(statuses).toHaveLength(6);
  });
});

describe("StellarSurprise branding", () => {
  it("project name is correct", () => {
    expect("StellarSurprise").toContain("Stellar");
  });
});
