import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import RedirectButton from "./RedirectButton";
import InstaService from "../services/instaService";

export default class LoginForm extends Component {
    state = {
        customErrors: {},
        loginError: false
    };

    service = new InstaService();

    renderForm = props => {
        const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
        } = props;

        const renderInputFeedback = field => {
            if (errors[field] && touched[field]) {
                return (<div className="input-feedback">{errors[field]}</div>)
            }
        }

        const renderSubmitFeedback = field => {
            const customErrors = this.state.customErrors[`${field}`];
            if (customErrors && touched[field]) {
                return (<div className="input-feedback">{customErrors}</div>)
            }
        }

        const renderLabel = (field, name) => {
            return (<label htmlFor={field}>{name}</label>)
        }

        const inputClassName = field => {
            if (errors[field] && touched[field]) {
                return "error"
            }
        }

        const renderUsername = () => {
            return (
                <>
                    {renderLabel("username", "Имя пользователя")}
                    < input
                        name="username"
                        type="text"
                        placeholder="Введите имя пользователя"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClassName("username")}
                    />
                    {renderInputFeedback("username")}
                    {renderSubmitFeedback("username")}

                </>
            )
        }

        const renderPassword = () => {
            return (
                <>
                    {renderLabel("password", "Пароль")}
                    <input
                        name="password"
                        type="password"
                        placeholder="Введите пароль"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClassName("password")}
                    />
                    {renderInputFeedback("password")}
                    {renderSubmitFeedback("password")}
                </>
            )
        }

        const renderButtonGroup = () => {
            return (
                <div className="buttons">
                    <button
                        className="button__submit"
                        type="submit"
                        disabled={isSubmitting} >
                        Войти
                    </button>
                    <RedirectButton to="registration" text="Регистрация" />
                </div>
            )
        }
        return (
            <form onSubmit={handleSubmit}>
                {this.state.login && <div className="input-feedback">Не удалось войти в аккаунт. Попробуйте позже</div>}
                {renderUsername()}
                {renderPassword()}
                {renderButtonGroup()}
            </form>
        );
    }

    render() {
        const schema = Yup.object().shape({
            username: Yup.string()
                .required("Необходимо ввести логин.")
                .min(3, "Логин слишком короткий (минимум 3 символа).")
                .matches(/^[a-zA-Z_]+$/, "Логин должен содержать только латинские буквы и символ '_'."),
            password: Yup.string()
                .required("Необходимо ввести пароль.")
                .min(8, "Пароль слишком короткий (минимум 8 символов).")
                .matches(/(?=.*[0-9])/, "Пароль должен содержать хотя бы одну цифру.")
                .matches(/(?=.*[A-Za-zа-яА-Я])/, "Пароль должен содержать хотя бы одну букву.")
        });

        return (
            <div className="container form">
                <h1>Вход</h1>
                <Formik
                    initialValues={{ username: "", password: "" }}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(false);
                        this.setState({ customErrors: {} });
                        this.setState({ loginError: false });
                        let res = await this.service.login(values);
                        setSubmitting(true);
                        if (!res) {
                            this.setState({ loginError: true });
                        }
                    }}

                    validationSchema={schema}
                >
                    {this.renderForm}
                </Formik>

            </div>
        );
    }
}