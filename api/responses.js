const { Redis } = require("@upstash/redis")

const upstash = new Redis({
    url: process.env.LCSRF_KV_REST_API_URL,
    token: process.env.LCSRF_KV_REST_API_TOKEN,
})

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const { commandId, result } = req.body

    if (!commandId || !result) {
        return res.status(400).json({ error: "Missing commandId or result" })
    }

    await upstash.set(`response:${commandId}`, result, { ex: 10 })
    res.json({ ok: true })
}
