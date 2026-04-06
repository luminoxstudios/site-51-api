const { Redis } = require('@upstash/redis')

const upstash = new Redis({
    url: process.env.RBLXSTOR_KV_REST_API_URL,
    token: process.env.RBLXSTOR_KV_REST_API_TOKEN,
})

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const keys = await upstash.keys('pending:*')

    if (!keys || keys.length === 0) {
        return res.json(null)
    }

    const commandId = keys[0].replace('pending:', '')
    const command = await upstash.get(`pending:${commandId}`)
    await upstash.del(`pending:${commandId}`)

    const parsed = typeof command === 'string' ? JSON.parse(command) : command
    return res.json({ ...parsed, commandId })
}
