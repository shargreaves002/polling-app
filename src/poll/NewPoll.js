import React, { Component } from 'react';
import { createPoll } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPoll.css';
import {Card} from "shards-react";
import LinkButton from "../util/LinkButton";
import Select from 'react-select';
import InputGroup from 'react-bootstrap/InputGroup'

class NewPoll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {
                text: ''
            },
            choices: [{
                text: ''
            }],
            pollLength: {
                pollDays: 1,
                pollHours: 0
            }
        };
        this.addChoice = this.addChoice.bind(this);
        this.removeChoice = this.removeChoice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleChoiceChange = this.handleChoiceChange.bind(this);
        this.handlePollDaysChange = this.handlePollDaysChange.bind(this);
        this.handlePollHoursChange = this.handlePollHoursChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    addChoice() {
        const choices = this.state.choices.slice();
        this.setState({
            choices: choices.concat([{
                text: ''
            }])
        });
    }

    removeChoice(choiceNumber) {
        const choices = this.state.choices.slice();
        this.setState({
            choices: [...choices.slice(0, choiceNumber), ...choices.slice(choiceNumber+1)]
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const pollData = {
            question: this.state.question.text,
            choices: this.state.choices.map(choice => {
                return {text: choice.text}
            }),
            pollLength: {
                days: this.state.pollDays.value,
                hours: this.state.pollHours.value
            }
        };

        createPoll(pollData)
            .then(() => {
                this.props.history.push("/");
            }).catch(() => {
                this.props.handleLogout('/login');
        });
    }

    validateQuestion = (questionText) => {
        if(questionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your question!'
            }
        } else if (questionText.length > POLL_QUESTION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    };

    handleQuestionChange(event) {
        const value = event.target.value;
        this.setState({
            question: {
                text: value,
                ...this.validateQuestion(value)
            }
        });
    }

    validateChoice = (choiceText) => {
        if(choiceText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a choice!'
            }
        } else if (choiceText.length > POLL_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    };

    handleChoiceChange(event, index) {
        const choices = this.state.choices.slice();
        const value = event.target.value;

        choices[index] = {
            text: value,
            ...this.validateChoice(value)
        };

        this.setState({
            choices: choices
        });
    }


    handlePollDaysChange(value) {
        this.setState({
            pollDays: value
        });
    }

    handlePollHoursChange(value) {
        this.setState({
            pollHours: value
        });
    }

    isFormInvalid() {
        if(this.state.question.validateStatus !== 'success') {
            return true;
        }

        for(let i = 0; i < this.state.choices.length; i++) {
            const choice = this.state.choices[i];
            if(choice.validateStatus !== 'success') {
                return true;
            }
        }
    }

    render() {
        const choiceViews = [];
        this.state.choices.forEach((choice, index) => {
            choiceViews.push(<PollChoice key={index} choice={choice} choiceNumber={index} removeChoice={this.removeChoice} handleChoiceChange={this.handleChoiceChange}/>);
        });

        return (
            <Card className={"new-poll-container text-center"}>
                <h5 className="card-header">Create a poll.</h5>
                <div className="card-body">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group col">
                            <label className={"w-100"}>Enter your question.
                                <input type="text" name="question" className="form-control w-100" value={this.state.question.text || ''} onChange={this.handleQuestionChange} />
                            </label>
                        </div>
                        {choiceViews}
                        <button type="button" className={"btn btn-outline-secondary"} onClick={this.addChoice} disabled={this.state.choices.length === MAX_CHOICES}>
                            Add a choice
                        </button>
                        <div className={"form-group col"}>
                            <label>Poll length:</label>
                            <span className={"mr-2"}>
                                <Select
                                    name="pollDays"
                                    onChange={this.handlePollDaysChange}
                                    value={this.state.pollDays || 1}
                                    options={[{ value: 0, label: '0' },
                                        { value: 1, label: '1' },
                                        { value: 2, label: '2' },
                                        { value: 3, label: '3' },
                                        { value: 4, label: '4' },
                                        { value: 5, label: '5' },
                                        { value: 6, label: '6' },
                                        { value: 7, label: '7' }]} /> &nbsp;Days
                            </span>
                            <span>
                                <Select
                                    name={"pollHours"}
                                    onChange={this.handlePollHoursChange}
                                    value={this.state.pollHours || 0}
                                    options={[{ value: 0, label: '0' },
                                        { value: 1, label: '1' },
                                        { value: 2, label: '2' },
                                        { value: 3, label: '3' },
                                        { value: 4, label: '4' },
                                        { value: 5, label: '5' },
                                        { value: 6, label: '6' },
                                        { value: 7, label: '7' },
                                        { value: 8, label: '8' },
                                        { value: 9, label: '9' },
                                        { value: 10, label: '10' },
                                        { value: 11, label: '11' },
                                        { value: 12, label: '12' },
                                        { value: 13, label: '13' },
                                        { value: 14, label: '14' },
                                        { value: 15, label: '15' },
                                        { value: 16, label: '16' },
                                        { value: 17, label: '17' },
                                        { value: 18, label: '18' },
                                        { value: 19, label: '19' },
                                        { value: 20, label: '20' },
                                        { value: 21, label: '21' },
                                        { value: 22, label: '22' },
                                        { value: 23, label: '23' }]} /> &nbsp;Hours
                            </span>
                        </div>
                        <div className=" text-center">
                            <button className=" btn btn-primary mr-1" type={"submit"} value={"Submit"}>Create Poll</button>
                            <LinkButton className="btn btn-secondary ml-1" to={'/'}>Back</LinkButton>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    {this.state.message}
                </div>
            </Card>
        );
    }
}

function PollChoice(props) {
    return (
        <div className="poll-form-row">

            {
                props.choiceNumber <= 1 ? (
                    <label className={"w-100"}>Choice {props.choiceNumber + 1}
                        <input
                            placeholder = {'Choice ' + (props.choiceNumber + 1)}
                            size="large"
                            value={props.choice.text || ''}
                            className={ props.choiceNumber > 1 ? "optional-choice w-100 form-control": "w-100 form-control"}
                            onChange={(event) => props.handleChoiceChange(event, props.choiceNumber)} />
                    </label>
                     ): (<label className={"w-100"}>Choice {props.choiceNumber + 1}
                             <InputGroup>
                             <input
                                placeholder = {'Choice ' + (props.choiceNumber + 1)}
                                size="large"
                                value={props.choice.text || ''}
                                className={ props.choiceNumber > 1 ? "w-100 form-control mx-0": "w-100 form-control mx-0"}
                                onChange={(event) => props.handleChoiceChange(event, props.choiceNumber)} />
                                <InputGroup.Append>
                                    <button
                                        className="btn btn-outline-secondary mx-0"
                                        type="button"
                                        disabled={props.choiceNumber <= 1}
                                        onClick={() => props.removeChoice(props.choiceNumber)}
                                        >
                                            X
                                    </button>
                                </InputGroup.Append>
                             </InputGroup>
                         </label>)
            }
        </div>
    );
}


export default NewPoll;
