#!/usr/bin/env python3
"""Dosya ve temel imza kontrolü; ürünün işlevsel olarak hazır olduğunu söylemez."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
required={
 'web/index.html':['/model.js','/ui.js','/app.js'],
 'web/style.css':[],
 'web/ui.js':['BatteryUI','render(data)','offline(message)'],
 'web/model.js':['BatteryModel','validate(data)'],
 'web/app.js':['pollBattery','startApp'],
 'firmware/platformio.ini':['esp32dev','embed_web.py'],
 'firmware/include/config.h':['AdcPin','ChargingPin'],
 'firmware/include/network.h':['beginNetwork','handleNetwork'],
 'firmware/include/measurement.h':['sampleBattery','batteryReading'],
 'firmware/src/main.cpp':['beginMeasurement','beginNetwork','sampleBattery','handleNetwork'],
 'firmware/src/network.cpp':['beginNetwork','handleNetwork'],
 'firmware/src/measurement.cpp':['sampleBattery','batteryReading'],
 'firmware/lib/BatteryCore/src/BatteryCore.h':['Reading','Monitor'],
 'firmware/lib/BatteryCore/src/BatteryCore.cpp':['estimatePercent','Monitor::update'],
 'firmware/lib/BatteryCore/src/BatteryJson.h':['toJson'],
 'firmware/lib/BatteryCore/src/BatteryJson.cpp':['toJson'],
 'firmware/scripts/embed_web.py':['ui.js'],
 'docs/API.md':[], 'docs/DOSYA_HARITASI.md':[], 'docs/FONKSIYON_SOZLESMESI.md':[],
 'docs/GITHUB_CALISMA.md':[], 'docs/DONANIM_VE_IO.md':[], 'tests/README.md':[],
}
for name,symbols in required.items():
 p=root/name
 assert p.is_file(),f'Eksik dosya: {name}'
 text=p.read_text(encoding='utf-8')
 for symbol in symbols:assert symbol in text,f'Eksik imza/baglanti: {name} -> {symbol}'
print(f'PASS: {len(required)} dosyanin yapisi ve temel imzalari dogru. Islevsel gorevler TODO olarak bekliyor.')

