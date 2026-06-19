import json
import glob
import os

with open('/Users/anqle/mrinstall/mrinstall-id/etc/translations/vi.json', 'r', encoding='utf-8-sig') as f:
    vi_data = json.load(f)

email_translations = vi_data['templates']['email']

for filepath in glob.glob('/Users/anqle/mrinstall/mrinstall-id/etc/translations/*.json'):
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    
    if 'templates' in data and 'email' in data['templates']:
        data['templates']['email'] = email_translations
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

print("Copied email translations to all files")
