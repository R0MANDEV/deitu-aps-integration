const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: 'https://10.189.3.23',
  secure: false,
  changeOrigin: true
});

const server = http.createServer((req, res) => {
  console.log(`Proxying: ${req.method} ${req.url}`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  proxy.web(req, res, (error) => {
    console.error('Proxy error:', error.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      code: 502,
      message: `Proxy error: ${error.message}`
    }));
  });
});

const PORT = 3023;
server.listen(PORT, () => {
  console.log(`APS Proxy running on http://localhost:${PORT}`);
  console.log(`Proxying requests to https://10.189.3.23`);
});