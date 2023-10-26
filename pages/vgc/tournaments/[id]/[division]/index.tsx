import { GetStaticPropsContext } from "next";
import { VgcStanding, fetchVgcStandings } from "../../../../../src/vgc/standings/useVgcStandings";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Ad } from "../../../../../src/components/Ad";
import { VgcStandingList } from "../../../../../src/vgc/standings/VgcStandingList";
import { fetchVgcTournaments } from "../../../../../src/vgc/tournaments/useVgcTournaments";
import { AgeDivision } from "../../../../../types/age-division";

export default function VgcStandings({ standings }: { standings: VgcStanding[] }) {
  return (
    <div className="flex flex-col gap-4">
      <Ad key='3467044708' />
      <VgcStandingList standings={standings} />
    </div>
  );
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ id: string, division: string }>) {
  if (!ctx.params?.id || !ctx.params?.division) {
    return {
      props: {
        standings: []
      }
    }
  }

  const standings = await fetchVgcStandings(parseInt(ctx.params.id), ctx.params.division as AgeDivision);
  const queryClient = new QueryClient();

  return {
    props: {
      standings,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchVgcTournaments();
  const tournamentsWithDivisions = [
    ...tournaments.map((tournament) => ({
      params: {
        id: tournament.id.toString(),
        division: 'masters'
      }
    })),
    ...tournaments.map((tournament) => ({
      params: {
        id: tournament.id.toString(),
        division: 'seniors'
      }
    })),
    ...tournaments.map((tournament) => ({
      params: {
        id: tournament.id.toString(),
        division: 'juniors'
      }
    }))
  ]

  return {
    paths: tournamentsWithDivisions,
    fallback: true
  }
}