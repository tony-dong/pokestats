import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { SeeMoreButton } from '../Deck/Analytics/SeeMoreButton';
import { StatsHeading } from './StatsHeading';

export const CommonCard = ({
  header,
  subheader,
  children,
  leftIcon,
  slug,
  ghost,
  loading,
}: {
  header?: string;
  subheader?: string;
  children: JSX.Element;
  leftIcon?: JSX.Element;
  slug?: string;
  ghost?: boolean;
  loading?: boolean;
}) => {
  return (
    <Card variant={ghost ? 'unstyled' : 'elevated'} padding={3} gap={3}>
      {header && (
        <CardHeader padding={0} display='flex' flexDirection={'column'} gap={1}>
          {!loading ? (
            <StatsHeading headingProps={{ color: 'gray.600' }}>
              {leftIcon ? (
                <HStack>
                  {leftIcon}
                  <Text>{header}</Text>
                </HStack>
              ) : (
                header
              )}
            </StatsHeading>
          ) : (
            <Skeleton height='6' width='70' />
          )}
          {subheader &&
            (!loading ? (
              <Heading color='gray.500' size='sm' fontWeight={'semibold'}>
                {subheader}
              </Heading>
            ) : (
              <Skeleton height='6' width='70' />
            ))}
        </CardHeader>
      )}
      <CardBody padding={0}>{children}</CardBody>
      {slug && (
        <CardFooter padding={0}>
          <SeeMoreButton slug={slug} />
        </CardFooter>
      )}
    </Card>
  );
};