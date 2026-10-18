#pragma once
#include <BatteryCore.h>
// GÖREV 3: İmzaları koru; görev 2 bu arayüzü çağırır.
void beginMeasurement();
void sampleBattery(uint32_t now);
const Battery::Reading& batteryReading();
float lastAdcMilliVolts();
float lastUnfilteredVoltage();

