"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZoneFile = createZoneFile;
function createZoneFile(zone) {
    const lines = [];
    // SOA Record
    lines.push(`$TTL ${zone.ttl}`, `@ IN SOA ${zone.soa.mname} ${zone.soa.rname} (`, `\t${zone.soa.serial} ; Serial`, `\t${zone.soa.refresh} ; Refresh`, `\t${zone.soa.retry} ; Retry`, `\t${zone.soa.expire} ; Expire`, `\t${zone.soa.minimum} ; Minimum TTL`, `)`);
    // NS Records
    zone.ns.forEach((ns) => {
        lines.push(`\tIN NS ${ns}`);
    });
    // A Records
    for (const [name, ips] of Object.entries(zone.a)) {
        ips.forEach((ip) => {
            lines.push(`${name} \tIN A \t${ip}`);
        });
    }
    // AAAA Records
    for (const [name, ips] of Object.entries(zone.aaaa)) {
        ips.forEach((ip) => {
            lines.push(`${name} \tIN AAAA \t${ip}`);
        });
    }
    // MX Records
    zone.mx.forEach((mx) => {
        lines.push(`\tIN MX ${mx.preference} ${mx.exchange}`);
    });
    // TXT Records
    zone.txt.forEach((txt) => {
        lines.push(`\tIN TXT "${txt}"`);
    });
    // CNAME Records
    for (const [alias, targets] of Object.entries(zone.cname)) {
        targets.forEach((target) => {
            lines.push(`${alias} \tIN CNAME \t${target}`);
        });
    }
    return lines.join('\n');
}
