import { Redirect, Slot } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

export default function SettingsLayout() {
	const { authedUser, authedProfile } = useAuth();

	if (authedUser && authedProfile) return <Redirect href="/(tabs)/home" />;

	return <Slot />;
}
