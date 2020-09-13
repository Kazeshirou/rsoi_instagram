import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import RedirectButton from "./RedirectButton";
import InstaService from "../services/instaService";

export default class RegistationForm extends Component {
    state = {
        customErrors: {},
        registerError: false
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
            handleSubmit
        } = props;

        const renderInputFeedback = field => {
            if (errors[field] && touched[field]) {
                return (<div className="input-feedback">{errors[field]}</div>)
            }
        }

        const renderSubmitFeedback = field => {
            const errors = this.state.customErrors[`${field}`];
            if (errors && touched[field]) {
                return (<div className="input-feedback">{errors}</div>)
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

        const renderEmail = () => {
            return (
                <>
                    {renderLabel("email", "Почта")}
                    < input
                        name="email"
                        type="email"
                        placeholder="Введите почту"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClassName("email")}
                    />
                    {renderInputFeedback("email")}
                    {renderSubmitFeedback("email")}
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

        const renderPasswordConfirmation = () => {
            return (
                <>
                    {renderLabel("passwordConfirmation", "Подтверждение пароля")}
                    <input
                        name="passwordConfirmation"
                        type="password"
                        placeholder="Повторите пароль"
                        value={values.passwordConfirmation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClassName("passwordConfirmation")}
                    />
                    {renderInputFeedback("passwordConfirmation")}
                    {renderSubmitFeedback("passwordConfirmation")}
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
                        Регистрация
                    </button>
                    <RedirectButton to="/" text="Войти" />
                </div>
            )
        }

        return (
            <form onSubmit={handleSubmit}>
                {this.state.registerError && <div className="input-feedback">Не удалось зарегистрировать пользователя. Попробуйте позже</div>}
                {renderEmail()}
                {renderUsername()}
                {renderPassword()}
                {renderPasswordConfirmation()}
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
            email: Yup.string()
                .required("Необходимо ввести почту.")
                .email("Некорректный формат почтового адреса."),
            password: Yup.string()
                .required("Необходимо ввести пароль.")
                .min(8, "Пароль слишком короткий (минимум 8 символов).")
                .matches(/(?=.*[0-9])/, "Пароль должен содержать хотя бы одну цифру.")
                .matches(/(?=.*[A-Za-zа-яА-Я])/, "Пароль должен содержать хотя бы одну букву."),
            passwordConfirmation: Yup.string()
                .required("Необходимо подтвердить пароль.")
                .oneOf([Yup.ref('password')], "Пароли должны совпадать.")

        });

        return (
            <div className="container form">
                <h1>Регистрация</h1>
                <Formik
                    initialValues={{ username: "", email: "", password: "", passwordConfirmation: "" }}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(false);
                        this.setState({ customErrors: {} });
                        this.setState({ registerError: false });
                        let res = await this.service.registration(values, errors => this.setState({ customErrors: errors }));
                        setSubmitting(true);
                        if (this.state.customErrors) {
                            return;
                        }
                        if (!res) {
                            this.setState({ registerError: true });
                        }
                    }}

                    validationSchema={schema}
                >
                    {this.renderForm}
                </Formik>

            </div >
        );
    }
}