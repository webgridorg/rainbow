# Relanding Rainbow 🌈

The ✨ light and 🌑 dark colours generator for Relanding.

## Usage

```typescript
import randomColors from '@relanding/rainbow';

// Generate random colors
const colours = randomColors();
/**
 * Output:
 * {
 *   pastel: {
 *     bg: '#...',
 *     text: '#...'
 *   }
 *   light: {
 *     bg: '#...',
 *     text: '#...'
 *   },
 *   dark: {
 *     bg: '#...',
 *     text: '#...'
 *   }
 * }
 */

// Generate random colors with inverted values
/**
 * Output:
 * {
 *   pastel: {
 *     bg: '#...',
 *     text: '#...'
 *   }
 *   light: {
 *     bg: '#...',
 *     text: '#...'
 *   },
 *   dark: {
 *     bg: '#...',
 *     text: '#...'
 *   }
 *   invertedPastel: {
 *     bg: '#...',
 *     text: '#...'
 *   }
 *   invertedLight: {
 *     bg: '#...',
 *     text: '#...'
 *   },
 *   invertedDark: {
 *     bg: '#...',
 *     text: '#...'
 *   }
 * }
 */

// Generate gradient colors
const colours = randomColors({
  gradient: {
    // Valid steps should be between 1 to 5
    steps: 3,

    // Generate gradient for background
    bg: true,

    // Generate gradient for text
    text: false,
  },
});
/**
 * Output:
 * {
 *   light: {
 *     bg: ['#...', '#...', '#...'],
 *     text: '#000000'
 *   },
 *   dark: {
 *     bg: ['#...', '#...', '#...'],
 *     text: '#000000'
 *   }
 * }
 */
```
