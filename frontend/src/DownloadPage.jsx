import { useState } from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import { Download, SelectFolder, CancelDownload } from "../wailsjs/go/main/App";

function DownloadPage({
    url,
    setUrl,
    folder,
    setFolder,
    format,
    setFormat,
    browser,
    setBrowser,
    progress,
    setProgress,
    soundChecked,
    exitChecked,
    openChecked
}) {

    const [result, setResult] = useState("");
    const [downloading, setDownloading] = useState(false);

    const download = async () => {
        if (!url || !folder) {
            setResult("❌ Не указана ссылка или директория");
            return;
        }
        setProgress(0);
        setDownloading(true);
        setResult("⌛ Загружается...");
        Download(url, folder, format, browser, soundChecked, exitChecked, openChecked).then(result => {
            setResult("✅ Успешно загружено");
            setDownloading(false);
            setProgress(100);
        }).catch((err) => {
            setResult("❌ Ошибка при скачивании");
            setDownloading(false);
        })
    }

    const cancel = async () => {
        CancelDownload().then(result => {
            setResult("⏹️ Скачивание остановлено");
            setDownloading(false);
        }).catch((err) => {
            setResult("❌ Ошибка при отмене");
            setDownloading(false);
        })
    }


    const selectFolder = async () => {
        const selectedPath = await SelectFolder();
        if (selectedPath) {
            setFolder(selectedPath);
        }
    }

    return (
        <div id="App">
            <h2>🎵 Simple Note</h2>
            <img src={logo} alt="logo"></img>
            <input class="input-url" onChange={(e) => setUrl(e.target.value)} value={url} placeholder="Введите ссылку на медиа" type="text" name="url" disabled={downloading} required />
            <div class="inputs">
                <input class="input-path" onChange={(e) => setFolder(e.target.value)} value={folder} placeholder="Укажите выходную директорию" type="text" name="folder" disabled={downloading} required />
                <button onClick={selectFolder} disabled={downloading} style={{ 'background-color': 'rgb(255, 94, 0)' }}>📂 Обзор...</button>
            </div>
            <div class="inputs">
                <select id="format-choice" name="formats" value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option value="opus">OPUS</option>
                    <option value="mp3">MP3</option>
                    <option value="aac">AAC</option>
                </select>
                <select id="browser-choice" name="browsers" value={browser} onChange={(e) => setBrowser(e.target.value)}>
                    <option value="firefox">Firefox</option>
                    <option value="brave">Brave</option>
                    <option value="chrome">Chrome</option>
                    <option value="chromium">Chromium</option>
                    <option value="edge">Edge</option>
                    <option value="opera">Opera</option>
                    <option value="safari">Safari</option>
                    <option value="vivaldi">Vivaldi</option>
                    <option value="whale">Whale</option>
                </select>
            </div>
            <button onClick={() => download()} disabled={downloading}>⬇️ Скачать ({format})</button>
            <button onClick={() => cancel()} style={{ 'background-color': 'rgb(255, 94, 0)' }}>⏹️ Отмена</button>

            <progress value={progress} max="100"></progress>
            <p>{result}</p>
        </div>
    )
}

export default DownloadPage;
