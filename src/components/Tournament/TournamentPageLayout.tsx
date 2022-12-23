import { Heading, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { TournamentTabs } from './TournamentTabs';

export const TournamentPageLayout = ({
  children,
  tournament,
}: {
  children: ReactNode;
  tournament: { id: string; name: string };
}) => {
  return (
    <Stack>
      <Heading padding={'1rem 1.5rem 0'}>{tournament.name}</Heading>
      <TournamentTabs />
      {children}
    </Stack>
  );
};
