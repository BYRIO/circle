create table zones (
    id uuid not null primary key default uuid_generate_v4(),
    profile jsonb default jsonb '{}',
    members uuid[],
    owner uuid,
    created timestamp(0) with time zone not null default current_timestamp,
    updated timestamp(0) with time zone not null default current_timestamp,
    deleted timestamp(0) with time zone
);

create index zones_members_idx on zones using gin (members);