import dns from "dns";
import net from "net";
import { URL } from "url";

/**
 * Fetching a URL a client handed us points our own network stack at whatever
 * that client chooses, so every hop is checked against the addresses it
 * actually resolves to — not against the hostname it was written as.
 *
 * Checking the hostname string alone is not enough: `127.0.0.1.nip.io` is a
 * public name that resolves to loopback, and a public URL can simply redirect
 * to an internal one. Redirects are therefore followed manually so each hop
 * gets the same treatment.
 */

const MAX_REDIRECTS = 3;

/** Loopback, private, link-local, CGNAT and benchmarking ranges. */
const isPrivateIPv4 = (ip: string): boolean => {
  const [a, b] = ip.split(".").map(Number);
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a === 192 && b === 0) return true;
  if (a === 198 && (b === 18 || b === 19)) return true;
  return false;
};

/** Expands any IPv6 form to its eight 16-bit groups, or null if unparseable. */
const expandIPv6 = (address: string): number[] | null => {
  let text = address;

  // A trailing dotted quad (::ffff:127.0.0.1) becomes two hex groups.
  const dotted = text.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (dotted) {
    const [a, b, c, d] = dotted[1].split(".").map(Number);
    text = text.slice(0, -dotted[1].length) +
      ((a << 8) | b).toString(16) + ":" + ((c << 8) | d).toString(16);
  }

  const [head, tail, ...rest] = text.split("::");
  if (rest.length > 0) return null;
  const parse = (part: string) => (part ? part.split(":").map((g) => parseInt(g, 16)) : []);
  const left = parse(head);
  const right = tail === undefined ? [] : parse(tail);
  const groups =
    tail === undefined
      ? left
      : [...left, ...Array(8 - left.length - right.length).fill(0), ...right];

  if (groups.length !== 8 || groups.some((g) => Number.isNaN(g))) return null;
  return groups;
};

const isPrivateIPv6 = (ip: string): boolean => {
  const address = ip.toLowerCase().split("%")[0];
  const groups = expandIPv6(address);
  if (!groups) return true; // unparseable — refuse rather than guess

  // ::1 (loopback) and :: (unspecified)
  const isAllZeroPrefix = groups.slice(0, 5).every((g) => g === 0);
  if (isAllZeroPrefix && groups[5] === 0) {
    const last32 = ((groups[6] << 16) | groups[7]) >>> 0;
    if (last32 === 1 || last32 === 0) return true;
    // ::a.b.c.d — the deprecated IPv4-compatible form.
    return isPrivateIPv4(
      [(last32 >>> 24) & 0xff, (last32 >>> 16) & 0xff, (last32 >>> 8) & 0xff, last32 & 0xff].join("."),
    );
  }

  // IPv4-mapped (::ffff:a.b.c.d, which Node prints as ::ffff:7f00:1)
  // inherits the verdict of the address it carries.
  if (isAllZeroPrefix && groups[5] === 0xffff) {
    const last32 = ((groups[6] << 16) | groups[7]) >>> 0;
    return isPrivateIPv4(
      [(last32 >>> 24) & 0xff, (last32 >>> 16) & 0xff, (last32 >>> 8) & 0xff, last32 & 0xff].join("."),
    );
  }

  const first = groups[0];
  if ((first & 0xfe00) === 0xfc00) return true; // fc00::/7 unique-local
  if ((first & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  return false;
};

export const isPrivateAddress = (ip: string): boolean =>
  net.isIPv4(ip) ? isPrivateIPv4(ip) : net.isIPv6(ip) ? isPrivateIPv6(ip) : true;

/** Throws unless every address this URL resolves to is publicly routable. */
async function assertPublicUrl(target: URL): Promise<void> {
  if (target.protocol !== "https:" && target.protocol !== "http:") {
    throw new Error(`Unsupported scheme: ${target.protocol}`);
  }

  const hostname = target.hostname.replace(/^\[|\]$/g, "");

  if (net.isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new Error("Refusing to fetch a private address");
    return;
  }

  const resolved = await dns.promises.lookup(hostname, { all: true });
  if (resolved.length === 0) throw new Error("Host does not resolve");
  for (const { address } of resolved) {
    if (isPrivateAddress(address)) {
      throw new Error("Refusing to fetch a host that resolves to a private address");
    }
  }
}

/**
 * GETs a public image URL, validating the destination at every redirect hop.
 * Returns the final response; the caller still has to check the payload.
 */
export async function fetchPublicImage(rawUrl: string, timeoutMs = 20_000): Promise<Response> {
  let target = new URL(rawUrl);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicUrl(target);

    const res = await fetch(target, {
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (res.status < 300 || res.status >= 400) return res;

    const location = res.headers.get("location");
    if (!location) return res;
    target = new URL(location, target);
  }

  throw new Error("Too many redirects");
}
