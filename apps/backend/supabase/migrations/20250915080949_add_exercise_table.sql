create table "public"."exercise" (
    "id" integer generated always as identity not null,
    "api_id" text
);


CREATE UNIQUE INDEX exercise_pkey ON public.exercise USING btree (id);

alter table "public"."exercise" add constraint "exercise_pkey" PRIMARY KEY using index "exercise_pkey";

grant delete on table "public"."exercise" to "anon";

grant insert on table "public"."exercise" to "anon";

grant references on table "public"."exercise" to "anon";

grant select on table "public"."exercise" to "anon";

grant trigger on table "public"."exercise" to "anon";

grant truncate on table "public"."exercise" to "anon";

grant update on table "public"."exercise" to "anon";

grant delete on table "public"."exercise" to "authenticated";

grant insert on table "public"."exercise" to "authenticated";

grant references on table "public"."exercise" to "authenticated";

grant select on table "public"."exercise" to "authenticated";

grant trigger on table "public"."exercise" to "authenticated";

grant truncate on table "public"."exercise" to "authenticated";

grant update on table "public"."exercise" to "authenticated";

grant delete on table "public"."exercise" to "service_role";

grant insert on table "public"."exercise" to "service_role";

grant references on table "public"."exercise" to "service_role";

grant select on table "public"."exercise" to "service_role";

grant trigger on table "public"."exercise" to "service_role";

grant truncate on table "public"."exercise" to "service_role";

grant update on table "public"."exercise" to "service_role";


