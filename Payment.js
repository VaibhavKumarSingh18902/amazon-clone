import React, { useEffect, useState } from 'react'
import "./Payment.css"
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link, useHistory } from 'react-router-dom';
import { db } from './firebase';
import { BakeryDiningTwoTone, DisabledByDefault, LineAxisOutlined } from '@mui/icons-material';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import CurrencyFormat from 'react-currency-format'
// import { getBasketTotal } from './reducer'
import axios from './axios'
function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();
    const stripe = useStripe();
    const history = useHistory();
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const elements = useElements();
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState("");
    useEffect(() => {
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                //stripe expects total in currency subuints like cents for  dollar
                url: `/payments/create?total=${summation * 100}`
            })
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret();
    }, [basket])
    console.log("The secret is ", clientSecret)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            //paymentIntent=payment confirmation
            db
                .collection('users')
                // .doc(users?.id)
                .collection('orders')
                .doc(paymentIntent.id)
                .set({
                    basket: basket,
                    amount: paymentIntent.amount,
                    created: paymentIntent.created
                })
            setSucceeded(true);
            setError(null);
            setProcessing(false);
            dispatch({
                type: 'EMPTY_BASKET'
            })
            history.replace('/orders');//not push as we dont want to come to payment processing page if back is pressed so we are replacing the page with ./orders
        })

    }
    const handleChange = e => {
        //listen for changes in the card element
        //display any error as customer types their card details
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    }
    var summation = 0;
    for (let i = 0; i < basket.length; i++) {
        summation = summation + basket[i].price;
    }
    return (
        <div className='payment'>
            <div className='payment__container'>
                <h1>
                    <Link to="./checkout">Checkout({basket.length} items)</Link>
                </h1>
                {/*payment section-delivery address */}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className='payment__address'>
                        <p>{user ? <p>{user.email}</p> : alert("Login to checkout")}</p>
                        <p>24, Radhakrishna nagar</p>
                        <p>mirjhapar, Gujarat</p>
                    </div>
                </div>
                {/*payment section-review items */}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className='payment__items'>
                        {basket.map(item => (
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </div>
                {/*payment section-payment method */}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Payment Method</h3>
                    </div>
                    <div className='payment__details'>
                        {/*Stripe magic!!*/}
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />
                            <div className='payment__priceContainer'>
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <h3>Order Total:{value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={summation}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : <p>Buy Now</p>}</span>
                                </button>
                            </div>
                            {/*Handling errors */}
                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>




            </div>
        </div>
    )
}

export default Payment