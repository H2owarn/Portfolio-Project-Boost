export type { User } from '@supabase/supabase-js';

export type RankDivision =
	| 'IRON'
	| 'SILVER'
	| 'GOLD'
	| 'PLAT'
	| 'DIAMOND'
	| 'MASTER'
	| 'OLYMPIAN';

export interface Profile {
	id: string;
	level: number;
	created_at: Date;
	streak: number;
	stamina: number;
	weight: number;
	exp: number;
	name: string;
	rank_division_id: number | null;
	// relation
	rank_divisions?: {
		id: number;
		name: RankDivision;
	} | null;
}
