// Wrapper to ensure PATH includes our node installation before starting next dev
const { execSync, spawn } = require('child_process');
const path = require('path');

const nodeBinDir = path.dirname(process.execPath);
process.env.PATH = `${nodeBinDir}:${process.env.PATH || ''}`;

const child = spawn(process.execPath, ['node_modules/.bin/next', 'dev'], {
  stdio: 'inherit',
  env: process.env,
  cwd: __dirname,
});

child.on('exit', (code) => process.exit(code));
