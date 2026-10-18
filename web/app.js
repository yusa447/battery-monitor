/* GÖREV 2 - ui.js ve model.js bu dosyadan önce yüklenir. */
(function () {
  'use strict';
  async function pollBattery() {
    // TODO: /api/battery isteği, 3 sn timeout, tek eşzamanlı istek.
    // BatteryModel.validate(data) -> BatteryUI.render(data).
    // Hata -> BatteryUI.offline(message). Yaklaşık 1 sn sonra yeniden dene.
    // age_ms > 3000 veya sample_id >4 sn ilerlemiyorsa eski veri kabul et.
  }
  function startApp() {
    // TODO: refresh düğmesi ve ilk pollBattery() çağrısını bağla.
    // Kullanım amaçlı örnek veri veya rastgele yüzde üretme.
  }
  window.BatteryApp = { startApp, pollBattery };
  // TODO: İletişim tamamlanınca startApp() çağır.
})();

