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
  
  export function createZoneFile(zone: DNSZone): string {
    const lines: string[] = [];
  
    // SOA Record
    lines.push(
      `$TTL ${zone.ttl}`,
      `@   IN  SOA ${zone.soa.mname}. ${zone.soa.rname}. (`,
      `        ${zone.soa.serial} ; Serial`,
      `        ${zone.soa.refresh.toString().padEnd(9)} ; Refresh`,
      `        ${zone.soa.retry.toString().padEnd(9)} ; Retry`,
      `        ${zone.soa.expire.toString().padEnd(9)} ; Expire`,
      `        ${zone.soa.minimum.toString().padEnd(9)}) ; Minimum TTL`,
      `` // Blank line
    );
  
    // NS Records
    lines.push(`; Name Servers`);
    zone.ns.forEach((ns) => {
      lines.push(`    IN  NS  ${ns}.`);
    });
    lines.push(''); // Blank line
  
    // MX Records
    if (zone.mx.length > 0) {
      lines.push(`; Mail Servers`);
      zone.mx.forEach((mx) => {
        lines.push(`    IN  MX  ${mx.preference} ${mx.exchange}.`);
      });
      lines.push(''); // Blank line
    }
  
    // A Records
    if (Object.keys(zone.a).length > 0) {
      lines.push(`; A Records`);
      for (const [name, ips] of Object.entries(zone.a)) {
        ips.forEach((ip) => {
          const recordName = name === zone.origin ? '@' : name;
          lines.push(`${recordName.padEnd(12)} IN  A     ${ip}`);
        });
      }
      lines.push(''); // Blank line
    }
  
    // AAAA Records
    if (Object.keys(zone.aaaa).length > 0) {
      lines.push(`; AAAA Records`);
      for (const [name, ips] of Object.entries(zone.aaaa)) {
        ips.forEach((ip) => {
          const recordName = name === zone.origin ? '@' : name;
          lines.push(`${recordName.padEnd(12)} IN  AAAA  ${ip}`);
        });
      }
      lines.push(''); // Blank line
    }
  
    // CNAME Records
    if (Object.keys(zone.cname).length > 0) {
      lines.push(`; CNAME Records`);
      for (const [alias, targets] of Object.entries(zone.cname)) {
        targets.forEach((target) => {
          lines.push(`${alias.padEnd(12)} IN  CNAME ${target}.`);
        });
      }
      lines.push(''); // Blank line
    }
  
    // TXT Records
    if (zone.txt.length > 0) {
      lines.push(`; TXT Records`);
      zone.txt.forEach((txt) => {
        lines.push(`@           IN  TXT   "${txt}"`);
      });
      lines.push(''); // Blank line
    }
  
    return lines.join('\n');
  }