import { build, preview } from 'vite';

// Keep the preview in Playwright's process so Windows cannot leave an orphan
// npm/Vite child holding the test port after the suite finishes.
export default async function setup() {
  await import('../../scripts/copy-youtube-demo.js');
  await build({ logLevel: 'error' });
  await import('../../scripts/copy-404.js');
  const server = await preview({
    logLevel: 'error',
    preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  });
  return async () => {
    server.httpServer.closeAllConnections();
    await new Promise(resolve => server.httpServer.close(resolve));
  };
}
