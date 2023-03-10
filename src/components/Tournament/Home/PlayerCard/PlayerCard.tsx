import {
  Card,
  CardBody,
  Heading,
  HStack,
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { FaHeartBroken } from 'react-icons/fa';
import { Standing, Tournament } from '../../../../../types/tournament';
import { OpponentRoundList } from '../../../DataDisplay/Standings/OpponentRoundList/OpponentRoundList';
import { StandingsRow } from '../../../DataDisplay/Standings/StandingsRow';

export interface PlayerCardProps {
  player: Standing;
  tournament: Tournament;
  shouldHideDecks: boolean | undefined;
  isDeckLoading?: boolean;
  canEditDecks?: boolean;
  onUnpinPlayer?: () => void;
  topCut?: boolean;
  shouldHideStanding?: boolean;
}

export const PlayerCard = (props: PlayerCardProps) => {
  return (
    <Card>
      <CardBody paddingX={0} paddingY={2}>
        <Stack spacing={0}>
          <StandingsRow
            result={props.player}
            tournament={props.tournament}
            onUnpinPlayer={props.onUnpinPlayer}
            canEditDecks={props.canEditDecks}
            shouldHideDeck={props.shouldHideDecks}
            isDeckLoading={props.isDeckLoading}
            // If we're in top 8 and the player is knocked out, blur them out while the tournament is still running
            translucent={
              props.topCut &&
              props.tournament.tournamentStatus === 'running' &&
              !props.player.currentOpponent
            }
            singleDigitPlacing={props.topCut}
            shouldHideStanding={props.shouldHideStanding}
          />
          {props.player.currentOpponent && (
            <Fragment>
              <Heading
                paddingLeft={`${props.topCut ? 1.6 : 2.65}rem`}
                color='gray.400'
                fontSize={14}
                textTransform='uppercase'
              >
                vs
              </Heading>
              <StandingsRow
                result={props.player.currentOpponent}
                tournament={props.tournament}
                canEditDecks={props.canEditDecks}
                shouldHideDeck={props.shouldHideDecks}
                isDeckLoading={props.isDeckLoading}
                translucent={!props.topCut}
                singleDigitPlacing={props.topCut}
              />
            </Fragment>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};