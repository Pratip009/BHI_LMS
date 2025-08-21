'use client'
import CoureDetailsPage from "../../components/Course/CoureDetailsPage"

const Page = ({ params }: any) => {
    return (
        <div>
            <CoureDetailsPage id={params.id}/>
        </div>
    )
}
export default Page