import React from 'react';
import {expect} from 'chai';
import {
    renderIntoDocument,
    findRenderedComponentWithType,
    scryRenderedComponentsWithType
}  from 'react-addons-test-utils';
import {List, fromJS} from 'immutable'

import Table from '../../src/components/Table';
import Buttons from '../../src/components/Buttons';
import Player from '../../src/components/Player'
import cards from '../../src/data/cards';
import {getScores} from '../../src/utilities/functions'

describe('Table', () => {

    it('has one Buttons component', () => {
        let deal = () => {};
        let component = renderIntoDocument(
            <Table turn="dealer" deal={deal} />
        );
        let buttons = findRenderedComponentWithType(component, Buttons);
        expect(buttons.props.turn).to.equal('dealer');
        expect(buttons.props.deal).to.equal(deal);
    });

    it('has two Player components', () => {
        let component = renderIntoDocument(
            <Table turn={null} />
        );
        let players = scryRenderedComponentsWithType(component, Player);
        expect(players.length).to.equal(2);
        expect(component.refs.dealer.props.isDealer).to.equal(true);
        expect(component.refs.player.props.isDealer).to.equal(false);
    });

    it('has scores', () => {
        let aceOfClubs = 0;
        let sixOfSpades = 44;
        let player = List([aceOfClubs, sixOfSpades])
        let component = renderIntoDocument(
            <Table turn="player" player={player} deck={cards} />
        );
        expect(getScores(cards, player)).to.equal(fromJS([7, 17]))
    })

    it('display 21 as a single score', () => {
        let aceOfClubs = 0;
        let tenOfSpades = 48;
        let player = List([aceOfClubs, tenOfSpades])
        let component = renderIntoDocument(
            <Table turn="player" player={player} deck={cards} />
        );
        expect(getScores(cards, player)).to.equal(fromJS([21]))
    })

    it('player score displays PUSH after a tie', () => {
        let aceOfClubs = 0;
        let sixOfClubs = 5;
        let aceOfSpades = 39
        let sixOfSpades = 44;
        let player = List([aceOfClubs, sixOfSpades])
        let dealer = List([aceOfSpades, sixOfClubs])
        let component = renderIntoDocument(
            <Table turn="fini" player={player} deck={cards} dealer={dealer}/>
        );
        expect(component.getPlayerScores(cards, player)).to.equal(fromJS(['PUSH']))
    })
    it('player score displays LOSE after a loss', () => {
        let aceOfClubs = 0;
        let sixOfClubs = 5;
        let tenOfClubs = 9
        let aceOfSpades = 39
        let fiveOfSpades = 43;
        let sevenOfSpades = 45;
        let player = List([tenOfClubs, fiveOfSpades, sevenOfSpades])
        let dealer = List([aceOfClubs, sixOfClubs])
        let component = renderIntoDocument(
            <Table turn="fini" player={player} deck={cards} dealer={dealer}/>
        );
        expect(component.getPlayerScores(cards, player)).to.equal(fromJS(['LOSE']))

        player = List([tenOfClubs, fiveOfSpades])
        dealer = List([aceOfClubs, sixOfClubs])
        component = renderIntoDocument(
            <Table turn="fini" player={player} deck={cards} dealer={dealer}/>
        );
        expect(component.getPlayerScores(cards, player)).to.equal(fromJS(['LOSE']))
    })
    it('player score displays WIN after a win', () => {
        let aceOfClubs = 0;
        let sixOfClubs = 5;
        let tenOfClubs = 9
        let aceOfSpades = 39
        let fiveOfSpades = 43;
        let sevenOfSpades = 45;
        let dealer = List([tenOfClubs, fiveOfSpades, sevenOfSpades])
        let player = List([aceOfClubs, sixOfClubs])
        let component = renderIntoDocument(
            <Table turn="fini" player={player} deck={cards} dealer={dealer}/>
        );
        expect(component.getPlayerScores(cards, player)).to.equal(fromJS(['WIN']))

        dealer = List([tenOfClubs, fiveOfSpades])
        player = List([aceOfClubs, sixOfClubs])
        component = renderIntoDocument(
            <Table turn="fini" player={player} deck={cards} dealer={dealer}/>
        );
        expect(component.getPlayerScores(cards, player)).to.equal(fromJS(['WIN']))
    })

    it('does not have scores > 21', () => {
        let aceOfClubs = 0;
        let sixOfSpades = 44;
        let sevenOfSpades = 45;
        let player = List([aceOfClubs, sixOfSpades, sevenOfSpades])
        let component = renderIntoDocument(
            <Table turn="player" player={player} deck={cards} />
        );
        expect(getScores(cards, player)).to.equal(fromJS([14]))
    })

    it('busts with minimum score > 21', () => {
        let nineOfClubs = 8;
        let sixOfSpades = 44;
        let sevenOfSpades = 45;
        let player = List([nineOfClubs, sixOfSpades, sevenOfSpades])
        let component = renderIntoDocument(
            <Table turn="player" player={player} deck={cards} />
        );
        expect(getScores(cards, player)).to.equal(fromJS(['BUST']))
    })

    it('does not have score > 21', () => {
        let aceOfClubs = 0;
        let sixOfSpades = 44;
        let sevenOfSpades = 45;
        let player = List([aceOfClubs, sixOfSpades, sevenOfSpades])
        let component = renderIntoDocument(
            <Table turn="player" player={player} deck={cards} />
        );
        expect(getScores(cards, player)).to.equal(fromJS([14]))
    })

})