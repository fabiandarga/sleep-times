import './App.css';
import SleeptimeChart from './components/SleeptimeChart';

function App() {
  const data = {
    '2024-11-18': '5:00',
    '2024-11-19': '1:05',
    '2024-11-21': '22:11',
    '2024-11-23': '3:00',
    '2024-11-24': '7:22',
    '2024-11-28': '23:02',
    '2024-12-06': '3:45',
    '2024-12-08': '4:00',
    '2024-12-09': '2:30',
    '2024-12-10': '4:00',
    '2024-12-11': '23:57',
    '2024-12-12': '2:30',
    '2024-12-14': '5:00',
    '2024-12-30': '5:00',
    '2024-12-31': '4:04',
    '2025-01-04': '0:01',
    '2025-01-05': '6:00',
    '2025-01-06': '1:00',
    '2025-01-08': '3:00',
    '2025-01-09': '7:00',
    '2025-01-10': '5:00',
    '2025-01-11': '0:00',
    '2025-01-12': '6:00',
    '2025-01-13': '1:00',
    '2025-01-14': '2:00',
    '2025-01-15': '0:00',
    '2025-01-16': '0:07',
    '2025-01-17': '4:00',
    '2025-01-19': '0:00',
    '2025-01-20': '1:00',
    '2025-01-21': '3:30',
  };
  return (
    <div className="App">
      <SleeptimeChart sleepTimeData={data}/>
    </div>
  );
}

export default App;
