import { promises as dns } from 'dns';
import { writeFileSync } from 'fs';
import { Command } from 'commander';


/**
 * Domain to query.
 */
const DOMAIN: string = process.argv[2];

/**
 * Output file.
 */
const OUTPUT_FILE: string = process.argv[3];

/**
 * List of DNS record types to query.
 */
const RECORD_TYPES: string[] = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];

/**
 * Initialize the Commander command.
 */
const program = new Command();

/**
 * Define a type for DNS records.
 */
type DNSRecord = {
    type: string;
    records: any[];
};

/**
 * Function to query DNS records.
 * @param domain - The domain to query.
 * @param type - The DNS record type.
 * @returns A promise that resolves to a DNSRecord object.
 */
export async function queryDNSRecords(domain: string, type: string): Promise<DNSRecord> {
    try {
        const records = await dns.resolve(domain, type) as any;
        return { type, records };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENODATA') {
            console.warn(`No ${type} records found for ${domain}.`);
        } else {
            console.error(`Error querying ${type} records for ${domain}:`, (error as Error).message);
        }
        return { type, records: [] };
    }
}

/**
 * Function to gather and export DNS records.
 * @param domain - The domain to query.
 * @param outputFile - The file path to write the DNS records.
 */
export async function exportDNSRecords(domain: string = DOMAIN, outputFile: string = OUTPUT_FILE): Promise<void> {
    const results: Record<string, any[]> = {};

    for (const type of RECORD_TYPES) {
        console.log(`Querying ${type} records for ${domain}`);
        const result = await queryDNSRecords(domain, type);
        results[type] = result.records;
    }

    // Write results to a JSON file
    writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`DNS records have been exported to ${outputFile}`);
}

program
  .version('1.0.0')
  .description('DNS Scraper CLI Tool')
  .option('-d, --domain <domain>', 'Domain to query', DOMAIN)
  .option('-o, --output <file>', 'Output JSON file', OUTPUT_FILE)
  .action(async (options) => {
    const { domain, output } = options;
    await exportDNSRecords(domain, output);
  });

program.parse(process.argv);