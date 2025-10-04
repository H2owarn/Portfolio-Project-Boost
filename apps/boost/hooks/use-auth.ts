import { useContext } from 'react';

import { AuthedUserContext } from '@/contexts/UserContext';

export function useAuth() {
	const context = useContext(AuthedUserContext);

	if (!context) throw new Error('useUser must be used with a AuthedUserProvider');

	return context;
}
