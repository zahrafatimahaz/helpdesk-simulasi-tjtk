// Jalankan hanya di komputer admin tepercaya. Jangan commit kredensial.
import {createClient} from '@supabase/supabase-js';
import {randomBytes} from 'node:crypto';
import {readFileSync} from 'node:fs';
const file=process.env.ADMIN_ENV_FILE||'.env.admin';
try { for(const line of readFileSync(file,'utf8').split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^['"]|['"]$/g,'')} }catch{}
const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY,email=process.env.ADMIN_EMAIL,name=process.env.ADMIN_NAME||'Administrator';
if(!url||!key||!email){console.error('Isi SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY dan ADMIN_EMAIL dalam .env.admin');process.exit(1)}
const password=process.env.ADMIN_PASSWORD||randomBytes(24).toString('base64url');
if(password.length<12)throw new Error('Password admin minimal 12 karakter');
const client=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
const {data,error}=await client.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:name}});
if(error)throw error;
const {error:roleError}=await client.from('profiles').update({role:'SUPER_ADMIN'}).eq('id',data.user.id);
if(roleError)throw roleError;
console.log('Admin berhasil dibuat. Email:',email,'\nPassword:',password,'\nSimpan password di password manager, jangan bagikan output terminal.');
