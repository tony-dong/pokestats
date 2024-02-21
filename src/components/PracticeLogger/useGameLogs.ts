import { useQuery } from "@tanstack/react-query";
import supabase from "../../lib/supabase/client"
import { GameLogAction, GameTurn, mapSupabaseGameLogData, parseGameLog } from "./helpers";
import { useSessionPlayerProfile } from "../../hooks/user";
import { MatchResult } from "../../../types/tournament";

export interface SupabaseGameLog {
  id: number;
  created_at: string;
  raw_game_log: string;
}

export interface GameLog {
  id: number;
  date: string;
  log: GameTurn[];
  result: MatchResult;
}

const fetchGameLogs = async (userId?: string, screenName?: string | null) => {
  if (!userId || !screenName) return null;

  const res = await supabase.from('Game Logs').select('id,created_at,raw_game_log').eq('user_id', userId).order('created_at', { ascending: false }).returns<SupabaseGameLog[]>();
  return res.data?.map((log) => mapSupabaseGameLogData(log, screenName));
}

export const useGameLogs = () => {
  const { data: user } = useSessionPlayerProfile();

  return useQuery({
    queryKey: ['game-logs', user?.id, user?.ptcg_live_name],
    queryFn: () => fetchGameLogs(user?.id, user?.ptcg_live_name)
  })
}