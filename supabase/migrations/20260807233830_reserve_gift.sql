-- Atomically creates a reservation and marks its gift as reserved.
create or replace function public.reserve_gift(
  p_gift_id uuid,
  p_guest_name text,
  p_guest_phone text,
  p_message text
)
returns public.reservations
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_gift public.gifts%rowtype;
  v_reservation public.reservations%rowtype;
begin
  -- Serialize concurrent reservation attempts for the same gift.
  select *
  into v_gift
  from public.gifts
  where id = p_gift_id
  for update;

  if not found then
    raise exception 'GIFT_NOT_FOUND'
      using errcode = 'P0002';
  end if;

  -- Absence and conflicts are reported as exceptions, never magic values.
  if v_gift.status is distinct from 'available'::public.gift_status then
    raise exception 'GIFT_ALREADY_RESERVED'
      using errcode = 'P0001';
  end if;

  insert into public.reservations (
    gift_id,
    guest_name,
    guest_phone,
    message
  )
  values (
    p_gift_id,
    p_guest_name,
    p_guest_phone,
    p_message
  )
  returning * into v_reservation;

  update public.gifts
  set status = 'reserved'::public.gift_status
  where id = p_gift_id;

  return v_reservation;
end;
$$;

comment on function public.reserve_gift(uuid, text, text, text)
is 'Atomically reserves an available gift and returns the created reservation.';

revoke execute on function public.reserve_gift(uuid, text, text, text)
from public, anon, authenticated;

grant execute on function public.reserve_gift(uuid, text, text, text)
to service_role;
