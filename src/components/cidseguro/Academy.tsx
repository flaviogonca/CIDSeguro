'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/app';
import { motion, AnimatePresence } from 'framer-motion';
import { StatsPanel } from './StatsPanel';
import { PhishingSimulator } from './PhishingSimulator';
import {
  GraduationCap, Trophy, Star, CheckCircle, XCircle, ArrowRight,
  ArrowLeft, RotateCcw, Target, Zap, Award, BookOpen, Lock, BarChart3, Fish
} from 'lucide-react';
import { PageHeader } from './PageHeader';

interface QuizQuestion {
  id: string;
  question: string;
  options: string;
  correctIndex: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  questions: QuizQuestion[];
}

const difficultyColors: Record<string, string> = {
  iniciante: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  intermediário: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  avançado: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function Academy() {
  const { points, level, quizzesCompleted, addPoints, addBadge, incrementQuizzes } = useAppStore();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showPhishing, setShowPhishing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    fetch('/api/quizzes').then(r => r.json()).then(d => {
      if (d.success) setQuizzes(d.quizzes);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const startQuiz = (quiz: Quiz) => {
    setShowStats(false);
    setShowPhishing(false);
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  const selectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    const isCorrect = index === activeQuiz!.questions[currentQuestion].correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
      addPoints(15);
    }
  };

  const nextQuestion = () => {
    setAnsweredQuestions(prev => [...prev, currentQuestion]);
    if (currentQuestion + 1 >= activeQuiz!.questions.length) {
      setQuizComplete(true);
      const totalScore = score + (selectedAnswer === activeQuiz!.questions[currentQuestion].correctIndex ? 1 : 0);
      incrementQuizzes();
      const pct = totalScore / activeQuiz!.questions.length;
      addPoints(25);
      if (pct >= 0.8) addBadge('🏆 Quiz Master');
      else if (pct >= 0.6) addBadge('🎓 Bom Estudante');
      else addBadge('📚 Aprendiz');
    } else {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const totalCorrect = quizComplete
    ? score
    : score;

  const nextLevelPoints = level * 100;
  const progressToNext = ((points % 100) / 100) * 100;

  return (
    <div className="space-y-6">
      {showPhishing ? (
        <PhishingSimulator />
      ) : showStats ? (
        <StatsPanel onBack={() => setShowStats(false)} />
      ) : (
      <>
      <PageHeader
        eyebrow="Aprendizagem Gamificada"
        icon={<GraduationCap />}
        title="Academia CIDSeguro"
        description="Aprenda cibersegurança com quizzes interactivos, ganhe pontos e suba de nível."
        actions={
          <span className="pill">
            <Star className="h-3 w-3" /> Nv. {level} · {points} pts
          </span>
        }
      />

      {/* Progress Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-primary">{level}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">Nível {level}</h3>
                <Badge variant="outline" className="text-[10px]">
                  <Star className="h-3 w-3 mr-0.5" /> {points} pontos
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <Progress value={progressToNext} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{points % 100}/{nextLevelPoints}</span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {quizzesCompleted} quizzes completos</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz List or Active Quiz */}
      {!activeQuiz ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Quizzes Disponíveis</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowPhishing(true); setShowStats(false); }}
                className="gap-1.5 text-xs"
              >
                <Fish className="h-3.5 w-3.5" />
                Anti-Phishing
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowStats(true); setShowPhishing(false); }}
                className="gap-1.5 text-xs"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Estatísticas
              </Button>
            </div>
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-5">
                    <div className="h-4 bg-muted rounded w-2/3 mb-3" />
                    <div className="h-3 bg-muted rounded w-full mb-2" />
                    <div className="h-8 bg-muted rounded w-1/3 mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz, i) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 h-full">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className={difficultyColors[quiz.difficulty] || ''}>
                          {quiz.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {quiz.questions.length} perguntas
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex-1 mb-4">
                        {quiz.description}
                      </p>
                      <Button
                        className="w-full gap-2"
                        onClick={() => startQuiz(quiz)}
                      >
                        <Zap className="h-4 w-4" />
                        Iniciar Quiz
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* How Points Work */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="h-4 w-4 text-accent-foreground" />
                Como Funciona a Pontuação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-2xl font-bold text-primary">+15</p>
                  <p className="text-xs text-muted-foreground mt-1">Pontos por resposta correcta</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-2xl font-bold text-accent-foreground">+25</p>
                  <p className="text-xs text-muted-foreground mt-1">Bónus por quiz completo</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-2xl font-bold">🏆</p>
                  <p className="text-xs text-muted-foreground mt-1">Badges especiais por desempenho</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Active Quiz */
        <div className="space-y-4">
          {!quizComplete ? (
            <>
              {/* Quiz Progress */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setActiveQuiz(null)} className="gap-1.5">
                  <ArrowLeft className="h-4 w-4" /> Voltar
                </Button>
                <div className="flex-1">
                  <Progress value={((currentQuestion) / activeQuiz.questions.length) * 100} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {currentQuestion + 1}/{activeQuiz.questions.length}
                </span>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <Card className="border-border/50">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{activeQuiz.title}</Badge>
                        <Badge variant="secondary" className={difficultyColors[activeQuiz.difficulty]}>
                          {activeQuiz.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-snug">
                        {activeQuiz.questions[currentQuestion].question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {JSON.parse(activeQuiz.questions[currentQuestion].options).map((option: string, i: number) => {
                        const isCorrect = i === activeQuiz.questions[currentQuestion].correctIndex;
                        const isSelected = selectedAnswer === i;
                        let borderColor = 'border-border/50 hover:border-primary/30 hover:bg-accent/50 cursor-pointer';
                        if (selectedAnswer !== null) {
                          if (isCorrect) borderColor = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
                          else if (isSelected) borderColor = 'border-red-400 bg-red-50 dark:bg-red-900/20';
                          else borderColor = 'border-border/50 opacity-60';
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => selectAnswer(i)}
                            disabled={selectedAnswer !== null}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${borderColor}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium shrink-0 ${
                                selectedAnswer !== null && isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : selectedAnswer !== null && isSelected
                                  ? 'bg-red-500 text-white'
                                  : 'bg-muted'
                              }`}>
                                {selectedAnswer !== null && isCorrect ? <CheckCircle className="h-4 w-4" /> :
                                 selectedAnswer !== null && isSelected ? <XCircle className="h-4 w-4" /> :
                                 String.fromCharCode(65 + i)}
                              </div>
                              <span className="text-sm">{option}</span>
                            </div>
                          </button>
                        );
                      })}

                      {/* Explanation */}
                      <AnimatePresence>
                        {showExplanation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <div className="mt-4 p-4 rounded-xl bg-muted/50 border">
                              <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                                <BookOpen className="h-3.5 w-3.5" /> Explicação
                              </p>
                              <p className="text-sm leading-relaxed">
                                {activeQuiz.questions[currentQuestion].explanation}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Next Button */}
                      {selectedAnswer !== null && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-end mt-4"
                        >
                          <Button onClick={nextQuestion} className="gap-2">
                            {currentQuestion + 1 >= activeQuiz.questions.length ? 'Ver Resultado' : 'Próxima Pergunta'}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            /* Quiz Complete */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-primary/20 text-center max-w-lg mx-auto">
                <CardContent className="p-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      {totalCorrect >= activeQuiz.questions.length * 0.8 ? (
                        <Trophy className="h-10 w-10 text-amber-500" />
                      ) : totalCorrect >= activeQuiz.questions.length * 0.5 ? (
                        <GraduationCap className="h-10 w-10 text-primary" />
                      ) : (
                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">Quiz Completo!</h2>
                  <p className="text-muted-foreground mb-6">
                    {totalCorrect >= activeQuiz.questions.length * 0.8
                      ? 'Excelente! Dominou este tema! 🎉'
                      : totalCorrect >= activeQuiz.questions.length * 0.5
                      ? 'Bom trabalho! Continue a aprender! 💪'
                      : 'Continue a estudar e tente novamente! 📚'}
                  </p>

                  <div className="flex justify-center gap-8 mb-6">
                    <div>
                      <p className="text-3xl font-bold text-primary">{totalCorrect}/{activeQuiz.questions.length}</p>
                      <p className="text-xs text-muted-foreground">Respostas Correctas</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-accent-foreground">+40</p>
                      <p className="text-xs text-muted-foreground">Pontos Ganho</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => startQuiz(activeQuiz)} className="gap-2">
                      <RotateCcw className="h-4 w-4" /> Repetir
                    </Button>
                    <Button onClick={() => setActiveQuiz(null)} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Todos os Quizzes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}
      </>
      )}
    </div>
  );
}