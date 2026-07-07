import fs from "fs";
const c = fs.readFileSync("Frontend/app/(dashboard)/admin/page.tsx", "utf8");
const lines = c.split("\n");

// check braces
let depth = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  for (let j = 0; j < l.length; j++) {
    if (l[j] === "{") depth++;
    if (l[j] === "}") depth--;
    if (depth < 0) {
      console.log(`Extra } at line ${i + 1}: ${l}`);
      depth = 0;
    }
  }
}
console.log(`Brace depth: ${depth}`);

// Check for any stray regex-like patterns
const regexLike = /[^a-zA-Z0-9)]\/([^\/\n*]|\\\/)+\/[gimsuy]*/g;
for (let i = 0; i < lines.length; i++) {
  const matches = lines[i].match(regexLike);
  if (matches) {
    // filter out obvious non-regex like URLs
    for (const m of matches) {
      if (m.includes("//")) continue;
      if (m.includes("http")) continue;
      console.log(`Potential regex at line ${i + 1}: ${m.trim()}`);
    }
  }
}

console.log("Done");
