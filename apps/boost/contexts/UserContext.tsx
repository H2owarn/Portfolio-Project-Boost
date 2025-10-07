import { Redirect } from 'expo-router';
import { type ReactNode, createContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Profile, User } from '@/types/user';

interface AuthBody {
	email: string;
	name: string;
	password: string;
	repeatPassword: string;
}
interface FormReturn {
	type: 'success' | 'validation' | 'error';
	data?: Record<string, any>;
}

interface Context {
	authedUser?: User;
	authedProfile?: Profile;
	authChecked: boolean;
	login(body: Omit<AuthBody, 'repeatPassword' | 'name'>): Promise<FormReturn>;
	register(body: AuthBody): Promise<FormReturn>;
	logout(): Promise<FormReturn>;
}

export const AuthedUserContext = createContext<Context | null>(null);

export const AuthedUserProvider = ({ children }: { children: ReactNode }) => {
	const [authedUser, setAuthedUser] = useState<Context['authedUser']>();
	const [authedProfile, setAuthedProfile] = useState<Context['authedProfile']>();
	const [authChecked, setAuthChecked] = useState(false);

	// Login the user and store their data in the local/async storage.
	const login: Context['login'] = async (body) => {
		const { email, password } = body;

		const login = await supabase.auth.signInWithPassword({ email, password });

		if (login.error)
			return {
				type: 'validation',
				data: {
					code: login.error.code
				}
			};

		const { data: profileData, error: profileErr } = await supabase
			.from("profiles")
			.select(`
				id,
				name,
				exp,
				level,
				created_at,
				streak,
				stamina,
				rank_division_id,
				rank_divisions ( id, name )
			`)
			.eq("id", login.data.user.id)
			.single();

		if (profileErr) {
		return { type: "error", data: profileErr };
		}
		// normalize here
		const normalizedProfile = {
			...profileData,
			rank_divisions: Array.isArray(profileData.rank_divisions)
			? profileData.rank_divisions[0] ?? null
			: profileData.rank_divisions ?? null,
		};

		setAuthedUser(login.data.user);
		setAuthedProfile(normalizedProfile);

		return { type: "success" };

	};

	// Create a user with their profile.
	const register: Context['register'] = async (body) => {
		return {
			type: 'success'
		};
	};

	// Remove the user session/tokens from local/async storage.
	const logout: Context['logout'] = async () => {
		return {
			type: 'success'
		};
	};

	// Get the logged in user, else redirect to login page.
	const getAuthedUser = async () => {
		try {
    const { data, error: sessionErr } = await supabase.auth.getSession();

		if (sessionErr) {
		console.error(sessionErr);
		return;
		}

		const session = data.session;

		if (!session?.user) return;

			const { data: profileData, error: profileErr } = await supabase
			.from("profiles")
			.select(`
				id,
				name,
				exp,
				level,
				created_at,
				streak,
				stamina,
				rank_division_id,
				rank_divisions ( id, name )
			`)
			.eq("id", session.user.id)
			.single();


			if (profileErr) {
			console.error(profileErr);
			return {
				type: "error",
				data: profileErr,
			};
			}

			setAuthedProfile({
			...profileData,
			rank_divisions: Array.isArray(profileData.rank_divisions)
				? profileData.rank_divisions[0] ?? null
				: profileData.rank_divisions ?? null,
			});
			console.log("Normalized profile:", {
			...profileData,
			rank_divisions: Array.isArray(profileData.rank_divisions)
				? profileData.rank_divisions[0] ?? null
				: profileData.rank_divisions ?? null,
			});

			setAuthedUser(session.user);
		} catch (err) {
			// Handle error?
		} finally {
			setAuthChecked(true);
		}
	};

	useEffect(() => {
		getAuthedUser();
	}, []);

	return (
		<AuthedUserContext.Provider value={{ authedUser, authedProfile, authChecked, login, register, logout }}>
			{children}
		</AuthedUserContext.Provider>
	);
};
