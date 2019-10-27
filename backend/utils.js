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
    },

    between : function(a, b) {
        return num => a <= num && num <= b;
    },

    slugify : function(str) {
        const A_CODE = 'A'.charCodeAt(0);
        const Z_CODE = 'Z'.charCodeAt(0);
        const a_CODE = 'a'.charCodeAt(0);
        const z_CODE = 'z'.charCodeAt(0);
        const ZERO_CODE = '0'.charCodeAt(0);
        const NINE_CODE = '9'.charCodeAt(0);
        
        let result = '';
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i);
            // Letter
            if (this.between(A_CODE, Z_CODE)(charCode) || this.between(a_CODE, z_CODE)(charCode)) {
                result += str[i].toLowerCase();
            } else if (this.between(ZERO_CODE, NINE_CODE)(charCode)) {
                result += str[i];
            } else if (str[i] === ' ') {
                result += '-'
            }
        }

        return result;
    },

    getFileName : url => {
        const regex = new RegExp('([a-z0-9_\\-]+\\.jpe?g|[a-z0-9_\\-]+\\.png|[a-z0-9_\\-]+\\.gif)(?=\\?token)')
        const matches = url.match(regex);

        return matches && matches[0];
    }
}