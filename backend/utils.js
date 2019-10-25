module.exports = {
    getCollData : url => {
        const regex = new RegExp('(?<=https?\\://(?:www\\.)?deviantart\\.com/)([A-Za-z0-9\\-]+)(?:/)(gallery|favourites)(?:/)([0-9]+)(?:/)([A-Za-z0-9\\-]+)(?:/?)');
        const matches = url.match(regex);
        if (!matches) {
            return matches
        }

        return {
            username : matches[1],
            type : matches[2] === 'favourites' ? 'collections' : matches[2],
            number : +matches[3],
            slugName : matches[4]
        }
    }
}