import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Stable Gemini model supported by the Gemini API.
const MODEL = 'gemini-2.5-flash';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Authentication required' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) return json({ error: 'Gemini API is not configured.' }, 503);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return json({ error: 'Invalid session.' }, 401);

    const body = await req.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const conversationId = typeof body.conversation_id === 'string' ? body.conversation_id : null;
    if (!message) return json({ error: 'Message is required.' }, 400);
    if (message.length > 12000) return json({ error: 'Message is too long.' }, 400);

    let history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    if (conversationId) {
      const { data } = await supabase.from('messages').select('role,content').eq('conversation_id', conversationId).order('created_at', { ascending: true }).limit(30);
      history = (data ?? []).filter((m) => m.role === 'user' || m.role === 'assistant').map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(geminiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'You are BUNVIX AI, a helpful, accurate, concise and friendly AI assistant. Be clear, useful and honest about uncertainty. Never claim to have performed actions you did not perform.' }] },
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    });

    const result = await geminiResponse.json();
    if (!geminiResponse.ok) {
      console.error('Gemini error', result);
      return json({ error: 'Gemini could not answer right now.' }, 502);
    }
    const answer = result?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('')?.trim();
    if (!answer) return json({ error: 'No response was returned.' }, 502);

    if (conversationId) {
      await supabase.from('messages').insert([
        { conversation_id: conversationId, role: 'user', content: message },
        { conversation_id: conversationId, role: 'assistant', content: answer },
      ]);
    }

    return json({ answer, model: MODEL });
  } catch (error) {
    console.error(error);
    return json({ error: 'Unexpected server error.' }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
