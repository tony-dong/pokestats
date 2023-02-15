import { Button, ButtonProps, HStack, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import {
  FaChartLine,
  FaChess,
  FaDice,
  FaDog,
  FaInfo,
  FaInfoCircle,
  FaMagic,
  FaTwitch,
  FaUserFriends,
} from 'react-icons/fa';
import { Tournament } from '../../../types/tournament';
import { useUserIsAdmin } from '../../hooks/administrators';
import {
  useStreamLink,
  useTournamentMetadata,
} from '../../hooks/tournamentMetadata';
import { useSessionUserProfile, useUserIsInTournament } from '../../hooks/user';
import { parseUsername } from '../../lib/strings';
import { EditTournamentInfoModal } from '../Admin/EditTournamentInfo/EditTournamentInfoModal';
import { OpenEditTournamentInfo } from '../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import { getRK9TournamentUrl } from './helpers';

export const TournamentLinks = memo(
  ({ tournament }: { tournament: Tournament }) => {
    const { data: isAdmin } = useUserIsAdmin();
    const streamLink = useStreamLink(tournament.id);
    const { data: userProfile } = useSessionUserProfile();
    const userIsInTournament = useUserIsInTournament(
      tournament.id,
      userProfile?.name
    );

    const RK9ButtonProps: Partial<ButtonProps> = {
      size: 'md',
      as: NextLink,
      variant: 'outline',
    };

    const tournamentLive = tournament.tournamentStatus === 'running';

    return (
      <HStack>
        {/* {userIsInTournament && (
          <Button
            variant='outline'
            colorScheme={'blue'}
            size='md'
            leftIcon={<FaChartLine />}
            as={NextLink}
            href={parseUsername(userProfile?.email ?? '')}
            target='_blank'
          >
            My results
          </Button>
        )} */}
        {streamLink && (
          <Button
            variant='solid'
            colorScheme={'purple'}
            size='md'
            leftIcon={<FaTwitch />}
            as={NextLink}
            href={streamLink.data}
            target='_blank'
          >
            Stream
          </Button>
        )}
        {/* <Button
          {...RK9ButtonProps}
          leftIcon={<FaChess />}
          href={getRK9TournamentUrl(tournament.rk9link, 'pairings')}
          target='_blank'
        >
          Pairings
        </Button> */}
        {/* <Button
          {...RK9ButtonProps}
          leftIcon={<FaChess />}
          href={`/tournaments/${tournament.id}/pairings`}
        >
          Pairings
        </Button>
        <Button
          {...RK9ButtonProps}
          leftIcon={<FaDice />}
          href={getRK9TournamentUrl(tournament.rk9link)}
          target='_blank'
        >
          Decks
        </Button> */}
        <Button
          {...RK9ButtonProps}
          leftIcon={<FaInfo />}
          href={getRK9TournamentUrl(tournament.rk9link)}
          target='_blank'
        >
          Tournament Info
        </Button>
        {isAdmin && <OpenEditTournamentInfo tournament={tournament} />}
      </HStack>
    );
  }
);

TournamentLinks.displayName = 'TournamentLinks';
