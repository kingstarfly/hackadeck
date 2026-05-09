import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import schema from "./schema";

declare global {
  interface ImportMeta {
    glob(pattern: string): Record<string, () => Promise<unknown>>;
  }
}

const modules = import.meta.glob("./**/*.*s");

describe("Convex schema", () => {
  it("stores participants using email as the hackathon identity", async () => {
    const t = convexTest(schema, modules);

    const participantId = await t.run(async (ctx) =>
      ctx.db.insert("participants", {
        email: "maya@example.com",
        displayName: "Maya",
        teamName: "Cache Money",
        consentGallery: true,
        createdAt: Date.now(),
      }),
    );

    const participant = await t.run((ctx) => ctx.db.get(participantId));

    expect(participant).toMatchObject({
      email: "maya@example.com",
      displayName: "Maya",
      consentGallery: true,
    });
  });
});
