import * as utl from './utils-os';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdir from 'mkdir-p';

function genFilename(): string {
    // 0. Generate file/folder name.
    return utl.files.ensureNameUnique(`${utl.files.getDesktopPath()}/name ${utl.files.nowDayTime()}`, false);
}

class app {
    static isOurdir(name: string): boolean {
        return /^\[\d+\] /.test(name);
    }
    static scanSubDirs(name: string, level: number, rv_names: string[]) {
        fs.readdirSync(name).forEach((subName: string) => {
            let fn = path.join(name, subName);
            if (utl.files.isDirectory(fn)) {
                if (level === 1 || this.isOurdir(subName)) {
                    rv_names.push(fn);
                    this.scanSubDirs(fn, level + 1, rv_names);
                }
            }
        });
    } //scanSubDirs()

    static makeDestList(names: string[]): string[] {
        let rv: string[] = [];
        names.forEach((name) => {
            if (utl.files.isDirectory(name)) {
                this.scanSubDirs(name, 1, rv);
            }
        });
        return rv;
    } //makeDestList()
} //class app

function main(): void {
    console.log('Starting...\n');

    let newArgs = process.argv.slice(2);
    let jsFilesToDo: string[] = app.makeDestList(newArgs);

    if (!jsFilesToDo || !jsFilesToDo.length) {
        console.log(`Nothing to do on path:\n"${newArgs}"\n`);
        return;
    }

    jsFilesToDo.forEach((val, index, array) => {

        let fname = path.basename(val),
            srcDir = path.dirname(val);

        let short = path.relative(newArgs[0], val);
        console.log(`short "${short}"`);

        //console.log(`  ${utl.zeros(index + 1, 3)} of ${jsFilesToDo.length} ${fname}`); //Skipped as uncompressed

        let inPlace = true;
        let dstDir = inPlace ? srcDir : path.join(srcDir, 'jsnice');
        let finalName = path.join(dstDir, fname);

        //mkdir.sync(dstDir);

    }); //forEach

    console.log('\nDone.\n');
}

main();
