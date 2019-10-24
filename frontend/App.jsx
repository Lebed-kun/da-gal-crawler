import React from 'react';
import axios from 'axios';

import { BASE_URL } from './constants.js';

class App extends React.Component {
    state = {
        loading : false,
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

        this.setState({
            loading : true
        })
            .then(() => {
                return axios.post(`${BASE_URL}/`, {
                    link : link
                })
            })
            .then(res => {

            })
            .catch(err => {

            })
    }

    render() {
        let content = null;
        if (this.state.loading) {
            content = <h1>Loading...</h1>
        } else {
            content = (
                <form>
                    <input name="link" value={this.state.link} />
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