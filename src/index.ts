import * as utl from './utils-os';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

function genFolderName(): string | undefined {
    // 0. Generate file/folder name.
    return utl.files.ensureNameUnique(`${utl.files.getDesktopPath()}/copy ${utl.files.nowDayTime()}`, false);
}

class app {
    private static isOurdir(name: string): boolean {
        return /^\[\d+\] /.test(name); // i.e. folder name starts from [1]
    }

    private static scanSubDirs(name: string, level: number, rv_names: string[]) {
        fs.readdirSync(name).forEach((subName: string) => {
            let fn = path.join(name, subName);
            if (utl.files.isDirectory(fn)) {
                if (level === 1 || this.isOurdir(subName)) {
                    rv_names.push(fn);
                    this.scanSubDirs(fn, level + 1, rv_names);
                }
            }
        });
    }

    static handleNames(dest: string, names: string[]) {
        names.forEach((root) => {
            if (utl.files.isDirectory(root)) {
                let rv: string[] = [];
                this.scanSubDirs(root, 1, rv);

                console.log(`from "${root}"`);
                rv.forEach((sub) => {
                    let short = path.relative(root, sub);
                    let last = names.length === 1 ? '' : path.basename(root);
                    let newName = path.join(dest, last, short);

                    console.log(`  to "${newName}"`);
                    fs.mkdirSync(newName, { recursive: true });
                });
            }
        });
    }
}

function main(): void {
    console.log(chalk.cyan('Starting folders structure replication...\n'));

    let newArgs = process.argv.slice(2);
    if (!newArgs.length) {
        console.log(chalk.red(`Specify one or more folder names to replicate folders structure.`));
        console.log(chalk.red(`Nothing to do with args:\n\t[${process.argv}]\n`));
        return;
    }

    let dest = genFolderName();
    if (!dest) {
        throw Error('Failed to generate folder name.');
    }

    app.handleNames(dest, newArgs);

    console.log('\nDone.\n');
}

main();
