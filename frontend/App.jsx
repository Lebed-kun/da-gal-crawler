import React from 'react';
import axios from 'axios';

import { BASE_URL, VALID_URL_REGEX } from './constants.js';

class App extends React.Component {
    state = {
        loading : false,
        error : '',
        data : null,
        link : '',
        limit : 100
    }

    validateLink = value => {
        return !!value.match(VALID_URL_REGEX);
    }

    validateLimit = value => {
        return value > 0 && value <= 500;
    }

    handleChange = e => {
        let name = e.currentTarget.getAttribute('name');
        let value = e.currentTarget.value;
        this.setState({
            [name] : value
        });
    }

    handleSubmit = e => {
        e.preventDefault();

        const link = this.state.link;
        if (!this.validateLink(link)) {
            this.setState({
                error : 'Invalid link format!'
            });
            return;
        }

        const limit = +this.state.limit;
        if (!this.validateLimit(limit)) {
            this.setState({
                error : 'Limit should be greater than 0 and at most 500!'
            })
        }

        this.setState({
            loading : true
        });

        axios.post(`${BASE_URL}/download`, {
                link : link,
                limit : limit
            })
            .then(res => {
                this.setState({
                    loading : false
                });

                const downloadUri = `data:application/zip;charset=utf-8;base64,${res.data}`;
                const link = document.createElement('a');
                link.href = downloadUri;
                link.download = 'deviations.zip';
                document.body.appendChild(link);
                link.click();

                window.onfocus = function() {
                    document.body.removeChild(link);
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    loading : false,
                    error : err.message
                })
            })
    }

    reset = () => {
        this.setState({
            loading : false,
            error : '',
            data : null,
            link : '',
            limit : 100
        })
    }

    render() {
        let content = null;
        if (this.state.loading) {
            content = <h1>Loading...</h1>
        } else if (this.state.error) {
            content = (
                <div>
                    <h1 className="error">Error: "{this.state.error}" :( </h1>

                    <button onClick={this.reset} className="rounded btn-single">
                        Try again
                    </button>
                </div>
            )
        } else {
            content = (
                <div>
                    <h1>Get DA gallery/collection with just 1 click!</h1>
                
                    <form onSubmit={this.handleSubmit}>
                        <input key="link" name="link" onChange={this.handleChange} placeholder="Link to the gallery/collection"/>
                        <input key="limit" name="limit" value={this.state.limit} onChange={this.handleChange} placeholder="Max count" className="number" maxLength="4"/>

                        <button type="submit" className="rounded">
                            Go!
                        </button>
                    </form>
                </div>
            )
        }

        return (
            <>
                {content}

                <style jsx>
                    {`
                        h1 {
                            text-align : center;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        }

                        form {
                            display : flex;
                            justify-content : center;
                        }

                        input {
                            font-size : 1rem;
                            margin : 0 4px;
                        }

                        button {
                            background : #337ab7;
                            color : white;
                            border : none;
                            font-size : 1rem;
                        }

                        .btn-single {
                            align-self : center;
                        }

                        .rounded {
                            border-radius: 5px;
                            -o-border-radius: 5px;
                            -moz-border-radius: 5px;
                            -webkit-border-radius: 5px;
                        }

                        @media only screen and (min-width: 514px) {
                            .number {
                                width : 2.67rem;
                            }
                        }

                        @media only screen and (max-width: 514px) {
                            form {
                                flex-direction : column;
                            }
                        }
                    `}
                </style>
            </>
        )
    }
}

export default App;