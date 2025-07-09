export const Footer: BaseComponent = () => {

    return (
        <footer className="w-full h-24 bg-foreground text-background flex items-center px-4">
            <div className="container mx-auto flex items-center justify-center gap-4 w-full">
                MSNGR {new Date().getFullYear()}
            </div>
        </footer>
    )
}