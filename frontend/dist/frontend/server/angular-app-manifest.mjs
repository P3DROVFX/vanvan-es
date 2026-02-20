
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
      "chunk-MD33FE5X.js",
      "chunk-PQSA5I6N.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ZW7U6OJJ.js",
      "chunk-PQSA5I6N.js"
    ],
    "route": "/register"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PPBVOOQE.js",
      "chunk-PQSA5I6N.js"
    ],
    "route": "/register-driver-1"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-HMQJUAA7.js",
      "chunk-PQSA5I6N.js"
    ],
    "route": "/register-driver-2"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-YGFMSP3Q.js",
      "chunk-HBOMB3AQ.js",
      "chunk-GVXQHMZ3.js",
      "chunk-PQSA5I6N.js"
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
      "chunk-FCLA2KW4.js"
    ],
    "route": "/admin/relatorios"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-WCT5ISEU.js",
      "chunk-ZTKE6YZK.js",
      "chunk-PQSA5I6N.js"
    ],
    "route": "/admin/motoristas"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-XA2J5KJ6.js",
      "chunk-GVXQHMZ3.js",
      "chunk-ZTKE6YZK.js"
    ],
    "route": "/admin/aprovar-motoristas"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VATA6TKZ.js",
      "chunk-HBOMB3AQ.js",
      "chunk-GVXQHMZ3.js",
      "chunk-PQSA5I6N.js"
    ],
    "route": "/home"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-LOCENV6M.js"
    ],
    "route": "/viagens"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-EK2TLS3L.js"
    ],
    "route": "/motorista"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 8716, hash: '6daa6dbe1be0d34bcf11cfedaf4f1cbc4ea9795c21bcf554dadbb910654a5567', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1303, hash: 'f6cf5d75c9189af68d4b55d2539b2ca790526093b0bc2f9aff569f4364d21276', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 16812, hash: '993dbbb71e47be56af694205fa4925dcf234bb262d4319b4646dc4afced46f0d', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 24339, hash: 'dc5816281217bc52e463eac68c7841359eb72c190762d953093c272896f0c9d9', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 49250, hash: '077889929908bd108a850390b7460083efbab9af71e7c995f0145bc016f07b04', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'buttons/index.html': {size: 40467, hash: '5e205a57ee1755e45f8b7d7094812432ab7953a2f75d68d78009e549df37ddea', text: () => import('./assets-chunks/buttons_index_html.mjs').then(m => m.default)},
    'register-driver-2/index.html': {size: 276, hash: 'bccecf9b4112905d4dabd0ad44df9d587704028579d7278a4a451285ee31ae6a', text: () => import('./assets-chunks/register-driver-2_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 26540, hash: '4eba2778d3d895056a92775224fe04835025d42bcdc2d7a0225068dfbc46720d', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'register-driver-1/index.html': {size: 25590, hash: '8633e30b6dc2da91d1abca4f321486d2b6334daf6c2f6b6396b92cf8b275b618', text: () => import('./assets-chunks/register-driver-1_index_html.mjs').then(m => m.default)},
    'styles-OXJEAJZ4.css': {size: 41881, hash: 'PovWIGR3tCE', text: () => import('./assets-chunks/styles-OXJEAJZ4_css.mjs').then(m => m.default)}
  },
};
