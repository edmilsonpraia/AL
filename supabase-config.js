// ========================================
// Supabase Configuration
// ========================================

const SUPABASE_URL = 'https://wueqkveqgyryvrfgejzc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5W28iBxr3RaFG4zHIFYQkw_FjCdqKEc';

// Initialize Supabase client (use the global from CDN, then create our client)
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- RSVP API ----
async function saveRSVP(data) {
    const { error } = await sb.from('rsvps').insert([{
        name: data.name || null,
        phone: data.phone || null,
        guests: parseInt(data.guests) || 0,
        attendance: data.attendance,
        type: data.type || null,
        message: data.message || null,
        source: data.source || 'rsvp_form'
    }]);
    if (error) console.error('Error saving RSVP:', error);
    return !error;
}

async function getRSVPs() {
    const { data, error } = await sb
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error loading RSVPs:', error);
        return [];
    }
    return data || [];
}

async function deleteRSVP(id) {
    const { error } = await sb.from('rsvps').delete().eq('id', id);
    if (error) console.error('Error deleting RSVP:', error);
    return !error;
}

// ---- Suggestions API ----
async function saveSuggestion(data) {
    const { error } = await sb.from('suggestions').insert([{
        nome: data.nome || 'Anónimo',
        pratos: data.pratos || null,
        sobremesas: data.sobremesas || null,
        bebidas: data.bebidas || null
    }]);
    if (error) console.error('Error saving suggestion:', error);
    return !error;
}

async function getSuggestions() {
    const { data, error } = await sb
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error loading suggestions:', error);
        return [];
    }
    return data || [];
}

// ---- Brindes (Gift Selections) API ----
async function saveBrindeSelection(data) {
    const { error } = await sb.from('brindes_selecionados').insert([{
        brinde_id: data.brinde_id,
        brinde_nome: data.brinde_nome,
        brinde_preco: data.brinde_preco || null,
        nome: data.nome,
        telefone: data.telefone || null,
        mensagem: data.mensagem || null
    }]);
    if (error) console.error('Error saving brinde selection:', error);
    return !error;
}

async function getBrindesSelecionados() {
    const { data, error } = await sb
        .from('brindes_selecionados')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error loading brindes selections:', error);
        return [];
    }
    return data || [];
}

async function deleteBrindeSelection(id) {
    const { error } = await sb.from('brindes_selecionados').delete().eq('id', id);
    if (error) console.error('Error deleting brinde selection:', error);
    return !error;
}

// ---- Media (Photos & Videos) API ----
const MEDIA_BUCKET = 'wedding-media';

async function uploadMedia(file, uploadedBy) {
    // Generate unique filename
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const filePath = fileName;

    // Upload to private storage
    const { error: uploadError } = await sb.storage
        .from(MEDIA_BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        console.error('Upload error:', uploadError);
        return { success: false, error: uploadError.message };
    }

    // Insert metadata only (no URL - we generate signed URLs on demand)
    const fileType = file.type.startsWith('video/') ? 'video' : 'image';
    const { error: dbError } = await sb.from('media').insert([{
        file_url: '',  // Not used - signed URLs generated on read
        file_path: filePath,
        file_name: file.name,
        file_type: fileType,
        size: file.size,
        uploaded_by: uploadedBy || 'Anónimo'
    }]);

    if (dbError) {
        console.error('DB error:', dbError);
        return { success: false, error: dbError.message };
    }

    return { success: true, type: fileType };
}

// Generate signed URLs for media files (expires after specified seconds, default 1 hour)
async function getMedia(expiresIn = 3600) {
    const { data, error } = await sb
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading media:', error);
        return [];
    }

    if (!data || data.length === 0) return [];

    // Batch create signed URLs for all files
    const filePaths = data.map(m => m.file_path);
    const { data: signedData, error: signedError } = await sb.storage
        .from(MEDIA_BUCKET)
        .createSignedUrls(filePaths, expiresIn);

    if (signedError) {
        console.error('Error generating signed URLs:', signedError);
        return data;
    }

    // Map signed URLs back to media records
    const urlMap = {};
    signedData.forEach(s => {
        urlMap[s.path] = s.signedUrl;
    });

    return data.map(m => ({
        ...m,
        file_url: urlMap[m.file_path] || ''
    }));
}

async function deleteMedia(id, filePath) {
    if (filePath) {
        await sb.storage.from(MEDIA_BUCKET).remove([filePath]);
    }
    const { error } = await sb.from('media').delete().eq('id', id);
    if (error) console.error('Error deleting media:', error);
    return !error;
}

async function clearAllData() {
    await sb.from('rsvps').delete().neq('id', 0);
    await sb.from('suggestions').delete().neq('id', 0);
    // Don't auto-delete media - too risky
}

// ---- Tickets (Brinde do Casamento) API ----
// Table SQL:
//   create table public.tickets (
//       id bigserial primary key,
//       ticket_code text unique not null,
//       name text not null,
//       phone text,
//       redeemed boolean default false,
//       redeemed_at timestamptz,
//       created_at timestamptz default now()
//   );
//   alter table public.tickets enable row level security;
//   create policy "public insert tickets" on public.tickets for insert with check (true);
//   create policy "public read tickets" on public.tickets for select using (true);
//   create policy "public update tickets" on public.tickets for update using (true);

async function createTicket(data) {
    const { data: inserted, error } = await sb.from('tickets').insert([{
        ticket_code: data.ticket_code,
        name: data.name,
        phone: data.phone || null
    }]).select().single();
    if (error) {
        console.error('Error creating ticket:', error);
        return null;
    }
    return inserted;
}

async function getTicketByCode(code) {
    const { data, error } = await sb.from('tickets')
        .select('*')
        .eq('ticket_code', code)
        .maybeSingle();
    if (error) {
        console.error('Error fetching ticket:', error);
        return null;
    }
    return data;
}

async function getTickets() {
    const { data, error } = await sb.from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error loading tickets:', error);
        return [];
    }
    return data || [];
}

async function redeemTicket(id) {
    const { error } = await sb.from('tickets')
        .update({ redeemed: true, redeemed_at: new Date().toISOString() })
        .eq('id', id);
    if (error) console.error('Error redeeming ticket:', error);
    return !error;
}

async function unredeemTicket(id) {
    const { error } = await sb.from('tickets')
        .update({ redeemed: false, redeemed_at: null })
        .eq('id', id);
    if (error) console.error('Error un-redeeming ticket:', error);
    return !error;
}

async function deleteTicket(id) {
    const { error } = await sb.from('tickets').delete().eq('id', id);
    if (error) console.error('Error deleting ticket:', error);
    return !error;
}
