import * as fs from 'fs';
import * as path from 'path';

export function formatWith(str: string, obj: any): string {
    // 0. Replaces string patterns with named parameters: formatWith("Hello, {subject}", {subject: "world"}) --> "Hello, world"
    return str.replace(/{([\w\$_]+)}/gm, function fmt_(all, name) {
        return obj[name] || all;
    });
} //formatWith()

export function formatDeep(str: string, obj: any): string {
    // 0. Replaces nested patterns.
    str = formatWith(str, obj);
    var more: RegExpExecArray | null = /{([\w\$_]+)}/.exec(str);
    if (more && typeof obj[more[1]] === 'string') {
        str = formatDeep(str, obj);
    }
    return str;
} //formatPath()

export function zeros(str_: string | any, total_: number): string {
    // Returns str_ prefixed with '0's.
    if (typeof str_ !== 'string') {
        str_ = '' + str_;
    }

    if (str_.length === 0 || str_.length >= total_) {
        return str_;
    }

    return '0000000000'.slice(0, total_ - str_.length) + str_;
} //zeros()

export interface INameEncoding {
    name: string;
    enc: string;
}

export class files {
    static exist(name: string): fs.Stats | undefined {
        try {
            return fs.statSync(name);
        } catch (e) {
        }
    }

    static getExt(name: string): string {
        return path.extname(name);
    }

    static getFnameWithExt(name: string): string {
        return path.basename(name);
    }

    static getFnameWithoutExt(fileName: string): string {
        return path.basename(fileName).split('.')[0];
    }

    static toUnix(fileName: string): string {
        const double = /\/\//;
        let res: string = fileName.replace(/\\/g, '/');
        while (res.match(double)) {
            res = res.replace(double, '/');
        }
        return res;
    }

    static getPath(name: string): string {
        return path.dirname(name);
    }

    static isDirectory(name: string): boolean | undefined {
        // 0. Returns true/false if dir/file exists, otherwise undefined (i.e. aka exist()).
        try {
            return fs.statSync(name).isDirectory();
        } catch (e) {
        }
    }

    static isExt(name: string, ext: string): boolean {
        return path.extname(name).toLowerCase() === ext;
    }

    static isContentMinimized(fname: string): boolean {
        // 0. Is file minimized and not empty. TODO: handle starting comments.
        let cnt = fs.readFileSync(fname).toString();
        return cnt.length > 0 && cnt.indexOf('\n') < 0;
    }

    static stripBOM(content: string): string {
        // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
        // because the buffer-to-string conversion in `fs.readFileSync()`
        // translates it to FEFF, the UTF-16 BOM.
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }
        return content;
    } //stripBOM()

    static nameEncoding(fname_: string): INameEncoding {
        // 0. split 'name ? utf16' to 'name' and 'utf16'
        let re = /^\s*([^?\s]*)\s*\?\s*([^\s]*)/,
            m: RegExpExecArray | null = re.exec(fname_);
        return {
            name: m && m[1] ? m[1] : fname_,
            enc: m && m[2] ? m[2] : 'utf8'
        };
    } //nameEncoding()

    static readFileSync(fname_: string, encoding_?: string) {
        var uri: INameEncoding = {
            name: fname_,
            enc: encoding_ || 'utf8'
        };
        if (!encoding_) {
            uri = this.nameEncoding(fname_);
        }
        var cnt = this.stripBOM(fs.readFileSync(uri.name, uri.enc as BufferEncoding));
        return cnt;
    } //readFileSync()

    static writeFileSync(fname_: string, text_: string, encoding_?: BufferEncoding) {
        var uri: INameEncoding = {
            name: fname_,
            enc: encoding_ || 'utf8'
        };
        if (!encoding_) {
            uri = this.nameEncoding(fname_);
        }

        uri.name = path.resolve(uri.name);

        let dir = path.dirname(uri.name);
        fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(uri.name, text_, { encoding: uri.enc as BufferEncoding });
    } //writeFileSync()

    static getDesktopPath(): string {
        if (!process.env.USERPROFILE) {
            throw Error('User HOME is undefined');
        }
        return path.join(process.env.USERPROFILE, 'Desktop');
    }

    static nowDay(d: Date): string {
        return `${zeros(d.getMonth() + 1, 2)}.${zeros(d.getDate(), 2)}.${d.getFullYear() % 100}`;
    }

    static nowTime(d: Date): string {
        return `${zeros(d.getHours(), 2)}.${zeros(d.getMinutes(), 2)}.${zeros(d.getSeconds(), 2)}.${zeros(d.getMilliseconds(), 3)}`;
    }

    static nowDayTime(delimiter: string = ' at ') {
        let d: Date = new Date();
        return `${this.nowDay(d)}${delimiter}${this.nowTime(d)}`;
    }

    static ensureNameUnique(name: string, nameIsFname: boolean = true): string | undefined {
        // 0. Ensure that file/folder name is unique.
        let basename: string = '', ext: string = '', index: number = 0, initialized: boolean = false;

        while (1) {
            let st: fs.Stats | undefined = this.exist(name);
            if (!st || (st.isDirectory() === nameIsFname)) { // case if folder exist but we create file name.
                return name;
            }
            if (!initialized) {
                let org: path.ParsedPath = path.parse(name);
                if (nameIsFname) {
                    org.base = org.name; // to set base name wo/ ext.
                    ext = org.ext; // folder name may have '.', so keep ext only for file names.
                }
                org.ext = '';
                basename = path.format(org);
                initialized = true;
            }
            index++;
            name = `${basename} (${index})${ext}`;
        }
    }

}
