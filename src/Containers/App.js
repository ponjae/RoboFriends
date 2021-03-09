import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardList from '../Components/CardList';
import SearchBox from '../Components/SearchBox';
import Scroll from '../Components/Scroll';
import ErrorBoundary from '../Components/ErrorBoundary';
import './App.css';
import { setSearchField, requestRobots } from '../actions';

const mapStateToProps = state => {
    return {
        searchField: state.searchRobots.searchField,
        robots : state.requestRobots.robots,
        isPending : state.requestRobots.isPending,
        error : state.requestRobots.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSearchChange: (event) => dispatch(setSearchField(event.target.value)),
        onRequestRobots: () => dispatch(requestRobots())
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            robots: [],
            email: '',
            name: '',
            id: 11
        };
    }


    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(users => this.setState({ robots: users }));
    }

    handleNameChange = (e) => {
        this.setState({ name: e.target.value });
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    }


    onSubmit = (e) => {
        this.setState({ id: this.state.id + 1 });
        let obj = {
            "name": this.state.name,
            "id": this.state.id,
            "email": this.state.email
        }

        this.setState({
            robots: [...this.state.robots, obj]
        });

        e.preventDefault();
        this.setState({
            "name": '',
            "email": ''
        })
    }

    render() {
        const { robots } = this.state;
        const {searchField, onSearchChange} = this.props;
        const filteredRobots = robots.filter(robot => {
            return robot.name.toLowerCase().includes(searchField.toLowerCase())
        });
        return !robots.length ?
            <h1 className='tc'>Loading</h1> :
            (
                <div className='tc'>
                    <h1 className='f1'>RoboFriends</h1>
                    <SearchBox searchChange={onSearchChange} />
                    <form onSubmit={this.onSubmit}>
                        <input type='text' className='pa3 ba b--green bg-lightest-blue' required id='nameField' value={this.state.name} onChange={this.handleNameChange} placeholder='Enter your name' />
                        <input type='text' className='pa3 ba b--green bg-lightest-blue' required id='emailField' value={this.state.email} onChange={this.handleEmailChange} placeholder='Enter your email' />
                        <input type="submit" className='pa3 ba b--green bg-lightest-blue' value="Submit" />
                    </form>
                    <Scroll>
                        <ErrorBoundary>
                            <CardList robots={filteredRobots} />
                        </ErrorBoundary>
                    </Scroll>
                </div>
            );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
