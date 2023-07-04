import { NextApiRequest, NextApiResponse } from 'next';
import { fetchTournaments } from '../../src/hooks/tournaments';
import { loadLiveResults } from '../../src/lib/supabase/liveResults';

type Data = {
  message: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const tournaments = await fetchTournaments({ prefetch: true });

    if (tournaments.every((tournament) => tournament.tournamentStatus !== 'running')) {
      console.log('No tournaments to update.');
      return res.status(500);
    }

    for await (const tournament of tournaments) {
      console.log('Loading live results for', tournament.name, '...');
      const { error } = await loadLiveResults(tournament.id, tournament.tournamentStatus);
      if (error) {
        console.log(error);
        return res.status(500);
      }
    }
    return res.status(200);
  } catch (err) {
    console.log(err);
    return res.status(500);
  } finally {
    res.end();
  }
}
