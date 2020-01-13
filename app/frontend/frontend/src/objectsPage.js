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
        return true;
    }
});

const schema = yup.object({
    name: yup.string(),
});

function ObjectSearchByNameForm(props) {
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

function ObjectSearchByIdForm(props) {
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

const ObjectUpdateSchema = yup.object().shape({
    coord1: yup.number().required('Required'),
    coord2: yup.number().required('Required'),
    coord3: yup.number().required('Required')
});

class ObjectUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [
                { "name": "coord1", "text": "Coord1", "type": "number" },
                { "name": "coord2", "text": "Coord2", "type": "number" },
                { "name": "coord3", "text": "Coord3", "type": "number" }
            ]
        }
    }

    render() {
        return (
            <div>
                <h1 className="header">Updating object</h1>
                <h2 className="header">{"with name = " + this.props.item().name}</h2>
                <Formik
                    initialValues={{
                        city: this.props.item().city,
                        contry: this.props.item().country
                    }}

                    validationSchema={ObjectUpdateSchema}
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

const ObjectCreateSchema = yup.object().shape({
    name: yup.string()
        .required('Required'),
    coord1: yup.number().required('Required'),
    coord2: yup.number().required('Required'),
    coord3: yup.number().required('Required')
});

class ObjectCreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [
                { "name": "name", "text": "Name ", "type": "string" },
                { "name": "coord1", "text": "Coord1", "type": "coord1" },
                { "name": "coord2", "text": "Coord2", "type": "coord2" },
                { "name": "coord3", "text": "Coord3", "type": "coord3" }
            ]
        }
    }

    render() {
        return (
            <div>
                <h1 className="header">Object</h1>
                <Formik
                    initialValues={{
                        name: '',
                        coord1: '',
                        coord2: '',
                        coord3: ''
                    }}
                    validationSchema={ObjectCreateSchema}
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


class ObjectsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: true,
            items: [],
            count: 0,
            showCreatePopup: false,
            showUpdatePopup: false,
            updatedObject: null,
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
            updatedObject: item
        });
    }

    getCount = () => {
        return Promise.resolve(api.get('/objects/count')
            .then(res => {
                this.setState({ count: res.data.objects_count })
                return res.data.objects_count;
            },
                error => {
                    this.setState({ error })
                    return 0;
                }));
    }

    create = (object, formikBag) => {
        return Promise.resolve(api.post('/objects', object)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    this.toggleCreatePopup();
                    this.getAll();
                } else {
                    alert("Error: " + JSON.stringify(res.data));
                }
            },
                error => {
                    alert("Error: " + JSON.stringify(error, null, 2))
                    this.toggleCreatePopup();
                    return 0;
                }));
    }
    update = object => {
        object.name = this.state.updatedObject.name;
        return Promise.resolve(api.put('/objects', object)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    this.toggleUpdatePopup(null);
                    this.getAll();
                } else {
                    alert("Error: " + JSON.stringify(res.data));
                }
            },
                error => {
                    alert("Error: " + JSON.stringify(error, null, 2))
                    return 0;
                }));
    }
    delete = ({ id }) => {
        return Promise.resolve(api.delete('/objects/' + id)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    alert("Success!");

                    var pageCount = Math.round((this.state.count - 1) / this.state.itemsPerPage);
                    if (this.state.activePage === pageCount) {
                        return this.setState({
                            activePage: pageCount - 1
                        }, () => this.getAll());
                    }
                    this.getAll();
                } else {
                    alert("Error: " + JSON.stringify(res.data));
                }
            },
                error => {
                    alert("Error: " + JSON.stringify(error, null, 2))
                    return 0;
                }));
    }
    findById = () => {
        return Promise.resolve(api.get('/objects/id/' + this.state.searchValue)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    var items = [];
                    items.push(res.data.object);
                    this.setState({ items: items });
                } else {
                    this.setState({
                        items: []
                    });
                }
            },
                error => {
                    alert("Error: " + JSON.stringify(error, null, 2))
                    return 0;
                }));
    }

    findByName = () => {
        return Promise.resolve(api.get('/objects/' + this.state.searchValue)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    var items = [];
                    items.push(res.data.object);
                    this.setState({ items: items });
                } else {
                    this.setState({
                        items: []
                    });
                }
            },
                error => {
                    alert("Error: " + JSON.stringify(error, null, 2))
                    return 0;
                }));
    }


    getAll = (active) => {
        return api.get('/objects', {
            params: {
                page: (this.state.activePage + 1),
                limit: this.state.itemsPerPage
            }
        })
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.data.objects
                    });
                    this.getCount()
                    return result.data.objects;
                },
                // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                // чтобы не перехватывать исключения из ошибок в самих компонентах.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                    return [];
                }
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
                <h1 className="header">{!this.state.isLoaded ? "Загрузка" : "Objects"}</h1>
                {this.state.error ? (<div>Ошибка : {JSON.stringify(this.state.error, null, 2)}</div>) : null}
                <div style={{ margin: "auto", width: "fit-content" }}>

                    <div><label></label></div>
                    <ButtonToolbar className="custom-btn-toolbar">
                        <Button variant="success" onClick={this.toggleCreatePopup}>Create</Button>
                    </ButtonToolbar>
                    <div><label></label></div>
                    <ObjectSearchByNameForm onSubmit={this.handlSubmitSearchByName} />
                    <div><label></label></div>
                    <ObjectSearchByIdForm onSubmit={this.handlSubmitSearchById} />
                    <div><label></label></div>
                    {this.state.showUpdatePopup ?
                        <Popup
                            content={<ObjectUpdateForm onSubmit={this.update} item={() => { return this.state.updatedObject; }} />}
                            outsideAction={this.toggleUpdatePopup}
                        />
                        : null
                    }
                    {this.state.showCreatePopup ?
                        <Popup
                            content={<ObjectCreateForm onSubmit={this.create} />}
                            outsideAction={this.toggleCreatePopup}
                        />
                        : null
                    }
                    <Table striped bordered hover size="sm" variant="dark">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Name</th>
                                <th>Coord1</th>
                                <th>Coord2</th>
                                <th>Coord3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.coord1}</td>
                                    <td>{item.coord2}</td>
                                    <td>{item.coord3}</td>
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

export default ObjectsPage;