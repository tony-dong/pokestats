import { StoredPlayerProfile } from './player';

export interface Card {
  count: number;
  name: string;
  number: string;
  set: string;
}

export interface Deck {
  id: number;
  name: string;
  defined_pokemon: string[];
  supertype: string;
  identifiable_cards?: string[];
  count?: number;
  list?: DeckList;
  verified?: boolean;
}

export interface DeckList {
  pokemon: Card[];
  trainer: Card[];
  energy: Card[];
}

export interface Standing {
  name: string;
  profile: StoredPlayerProfile;
  placing: number;
  record: { wins: number; ties: number; losses: number };
  resistances?: { self: number, opp: number, oppopp: number }
  currentMatchResult?: 'W' | 'L' | 'T';
  rounds?: { name: string; result: string; opponent: Standing }[];
  day2: boolean;
  outOfDay2: boolean;
  deck: Deck;
  drop?: number;
}

export interface MatchupResult extends Standing {
  result?: string;
}

export type TournamentStatus = 'not-started' | 'running' | 'finished';

export interface Tournament {
  id: string;
  name: string;
  date: {
    start: string;
    end: string;
  };
  tournamentStatus: TournamentStatus;
  players: {
    juniors: string | null;
    seniors: string | null;
    masters: string | null;
  };
  roundNumbers: {
    juniors: number | null;
    seniors: number | null;
    masters: number | null;
  };
  lastUpdated: string | null;
  rk9link: string;
}
