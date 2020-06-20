import { contrast } from 'chroma-js';
import chalk from 'chalk';
import randomColors from '../src';

const logger = (
  prefixText: string = '',
  bgColor: string,
  textColor: string,
  text: number | string = 'Test'
) => {
  console.log(
    '\n',
    prefixText,
    chalk.bgHex(bgColor).bold('  '),
    bgColor,
    chalk.bgHex(textColor).bold('  '),
    textColor,
    '\n',
    'ratio',
    chalk.bgHex(bgColor).bold(chalk.hex(textColor).bold(`  ${text}  `))
  );
};

describe('Check color contrast ratio', () => {
  const colors = randomColors();

  it('should be valid pastel color', () => {
    {
      const { bg, text } = colors.pastel;
      const ratio = contrast(bg as string, text as string);
      logger('pastel', bg as string, text as string, ratio);
      expect(ratio).toBeGreaterThan(4.45);
    }

    {
      const { bg, text } = colors.invertedPastel;
      const ratio = contrast(bg as string, text as string);
      logger('pastel:darkmode', bg as string, text as string, ratio);
      expect(ratio).toBeGreaterThan(4.45);
    }
  });

  it('should be valid light color', () => {
    {
      const { bg, text } = colors.light;
      const ratio = contrast(bg as string, text as string);
      logger('light', bg as string, text as string, ratio);
      expect(ratio).toBeGreaterThan(4.45);
    }

    {
      const { bg, text } = colors.invertedLight;
      const ratio = contrast(bg as string, text as string);
      logger('light:darkmode', bg as string, text as string, ratio);
      expect(ratio).toBeGreaterThan(4.45);
    }
  });

  it('should be valid dark color', () => {
    {
      const { bg, text } = colors.dark;
      const ratio = contrast(bg as string, text as string);
      logger('dark', bg as string, text as string, ratio);
      expect(ratio).toBeGreaterThan(4.45);
    }

    {
      const { bg, text } = colors.invertedDark;
      const ratio = contrast(bg as string, text as string);
      logger('dark:lightmode', bg as string, text as string, ratio);
      expect(ratio).toBeGreaterThan(4.45);
    }
  });
});
