import {
  Text,
  Stack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { CombinedPlayerProfile } from '../../../types/player';
import { useUserMatchesLoggedInUser, useUserIsBanned } from '../../hooks/user';
import { useUserIsAdmin } from '../../hooks/administrators';
import { Standing, Tournament } from '../../../types/tournament';
import { CommonCard } from '../common/CommonCard';
import { PlayerCard } from '../Tournament/Home/PlayerCard/PlayerCard';
import { FullPageLoader } from '../common/FullPageLoader';
import { TournamentInfo } from '../TournamentList/TournamentInfo';
import { usePlayerStandings } from '../../hooks/newStandings';
import { PlayerTournamentView } from '../Tournament/Home/PlayerTournamentView';
import { Callout, Card, Table, TableBody, TableRow } from '@tremor/react';
import { padTournamentId } from '../../hooks/tournaments';
import { useFormats } from '../../hooks/formats/formats';

export const PlayerPerformanceList = ({
  user,
}: {
  user: CombinedPlayerProfile | null | undefined;
}) => {
  const banned = useUserIsBanned(user)
  const userMatchesLoggedInUser = useUserMatchesLoggedInUser(user?.name);
  const { data: tournamentPerformance, isLoading } = usePlayerStandings(user, { shouldLoadOpponentRounds: true });
  const { data: userIsAdmin } = useUserIsAdmin();
  const { data: formats } = useFormats();

  if (isLoading) return <FullPageLoader />;

  return (
    <div className='flex flex-col gap-4 mt-4'>
      {userMatchesLoggedInUser &&
        (!tournamentPerformance || tournamentPerformance.length === 0) && (
          <Stack>
            <Text>{`We couldn't find any tournaments you've attended. We currently only support tournaments May 21, 2022 and onwards.`}</Text>
            <Text>{`If you've registered for an upcoming tournament, that tournament will show up once it has started.`}</Text>
          </Stack>
        )}
      {tournamentPerformance?.map((performance: Standing) => {
        if (!performance.tournament_id) return null;
        console.log(performance)

        const tournament = {
          id: String(performance.tournament_id).padStart(7, '0'),
          name: performance.tournament_name,
          date: performance.tournament_date,
          tournamentStatus: performance.tournament_status,
          players: { masters: null, seniors: null, juniors: null },
          roundNumbers: { masters: null, seniors: null, juniors: null },
          rk9link: '',
          subStatus: null,
          format: formats?.find((format) => format.id === performance.tournament_format) ?? null,
          should_reveal_decks: {
            juniors: userMatchesLoggedInUser || performance.tournament_status === 'finished',
            seniors: userMatchesLoggedInUser || performance.tournament_status === 'finished',
            masters: userMatchesLoggedInUser || performance.tournament_status === 'finished'
          }
        } as Tournament;

        return (
          <div key={`${performance.tournament_id}-${performance.name}`}>
          <Card className='px-6 py-4 mb-2'>
            <TournamentInfo tournament={tournament} />
          </Card>
          <Card className='p-2'>
            <Table>
              <TableBody>
                <PlayerCard
                  player={performance}
                  tournament={tournament}
                  canEditDecks={(userMatchesLoggedInUser || userIsAdmin) && !banned}
                />
              </TableBody>
            </Table>
           </Card>
          </div>
        );
      })}
    </div>
  );
};
