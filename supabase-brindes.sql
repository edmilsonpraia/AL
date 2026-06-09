-- ============================================================
-- Tabela: brindes_selecionados
-- Regista os brindes Vista Alegre escolhidos pelos convidados
-- ============================================================

create table if not exists public.brindes_selecionados (
    id bigserial primary key,
    created_at timestamptz not null default now(),
    brinde_id text not null,
    brinde_nome text not null,
    brinde_preco text,
    nome text not null,
    telefone text,
    mensagem text
);

alter table public.brindes_selecionados enable row level security;

-- Permitir que qualquer convidado registe uma oferta
drop policy if exists "brindes_anon_insert" on public.brindes_selecionados;
create policy "brindes_anon_insert"
    on public.brindes_selecionados
    for insert
    to anon
    with check (true);

-- Permitir leitura (admin lê via mesmo cliente anónimo)
drop policy if exists "brindes_anon_select" on public.brindes_selecionados;
create policy "brindes_anon_select"
    on public.brindes_selecionados
    for select
    to anon
    using (true);

-- Permitir apagar (admin remove ofertas via mesmo cliente anónimo)
drop policy if exists "brindes_anon_delete" on public.brindes_selecionados;
create policy "brindes_anon_delete"
    on public.brindes_selecionados
    for delete
    to anon
    using (true);

create index if not exists brindes_selecionados_created_at_idx
    on public.brindes_selecionados (created_at desc);

create index if not exists brindes_selecionados_brinde_id_idx
    on public.brindes_selecionados (brinde_id);
