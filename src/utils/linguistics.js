export function languageToColor(language) {
    const colorMap = {
        'Latin': "var(--red)", 

        'Old French': "var(--orange)",
        'Middle French': "var(--orange)", 
        'French': "var(--orange)", 
        'Spanish': "var(--orange)", 

        'Egyptian': "var(--yellow)",
        'Hebrew': "var(--yellow)",

        'Ancient Greek': "var(--green)", 
        'Tahitian': "var(--green)", 
        'Taino': "var(--green)", 

        'English': "var(--blue)", 
        'Middle English': "var(--blue)", 
        'Old English': "var(--blue)",

        'Dutch': "var(--purple)", 
        'Old Norse': "var(--purple)", 
        'German': "var(--purple)", 

        'Anglo-Norman': "var(--indigo)",
        'Unknown': "var(--gray)"
    }
    if (language in colorMap) {
        return colorMap[language];
    } else {
        return null;
    }
}

// https://iso639-3.sil.org/code_tables/639/data
export function abbreviateLanguage(language) {
	const abbreviationMap = {
        'Latin': "Lat.", 

        'Old French': "Fro.",
        'Middle French': "Frm.", 
        'French': "Fre.", 
        'Spanish': "Spa.", 

        'Egyptian': "Egy.",
        'Hebrew': "Heb.",

        'Ancient Greek': "Grc.", 
        'Tahitian': "Tah.",

        'English': "Eng.", 
        'Middle English': "Enm.", 
        'Old English': "Eno.",

        'Old Norse': "Non.", 
        'German': "Ger.", 
        'Dutch': "Nld.", 

        'Anglo-Norman': "Xno.",
        'Unknown': "Unk."
    }
    if (language in abbreviationMap) {
        return abbreviationMap[language];
    } else {
        return language;
    }
}