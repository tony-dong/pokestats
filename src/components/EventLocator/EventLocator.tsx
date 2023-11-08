import { useState } from 'react';
import { EventMap } from './EventMap';
import { EventGame, MapCenter } from './types';
import { EventList } from './EventList';
import { EventGameFilter } from './EventGameFilter';
import { useEvents } from './useEvents';
import { LocationSearch } from './LocationSearch';
import { ComponentLoader } from '../common/ComponentLoader';
import { Text } from '@tremor/react';
import { Link } from '@chakra-ui/react';

export const EventLocator = () => {
  const [center, setCenter] = useState<MapCenter | undefined>();
  const [filteredGame, setFilteredGame] = useState<EventGame>('tcg');
  const { data: events, isLoading } = useEvents(center, false, filteredGame);

  return (
    <div className='w-full h-full'>
      <LocationSearch setCenter={setCenter} />
      {/* <EventMap events={events} center={center} /> */}
      {center && <EventGameFilter game={filteredGame} setGame={setFilteredGame} />}
      {center && events && <EventList events={events} center={center} />}
      {isLoading && <ComponentLoader />}
      {!center && !isLoading && (
        <div className='px-4 py-8 flex flex-col gap-1'>
          <Text>Enter a location to find tournaments near you.</Text>
          <Text>Refer to Pokemon's <Link href='https://events.pokemon.com/en-us/events' isExternal color='blue.500'>event locator</Link> for the most up-to-date information.</Text>
        </div>
      )}
    </div>
  )
}