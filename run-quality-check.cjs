// Temporary script to run quality check and save full report
const { spawnSync } = require('child_process');
const fs = require('fs');

const result = spawnSync('pnpm', ['--filter', '@brainverse/api', 'seed:articles'], {
  cwd: __dirname,
  encoding: 'utf-8',
  shell: true,
});

const output = result.stdout + '\n--- STDERR ---\n' + result.stderr;
fs.writeFileSync('quality-fresh-report.txt', output, 'utf-8');

console.log('Exit code:', result.status);
console.log('Output length:', output.length, 'chars');
console.log('First 500 chars:');
console.log(output.substring(0, 500));
