let convertSecondsToAltTimestamp = (seconds) => {
    let m = Math.floor(seconds / 60);
    let s = Math.floor(seconds % 60);
    let ms = Math.floor((seconds - Math.trunc(seconds)) * 1000);

    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
}

let convertSubtitlesToWebVtt = (subtitles, substitution) => {
    if (!substitution || substitution === "") {
        substitution = "[Missing Audio]";
    }
    return "WEBVTT\n\n" + subtitles.map((subtitle) => {
        if (substitution && (subtitle.text === "[male_dub]" || subtitle.text === "[female_dub]")) {
            return `${convertSecondsToAltTimestamp(subtitle.startTime)} --> ${convertSecondsToAltTimestamp(subtitle.endTime)}\n${substitution}`;
        } else {
            return `${convertSecondsToAltTimestamp(subtitle.startTime)} --> ${convertSecondsToAltTimestamp(subtitle.endTime)}\n${subtitle.text}`;
        }
    }).join("\n\n");
}

export let createWebVttDataUri = (subtitles, substitution) => {
    return "data:text/vtt;base64," + btoa(convertSubtitlesToWebVtt(subtitles, substitution));
}