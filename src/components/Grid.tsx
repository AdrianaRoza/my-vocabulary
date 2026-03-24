type GridProps = {
  children: React.ReactNode
}

const Grid = ({ children }: GridProps) => {
  return (
    // Grid responsivo usado em praticamente todas as listagens de cards.
    <div
      className="
      mt-5
      grid
      grid-cols-2
      md:grid-cols-4
      lg:grid-cols-5
      xl:grid-cols-6
      2xl:grid-cols-7
      gap-2 sm:gap-4 lg:gap-5
      "
      >   
        {children}
    </div>
  )
}

export default Grid
