import { styles } from '@/app/styles/style';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useCreateOrderMutation } from '@/redux/features/orders/ordersApi';
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import socketIO from 'socket.io-client'
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || ""
const socketId = socketIO(ENDPOINT, { transports: ['websocket'] })
type Props = {
    setOpen: any,
    data: any,

};

const CheckOutForm = ({ setOpen, data, }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<any>("");
    const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
    const [loadUser, setLoadUser] = useState(false);
    const { data: userData } = useLoadUserQuery({ skip: loadUser ? false : true });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
    };



    return (
        <form id='payment-form' onSubmit={handleSubmit}>
            {stripe && elements ? (
                <>
                    <LinkAuthenticationElement id='link-authentication-element' />
                    <PaymentElement id='payment-element' />
                    <button disabled={isLoading || !stripe || !elements} id='submit'>
                        <span id='button-text' className={`${styles.button} mt-2 !h-[35px]`}>
                            {isLoading ? "Paying..." : "Pay Now"}
                        </span>
                    </button>
                </>
            ) : (
                <div>Loading Stripe...</div>
            )}

            {message && (
                <div id='payment-message' className='text-red-500 font-Poppins pt-2'>
                    {message}
                </div>
            )}
        </form>
    );
};

export default CheckOutForm;
