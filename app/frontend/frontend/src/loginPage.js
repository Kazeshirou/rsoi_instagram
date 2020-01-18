import React from 'react';
import { Formik} from 'formik';
import * as yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import axios from "axios";

import './App.css';

const api = axios.create({
    baseURL: "http://localhost:49005/api/v1",
    responseType: "json",
    validateStatus: (status) => {
        return status !== 424 && status !== 501;
    }
});

const authorize = axios.create({
    baseURL: `http://localhost:49005/api/v1/oauth2/authorize?client_id=telescopes&response_type=code&redirect_uri=http://localhost:3000/login`,
    validateStatus: (status) => {
        return status !== 424 && status !== 501;
    }
});


const token = axios.create({
    baseURL: `http://localhost:49005/api/v1/oauth2/token`,
    responseType: "json",
    validateStatus: (status) => {
        return status !== 424 && status !== 501;
    }
});

const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required().min(6)
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function LoginForm(props) {
    return (
        <Formik
            validationSchema={schema}
            onSubmit={props.onSubmit}
            initialValues={{
                username: "",
                password: ""
            }}
        >
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors,
            }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group controlId="validationUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    placeholder='username'
                                    value={values.username}
                                    onChange={handleChange}
                                    isInvalid={!!errors.username}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.username}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group controlId="validationPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="password"
                                    placeholder='password'
                                    value={values.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        
                        <Button type="submit">Log in</Button>
                    </Form>
                )}
        </Formik>
    );
}

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            html: null
        }
    }

    login = (user) => {
        return Promise.resolve(api.get('/login', {
            auth: { username: user.username, password: user.password }
        })
            .then(res => {
                if (res.status === 200) {
                    return authorize.get('', {
                        auth: { username: user.username, password: user.password }
                    })
                        .then(res => {
                            if (res.status === 200) {
                                this.props.login({ username: user.username, password: user.password })
                                this.setState({
                                    html: res.data
                                });
                            }
                        },
                        error => alert("Не удалось запросить форму согласия на получение доступа приложения Telescopes к Вашему аккаунту."))
                } else {
                    alert("Неверные пароль или логин.")
                }
            },
                error => alert("Ошибка загрузки данных."))
        );
    }
    


    componentDidMount() {
        if (this.state.token) {
            return;
        }
        var code = getParameterByName('code');
        if (!code) {
            return;
        }
        token.post('/', { client_id: 'telescopes', client_secret: '654321', grant_type: 'authorization_code', code: code, redirect_uri: 'http://localhost:3000/login' })
            .then(res => {
                if (res.status === 200) {
                    this.props.token(res.data.access_token);
                    return;
                }
                else {
                    return;
                }
            })
    }
    
    render() {
        if (this.state.html) {
            return <div dangerouslySetInnerHTML={{ __html: this.state.html}} ></div>;
        }
        var pageBody = (
            <div>
                <h1 className="header">Log in</h1>
                <div style={{ margin: "auto", width: "fit-content" }}>
                    <div><label></label></div>
                    <LoginForm onSubmit={this.login} />
                    <div><label></label></div>
                </div>
            </div>
        );
        return this.props.user() ? null : pageBody;
    }
}

export default LoginPage;