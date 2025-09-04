//declare module 'mkdir-p';

declare function mkdir(dist: string, callback: (err?: Error) => void): void;

declare namespace mkdir {
    export function sync(dist: string): void;
}

export = mkdir;
