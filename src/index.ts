import * as utl from './utils-os';

function nowDay(d: Date): string {
    let a = utl.zeros('aa', 4);
    let nowT = `${utl.zeros(d.getMonth() + 1, 2)}.${utl.zeros(d.getDate(), 2)}.${d.getFullYear() % 100}`;
    return nowT;
}

function nowTime(d: Date): string {
    let nowT = `${utl.zeros(d.getHours(), 2)}.${utl.zeros(d.getMinutes(), 2)}.${utl.zeros(d.getSeconds(), 2)}.${utl.zeros(d.getMilliseconds(), 3)}`;
    return nowT;
}

function main(): void {
    let d: Date = new Date();
    console.log(nowDay(d));
    console.log(nowTime(d));
    console.log(utl.utl.getDesktop());
}

main();
