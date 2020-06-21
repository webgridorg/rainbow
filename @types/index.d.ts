declare module '@adobe/leonardo-contrast-colors';

type ThemeOptions = {
  base: {
    color: string;
    ratio?: number;
  };
  light?: {
    brightness: number;
  };
  dark?: {
    brightness: number;
    contrast: number;
  };
};

type GeneratorOptions = {
  gradient?: {
    steps?: number;
    bg?: boolean;
    text?: boolean;
  };
};

type ColorResult = {
  bg: string | string[];
  text: string | string[];
  theme: {
    colors: string[];
    inverse: string[];
  };
  raw: any;
};

type ColorsResult = {
  pastel: ColorResult;
  light: ColorResult;
  dark: ColorResult;
  invertedPastel: ColorResult;
  invertedLight: ColorResult;
  invertedDark: ColorResult;
};
