import fetch from "node-fetch";
import yts from "yt-search";
var sebas = async (m,{
    text, //texto luego del comando
    usedPrefix, // prefijo usado en el bot
    command,// comando usado
    conn // uso universal
}) => {
    if (!text){
        throw m.reply("ingresa el nombre de la cancion")
    }
try { 
    m.reply('*aguarse un momento su audio está cargando 🫡✨*.')
    let video_yts = await yts(text);
    let menu_de_videos = video_yts.all;
    let video_seleccionado = menu_de_videos[0]
    let url_video_yt = video_seleccionado.url
    let api_url = `https://ngapain-jir.vercel.app/api/download/youtube?text=${text}`
let resultado = await (await fetch(api_url)).json();
    let primer_resultado_api = resultado.result[0]; 
let {
title, 
description,
durasi, 
thumbnail, 
download, 
} = primer_resultado_api;
let { 
audio, 
video,
} = download;
    let texto = `_${title}_

- Duración: ${durasi}

${description}`;
await conn.sendMessage(m.chat, { 
      image: { url: thumbnail },  
      caption: texto 
    }, { quoted: m });

await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: "audio/mp4", fileName: title + '.mp3', quoted: m)
// await conn.sendFile(m.chat,
 audio, 
 title + '.mp3', 
 title + '.mp3', 
 m)
} catch (error) {
console.log(e)
m.reply("no se puede descargar el audio.") 
}
}
sebas.help = ["play"]
sebas.tags = ["downloader"]
sebas.command = ["play"]

export default sebas