export default class InstaService {
    constructor(refreshToken) {
        this.refreshToken = refreshToken;
    }

    _apiBase = 'http://localhost:3000';

    getResource = async (url) => {
        const res = await fetch(`${this._apiBase}${url}`);

        if (res.ok) {
            return await res.json();
        }

        if (res.status === 401) {
            if (await this.getRefreshToken()) {
                const res = await fetch(`${this._apiBase}${url}`);

                if (res.ok) {
                    return await res.json();
                }

                return null;
            }
        }


    }

    getRefreshToken = async () => {
        return false;
    }

    getAllPosts = async () => {
        const res = await this.getResource('/posts/');

        return res;
    }

    getAllPhotos = async () => {
        const res = await this.getResource('/posts/');

        return res.map(this._transformPosts);
    }

    _transformPosts = (post) => {
        return {
            src: post.src,
            alt: post.alt
        }
    }
}