import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
export function testDatabase() {
  return new PGlite({ extensions: { pgcrypto, uuid_ossp } });
}
export async function migrateTestDatabase(db: PGlite) {
  await db.exec(`create role authenticated; create role anon; create role service_role bypassrls;
 create schema auth; grant usage on schema auth to authenticated,anon,service_role;
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');`);
  const directory = resolve("supabase/migrations");
  for (const file of readdirSync(directory)
    .filter((file) => file.endsWith(".sql"))
    .sort())
    await db.exec(readFileSync(resolve(directory, file), "utf8"));
}
export async function assumeCustomer(db: PGlite, id: string) {
  await db.exec("reset role; set role authenticated");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
}
