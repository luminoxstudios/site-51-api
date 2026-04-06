const LOG_URL = process.env.LOG_URL // your requestbin/webhook.site URL

module.exports = async (req, res) => {
    await fetch(LOG_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            method: req.method,
            headers: req.headers,
            body: req.body,
            query: req.query,
            url: req.url
        })
    })

    res.json({ ok: true })
}
