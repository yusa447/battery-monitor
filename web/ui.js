(function (global) {
  "use strict";

  const STALE_AGE_MS = 3000;
  const LOW_BATTERY_THRESHOLD = 15;
  const DASH = "--";

  const CHARGE_META = {
    charging: { label: "Şarj oluyor", tone: "charging" },
    full: { label: "Dolu", tone: "ok" },
    not_charging: { label: "Şarj olmuyor", tone: "neutral" },
    fault: { label: "Şarj arızası", tone: "error" },
    unknown: { label: "Bilinmiyor", tone: "neutral" }
  };

  const ERROR_META = {
    none: {
      short: "Yok (none)",
      notice: "Geçerli ölçüm alınamadı."
    },
    not_sampled: {
      short: "Örnek yok (not_sampled)",
      notice: "Henüz ilk pil ölçümü alınmadı (not_sampled)."
    },
    no_battery: {
      short: "Pil yok (no_battery)",
      notice: "Pil algılanmadı (no_battery). Ölçüm için pil bağlantısını kontrol edin."
    },
    invalid_adc: {
      short: "Geçersiz ADC (invalid_adc)",
      notice: "Geçersiz ADC okuması (invalid_adc). Bölücü ve sensör bağlantısını kontrol edin."
    },
    below_range: {
      short: "Aralık altı (below_range)",
      notice: "Ölçülen voltaj geçerli aralığın altında (below_range)."
    },
    above_range: {
      short: "Aralık üstü (above_range)",
      notice: "Ölçülen voltaj geçerli aralığın üstünde (above_range)."
    },
    stale: {
      short: "Eski veri (stale)",
      notice: "Son ölçüm 3 saniyeden eski (stale). Güncel veri bekleniyor."
    }
  };

  let lastSuccessDate = null;

  function byId(id) {
    return typeof document !== "undefined" ? document.getElementById(id) : null;
  }

  function queryUi(name) {
    return typeof document !== "undefined"
      ? document.querySelector('[data-ui="' + name + '"]')
      : null;
  }

  function setText(el, value) {
    if (el) {
      el.textContent = value;
    }
  }

  function setNumberWithUnit(el, numberText, unitText) {
    if (!el) {
      return;
    }
    if (typeof document === "undefined" || !unitText) {
      el.textContent = unitText ? numberText + " " + unitText : numberText;
      return;
    }
    el.textContent = "";
    el.appendChild(document.createTextNode(numberText + " "));
    const unitSpan = document.createElement("span");
    unitSpan.className = "unit";
    unitSpan.textContent = unitText;
    el.appendChild(unitSpan);
  }

  function setSampleValue(el, sampleId, ageMs, hasAge) {
    if (!el) {
      return;
    }
    const sampleText = "#" + Math.floor(sampleId);
    if (!hasAge) {
      el.textContent = sampleText;
      return;
    }
    const ageText = String(Math.round(ageMs));
    if (typeof document === "undefined") {
      el.textContent = sampleText + " · " + ageText + " ms";
      return;
    }
    el.textContent = "";
    el.appendChild(document.createTextNode(sampleText + " · " + ageText + " "));
    const unitSpan = document.createElement("span");
    unitSpan.className = "unit";
    unitSpan.textContent = "ms";
    el.appendChild(unitSpan);
  }

  function setTone(el, tone) {
    if (el) {
      el.setAttribute("data-tone", tone);
    }
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function formatClock(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return DASH;
    }
    const pad = function (n) {
      return n < 10 ? "0" + n : String(n);
    };
    return pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
  }

  function normalizeChargeState(value) {
    if (typeof value === "string" && Object.prototype.hasOwnProperty.call(CHARGE_META, value)) {
      return value;
    }
    return "unknown";
  }

  function formatErrorLabel(code) {
    if (typeof code === "string" && Object.prototype.hasOwnProperty.call(ERROR_META, code)) {
      return ERROR_META[code].short;
    }
    if (typeof code === "string" && code.trim().length > 0) {
      return code.trim();
    }
    return DASH;
  }

  function setNotice(text, tone, tagLabel, isAlert) {
    const bannerEl = queryUi("notice-banner");
    const tagEl = queryUi("notice-tag");
    const textEl = byId("notice-text");

    setTone(bannerEl, tone);
    setText(tagEl, tagLabel);
    setText(textEl, text);

    if (textEl) {
      textEl.setAttribute("role", isAlert ? "alert" : "status");
      textEl.setAttribute("aria-live", isAlert ? "assertive" : "polite");
    }
  }

  function setConnection(text, tone) {
    const pillEl = queryUi("connection-pill");
    const textEl = byId("connection-text");
    setTone(pillEl, tone);
    setText(textEl, text);
  }

  function updateBatteryVisual(options) {
    const batteryEl = byId("battery");
    const fillEl = byId("battery-fill");
    const chipEl = queryUi("battery-chip");

    if (batteryEl) {
      batteryEl.classList.remove("is-charging", "is-low", "is-full", "is-fault", "is-invalid", "is-offline");
      if (options.charging) {
        batteryEl.classList.add("is-charging");
      }
      if (options.low) {
        batteryEl.classList.add("is-low");
      }
      if (options.full) {
        batteryEl.classList.add("is-full");
      }
      if (options.fault) {
        batteryEl.classList.add("is-fault");
      }
      if (options.invalid) {
        batteryEl.classList.add("is-invalid");
      }
      if (options.offline) {
        batteryEl.classList.add("is-offline");
      }

      if (options.hasPercent) {
        batteryEl.setAttribute("aria-valuenow", String(options.percent));
      } else {
        batteryEl.removeAttribute("aria-valuenow");
      }
      batteryEl.setAttribute("aria-valuetext", options.ariaText);
    }

    if (fillEl) {
      const width = options.hasPercent ? Math.max(0, Math.min(100, options.percent)) : 0;
      fillEl.style.width = width + "%";
    }

    if (chipEl) {
      if (options.chipText) {
        chipEl.hidden = false;
        chipEl.textContent = options.chipText;
      } else {
        chipEl.hidden = true;
        chipEl.textContent = "";
      }
    }
  }

  function render(data) {
    if (!data || typeof data !== "object") {
      offline("Geçersiz ölçüm verisi alındı.");
      return;
    }

    const percentageEl = byId("percentage");
    const percentUnitEl = byId("percent-unit");
    const voltageEl = byId("voltage");
    const chargeStateEl = byId("charge-state");
    const presenceEl = byId("presence");
    const updatedEl = byId("updated");
    const adcEl = byId("adc");
    const unfilteredEl = byId("unfiltered");
    const sampleEl = byId("sample");
    const errorEl = byId("error");

    const hasAge = isFiniteNumber(data.age_ms) && data.age_ms >= 0;
    const isStale = data.error === "stale" || (hasAge && data.age_ms > STALE_AGE_MS);
    const errorCode = isStale
      ? "stale"
      : (typeof data.error === "string" && data.error ? data.error : "none");

    const hasVoltage = isFiniteNumber(data.voltage);
    const hasPercentage = isFiniteNumber(data.percentage) && data.percentage >= 0 && data.percentage <= 100;
    const measurementOk = Boolean(data.measurement_ok) && !isStale && hasVoltage && hasPercentage;

    const chargeState = isStale ? "unknown" : normalizeChargeState(data.charge_state);
    const chargeMeta = CHARGE_META[chargeState];
    const batteryPresent = isStale ? null : data.battery_present;
    const isNoBattery = batteryPresent === false || errorCode === "no_battery";

    // Charge state badge
    setText(chargeStateEl, chargeMeta.label);
    setTone(chargeStateEl, chargeMeta.tone);

    // Battery presence (never claim present/absent when null)
    if (batteryPresent === true) {
      setText(presenceEl, "Pil takılı");
      setTone(presenceEl, "ok");
    } else if (batteryPresent === false) {
      setText(presenceEl, "Pil yok");
      setTone(presenceEl, "warning");
    } else {
      setText(presenceEl, "Bilinmiyor (algılayıcı yok)");
      setTone(presenceEl, "neutral");
    }

    // Calibration / measurement details
    if (isFiniteNumber(data.adc_mv)) {
      setNumberWithUnit(adcEl, data.adc_mv.toFixed(1), "mV");
    } else {
      setText(adcEl, DASH);
    }

    if (isFiniteNumber(data.unfiltered_voltage)) {
      setNumberWithUnit(unfilteredEl, data.unfiltered_voltage.toFixed(3), "V");
    } else {
      setText(unfilteredEl, DASH);
    }

    if (isFiniteNumber(data.sample_id) && data.sample_id > 0) {
      setSampleValue(sampleEl, data.sample_id, data.age_ms, hasAge);
    } else if (data.sample_id === 0) {
      setText(sampleEl, "Örnek yok (#0)");
    } else {
      setText(sampleEl, DASH);
    }

    setText(errorEl, formatErrorLabel(errorCode));

    // Primary measurement & visual state
    if (measurementOk) {
      const pct = Math.round(data.percentage);
      const isLow = pct <= LOW_BATTERY_THRESHOLD;
      const isCharging = chargeState === "charging";
      const isFull = chargeState === "full";
      const isFault = chargeState === "fault";

      lastSuccessDate = new Date();
      setText(percentageEl, String(pct));
      if (percentUnitEl) {
        percentUnitEl.hidden = false;
      }
      setNumberWithUnit(voltageEl, data.voltage.toFixed(2), "V");
      setText(updatedEl, formatClock(lastSuccessDate));

      let chipText = "";
      if (isFault) {
        chipText = "Şarj arızası";
      } else if (isCharging && isLow) {
        chipText = "Şarj oluyor · Düşük pil";
      } else if (isCharging) {
        chipText = "Şarj oluyor";
      } else if (isLow) {
        chipText = "Düşük pil";
      } else if (isFull) {
        chipText = "Dolu";
      }

      const ariaParts = [
        "Tahmini %" + pct + " doluluk",
        data.voltage.toFixed(2) + " volt",
        chargeMeta.label
      ];
      if (isLow) {
        ariaParts.push("Düşük pil uyarısı");
      }

      updateBatteryVisual({
        hasPercent: true,
        percent: pct,
        charging: isCharging,
        low: isLow,
        full: isFull && !isLow,
        fault: isFault,
        invalid: false,
        offline: false,
        chipText: chipText,
        ariaText: ariaParts.join(", ")
      });

      if (isFault) {
        setConnection("Bağlı · Şarj arızası", "error");
        setNotice(
          "Şarj modülü çelişkili durum sinyali bildirdi (fault). Şarj bağlantısını kontrol edin.",
          "error",
          "Arıza",
          true
        );
      } else if (isNoBattery) {
        setConnection("Bağlı · Pil yok", "warning");
        setNotice(
          "Fiziksel algılayıcı pil olmadığını bildiriyor. Pil bağlantısını kontrol edin.",
          "warning",
          "Uyarı",
          true
        );
      } else if (isLow) {
        setConnection("Bağlı · Canlı veri", "ok");
        setNotice(
          isCharging
            ? "Düşük pil seviyesi (%" + pct + " tahmini). Pil şu anda şarj oluyor."
            : "Düşük pil uyarısı (%" + pct + " tahmini). Pili şarj etmeniz önerilir.",
          "low",
          "Düşük Pil",
          true
        );
      } else if (isFull && pct < 100) {
        setConnection("Bağlı · Canlı veri", "ok");
        setNotice(
          "Şarj tamamlandı bildirildi (full); yüzde değeri voltaj eğrisinden tahmini olarak gösterilir (%" + pct + ").",
          "info",
          "Bilgi",
          false
        );
      } else {
        setConnection("Bağlı · Canlı veri", "ok");
        setNotice(
          data.estimated === false
            ? "Ölçüm verileri güncel."
            : "Doluluk yüzdesi 4,2 V Li-ion voltaj eğrisinden tahmini olarak hesaplanır.",
          "info",
          "Bilgi",
          false
        );
      }
    } else {
      // Invalid / stale / not sampled / no battery: replace numbers with dashes (never 0%)
      setText(percentageEl, DASH);
      if (percentUnitEl) {
        percentUnitEl.hidden = true;
      }
      setText(voltageEl, DASH);
      setText(
        updatedEl,
        lastSuccessDate ? "Son geçerli: " + formatClock(lastSuccessDate) : "Henüz geçerli ölçüm yok"
      );

      let chipText = "Ölçüm yok";
      if (isStale) {
        chipText = "Eski veri";
      } else if (isNoBattery) {
        chipText = "Pil yok";
      } else if (chargeState === "fault") {
        chipText = "Şarj arızası";
      } else if (errorCode !== "not_sampled" && errorCode !== "none") {
        chipText = "Ölçüm hatası";
      }

      updateBatteryVisual({
        hasPercent: false,
        percent: 0,
        charging: false,
        low: false,
        full: false,
        fault: chargeState === "fault",
        invalid: true,
        offline: false,
        chipText: chipText,
        ariaText: "Geçerli pil ölçümü yok: " + chipText
      });

      if (isStale) {
        setConnection("Bağlı · Eski veri", "warning");
        setNotice(ERROR_META.stale.notice, "warning", "Uyarı", true);
      } else if (isNoBattery) {
        setConnection("Bağlı · Pil yok", "warning");
        setNotice(ERROR_META.no_battery.notice, "warning", "Pil Yok", true);
      } else if (chargeState === "fault") {
        setConnection("Bağlı · Şarj arızası", "error");
        setNotice(
          "Ölçüm geçersiz ve şarj modülü arıza (fault) bildirdi. Bağlantıları kontrol edin.",
          "error",
          "Arıza",
          true
        );
      } else if (errorCode === "not_sampled") {
        setConnection("Bağlı · Ölçüm bekleniyor", "warning");
        setNotice(ERROR_META.not_sampled.notice, "warning", "Ölçüm Yok", false);
      } else {
        const errInfo = Object.prototype.hasOwnProperty.call(ERROR_META, errorCode)
          ? ERROR_META[errorCode].notice
          : "Geçerli ölçüm alınamadı (" + errorCode + ").";
        setConnection("Bağlı · Ölçüm hatası", "error");
        setNotice(errInfo, "error", "Ölçüm Hatası", true);
      }
    }
  }

  function offline(message) {
    const percentageEl = byId("percentage");
    const percentUnitEl = byId("percent-unit");
    const voltageEl = byId("voltage");
    const chargeStateEl = byId("charge-state");
    const presenceEl = byId("presence");
    const updatedEl = byId("updated");
    const adcEl = byId("adc");
    const unfilteredEl = byId("unfiltered");
    const sampleEl = byId("sample");
    const errorEl = byId("error");

    const noticeMsg =
      typeof message === "string" && message.trim().length > 0
        ? message.trim()
        : "Cihazla bağlantı kurulamadı. Ağ bağlantısını kontrol edin.";

    // Hide stale voltage & percentage values on offline/network error
    setText(percentageEl, DASH);
    if (percentUnitEl) {
      percentUnitEl.hidden = true;
    }
    setText(voltageEl, DASH);

    setText(chargeStateEl, CHARGE_META.unknown.label);
    setTone(chargeStateEl, "neutral");

    setText(presenceEl, DASH);
    setTone(presenceEl, "neutral");

    setText(
      updatedEl,
      lastSuccessDate ? "Son başarılı veri: " + formatClock(lastSuccessDate) : "Son başarılı veri: Yok"
    );

    setText(adcEl, DASH);
    setText(unfilteredEl, DASH);
    setText(sampleEl, DASH);
    setText(errorEl, "Bağlantı hatası (offline)");

    updateBatteryVisual({
      hasPercent: false,
      percent: 0,
      charging: false,
      low: false,
      full: false,
      fault: false,
      invalid: false,
      offline: true,
      chipText: "Çevrimdışı",
      ariaText: "Bağlantı yok. " + noticeMsg
    });

    setConnection("Çevrimdışı · Bağlantı yok", "offline");
    setNotice(noticeMsg, "offline", "Bağlantı Yok", true);
  }

  const BatteryUI = {
    render: render,
    offline: offline
  };

  global.BatteryUI = BatteryUI;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = BatteryUI;
  }
})(typeof window !== "undefined" ? window : globalThis);
