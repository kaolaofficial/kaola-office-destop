/**
 * Kaola Office - Central Environment & Service Configuration
 * Một nguồn cấu hình duy nhất cho cả Production & Local Dev:
 * - Mặc định 100% Production (https://*.kaola.vn) — không có bất kỳ request .test nào trên máy khách.
 * - Tự động chuyển sang Local Dev khi chạy Web trên localhost / *.test,
 *   hoặc khi máy Dev có file kaola.env.local.js (file này bị loại trừ khi đóng gói .exe).
 */
(function (global) {
  'use strict';

  var PROD_CONFIG = {
    env: 'production',
    appName: 'Kaola Office',
    appCode: 'kaolaoffice',
    appVersion: '2.0.1',
    companyName: 'Công ty Cổ phần Đầu tư Kaola',
    idUrl: 'https://id.kaola.vn',
    payUrl: 'https://id.kaola.vn',
    legacyPayUrl: 'https://pay.kaola.vn',
    officeUrl: 'https://office.kaola.vn',
    workUrl: 'https://work.kaola.vn',
    portalUrl: 'https://kaola.vn',
    aiUrl: 'https://ai.kaola.vn',
    driveUrl: 'https://drive.kaola.vn',
    docsUrl: 'https://docs.kaola.vn',
    aiPublicKey: 'pk_admin_master_dae167d8d2cf75a5',
    aiBotId: 6,
    packagesPath: '/api/v1/ecosystem/packages?service=office',
    checkoutPackageSessionPath: '/api/v1/checkout/package-sessions',
    subscriptionStatusPath: '/api/v1/customer/subscription',
    orderStatusPath: '/api/v1/checkout/{orderCode}/status'
  };

  var LOCAL_DEFAULTS = {
    env: 'local',
    idUrl: 'http://id.kaola.vn.test',
    payUrl: 'http://id.kaola.vn.test',
    legacyPayUrl: 'http://id.kaola.vn.test',
    officeUrl: 'http://office.kaola.vn.test',
    workUrl: 'http://kaolawork.test',
    aiUrl: 'http://ai.kaola.vn.test',
    docsUrl: 'http://localhost:8080'
  };

  var isLocalWeb = false;
  try {
    var host = (global.location && global.location.hostname) || '';
    isLocalWeb = (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.test'));
  } catch (e) {}

  var localOverrides = (global.__KAOLA_ENV_OVERRIDE__ && typeof global.__KAOLA_ENV_OVERRIDE__ === 'object')
    ? global.__KAOLA_ENV_OVERRIDE__
    : null;

  var cfg = Object.assign({}, PROD_CONFIG);

  if (isLocalWeb && !localOverrides) {
    cfg = Object.assign(cfg, LOCAL_DEFAULTS);
  }

  if (localOverrides) {
    cfg = Object.assign(cfg, localOverrides);
  }

  // Cho phép Dev chuyển nhanh môi trường qua localStorage.setItem('kaola_env', 'local' | 'production')
  try {
    var forcedEnv = global.localStorage && global.localStorage.getItem('kaola_env');
    if (forcedEnv === 'production') {
      cfg = Object.assign({}, PROD_CONFIG);
    } else if (forcedEnv === 'local') {
      cfg = Object.assign({}, PROD_CONFIG, LOCAL_DEFAULTS, localOverrides || {});
    }
  } catch (e) {}

  cfg.getIdApiUrls = function (path) {
    return [cfg.idUrl + path];
  };

  cfg.getPayApiUrls = function (path) {
    var list = [cfg.payUrl + path];
    if (cfg.env === 'production' && cfg.legacyPayUrl && cfg.legacyPayUrl !== cfg.payUrl) {
      list.push(cfg.legacyPayUrl + path);
    }
    return list;
  };

  cfg.getAiMessageUrls = function () {
    return [cfg.aiUrl + '/api/v1/widget/message'];
  };

  cfg.getInitUrls = function () {
    if (cfg.env === 'local') {
      return [cfg.idUrl + '/api/v1/office/init'];
    }
    return [
      cfg.idUrl + '/api/v1/office/init',
      cfg.portalUrl + '/wp-json/kaola-rm/v1/releases/kaola-office/latest'
    ];
  };

  cfg.getTrackUrls = function () {
    return [cfg.idUrl + '/api/v1/ads/track'];
  };

  global.KaolaConfig = cfg;
})(typeof window !== 'undefined' ? window : globalThis);
