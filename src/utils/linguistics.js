export function languageToColor(language) {

    const colorMap = {
        // Latin & Romance (orange family)
        'Latin': "var(--red)",
        'Old French': "var(--orange)",
        'Middle French': "var(--orange)",
        'French': "var(--orange)",
        'Spanish': "var(--orange)",
        'Italian': "var(--orange)",
        'Portuguese': "var(--orange)",
        'Old Provençal': "var(--orange)",

        // Semitic & Egyptian (yellow)
        'Egyptian': "var(--yellow)",
        'Hebrew': "var(--yellow)",
        'Arabic': "var(--yellow)",

        // Hellenic (green)
        'Ancient Greek': "var(--green)",

        // English lineage (blue)
        'English': "var(--blue)",
        'Middle English': "var(--blue)",
        'Old English': "var(--blue)",
        'Scots': "var(--blue)",

        // Germanic - West (purple)
        'Dutch': "var(--purple)",
        'German': "var(--purple)",
        'Old Dutch': "var(--purple)",
        'Middle Dutch': "var(--purple)",
        'Old High German': "var(--purple)",
        'Middle Low German': "var(--purple)",
        'Yiddish': "var(--purple)",

        // Germanic - North (indigo)
        'Old Norse': "var(--indigo)",
        'Norwegian': "var(--indigo)",
        'Proto-Germanic': "var(--indigo)",

        // Norman French (keep separate)
        'Anglo-Norman': "var(--indigo)",

        // Indo-Iranian (new coral)
        'Sanskrit': "var(--coral)",
        'Hindi': "var(--coral)",
        'Gujarati': "var(--coral)",
        'Kannada': "var(--coral)",
        'Persian': "var(--coral)",
        'Pahlavi': "var(--coral)",

        // Slavic (new slate)
        'Russian': "var(--slate)",

        // East Asian (new teal)
        'Mandarin Chinese': "var(--teal)",
        'Japanese': "var(--teal)",

        // Austronesian (new seafoam)
        'Malay': "var(--seafoam)",
        'Hawaiian': "var(--seafoam)",
        'Tahitian': "var(--seafoam)",
        'Taino': "var(--seafoam)",

        // Romani (new mauve)
        'Romany': "var(--mauve)",
        'Angloromani': "var(--mauve)",

        // African (new bronze)
        'Engenni': "var(--bronze)",

        'Unknown': "var(--gray)"
    };

    // const colorMap = {
    //     'Latin': "var(--red)", 

    //     'Old French': "var(--orange)",
    //     'Middle French': "var(--orange)", 
    //     'French': "var(--orange)", 
    //     'Spanish': "var(--orange)", 

    //     'Egyptian': "var(--yellow)",
    //     'Hebrew': "var(--yellow)",

    //     'Ancient Greek': "var(--green)", 
    //     'Tahitian': "var(--green)", 
    //     'Taino': "var(--green)", 

    //     'English': "var(--blue)", 
    //     'Middle English': "var(--blue)", 
    //     'Old English': "var(--blue)",

    //     'Dutch': "var(--purple)", 
    //     'Old Norse': "var(--purple)", 
    //     'German': "var(--purple)", 

    //     'Anglo-Norman': "var(--indigo)",
    //     'Unknown': "var(--gray)"
    // }
    if (language in colorMap) {
        return colorMap[language];
    } else {
        return null;
    }
}

// https://iso639-3.sil.org/code_tables/639/data
export function abbreviateLanguage(language) {
    const abbreviationMap = {
        // Latin & Romance
        'Latin': "Lat.",        // lat
        'Old French': "Fro.",   // fro
        'Middle French': "Frm.", // frm
        'French': "Fra.",       // fra (ISO 639-3 uses fra, not fre)
        'Spanish': "Spa.",      // spa
        'Italian': "Ita.",      // ita
        'Portuguese': "Por.",   // por
        'Old Provençal': "Pro.", // pro (Provençal, Old to 1500)

        // Semitic & Egyptian
        'Egyptian': "Egy.",     // egy (Egyptian Ancient)
        'Hebrew': "Heb.",       // heb
        'Arabic': "Ara.",       // ara

        // Hellenic
        'Ancient Greek': "Grc.", // grc

        // English lineage
        'English': "Eng.",      // eng
        'Middle English': "Enm.", // enm
        'Old English': "Ang.",  // ang (not "eno" - the ISO code is ang)
        'Scots': "Sco.",        // sco

        // West Germanic
        'Dutch': "Nld.",        // nld
        'German': "Deu.",       // deu (ISO 639-3 uses deu, not ger)
        'Old Dutch': "Odt.",    // odt
        'Middle Dutch': "Dum.", // dum
        'Old High German': "Goh.", // goh
        'Middle Low German': "Gml.", // gml
        'Yiddish': "Yid.",      // yid

        // North Germanic / Proto
        'Old Norse': "Non.",    // non
        'Norwegian': "Nor.",    // nor
        'Proto-Germanic': "Gem.", // gem (Germanic languages collective)
        'Anglo-Norman': "Xno.", // xno

        // Indo-Iranian
        'Sanskrit': "San.",     // san
        'Hindi': "Hin.",        // hin
        'Gujarati': "Guj.",     // guj
        'Kannada': "Kan.",      // kan
        'Persian': "Fas.",      // fas (ISO 639-3 uses fas, not per)
        'Pahlavi': "Pal.",      // pal

        // Slavic
        'Russian': "Rus.",      // rus

        // East Asian
        'Mandarin Chinese': "Cmn.", // cmn (Mandarin Chinese specifically)
        'Japanese': "Jpn.",     // jpn

        // Austronesian
        'Malay': "Msa.",        // msa (or zsm for Standard Malay)
        'Hawaiian': "Haw.",     // haw
        'Tahitian': "Tah.",     // tah
        'Taino': "Tnq.",        // tnq

        // Romani
        'Romany': "Rom.",       // rom (macrolanguage)
        'Angloromani': "Rme.",  // rme

        // African
        'Engenni': "Enn.",      // enn

        'Unknown': "Unk."
    };
    if (language in abbreviationMap) {
        return abbreviationMap[language];
    } else {
        return language;
    }
}