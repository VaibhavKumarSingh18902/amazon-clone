import React from 'react'
import CurrencyFormat from 'react-currency-format'
import "./Subtotal.css"
import { useStateValue } from "./StateProvider";
import { Link } from 'react-router-dom';

function Subtotal() {
    const [ {basket} , dispatch] = useStateValue();
    var summation=0;
    for (let i = 0; i < basket.length; i++) {
        summation =summation+ basket[i].price;
    }  
  return (
    <div className='subtotal'>
        <CurrencyFormat
            renderText={(value)=>(
                <>
                    <p>
                        Subtotal({basket.length} items):
                        <strong>${summation}</strong>
                    </p>
                    <small className='subtotal__gift'>
                        <input type="checkbox"/>
                        This order contains a gift
                    </small>
                </>
            )}
            decimalScale={2}
            value={0}
            displayType={"text"}
            thousandSeparator={true}
            prefix={'$'}
        />
        <Link to="./Payment">
            <button className='payment_btn'>Proceed to checkout</button>
        </Link>
        
    </div>
  )
}

export default Subtotal