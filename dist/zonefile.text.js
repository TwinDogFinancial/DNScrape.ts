"use strict";
//create a zonefile from a dns zone
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZonefile = createZonefile;
const zonerecordfile_1 = require("./zonerecordfile");
function createZonefile(zone) {
    return (0, zonerecordfile_1.generate)(zone);
}
