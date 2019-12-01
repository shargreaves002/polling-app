import React, { Component } from 'react';
import { getAllPolls, getUserCreatedPolls, getUserVotedPolls } from '../util/APIUtils';
import { castVote } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './PollList.css';
import history from "../util/history";
import Poll from "./Poll";

class PollList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false,
            gotPolls: false
        };
        this.loadPollList = this.loadPollList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !(nextState.polls === this.state.polls);
    }

    async loadPollList(page = 0, size = POLL_LIST_SIZE) {
        const makeCancelable = (promise) => {
            let hasCanceled = false;

            const wrappedPromise = new Promise((resolve, reject) => {
                promise.then(
                    val => hasCanceled ? reject({isCanceled: true}) : resolve(val),
                    error => hasCanceled ? reject({isCanceled: true}) : reject(error)
                );
            });

            return {
                promise: wrappedPromise,
                cancel() {
                    hasCanceled = true;
                },
            };
        };
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_POLLS') {
                promise = getUserCreatedPolls(this.props.username, page, size);
            } else if (this.props.type === 'USER_VOTED_POLLS') {
                promise = getUserVotedPolls(this.props.username, page, size);
            }
        } else {
            promise = getAllPolls(page, size);
        }

        if(!promise || this.state.gotPolls) {
            return;
        }

        this.setState({
            isLoading: true
        });

        const wrappedPromise = makeCancelable(promise);

        let pollResponse = null;
        let pageResponse = null;
        let sizeResponse = null;
        let totalElementsResponse = null;
        let totalPagesResponse = null;
        let lastResponse = null;
        let currentVotesResponse = null;
        let success = false;

        await wrappedPromise.promise
            .then(response => {
                const polls = this.state.polls.slice();
                const currentVotes = this.state.currentVotes.slice();

                pollResponse = polls.concat(response.content);
                pageResponse = response.page;
                sizeResponse = response.size;
                totalElementsResponse = response.totalElements;
                totalPagesResponse = response.totalPages;
                lastResponse = response.last;
                currentVotesResponse = currentVotes.concat(Array(response.content.length).fill(null));
                success = true;
            }).catch((err) => {
            console.log(err);
        });

        if (success) {
            this.setState({
                polls: pollResponse,
                page: pageResponse,
                size: sizeResponse,
                totalElements: totalElementsResponse,
                totalPages: totalPagesResponse,
                last: lastResponse,
                currentVotes: currentVotesResponse,
                isLoading: false,
                gotPolls: true
            });
        }
    }

    componentDidMount() {
        this.loadPollList();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.isAuthenticated !== this.props.isAuthenticated) {
            // Reset State
            this.setState({
                polls: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });
            this.loadPollList();
        }
    }

    handleLoadMore() {
        this.loadPollList(this.state.page + 1);
    }

    handleVoteChange(event, pollIndex) {
        const currentVotes = this.state.currentVotes.slice();
        currentVotes[pollIndex] = event.target.value;

        this.setState({
            currentVotes: currentVotes
        });
    }


    handleVoteSubmit(event, pollIndex) {
        event.preventDefault();
        if(!this.props.isAuthenticated) {
            history.push("/login");
            return;
        }

        const poll = this.state.polls[pollIndex];
        const selectedChoice = this.state.currentVotes[pollIndex];

        const voteData = {
            pollId: poll.id,
            choiceId: selectedChoice
        };

        castVote(voteData)
            .then(response => {
                const polls = this.state.polls.slice();
                polls[pollIndex] = response;
                this.setState({
                    polls: polls
                });
            }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login');
            }
        });
    }

    render() {
        const pollViews = [];
        this.state.polls.forEach((poll, pollIndex) => {
            pollViews.push(<Poll
                key={poll.id}
                poll={poll}
                currentVote={this.state.currentVotes[pollIndex]}
                isAuthenticated={this.props.isAuthenticated}
                handleVoteChange={(event) => this.handleVoteChange(event, pollIndex)}
                handleVoteSubmit={(event) => this.handleVoteSubmit(event, pollIndex)} />)
        });

        return (
            <div className="polls-container">
                {pollViews}
                {
                    !this.state.isLoading && this.state.polls.length === 0 ? (
                        <div className="no-polls-found">
                            <span>No Polls Found.</span>
                        </div>
                    ): null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-polls">
                            <button onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                 Load more
                            </button>
                        </div>): null
                }
                {
                    this.state.isLoading ?
                        <LoadingIndicator /> : null
                }
            </div>
        );
    }
}

export default withRouter(PollList);
