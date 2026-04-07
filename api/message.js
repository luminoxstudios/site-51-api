const { Redis } = require("@upstash/redis");
const redis = new Redis({
    url: process.env.LCSRF_KV_REST_API_URL,
    token: process.env.LCSRF_KV_REST_API_TOKEN,
});
const AUTH_KEY = process.env.AUTH_KEY;

module.exports = async (req, res) => {
    console.warn("Request body:", JSON.stringify(req.body));
    
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    const { key, ...payload } = req.body;

    if (key !== AUTH_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!payload.message) {
        return res.status(400).json({ error: "No message provided" });
    }

    await redis.rpush("messages", JSON.stringify(payload));
    await redis.expire("messages", 10); // expires after 10 seconds
    res.json({ success: true });
};
