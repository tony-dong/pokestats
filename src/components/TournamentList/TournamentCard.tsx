import {
  Card,
  CardHeader,
  Stack,
  Heading,
  CardFooter,
  Button,
  LinkOverlay,
  CardBody,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  LinkBox,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useTopPerformingPlayers } from '../../hooks/tournamentResults';
import SpriteDisplay from '../common/SpriteDisplay';

export const TournamentCard = ({
  tournament,
}: {
  tournament: Record<string, any>;
}) => {
  const topPerformingPlayers = useTopPerformingPlayers(tournament.id);

  return (
    <LinkBox>
      <Card>
        <Stack padding='1rem 1.5rem'>
          <LinkOverlay
            as={NextLink}
            href={`/tournaments/${tournament.id}/standings`}
          >
            <Heading size='md' color='gray.700'>
              {tournament.name}
            </Heading>
          </LinkOverlay>
          <Table variant={'unstyled'}>
            <Tbody>
              {topPerformingPlayers?.map(
                (player: Record<string, any>, idx: number) => (
                  <Tr key={idx}>
                    <Td padding='0.25rem 0.5rem'>
                      {idx + 1}. {player?.name}
                    </Td>
                    <Td padding='0.25rem 0.5rem'>
                      <SpriteDisplay
                        pokemonNames={player.deck.defined_pokemon}
                      />
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </Stack>
      </Card>
    </LinkBox>
  );
};