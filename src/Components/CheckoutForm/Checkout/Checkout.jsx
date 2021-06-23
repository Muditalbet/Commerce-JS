import React, { useState, useEffect } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, Divider, Button, CircularProgress, CssBaseline } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'

import { commerce } from '../../../lib/commerce'
import useStyles from './styles'
import AddressForm from '../AddressForm'
import PaymentForm from '../PaymentForm'

const steps = ["Shipping Address", "Payment details"]

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState(null)
    const [shippingData, setShippingData] = useState({})
    const classes = useStyles()
    const history = useHistory()

    useEffect(() => {
        const generateToken = async () =>{
            try{
                const token = await commerce.checkout.generateToken(cart.id, { type:'cart' })
                setCheckoutToken(token)
            }catch(error){
                console.log('checkout error, ', error)
            }
        }
        generateToken()
    }, [cart])

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1 )
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1 )
    const next = (data) =>{
        setShippingData(data)
        nextStep()
    }

    const Form = () => activeStep === 0 ? <AddressForm checkoutToken={checkoutToken} next={next} /> : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} />
    let Conformation = () => /*order.customer ?*/ (
        <>
            <div>
                <Typography variant="h5" >Thank you to purchase </Typography>
                <Divider className={classes.divider} />
                {/* <Typography variant="subtitle2" >Order Ref: {order.customer_reference} </Typography> */}
            </div>
            <br />
            <Button variant="outlined" component={Link} to="/" type="button" >Back to home</Button>
        </>
    )/*: (
        <div className={classes.spinner}>
            {console.dir('testing: ', order)}
            <CircularProgress />
        </div>
    )*/

    /*if(error) (
        <>
            <Typography variant="h5" >Error: {error}</Typography>
            <br />
            <Button variant="outlined" component={Link} to="/" type="button" >Back to home</Button>
        </>
    )*/

    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout} >
                <Paper className={classes.paper} >
                    <Typography variant="h4" align="center" >Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper} >
                        {steps.map((step)=>(
                            <Step key={step} >
                                <StepLabel >{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Conformation /> : checkoutToken && <Form /> }
                </Paper>
            </main>
        </>
    )
}

export default Checkout
