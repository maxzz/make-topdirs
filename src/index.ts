import * as utl from './utils-os';

function genFilename(): string {
    // 0. Generate file/folder name.
    return utl.files.ensureNameUnique(`${utl.files.getDesktopPath()}/name ${utl.files.nowDayTime()}`, false);
}

function main(): void {
    console.log('' + genFilename());
}

main();
