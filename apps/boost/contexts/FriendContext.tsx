import React, {createContext, useContext, useEffect, useState, ReactNode, } from 'react';
import { supabase } from '@/lib/supabase';

type RelationshipType = 'friend' | 'rival';

interface ProfileMini {
  id: string;
  name: string | null;
}

interface Relationship {
  id: string;
  user_1_id: string;
  user_2_id: string;
  type: RelationshipType;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  request_at?: string;
  acceptance_at?: string;
  user_1?: ProfileMini;
  user_2?: ProfileMini;
}

interface RelationshipContextType {
  friends: ProfileMini[];
  rivals: ProfileMini[];
  requests: Relationship[];
  sendRequest: (targetId: string, type?: RelationshipType) => Promise<boolean>;
  acceptRequest: (requestId: string) => Promise<void>;
  removeRelationship: (targetId: string, type?: RelationshipType) => Promise<void>;
  fetchRelationships: () => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
}

const RelationshipContext = createContext<RelationshipContextType | undefined>(undefined);

type ProviderProps = { children: ReactNode };

export const RelationshipProvider = ({ children }: ProviderProps): React.ReactNode => {
  const [friends, setFriends] = useState<ProfileMini[]>([]);
  const [rivals, setRivals] = useState<ProfileMini[]>([]);
  const [requests, setRequests] = useState<Relationship[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // handle login/logout
  useEffect(() => {
    const initAuth = async () => {

      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.user) {
        const id = session.user.id;
        setUserId(id);
        console.log('Restored session for:', id);
        await fetchRelationships();
        await fetchPendingRequests();
      } else {
        console.log('No active session found.');
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        const newUser = session?.user?.id ?? null;
        setUserId(newUser);

        if (newUser) {
          console.log('User logged in:', newUser);
          fetchRelationships();
          fetchPendingRequests();
        } else {
          console.log('User logged out, clearing state.');
          setFriends([]);
          setRivals([]);
          setRequests([]);
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    };

    initAuth();
  }, []);

  const fetchRelationships = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('relationships')
      .select(`
        id,
        user_1_id,
        user_2_id,
        status,
        type,
        request_at,
        acceptance_at,
        user_1:profiles!relationships_user_1_id_fkey (id, name),
        user_2:profiles!relationships_user_2_id_fkey (id, name)
      `)
      .or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`)
      .eq('status', 'ACCEPTED');

    if (error) {
      console.error('Relationship fetch error:', error.message);
      return;
    }

    const isFriend = (rel: any) => rel.type === 'friend';
    const isRival = (rel: any) => rel.type === 'rival';

    const getOtherUser = (rel: any) =>
      rel.user_1_id === userId ? rel.user_2 : rel.user_1;

    const friendsWithNames = data
      .filter(isFriend)
      .map(getOtherUser)

      .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

    const rivalsWithNames = data
      .filter(isRival)
      .map(getOtherUser)
      .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

    setFriends(friendsWithNames);
    setRivals(rivalsWithNames);
  };

  const fetchPendingRequests = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('relationships')
      .select(`
        id,
        user_1_id,
        user_2_id,
        status,
        type,
        request_at,
        acceptance_at,
        user_1:profiles!relationships_user_1_id_fkey (id, name),
        user_2:profiles!relationships_user_2_id_fkey (id, name)
      `)
      .eq('user_2_id', userId)
      .eq('status', 'PENDING');

    if (error) {
      console.error('Pending fetch error:', error.message);
      return;
    }

    if (data) {
  const normalized = data.map((r: any) => ({
    ...r,
    user_1: Array.isArray(r.user_1) ? r.user_1[0] : r.user_1,
    user_2: Array.isArray(r.user_2) ? r.user_2[0] : r.user_2,
  }));
  setRequests(normalized as Relationship[]);
}

  };

  const sendRequest = async (
  targetId: string,
  type: RelationshipType = 'friend'
): Promise<boolean> => {
  if (!userId) {
    console.warn('User ID not ready. Cannot send request.');
    return false;
  }

  // Check for existing relationship
  const { data: existing, error: existingError } = await supabase
    .from('relationships')
    .select('id, user_1_id, user_2_id, status')
    .or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`);

  if (existingError) {
    console.error('Existing check error:', existingError.message);
    return false;
  }

  const duplicate = existing?.find(
    (r) =>
      (r.user_1_id === userId && r.user_2_id === targetId) ||
      (r.user_1_id === targetId && r.user_2_id === userId)
  );

  if (duplicate && ['PENDING', 'ACCEPTED'].includes(duplicate.status)) {
    console.warn('Request or relationship already exists:', duplicate);
    return false;
  }

  // Otherwise, insert a new request
  const { data, error } = await supabase.from('relationships').insert({
    user_1_id: userId,
    user_2_id: targetId,
    status: 'PENDING',
    type,
    request_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Insert error:', error.message, error.details);
    return false;
  }

  await fetchPendingRequests();
  return true;
};



  const acceptRequest = async (requestId: string) => {
    console.log('Attempting to accept request:', requestId);
    const { error } = await supabase
      .from('relationships')
      .update({
        status: 'ACCEPTED',
        acceptance_at: new Date().toISOString(),
      })
      .eq('id', Number(requestId));

    if (error) {
      console.error('Accept error:', error.message, error.details);
    } else {
      console.log('Request accepted successfully.');
      await fetchRelationships();
      await fetchPendingRequests();
    }
  };

  const removeRelationship = async (targetId: string, type: RelationshipType = 'friend') => {
    if (!userId) return;

    const { error } = await supabase
      .from('relationships')
      .delete()
      .or(
        `and(user_1_id.eq.${userId},user_2_id.eq.${targetId}),and(user_1_id.eq.${targetId},user_2_id.eq.${userId})`
      )
      .eq('type', type);

    if (error) {
      console.error('Remove error:', error.message);
    } else {
      console.log('Relationship removed successfully.');
      await fetchRelationships();
    }
  };

  return (
    <RelationshipContext.Provider
      value={{
        friends,
        rivals,
        requests,
        sendRequest,
        acceptRequest,
        removeRelationship,
        fetchRelationships,
        fetchPendingRequests,
      }}
    >
      {children}
    </RelationshipContext.Provider>
  );
};

export const useRelationships = (): RelationshipContextType => {
  const context = useContext(RelationshipContext);
  if (!context) {
    throw new Error('useRelationships must be used within a RelationshipProvider');
  }
  return context;
};
