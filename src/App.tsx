import Registration from './components/Registration';
import { ToastContainer } from 'react-toastify'; // Keep this if you'll be using toast notifications
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Registration />
      <ToastContainer />  {/* Add this if you plan to show toast notifications */}
    </>
  );
}

export default App;
