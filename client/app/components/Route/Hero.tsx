import React, { FC, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Link from "next/link"; // Assuming Next.js; use "react-router-dom" if needed
import Image from "next/image"; // Import the Image component
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

type Props = {};

const Hero: FC<Props> = (props) => {
  const { data, isLoading } = useGetHeroDataQuery("Banner")
  const [search, setSearch] = useState("")
  const router = useRouter()


  const handleSearch = () => {
    if (search === "") {
      return
    } else {
      router.push(`/courses?title=${search}`)
    }
  }
  return (
    <>
      {
        isLoading ? (<Loader />) : (
          <div className="relative overflow-x-hidden">
            <div className="w-screen flex flex-col 1000px:flex-row items-center dark:bg-gradient-to-b dark:from-[#1a202c] dark:to-[#05070C] bg-[#ffffff] min-h-[80vh] py-10 overflow-x-hidden">
              {/* Left Section: Hero Animation and Image */}
              <div className="w-full 1000px:w-[50%] flex items-center justify-center 1000px:justify-end">
                <div className="relative 1500px:h-[500px] 1500px:w-[500px] 1100px:h-[400px] 1100px:w-[400px] h-[60vw] w-[60vw] max-h-[350px] max-w-[350px] 1000px:max-h-none 1000px:max-w-none rounded-[50%] flex items-center justify-center 1000px:mr-[120px]">
                  <div className="absolute inset-0 hero_animation rounded-[50%] bg-transparent z-[5]"></div>
                  <Image
                    src={data?.layout?.banner?.image?.url}// Path to the image in the public folder
                    alt="Person studying"
                    className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-auto z-[10]"
                    width={500}
                    height={500}
                    priority // Prioritize loading for above-the-fold content
                  />
                </div>
              </div>

              {/* Right Section: Text, Search Bar, and Avatars */}
              <div className="w-full 1000px:w-[50%] flex flex-col items-center 1000px:items-start text-center 1000px:text-left mt-20 1000px:mt-0 px-4 1000px:pl-4 1000px:pr-0">
                <h4 className="dark:text-white text-[#000000bc] text-[24px] w-full 1000px:text-[40px] font-[600] font-Josefin py-2 1000px:leading-[50px] 1500px:w-[60%]">
                  {data?.layout?.banner?.title}
                </h4>
                <br />
                <p className="dark:text-[#edfff4] text-[#000000bc] font-Josefin font-[600] text-[18px] 1500px:w-[55%] 1100px:w-[78%]">
                  {data?.layout?.banner?.subTitle}
                </p>
                <br />
                <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative">
                  <input
                    type="search"
                    placeholder="Search Courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#000000bc] dark:text-white text-[20px] font-[500] font-Josefin"
                  />
                  <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]" onClick={handleSearch}>
                    <BiSearch className="text-white" size={30} />
                  </div>
                </div>
                <br />
                <br />
                <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center justify-center 1000px:justify-start">
                  <Image
                    src="/images/student2.jpg" // Local path
                    alt="Client 2"
                    className="rounded-full ml-[-20px]"
                    width={50}
                    height={50}
                  />
                  <Image
                    src="/images/student3.jpg" // Local path
                    alt="Client 3"
                    className="rounded-full ml-[-20px]"
                    width={50}
                    height={50}
                  />
                  <p className="font-Josefin dark:text-[#edfff4] text-[#000000bc] 1000px:pl-[10px] text-[18px] font-[600]">
                    500k+ People already trusted us.{" "}
                    <Link
                      href="/courses"
                      className="dark:text-[#46e256] text-[crimson]"
                    >
                      View Courses
                    </Link>{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>

  );
};

export default Hero;