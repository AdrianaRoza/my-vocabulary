
const Navbar = () => {

  return (
    <>
      {/* NAVBAR */}
      <nav 
        className="bg-gray-900 text-white p-6 w-full shadow-md 
          fixed top-0 left-0 z-50"
      >
        <div 
          className="max-w-7xl mx-auto flex items-center
            justify-between relative"
        >

          {/* Nome centralizado */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 
              text-xl font-bold"
          >
            MyVocabulary
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar