const LAYLO_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiZWE4YzU0MWEtNDgzNC00YWUxLTkwNWYtZmM2YWY1MWFjODMyIiwidXNlcklkIjoiZjM0bTRFR1NHS1ZFR1hzeVQ1TjU4Zk1LWiIsInRva2VuVHlwZSI6IlNVQlNDUklCRSIsImhhc0NsaWVudEFjY2VzcyI6dHJ1ZSwiY3JlYXRlZCI6MTc3MTk2MTMyMTM4OSwibGFiZWwiOiJGcmVlZG9tRkNJIiwiaWF0IjoxNzcxOTYxMzIxfQ.3jIFmSbpnDd5_si75BFhXVmWoj3naEXJRs9rm4YyN04';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle the subscribe proxy endpoint
    if (request.method === 'POST' && url.pathname === '/subscribe') {
      try {
        const { email } = await request.json();
        await fetch('https://laylo.com/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + LAYLO_API_KEY
          },
          body: JSON.stringify({
            query: 'mutation($email: String) { subscribeToUser(email: $email) }',
            variables: { email }
          })
        });
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // All other requests — serve static assets
    return env.ASSETS.fetch(request);
  }
};
