import { Session } from '@supabase/supabase-js';
import { type ReactNode, createContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Profile, User } from '@/types/user';

export interface LoginBody {
	email: string;
	password: string;
}
export interface SignUpBody {
	email: string;
	name: string;
	password: string;
	repeatPassword: string;
	weight: string;
}
interface FormReturn {
	type: 'success' | 'validation' | 'error';
	data?: any;
}

interface Context {
	session?: Session | null;
	authedUser?: User;
	authedProfile?: Profile;
	authChecked: boolean;
	login(body: LoginBody): Promise<FormReturn>;
	register(body: SignUpBody): Promise<FormReturn>;
	logout(): Promise<FormReturn>;
}

export const AuthedUserContext = createContext<Context | null>(null);

export const AuthedUserProvider = ({ children }: { children: ReactNode }) => {
	const [session, setSession] = useState<Context['session'] | null>(null);
	const [authedUser, setAuthedUser] = useState<Context['authedUser']>();
	const [authedProfile, setAuthedProfile] = useState<Context['authedProfile']>();
	const [authChecked, setAuthChecked] = useState(false);

	// Login the user and store their data in the local/async storage.
	const login: Context['login'] = async (body) => {
		const { email, password } = body;

		if (!email || !password)
			return {
				type: 'validation',
				data: {
					code: 'empty_fields'
				}
			};

		const login = await supabase.auth.signInWithPassword({ email, password });

		if (!login.data.user) {
			return {
				type: 'validation',
				data: {
					code: 'account_not_found'
				}
			};
		}
		if (login.error)
			return {
				type: 'validation',
				data: {
					code: login.error.code
				}
			};

		setSession(login.data.session);

		const { data: profileData, error: profileErr } = await supabase
		.from('profiles')
		.select(`
			id,
			name,
			exp,
			level,
			created_at,
			streak,
			stamina,
			weight,
			rank_division_id,
			rank_divisions!profiles_rank_division_id_fkey (
			id,
			name
			)
		`)
		.eq('id', login.data.user.id)
		.single();


		if (profileErr) {
			return { type: 'error', data: profileErr };
		}
		// normalize here
		const normalizedProfile = {
			...profileData,
			rank_divisions: Array.isArray(profileData.rank_divisions)
				? (profileData.rank_divisions[0] ?? null)
				: (profileData.rank_divisions ?? null)
		};

		setAuthedUser(login.data.user);
		setAuthedProfile(normalizedProfile);

		return { type: 'success' };
	};

	// Create a user with their profile.
	const register: Context['register'] = async (body) => {
		const { email, name, password, repeatPassword } = body;
		const weight = parseFloat(body.weight);

		if (!email || !name || !password || !repeatPassword || !weight)
			return {
				type: 'validation',
				data: { code: 'empty_fields' }
			};

		if (password !== repeatPassword) {
			return {
				type: 'validation',
				data: { code: 'passwords_not_match' }
			};
		}

		// Check if username is taken
		const username = await supabase.from('profiles').select('name').eq('name', name).single();
		if (username.data)
			return {
				type: 'validation',
				data: { code: 'name_taken' }
			};

		const signUp = await supabase.auth.signUp({
			email,
			password
		});

		if (signUp.error) {
			if (signUp.error.code === 'user_already_exists')
				return {
					type: 'validation',
					data: { code: 'user_already_exists' }
				};

			return {
				type: 'error',
				data: signUp.error
			};
		}

		if (!signUp.data.user)
			return {
				type: 'error',
				data: { code: 'something_went_wrong' }
			};

		// Create default profile
		const profile = await supabase.from('profiles').insert({
			name,
			weight
		});

		if (profile.error)
			return {
				type: 'error',
				data: profile.error
			};

		await supabase.auth.signOut();

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

			setSession(data.session);
			supabase.auth.onAuthStateChange((_event, data) => {
				setSession(data);
			});

			if (!session?.user) return;

			const { data: profileData, error: profileErr } = await supabase
				.from('profiles')
				.select(
					`
				id,
				name,
				exp,
				level,
				created_at,
				streak,
				stamina,
				weight,
				rank_division_id,
				rank_divisions ( id, name )
			`
				)
				.eq('id', session.user.id)
				.single();

			if (profileErr) {
				console.error(profileErr);
				return {
					type: 'error',
					data: profileErr
				};
			}

			setAuthedProfile({
				...profileData,
				rank_divisions: Array.isArray(profileData.rank_divisions)
					? (profileData.rank_divisions[0] ?? null)
					: (profileData.rank_divisions ?? null)
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
		<AuthedUserContext.Provider
			value={{ authedUser, session, authedProfile, authChecked, login, register, logout }}
		>
			{children}
		</AuthedUserContext.Provider>
	);
};
