import { Routes, Route } from 'react-router-dom';
import Home from './screens/HomeScreen';


const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </>
    );
};

export default App;
