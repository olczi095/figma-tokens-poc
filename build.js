import StyleDictionary from 'style-dictionary';
import { formats, transformGroups } from 'style-dictionary/enums';

const myStyleDictionary = new StyleDictionary({
  source: [`./tokens/tokens.json`],
  platforms: {
    css: {
      transformGroup: transformGroups.scss,
      buildPath: 'build/',
      files: [
        {
          destination: 'variables.scss',
          format: formats.scssVariables,
        },
      ],
    },
  },
});

await myStyleDictionary.buildAllPlatforms();
