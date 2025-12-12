import { Phrase } from '../types/phrase';

export const loadPhrases = (): Phrase[] => {
  try {
    const phrasesString = import.meta.env.VITE_PHRASES;
    if (!phrasesString) {
      throw new Error('VITE_PHRASES not found in environment variables');
    }
    const phrases: Phrase[] = JSON.parse(phrasesString);
    console.log('Loaded phrases:', phrases);
    return phrases;
  } catch (error) {
    console.error('Error loading phrases:', error);
    return [];
  }
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateOptions = (
  correctAuthor: string,
  allAuthors: string[],
  optionsCount: number = 4
): string[] => {
  const otherAuthors = allAuthors.filter(author => author !== correctAuthor);
  const shuffledOthers = shuffleArray(otherAuthors);
  const wrongOptions = shuffledOthers.slice(0, optionsCount - 1);
  const allOptions = [correctAuthor, ...wrongOptions];
  return shuffleArray(allOptions);
};
