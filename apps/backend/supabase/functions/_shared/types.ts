export type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
export type JSONPrimitive = string | number | boolean | null | unknown;
export type JSONObject = {
	[key: string]: JSONValue;
};
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
