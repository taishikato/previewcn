type CleanupFn = () => void;

/**
 * Register SIGINT/SIGTERM handlers and return an unregister function.
 */
export function registerShutdownHandlers(cleanup: CleanupFn): () => void {
  const handle = () => {
    cleanup();
    process.exit(0);
  };

  const onSigint = () => handle();
  const onSigterm = () => handle();

  process.once("SIGINT", onSigint);
  process.once("SIGTERM", onSigterm);

  return () => {
    process.off("SIGINT", onSigint);
    process.off("SIGTERM", onSigterm);
  };
}
