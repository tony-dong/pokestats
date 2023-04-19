import { User, useSession, useUser } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { CombinedPlayerProfile, StoredPlayerProfile } from '../../types/player';
import { fetchLiveResults } from '../lib/fetch/fetchLiveResults';
import supabase from '../lib/supabase/client';
import { fetchPlayers } from './finalResults/fetch';
import { useLiveTournamentResults } from './tournamentResults';
import { fetchTournaments } from './tournaments';

export const useUserMatchesLoggedInUser = (name: string | null | undefined) => {
  const user = useUser();
  const { data: profile } = usePlayerProfile({
    email: user?.email,
  });

  if (!user?.email) return false;

  if (!name || !profile?.name) return false;
  return (
    profile.name === name ||
    !!profile.additional_names?.some(additionalName => additionalName === name)
  );
};

export const fetchUserProfileFromEmail = async (email: string) => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,email')
    .eq('email', email);
  const playerProfile = data?.[0];

  if (playerProfile) {
    return {
      id: playerProfile?.id,
      name: playerProfile?.name,
      email: email,
    };
  }

  return null;
};

export const fetchUserProfile = async (user: User) => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,email,username,additional_names')
    .eq('email', user?.email);
  const playerProfile = data?.[0];

  if (playerProfile) {
    return {
      id: playerProfile?.id,
      name: playerProfile?.name,
      email: user?.email,
      username: playerProfile.username,
      additional_names: playerProfile.additional_names ?? [],
      image: user.user_metadata.avatar_url,
    };
  }

  return null;
};

export const usePlayerProfiles = () => {
  return useQuery({
    queryKey: ['player-profiles'],
    queryFn: fetchPlayerProfile,
  });
};
export interface SessionUserProfile {
  email: string | null;
  user_metadata: {
    name: string;
  };
}

export const useUserIsInTournament = (
  tournamentId: string,
  playerName?: string | null
) => {
  const { data: liveResults } = useLiveTournamentResults(tournamentId, {
    load: { allRoundData: true },
  });

  return liveResults?.data.some(({ name }) => name === playerName);
};

export const useAccountRequests = () => {
  const fetchUserAccountRequests = async () => {
    const { data } = await supabase
      .from('Account Requests')
      .select('*')
      .order('created_at', { ascending: false });
    return data;
  };

  return useQuery({
    queryKey: [`fetch-user-account-requests`],
    queryFn: fetchUserAccountRequests,
  });
};

const fetchUserSentAccountRequest = async (email: string) => {
  const { data } = await supabase
    .from('Account Requests')
    .select('entered_name')
    .eq('email', email);
  if (data?.length && data.length > 0) {
    return data[0].entered_name;
  }
  return null;
};

export const useUserSentAccountRequest = (email: string | null | undefined) => {
  return useQuery({
    queryKey: [`user-sent-account-request`],
    queryFn: () => (email ? fetchUserSentAccountRequest(email) : false),
  });
};

export const normalizeName = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const fetchUnusedPlayers = async (shouldLoadFromLive?: boolean) => {
  const res = await supabase
    .from('Player Profiles')
    .select('id,name,email,additional_names');

  let players = await fetchPlayers();

  if (shouldLoadFromLive) {
    const tournaments = await fetchTournaments();
    const liveTournaments = tournaments.filter(
      ({ tournamentStatus }) => tournamentStatus === 'running'
    );

    for await (const tournament of liveTournaments) {
      const liveResults = await fetchLiveResults(tournament.id, {
        prefetch: true,
      });
      const livePlayers = liveResults.data.map(standing => standing.name);

      players = [...players, ...livePlayers];
    }
  }

  return players?.filter(
    name =>
      !res.data?.some(
        profile =>
          normalizeName(profile.name) === normalizeName(name) ||
          (profile.additional_names &&
            profile.additional_names.some(
              (additionalName: string) =>
                normalizeName(additionalName) === normalizeName(name)
            ))
      )
  );
};

// For admin view
export const useNotSetupProfiles = () => {
  return useQuery({
    queryKey: [`all-player-profiles`],
    queryFn: () => fetchUnusedPlayers(),
  });
};

export const fetchAllVerifiedUsers = async () => {
  const res = await supabase.from('Player Profiles').select('id,name,email');
  return res.data;
};

export const fetchUser = async (email: string) => {
  const res = await supabase
    .from('Player Profiles')
    .select('id,name,email')
    .eq('email', email);
  return res.data?.[0];
};

export const fetchPlayerProfile = async (): Promise<
  CombinedPlayerProfile[] | null
> => {
  const res = await supabase
    .from('Player Profiles')
    .select('id,name,email,username,additional_names,preferred_name');

  return (res.data as CombinedPlayerProfile[]) ?? null;
};

export const fetchAllTakenUsernames = async () => {
  const res = await supabase.from('Player Profiles').select('username');
  return (
    res.data?.map(({ username }) => username).filter(username => username) ??
    null
  );
};

export const useAllTakenUsernames = () => {
  return useQuery({
    queryKey: ['all-taken-usernames'],
    queryFn: () => fetchAllTakenUsernames(),
  });
};

interface PlayerProfileFilters {
  username?: string;
  name?: string | null;
  email?: string;
}

export const useSessionPlayerProfile = () => {
  const session = useSession();
  const profile = usePlayerProfile({ email: session?.user?.email });

  const data = profile.data
    ? {
        ...profile.data,
        image: session?.user.user_metadata.avatar_url,
      }
    : null;

  return {
    ...profile,
    data,
    isAuthenticated: !!session?.access_token,
  };
};

export const usePlayerProfile = (filters?: PlayerProfileFilters) => {
  const { data, ...rest } = usePlayerProfiles();

  let user: CombinedPlayerProfile | null = null;

  if (filters?.name) {
    user =
      data?.find(
        ({ name, additional_names }) =>
          name === filters?.name ||
          additional_names?.includes(filters.name as string)
      ) ?? null;
  } else if (filters?.username) {
    user = data?.find(({ username }) => username === filters.username) ?? null;
  } else if (filters?.email) {
    user = data?.find(({ email }) => email === filters.email) ?? null;
  } else {
    return {
      ...rest,
      data: null,
    };
  }

  return {
    ...rest,
    data: user,
  };
};
