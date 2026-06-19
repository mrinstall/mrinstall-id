/* eslint-disable no-await-in-loop */
const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

async function translate_object(obj) {
  const keys = Object.keys(obj);
  for (const key of keys) {
    // Skip already translated email section
    if (key === 'email' && obj[key] && typeof obj[key] === 'object' && obj[key].activate) {
      continue;
    }

    if (typeof obj[key] === 'string') {
      // Skip variables and empty strings
      if (!obj[key].trim() || obj[key].includes('<%') || obj[key].includes('%>')) {
        continue;
      }
      try {
        const res = await translate(obj[key], { to: 'vi' });
        console.log(`Translated: "${obj[key]}" -> "${res.text}"`);
        obj[key] = res.text;
        // Add a small delay to prevent rate limiting
        // eslint-disable-next-line snakecase/snakecase
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`Error translating: ${obj[key]} - ${err.message}`);
        // fallback to original
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      await translate_object(obj[key]);
    }
  }
}

async function run() {
  const file_path = '/Users/anqle/mrinstall/mrinstall-id/etc/translations/vi.json';
  const data = JSON.parse(fs.readFileSync(file_path, 'utf8'));

  await translate_object(data);

  fs.writeFileSync(file_path, JSON.stringify(data, null, 4));
  console.log('Translation complete!');
}

run();
