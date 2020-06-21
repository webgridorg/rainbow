import * as Leonardo from '@adobe/leonardo-contrast-colors';
import { random as randomColor, contrast, scale } from 'chroma-js';
import { lighten, darken } from 'polished';
import normalizeColor from 'color-shorthand-hex-to-six-digit';
import flatten from 'lodash.flatten';
import randomNum from 'lodash.random';
import colorConvert from 'color-convert';

const generateColorKeys = (): string[] => {
  const color = randomColor().hex();
  const lightColor = lighten(0.3, color);
  const darkColor = darken(0.3, color);
  return [lightColor, color, darkColor].map(item =>
    normalizeColor(item.toUpperCase())
  );
};

/**
 * Get HSL random color
 * @param hRandom Hue random values
 * @param sRandom Saturation random values
 * @param lRandom Lightness random values
 */
const getRandomHSLColor = (hRandom, sRandom, lRandom) => {
  const h = randomNum(...hRandom);
  const s = randomNum(...sRandom);
  const l = randomNum(...lRandom);
  return `#${colorConvert.rgb.hex(colorConvert.hsl.rgb([h, s, l]))}`;
};

/**
 * Get random colors
 */
const getRandomLightColor = () =>
  getRandomHSLColor([0, 360], [50, 100], [45, 100]);
const getRandomDarkColor = () => getRandomHSLColor([0, 360], [0, 100], [0, 25]);
const getRandomPastelColor = () =>
  getRandomHSLColor([0, 360], [25, 100], [75, 95]);

/**
 * Get flatten theme values
 */
const getThemeValues = (item: any[]) => {
  return flatten(
    item.filter(color => color.name === 'color').map(item => item.values)
  );
};

/**
 * Theme generator
 * @param defaultOptions
 */
const defaultThemeOptions = {
  base: {
    color: '#ffffff',
    ratio: 1,
  },
  light: {
    brightness: 95,
  },
  dark: {
    brightness: 20,
    contrast: 1.3,
  },
};
const generateTheme = (defaultOptions: ThemeOptions = defaultThemeOptions) => {
  const options = { ...defaultThemeOptions, ...defaultOptions };
  const colorKeys = generateColorKeys();
  const palette = {
    baseScale: 'base',
    colorScales: [
      {
        name: 'base',
        colorKeys: ['#ffffff'],
        colorspace: 'RGB',
        ratios: [1],
      },
      {
        name: 'color',
        colorKeys,
        colorspace: 'RGB',
        ratios: [1.5, 2, 3, 4.5, 5, 6, 7, 8, 12],
      },
    ],
  };
  const theme = Leonardo.generateAdaptiveTheme(palette);
  const values = getThemeValues(theme(options.light.brightness));
  const inverse = getThemeValues(
    theme(options.dark.brightness, options.dark.contrast)
  );

  return {
    base: options.base.color,
    theme: {
      colors: values.map(item => item.value),
      inverse: inverse.map(item => item.value),
    },
    raw: {
      values,
      inverse,
    },
  };
};

/**
 * Get contrast value greater or equal than 4.5
 * @param baseColor Base color
 * @param listOfColors List array of hex colors
 */
const getValidContrast = (baseColor: string, listOfColors: string[]) =>
  listOfColors.filter(item => contrast(baseColor, item) >= 4.5);

const getRandomColor = (
  color: string,
  options: GeneratorOptions,
  useInverseValue: boolean = false
): ColorResult[] => {
  const {
    gradient: { steps, bg: isBgGradient, text: isTextGradient },
  } = options;
  const { base: bg, theme, raw } = generateTheme({
    base: { color },
  });

  const text =
    getValidContrast(bg, useInverseValue ? theme.inverse : theme.colors)?.[0] ||
    null;

  const value: ColorResult = {
    bg,
    theme,
    text,
    raw,
  };

  const invertedValue: ColorResult = {
    bg: text,
    theme,
    text: bg,
    raw,
  };

  if (isBgGradient) {
    value.bg = scale([
      value.bg as string,
      darken(0.2, value.bg as string),
    ]).colors(steps);
    invertedValue.bg = scale([
      invertedValue.bg as string,
      lighten(0.2, invertedValue.bg as string),
    ]).colors(steps);
  }

  if (isTextGradient) {
    value.text = scale([
      value.text as string,
      lighten(0.2, value.text as string),
    ]).colors(steps);
    invertedValue.text = scale([
      invertedValue.text as string,
      darken(0.2, invertedValue.text as string),
    ]).colors(steps);
  }

  return [value, invertedValue];
};

/**
 * Main Functions
 * @param defaultOptions
 */
const defaultGeneratorOptions: GeneratorOptions = {
  gradient: {
    steps: 2,
    bg: false,
    text: false,
  },
};

const randomColors = (
  defaultOptions: GeneratorOptions = defaultGeneratorOptions
): ColorsResult => {
  const options = { ...defaultGeneratorOptions, ...defaultOptions };
  let [pastel, invertedPastel] = getRandomColor(
    getRandomPastelColor(),
    options
  );
  while (!pastel.text || !invertedPastel.text) {
    [pastel, invertedPastel] = getRandomColor(getRandomPastelColor(), options);
  }

  let [light, invertedLight] = getRandomColor(getRandomLightColor(), options);
  while (!light.text || !invertedLight.text) {
    [light, invertedLight] = getRandomColor(getRandomLightColor(), options);
  }

  let [dark, invertedDark] = getRandomColor(
    getRandomDarkColor(),
    options,
    true
  );
  while (!dark.text || !invertedDark.text) {
    [dark, invertedDark] = getRandomColor(getRandomDarkColor(), options, true);
  }

  return {
    pastel,
    light,
    dark,
    invertedPastel,
    invertedLight,
    invertedDark,
  };
};

export default randomColors;
