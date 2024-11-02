
<script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.23.1"></script>


const midiUrls = [
    'https://raw.githubusercontent.com/EddVargs8/Flow-Fi-Datasets/main/Drums/9_soul-groove9_105_beat_4-4_57.midi',
    'https://raw.githubusercontent.com/EddVargs8/Flow-Fi-Datasets/main/Drums/8_jazz_105_beat_4-4_5.midi',
    'https://raw.githubusercontent.com/EddVargs8/Flow-Fi-Datasets/main/Drums/7_jazz-swing_215_beat_4-4_34.midi',
    'https://raw.githubusercontent.com/EddVargs8/Flow-Fi-Datasets/main/Drums/6_blues-shuffle_134_beat_4-4_58.midi'
];


// Función para seleccionar aleatoriamente un archivo MIDI
function getRandomMidiUrl() {
    console.log('Longitud de midiUrls:', midiUrls.length);
    const randomIndex = Math.floor(Math.random() * midiUrls.length);
    console.log('MIDI seleccionado:', randomIndex);
    return midiUrls[randomIndex];
}

// Función para cargar el archivo MIDI y convertirlo a NoteSequence
export async function getRandomNoteSequence() {
    const midiUrl = getRandomMidiUrl();
    try {
        const response = await fetch(midiUrl);
        const midiData = await response.arrayBuffer();
        
        // Convertir el ArrayBuffer a Uint8Array
        const midiUint8 = new Uint8Array(midiData);

        // Convertir MIDI a NoteSequence
        const noteSequence = mm.midiToSequenceProto(midiUint8);
        
        console.log('NoteSequence generado:', noteSequence);
        return noteSequence;
    } catch (error) {
        console.error('Error al cargar o convertir el archivo MIDI:', error);
        return null;
    }
}


