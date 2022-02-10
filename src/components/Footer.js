export const Footer = ({ theme, puzzleNumber, date }) => (
  <div
    className={`flex ${
      theme ? 'justify-between' : 'justify-center'
    } px-4 my-5 max-w-sm mx-auto`}
  >
    <span>
      {puzzleNumber !== 'random' && (
        <span className="font-bold">#{puzzleNumber} </span>
      )}
      <span className="font-light">{date?.toISOString().split('T')[0]}</span>
    </span>

    {theme && (
      <span>
        <span className="font-bold mr-2">THEME</span>
        <span className="font-light">{theme?.toUpperCase()}</span>
      </span>
    )}
  </div>
)
