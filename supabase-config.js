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

// ---- Media (Photos & Videos) API ----
const MEDIA_BUCKET = 'wedding-media';

async function uploadMedia(file, uploadedBy) {
    // Generate unique filename
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const filePath = fileName;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await sb.storage
        .from(MEDIA_BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        console.error('Upload error:', uploadError);
        return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = sb.storage.from(MEDIA_BUCKET).getPublicUrl(filePath);
    const fileUrl = urlData.publicUrl;

    // Insert metadata
    const fileType = file.type.startsWith('video/') ? 'video' : 'image';
    const { error: dbError } = await sb.from('media').insert([{
        file_url: fileUrl,
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

    return { success: true, url: fileUrl, type: fileType };
}

async function getMedia() {
    const { data, error } = await sb
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error loading media:', error);
        return [];
    }
    return data || [];
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
