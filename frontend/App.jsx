import React from 'react';
import axios from 'axios';

import { BASE_URL, VALID_URL_REGEX } from './constants.js';

class App extends React.Component {
    state = {
        loading : false,
        error : false,
        data : null,
        link : ''
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
        if (!link.match(VALID_URL_REGEX)) {
            this.setState({
                error : true
            });
            return
        }

        this.setState({
            loading : true
        });

        axios.post(`${BASE_URL}/upload`, {
                link : this.state.link
            })
            .then(res => {

            })
            .catch(err => {
                console.log(err);
                this.setState({
                    loading : false,
                    error : true
                })
            })
    }

    reset = () => {
        this.setState({
            loading : false,
            error : false,
            data : null,
            link : ''
        })
    }

    render() {
        let content = null;
        if (this.state.loading) {
            content = <h1>Loading...</h1>
        } else if (this.state.error) {
            content = (
                <div>
                    <h1 className="error">Error in retrieving images :( </h1>

                    <button onClick={this.reset}>
                        Try again
                    </button>
                </div>
            )
        } else {
            content = (
                <form onSubmit={this.handleSubmit}>
                    <h1>Put url of DA gallery here to get images</h1>
                    
                    <input name="link" onChange={this.handleChange} />
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