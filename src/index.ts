/// <reference types="./index" />

import * as Leonardo from '@adobe/leonardo-contrast-colors';
import { random as randomColor, contrast } from 'chroma-js';
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
  const { steps, bg: isBgGradient, text: isTextGradient } = options.gradient;
  const floatSteps = steps / 10;
  const { base: bg, theme } = generateTheme({
    base: { color },
  });

  const text =
    getValidContrast(bg, useInverseValue ? theme.inverse : theme.colors)?.[0] ??
    useInverseValue
      ? theme.inverse[4]
      : theme.colors[4];

  const value: ColorResult = {
    bg,
    theme,
    text,
  };

  const invertedValue: ColorResult = {
    bg: text,
    theme,
    text: bg,
  };

  const gradientFn = useInverseValue ? darken : lighten;

  if (isBgGradient) {
    value.bg = Array.from({ length: steps }, (_, index) =>
      gradientFn(floatSteps * (index + 1), value.bg as string)
    );
    invertedValue.bg = Array.from({ length: steps }, (_, index) =>
      gradientFn(floatSteps * (index + 1), invertedValue.bg as string)
    );
  }

  if (isBgGradient) {
    value.text = Array.from({ length: steps }, (_, index) =>
      gradientFn(floatSteps * (index + 1), value.text as string)
    );
    invertedValue.text = Array.from({ length: steps }, (_, index) =>
      gradientFn(floatSteps * (index + 1), invertedValue.text as string)
    );
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
    bg: true,
    text: false,
  },
};
const randomColors = (
  defaultOptions: GeneratorOptions = defaultGeneratorOptions
): ColorsResult => {
  const options = { ...defaultGeneratorOptions, ...defaultOptions };
  const [pastel, invertedPastel] = getRandomColor(
    getRandomPastelColor(),
    options
  );
  const [light, invertedLight] = getRandomColor(getRandomLightColor(), options);
  const [dark, invertedDark] = getRandomColor(
    getRandomDarkColor(),
    options,
    true
  );

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
