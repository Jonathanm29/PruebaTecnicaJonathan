
import './App.css'
import Rueda from './Rueda'


function App() {
 // const [count, setCount] = useState(0)

  return (
      <>
          <div>
              <h1>Super Squads</h1>
             <div className="rueda-container">
              <div className="rueda-img-wrapper">
                  <Rueda />
              </div>
              </div>
          </div>
      </>
  )
}

export default App
