import { HStack, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';
import { Fragment } from 'react';
import { Tournament } from '../../../../../types/tournament';
import {
  useArchetypes,
  useMostPopularArchetypes,
} from '../../../../hooks/deckArchetypes';
import SpriteDisplay from '../../../common/SpriteDisplay';
import { ToggleFilterOptions } from './StandingsFilterContainer';
import { StandingsFilters } from './StandingsFilterMenu';

// Needed for Object.Entries. Love typescript.
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const FilterTags = ({
  filters,
  toggleFilter,
  tournament,
}: {
  filters: StandingsFilters;
  toggleFilter: (
    key: keyof StandingsFilters,
    options?: ToggleFilterOptions
  ) => void;
  tournament: Tournament;
}) => {
  const archetypes = useMostPopularArchetypes(tournament.id);

  return (
    <>
      {(Object.entries(filters) as Entries<StandingsFilters>).map(
        ([key, val], idx) => {
          if (key === 'decksVisible') {
            return (
              <Fragment key={`${key}`}>
                {val.map((deckId: number) => {
                  const deckArchetype = archetypes?.find(
                    ({ id }) => deckId === id
                  );
                  if (deckArchetype) {
                    return (
                      <Tag
                        size='lg'
                        borderRadius='full'
                        key={`${key}-${deckId}`}
                      >
                        <HStack spacing={1}>
                          <SpriteDisplay
                            pokemonNames={deckArchetype?.defined_pokemon ?? []}
                            squishWidth
                          />
                          {/* <Text fontSize={'sm'} as='b'>{deckArchetype?.count}</Text> */}
                        </HStack>
                        <TagCloseButton
                          onClick={() =>
                            toggleFilter('decksVisible', {
                              individualDeck: deckId,
                            })
                          }
                        />
                      </Tag>
                    );
                  }
                  return <div key={`${key}-${deckId}`}></div>;
                })}
              </Fragment>
            );
          }

          if (val.value) {
            return (
              <Tag size='lg' key={key} borderRadius='full'>
                <TagLabel fontSize={'sm'}>{val.name}</TagLabel>
                <TagCloseButton onClick={() => toggleFilter(key)} />
              </Tag>
            );
          }

          return <div key={key}></div>;
        }
      )}
    </>
  );
};
