"""Ortak derleme adımı. Görev 2 bakımını yapar; üretilen header elle düzenlenmez."""
from pathlib import Path

def embed(project_dir):
    project=Path(project_dir)
    web=project.parent/'web'
    names={'index.html':'INDEX','style.css':'STYLE','model.js':'MODEL','ui.js':'UI','app.js':'APP'}
    result=['// Otomatik üretilir.\n#pragma once\n#include <Arduino.h>\n']
    for name,symbol in names.items():
        content=(web/name).read_text(encoding='utf-8')
        if ')WEBASSET"' in content:raise ValueError('Web raw string ayırıcısı çakışıyor')
        result.append(f'const char WEB_{symbol}[] PROGMEM = R"WEBASSET({content})WEBASSET";\n')
    target=project/'include/web_assets.h'
    text=''.join(result)
    if not target.exists() or target.read_text(encoding='utf-8')!=text:target.write_text(text,encoding='utf-8')

if __name__=='__main__':embed(Path(__file__).resolve().parents[1])
else:
    Import('env')
    embed(env.subst('$PROJECT_DIR'))

