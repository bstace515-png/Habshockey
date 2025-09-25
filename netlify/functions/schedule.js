export default async (req, context) => {
  const proxyUrl = Deno.env.get?.("PROXY_URL") || process.env.PROXY_URL || null;

  // Proxy first (when you add PROXY_URL later)
  if (proxyUrl) {
    try {
      const r = await fetch(proxyUrl.replace(/\/$/,'') + '/schedule?team=MTL', {
        headers: { 'user-agent': 'HabsSite/1.0' }
      });
      if (r.ok) {
        const arr = await r.json();
        const now = new Date();
        const lines = [];
        let nextGame = null;
        for (const g of arr) {
          const dt = new Date(g.date);
          const nice = dt.toLocaleString('en-CA', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
          const isHome = g.home === 'MTL';
          const opp = isHome ? (g.away || 'Unknown') : (g.home || 'Unknown');
          lines.push({ when: dt.toISOString(), line: `${nice} — ${isHome?'Home':'Away'} vs ${opp}`, isHome, opp });
          if (!nextGame && dt >= now) nextGame = { when: dt.toISOString(), isHome, opp };
        }
        if (lines.length) {
          return new Response(JSON.stringify({ lines, nextGame, debug: ['source: proxy'] }), { headers: { 'content-type': 'application/json' } });
        }
      }
    } catch { /* fall back */ }
  }

  // Baked fallback 82 games (synthetic but complete so UI never breaks)
  const teams = ["TOR","BOS","NYR","DET","OTT","BUF","TBL","PIT","FLA","VGK","WSH","PHI","CBJ","NJD","NYI","CAR","DAL","COL","WPG","MIN","NSH","STL","CHI","EDM","CGY","VAN","SEA","LAK","ANA","SJS","ARI","OTT"];
  const start = new Date("2025-10-08T23:00:00Z");
  const fb = Array.from({length:82}, (_,i) => {
    const when = new Date(start.getTime() + i*2*24*3600*1000);
    return { when: when.toISOString(), isHome: i%2===0, opp: teams[i % teams.length] };
  });

  const now = new Date();
  const lines = [];
  let nextGame = null;
  for (const g of fb) {
    const dt = new Date(g.when);
    const nice = dt.toLocaleString('en-CA', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
    lines.push({ when: dt.toISOString(), line: `${nice} — ${g.isHome?'Home':'Away'} vs ${g.opp}`, isHome: g.isHome, opp: g.opp });
    if (!nextGame && dt >= now) nextGame = { when: dt.toISOString(), isHome: g.isHome, opp: g.opp };
  }

  return new Response(JSON.stringify({ lines, nextGame, debug: ['source: baked'] }), { headers: { 'content-type': 'application/json' } });
}
