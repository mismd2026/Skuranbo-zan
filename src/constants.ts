import { Level } from './types';

export const LEVEL_CONFIG = {
  1: {
    name: '1けた',
    count: 100,
    min: 2,
    max: 9,
    description: '1けたのかずを わけよう！'
  },
  2: {
    name: '2けた',
    count: 50,
    min: 10,
    max: 99,
    description: '2けたのかずを わけよう！'
  },
  3: {
    name: '3けた',
    count: 25,
    min: 100,
    max: 999,
    description: '3けたのかずを わけよう！'
  }
} as const;

export const THEME = {
  cherry: '#FF5E78',
  leaf: '#76BA1B',
  sky: '#89CFF0',
  accent: '#FFD700',
};
