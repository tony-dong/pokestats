import {
  TableContainer,
  Table,
  Tbody,
  Td,
  Tr,
  Link,
  Thead,
  Th,
} from '@chakra-ui/react';
import { Standing } from '../../../types/tournament';
import { useUserIsAdmin } from '../../hooks/administrators';
import SpriteDisplay from '../common/SpriteDisplay';
import DeckInput from '../Deck/DeckInput/DeckInput';
import { formatRecord } from '../Tournament/Results/ResultsList/helpers';
import { ListViewerOpenButton } from '../Deck/ListViewer/ListViewerOpenButton';
import { Player } from '../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from './helpers';
import { DeckInfoDisplay } from '../Deck/DeckInfoDisplay';

export const StandingsList = ({
  results,
  tournament,
  tournamentFinished,
}: {
  results: Standing[];
  tournament: { id: string; name: string };
  tournamentFinished: boolean;
}) => {
  const userIsAdmin = useUserIsAdmin();

  return (
    <TableContainer>
      <Table size={'sm'}>
        <Thead>
          <Tr>
            <Th></Th>
            <Th padding={0} paddingLeft={2}>
              Name
            </Th>
            <Th padding={0}>Record</Th>
            <Th padding={0} paddingLeft={2}>
              Deck
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {results.map((result: Standing, idx: number) => (
            <Tr height='41px' key={idx}>
              <Td isNumeric padding={0}>
                {result.placing}
              </Td>
              <Td
                maxWidth={'12rem'}
                overflow={'hidden'}
                textOverflow={'ellipsis'}
                padding={0}
                paddingLeft={2}
              >
                <Player
                  name={result.name}
                  profile={result.profile}
                  isEditable={userIsAdmin}
                />
              </Td>

              <Td
                padding={0}
                backgroundColor={
                  !tournamentFinished
                    ? getResultBackgroundColor(result.currentMatchResult)
                    : ''
                }
              >
                {formatRecord(result.record)}
              </Td>
              <Td padding={0} paddingLeft={2}>
                <DeckInfoDisplay
                  tournament={tournament}
                  player={result}
                  enableEdits={userIsAdmin && !result.deck.list}
                  quickEdits={true}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};