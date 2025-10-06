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

		const profile = await supabase.from('profiles').select('*').eq('id', login.data.user.id).single();
		if (profile.error)
			return {
				type: 'error',
				data: profile.error
			};

		setAuthedUser(login.data.user);
		setAuthedProfile(profile.data);

		return {
			type: 'success'
		};
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
			const session = await supabase.auth.getSession();

			if (session.error) {
				console.error(session.error);
				return;
			}
			if (!session.data || !session.data.session) return;

			const profile = await supabase.from('profiles').select('*').eq('id', session.data.session.user.id).single();
			if (profile.error) {
				console.error(profile.error);
				return;
			}

			setAuthedProfile(profile.data);
			setAuthedUser(session.data.session.user);
		} catch (err) {
			// Handle error?
		} finally {
			setAuthChecked(true);
		}
	};

	useEffect(() => {
		getAuthedUser();
	}, [authChecked]);

	return (
		<AuthedUserContext.Provider value={{ authedUser, authedProfile, authChecked, login, register, logout }}>
			{children}
		</AuthedUserContext.Provider>
	);
};
