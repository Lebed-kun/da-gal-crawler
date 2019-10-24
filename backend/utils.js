module.exports = {
    getUsername : url => {
        const regex = new RegExp('(?<=https://www.deviantart.com/)(.*)(?=/favourites/)')
        const matches = url.match(regex);
        return matches && matches[0];
    }
}