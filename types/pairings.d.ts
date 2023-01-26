export interface Pairing {
  table: number;
  players: string[];
}

export interface PairingRound {
  round: number;
  tables: Pairing[];
}

export interface PairingSubmission {
  deck_id: number;
  player1_name: string;
  player2_name: string;
  user_who_submitted: string;
  table_number: number;
}
