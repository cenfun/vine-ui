import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const packagePath = path.resolve(projectRoot, 'package.json');
const requestedVersion = process.argv[2];

// `publish` is also an npm lifecycle event. Do nothing when npm publish
// invokes this script after the release preparation step.
if (!requestedVersion && process.env.npm_lifecycle_event === 'publish' && process.env.npm_command !== 'run') {
    console.log('Release preparation already completed; continuing npm publish.');
    process.exit(0);
}

const releaseType = requestedVersion || 'patch';
const color = (code, message) => `\u001b[${code}m${message}\u001b[0m`;
const fail = (message) => {
    console.error(color(31, message));
    process.exit(1);
};

const executable = (command) => process.platform === 'win32' && command === 'npm' ? 'npm.cmd' : command;
const run = (command, args, options = {}) => {
    if (!options.silent) {
        console.log(color(35, `> ${command} ${args.join(' ')}`));
    }
    try {
        return execFileSync(executable(command), args, {
            cwd: projectRoot,
            encoding: 'utf8',
            stdio: options.capture ? 'pipe' : 'inherit'
        }).trim();
    } catch (error) {
        const details = options.capture ? `\n${error.stderr || error.stdout || ''}` : '';
        throw new Error(`Command failed: ${command} ${args.join(' ')}${details}`);
    }
};

const originalPackageContent = fs.readFileSync(packagePath, 'utf8');
const currentVersion = JSON.parse(originalPackageContent).version;
let startHead;

try {
    const status = run('git', ['status', '--porcelain'], { capture: true, silent: true });
    if (status) {
        throw new Error(`Git working tree is not clean. Commit or stash changes first:\n${status}`);
    }

    startHead = run('git', ['rev-parse', 'HEAD'], { capture: true, silent: true });
    console.log(color(35, `Preparing ${releaseType} release from ${currentVersion}`));
    run('npm', ['version', releaseType, '-m', 'chore(release): %s']);

    const nextVersion = JSON.parse(fs.readFileSync(packagePath, 'utf8')).version;
    console.log(`Version: ${color(36, currentVersion)} -> ${color(32, nextVersion)}`);
    console.log(`\n${color(32, `Release ${nextVersion} prepared successfully.`)}`);
    console.log(color(35, 'Next steps (run manually):'));
    console.log(`1. ${color(36, 'git push && git push --tags')}`);
    console.log(`2. ${color(36, 'npm login')}`);
    console.log(`3. ${color(36, 'npm publish')}`);
} catch (error) {
    if (startHead) {
        const currentHead = run('git', ['rev-parse', 'HEAD'], { capture: true, silent: true });
        if (currentHead === startHead) {
            fs.writeFileSync(packagePath, originalPackageContent);
            run('git', ['reset', '--quiet', '--', 'package.json', 'package-lock.json'], { silent: true });
        }
    }
    fail(`Release failed: ${error.stack || error.message}`);
}
