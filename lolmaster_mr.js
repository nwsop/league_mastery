// Need account names, encryptedSummonerId, championId -> championName.
// Will add same-champion mastery scores together between all accounts 
const fs = require('fs');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const dotEnv = require('dotenv').config();
const xhrGetUniqueID = new XMLHttpRequest();
const xhrGetChampionMasteries = new XMLHttpRequest();
const apiKey = process.env.RIOT_TOKEN;
let accounts = ['Sopyo'];
const baseURL = 'https://na1.api.riotgames.com';
const summonersLink = '/lol/summoner/v4/summoners/by-name/' + accounts[0];
const masteryVal = {
        'Usernames': ['My Dream LCS', 'From Iron', 'XTN Jackpot', 'FG Bugi', 'EG Impact'],

}


// Reading and parsing json file
const getChampionKeys = () => {
    fs.readFile('/home/nwsop/Desktop/JSProjects/LOLMastery/champion.json', (err, data) => {
        if(err) {
            console.log(err)
            return
        }
        let champCount = 0;
        try {
            //console.log(data.toString());  
            championJson = JSON.parse(data);
            //console.log(championJson['data']['Aatrox']['key']);
            for(i in championJson['data']) {
                let championNames = championJson['data'][i]['id'];
                let championKeys = championJson['data'][i]['key'];
                //console.log('Champion: ' + championJson['data'][i]['id'] + ' ' + 'Key: ' + championJson['data'][i]['key']);
                console.log('Champion: ' + championNames + ' ' + 'Key: ' + championKeys);
            
                champCount ++;
            } 
        } catch (error) {
            
        }
        console.log('Total Champions: ' + champCount);
        return championJson;
    })

}

const getChampionNameFromKey = (key) => {
    let result;
    let data = fs.readFileSync('/home/nwsop/Desktop/JSProjects/LOLMastery/champion.json')
    try {
        championJson = JSON.parse(data);
        for(i in championJson['data']) {
            
            if (championJson['data'][i]['key'] === key + '') {
                //console.log(championJson['data'][i]['id'])
                result = championJson['data'][i]['id'];
            };
        
        } 
    } catch (error) {
        console.log(error);
    }
    return result;
}

console.log(getChampionKeys());

// GET Requests to find Summoner Unique ID
// for(const [key, value] of Object.entries(masteryVal)) {
//     for(i = 0; i < value.length; i++) {
//         accounts += (value[i]); //console.log(values[i]);
//         console.log('Account: ' + accounts);
//     }
// }

xhrGetUniqueID.responseType = 'json';
xhrGetUniqueID.onreadystatechange = () => {
    //console.log(xhrGetUniqueID.responseText);
    try {
        let uniqueID = [JSON.parse(xhrGetUniqueID.responseText)["id"]]
        console.log("Your unique ID is: " + uniqueID)
    } catch (error) {
        
    }
}
//console.log('Summoners Link is equal to: ' + summonersLink);
xhrGetUniqueID.open('GET', baseURL + summonersLink);
const apiHeader = {
    "X-Riot-Token": apiKey
}

for(const [key, value] of Object.entries(apiHeader)) {
    xhrGetUniqueID.setRequestHeader(key, value)
}

/* Another way of grabbing the keys and values from the API header /*
Object.keys(apiHeader).forEach(key => {
    xhrGetUniqueID.setRequestHeader(key, apiHeader[key])
});
*/

xhrGetUniqueID.send();
//

// Find Champion Mastery
let encryptedSummonerId = 'CYhhK0MzX8tGAgWtm2JPW1-W5PjR1Dpr30yyb3Npum_6En4';
let championKey = '84';
const masteryScoreLink = '/lol/champion-mastery/v4/champion-masteries/by-summoner/'+ encryptedSummonerId + '/by-champion/' + championKey //need to add encrypted summoner ID to end of this
xhrGetChampionMasteries.responseType = 'json';
xhrGetChampionMasteries.onreadystatechange = () => {
    //console.log(xhrGetChampionMasteries.responseText);
    try {
        //console.log(JSON.parse(xhrGetChampionMasteries.responseText)[championPoints]);
        let championPts = [JSON.parse(xhrGetChampionMasteries.responseText)['championPoints']];
        console.log("Your champion mastery points are: " + championPts + ' on ' + getChampionNameFromKey(championKey));
    } catch (error) {
        
    }
}
//console.log('Summoners Link is equal to: ' + summonersLink);
xhrGetChampionMasteries.open('GET', baseURL + masteryScoreLink);
const apiMasteryHeader = {
    "X-Riot-Token": apiKey
}

for(const [key, value] of Object.entries(apiMasteryHeader)) {
    xhrGetChampionMasteries.setRequestHeader(key, value)
}

/* Another way of grabbing the keys and values from the API header 
Object.keys(apiHeader).forEach(key => {
    xhrGetUniqueID.setRequestHeader(key, apiHeader[key])
});
*/

xhrGetChampionMasteries.send();
