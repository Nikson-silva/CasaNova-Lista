-- Preserve cancellation behavior while avoiding an unused PL/pgSQL record variable.
create or replace function public.cancel_gift_reservation(
  p_gift_id uuid
)
returns public.reservations
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_reservation public.reservations%rowtype;
  v_active_reservation_count integer;
begin
  -- Serialize cancellation and reservation attempts by locking the gift row.
  perform 1
  from public.gifts
  where id = p_gift_id
  for update;

  if not found then
    raise exception 'GIFT_NOT_FOUND'
      using errcode = 'P0002';
  end if;

  select count(*)
  into v_active_reservation_count
  from public.reservations
  where gift_id = p_gift_id
    and cancelled_at is null;

  if v_active_reservation_count = 0 then
    raise exception 'NO_ACTIVE_RESERVATION'
      using errcode = 'P0003';
  end if;

  if v_active_reservation_count > 1 then
    raise exception 'MULTIPLE_ACTIVE_RESERVATIONS'
      using errcode = 'P0004';
  end if;

  select *
  into v_reservation
  from public.reservations
  where gift_id = p_gift_id
    and cancelled_at is null
  for update;

  update public.reservations
  set cancelled_at = now()
  where id = v_reservation.id
  returning * into v_reservation;

  update public.gifts
  set status = 'available'::public.gift_status
  where id = p_gift_id;

  return v_reservation;
end;
$$;
