import { memo, useContext } from 'react';
import {
  Box,
  Card,
  CardBody,
  Grid,
  Heading,
  HStack,
  LinkOverlay,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import SpriteDisplay from '../../common/SpriteDisplay/SpriteDisplay';
import { Tournament } from '../../../../types/tournament';
import { CommonCard } from '../CommonCard';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import { useFormats } from '../../../hooks/formats/formats';
import { getTournamentFormat } from '../../../hooks/formats/helpers';
import { DeckCompareColumnType } from './DeckCompareSortToggles';
import { GenericStat } from './GenericStat';
import { getDeckHref } from './helpers';

interface IndividualCardProps<T> {
  deck: DeckTypeSchema;
  decks: DeckTypeSchema[];
  columns: DeckCompareColumnType<T>[];
  format: number;
  sortBy: T;
}

export const IndividualShareCard = memo(
  <T extends string>(props: IndividualCardProps<T>) => {
    const { colorMode } = useColorMode();

    return (
      <Box gridColumn={'1/-1'}>
        <CommonCard>
          <Grid
            gridTemplateColumns={`auto repeat(${props.columns.length}, 6rem)`}
            paddingX={2}
            gap={2}
            alignItems='center'
          >
            <Stack>
              <SpriteDisplay pokemonNames={props.deck.defined_pokemon} />
              <LinkOverlay
                as={NextLink}
                href={getDeckHref(props.deck, props.format) as any}
              >
                <Heading
                  color={colorMode === 'dark' ? 'gray.100' : 'gray.600'}
                  size={'sm'}
                >
                  {props.deck.name}
                </Heading>
              </LinkOverlay>
            </Stack>
            {props.columns.map(column => (
              <GenericStat
                key={`${props.deck}-${column.name}`}
                deck={props.deck}
                decks={props.decks}
                column={column}
                isInactive={props.sortBy !== column.name}
              />
            ))}
          </Grid>
        </CommonCard>
      </Box>
    );
  }
);

IndividualShareCard.displayName = 'IndividualShareCard';
