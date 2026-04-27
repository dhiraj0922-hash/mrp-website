/* My Roti Place Supabase browser client
   Plain HTML/JS sites cannot read .env.local in the browser at runtime without a build step.
   Only the Supabase publishable/anon key is acceptable here. Never place a service_role key in browser code.
*/
(function () {
  console.log('[MRP Supabase] client script loaded');

  const SUPABASE_URL = 'https://ewiyoydwztjhbqltzwbi.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_4T7ji1X9r324tmogIhRq1w_wsnfEG2h';

  function initSupabaseClient() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('[MRP Supabase] CDN client is not available.');
      return null;
    }

    if (window.mrpSupabase) return window.mrpSupabase;

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    window.mrpSupabase = client;
    window.mrpSupabaseConfig = {
      url: SUPABASE_URL,
      keyType: 'publishable'
    };

    console.info('[MRP Supabase] Browser client initialized for future forms/leads.');
    return client;
  }

  async function testSupabaseConnection() {
    try {
      const client = initSupabaseClient();
      if (!client) {
        return {
          ok: false,
          message: 'Supabase CDN client was not available.'
        };
      }

      const { data, error } = await client.auth.getSession();
      if (error) {
        return {
          ok: false,
          message: error.message
        };
      }

      return {
        ok: true,
        message: 'Supabase client initialized successfully.',
        hasSession: !!data.session
      };
    } catch (error) {
      return {
        ok: false,
        message: error && error.message ? error.message : 'Unknown Supabase initialization error.'
      };
    }
  }

  window.testSupabaseConnection = testSupabaseConnection;
  globalThis.testSupabaseConnection = testSupabaseConnection;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabaseClient, { once: true });
  } else {
    initSupabaseClient();
  }
})();
