import { Divider, Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { StandingsRow } from './StandingsRow';
import { StandingsRowExpandable } from './StandingsRowExpandable';
import { Fragment, memo } from 'react';
import { tableHeadingProps } from './props';

export const StandingsList = memo(
  ({
    results,
    tournament,
    shouldHideDecks,
  }: {
    results: Standing[];
    tournament: Tournament;
    shouldHideDecks: boolean;
  }) => {
    const { data: userIsAdmin } = useUserIsAdmin();

    return (
      <Grid gridTemplateColumns='2.65rem repeat(3, auto)' alignItems='center'>
        <GridItem></GridItem>
        <Text {...tableHeadingProps}>Name</Text>
        <Text {...tableHeadingProps} paddingLeft={1}>
          Record
        </Text>
        <Text {...tableHeadingProps} paddingLeft={2}>
          Deck
        </Text>
        {results.map((result: Standing, idx: number) => (
          <Fragment key={idx}>
            <Divider gridColumn='1/-1' />
            <StandingsRowExpandable
              key={idx}
              result={result}
              tournament={tournament}
              canEditDecks={userIsAdmin && !result.deck?.list}
              shouldHideDeck={shouldHideDecks}
            />
          </Fragment>
        ))}
      </Grid>
    );
  }
);

StandingsList.displayName = 'StandingsList';
