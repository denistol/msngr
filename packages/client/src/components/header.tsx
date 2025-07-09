import { Plane } from "lucide-react"
import { LoginDialog } from "./auth-dialog"
import Link from "next/link"

export const Header: BaseComponent = () => {

    return (
        <header className="w-full h-24 bg-foreground text-background flex items-center px-4">
            <div className="container mx-auto flex items-center gap-4">
                <Link href="/" className="flex gap-2 uppercase font-extrabold text-3xl items-center hover:text-yellow-500 transition-colors">
                    <Plane className="w-8 h-8"/>
                    <span>
                        msngr
                    </span>
                </Link>

                <div className="ml-auto text-foreground">
                    <LoginDialog/>
                </div>
            </div>
        </header>
    )
}