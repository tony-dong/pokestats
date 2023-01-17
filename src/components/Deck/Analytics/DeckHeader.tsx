import { memo, useEffect, useMemo, useState } from 'react';
import { Button, Heading, HStack, Image, Stack } from '@chakra-ui/react';
import { getCardImageUrl } from '../ListViewer/helpers';
import { DeckCard, Deck } from '../../../../types/tournament';
import { useCodeToSetMap } from '../../../hooks/deckList';
import { useFinalResults } from '../../../hooks/finalResults';
import SpriteDisplay from '../../common/SpriteDisplay';
import { FaChevronLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';

export const DeckHeader = memo(
  ({ deck, compact }: { deck: Deck; compact?: boolean }) => {
    const { data: deckStandings } = useFinalResults({ deckId: deck.id });
    const codeToSetMap = useCodeToSetMap();
    const router = useRouter();
    const [scrollTop, setScrollTop] = useState(0);
    const [stickyHeaderStyle, setStickyHeaderStyle] = useState(false);
    const [headerOffset, setHeaderOffset] = useState<number>(0);

    useEffect(() => {
      setHeaderOffset(
        document.getElementById('compact-deck-header')?.offsetTop as number
      );
    }, []);

    useEffect(() => {
      const onScroll = (e: any) => {
        setScrollTop(e.target.documentElement.scrollTop);
        if (e.target.documentElement.scrollTop > headerOffset) {
          setStickyHeaderStyle(true);
        } else {
          setStickyHeaderStyle(false);
        }
      };
      window.addEventListener('scroll', onScroll);

      return () => window.removeEventListener('scroll', onScroll);
    }, [scrollTop]);

    const identifiableCards = useMemo(
      () =>
        deck.identifiable_cards
          ?.map(cardName => {
            return deckStandings?.[0]?.deck_list?.pokemon.find(
              ({ name, set }) => {
                // Hard code to get the right Inteleon
                if (
                  name === 'Inteleon' &&
                  deckStandings?.[0].deck_list?.pokemon.find(
                    ({ name, set }) => name === 'Inteleon' && set === 'SSH'
                  ) &&
                  set !== 'SSH'
                ) {
                  return false;
                }
                return name === cardName;
              }
            );
          })
          .filter(card => card),
      [deck.identifiable_cards, deckStandings]
    );

    const heightWidthRatio = 1.396;
    const width = 125;
    const height = width * heightWidthRatio;

    if (compact) {
      return (
        <Stack height={'3rem'}>
          <Stack
            id='compact-deck-header'
            height={'3rem'}
            background={'white'}
            position={stickyHeaderStyle ? 'fixed' : 'relative'}
            top={0}
            left={0}
            paddingLeft={4}
            zIndex={'50'}
            width={'100%'}
            justifyContent={'center'}
            boxShadow={scrollTop === 0 ? 'none' : 'lg'}
            transition='box-shadow 0.15s ease-in-out'
          >
            <div>
              <Button
                variant={'ghost'}
                size='sm'
                leftIcon={<FaChevronLeft />}
                onClick={() => router.push(`/decks/${deck.id}`)}
                paddingLeft={0}
                justifyContent='start'
              >
                <HStack>
                  <Heading color='gray.700' size='md' letterSpacing={'wide'}>
                    {deck.name}
                  </Heading>
                  <SpriteDisplay pokemonNames={deck.defined_pokemon} />
                </HStack>
              </Button>
            </div>
          </Stack>
        </Stack>
      );
    }

    return (
      <Stack paddingX={4}>
        <HStack spacing={0}>
          {identifiableCards?.map(card => (
            <Image
              key={`${card?.name} ${card?.set}`}
              width={`${width}px`}
              height={`${height}px`}
              src={getCardImageUrl(card as DeckCard, codeToSetMap, {
                highRes: true,
              })}
              alt={`${card?.name} ${card?.set}`}
            />
          ))}
        </HStack>
        <Heading color='gray.700'>{deck.name}</Heading>
      </Stack>
    );
  }
);

DeckHeader.displayName = 'DeckHeader';
