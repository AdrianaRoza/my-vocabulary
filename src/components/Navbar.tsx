

const Navbar = () => {
  return (
    <nav 
      className="bg-gray-900 text-white p-4 w-full shadow-md"
    >
      <div 
        className="w-full max-w-7xl mx-auto flex justify-between 
          items-center"
      >
        <div 
          className="text-xl font-bold"
        >
          MyVocabulary
        </div>

        <ul className="flex space-x-6">
          <li>
            <a 
              href="#" 
              className="hover:text-blue-400 transition-colors">
                Home  
            </a>
          </li>

          <li>
            <a 
              href="#" 
              className="hover:text-blue-400 transition-colors">
                Words
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="hover:text-blue-400 transition-colors">
                About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar