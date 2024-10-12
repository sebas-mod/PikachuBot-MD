import yts from 'yt-search'
let handler = async (m, { conn, command, text, usedPrefix }) => {

  if (!text) throw `*\`AVISO ⭐\`*\n\n*INGRESA EL NOMBRE*\n_Ejemplo: ${usedPrefix + command} amorfoda_`
        let res = await yts(text)
        let vid = res.videos[0]
        if (!vid) throw `✳️ Vídeo/Audio no encontrado`
        let { title, description, thumbnail, videoId, timestamp, views, ago, url } = vid
        //const url = 'https://www.youtube.com/watch?v=' + videoId
        m.react('💿') 
  let play = `> *\`TÍTULO:\`* ${vid.title}
> *\`SUBIDO:\`* ${vid.ago}
> *\`DURACIÓN:\`* ${vid.timestamp}
> *\`VISTAS:\`* ${vid.views.toLocaleString()}`
 await conn.sendButton(m.chat, play, packname, thumbnail, [
    ['💿 𝙈𝙪𝙨𝙞𝙘𝙖 𝙢𝙥3', `${usedPrefix}fgmp3 ${url}`],
    ['📀𝙑𝙞𝙙𝙚𝙤 𝙢𝙥4', `${usedPrefix}fgmp4 ${url}`],
['📁𝙈𝙪𝙨𝙞𝙘𝙖 𝙙𝙤𝙘', `${usedPrefix}ytmp3doc ${url}`],
['📁 𝙑𝙞𝙙𝙚𝙤 𝙙𝙤𝙘', `${usedPrefix}ytmp4doc ${url}`]
  ], null, [[' 𝘾𝙖𝙣𝙖𝙡 𝙤𝙛𝙘', `${channel}`]], m)
}
handler.help = ['play']
handler.tags = ['dl']
handler.command = ['play', 'playvid']
handler.disabled = false

export default handler