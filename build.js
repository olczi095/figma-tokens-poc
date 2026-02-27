import StyleDictionary from 'style-dictionary';
import { formats } from 'style-dictionary/enums';
import fs from 'fs';

const tokensData = JSON.parse(fs.readFileSync('./tokens/tokens.json', 'utf8'));

const extractDomains = (tokens) => {
  const domains = new Set(['global']); // always include global
  
  Object.keys(tokens).forEach(key => {
    if (key.startsWith('$')) return;
    
    // Check if this is a top-level domain key
    const knownDomains = ['lekarzplus', 'zarezerwuj', 'sello', 'global', 'brpro', 'ksef'];
    if (knownDomains.includes(key)) {
      domains.add(key);
    }
  });
  
  return Array.from(domains);
};

const domains = extractDomains(tokensData);
console.log('Found domains:', domains);

await Promise.all(
  domains.map(async (domain) => {
    const domainTokens = {};
    
    if (tokensData[domain]) {
      domainTokens[domain] = tokensData[domain];
    }
    
    if (domain !== 'global' && tokensData.global) {
      domainTokens.global = tokensData.global;
    }
    
    const tempFilePath = `./tokens/temp_${domain}.json`;
    fs.writeFileSync(tempFilePath, JSON.stringify(domainTokens, null, 2));
    
    const myStyleDictionary = new StyleDictionary({
      source: [tempFilePath],
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath: 'build/',
          files: [
            {
              destination: `${domain}.css`,
              format: formats.cssVariables,
            },
          ],
        },
      },
    });
    
    const result = await myStyleDictionary.buildAllPlatforms();
    
    fs.unlinkSync(tempFilePath);
    
    return result;
  })
);
