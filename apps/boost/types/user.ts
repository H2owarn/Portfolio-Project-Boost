export type { User } from '@supabase/supabase-js';

export type RankDivision =
	| 'IRON_1'
	| 'IRON_2'
	| 'IRON_3'
	| 'SILVER_1'
	| 'SILVER_2'
	| 'SILVER_3'
	| 'GOLD_1'
	| 'GOLD_2'
	| 'GOLD_3'
	| 'PLAT_1'
	| 'PLAT_2'
	| 'PLAT_3'
	| 'DIAMOND_1'
	| 'DIAMOND_2'
	| 'DIAMOND_3'
	| 'MASTER_1'
	| 'MASTER_2'
	| 'MASTER_3'
	| 'OLYMPUS';

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
	weight: number;
}
