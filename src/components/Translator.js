import { useEffect, useState } from 'react';
import lang from './../languages';

function Translator() {

    const [fromText, setFromText] = useState('');
    const [toText, setToText] = useState('');
    const [fromLanguage, setFromLanguage] = useState('en-GB');
    const [toLanguage, setToLanguage] = useState('bn-IN');
    const [languages, setLanguages] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLanguages(lang);
    }, []);

    const copyContent = (text) => {
        navigator.clipboard.writeText(text);
    }

    const utterText = (text, language) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        synth.speak(utterance);
    }

    const handleExchange = () => {
        let tempValue = fromText;
        setFromText(toText);
        setToText(tempValue);

        let tempLang = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(tempLang);
    };

    // const handleTranslate = () => {
    //     setLoading(true);
    //     let url = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLanguage}|${toLanguage}`;

    //     fetch(url)
    //     .then((res) => res.json())
    //     .then((data) => {
    //         setToText(data.responseData.translatedText);
    //         setLoading(false);
    //     });
    // };

 const handleTranslate = async () => {
    setLoading(true);
    try {
        const MAX_LENGTH = 500;
        const textChunks = [];

        for (let i = 0; i < fromText.length; i += MAX_LENGTH) {
            textChunks.push(fromText.slice(i, i + MAX_LENGTH));
        }

        let translatedChunks = [];

        for (const chunk of textChunks) {
            const encodedText = encodeURIComponent(chunk);
            const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${fromLanguage}|${toLanguage}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data?.responseData?.translatedText) {
                translatedChunks.push(data.responseData.translatedText);
            } else {
                throw new Error("Failed to translate a chunk.");
            }
        }

        setToText(translatedChunks.join(" "));
    } catch (error) {
        console.error("Translation Error:", error);
        setToText("Translation failed. Please try again.");
    } finally {
        setLoading(false);
    }
};


    const handleIconClick = (target, id) => {
        if (!fromText || !toText) return;

        if (target.classList.contains('fa-copy')) {
            if (id === 'from') {
                copyContent(fromText);
            } else {
                copyContent(toText);
            }
            } else {
            if (id === 'from') {
                utterText(fromText, fromLanguage);
            } else {
                utterText(toText, toLanguage);
            }
        }
    };


    return (
        <>
        <div className="wrapper">
            <div className="text-input">
                <textarea name="from" className="from-text" placeholder="Enter Text" id="from" value={fromText} onChange={(e) => setFromText(e.target.value)}></textarea>
                <textarea name="to" className="to-text" id="to" value={toText} readonly></textarea>
            </div>
            <ul className="controls">
                <li className="row from">
                    <div className="icons">
                        <i id="from" className="fa-solid fa-copy" onClick={(e) => handleIconClick(e.target, 'from')}></i>
                    </div>
                    <select value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
                    {Object.entries(languages).map(([code, name]) => (
                        <option key={code} value={code}>
                        {name}
                        </option>
                    ))}
                    </select>

                </li>
                <li className="exchange" onClick={handleExchange}><i className="fa-solid fa-arrow-right-arrow-left"></i></li>
                <li className="row to">
                    <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
                    {Object.entries(languages).map(([code, name]) => (
                        <option key={code} value={code}>
                        {name}
                        </option>
                    ))}
                    </select>
                    <div className="icons">
                        <i id="to" className="fa-solid fa-copy" onClick={(e) => handleIconClick(e.target, 'to')}></i>

                    </div>
                </li>
            </ul>
        </div>
        <button onClick={handleTranslate} disabled={loading}>
            {loading ? 'Translating...' : 'Translate Sentence'}
        </button>
        </>
    )
}

export default Translator;