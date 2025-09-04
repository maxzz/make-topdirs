/////////////////////////////////////////////////////////////////////////////
//H05.16.17

/////////////////////////////////////////////////////////////////////////////

//module.exports.zeros = utl.zeros;
//exports.zeros = utl.zeros;
//module.exports.zeros = utl.zeros.bind(utl);
export const zeros : (str_: string | any, total_ : number) = > string = utl.zeros.bind(utl);

/////////////////////////////////////////////////////////////////////////////

//https://nodejs.org/api/path.html#path_path_basename_path_ext
/*
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
*/
    static ensureFilenameUnique(fname: string): string {
        let basename: string;
        let ext: string;

        let index: number = 0;
        let initialized: boolean = false;

        while (1) {
            if (!this.exist(fname)) {
                return fname;
            }

            if (!initialized) {
                basename = files.getPath(fname) + files.getFnameWithExt::get_fnameonly(fname);
                ext = fnames::get_extension(fname);
                initialized = true;
            }

            index++;

            fname = `${basename} (${index})${ext}`;
        } //while
    } //ensureFilenameUnique()

/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
