// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_server: "http://ns544952.ip-66-70-180.net:8000",
  DRIVER_URL: 'http://app-bdb0.cova.ai:9984/api/v1/',
  DRIVER_ASSET_ID: '187ccd60b2988db40010c2a58ea997b3eb5d4453c7c126622965804af7945219',
  CENTRAL_BDB_PUBLIC_KEY: 'CrrDUw33rwdvmVDjrJga5haB9eXZfqWYbW9kASe3HcCR',
  CENTRAL_RSA_PUBLIC_KEY: 'CENTRAL_RSA_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCx1gv9/U2+LbMsnW2fcir2r9AM\nUdLHHrWBSeT/W97i2c92ZsaAgMUU0uPVsmjYneARzqRQLAOTb7An700zaZP1DZkV\n2K8igf2BpH1Eh5p5/TSZDrD5yPQs4kZbJOSOEXNpHIkeUR3+ecMTs3JT1L+M2jbK\nGMY1V4Idchu+EvDu6QIDAQAB\n-----END PUBLIC KEY-----',
  RPC_URL: 'http://23.22.200.69:8545',
  COVA_ADDRESS: '0xf2a4033bf9aa5e0e2ff2b9d5dc6c594bd07a5ec8',

  COVA_TUMBLER_API_URL: 'http://ns544952.ip-66-70-180.net:8000',

  NUMBER_OF_CATEGORIES: 11,

  DEFAULT_HOMEPAGE_ENDPOINT: 'search/popular?',
  SEARCH_ENDPOINT: 'search/keyword?',
  CATEGORY_SEARCH_ENDPOINT: 'search/category?',
  CONTENT_CATEGORY_ENDPOINT: 'book/category',
  HISTORY_ENDPOINT: 'library/history',
  BOOK_PREVIEW_ENDPOINT: 'book/preview',
  BOOK_ENDPOINT: 'book',
  BOOK_ENDPOINT_CHAPTERS_LIST: 'chapters',
  BUY_ENDPOINT: 'book/buy',
  BOUGHT_ENDPOINT: 'library/books',
  LOGVIEW_ENDPOINT: 'library/log-view',
  BOOK_PRICE_ENDPOINT: 'book/getPrice',
  BOOK_PAID_ENDPOINT: 'book/markPaid',

  blockSize: 5,
  token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTQ5MDE2NjYzfQ.W5EkS7B_9b4FLLUhM9R_olnz2hcq2oyJ8sHgoUe1Dz8`,
  DEFAULT_TEXT_LENGTH: 30,
  HOMEPAGE_TAG: `DEFAULT_HOMEPAGE_SEARCH`,
  APP_VERSION: '1.0.0',
  slots_api_server: 'http://ns544952.ip-66-70-180.net:8000/slot'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
