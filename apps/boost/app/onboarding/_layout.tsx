import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
	const { authedUser, authedProfile } = useAuth();

	if (authedUser && authedProfile) return <Redirect href="/(tabs)/home" />;

	return children;
}
