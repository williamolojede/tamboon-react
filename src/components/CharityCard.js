import React, { Component } from 'react'
import styled from 'styled-components'

const Card = styled.div`
  box-shadow: 0 3px 7px 2px #ccc;
  border-radius: 5px;
  position: relative;

  p, label {
    /* color: rgb(87,96,113); */
    font-family: 'Raleway',sans-serif;
    font-weight: 500;
  }
  p, label, i {
    color: rgb(87,96,113);
  }
`

const CardImage = styled.img`
  height: 200px;
  width: 100%;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`

const CardDonatePrices = styled.div`
  display: flex;
  margin: 25px 0;

  label {
    &:not(:last-of-type) {
      margin-right: 10px;
    }
  }
`

const CardCta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
`

const CardDonate = styled.div`
  display: ${props => props.show ? 'flex': 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255,.98);
`

const Button = styled.button`
  border: 1px solid rgb(32,62,211);
  color: rgb(32,62,211);
  font-family: 'Raleway',sans-serif;
  font-weight: 500;
  font-size: 15px;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  outline: none;
`

const CloseDonationButton = styled.button`
  position: absolute;
  top: 30px;
  right: 15px;
  padding: 0;
  border: 0;
  outline: 0;
  cursor: pointer;
`


class CharityCard extends Component {
  state = {
    showDonate: false,
  }

  toggleCardDonation = () => {
    this.setState({
      showDonate: !this.state.showDonate,
    })
  }

  render() {
    const {
      charity, 
      payments, 
      handlePay, 
      index,
    } = this.props

    const {
      showDonate,
    } = this.state

    return (
      <Card>
        <CardImage 
          src={`/images/${charity.image}`} 
          alt={charity.name}
        />
        <CardCta>
          <p>{charity.name}</p>
          <Button
            onClick={this.toggleCardDonation}
          >Donate</Button>
        </CardCta>
        <CardDonate show={showDonate}>
          <p>Select the amount to donate(USD)</p>
          <CloseDonationButton
            onClick={this.toggleCardDonation}
          >
            <i className="fas fa-times fa-2x"></i>
          </CloseDonationButton>
          <CardDonatePrices>
            {payments}
          </CardDonatePrices>
          <Button 
            onClick={() => handlePay(charity.id, charity.currency)}
            // onClick={handlePay.call(
            //   this,
            //   charity.id,
            //   this.state.selectedAmount, 
            //   charity.currency
            // )}
          >Pay</Button>
        </CardDonate>
      </Card>
    )
  }
}

export default CharityCard;
