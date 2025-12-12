import { useState, useEffect } from 'react';
import { Phrase } from '../types/phrase';
import { loadPhrases, shuffleArray, generateOptions } from '../utils/gameLogic';
import { Quote, Trophy, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export default function QuizGame() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    const loadedPhrases = loadPhrases();
    if (loadedPhrases.length > 0) {
      setPhrases(shuffleArray(loadedPhrases));
    }
  }, []);

  useEffect(() => {
    if (phrases.length > 0 && currentIndex < phrases.length) {
      const allAuthors = phrases.map(p => p.author);
      const currentPhrase = phrases[currentIndex];
      const newOptions = generateOptions(currentPhrase.author, allAuthors);
      setOptions(newOptions);
    }
  }, [phrases, currentIndex]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setGameFinished(false);
    setPhrases(shuffleArray(loadPhrases()));
  };

  const handleOptionClick = (option: string) => {
    if (showFeedback) return;

    setSelectedOption(option);
    setShowFeedback(true);

    if (option === phrases[currentIndex].author) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < phrases.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const getOptionClassName = (option: string) => {
    if (!showFeedback) {
      return 'bg-white hover:bg-blue-50 hover:border-blue-400 hover:scale-105 cursor-pointer';
    }

    if (option === phrases[currentIndex].author) {
      return 'bg-green-100 border-green-500 scale-105';
    }

    if (option === selectedOption) {
      return 'bg-red-100 border-red-500';
    }

    return 'bg-gray-100 opacity-50';
  };

  if (phrases.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <div className="text-white text-xl">Carregando perguntas...</div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center transform hover:scale-105 transition-transform">
          <Quote className="w-20 h-20 mx-auto mb-6 text-purple-600" />
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Quiz de Citações</h1>
          <p className="text-xl text-gray-600 mb-8">
            Teste seus conhecimentos! Adivinhe quem disse cada frase famosa.
          </p>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8">
            <p className="text-lg text-gray-700">
              <span className="font-bold text-purple-600">{phrases.length}</span> perguntas te aguardam!
            </p>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 px-12 rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-110 transition-all shadow-lg"
          >
            Começar Jogo
          </button>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    const percentage = Math.round((score / phrases.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-500" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Jogo Finalizado!</h2>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8">
            <p className="text-6xl font-bold text-purple-600 mb-2">{score}/{phrases.length}</p>
            <p className="text-2xl text-gray-700">
              Você acertou <span className="font-bold text-purple-600">{percentage}%</span>
            </p>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            {percentage >= 80 ? '🎉 Incrível! Você é um expert!' :
             percentage >= 60 ? '👏 Muito bem! Continue assim!' :
             percentage >= 40 ? '💪 Bom trabalho! Pratique mais!' :
             '📚 Continue estudando!'}
          </p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 px-12 rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-110 transition-all shadow-lg inline-flex items-center gap-3"
          >
            <RefreshCw className="w-6 h-6" />
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  const currentPhrase = phrases[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-bold text-lg">
            Pergunta {currentIndex + 1}/{phrases.length}
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-bold text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            {score} pontos
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-6">
          <div className="mb-8">
            <Quote className="w-12 h-12 text-purple-600 mb-4" />
            <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed italic">
              "{currentPhrase.phrase}"
            </p>
          </div>

          <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-8" />

          <p className="text-xl font-semibold text-gray-700 mb-6">Quem disse isso?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={showFeedback}
                className={`${getOptionClassName(option)} border-2 border-gray-200 rounded-2xl p-6 text-lg font-semibold text-gray-800 transition-all transform relative overflow-hidden`}
              >
                {showFeedback && option === currentPhrase.author && (
                  <CheckCircle2 className="w-6 h-6 text-green-600 absolute top-4 right-4" />
                )}
                {showFeedback && option === selectedOption && option !== currentPhrase.author && (
                  <XCircle className="w-6 h-6 text-red-600 absolute top-4 right-4" />
                )}
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${((currentIndex + 1) / phrases.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
