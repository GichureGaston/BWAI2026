
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/ledger"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 11335, hash: '3d443797a6106645c93ccf244f0982a09225c642d3668fb5c736eea5c83fdc3e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 953, hash: '5f7fe2ab407cd1f907b0cf34235113cd2a0f56b18271bca9ad126e57a1599d53', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 31457, hash: 'b8e0a02c5b1729370bb3f5ccd291934b4b0de3cafbc66e8c5fa7e4d8ace50b02', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'ledger/index.html': {size: 23184, hash: 'abf0475556db4c797a5762f36e2ba5524599cd347a96c7023e9532ed75d16f26', text: () => import('./assets-chunks/ledger_index_html.mjs').then(m => m.default)},
    'styles-PUVK3CVO.css': {size: 34007, hash: '6vUXQvqbBRc', text: () => import('./assets-chunks/styles-PUVK3CVO_css.mjs').then(m => m.default)}
  },
};
