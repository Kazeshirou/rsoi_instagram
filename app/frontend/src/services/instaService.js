export default class InstaService {
    _apiPost = 'http://localhost:3000';
    _apiAuth = 'http://localhost:49001/api/v1';

    getUser = () => {
        return this.user;
    }

    getResource = async (url) => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('token')}`);
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const res = await fetch(url, requestOptions);

        if (res.ok) {
            return await res.json();
        }

        if (res.status === 401) {
            if (await this.tryRefreshToken()) {
                myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${localStorage.getItem('token')}`);
                requestOptions.headers = myHeaders;
                const res = await fetch(url, requestOptions);

                if (res.ok) {
                    return await res.json();
                }

                return null;
            }
        }
    }

    tryRefreshToken = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem('refreshToken')}`);
        var raw = JSON.stringify({ token: localStorage.getItem('token') });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const res = await fetch(`${this._apiAuth}/refresh`, requestOptions);
        if (res.ok) {
            const { token, refreshToken } = await res.json();

            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            return true;
        }
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return false;
    }

    postAuth = async (url, body) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(body);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return await fetch(url, requestOptions);

    }

    registration = async (user, setErrors) => {
        const res = await this.postAuth(`${this._apiAuth}/registration`, user);

        if (res.ok) {
            const { token, refreshToken } = await res.json();
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            return true;
        }

        if (res.status === 400) {
            const { errors } = await res.json();
            setErrors(errors);
            return true;
        }

        return false;

    }

    login = async (user) => {
        const res = await this.postAuth(`${this._apiAuth}/login`, user);

        if (res.ok) {
            const { token, refreshToken } = await res.json();
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            return true;
        }

        return false;
    }

    getAllPosts = async () => {
        const res = await this.getResource(`${this._apiPost}/posts/`);

        return res;
    }

    getAllPhotos = async () => {
        const res = await this.getResource(`${this._apiPost}/posts/`);

        return res.map(this._transformPosts);
    }

    _transformPosts = (post) => {
        return {
            src: post.src,
            alt: post.alt
        }
    }
}