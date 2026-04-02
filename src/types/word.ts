import type { Phrase } from "./phrase";
import type { GrammarClassSummary } from "./grammarClass";

export interface Word {
  id: string;
  english: string;
  portuguese: string;
  phrases: Phrase[]; 
  imageUrl: string;
  audioUrl: string;
  categoryIds?: string[];
  userId: string
  grammarClasses?: GrammarClassSummary[]
}
