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

async function clearAllData() {
    await sb.from('rsvps').delete().neq('id', 0);
    await sb.from('suggestions').delete().neq('id', 0);
}
