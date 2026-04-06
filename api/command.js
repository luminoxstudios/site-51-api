const { randomUUID } = require('crypto')
const Messages = require('./lib/errors.js')

const OPEN_CLOUD_KEY = process.env.OPEN_CLOUD_KEY

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: Messages.METHOD_NOT_ALLOWED })
    }

   const { command, data, commandId, universeId, topic } = req.body

if (!command || !commandId || !universeId) {
    return res.status(400).json({ success: false, reason: Messages.MISSING_FIELDS })
}

    // Step 1: Broadcast to all servers via MessagingService
const publishRes = await fetch(`https://apis.roblox.com/cloud/v2/universes/${universeId}:publishMessage`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": OPEN_CLOUD_KEY
    },
    body: JSON.stringify({ topic: topic, message: JSON.stringify({ command, data, commandId }) })
})

if (!publishRes.ok) {
    const err = await publishRes.text()
    console.error("Publish failed:", publishRes.status, err)
    return res.json({ success: false, reason: `Broadcast failed: ${publishRes.status}` })
}

    // Step 2: Wait for servers to write to MemoryStore
    await sleep(2000)

    // Step 3: Read the queue
   const queueRes = await fetch(
    `https://apis.roblox.com/cloud/v2/universes/${universeId}/memory-store/queues/${commandId}/items:read?count=50`,
    {
        method: "GET",
        headers: {
            "x-api-key": OPEN_CLOUD_KEY
        }
    }
)

if (!queueRes.ok) {
    return res.json({ success: false, reason: Messages.TIMEOUT })
}

const queueText = await queueRes.text()
const queueData = JSON.parse(queueText)
const items = queueData.queueItems ?? []

if (items.length === 0) {
    return res.json({ success: false, reason: Messages.TIMEOUT })
}

    // Check if any server found the player
  const foundItem = items.find(item => {
    if (!item.data) return false
    const parsed = JSON.parse(item.data)
    return parsed.found === true
})

if (foundItem) {
    const parsed = JSON.parse(foundItem.data)
    return res.json({ success: true, result: parsed.data })
}

    // Servers responded but none had the player
    return res.json({ success: false, reason: Messages.PLAYER_NOT_FOUND(data?.userid) })
}
