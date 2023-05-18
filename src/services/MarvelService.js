class MarvelService
{
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apikey = 'apikey=3b43134f0900103d40af2c9b272aa166';
    _baseOffset = 210;
    getResource = async (url) =>
    {
        let res = await fetch(url);
        if(!res.ok)
        {
             throw new Error(`Could not feth ${url}, status: ${res.status}`);
        }
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) =>
    {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apikey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacters = async (id) =>
    {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apikey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) =>
    {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...`: `Такого персонажа нет`,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items ? char.comics.items.slice(0, 5) : null
        }
    }
}

export default MarvelService;