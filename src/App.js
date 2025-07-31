import logo from './logo.svg';
import './App.css';
import Translator from './components/Translator';

function App() {
  return (
    <div className='container'>
      <h2><img src={process.env.PUBLIC_URL + '/translatorlogo.png'} alt="Logo" />Sentence Translator </h2>
      <Translator></Translator>
    </div>
    
  );
}

export default App;