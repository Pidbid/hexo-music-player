/* global hexo */
'use strict';

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const fetch = require('node-fetch');

// --- Section 1: Asset Handling ---
// Register a generator to copy CSS and JS files to the public directory.
hexo.extend.generator.register('music_player_assets', function () {
    return [
        {
            path: 'css/music_player.css',
            data: () => fs.createReadStream(path.join(__dirname, 'source/css/music_player.css'))
        },
        {
            path: 'js/music_player.js',
            data: () => fs.createReadStream(path.join(__dirname, 'source/js/music_player.js'))
        }
    ];
});

// Inject the CSS and JS links into the HTML.
hexo.extend.injector.register('head_end', () => {
    return '<link rel="stylesheet" href="/css/music_player.css" type="text/css">';
});

hexo.extend.injector.register('body_end', () => {
    return '<script src="/js/music_player.js"></script>';
});


// --- Section 2: Helper Function ---

/**
 * @description Cleans and reconstructs the arguments array polluted by Hexo's Markdown renderer.
 * @param {string[]} dirtyArgs - The original, messy arguments array from the Hexo tag.
 * @returns {string[]} A clean, reconstructed arguments array.
 */
function reconstructArgs(dirtyArgs) {
    // Step 1: Join the messy array into a single string.
    const dirtyString = dirtyArgs.join(' ');

    // Step 2: Clean the string by removing HTML tags and normalizing quotes.
    const cleanedString = dirtyString
        .replace(/<[^>]*>/g, '')      // Remove HTML tags like <a>
        .replace(/“|”/g, '"');        // Replace full-width quotes with standard ones

    // Step 3: Extract all substrings enclosed in double quotes.
    const matches = cleanedString.match(/"([^"]*)"/g);

    if (!matches) {
        // Fallback for single arguments that are not URLs (e.g., "netease:id").
        return [dirtyArgs[0]];
    }

    // Step 4: Remove the surrounding quotes from each match.
    return matches.map(match => match.slice(1, -1));
}


// --- Section 3: Tag Plugin Registration ---
try {
    const playerTplPath = path.join(__dirname, 'lib/music_player.ejs');
    const playerTpl = fs.readFileSync(playerTplPath, 'utf-8');

    hexo.extend.tag.register('music', async function (args) {
        if (!args || args.length === 0) return '';

        // Clean the arguments array to handle pre-rendered HTML from the markdown engine.
        const cleanedArgs = reconstructArgs(args);
        
        let songData;
        const firstArg = cleanedArgs[0];

        // Mode 1: Platform:ID (e.g., "netease:123456")
        if (cleanedArgs.length === 1 && firstArg.includes(':')) {
            const [platform, id] = firstArg.split(':');

            if (platform.toLowerCase() !== 'netease') {
                hexo.log.warn(`Hexo-Music-Player: Platform '${platform}' is not supported yet.`);
                return '';
            }
            
            const requestUrl = `https://api.paugram.com/netease/?id=${id}`;
            hexo.log.info(`Fetching NetEase music data from: ${requestUrl}`);
            try {
                const response = await fetch(requestUrl);
                if (!response.ok) throw new Error(`API response was not ok. Status: ${response.status}`);
                
                const apiData = await response.json();
                songData = {
                    name: apiData.title,
                    artist: apiData.artist,
                    url: apiData.link,
                    cover: apiData.cover
                };
            } catch (error) {
                hexo.log.error('Hexo-Music-Player: Failed to fetch NetEase data.', error);
                return '';
            }
        } 
        // Mode 2: Direct URL (e.g., "url" "name" "artist" ["cover"])
        else if (firstArg.startsWith('http')) {
            if (cleanedArgs.length < 3) {
                hexo.log.error("Hexo-Music-Player: Direct URL usage requires at least 3 arguments: url, name, and artist.");
                return '';
            }
            songData = {
                url: cleanedArgs[0],
                name: cleanedArgs[1],
                artist: cleanedArgs[2],
                cover: cleanedArgs[3]
            };
        }
        // Mode 3: Invalid Format
        else {
            hexo.log.error(`Hexo-Music-Player: Invalid tag format. Use 'platform:id' or 'url "name" "artist" ["cover"]'.`);
            return '';
        }

        if (!songData) {
             hexo.log.error("Hexo-Music-Player: Internal error - songData was not created.");
             return '';
        }

        const data = {
            page: {
                music_player: {
                    name: songData.name,
                    artist: songData.artist,
                    url: songData.url,
                    cover: songData.cover || hexo.config.music_player?.default_cover || ''
                }
            }
        };

        return ejs.render(playerTpl, data);

    }, { async: true });

} catch (error) {
    hexo.log.error("Hexo-Music-Player Error: Failed to load plugin.", error);
}