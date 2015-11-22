import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux'

import Card from './Card';
import Button from './Button';

class Blackjack extends Component {

    getCards() {
        return this.props.cards;
    }

    showButtons() {
        switch (this.props.turn) {
            case null:
                return ['deal'];
            case 'player':
                return ['hit', 'stay'];
            default:
                return ['hit', 'deal', 'stay'];
        }
    }

    render() {
        return <div>
            <ReactCSSTransitionGroup transitionName="fade"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                {this.showButtons().map((text) => {
                    return <Button key={text} text={text}/>
                })}
            </ReactCSSTransitionGroup>
            {this.getCards().map(card =>
                <ReactCSSTransitionGroup   key={card.id}
                          transitionName="fadein"
                          transitionAppear={true}
                          transitionAppearTimeout={500}
                          transitionEnter={false}
                          transitionLeave={false}>
                    <Card key={card.id} {...card} />
                </ReactCSSTransitionGroup>
            )}
        </div>;
    }
}

function select(state) {
    return {
        turn: state.get('turn'),
        cards: state.get('deck')
    }
}

Blackjack.defaultProps = {
    cards: []
};

export default connect(select)(Blackjack)