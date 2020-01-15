import React from 'react';
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import ReactPaginate from 'react-paginate';

import axios from "axios";

import Popup from "./popup";

import './App.css';

const api = axios.create({
    baseURL: "http://localhost:49001/api/v1/",
    responseType: "json",
    validateStatus: (status) => {
        return status !== 424 && status !== 501;
    }
});

const schema = yup.object({
    name: yup.string(),
});

function TelescopeSearchByNameForm(props) {
    return (
        <Formik
            validationSchema={schema}
            onSubmit={props.onSubmit}
            initialValues={{
                name: ""
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
                            <Form.Group as={Col} md="6" controlId="validationFormik03">
                                <Form.Control
                                    type="text"
                                    placeholder="name"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.name}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Button type="submit">Search by name</Button>
                    </Form>
                )}
        </Formik>
    );
}

const schema1 = yup.object({
    name: yup.number().min(1),
});

function TelescopeSearchByIdForm(props) {
    return (
        <Formik
            validationSchema={schema1}
            onSubmit={props.onSubmit}
            initialValues={{
                name: ""
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
                            <Form.Group as={Col} md="6" controlId="validationFormik04">
                                <Form.Control
                                    type="number"
                                    name="name"
                                    placeholder='id'
                                    value={values.name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.name}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Button type="submit">Search by id</Button>
                    </Form>
                )}
        </Formik>
    );
}

class TelescopeUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [
                { "name": "city", "text": "City", "type": "string" },
                { "name": "country", "text": "Country", "type": "string" }
            ]
        }
    }

    render() {
        return (
            <div>
                <h1 className="header">Updating telescope</h1>
                <h2 className="header">{"with name = " + this.props.item().name}</h2>
                <Formik
                    initialValues={{
                        city: this.props.item().city,
                        country: this.props.item().country
                    }}
                    onSubmit={this.props.onSubmit}
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
                                <div style={{ margin: "auto", width: "fit-content" }}>
                                    {this.state.fields.map(field =>
                                        <div>
                                            <div><label htmlFor={field.name}>{field.text}</label></div>
                                            {errors[field.name] && touched[field.name] ? (
                                                <div>{errors[field.name]}</div>
                                            ) : null}
                                            <Field name={field.name} type={field.type} />
                                        </div>
                                    )}
                                    <div><label ></label></div>
                                    <Button type="submit" variant="success" block>Update</Button>
                                </div>
                            </Form>
                        )}
                </Formik>
            </div>
        );
    }
}

const TelescopeCreateSchema = yup.object().shape({
    name: yup.string()
        .required('Required')
});

class TelescopeCreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [
                { "name": "name", "text": "Name ", "type": "string" },
                { "name": "city", "text": "City", "type": "string" },
                { "name": "country", "text": "Country", "type": "string" }
            ]
        }
    }

    render() {
        return (
            <div>
                <h1 className="header">Telescope</h1>
                <Formik
                    initialValues={{
                        name: '',
                        city: '',
                        contry: ''
                    }}
                    validationSchema={TelescopeCreateSchema}
                    onSubmit={this.props.onSubmit}
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
                            <Form Form noValidate onSubmit={handleSubmit}>
                                <div style={{ margin: "auto", width: "fit-content" }}>
                                    {this.state.fields.map(field =>
                                        <div>
                                            <div><label htmlFor={field.name}>{field.text}</label></div>
                                            {errors[field.name] && touched[field.name] ? (
                                                <div>{errors[field.name]}</div>
                                            ) : null}
                                            <Field name={field.name} type={field.type} />
                                        </div>
                                    )}
                                    <div><label ></label></div>
                                    <Button type="submit" variant="success" block>Create</Button>
                                </div>
                            </Form>
                        )}
                </Formik>
            </div>
        );
    }
}


class TelescopesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            count: 0,
            showCreatePopup: false,
            showUpdatePopup: false,
            updatedTelescope: null,
            activePage: 0,
            itemsPerPage: 2,
            searching: false,
            searchBy: "",
            searchValue: ""
        };
    }

    toggleCreatePopup = () => {
        this.setState({
            showCreatePopup: !this.state.showCreatePopup
        });
    }

    toggleUpdatePopup = (item) => {
        this.setState({
            showUpdatePopup: !this.state.showUpdatePopup,
            updatedTelescope: item
        });
    }

    getCount = () => {
        return Promise.resolve(api.get('/telescopes/count')
            .then(res => {
                this.setState({ count: res.data.telescopes_count })
                return res.data.telescopes_count;
            },
                error => alert("Ошибка загрузки данных."))
        );
    }

    create = (telescope, formikBag) => {
        return Promise.resolve(api.post('/telescopes', telescope)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    this.toggleCreatePopup();
                    this.getAll();
                } else {
                    alert(`Error: ${JSON.stringify(res.data.message)}`);
                }
            },
                error => alert("Ошибка загрузки данных."))
        );
    }
    update = telescope => {
        telescope.name = this.state.updatedTelescope.name;
        return Promise.resolve(api.put('/telescopes', telescope)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    this.toggleUpdatePopup(null);
                    this.getAll();
                } else {
                    alert(`Error: ${JSON.stringify(res.data.message)}`);
                }
            },
                error => alert("Ошибка загрузки данных."))
        );
    }
    delete = ({ id }) => {
        return Promise.resolve(api.delete('/telescopes/' + id)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    alert("Success!");

                    var pageCount = 0;
                    if (this.state.count > 3) {
                        pageCount = Math.round((this.state.count - 3) / this.state.itemsPerPage);
                    }

                    if (this.state.activePage > pageCount) {
                        return this.setState({
                            activePage: pageCount
                        }, () => this.getAll());
                    }
                    this.getAll();
                } else {
                    alert(`Error: ${JSON.stringify(res.data.message)}`);
                }
            },
                error => alert("Ошибка загрузки данных."))
        );
    }
    findById = () => {
        return Promise.resolve(api.get('/telescopes/id/' + this.state.searchValue)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    var items = [];
                    items.push(res.data.telescope);
                    this.setState({ items: items });
                } else {
                    this.setState({
                        items: []
                    });
                }
            },
                error => alert("Ошибка загрузки данных."))
        );
    }

    findByName = () => {
        return Promise.resolve(api.get('/telescopes/' + this.state.searchValue)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    var items = [];
                    items.push(res.data.telescope);
                    this.setState({ items: items });
                } else {
                    this.setState({
                        items: []
                    });
                }
            },
                error => alert("Ошибка загрузки данных."))
        );
    }


    getAll = (active) => {
        return api.get('/telescopes', {
            params: {
                page: this.state.activePage < 0 ? 0 : this.state.activePage,
                limit: this.state.itemsPerPage
            }
        })
            .then(
                (result) => {
                    this.setState({
                        items: result.data.telescopes ? result.data.telescopes : []
                    });
                    this.getCount()
                    return result.data.telescopes;
                },
                // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                // чтобы не перехватывать исключения из ошибок в самих компонентах.
                error => alert("Ошибка загрузки данных.")
        );
    }

    componentDidMount() {
        this.getAll();
    }

    searchClick = () => {
        this.setState({
            searching: !this.state.searching
        });
    }

    handlePageClick = data => {
        this.setState({
            "activePage": data.selected
        }, () => {
            this.getAll();
        })
    };

    handlSubmitSearchByName = data => {
        if (!data.name) {
            return this.getAll();
        }
        this.setState({
            searchValue: data.name
        }, () => { this.findByName(); })
    }

    handlSubmitSearchById = data => {
        if (!data.name) {
            return this.getAll();
        }
        this.setState({
            searchValue: data.name
        }, () => { this.findById(); })
    }

    render() {
        return (
            <div>
                <h1 className="header">Telescopes </h1>
                <div style={{ margin: "auto", width: "fit-content" }}>

                    <div><label></label></div>
                    <ButtonToolbar className="custom-btn-toolbar">
                        <Button variant="success" onClick={this.toggleCreatePopup}>Create</Button>
                    </ButtonToolbar>
                    <div><label></label></div>
                    <TelescopeSearchByNameForm onSubmit={this.handlSubmitSearchByName} />
                    <div><label></label></div>
                    <TelescopeSearchByIdForm onSubmit={this.handlSubmitSearchById} />
                    <div><label></label></div>
                    {this.state.showUpdatePopup ?
                        <Popup
                            content={<TelescopeUpdateForm onSubmit={this.update} item={() => { return this.state.updatedTelescope; }} />}
                            outsideAction={this.toggleUpdatePopup}
                        />
                        : null
                    }
                    {this.state.showCreatePopup ?
                        <Popup
                            content={<TelescopeCreateForm onSubmit={this.create} />}
                            outsideAction={this.toggleCreatePopup}
                        />
                        : null
                    }
                    <Table striped bordered hover size="sm" variant="dark">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Name</th>
                                <th>Country</th>
                                <th>City</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.country}</td>
                                    <td>{item.city}</td>
                                    <td><Button variant="success" onClick={() => this.toggleUpdatePopup(item)} >Update</Button></td>
                                    <td><Button variant="danger" onClick={() => this.delete(item)}>Delete</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className='react-paginate'>
                        <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            pageCount={Math.round(this.state.count / this.state.itemsPerPage)}
                            activePage={this.activePage}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            activeClassName={'active'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            containerClassName={'pagination'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                        />
                    </div>
                </div>

            </div>
        );
    }
}

export default TelescopesPage;