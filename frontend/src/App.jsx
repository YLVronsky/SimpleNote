import { useEffect, useState } from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import DownloadPage from './DownloadPage'
import SettingsPage from './SettingsPage'
import LogPage from './LogPage'
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Download } from '../wailsjs/go/main/App';
import { EventsOn } from '../wailsjs/runtime/runtime';

function App() {
    const [url, setUrl] = useState("");
    const [folder, setFolder] = useState("");
    const [format, setFormat] = useState("opus");
    const [browser, setBrowser] = useState("firefox");
    const [soundChecked, setSoundChecked] = useState(false);
    const [exitChecked, setExitChecked] = useState(false);
    const [openChecked, setOpenChecked] = useState(false);
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState("")

    useEffect(() => {
        const unlisten = EventsOn("log_line", (line) => {
            setLogs(prev => [...prev, line]);

            const match = line.match(/\[download\]\s+(\d+(?:\.\d+)?)/);
            if (match) {
                const percent = Math.round(parseFloat(match[1]));
                if (!isNaN(percent)) {
                    setProgress(percent);
                }
            }
        });
        return () => {
            unlisten();
        };
    }, []);

    return (
        <HashRouter basename="/">
            <div id="App">
                <div className="tabs">
                    <Link to="/" className="tab">Главная</Link>
                    <Link to="/settings" className="tab">Настройки</Link>
                    <Link to="/log" className="tab">Консоль</Link>
                </div>

                <div className="tab-content">
                    <Routes>
                        <Route path="/" element={<DownloadPage
                            url={url}
                            setUrl={setUrl}
                            folder={folder}
                            setFolder={setFolder}
                            format={format}
                            setFormat={setFormat}
                            browser={browser}
                            setBrowser={setBrowser}
                            progress={progress}
                            setProgress={setProgress}
                            soundChecked={soundChecked}
                            exitChecked={exitChecked}
                            openChecked={openChecked} />} />

                        <Route path="/settings" element={<SettingsPage
                            soundChecked={soundChecked}
                            setSoundChecked={setSoundChecked}
                            exitChecked={exitChecked}
                            setExitChecked={setExitChecked}
                            openChecked={openChecked}
                            setOpenChecked={setOpenChecked} />} />

                        <Route path="/log" element={<LogPage
                            logs={logs}
                            soundChecked={soundChecked}
                            exitChecked={exitChecked}
                            openChecked={openChecked} />} />
                    </Routes>
                </div>
            </div>
        </HashRouter>
    )
}

export default App
