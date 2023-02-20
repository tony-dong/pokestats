import { Badge, Heading, HStack, Stack } from '@chakra-ui/react';
import { Tournament } from '../../../../types/tournament';
import { useStoredDecks } from '../../../hooks/finalResults';
import { useCountryCode, useLocation } from '../../../hooks/tournamentMetadata';
import { OpenEditTournamentInfo } from '../../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import { TopDecks } from '../../Home/TopDecks';
import { TournamentStatusBadge } from '../../TournamentList/TournamentStatusBadge';
import { CountryFlag } from './CountryFlag';
import { getLocalTime } from './helpers';
import { MyTournamentView } from './MyTournamentView';
import { PinnedPlayerList } from './PinnedPlayers/PinnedPlayerList';
import { TournamentHomeLinks } from './TournamentHomeLinks';

interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  const { data: location } = useLocation(props.tournament?.id ?? '');
  const country = useCountryCode(props.tournament?.id ?? '');

  if (!props.tournament) return null;

  return (
    <Stack paddingY={6} spacing={6}>
      <Stack paddingX={6} spacing={6}>
        <Stack spacing={2}>
          <Heading size='xl' color='gray.700'>
            {props.tournament.name}
          </Heading>
          {location && country && (
            <HStack spacing='4'>
              <CountryFlag countryCode={country} />
              <Badge>
                Local time: {getLocalTime(location.utc_offset_minutes)}
              </Badge>
            </HStack>
          )}
          <HStack>
            <TournamentStatusBadge tournament={props.tournament} size='md' />
            <OpenEditTournamentInfo tournament={props.tournament} />
          </HStack>
        </Stack>
        <TournamentHomeLinks tournament={props.tournament} />
      </Stack>
      <PinnedPlayerList tournament={props.tournament} />
      <MyTournamentView tournament={props.tournament} />
      <TopDecks tournament={props.tournament} />
    </Stack>
  );
};
