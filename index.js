#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');

const stdout = shell.exec('git branch', {
  silent: true
});

const currentDailyBranch = stdout.split('\n')
  .find(branch => branch.match(/\*\sdaily\/(\d*\.\d*\.\d*)/));

if (!currentDailyBranch){
  console.log(chalk.red('当前分支不是 daily/*.*.* 分支，将不予调整 package.json 版本号信息'));
  return;
};

const branchVersion = currentDailyBranch.split('/')[1];

const pkgPath = path.resolve(process.cwd(), './package.json');
const pkg = require(pkgPath);
if (pkg.version !== branchVersion){
  pkg.version = branchVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}
