import Link from 'next/link'
import React from 'react'

export const navItemsData = [
  {
    name: 'Home',
    url: "/"
  },
  {
    name: 'Courses',
    url: "/courses"
  },
  {
    name: 'About',
    url: "/about"
  },
  {
    name: 'Policy',
    url: "/policy"
  },
  {
    name: 'FAQ',
    url: "/faq"
  },
]

type Props = {
  activeItem: number,
  isMobile: boolean
}

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden 800px:flex">
        {navItemsData.map((i, index) => (
          <Link href={i.url} key={index} passHref>
            <span
              className={`${
                activeItem === index
                  ? "text-[crimson] dark:text-[#37a39a]"
                  : "text-black dark:text-white"
              } text-[18px] px-6 font-Poppins font-[400]`}
            >
              {i.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Mobile Nav */}
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href="/" passHref>
              <span className="text-[25px] font-Poppins font-[500] text-black dark:text-white">
                ELearning
              </span>
            </Link>
          </div>
          {navItemsData.map((i, index) => (
            <Link href={i.url} key={index} passHref>
              <span
                className={`${
                  activeItem === index
                    ? "text-[crimson] dark:text-[#37a39a]"
                    : "text-black dark:text-white"
                } block py-5 text-[18px] px-6 font-Poppins font-[400]`}
              >
                {i.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default NavItems
