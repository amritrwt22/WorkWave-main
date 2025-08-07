
const NewButton = ({children}) => {
    const classes=`button relative inline-flex items-center justify-center h-11 transition-colors hover:text-color-1 ml-10 mr-10 text-lg`;
    const spanClasses="relative z-10";
    const renderLink=()=>(
        <a href="#user" className={classes}>
            <span className={spanClasses}>{children}</span>
            
        </a>
    )
    return renderLink();

}

export default NewButton
