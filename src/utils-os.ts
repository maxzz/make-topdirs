import * as fs from 'fs';
import * as path from 'path';
import * as mkdir from 'mkdir-p';

interface INameEncoding {
    name: string;
    enc: string;
}

export class utl {
    static formatWith(str: string, obj: Object): string {
        // 0. Replaces string patterns with named parameters: formatWith("Hello, {subject}", {subject: "world"}) --> "Hello, world"
        return str.replace(/{([\w\$_]+)}/gm, function fmt_(all, name) {
            return obj[name] || all;
        });
    } //formatWith()

    static formatDeep(str: string, obj: Object): string {
        // 0. Replaces nested patterns.
        str = this.formatWith(str, obj);
        var more: RegExpExecArray = /{([\w\$_]+)}/.exec(str);
        if (more && typeof obj[more[1]] === 'string') {
            str = this.formatDeep(str, obj);
        }
        return str;
    } //formatPath()

    static zeros(str_: string | any, total_: number): string {
        // Returns str_ prefixed with '0's.
        if (typeof str_ !== 'string') {
            str_ = '' + str_;
        }

        if (str_.length === 0 || str_.length >= total_) {
            return str_;
        }

        return '0000000000'.slice(0, total_ - str_.length) + str_;
    } //zeros()

    static isContentMinimized(fname: string): boolean {
        // 0. Is file minimized and not empty. TODO: handle starting comments.
        let cnt = fs.readFileSync(fname).toString();
        return cnt.length > 0 && cnt.indexOf('\n') < 0;
    }

    static exist(name: string): fs.Stats | undefined {
        try {
            return fs.statSync(name);
        } catch (e) {
        }
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
            m: RegExpExecArray = re.exec(fname_);
        return {
            name: m && m[1] ? m[1] : fname_,
            enc: m && m[2] ? m[2] : 'utf8'
        };
    } //nameEncoding()

    static readFileSync(fname_: string, encoding_?: string) {
        var uri: INameEncoding = {
            name: fname_,
            enc: encoding_
        };
        if (!encoding_) {
            uri = this.nameEncoding(fname_);
        }
        var cnt = this.stripBOM(fs.readFileSync(uri.name, uri.enc));
        return cnt;
    } //readFileSync()

    static writeFileSync(fname_: string, text_: string, encoding_?: string) {
        var uri: INameEncoding = {
            name: fname_,
            enc: encoding_
        };
        if (!encoding_) {
            uri = this.nameEncoding(fname_);
        }

        uri.name = path.resolve(uri.name);

        let dir = path.dirname(uri.name);
        mkdir.sync(dir);

        fs.writeFileSync(uri.name, text_, { encoding: uri.enc });
    } //writeFileSync()

    static getDesktop(): string {
        if (!process.env.USERPROFILE) {
            throw Error('User home is undefined');
        }
        return process.env.USERPROFILE + '/Desktop';
    }

} //class utl

//module.exports.zeros = utl.zeros;
//exports.zeros = utl.zeros;
//module.exports.zeros = utl.zeros.bind(utl);
export const zeros: (str_: string | any, total_: number) => string = utl.zeros.bind(utl);
