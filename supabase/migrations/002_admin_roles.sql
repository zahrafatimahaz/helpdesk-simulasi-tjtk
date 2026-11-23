-- Jalankan setelah 001_init.sql. Role tidak dapat diubah langsung oleh pengguna biasa.
create or replace function public.admin_set_role(p_user_id uuid,p_role text) returns void language plpgsql security definer set search_path='' as $$
declare v_caller uuid := auth.uid(); v_old text;
begin
 if v_caller is null or not exists(select 1 from public.profiles where id=v_caller and role='SUPER_ADMIN') then raise exception 'Hanya Super Admin'; end if;
 if p_role is null or p_role not in ('CUSTOMER','HELP_DESK','TECHNICIAN','NOC_ENGINEER','SUPERVISOR','SUPER_ADMIN') then raise exception 'Role tidak valid'; end if;
 select role into v_old from public.profiles where id=p_user_id for update;
 if not found then raise exception 'Pengguna tidak ditemukan'; end if;
 if p_user_id=v_caller and p_role<>'SUPER_ADMIN' then raise exception 'Tidak boleh mencabut role admin sendiri'; end if;
 update public.profiles set role=p_role where id=p_user_id;
end$$;
revoke all on function public.admin_set_role(uuid,text) from public;
grant execute on function public.admin_set_role(uuid,text) to authenticated;
