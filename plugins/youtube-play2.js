import { exec } from "child_process"

let handler = async (m, { conn, args }) => {
  try {
    const text = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null
    if (!text) return m.reply(`Y el link?`)
    await m.reply("Espere un momento...")

    const [ytUrl, qualityLabel] = text.split(" ")
    const isYouTubeUrl = /^(?:(?:https?:)?\/\/)?(?:(?:(?:www|m(?:usic)?)\.)?youtu(?:\.be|be\.com)\/(?:shorts\/|live\/|v\/e(?:mbed)?\/|watch(?:\/|\?(?:\S+=\S+&)*v=)|oembed\?url=https?%3A\/\/(?:www|m(?:usic)?)\.youtube\.com\/watch\?(?:\S+=\S+&)*v%3D|attribution_link\?(?:\S+=\S+&)*u=(?:\/|%2F)watch(?:\?|%3F)v(?:=|%3D))?|www\.youtube-nocookie\.com\/embed\/)(([\w-]{11}))[\?&#]?\S*$/
    
    if (!isYouTubeUrl.test(ytUrl)) return await m.reply("Link no valido")

    const videoId = ytUrl.match(isYouTubeUrl)?.[2]
    if (!videoId) return await m.reply("Id del video incorrecta")

    const Solyptube = async (id, format = "360p") => {
      const curlCommand = `curl 'https://solyptube.com/api/v1.1/findvideo' \
      -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
      -H 'Accept: application/json, text/javascript, */*; q=0.01' \
      -H 'X-Requested-With: XMLHttpRequest' \
      -H 'User-Agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36' \
      -H 'Referer: https://solyptube.com/?url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3D${id}#searchrResult' \
      --data-raw 'url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3D${id}' \
      --compressed`
      
      return new Promise((resolve, reject) => {
        exec(curlCommand, (error, stdout) => {
          if (error) return reject(error)

          try {
            const selected = JSON.parse(stdout)
            const formatData = selected?.data?.formats?.find(v => v?.format_note === format) || selected?.data?.formats?.[0] || {}
            resolve({
              title: selected?.data?.title ?? "Titulo indefinido",
              ...formatData
            })
          } catch (e) {
            reject(e)
          }
        })
      })
    }

    const results = await Solyptube(videoId, qualityLabel || "360p")
    if (!results) return m.reply("No hay respuesta de la API")

    const isMP3 = results.vcodec === "none"
    const additionalInfo = `
*Titulo*: ${results.title || "Indefinido"}
*Tamaño*: ${(results.filesize / 1024 / 1024).toFixed(2)} MB
*Resolución*: ${results.resolution || "Indefinido"}
*FNota*: ${results.format_note || "Indefinido"}
*FPS*: ${results.fps || "Indefinido"} FPS
*Aspecto de radio*: ${results.aspect_ratio || "Indefinido"}
*Vcodec*: ${results.vcodec || "Indefinido"}
*Acodec*: ${results.acodec || "Indefinido"}
*Container*: ${results.container || "Indefinido"}
    `.trim()

    await conn.sendMessage(m.chat, {
      [isMP3 ? "audio" : "video"]: { url: results.url },
      mimetype: isMP3 ? "audio/mpeg" : "video/mp4",
      caption: additionalInfo
    }, { quoted: m })

  } catch (e) {
    throw e
  }
}

handler.help = ["solyptube"].map(v => `${v} <url> [calidad]`)
handler.tags = ["downloader"]
handler.command = /^(solyptube/play2)$/i

export default handler