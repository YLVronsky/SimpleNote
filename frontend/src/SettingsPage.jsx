import { useState } from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';

function SettingsPage({
    soundChecked, setSoundChecked,
    exitChecked, setExitChecked,
    openChecked, setOpenChecked,
}) {
    return (
        <div id="Settings">
            <h2>⚙️ Настройки</h2>
            <div className="settings-item">
                <label className="settings-item-label">
                    <input type="checkbox" checked={soundChecked} onChange={(e) => setSoundChecked(e.target.checked)} />
                    Звук по окончании загрузки
                </label>
            </div>
            <div className="settings-item">
                <label className="settings-item-label">
                    <input type="checkbox" checked={exitChecked} onChange={(e) => setExitChecked(e.target.checked)} />
                    Выход по окончании загрузки
                </label>
            </div>
            <div className="settings-item">
                <label className="settings-item-label">
                    <input type="checkbox" checked={openChecked} onChange={(e) => setOpenChecked(e.target.checked)} />
                    Открывать выходную директорию
                </label>
            </div>
        </div >
    )
}

export default SettingsPage;
