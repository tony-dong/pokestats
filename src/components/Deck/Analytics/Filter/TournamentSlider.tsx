import {
  Heading,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Tournament } from '../../../../../types/tournament';
import { shortenTournamentName } from '../../../../lib/tournament';
import { formatTournamentDate } from '../../../TournamentList/helpers';
import { findTournament } from './helpers';

export const TournamentSlider = ({
  tournamentFilter,
  setTournamentFilter,
  defaultTournamentRange,
  tournaments,
}: {
  tournamentFilter: number;
  setTournamentFilter: (tournamentFilter: number) => void;
  defaultTournamentRange: number[];
  tournaments: Tournament[] | undefined;
}) => {
  const [slider, setSlider] = useState<number | undefined>();

  const findTournamentDate = (tournamentIdInt: number) =>
    tournaments?.find(({ id }) => parseInt(id) === tournamentIdInt)?.date.start;

  return (
    <Stack>
      <Slider
        defaultValue={tournamentFilter}
        min={defaultTournamentRange[0]}
        max={defaultTournamentRange[1]}
        step={1}
        onChange={(value: number) => {
          setTournamentFilter(value);
          setSlider(value);
        }}
        onChangeEnd={() => {
          setSlider(undefined);
        }}
      >
        <SliderTrack bg='gray.100'>
          <SliderFilledTrack bg='blue.500' />
        </SliderTrack>
        <SliderThumb boxSize={6} defaultValue={defaultTournamentRange[0]} />
        {/* <SliderMark
          value={slider as unknown as number}
          textAlign='center'
          bg='blue.500'
          color='white'
          mt='10'
          ml={(-80 * (slider ?? 0)) / (tournaments?.length ?? 1)}
          maxWidth='80'
          zIndex={50}
        >
          {slider ? findTournamentDate(slider) : null}
        </SliderMark> */}
      </Slider>
      <Stack spacing={1}>
        <Heading size='lg' noOfLines={3} color='gray.800'>
          {shortenTournamentName(
            findTournament(tournamentFilter, tournaments) as Tournament
          )}
        </Heading>
        <Heading size='md' noOfLines={1} color='gray.500'>
          {formatTournamentDate(
            findTournament(tournamentFilter, tournaments) as Tournament
          )}
        </Heading>
      </Stack>
    </Stack>
  );
};
