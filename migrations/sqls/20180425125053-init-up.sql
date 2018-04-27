create extension "uuid-ossp" schema pg_catalog;
create table users (
    id uuid not null primary key default uuid_generate_v4(),
    email text not null,
    username text not null unique,
    nickname text not null,
    avatar text not null,
    password_hashed text not null,
    password_salt text not null,
    email_confirmed boolean not null default false,
    profile json,   
    created timestamp(0) with time zone not null default current_timestamp,
    updated timestamp(0) with time zone not null default current_timestamp,
    deleted timestamp(0) with time zone
);
create unique index users_unique_lower_idx on users (lower(email));
create view real_users as select id,email,username,nickname,avatar,created,updated from users where deleted is null and email_confirmed is true;