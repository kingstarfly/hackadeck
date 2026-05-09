import type { NormalizedCardSpec } from "./cardSpecCore";

export function buildArtRerollPrompt(spec: NormalizedCardSpec) {
  return `SECTION 1: USE CASE
Create central mascot art only for a vertical collectible hackathon card. This image will be placed inside a rendered card frame. The app will add all text, stats, badges, and layout separately.

SECTION 2: HOUSE STYLE
Soft 2D illustration in the style of Sumikko Gurashi or gentle children's book art. Muted pastel palette (cream, peach, soft orange, sage, warm gray), minimal or no linework, soft subtle shading. Simple rounded shapes, dot eyes, gentle expressions. Charming but not saccharine - slightly shy, melancholic warmth. Feels like a beloved desk companion collectible.

SECTION 3: SUBJECT
Preserve the same Builder Familiar identity: ${spec.familiar_species}, ${spec.familiar_descriptor}. Keep the same personal relic: ${spec.personal_relic.name}, visually described as ${spec.personal_relic.visual}. The earned title "${spec.earned_title}" should still come through in the familiar's demeanor, but change the pose, expression, and small body arrangement from prior looks.

SECTION 4: ENVIRONMENT / HABITAT
Preserve the same affectionate habitat idea and card identity: ${spec.field_note} Include the relic and one gentle environment detail connected to ${spec.archetype_base} / ${spec.card_intent}. Vary the arrangement, prop placement, and character interaction so this feels like a fresh Look rather than a duplicate.

SECTION 5: COMPOSITION
Centered full-body character, generous padding, soft pastel background, no card frame, no border. Change the pose, expression, silhouette rhythm, and prop arrangement while keeping the species, relic, environment, palette, and gentle collectible mood recognizable as the same card identity.

SECTION 6: CONSTRAINTS
No text, no letters, no numbers, no logos, no trademarks, no watermark, no 3D rendering, no product photography, no neon, no holographic effects, no cyberpunk, no code rain, no glowing circuit patterns, no wizard robes, no fantasy armor, no magical staffs, no glowing eyes, no harsh outlines, no high contrast, no literal screens or browser windows.`;
}
