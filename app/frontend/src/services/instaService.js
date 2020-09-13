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

    registration = async (user, setErrors) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "username": user.username, "password": user.password });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        let res;
        try {
            res = await fetch("http://localhost:49001/api/v1/registration", requestOptions);
        } catch (err) {
            console.log(err);
        }

        if (res.ok) {
            return true;
        }

        if (res.status === 400) {
            res = await res.json();
            setErrors(res.errors);
            return true;
        }

        console.log("непонятная ошибка");
        return false;

    }

    login = async (user) => {
        console.log(user);
        this.refreshToken(user.username)
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