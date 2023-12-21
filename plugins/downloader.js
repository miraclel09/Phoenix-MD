const {
  pnix,  
  isPrivate,
  getJson,
  getBuffer,
  Function
  
} = require("../lib/");
const  ytdl = require("ytdl-core")

var videotime = 60000 // 1000 min
var dlsize = 1000 // 1000mb
const ffmpeg = require("fluent-ffmpeg");

//const  fetch = require("node-fetch")
const fs = require("fs");

const fetch = require("node-fetch")
let gis = require("g-i-s");
pnix(
  {
    pattern: "insta",
    fromMe: isPrivate,
    type: "downloader",
  },
  async (message, match,m,client) => {
    
if (!match)return message.reply(`*ENter Instagram Post Link*`)
 message.reply('_*Downloading...*_');
var ig = await fetch(`https://xzn.wtf/api/igdl?url=${match}&apikey=toxickichu`);
var igdl = await ig.json();
for (var i = 0; i < igdl.media[i].length; i++) {
var type = igdl.media[i].includes('.jpg') ? 'image' : 'video'
message.client.sendMessage(message.jid, {[type]:{ url:igdl.media[i]}, caption: `*${igdl.caption}*`}, {quoted: m})
}})

pnix(
  {
    pattern: "song",
    fromMe: isPrivate,
    type: "downloader",
  },
  async (message, match, m) => {
    message.client.sendMessage(message.jid, { react: { text: "🎧", key: m.key } });

    if (!match) return await message.reply(`_Enter A Song Name/Link_\n_📌 Example *${m.prefix}song Heat Waves*_`);

    let yts = require("yt-search");
    let search = await yts(match);
    let anu = search.videos[0];

    const getRandom = (ext) => {
      return `${Math.floor(Math.random() * 10000)}${ext}`;
    };

    let infoYt = await ytdl.getInfo(anu.url);
    if (infoYt.videoDetails.lengthSeconds >= videotime) return message.reply(`*Video File Is Too Big*`);

    let titleYt = infoYt.videoDetails.title;
    let randomName = getRandom(".mp3");
    let img = await getBuffer(anu.thumbnail);

    await message.client.sendMessage(message.jid, { text: `_Downloading ${titleYt}_` }, { quoted: m });

    const stream = ytdl(anu.url, {
      filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
    })
      .pipe(fs.createWriteStream(`./media/${randomName}`));

    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);
    });

    let stats = fs.statSync(`./media/${randomName}`);
    let fileSizeInBytes = stats.size;
    let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMegabytes <= dlsize) {
      await message.client.sendMessage(message.jid, { text: `*_Uploading ${titleYt}_` }, { quoted: m });

      let buttonMessage = {
        audio: fs.readFileSync(`./media/${randomName}`),
        mimetype: 'audio/mpeg',
        fileName: titleYt + ".mp3",
      };

      await message.client.sendMessage(message.jid, buttonMessage, { quoted: m });
      return fs.unlinkSync(`./media/${randomName}`);
    } else {
      message.reply(`_File size bigger than 100mb_`);
    }

    fs.unlinkSync(`./media/${randomName}`);
  }
);

//play
pnix(
  {
    pattern: "play",
    fromMe: isPrivate,
    type: "downloader",
  },
  async (message, match,m) => {
message.client.sendMessage(message.jid, { react: { text: "🎼" , key: m.key }}) 
if (!match) return await message.reply(`_Enter A Song Name/Link_\n_📌 Example *${m.prefix}song Heat Waves*_`)
            let yts = require("yt-search");
            let search = await yts(match);
            let anu = search.videos[0];
            const getRandom = (ext) => {
                return `${Math.floor(Math.random() * 10000)}${ext}`;
            };
            let infoYt = await ytdl.getInfo(anu.url);
            if (infoYt.videoDetails.lengthSeconds >= videotime) return message.reply(`*Video file too big*`);
            let titleYt = infoYt.videoDetails.title;
          let randomName = getRandom(".mp3");
let img = await getBuffer(anu.thumbnail);
            await message.client.sendMessage(message.jid,{ text : `*_Downloading...  ${titleYt}_*`, contextInfo: { externalAdReply: {
title: `${message.pushName}`,
sourceUrl: anu.url,
mediaUrl: anu.url,
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: true,
thumbnailUrl: anu.thumbnail }}}, {quoted: m});
            const stream = ytdl(anu.url, {
                    filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
                })
                .pipe(fs.createWriteStream(`./media/${randomName}`));
            await new Promise((resolve, reject) => {
                stream.on("error", reject);
                stream.on("finish", resolve);
            });

            let stats = fs.statSync(`./media/${randomName}`);
            let fileSizeInBytes = stats.size;
            let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
            if (fileSizeInMegabytes <= dlsize) {
                let buttonMessage = {
                    audio: fs.readFileSync(`./media/${randomName}`),
                    mimetype: 'audio/mpeg',
                    fileName: titleYt + ".mp3",
                    
                }
                await message.client.sendMessage(message.jid, buttonMessage,{ quoted: m})
                return fs.unlinkSync(`./media/${randomName}`);
            } else {
                message.reply(`*File Size Bigger Than 100Mb*`);
            }
            fs.unlinkSync(`./media/${randomName}`)})
//image downloader
pnix(
  {
    pattern: "img",
    fromMe: isPrivate,
    type: "downloader",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage("*Enter A Text And Number Of Images You Want\n📌Example : *Pheonix MD,6*");
    let [query, amount] = match.split(",");
    let result = await gimage(query, amount);
    await message.sendMessage(
      `_Downloading... ${amount || 5} Images For ${query}_`
    );
    for (let i of result) {
      await message.sendFromUrl(i);
    }
  }
);

async function gimage(query, amount = 5) {
  let list = [];
  return new Promise((resolve, reject) => {
    gis(query, async (error, result) => {
      for (
        var i = 0;
        i < (result.length < amount ? result.length : amount);
        i++
      ) {
        list.push(result[i].url);
        resolve(list);
      }
    });
  });
}

pnix(
  {
    pattern: "ytv",  // Updated pattern to capture the command and match
    fromMe: isPrivate,
    type: "downloader",
  },
  async (message, match, m) => {
    message.client.sendMessage(message.jid, { react: { text: "🎼", key: m.key } });
    if (!match[2]) return await message.reply(`_Enter A Video *Name/Link*_`); // Check the second captured group
    let yts = require("yt-search");
    let search = await yts(match[2]); // Use the second captured group for the search
    let anu = search.videos[0];
    const getRandom = (ext) => {
      return `${Math.floor(Math.random() * 10000)}${ext}`;
    };
    let infoYt = await ytdl.getInfo(anu.url);
    if (infoYt.videoDetails.lengthSeconds >= videotime) return message.reply(`_Video File Is Too Big_`);
    let titleYt = infoYt.videoDetails.title;
    let randomName = getRandom(".mp4"); // Change the extension to .mp4 for video
    let img = await getBuffer(anu.thumbnail);
    await message.client.sendMessage(
      message.jid,
      {
        text: `_Downloading..._  *${titleYt}_*`,
        contextInfo: {
          externalAdReply: {
            title: `${message.pushName}`,
            sourceUrl: anu.url,
            mediaUrl: anu.url,
            mediaType: 2, // Change mediaType to 2 for video
            showAdAttribution: true,
            renderLargerThumbnail: true,
            thumbnailUrl: anu.thumbnail
          }
        }
      },
      { quoted: m }
    );
    const stream = ytdl(anu.url, {
      quality: 'highest',
    })
      .pipe(fs.createWriteStream(`./media/${randomName}`));
    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);
    });

    let stats = fs.statSync(`./media/${randomName}`);
    let fileSizeInBytes = stats.size;
    let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    if (fileSizeInMegabytes <= dlsize) {
      let buttonMessage = {
        video: fs.readFileSync(`./media/${randomName}`),
        mimetype: 'video/mp4', // Change mimetype to video/mp4 for video
        fileName: titleYt + ".mp4",
      };
      await message.client.sendMessage(message.jid, buttonMessage, { quoted: m })
      return fs.unlinkSync(`./media/${randomName}`);
    } else {
      message.reply(`_File Size Bigger Than *100Mb*_`);
    }
    fs.unlinkSync(`./media/${randomName}`);
  }
);

