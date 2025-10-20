import { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

type XpContextType = {
	xp: number;
	level: number;
	minExp: number;
	maxExp: number;
	addXp: (amount: number) => Promise<void>;
};

const XpContext = createContext<XpContextType>({
	xp: 0,
	level: 0,
	minExp: 0,
	maxExp: 0,
	addXp: async () => {}
});

export const XpProvider = ({ children }: { children: React.ReactNode }) => {
	const [xp, setXp] = useState(0);
	const [level, setLevel] = useState(0);
	const [minExp, setMinExp] = useState(0);
	const [maxExp, setMaxExp] = useState(0);

	useEffect(() => {
		let mounted = true;

		const loadXpData = async (userId: string) => {
			try {
				const { data, error: profileErr } = await supabase
					.from('profiles')
					.select('exp, level')
					.eq('id', userId);
				const profile = data?.[0];

				if (profileErr || !profile) {
					console.error('Error loading profile XP:', profileErr);
					return;
				}

				if (mounted) {
					setXp(profile.exp ?? 0);
					setLevel(profile.level ?? 0);
				}

				const { data: levelData, error: levelErr } = await supabase
					.from('levels')
					.select('min_exp, max_exp')
					.eq('level_number', profile.level)
					.single();

				if (levelErr) {
					console.error('Error loading level data:', levelErr);
					return;
				}

				if (levelData && mounted) {
					setMinExp(levelData.min_exp);
					setMaxExp(levelData.max_exp ?? 0);
				}
			} catch (err) {
				console.error('Error in loadXpData:', err);
			}
		};

		const init = async () => {
			const {
				data: { session }
			} = await supabase.auth.getSession();

			if (session?.user) {
				console.log('is session user');
				await loadXpData(session.user.id);
			}

			const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
				console.log('onAuthStateChange');
				if (session?.user) loadXpData(session.user.id);
			});

			return () => {
				listener?.subscription.unsubscribe();
				mounted = false;
			};
		};

		init();
	}, []);

	const addXp = async (amount: number) => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) throw new Error('Not logged in');

		const { data: profile, error } = await supabase
			.from('profiles')
			.select('exp, level')
			.eq('id', user.id)
			.single();

		if (error || !profile) throw error || new Error('Profile not found');

		const newXp = (profile.exp || 0) + amount;

		const { error: updateError } = await supabase
			.from('profiles')
			.update({ exp: newXp })
			.eq('id', user.id);

		if (updateError) throw updateError;

		const { data: levelData } = await supabase
			.from('levels')
			.select('level_number, min_exp, max_exp')
			.lte('min_exp', newXp)
			.order('level_number', { ascending: false })
			.limit(1)
			.single();

		const newLevel = levelData?.level_number ?? profile.level ?? 0;

		setXp(newXp);
		setLevel(newLevel);
		setMinExp(levelData?.min_exp ?? 0);
		setMaxExp(levelData?.max_exp ?? 0);
	};

	return (
		<XpContext.Provider value={{ xp, level, minExp, maxExp, addXp }}>{children}</XpContext.Provider>
	);
};

export const useXp = () => useContext(XpContext);
