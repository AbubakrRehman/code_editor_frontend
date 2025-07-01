import { languageList } from "@/constants/contants"
import { Link } from "react-router"

function Home() {
    return (
        <div className="grid place-items-center h-[100vh] py-2">
            <div className="grid gap-12 max-w-[900px] px-2.5">
                <h1 className="text-5xl poppins font-normal">Code online with <span className="text-red-400 poppins font-bold">Quick Compile.</span></h1>
                <ul className='grid grid-cols-none lg:grid-cols-2 w-full gap-5' >
                    {languageList.map((lang) => (
                        <li key={lang.id} >
                            <Link to={`/editor/${lang.key}`} className='flex items-center gap-3 border border-transparent hover:border-blue-500 transition-colors duration-300 rounded p-2'>
                                <img src={lang.logo} alt={lang.title} className='w-18' />
                                <span className="text-4xl poppins font-normal">{lang.title}</span>
                            </Link>
                        </li>)
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Home