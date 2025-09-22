import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import { join } from 'path';

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,tsx,jsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  safelist: [
    {
      pattern: /(bg|text|p|rounded|none)-(l-lg|none|indigo|200|800|4)/,
      variants: ['hover', 'focus'],
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
