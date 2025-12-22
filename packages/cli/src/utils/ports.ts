import net from "net";

/**
 * Find an available port starting from the given port number.
 * Increments until an available port is found.
 */
export async function findAvailablePort(startPort: number): Promise<number> {
  let port = startPort;
  const maxAttempts = 100;

  for (let i = 0; i < maxAttempts; i++) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    port++;
  }

  throw new Error(
    `Could not find an available port after ${maxAttempts} attempts starting from ${startPort}`
  );
}

/**
 * Check if a port is available by attempting to create a server on it.
 */
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close(() => {
        resolve(true);
      });
    });

    server.listen(port, "127.0.0.1");
  });
}

/**
 * Wait for a server to become available at the given URL.
 * Uses connectivity-based check (does not require response.ok).
 */
export async function waitForServer(
  url: string,
  timeoutMs: number
): Promise<boolean> {
  const startTime = Date.now();
  const pollInterval = 500;

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(2000),
      });
      // Any response means the server is up (even 404 is fine)
      if (response) {
        return true;
      }
    } catch {
      // Server not ready yet, continue polling
    }
    await sleep(pollInterval);
  }

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
