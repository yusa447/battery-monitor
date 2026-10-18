#pragma once
#include "BatteryCore.h"
#include <cstddef>
namespace Battery {
// GÖREV 2: Buffer yetmezse false; başarıda null sonlandırılmış JSON ve true.
bool toJson(char* out,std::size_t size,const Reading& reading,uint32_t now,
            float adcMv,float unfilteredV);
}

