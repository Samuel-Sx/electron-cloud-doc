const fs = window.require('fs').promises;

const fileOpt = {
    save: (path, data) => {
        return fs.writeFile(path, data, {encoding: 'utf8'});
    },
    rename: (path, newpath) => {
        return fs.rename(path, newpath);
    },
    remove: (path) => {
        return fs.unlink(path);
    },
    getContent: (path) => {
        return fs.readFile(path, {encoding: 'utf8'});
    }
}

module.exports =  fileOpt;