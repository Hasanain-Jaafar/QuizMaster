const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '../src/data/quizData.en.ts');
const outPath = path.join(__dirname, '../src/data/quizData.sv.ts');
const sv50 = require('./sv-50.js');

const en = fs.readFileSync(enPath, 'utf8').replace(/\r\n/g, '\n');
// Split by "  }," followed by optional comment lines and "  {" (category comments between blocks)
const rawBlocks = en.split(/  \},\s*\n(?:\s*\/\/[^\n]*\n)*\s*\{/);
// First "block" is "export const quizQuestionsEn: QuizQuestion[] = [  {" etc; last is "...  } ];"
// We need to peel: remove array header from first, split out each "{ ... }", and trim "];" from last.
const firstPart = rawBlocks[0].replace(/^[\s\S]*?=\s*\[\s*\{\s*/, '  {\n    ');
const lastPart = (rawBlocks[rawBlocks.length - 1] || '').replace(/\s*\}\s*\]\s*;?\s*$/, '');
const middle = rawBlocks.slice(1, -1).map((s) => '  {\n    ' + s.trim());
const allBlocks = [firstPart, ...middle, lastPart];
if (allBlocks.length !== 100) throw new Error('Expected 100 blocks, got ' + allBlocks.length + ' (raw: ' + rawBlocks.length + ')');

function parseBlock(block, index) {
  const id = parseInt(block.match(/id:\s*(\d+)/)?.[1] ?? '0', 10);
  const correctAnswer = parseInt(block.match(/correctAnswer:\s*(\d+)/)?.[1] ?? '0', 10);
  const category = block.match(/category:\s*"([^"]*)"/)?.[1] ?? '';
  const difficulty = block.match(/difficulty:\s*"([^"]*)"/)?.[1] ?? 'easy';
  const questionMatch = block.match(/question:\s*"((?:[^"\\]|\\.)*)"/);
  const question = questionMatch ? questionMatch[1].replace(/\\"/g, '"') : '';
  const optionsMatch = block.match(/options:\s*\[(.*?)\]/s);
  let options = ['', '', ''];
  if (optionsMatch) {
    const parts = optionsMatch[1].match(/"((?:[^"\\]|\\.)*)"/g);
    if (parts) options = parts.map((p) => p.slice(1, -1).replace(/\\"/g, '"'));
  }
  const explanationMatch = block.match(/explanation:\s*"((?:[^"\\]|\\.)*)"/);
  const explanation = explanationMatch ? explanationMatch[1].replace(/\\"/g, '"') : '';
  return { id, correctAnswer, category, difficulty, question, options, explanation };
}

const lines = [
  "import { QuizQuestion } from '@/types/quiz';",
  '',
  "export const quizQuestionsSv: QuizQuestion[] = [",
];

for (let i = 0; i < 100; i++) {
  const block = allBlocks[i];
  // Normalize: ensure block starts with id: (may have "  {" before)
  const b = block.replace(/^\s*\{\s*/, '').replace(/\s*\}\s*$/, '');
  const p = parseBlock(b, i);
  const sv = i < 50 ? sv50[i] : null;
  const q = sv ? sv.question : p.question;
  const o = sv ? sv.options : p.options;
  const e = sv ? sv.explanation : p.explanation;
  const optStr = o.map((x) => `"${x.replace(/"/g, '\\"')}"`).join(', ');
  lines.push('  {');
  lines.push(`    id: ${p.id},`);
  lines.push(`    question: "${q.replace(/"/g, '\\"')}",`);
  lines.push(`    options: [${optStr}],`);
  lines.push(`    correctAnswer: ${p.correctAnswer},`);
  lines.push(`    explanation: "${e.replace(/"/g, '\\"')}",`);
  lines.push(`    category: "${p.category}",`);
  lines.push(`    difficulty: "${p.difficulty}"`);
  lines.push('  },');
}

lines[lines.length - 1] = '  }';
lines.push('];');

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('Wrote', outPath);
