
  const Sidemenu = () => {
    return(
      <>
         <div className="hidden sm:flex flex-col w-80 h-full bg-indigo-600 text-white">
        <div className="flex flex-col flex-grow">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-indigo-700">
            <span className="text-2xl font-semibold">IT Support Assistant</span>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-8 space-y-4">
            <a href="#" className="flex items-center p-2 text-base font-medium hover:bg-indigo-700 rounded-lg">
              <span className="w-6 h-6 mr-3 text-white bg-indigo-400 rounded-full flex items-center justify-center">
                {/* Icon can be added here */}
              </span>
              How to Create acc
            </a>
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-indigo-700">
          <a href="#" className="flex items-center space-x-4 hover:bg-indigo-700 p-2 rounded-lg">
            <img className="w-10 h-10 rounded-full" src="https://via.placeholder.com/40" alt="User profile" />
            <span className="font-medium">Tom Cook</span>
          </a>
        </div>
      </div>
       </>

    )
}

export default Sidemenu;