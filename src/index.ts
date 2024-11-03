import { promises as dns } from 'dns';
import { writeFileSync } from 'fs';
import { Command } from 'commander';
import { createZoneFile } from './zonerecordfile';

const DOMAIN: string = process.argv[2];
const OUTPUT_FILE: string = process.argv[3];
const OUTPUT_TYPE: string = process.argv[4];
const RECORD_TYPES: string[] = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];

const program = new Command();

type DNSRecord = {
  type: string;
  records: any[];
};

interface DNSZone {
  origin: string;
  ttl: number;
  soa: {
    mname: string;
    rname: string;
    serial: number;
    refresh: number;
    retry: number;
    expire: number;
    minimum: number;
  };
  ns: string[];
  a: Record<string, string[]>;
  aaaa: Record<string, string[]>;
  mx: { preference: number; exchange: string }[];
  txt: string[];
  cname: Record<string, string[]>;
}

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

export async function exportDNSRecords(domain: string = DOMAIN, outputFile: string = OUTPUT_FILE): Promise<void> {
  const results: Record<string, any[]> = {};

  for (const type of RECORD_TYPES) {
    console.log(`Querying ${type} records for ${domain}`);
    const result = await queryDNSRecords(domain, type);
    results[type] = result.records;
  }

  // Construct DNSZone object
  const dnsZone: DNSZone = {
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
    mx: results['MX']?.map((mx: any) => ({
      preference: mx.priority,
      exchange: mx.exchange,
    })) || [],
    txt: results['TXT']?.flat() || [],
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
    results['CNAME'].forEach((cname: any) => {
      // Assuming cname has 'name' and 'alias'
      dnsZone.cname[cname.alias] = [cname.name];
    });
  }

  // Generate zone file content
  const zoneFileContent = createZoneFile(dnsZone);

  // Write output based on OUTPUT_TYPE
  if (OUTPUT_TYPE === 'json') {
    writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`DNS records have been exported to ${outputFile}`);
  } else if (OUTPUT_TYPE === 'txt') {
    writeFileSync(outputFile, zoneFileContent);
    console.log(`DNS zone file has been exported to ${outputFile}`);
  } else {
    console.error(`Unsupported output type: ${OUTPUT_TYPE}. Use 'json' or 'txt'.`);
  }
}

function main() {
  program
    .version('1.0.0')
    .description('DNS Scraper CLI Tool')
    .option('-d, --domain <domain>', 'Domain to query', DOMAIN)
    .option('-o, --output <file>', 'Output file', OUTPUT_FILE)
    .option('-t, --type <type>', 'Output type: json or txt', OUTPUT_TYPE)
    .action(async (options) => {
      const { domain, output, type } = options;
      await exportDNSRecords(domain, output);
    });

  program.parse(process.argv);
}

main();