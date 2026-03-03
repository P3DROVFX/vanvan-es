
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
    "preload": [
      "chunk-GZAYNEAM.js",
      "chunk-NP7YDOK2.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-UNSJYILX.js",
      "chunk-NP7YDOK2.js"
    ],
    "route": "/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4CVUQ73S.js",
      "chunk-NP7YDOK2.js"
    ],
    "route": "/register-driver-1"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-YEB5QMEH.js",
      "chunk-NP7YDOK2.js"
    ],
    "route": "/register-driver-2"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-WXGHR2DR.js",
      "chunk-OFPEBIU5.js",
      "chunk-NK52ZBRZ.js",
      "chunk-3KI7JBZT.js",
      "chunk-NP7YDOK2.js"
    ],
    "route": "/buttons"
  },
  {
    "renderMode": 1,
    "redirectTo": "/admin/relatorios",
    "route": "/admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-L3CXGB2Y.js"
    ],
    "route": "/admin/relatorios"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-JZUSDYSX.js",
      "chunk-PKN367K3.js",
      "chunk-3KI7JBZT.js",
      "chunk-NP7YDOK2.js"
    ],
    "route": "/admin/motoristas"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-B6ZM3X5S.js",
      "chunk-NP7YDOK2.js"
    ],
    "route": "/admin/clientes"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-NDCOUBDQ.js",
      "chunk-PKN367K3.js",
      "chunk-3KI7JBZT.js"
    ],
    "route": "/admin/aprovar-motoristas"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-JU6ZI45Q.js",
      "chunk-NP7YDOK2.js"
    ],
    "route": "/admin/settings"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-OSMZD4CP.js",
      "chunk-OFPEBIU5.js",
      "chunk-NK52ZBRZ.js",
      "chunk-3KI7JBZT.js",
      "chunk-NP7YDOK2.js"
    ],
    "route": "/home"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-ZKC2JVFS.js",
      "chunk-NK52ZBRZ.js",
      "chunk-3KI7JBZT.js"
    ],
    "route": "/viagens"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-HBQ75EH6.js",
      "chunk-NK52ZBRZ.js"
    ],
    "route": "/motorista"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 8767, hash: '07885295cc25b1abc0b2462ddf5a547d5fcba10ddb2cadfc42d01c3090be8994', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1354, hash: '549eeec83c272df29fc047917df6a59193a10b57f2360b0d600f4d228147b777', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 16894, hash: '69db24cf4f0d5fe30eeae865e8fd137fa1a80ec51e51bfb4154f079c37d48712', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 24390, hash: '238b4b6fb2d004078c112d7cc735e2844b36c103b954783a65cb1f22c23cd41d', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 49386, hash: '59dbe6150eb1a88a7426e5aa75956b79e155bde413bce1d476ed6d9bb91eb358', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'register-driver-1/index.html': {size: 26213, hash: 'a8d3dd199c44a439092462a659c9b05435200c21c8b5ad545919249d43738c73', text: () => import('./assets-chunks/register-driver-1_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 26591, hash: '8c22c61f7f419604838cb1740cbf64b735f92cc44ad2f947112b9dd9c50e929d', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'buttons/index.html': {size: 40580, hash: 'c65b7a11d826db7e2f58ed168633b6f63b105539549d2a6688e39cb77750a117', text: () => import('./assets-chunks/buttons_index_html.mjs').then(m => m.default)},
    'register-driver-2/index.html': {size: 276, hash: 'bccecf9b4112905d4dabd0ad44df9d587704028579d7278a4a451285ee31ae6a', text: () => import('./assets-chunks/register-driver-2_index_html.mjs').then(m => m.default)},
    'styles-GFPULM3Z.css': {size: 49599, hash: 'RrrSMHNWHwo', text: () => import('./assets-chunks/styles-GFPULM3Z_css.mjs').then(m => m.default)}
  },
};
