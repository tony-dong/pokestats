import { useContext, useState } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import {
  getDeckResultsFilters,
  useDeckResults,
} from '../../../hooks/deckResults';
import { DeckCompareColumnType } from '../../common/DeckCompare/DeckCompareSortToggles';
import { DeckCompareTable } from '../../common/DeckCompare/DeckCompareTable';
import { FormatContext } from './DeckAnalyticsContainer';
import { DeckFinishes } from './DeckFinishes';

interface MatchupsCardProps {
  deck: Deck;
}

export const MatchupsCard = (props: MatchupsCardProps) => {
  const format = useContext(FormatContext);

  const [shouldDrillDown, setShouldDrillDown] = useState(false);
  const [sort, setSort] = useState<{
    sortBy: 'win rate';
    sortOrder: 'asc' | 'desc';
  }>({
    sortBy: 'win rate',
    sortOrder: 'desc',
  });
  const filters = getDeckResultsFilters(props.deck, format?.id);
  const { data, isLoading } = useDeckResults(filters, shouldDrillDown);

  const columns: DeckCompareColumnType<'win rate'>[] = [
    {
      name: 'win rate',
      label: (deck: DeckTypeSchema) => `${deck.data?.wins} won`,
      calculation: (deck: DeckTypeSchema) =>
        ((deck.data?.wins ?? 0 * 3) + (deck.data?.ties ?? 0)) /
        (deck.count ?? 1),
      shouldHide: (deck: DeckTypeSchema) =>
        !!(deck.name === 'Other' || (deck.count && deck.count <= 10)),
    },
  ];

  return (
    <DeckCompareTable
      header={'Deck matchups'}
      subheader='Numbers are not 100% accurate and only reflect reported/known decks.'
      decks={data ?? []}
      shouldDrillDown={shouldDrillDown}
      setShouldDrillDown={setShouldDrillDown}
      isLoading={isLoading}
      format={format?.id ?? 1}
      sortBy={sort.sortBy}
      sortOrder={sort.sortOrder}
      setSort={(sortBy: 'win rate', sortOrder: 'asc' | 'desc') =>
        setSort({ sortBy, sortOrder })
      }
      columns={columns}
    />
  );

  return <div>in progress</div>;
};
