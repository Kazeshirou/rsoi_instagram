import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import InstaService from "../services/instaService";

export default class EditProfileForm extends Component {
    state = {
        customErrors: {},
        succes: false,
        serverError: false
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

        const renderEmail = () => {
            return (
                <>
                    {renderLabel("email", "Почта")}
                    < input
                        name="email"
                        type="email"
                        placeholder="Введите почту"
                        value={values.email || this.props.email || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClassName("email")}
                    />
                    {renderInputFeedback("email")}
                    {renderSubmitFeedback("email")}
                </>
            )
        }

        const renderAge = () => {
            return (
                <>
                    {renderLabel("age", "Возраст")}
                    <input
                        name="age"
                        type="number"
                        value={values.age || this.props.user.age || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClassName("age")}
                    />
                    {renderInputFeedback("age")}
                    {renderSubmitFeedback("age")}
                </>
            )
        }

        const renderBio = () => {
            return (
                <>
                    {renderLabel("bio", "Био")}
                    <input
                        name="bio"
                        type="text"
                        value={values.bio || this.props.user.bio || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClassName("bio")}
                    />
                    {renderInputFeedback("bio")}
                    {renderSubmitFeedback("bio")}
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
                        Изменить
                    </button>
                </div>
            )
        }

        return (
            <form onSubmit={handleSubmit}>
                {this.state.serverError && <div className="input-feedback-big">Не удалось обновить данные профиля. Попробуйте позже</div>}
                {this.state.succes && <h2>Успех!</h2>}
                {/* {renderEmail()} */}
                {renderAge()}
                {renderBio()}
                {renderButtonGroup()}
            </form>
        );
    }

    render() {
        const schema = Yup.object().shape({
            // email: Yup.string()
            //     .required("Необходимо ввести почту.")
            //     .email("Некорректный формат почтового адреса."),
            age: Yup.number(),
            bio: Yup.string().max(3000, "Слишком много символов. Сократите до 3000.")

        });

        const { /*email,*/ age, bio } = this.props.user;
        return (
            <div className="container form">
                <h1>Изменение профиля</h1>
                <Formik
                    initialValues={{ /*email: email ? email : "",*/ age: age ? age : "", bio: bio ? bio : "" }}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(false);
                        this.setState({ customErrors: {} });
                        this.setState({ serverError: false });
                        let res = await this.service.updateProfile(values, errors => this.setState({ customErrors: errors }));
                        setSubmitting(true);
                        if (!res) {
                            this.setState({ serverError: true, succes: false });
                        } else {
                            this.setState({ succes: true })
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