/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw, Home, Trophy, ChevronRight, Calculator } from 'lucide-react';
import { Question, Level, GameState } from './types';
import { LEVEL_CONFIG, THEME } from './constants';

// --- Utilities ---
const generateQuestions = (level: Level): Question[] => {
  const config = LEVEL_CONFIG[level];
  const questions: Question[] = [];

  for (let i = 0; i < config.count; i++) {
    const top = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    // Left side should be at least 1 and at most top - 1
    const left = Math.floor(Math.random() * (top - 1)) + 1;
    const right = top - left;
    const answerTarget = Math.random() > 0.5 ? 'left' : 'right';

    questions.push({
      id: i,
      top,
      left,
      right,
      answerTarget,
    });
  }
  return questions;
};

// --- Components ---

const CherryBranch = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 10 L20 70 M50 10 L80 70"
      stroke="#5D4037"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const Hanamaru = ({ className }: { className?: string }) => {
  const strokeColor = "#FF8585"; // Softer red
  
  return (
    <motion.svg 
      viewBox="0 0 120 120" 
      className={className} 
      initial="hidden" 
      animate="visible"
    >
      {/* Spiral part - Shrunken and moved slightly down (centerY = 78) */}
      <motion.path
        d="M 60,78 m -4,4 q -8,8 -16,0 q -8,-8 0,-16 q 16,-16 32,0 q 16,16 0,32 q -24,24 -48,0 q -16,-16 0,-40 q 24,-24 56,0 q 24,32 -8,56"
        fill="none"
        stroke={strokeColor}
        strokeWidth="5"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { 
            pathLength: 1, 
            opacity: 1,
            transition: { duration: 0.8, ease: "easeInOut" } 
          }
        }}
      />
      
      {/* Text: よくできました！ (Positioned at the top) */}
      <defs>
        <path id="textArc" d="M 15,45 Q 60,10 105,45" />
      </defs>
      <motion.text
        fill={strokeColor}
        fontSize="14"
        fontWeight="bold"
        style={{ letterSpacing: '0.05em' }}
        variants={{
          hidden: { opacity: 0, y: 5 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, delay: 1.0 } 
          }
        }}
      >
        <textPath href="#textArc" startOffset="50%" textAnchor="middle">
          よくできました！
        </textPath>
      </motion.text>
    </motion.svg>
  );
};

const SakuranboVisual = ({ 
  question, 
  userValue, 
  onChange, 
  isAnswered,
  isCorrect 
}: { 
  question: Question; 
  userValue: string; 
  onChange: (val: string) => void;
  isAnswered: boolean;
  isCorrect?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAnswered) {
      inputRef.current?.focus();
    }
  }, [isAnswered, question.id]);

  return (
    <div className="relative w-80 h-80 mx-auto mt-10">
      <CherryBranch className="absolute inset-0 w-full h-full opacity-60" />
      
      {/* Top Circle */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl"
        style={{ backgroundColor: THEME.cherry, color: 'white' }}
      >
        {question.top}
      </div>

      {/* Bottom Left Circle */}
      <motion.div 
        animate={isAnswered && !isCorrect && question.answerTarget === 'left' ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        className="absolute bottom-0 left-0 w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 shadow-lg overflow-hidden"
        style={{ 
          backgroundColor: question.answerTarget === 'left' ? 'white' : THEME.cherry,
          borderColor: question.answerTarget === 'left' ? THEME.cherry : 'white',
          color: question.answerTarget === 'left' ? '#333' : 'white'
        }}
      >
        {question.answerTarget === 'left' ? (
          <input
            ref={inputRef}
            type="number"
            value={userValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={isAnswered && isCorrect}
            className={`w-full h-full text-center outline-none bg-transparent transition-colors ${
              isAnswered && !isCorrect ? 'text-red-500 bg-red-50' : ''
            }`}
            autoFocus
          />
        ) : (
          question.left
        )}
      </motion.div>

      {/* Bottom Right Circle */}
      <motion.div 
        animate={isAnswered && !isCorrect && question.answerTarget === 'right' ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        className="absolute bottom-0 right-0 w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 shadow-lg overflow-hidden"
        style={{ 
          backgroundColor: question.answerTarget === 'right' ? 'white' : THEME.cherry,
          borderColor: question.answerTarget === 'right' ? THEME.cherry : 'white',
          color: question.answerTarget === 'right' ? '#333' : 'white'
        }}
      >
        {question.answerTarget === 'right' ? (
          <input
            ref={inputRef}
            type="number"
            value={userValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={isAnswered && isCorrect}
            className={`w-full h-full text-center outline-none bg-transparent transition-colors ${
              isAnswered && !isCorrect ? 'text-red-500 bg-red-50' : ''
            }`}
            autoFocus
          />
        ) : (
          question.right
        )}
      </motion.div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {isAnswered && isCorrect && (
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] pointer-events-none z-10"
          >
            <Hanamaru className="w-80 h-80 drop-shadow-xl" />
          </motion.div>
        )}
        {isAnswered && !isCorrect && (
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: [0, -10, 10, -10, 10, 0], opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <XCircle className="w-24 h-24 text-red-400 bg-white rounded-full opacity-80" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Confetti = () => {
  const pieces = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: ['#FF5E78', '#FFD700', '#76BA1B', '#89CFF0', '#FFFFFF'][i % 5],
            left: `${Math.random() * 100}%`,
            top: `-5%`
          }}
          animate={{
            top: '110%',
            left: `${(Math.random() * 100) + (Math.random() * 20 - 10)}%`,
            rotate: 360,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<GameState>({
    view: 'start',
    level: 1,
    questions: [],
    currentIndex: 0,
    score: 0,
  });

  const [userValue, setUserValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);

  const startLevel = (level: Level) => {
    setState({
      view: 'drill',
      level,
      questions: generateQuestions(level),
      currentIndex: 0,
      score: 0,
    });
    setUserValue('');
    setIsAnswered(false);
    setIsCorrect(undefined);
  };

  const handleLevelSelect = (level: Level) => {
    startLevel(level);
  };

  const goHome = () => {
    setState(s => ({ ...s, view: 'start' }));
  };

  const checkAnswer = () => {
    if (userValue === '' || (isAnswered && isCorrect)) return;

    const q = state.questions[state.currentIndex];
    const correctVal = q.answerTarget === 'left' ? q.left : q.right;
    const isRight = parseInt(userValue) === correctVal;

    setIsAnswered(true);
    setIsCorrect(isRight);

    if (isRight) {
      setState(s => ({ ...s, score: s.score + 1 }));
      
      // Move to next question after Hanamaru animation
      setTimeout(() => {
        if (state.currentIndex + 1 < state.questions.length) {
          setState(s => ({ ...s, currentIndex: s.currentIndex + 1 }));
          setUserValue('');
          setIsAnswered(false);
          setIsCorrect(undefined);
        } else {
          setState(s => ({ ...s, view: 'result' }));
        }
      }, 2000); // Longer delay to enjoy the Hanamaru
    } else {
      // Wrong answer - allow retry after a short shake feedback
      setTimeout(() => {
        setIsAnswered(false);
        setIsCorrect(undefined);
        // We don't clear userValue so they can see what they entered and fix it
      }, 1000);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-slate-800 selection:bg-pink-100">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-2" onClick={goHome} style={{ cursor: 'pointer' }}>
          <div className="bg-pink-500 p-2 rounded-lg">
            <Calculator className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-pink-600">さくらんぼ算ドリル</h1>
        </div>
        {state.view === 'drill' && (
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {state.currentIndex + 1} / {state.questions.length}
          </div>
        )}
      </header>

      <main className="max-w-xl mx-auto p-6 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {state.view === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-8 py-10"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-pink-500">さくらんぼ算にちょうせん！</h2>
                <p className="text-slate-500 italic">かずを かしこく わけてみよう</p>
              </div>

              <div className="grid gap-4">
                {(Object.keys(LEVEL_CONFIG) as unknown as Level[]).map((lv) => (
                  <button
                    key={lv}
                    onClick={() => handleLevelSelect(Number(lv) as Level)}
                    className="group relative bg-white border-2 border-slate-200 p-6 rounded-2xl flex items-center justify-between hover:border-pink-400 hover:bg-pink-50 transition-all text-left shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="text-2xl font-bold flex items-center gap-2 text-slate-700 group-hover:text-pink-600 transition-colors">
                        {LEVEL_CONFIG[lv].name}
                        <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-pink-100 group-hover:text-pink-500">
                          {LEVEL_CONFIG[lv].count}問
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm">{LEVEL_CONFIG[lv].description}</p>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-pink-400 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {state.view === 'drill' && (
            <motion.div
              key="drill"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
              onKeyDown={onKeyDown}
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                  <motion.div 
                    className="h-full bg-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(state.currentIndex / state.questions.length) * 100}%` }}
                  />
                </div>
                
                <div className="text-center mb-4 text-slate-400 font-mono text-xs uppercase tracking-widest">
                  Level {state.level}
                </div>

                <SakuranboVisual
                  question={state.questions[state.currentIndex]}
                  userValue={userValue}
                  onChange={setUserValue}
                  isAnswered={isAnswered}
                  isCorrect={isCorrect}
                />

                <div className="mt-12 flex flex-col gap-4">
                  <button
                    onClick={checkAnswer}
                    disabled={userValue === '' || isAnswered}
                    className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 hover:bg-pink-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all text-xl"
                  >
                    これで あってる？
                  </button>
                  <button
                    onClick={goHome}
                    className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 transition-colors py-2 text-sm font-medium"
                  >
                    <Home size={16} /> もどる
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {state.view === 'result' && (
            <motion.div
              key="result"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="text-center py-10 w-full relative"
            >
              {state.score === state.questions.length && <Confetti />}
              <div className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-yellow-200 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-100 rounded-full blur-2xl" />
                
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                <h2 className="text-4xl font-black mb-2 text-slate-800">おわり！</h2>
                <div className="text-6xl font-black text-pink-500 mb-6 mt-4">
                  {state.score} / {state.questions.length}
                </div>
                
                <p className="text-slate-500 mb-8 font-medium">
                  {state.score === state.questions.length 
                    ? "すごすぎる！ まんてんだね！" 
                    : "よく がんばったね！"}
                </p>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => startLevel(state.level)}
                    className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-pink-600 active:scale-95 transition-all text-xl flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={24} /> もういちど やる
                  </button>
                  <button
                    onClick={goHome}
                    className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl border-2 border-slate-200 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Home size={20} /> ホームに もどる
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-4 pointer-events-none opacity-20 flex justify-between">
        <div className="w-16 h-16 rounded-full bg-pink-300" />
        <div className="w-24 h-24 rounded-full bg-green-200 mt-8" />
        <div className="w-12 h-12 rounded-full bg-pink-200" />
      </footer>
    </div>
  );
}
