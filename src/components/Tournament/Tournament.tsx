import { Stack } from '@chakra-ui/react';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import { LoggedInPlayerStatus } from './Results/LoggedInPlayerStatus';
import ResultsList from './Results/ResultsList/ResultsList';

export default function Tournament({
  tournament,
  allowEdits,
}: {
  tournament: { id: string; name: string };
  allowEdits: boolean;
}) {
  const { data: liveResults } = useLiveTournamentResults(tournament.id);

  return (
    <Stack>
      {/* <NotablePlayers tournament={tournament.name} allowEdits={allowEdits} /> */}
      <LoggedInPlayerStatus
        tournament={tournament}
        tournamentFinished={!liveResults?.live}
      />
      <ResultsList
        tournament={tournament}
        allowEdits={allowEdits}
        liveResults={liveResults?.data}
        tournamentFinished={!liveResults?.live}
      />
    </Stack>
  );
}
