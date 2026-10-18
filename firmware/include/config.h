#pragma once
#include <cstdint>
// ORTAK: Ölçüm ayarları görev 3 + EE, ağ ayarları görev 2.
namespace Config {
constexpr char Version[] = "0.1.0-scaffold";
constexpr char ApName[] = "Pil-Takip";
constexpr char ApPassword[] = "pilproje2026"; // İlk kullanımdan önce değiştirin.
constexpr int AdcPin = 34;                  // Yalnız onaylanmış bölücü orta noktası.
constexpr float RTopOhm = 100000.0f;
constexpr float RBottomOhm = 27000.0f;
constexpr float CalibrationGain = 1.0f;
constexpr float CalibrationOffsetV = 0.0f;
constexpr float EmaAlpha = 0.25f;
constexpr unsigned AdcSamples = 32;
constexpr uint32_t SamplePeriodMs = 500;
constexpr uint32_t StatusDebounceMs = 1500;
// EE 3,3 V uyumlu elektriksel arayüzü onaylayana kadar -1 kalır.
constexpr int ChargingPin = -1;
constexpr int ChargeCompletePin = -1;
constexpr int UsbPresentPin = -1;
constexpr int BatteryPresentPin = -1;
constexpr bool StatusActiveLow = true;
constexpr bool UsbPresentActiveLow = true;
constexpr bool BatteryPresentActiveLow = true;
}

