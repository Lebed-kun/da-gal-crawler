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
        return value > 0 && value <= 1000;
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
                error : 'Invalid limit format!'
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
                console.log(res);
                this.setState({
                    loading : false
                })
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

                    <button onClick={this.reset}>
                        Try again
                    </button>
                </div>
            )
        } else {
            content = (
                <form onSubmit={this.handleSubmit}>
                    <h1>Put url of DA gallery here to get images</h1>
                    
                    <input key="link" name="link" onChange={this.handleChange} placeholder="Link to the gallery/collection" />
                    <input key="limit" name="limit" value={this.state.limit} onChange={this.handleChange} placeholder="Count"/>
                    
                    <button type="submit">
                        Go!
                    </button>
                </form>
            )
        }

        return content;
    }
}

export default App;