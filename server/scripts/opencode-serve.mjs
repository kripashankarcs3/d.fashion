/**
 * Starts the local OpenCode server the stylist chat talks to when
 * OPENCODE_MODE=server, taking the address and password from server/.env so
 * both sides always agree.
 *
 * Run from server/:  npm run stylist:serve
 */
import "dotenv/config";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const password = process.env.OPENCODE_SERVER_PASSWORD;
if (!password) {
  console.error("Set OPENCODE_SERVER_PASSWORD in server/.env before starting the stylist server.");
  process.exit(1);
}

const url = new URL(process.env.OPENCODE_SERVER_URL || "http://127.0.0.1:4096");
// OpenCode's tools can run shell commands; the server must not be reachable
// from anywhere but this machine.
const hostname = url.hostname.replace(/^\[|\]$/g, "");
if (!["127.0.0.1", "localhost", "::1"].includes(hostname)) {
  console.error(`Refusing to bind the stylist server to non-loopback host "${hostname}".`);
  process.exit(1);
}
const port = url.port || "4096";
if (!/^\d+$/.test(port)) {
  console.error(`Invalid port "${port}" in OPENCODE_SERVER_URL.`);
  process.exit(1);
}

// Same default as openCodeSandboxDirectory() in src/services/stylist.service.ts.
const directory = process.env.OPENCODE_SERVER_DIRECTORY || join(tmpdir(), "deestyle-stylist");
mkdirSync(directory, { recursive: true });

console.log(`Starting OpenCode on http://${hostname}:${port} (sessions run in ${directory})`);

// A single command string: hostname and port are validated above, and this
// resolves the `opencode` shim on Windows as well as on Unix shells.
const child = spawn(`opencode serve --hostname ${hostname} --port ${port}`, {
  cwd: directory,
  shell: true,
  stdio: "inherit",
  env: {
    ...process.env,
    OPENCODE_SERVER_USERNAME: process.env.OPENCODE_SERVER_USERNAME || "opencode",
    OPENCODE_SERVER_PASSWORD: password,
  },
});

child.on("exit", (code) => process.exit(code ?? 0));
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
