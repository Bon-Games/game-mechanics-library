import { readContent } from "../src/lib/read-content";

const { mechanics, categories, sources } = readContent();
console.log("[OK] Validated " + mechanics.length + " mechanics, " + categories.length + " categories, " + sources.length + " sources.");
