import { useEffect, useState, useRef } from 'react';
import './App.css';

function LogPage({
    logs, soundChecked, exitChecked, openChecked
}) {
    const consoleRef = useRef(null);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    });

    return (
        <div id="Log">
            <h2>👓 Консоль</h2>
            <div id="console-frame" ref={consoleRef}>
                <pre>
                    {logs.join('')}
                </pre>
            </div>
        </div >
    )
}

export default LogPage;
