// theme/gradients.ts

type GradientSet = string[][];

export const gradientPresets: Record<string, GradientSet> = {
  green: [
    ['#000000', '#114b5f'],
    ['#1c1c1b', '#000000'],
    ['#004e64', '#61c9a8'],
  ],
  red: [
    ['#330000', '#ff4e50'],
    ['#8a0303', '#ff6e6e'],
    ['#7b1e1e', '#f06292'],
  ],
  blue: [
    ['#1a2a6c', '#b21f1f'],
    ['#0f2027', '#2c5364'],
  ],
};
