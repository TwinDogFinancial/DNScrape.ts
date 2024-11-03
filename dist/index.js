"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryDNSRecords = queryDNSRecords;
exports.exportDNSRecords = exportDNSRecords;
const dns_1 = require("dns");
const fs_1 = require("fs");
const commander_1 = require("commander");
const zonerecordfile_1 = require("./zonerecordfile");
const DOMAIN = process.argv[2];
const OUTPUT_FILE = process.argv[3];
const OUTPUT_TYPE = process.argv[4];
const RECORD_TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];
const program = new commander_1.Command();
function queryDNSRecords(domain, type) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const records = yield dns_1.promises.resolve(domain, type);
            return { type, records };
        }
        catch (error) {
            if (error.code === 'ENODATA') {
                console.warn(`No ${type} records found for ${domain}.`);
            }
            else {
                console.error(`Error querying ${type} records for ${domain}:`, error.message);
            }
            return { type, records: [] };
        }
    });
}
function exportDNSRecords() {
    return __awaiter(this, arguments, void 0, function* (domain = DOMAIN, outputFile = OUTPUT_FILE) {
        var _a, _b;
        const results = {};
        for (const type of RECORD_TYPES) {
            console.log(`Querying ${type} records for ${domain}`);
            const result = yield queryDNSRecords(domain, type);
            results[type] = result.records;
        }
        // Construct DNSZone object
        const dnsZone = {
            origin: domain,
            ttl: 3600, // Default TTL, you can adjust as needed
            soa: {
                mname: 'ns1.example.com', // Replace with your nameserver
                rname: 'hostmaster.example.com', // Replace with your email, '.' instead of '@'
                serial: Date.now(),
                refresh: 7200,
                retry: 3600,
                expire: 1209600,
                minimum: 3600,
            },
            ns: results['NS'] || [],
            a: {},
            aaaa: {},
            mx: ((_a = results['MX']) === null || _a === void 0 ? void 0 : _a.map((mx) => ({
                preference: mx.priority,
                exchange: mx.exchange,
            }))) || [],
            txt: ((_b = results['TXT']) === null || _b === void 0 ? void 0 : _b.flat()) || [],
            cname: {},
        };
        // Populate A records
        if (results['A']) {
            dnsZone.a[domain] = results['A'];
        }
        // Populate AAAA records
        if (results['AAAA']) {
            dnsZone.aaaa[domain] = results['AAAA'];
        }
        // Populate CNAME records (Assuming you have CNAME records in your results)
        if (results['CNAME']) {
            results['CNAME'].forEach((cname) => {
                // Assuming cname has 'name' and 'alias'
                dnsZone.cname[cname.alias] = [cname.name];
            });
        }
        // Generate zone file content
        const zoneFileContent = (0, zonerecordfile_1.createZoneFile)(dnsZone);
        // Write output based on OUTPUT_TYPE
        if (OUTPUT_TYPE === 'json') {
            (0, fs_1.writeFileSync)(outputFile, JSON.stringify(results, null, 2));
            console.log(`DNS records have been exported to ${outputFile}`);
        }
        else if (OUTPUT_TYPE === 'txt') {
            (0, fs_1.writeFileSync)(outputFile, zoneFileContent);
            console.log(`DNS zone file has been exported to ${outputFile}`);
        }
        else {
            console.error(`Unsupported output type: ${OUTPUT_TYPE}. Use 'json' or 'txt'.`);
        }
    });
}
function main() {
    program
        .version('1.0.0')
        .description('DNS Scraper CLI Tool')
        .option('-d, --domain <domain>', 'Domain to query', DOMAIN)
        .option('-o, --output <file>', 'Output file', OUTPUT_FILE)
        .option('-t, --type <type>', 'Output type: json or txt', OUTPUT_TYPE)
        .action((options) => __awaiter(this, void 0, void 0, function* () {
        const { domain, output, type } = options;
        yield exportDNSRecords(domain, output);
    }));
    program.parse(process.argv);
}
main();
