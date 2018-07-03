import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled, { injectGlobal } from 'styled-components'
import fetch from 'isomorphic-fetch'

import { summaryDonations } from './helpers'


import CharityCard from './components/CharityCard'
import axios from 'axios';

injectGlobal`
  body {
    font-family: 'Raleway', sans-serif !important;
    margin: 0;
  }

  #root, body {
    min-height: 100vh;
  }

  p {
    margin: 0;
  }

  h1 {
    color: rgb(91,96,117);
    margin-top: 0;
  }
`

const Wrapper = styled.div`
  width: 960px;
  margin: 0 auto;
  text-align: center;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
`

export default connect((state) => state)(
  class App extends Component {
    constructor(props) {
      super();

      this.state = {
        charities: [],
        selectedAmount: 10,
        // activeCharityId: null,
      };
    }

    async componentDidMount() {
      const { data: charities } = await axios.get('http://localhost:3001/charities')
      const { data: payments } = await axios.get('http://localhost:3001/payments')
      
      this.setState({ charities })
      this.props.dispatch({
        type: 'UPDATE_TOTAL_DONATE',
        amount: summaryDonations(payments.map(payment => payment.amount)),
      })
    }


    handlePay = async (charitiesId, currency) => {
      const amount = this.state.selectedAmount

      await axios.post('http://localhost:3001/payments', {
        charitiesId, 
        amount, 
        currency,
      })

      this.props.dispatch({
        type: 'UPDATE_TOTAL_DONATE',
        amount,
      });
      this.props.dispatch({
        type: 'UPDATE_MESSAGE',
        message: `Thanks for donate ${amount}!`,
      });

      setTimeout(() => {
        this.props.dispatch({
          type: 'UPDATE_MESSAGE',
          message: '',
        });
      }, 2000);
    }

    renderCards = () => this.state.charities.map((charity) => {
      const payments = [10, 20, 50, 100, 500].map((amount, j) => (
        <label key={j}>
          <input
            type="radio"
            name="payment"
            // checked={this.state.selectedAmount === 10}
            onClick={() => {
              this.setState({ selectedAmount: amount })
            }} /> {amount}
        </label>
      ));

      return (
        <CharityCard
          key={charity.id}
          charity={charity} 
          payments={payments}
          handlePay={this.handlePay}
        />
      );
    });
  

    render() {
      const style = {
        color: 'red',
        margin: '1em 0',
        fontWeight: 'bold',
        fontSize: '16px',
        textAlign: 'center',
      };
      const donate = this.props.donate;
      const message = this.props.message;

      return (
        <Wrapper>
          <h1>Tamboon React</h1>
          <p>All donations: {donate}</p>
          <p style={style}>{message}</p>
          <CardGrid>
            {this.renderCards()}
          </CardGrid>
        </Wrapper>
      );
    }
  }
);

function handlePay(id, amount, currency) {
  const self = this;
  return function() {
    fetch('http://localhost:3001/payments', {
      method: 'POST',
      body: `{ "charitiesId": ${id}, "amount": ${amount}, "currency": "${currency}" }`,
    })
      .then(function(resp) { return resp.json(); })
      .then(function() {
        self.props.dispatch({
          type: 'UPDATE_TOTAL_DONATE',
          amount,
        });
        self.props.dispatch({
          type: 'UPDATE_MESSAGE',
          message: `Thanks for donate ${amount}!`,
        });

        setTimeout(function() {
          self.props.dispatch({
            type: 'UPDATE_MESSAGE',
            message: '',
          });
        }, 2000);
      });
  }
}
