-- Prepare the gift catalog for normal, crazy, and category-less gifts.

do $$
begin
  -- Removing legacy categories is only safe while the catalog is empty.
  if exists (
    select 1
    from public.categories
    where name in ('Lavanderia', 'Decoração', 'Eletrodomésticos')
  ) then
    if exists (select 1 from public.gifts) then
      raise exception
        'Cannot remove legacy categories while gifts exist.';
    end if;

    if exists (select 1 from public.reservations) then
      raise exception
        'Cannot remove legacy categories while reservations exist.';
    end if;

    if exists (
      select 1
      from public.gifts
      where category_id in (
        select id
        from public.categories
        where name in ('Lavanderia', 'Decoração', 'Eletrodomésticos')
      )
    ) then
      raise exception
        'Cannot remove legacy categories while they are referenced by gifts.';
    end if;
  end if;

  if exists (
    select 1
    from public.categories
    where name not in (
      'Cozinha',
      'Sala',
      'Quarto',
      'Banheiro',
      'Casal',
      'Lavanderia',
      'Decoração',
      'Eletrodomésticos'
    )
  ) then
    raise exception
      'Unexpected categories found; refusing to change the official category set.';
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'gift_kind'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.gift_kind as enum ('normal', 'crazy');
  end if;
end;
$$;

alter table public.gifts
  add column if not exists kind public.gift_kind not null default 'normal',
  add column if not exists recommendation_url text;

alter table public.gifts
  alter column category_id drop not null,
  alter column estimated_price drop not null;

comment on type public.gift_kind is
  'Classifies gifts as part of the normal list or the crazy gift list.';

comment on column public.gifts.kind is
  'Official classification of a gift. Category absence must not be used as a discriminator.';

comment on column public.gifts.recommendation_url is
  'Optional external product recommendation URL; gift images remain in Supabase Storage.';

delete from public.categories
where name in ('Lavanderia', 'Decoração', 'Eletrodomésticos');

insert into public.categories (name, display_order)
select 'Casal', 5
where not exists (
  select 1
  from public.categories
  where name = 'Casal'
);

update public.categories
set display_order = case name
  when 'Cozinha' then 1
  when 'Sala' then 2
  when 'Quarto' then 3
  when 'Banheiro' then 4
  when 'Casal' then 5
end
where name in ('Cozinha', 'Sala', 'Quarto', 'Banheiro', 'Casal')
  and display_order is distinct from case name
    when 'Cozinha' then 1
    when 'Sala' then 2
    when 'Quarto' then 3
    when 'Banheiro' then 4
    when 'Casal' then 5
  end;

do $$
begin
  if (
    select count(*)
    from public.categories
  ) <> 5 or exists (
    select 1
    from public.categories
    where name not in ('Cozinha', 'Sala', 'Quarto', 'Banheiro', 'Casal')
  ) then
    raise exception
      'Official category reconciliation failed; the migration was rolled back.';
  end if;
end;
$$;
