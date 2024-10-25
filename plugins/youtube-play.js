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
} = download;
await conn.sendMessage(m.chat, {
    audio: { url: audio},
    mimeType: "audio/mp4",
    }, {quoted: m });
} catch (error) {
console.log(e)
m.reply("no se puede descargar el audio.") 
}
}
sebas.help = ["play"]
sebas.tags = ["downloader"]
sebas.command = ["play"]

export default sebas
