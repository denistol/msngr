import { Loader } from "lucide-react"

export const AppLoader: BaseComponent = () => {
    return (
        <div className="loader absolute bg-background left-0 right-0 top-0 bottom-0 flex items-center justify-center z-10">
            <Loader className="w-8 h-8 animate-spin" />
        </div>
    )
}