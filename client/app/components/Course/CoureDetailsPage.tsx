import { useGetCourseDeatilsQuery } from '@/redux/features/courses/coursesApi'
import React, { useEffect, useState } from 'react'
import Loader from '../Loader/Loader'
import Heading from '@/app/utils/Heading'
import Header from '../Header'
import Footer from '../Footer'
import CourseDetails from "./CourseDetails"
import { useCreatePaymentIntentMutation, useGetStripePublishableKeyQuery } from '@/redux/features/orders/ordersApi'
import { loadStripe } from '@stripe/stripe-js'


type Props = {
    id: string
}

const CoureDetailsPage = ({ id }: Props) => {
    const [route, setRoute] = useState("Login")
    const [open, setOpen] = useState(false)
    const { data, isLoading } = useGetCourseDeatilsQuery(id)
    const { data: config } = useGetStripePublishableKeyQuery({})
    const [createPaymentIntent, { data: paymentIntentData }] = useCreatePaymentIntentMutation()
    const [stripePromise, setStripePromise] = useState<any>(null)
    const [clientSecret, setClientSecret] = useState("")
    useEffect(() => {
        if (clientSecret) {
            console.log("Client Secret in Parent:", clientSecret);
        }
    }, [clientSecret]);


    useEffect(() => {
        if (config && data && data.course?.price) {
            const publishablekey = config?.publishablekey;
            setStripePromise(loadStripe(publishablekey));

            // Convert the price to a number, then multiply by 100, and ensure it's an integer
            const priceInCents = Math.floor(Number(data.course.price) * 100);

            console.log('Course Price:', data.course.price);  // Debugging price
            console.log('Price in Cents:', priceInCents);  // Debugging conversion

            if (isNaN(priceInCents)) {
                console.error('Invalid price value:', data.course.price);
                return;
            }

            // Send the amount directly as a number (not in an object)
            console.log('Creating payment intent with amount:', priceInCents);
            createPaymentIntent(priceInCents);  // Send amount as a number, not an object
        }
    }, [config, data?.course?.price]);






    useEffect(() => {
        if (paymentIntentData) {

            setClientSecret(paymentIntentData?.client_secret)
        }
    }, [paymentIntentData])


    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div className="">
                        <Heading
                            title={data?.course?.name + "-Elearning"}
                            description={
                                "Elearning is a platform that provides online courses and resources for learners of all ages and backgrounds. Our mission is to make education accessible and affordable for everyone, everywhere."
                            }
                            keywords={data?.course?.tags}
                        />
                        <Header
                            route={route}
                            setRoute={setRoute}
                            open={open}
                            setOpen={setOpen}
                            activeItem={1}
                        />
                        {
                            stripePromise && (
                                <CourseDetails data={data.course} stripePromise={stripePromise} clientSecret={clientSecret}
                                  
                                    setOpen={setOpen}
                                    setRoute={setRoute}
                                    />
                            )
                        }
                        <Footer />
                    </div>
                )
            }
        </>
    )
}

export default CoureDetailsPage