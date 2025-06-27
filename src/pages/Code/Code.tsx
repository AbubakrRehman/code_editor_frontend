import { languageList, type language } from '@/constants/contants'
import { Link, NavLink, useParams } from 'react-router';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { createPortal } from 'react-dom';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"


function Code() {

    let { lang } = useParams();

    function isValidLang(value: string | undefined): value is language {
        return value ? ['javascript', 'python', 'cpp', 'c', 'java'].includes(value) : false;
    }

    if (!isValidLang(lang))
        return createPortal(<NotFoundPage />, document.getElementById('root')!);

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <header className='h-[50px]'>
                <div className='flex items-center gap-2 px-2 h-full font-bold text-2xl'>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild className='lg:hidden'>
                            <Button variant="outline" className='hover:cursor-pointer'>
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side='left'>
                            <SheetHeader className='p-0 px-4 py-2'>
                                <SheetTitle className='text-3xl text-red-400'>Quick Compile</SheetTitle>
                            </SheetHeader>
                            <ul className='px-4'>
                                {languageList.map((lang) => (
                                    <li key={lang.id} className=' h-11 border-b'>
                                        <NavLink onClick={handleClose} to={`/editor/${lang.key.toLowerCase()}`} className={({ isActive }) => (isActive ? 'h-full flex items-center gap-2 font-bold text-blue-500' : 'h-full flex items-center gap-2')}>
                                            <img src={lang.logo} alt={lang.title} className='w-9 object-contain' />
                                            <span>{lang.title}</span>
                                        </NavLink>
                                    </li>)
                                )}
                            </ul>
                        </SheetContent>
                    </Sheet>
                    <Link to="/" className='text-red-400'>Quick Compile</Link>

                </div>

            </header>

            <section className='flex' style={{ height: 'calc(100vh - 50px)' }}>
                <div className="hidden lg:flex flex-col gap-3 px-1 h-full w-13">
                    <ul>
                        {languageList.map((lang) => (
                            <li key={lang.id} className='p-0 m-0' >
                                <Tooltip>
                                    <TooltipTrigger tabIndex={-1}>
                                        <NavLink
                                            to={`/editor/${lang.key.toLowerCase()}`}
                                            className={({ isActive }) => (isActive ? 'border border-blue-500 inline-block p-1 rounded-xs' :
                                                'inline-block h-full p-1 border border-transparent')}>
                                            <img src={lang.logo} alt={lang.title} className='object-fill w-full' />
                                        </NavLink>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center" sideOffset={-4}>
                                        {lang.title}
                                    </TooltipContent>
                                </Tooltip>

                            </li>)
                        )}
                    </ul>
                </div>

                <div className='w-full h-full'>
                    <CodeEditor lang={lang} />
                </div>

            </section>
        </div>
    )
}

export default Code