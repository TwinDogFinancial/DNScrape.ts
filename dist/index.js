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
/**
 * Domain to query.
 */
const DOMAIN = process.argv[2];
/**
 * Output file.
 */
const OUTPUT_FILE = process.argv[3];
/**
 * List of DNS record types to query.
 */
const RECORD_TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];
/**
 * Initialize the Commander command.
 */
const program = new commander_1.Command();
/**
 * Function to query DNS records.
 * @param domain - The domain to query.
 * @param type - The DNS record type.
 * @returns A promise that resolves to a DNSRecord object.
 */
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
/**
 * Function to gather and export DNS records.
 * @param domain - The domain to query.
 * @param outputFile - The file path to write the DNS records.
 */
function exportDNSRecords() {
    return __awaiter(this, arguments, void 0, function* (domain = DOMAIN, outputFile = OUTPUT_FILE) {
        const results = {};
        for (const type of RECORD_TYPES) {
            console.log(`Querying ${type} records for ${domain}`);
            const result = yield queryDNSRecords(domain, type);
            results[type] = result.records;
        }
        // Write results to a JSON file
        (0, fs_1.writeFileSync)(outputFile, JSON.stringify(results, null, 2));
        console.log(`DNS records have been exported to ${outputFile}`);
    });
}
program
    .version('1.0.0')
    .description('DNS Scraper CLI Tool')
    .option('-d, --domain <domain>', 'Domain to query', DOMAIN)
    .option('-o, --output <file>', 'Output JSON file', OUTPUT_FILE)
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    const { domain, output } = options;
    yield exportDNSRecords(domain, output);
}));
program.parse(process.argv);
