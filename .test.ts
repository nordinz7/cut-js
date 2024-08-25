import { test, expect } from 'bun:test';
import { execSync } from "child_process";

const base = "bun index.ts"

const cases = [
  [`${base} -f2 sample.tsv`, "f1\n1\n6\n11\n16\n21\n\n"],
  [`${base} -f1 -d, fourchords.csv | head -n5`, "Song title\n\"10000 Reasons (Bless the Lord)\"\n\"20 Good Reasons\"\n\"Adore You\"\n\"Africa\"\n"],
  [`${base} -f1 sample.tsv`, "f0\n0\n5\n10\n15\n20\n\n"],
  [`${base} -f1,2 sample.tsv`, "f0\tf1\n0\t1\n5\t6\n10\t11\n15\t16\n20\t21\n\n"],
  [`${base} -d, "-f1 2" fourchords.csv | head -n5`, "Song title,Artist\n\"10000 Reasons (Bless the Lord)\",Matt Redman and Jonas Myrin\n\"20 Good Reasons\",Thirsty Merc\n\"Adore You\",Harry Styles\n\"Africa\",Toto\n"],
  [`tail -n5 fourchords.csv | ${base} -d, -f"1 2"`, "\"Young Volcanoes\",Fall Out Boy\n\"You Found Me\",The Fray\n\"You'll Think Of Me\",Keith Urban\n\"You're Not Sorry\",Taylor Swift\n\"Zombie\",The Cranberries\n\n"],
  [`tail -n5 fourchords.csv | ${base} -d, -f"1 2" -`, "\"Young Volcanoes\",Fall Out Boy\n\"You Found Me\",The Fray\n\"You'll Think Of Me\",Keith Urban\n\"You're Not Sorry\",Taylor Swift\n\"Zombie\",The Cranberries\n\n"],
  [`${base} -f2 -d, fourchords.csv | uniq | wc -l`, "155\n"]
]

test.each(cases)("%p", (cmd, expected) => {
  const output = execSync(cmd).toString()
  expect(output).toBe(expected)
});


