
<script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.23.1"></script>

async function getMidiUrls() {
    const response = await fetch('https://api.github.com/repos/EddVargs8/Flow-Fi-Datasets/contents/Drums');
    const files = await response.json();
    
    const midiUrls = files
        .map(file => file.download_url);
    
    return midiUrls;
}


// Función para seleccionar aleatoriamente un archivo MIDI
function getRandomMidiUrl(midiUrls) {
    const randomIndex = Math.floor(Math.random() * midiUrls.length);
    console.log('MIDI seleccionado:', randomIndex);
    return midiUrls[randomIndex];
}

// Función para cargar el archivo MIDI y convertirlo a NoteSequence
export async function getRandomNoteSequence() {
    const midiUrls = await getMidiUrls();
    const midiUrl = getRandomMidiUrl(midiUrls);
    try {
        const response = await fetch(midiUrl);
        const midiData = await response.arrayBuffer();
        const midiUint8 = new Uint8Array(midiData);
        const noteSequence = mm.midiToSequenceProto(midiUint8);
        return noteSequence;
    } catch (error) {
        console.error('Error al cargar o convertir el archivo MIDI:', error);
        return null;
    }
}


