import { CardBody, Heading, Skeleton, Stack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { StoredPlayerProfile } from '../../../../types/player';
import { Tournament } from '../../../../types/tournament';
import { CommonCard } from '../../common/CommonCard';
import { MyMatchupsList } from '../../DataDisplay/MyMatchupsList';
import { PlayerMatchupStatus } from '../Results/PlayerMatchupStatus';

interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  const session = useSession();
  console.log(session.data?.user);

  if (!props.tournament) return null;

  return (
    <Stack paddingY={4}>
      <Heading size='xl' color='gray.700' paddingX={6}>
        {props.tournament.name}
      </Heading>
      <Stack spacing={6}>
        <PlayerMatchupStatus
          tournament={props.tournament}
          user={session.data?.user as StoredPlayerProfile}
        />
        <MyMatchupsList
          tournament={props.tournament}
          user={session.data?.user}
        />
      </Stack>
    </Stack>
  );
};
