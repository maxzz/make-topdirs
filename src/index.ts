import * as utl from './utils-os';

function genFilename(): string {
    // 0. Generate file/folder name.
    //return utl.files.ensureNameUnique(`${utl.files.getDesktopPath()}/name ${utl.files.nowDayTime()}`, false);
    //return utl.files.ensureNameUnique(`${utl.files.getDesktopPath()}/name ${utl.files.nowDayTime()}.txt`);
    //return utl.files.ensureNameUnique(`${utl.files.getDesktopPath()}/name ${utl.files.nowDayTime()}`); //C:\Users\max/Desktop\name 05.17.17 at 01.42.38 (1).617
    return utl.files.ensureNameUnique(`${utl.files.getDesktopPath()}/name ${utl.files.nowDayTime()}.`);
}

function main(): void {
    console.log('' + genFilename());
}

main();
