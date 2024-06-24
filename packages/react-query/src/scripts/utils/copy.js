"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var __dirname = process.cwd();
console.log(__dirname);
function copy(version) {
    var files = fs_1.default.readdirSync(__dirname);
    files.forEach(function (file) {
        if (file.startsWith("v".concat(version))) {
            var src = (0, path_1.join)(__dirname, file);
            var ext = (0, path_1.extname)(file);
            var dest = (0, path_1.join)(__dirname, "index".concat(ext));
            var content = fs_1.default.readFileSync(src, 'utf-8');
            try {
                fs_1.default.unlinkSync(dest);
            }
            catch (e) {
                /* empty */
            }
            fs_1.default.writeFileSync(dest, content, 'utf-8');
        }
    });
}
exports.copy = copy;
