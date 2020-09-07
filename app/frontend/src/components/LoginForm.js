import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

export default class LoginForm extends Component {
    renderForm = props => {
        const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
        } = props;

        const renderInputFeedback = field => {
            if (errors[field] && touched[field]) {
                return (<div className="input-feedback">{errors[field]}</div>)
            }
        }

        const renderLabel = name => {
            return (<label htmlFor="username">{name}</label>)
        }

        const inputClassName = field => {
            if (errors[field] && touched[field]) {
                return "error"
            }
        }

        const renderUsername = () => {
            return (
                <>
                    {renderLabel("Имя пользователя")}
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
                </>
            )
        }

        const renderPassword = () => {
            return (
                <>
                    {renderLabel("Пароль")}
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
                    <button
                        type="button">
                        Регистрация
                    </button>
                </div>
            )
        }
        return (
            <form onSubmit={handleSubmit}>
                {renderUsername()}
                {renderPassword()}
                {renderButtonGroup()}
            </form>
        );
    }

    render() {
        const schema = Yup.object().shape({
            username: Yup.string()
                .required("Необходимо ввести логин")
                .min(3, "Логин слишком короткий (минимум 3 символа)")
                .matches(/^[a-zA-Z_]+$/, "Логин должен содержать только латинские буквы и символ '_'"),
            password: Yup.string()
                .required("Необходимо ввести пароль")
                .min(8, "Пароль слишком короткий (минимум 8 символов)")
                .matches(/(?=.*[0-9])/, "Password must contain a number.")
        });

        return (
            <div className="container form">
                <Formik
                    initialValues={{ username: "", password: "" }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            console.log("Logging in", values);
                            setSubmitting(false);
                        }, 500);
                    }}

                    validationSchema={schema}
                >
                    {this.renderForm}
                </Formik>

            </div>
        );
    }
}