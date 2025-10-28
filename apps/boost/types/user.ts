export type { User } from '@supabase/supabase-js';

export type RankDivision =
	| 'IRON'
	| 'IRON_2'
	| 'IRON_3'
	| 'SILVER'
	| 'SILVER_2'
	| 'SILVER_3'
	| 'GOLD'
	| 'GOLD_2'
	| 'GOLD_3'
	| 'PLAT'
	| 'PLAT_2'
	| 'PLAT_3'
	| 'DIAMOND'
	| 'DIAMOND_2'
	| 'DIAMOND_3'
	| 'MASTER'
	| 'MASTER_2'
	| 'MASTER_3'
	| 'OLYMPIAN';

export interface Profile {
	id: string;
	level: number;
	created_at: Date;
	streak: number;
	stamina: number;
	exp: number;
	name: string;
	rank_division_id: number | null;
	// relation
	rank_divisions?: {
		id: number;
		name: RankDivision;
	} | null;
}
