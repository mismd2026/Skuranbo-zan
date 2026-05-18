export interface Question {
  id: number;
  top: number;
  left: number;
  right: number;
  answerTarget: 'left' | 'right';
  userAnswer?: string;
  isCorrect?: boolean;
}

export type Level = 1 | 2 | 3;

export interface GameState {
  view: 'start' | 'drill' | 'result';
  level: Level;
  questions: Question[];
  currentIndex: number;
  score: number;
}
