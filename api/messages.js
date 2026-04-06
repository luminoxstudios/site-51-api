const { Redis } = require("@upstash/redis");

const redis = new Redis({
    url: process.env.RBLXSTOR_KV_REST_API_URL,
    token: process.env.RBLXSTOR_KV_REST_API_TOKEN,
});

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const messages = await redis.lrange("messages", 0, -1);
    await redis.del("messages");
    res.json({ messages });
};
