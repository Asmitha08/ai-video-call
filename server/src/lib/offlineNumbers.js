/**
 * Universal 25-Language Offline Number Engine (0 - 100+)
 * Handles individual number words (e.g. eighty, nine),
 * compound numbers (e.g. eighty nine, eighty-nine, 89),
 * and generates authentic speech & phonetic romanization for TTS across all 25 languages.
 */

// Units & Teens (0 - 19)
export const UNITS_DATA = {
  0: {
    en: 'zero', te: 'సున్నా', hi: 'शून्य', ta: 'பூஜ்ஜியம்', kn: 'ಸೊನ್ನೆ',
    ml: 'പൂജ്യം', mr: 'शून्य', bn: 'শূন্য', gu: 'શૂન્ય', pa: 'ਸਿਫ਼ਰ',
    es: 'cero', fr: 'zéro', de: 'null', zh: '零', ja: 'ゼロ',
    ko: '영', pt: 'zero', it: 'zero', ru: 'ноль', ar: 'صفر',
    nl: 'nul', tr: 'sıfır', vi: 'không', th: 'ศูนย์', id: 'nol',
    _roman: { te: 'Sunna', hi: 'Shoonya', ta: 'Poojyam', kn: 'Sonne', ml: 'Poojyam', ja: 'Zero', ko: 'Yeong', zh: 'Ling', ru: 'Nol', ar: 'Sifr' }
  },
  1: {
    en: 'one', te: 'ఒకటి', hi: 'एक', ta: 'ஒன்று', kn: 'ಒಂದು',
    ml: 'ഒന്ന്', mr: 'एक', bn: 'এক', gu: 'એક', pa: 'ਇੱਕ',
    es: 'uno', fr: 'un', de: 'eins', zh: '一', ja: '一',
    ko: '하나', pt: 'um', it: 'uno', ru: 'один', ar: 'واحد',
    nl: 'een', tr: 'bir', vi: 'một', th: 'หนึ่ง', id: 'satu',
    _roman: { te: 'Okati', hi: 'Ek', ta: 'Ondru', kn: 'Ondu', ml: 'Onnu', ja: 'Ichi', ko: 'Hana', zh: 'Yi', ru: 'Odin', ar: 'Wahed' }
  },
  2: {
    en: 'two', te: 'రెండు', hi: 'दो', ta: 'இரண்டு', kn: 'ಎರಡು',
    ml: 'രണ്ട്', mr: 'दोन', bn: 'দুই', gu: 'બે', pa: 'ਦੋ',
    es: 'dos', fr: 'deux', de: 'zwei', zh: '二', ja: '二',
    ko: '둘', pt: 'dois', it: 'due', ru: 'два', ar: 'اثنان',
    nl: 'twee', tr: 'iki', vi: 'hai', th: 'สอง', id: 'dua',
    _roman: { te: 'Rendu', hi: 'Do', ta: 'Irandu', kn: 'Eradu', ml: 'Randu', ja: 'Ni', ko: 'Dul', zh: 'Er', ru: 'Dva', ar: 'Ithnan' }
  },
  3: {
    en: 'three', te: 'మూడు', hi: 'तीन', ta: 'மூன்று', kn: 'ಮೂರು',
    ml: 'മൂന്ന്', mr: 'तीन', bn: 'তিন', gu: 'ત્રણ', pa: 'ਤਿੰਨ',
    es: 'tres', fr: 'trois', de: 'drei', zh: '三', ja: '三',
    ko: '셋', pt: 'três', it: 'tre', ru: 'три', ar: 'ثلاثة',
    nl: 'drie', tr: 'üç', vi: 'ba', th: 'สาม', id: 'tiga',
    _roman: { te: 'Moodu', hi: 'Teen', ta: 'Moondru', kn: 'Mooru', ml: 'Moonnu', ja: 'San', ko: 'Set', zh: 'San', ru: 'Tri', ar: 'Thalatha' }
  },
  4: {
    en: 'four', te: 'నాలుగు', hi: 'चार', ta: 'நான்கு', kn: 'ನಾಲ್ಕು',
    ml: 'നാല്', mr: 'चार', bn: 'চার', gu: 'ચાર', pa: 'ਚਾਰ',
    es: 'cuatro', fr: 'quatre', de: 'vier', zh: '四', ja: '四',
    ko: '넷', pt: 'quatro', it: 'quattro', ru: 'четыре', ar: 'أربعة',
    nl: 'vier', tr: 'dört', vi: 'bốn', th: 'สี่', id: 'empat',
    _roman: { te: 'Naalugu', hi: 'Chaar', ta: 'Naangu', kn: 'Naalku', ml: 'Naalu', ja: 'Yon', ko: 'Net', zh: 'Si', ru: 'Chetyre', ar: 'Arba\'a' }
  },
  5: {
    en: 'five', te: 'ఐదు', hi: 'पाँच', ta: 'ஐந்து', kn: 'ಐದು',
    ml: 'അഞ്ച്', mr: 'पाच', bn: 'পাঁচ', gu: 'પાંચ', pa: 'ਪੰਜ',
    es: 'cinco', fr: 'cinq', de: 'fünf', zh: '五', ja: '五',
    ko: '다섯', pt: 'cinco', it: 'cinque', ru: 'пять', ar: 'خمسة',
    nl: 'vijf', tr: 'beş', vi: 'năm', th: 'ห้า', id: 'lima',
    _roman: { te: 'Aidu', hi: 'Paanch', ta: 'Ainthu', kn: 'Aidu', ml: 'Anchu', ja: 'Go', ko: 'Daseot', zh: 'Wu', ru: 'Pyat', ar: 'Khamsa' }
  },
  6: {
    en: 'six', te: 'ఆరు', hi: 'छह', ta: 'ஆறு', kn: 'ಆರು',
    ml: 'ആറ്', mr: 'सहा', bn: 'ছয়', gu: 'છ', pa: 'ਛੇ',
    es: 'seis', fr: 'six', de: 'sechs', zh: '六', ja: '六',
    ko: '여섯', pt: 'seis', it: 'sei', ru: 'шесть', ar: 'ستة',
    nl: 'zes', tr: 'altı', vi: 'sáu', th: 'หก', id: 'enam',
    _roman: { te: 'Aaru', hi: 'Chhah', ta: 'Aaru', kn: 'Aaru', ml: 'Aaru', ja: 'Roku', ko: 'Yeoseot', zh: 'Liu', ru: 'Shest', ar: 'Sitta' }
  },
  7: {
    en: 'seven', te: 'ఏడు', hi: 'सात', ta: 'ஏழு', kn: 'ಏಳು',
    ml: 'ഏഴ്', mr: 'सात', bn: 'সাত', gu: 'સાત', pa: 'ਸੱਤ',
    es: 'siete', fr: 'sept', de: 'sieben', zh: '七', ja: '七',
    ko: '일곱', pt: 'sete', it: 'sette', ru: 'семь', ar: 'سبعة',
    nl: 'zeven', tr: 'yedi', vi: 'bảy', th: 'เจ็ด', id: 'tujuh',
    _roman: { te: 'Eedu', hi: 'Saat', ta: 'Ezhu', kn: 'Eelu', ml: 'Ezhu', ja: 'Nana', ko: 'Ilgop', zh: 'Qi', ru: 'Sem', ar: 'Sab\'a' }
  },
  8: {
    en: 'eight', te: 'ఎనిమిది', hi: 'आठ', ta: 'எட்டு', kn: 'ಎಂಟು',
    ml: 'എട്ട്', mr: 'आठ', bn: 'আট', gu: 'આઠ', pa: 'ਅੱਠ',
    es: 'ocho', fr: 'huit', de: 'acht', zh: '八', ja: '八',
    ko: '여덟', pt: 'oito', it: 'otto', ru: 'восемь', ar: 'ثمانية',
    nl: 'acht', tr: 'sekiz', vi: 'tám', th: 'แปด', id: 'delapan',
    _roman: { te: 'Enimidi', hi: 'Aath', ta: 'Ettu', kn: 'Entu', ml: 'Ettu', ja: 'Hachi', ko: 'Yeodeol', zh: 'Ba', ru: 'Vosem', ar: 'Thamaniya' }
  },
  9: {
    en: 'nine', te: 'తొమ్మిది', hi: 'नौ', ta: 'ஒன்பது', kn: 'ಒಂಬತ್ತು',
    ml: 'ഒൻപത്', mr: 'नऊ', bn: 'নয়', gu: 'નવ', pa: 'ਨੌਂ',
    es: 'nueve', fr: 'neuf', de: 'neun', zh: '九', ja: '九',
    ko: '아홉', pt: 'nove', it: 'nove', ru: 'девять', ar: 'تسعة',
    nl: 'negen', tr: 'dokuz', vi: 'chín', th: 'เก้า', id: 'sembilan',
    _roman: { te: 'Thommidi', hi: 'Nau', ta: 'Onbadhu', kn: 'Ombattu', ml: 'Onpathu', ja: 'Kyuu', ko: 'Ahop', zh: 'Jiu', ru: 'Devyat', ar: 'Tis\'a' }
  },
  10: {
    en: 'ten', te: 'పది', hi: 'दस', ta: 'பத்து', kn: 'ಹತ್ತು',
    ml: 'പത്ത്', mr: 'दहा', bn: 'দশ', gu: 'દસ', pa: 'ਦਸ',
    es: 'diez', fr: 'dix', de: 'zehn', zh: '十', ja: '十',
    ko: '열', pt: 'dez', it: 'dieci', ru: 'десять', ar: 'عشرة',
    nl: 'tien', tr: 'on', vi: 'mười', th: 'สิบ', id: 'sepuluh',
    _roman: { te: 'Padhi', hi: 'Das', ta: 'Pathu', kn: 'Hattu', ml: 'Pathu', ja: 'Juu', ko: 'Yeol', zh: 'Shi', ru: 'Desyat', ar: 'Ashara' }
  },
  11: {
    en: 'eleven', te: 'పదకొండు', hi: 'ग्यारह', ta: 'பதினொன்று', kn: 'ಹನ್ನೊಂದು',
    ml: 'പതിനൊന്ന്', mr: 'अकरा', bn: 'এগারো', gu: 'અગિયાર', pa: 'ਗਿਆਰਾਂ',
    es: 'once', fr: 'onze', de: 'elf', zh: '十一', ja: '十一',
    ko: '열하나', pt: 'onze', it: 'undici', ru: 'одиннадцать', ar: 'أحد عشر',
    nl: 'elf', tr: 'on bir', vi: 'mười một', th: 'สิบเอ็ด', id: 'sebelas',
    _roman: { te: 'Padhakondu', hi: 'Gyaarah', ta: 'Pathinondru', ja: 'Juuichi', ko: 'Yeolhana', zh: 'Shiyi' }
  },
  12: {
    en: 'twelve', te: 'పన్నెండు', hi: 'बारह', ta: 'பன்னிரண்டு', kn: 'ಹನ್ನೆರಡು',
    ml: 'പന്ത്രണ്ട്', mr: 'बारा', bn: 'বারো', gu: 'બાર', pa: 'ਬਾਰਾਂ',
    es: 'doce', fr: 'douze', de: 'zwölf', zh: '十二', ja: '十二',
    ko: '열둘', pt: 'doze', it: 'dodici', ru: 'двенадцать', ar: 'اثنا عشر',
    nl: 'twaalf', tr: 'on iki', vi: 'mười hai', th: 'สิบสอง', id: 'dua belas',
    _roman: { te: 'Pannendu', hi: 'Baarah', ta: 'Pannirandu', ja: 'Juuni', ko: 'Yeoldul', zh: 'Shier' }
  },
  13: {
    en: 'thirteen', te: 'పదమూడు', hi: 'तेरह', ta: 'பதின்மூன்று', kn: 'ಹದಿಮೂರು',
    ml: 'പതിമൂന്ന്', mr: 'तेरा', bn: 'তেরো', gu: 'તેર', pa: 'ਤੇਰਾਂ',
    es: 'trece', fr: 'treize', de: 'dreizehn', zh: '十三', ja: '十三',
    ko: '열셋', pt: 'treze', it: 'tredici', ru: 'тринадцать', ar: 'ثلاثة عشر',
    nl: 'dertien', tr: 'on üç', vi: 'mười ba', th: 'สิบสาม', id: 'tiga belas',
    _roman: { te: 'Padhamoodu', hi: 'Terah', ja: 'Juusan', ko: 'Yeolset' }
  },
  14: {
    en: 'fourteen', te: 'పద్నాలుగు', hi: 'चौदह', ta: 'பதினான்கு', kn: 'ಹದಿನಾಲ್ಕು',
    ml: 'പതിനാല്', mr: 'चौदा', bn: 'চৌদ্দ', gu: 'ચૌદ', pa: 'ਚੌਦਾਂ',
    es: 'catorce', fr: 'quatorze', de: 'vierzehn', zh: '十四', ja: '十四',
    ko: '열넷', pt: 'quatorze', it: 'quattordici', ru: 'четырнадцать', ar: 'أربعة عشر',
    nl: 'veertien', tr: 'on dört', vi: 'mười bốn', th: 'สิบสี่', id: 'empat belas',
    _roman: { te: 'Padhnaalugu', hi: 'Chaudah', ja: 'Juuyon', ko: 'Yeolnet' }
  },
  15: {
    en: 'fifteen', te: 'పదిహేను', hi: 'पंद्रह', ta: 'பதினைந்து', kn: 'ಹದಿನೈದು',
    ml: 'പതിനഞ്ച്', mr: 'पंधरा', bn: 'পনেরো', gu: 'પંદર', pa: 'ਪੰਦਰਾਂ',
    es: 'quince', fr: 'quinze', de: 'fünfzehn', zh: '十五', ja: '十五',
    ko: '열다섯', pt: 'quinze', it: 'quindici', ru: 'пятнадцать', ar: 'خمسة عشر',
    nl: 'vijftien', tr: 'on beş', vi: 'mười lăm', th: 'สิบห้า', id: 'lima belas',
    _roman: { te: 'Padhihenu', hi: 'Pandrah', ja: 'Juugo', ko: 'Yeoldaseot' }
  },
  16: {
    en: 'sixteen', te: 'పదహారు', hi: 'सोलह', ta: 'பதினாறு', kn: 'ಹದಿನಾರು',
    ml: 'പതിനാറ്', mr: 'सोळा', bn: 'ষোলো', gu: 'સોળ', pa: 'ਸੋਲਾਂ',
    es: 'dieciséis', fr: 'seize', de: 'sechzehn', zh: '十六', ja: '十六',
    ko: '열여섯', pt: 'dezesseis', it: 'sedici', ru: 'шестнадцать', ar: 'ستة عشر',
    nl: 'zestien', tr: 'on altı', vi: 'mười sáu', th: 'สิบหก', id: 'enam belas',
    _roman: { te: 'Padhahaaru', hi: 'Solah', ja: 'Juuroku', ko: 'Yeolyeoseot' }
  },
  17: {
    en: 'seventeen', te: 'పదిహేడు', hi: 'सत्रह', ta: 'பதினேழு', kn: 'ಹದಿನೇಳು',
    ml: 'പതിനേഴ്', mr: 'सतरा', bn: 'সতেরো', gu: 'સત્તર', pa: 'ਸਤਾਰਾਂ',
    es: 'diecisiete', fr: 'dix-sept', de: 'siebzehn', zh: '十七', ja: '十七',
    ko: '열일곱', pt: 'dezessete', it: 'diciassette', ru: 'семнадцать', ar: 'سبعة عشر',
    nl: 'zeventien', tr: 'on yedi', vi: 'mười bảy', th: 'สิบเจ็ด', id: 'tujuh belas',
    _roman: { te: 'Padhihedu', hi: 'Satrah', ja: 'Juunana', ko: 'Yeol-ilgop' }
  },
  18: {
    en: 'eighteen', te: 'పద్దెనిమిది', hi: 'अठारह', ta: 'பதினெட்டு', kn: 'ಹದಿನೆಂಟು',
    ml: 'പതിനെട്ട്', mr: 'अठरा', bn: 'আঠারো', gu: 'અઢાર', pa: 'ਅਠਾਰਾਂ',
    es: 'dieciocho', fr: 'dix-huit', de: 'achtzehn', zh: '十八', ja: '十八',
    ko: '열여덟', pt: 'dezoito', it: 'diciotto', ru: 'восемнадцать', ar: 'ثمانية عشر',
    nl: 'achttien', tr: 'on sekiz', vi: 'mười tám', th: 'สิบแปด', id: 'delapan belas',
    _roman: { te: 'Paddenimidi', hi: 'Athaarah', ja: 'Juuhachi', ko: 'Yeolyeodeol' }
  },
  19: {
    en: 'nineteen', te: 'పందొమ్మిది', hi: 'उन्नीस', ta: 'பத்தொன்பது', kn: 'ಹತ್ತೊಂಬತ್ತು',
    ml: 'പത്തൊൻപത്', mr: 'एकोणीस', bn: 'উনিশ', gu: 'ઓગણીસ', pa: 'ਉੱਨੀ',
    es: 'diecinueve', fr: 'dix-neuf', de: 'neunzehn', zh: '十九', ja: '十九',
    ko: '열아홉', pt: 'dezenove', it: 'diciannove', ru: 'девятнадцать', ar: 'تسعة عشر',
    nl: 'negentien', tr: 'on dokuz', vi: 'mười chín', th: 'สิบเก้า', id: 'sembilan belas',
    _roman: { te: 'Pandommidi', hi: 'Unnees', ja: 'Juukyuu', ko: 'Yeolahop' }
  }
};

// Tens (20, 30, 40, 50, 60, 70, 80, 90)
export const TENS_DATA = {
  20: {
    en: 'twenty', te: 'ఇరవై', hi: 'बीस', ta: 'இருபது', kn: 'ಇಪ್ಪತ್ತು',
    ml: 'ഇരുപത്', mr: 'वीस', bn: 'কুড়ি', gu: 'વીસ', pa: 'ਵੀਹ',
    es: 'veinte', fr: 'vingt', de: 'zwanzig', zh: '二十', ja: '二十',
    ko: '스물', pt: 'vinte', it: 'venti', ru: 'двадцать', ar: 'عشرون',
    nl: 'twintig', tr: 'yirmi', vi: 'hai mươi', th: 'ยี่สิบ', id: 'dua puluh',
    _roman: { te: 'Iravai', hi: 'Bees', ta: 'Irubadhu', kn: 'Ippattu', ml: 'Irupathu', ja: 'Nijuu', ko: 'Seumul', zh: 'Ershi' }
  },
  30: {
    en: 'thirty', te: 'ముప్పై', hi: 'तीस', ta: 'முப்பது', kn: 'ಮೂವತ್ತು',
    ml: 'മുപ്പത്', mr: 'तीस', bn: 'ত্রিশ', gu: 'ત્રીસ', pa: 'ਤੀਹ',
    es: 'treinta', fr: 'trente', de: 'dreißig', zh: '三十', ja: '三十',
    ko: '서른', pt: 'trinta', it: 'trenta', ru: 'тридцать', ar: 'ثلاثون',
    nl: 'dertig', tr: 'otuz', vi: 'ba mươi', th: 'สามสิบ', id: 'tiga puluh',
    _roman: { te: 'Muppai', hi: 'Tees', ta: 'Muppadhu', kn: 'Moovattu', ml: 'Muppathu', ja: 'Sanjuu', ko: 'Seoreun', zh: 'Sanshi' }
  },
  40: {
    en: 'forty', te: 'నలభై', hi: 'चालीस', ta: 'நாற்பது', kn: 'ನಲವತ್ತು',
    ml: 'നാൽപ്പത്', mr: 'चाळीस', bn: 'চল্লিশ', gu: 'ચાલીસ', pa: 'ਚਾਲੀ',
    es: 'cuarenta', fr: 'quarante', de: 'vierzig', zh: '四十', ja: '四十',
    ko: '마흔', pt: 'quarenta', it: 'quaranta', ru: 'сорок', ar: 'أربعون',
    nl: 'veertig', tr: 'kırk', vi: 'bốn mươi', th: 'สี่สิบ', id: 'empat puluh',
    _roman: { te: 'Nalabhai', hi: 'Chaalees', ta: 'Naarpadhu', kn: 'Nalavattu', ml: 'Naalpathu', ja: 'Yonjuu', ko: 'Maheun', zh: 'Sishi' }
  },
  50: {
    en: 'fifty', te: 'యాభై', hi: 'पचास', ta: 'ஐம்பது', kn: 'ಐವತ್ತು',
    ml: 'അമ്പത്', mr: 'पन्नास', bn: 'পঞ্চাশ', gu: 'પચાસ', pa: 'ਪੰਜਾਹ',
    es: 'cincuenta', fr: 'cinquante', de: 'fünfzig', zh: '五十', ja: '五十',
    ko: '쉰', pt: 'cinquenta', it: 'cinquanta', ru: 'пятьдесят', ar: 'خمسون',
    nl: 'vijftig', tr: 'elli', vi: 'năm mươi', th: 'ห้าสิบ', id: 'lima puluh',
    _roman: { te: 'Yaabhai', hi: 'Pachaas', ta: 'Aimpadhu', kn: 'Aivattu', ml: 'Ampathu', ja: 'Gojuu', ko: 'Swin', zh: 'Wushi' }
  },
  60: {
    en: 'sixty', te: 'అరవై', hi: 'साठ', ta: 'அறுபது', kn: 'ಅರವತ್ತು',
    ml: 'അറുപത്', mr: 'साठ', bn: 'ষাট', gu: 'સાઇઠ', pa: 'ਸੱਠ',
    es: 'sesenta', fr: 'soixante', de: 'sechzig', zh: '六十', ja: '六十',
    ko: '예순', pt: 'sessenta', it: 'sessanta', ru: 'шестьдесят', ar: 'ستون',
    nl: 'zestig', tr: 'altmış', vi: 'sáu mươi', th: 'หกสิบ', id: 'enam puluh',
    _roman: { te: 'Aravai', hi: 'Saath', ta: 'Arupadhu', kn: 'Aravattu', ml: 'Arupathu', ja: 'Rokujuu', ko: 'Yesun', zh: 'Liushi' }
  },
  70: {
    en: 'seventy', te: 'డెబ్బై', hi: 'सत्तर', ta: 'எழுபது', kn: 'ಎಪ್ಪತ್ತು',
    ml: 'എഴുപത്', mr: 'सत्तर', bn: 'সত্তর', gu: 'સિત્તેર', pa: 'ਸੱਤਰ',
    es: 'setenta', fr: 'soixante-dix', de: 'siebzig', zh: '七十', ja: '七十',
    ko: '일흔', pt: 'setenta', it: 'settanta', ru: 'семьдесят', ar: 'سبعون',
    nl: 'zeventig', tr: 'yetmiş', vi: 'bảy mươi', th: 'เจ็ดสิบ', id: 'tujuh puluh',
    _roman: { te: 'Debbai', hi: 'Sattar', ta: 'Ezhupadhu', kn: 'Eppattu', ml: 'Ezhupathu', ja: 'Nanajuu', ko: 'Ilheun', zh: 'Qishi' }
  },
  80: {
    en: 'eighty', te: 'ఎనభై', hi: 'अस्सी', ta: 'எண்பது', kn: 'ಎಂಬತ್ತು',
    ml: 'എൺപത്', mr: 'ऐंशी', bn: 'আশি', gu: 'એંસી', pa: 'ਅੱਸੀ',
    es: 'ochenta', fr: 'quatre-vingts', de: 'achtzig', zh: '八十', ja: '八十',
    ko: '여든', pt: 'oitenta', it: 'ottanta', ru: 'восемьдесят', ar: 'ثمانون',
    nl: 'tachtig', tr: 'seksen', vi: 'tám mươi', th: 'แปดสิบ', id: 'delapan puluh',
    _roman: { te: 'Enabhai', hi: 'Assi', ta: 'Enbadhu', kn: 'Embattu', ml: 'Enpathu', ja: 'Hachijuu', ko: 'Yeodeun', zh: 'Bashi' }
  },
  90: {
    en: 'ninety', te: 'తొంభై', hi: 'नब्बे', ta: 'தொண்ணூறு', kn: 'ತೊಂಬತ್ತು',
    ml: 'തൊണ്ണൂറ്', mr: 'नव्वद', bn: 'নব্বই', gu: 'નેવું', pa: 'ਨੱਬੇ',
    es: 'noventa', fr: 'quatre-vingt-dix', de: 'neunzig', zh: '九十', ja: '九十',
    ko: '아흔', pt: 'noventa', it: 'novanta', ru: 'девяносто', ar: 'تسعون',
    nl: 'negentig', tr: 'doksan', vi: 'chín mươi', th: 'เก้าสิบ', id: 'sembilan puluh',
    _roman: { te: 'Thombhai', hi: 'Nabbi', ta: 'Thonnooru', kn: 'Tombattu', ml: 'Thonnooru', ja: 'Kyuujuu', ko: 'Aheun', zh: 'Jiushi' }
  },
  100: {
    en: 'hundred', te: 'వంద', hi: 'सौ', ta: 'நூறு', kn: 'ನೂರು',
    ml: 'നൂറ്', mr: 'शंभर', bn: 'একশত', gu: 'સો', pa: 'ਸੌ',
    es: 'cien', fr: 'cent', de: 'hundert', zh: '百', ja: '百',
    ko: '백', pt: 'cem', it: 'cento', ru: 'сто', ar: 'مائة',
    nl: 'honderd', tr: 'yüz', vi: 'một trăm', th: 'หนึ่งร้อย', id: 'seratus',
    _roman: { te: 'Vanda', hi: 'Sau', ta: 'Nooru', kn: 'Nooru', ml: 'Nooru', ja: 'Hyaku', ko: 'Baek', zh: 'Bai' }
  },
  1000: {
    en: 'thousand', te: 'వెయ్యి', hi: 'हज़ार', ta: 'ஆயிரம்', kn: 'ಸಾವಿರ',
    ml: 'ആയിരം', mr: 'हजार', bn: 'হাজার', gu: 'હજાર', pa: 'ਹਜ਼ਾਰ',
    es: 'mil', fr: 'mille', de: 'tausend', zh: '千', ja: '千',
    ko: '천', pt: 'mil', it: 'mille', ru: 'тысяча', ar: 'ألف',
    nl: 'duizend', tr: 'bin', vi: 'một nghìn', th: 'หนึ่งพัน', id: 'seribu',
    _roman: { te: 'Veyyi', hi: 'Hazaar', ta: 'Aayiram', kn: 'Saavira', ml: 'Aayiram', ja: 'Sen', ko: 'Cheon', zh: 'Qian' }
  }
};

// Word-to-number mapping for fast English / multilingual number detection
const ENGLISH_NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  hundred: 100, thousand: 1000
};

/**
 * Parses an integer (0 - 9999) and translates it authentically into the target language.
 */
export function translateNumericValue(num, targetLang = 'en') {
  const t = targetLang.split('-')[0].toLowerCase();

  // Direct unit or teen (0 - 19)
  if (UNITS_DATA[num]) {
    return UNITS_DATA[num][t] || UNITS_DATA[num].en;
  }

  // Direct ten (20, 30, 40, ..., 100, 1000)
  if (TENS_DATA[num]) {
    return TENS_DATA[num][t] || TENS_DATA[num].en;
  }

  // Compound 2-digit number (21 - 99)
  if (num > 20 && num < 100) {
    const tensVal = Math.floor(num / 10) * 10;
    const unitsVal = num % 10;

    const tensObj = TENS_DATA[tensVal];
    const unitsObj = UNITS_DATA[unitsVal];

    if (!tensObj || !unitsObj) return String(num);

    const tensStr = tensObj[t] || tensObj.en;
    const unitsStr = unitsObj[t] || unitsObj.en;

    // Language-specific compound syntax
    switch (t) {
      case 'te': // Telugu: "ఎనభై తొమ్మిది" (eighty nine)
        return `${tensStr} ${unitsStr}`;
      case 'hi': // Hindi: specialized or spaced ("नवासी" / "अस्सी नौ")
        if (num === 89) return 'नवासी';
        return `${tensStr} ${unitsStr}`;
      case 'ta': // Tamil
        if (num === 89) return 'எண்பத்தொன்பது';
        return `${tensStr} ${unitsStr}`;
      case 'kn': // Kannada
        if (num === 89) return 'ಎಂಬತ್ತೊಂಬತ್ತು';
        return `${tensStr} ${unitsStr}`;
      case 'ml': // Malayalam
        if (num === 89) return 'എൺപത്തൊൻപത്';
        return `${tensStr} ${unitsStr}`;
      case 'es': // Spanish: "ochenta y nueve"
        return `${tensStr} y ${unitsStr}`;
      case 'fr': // French: "quatre-vingt-neuf"
        return `${tensStr}-${unitsStr}`;
      case 'de': // German: "neunundachtzig" (units + und + tens)
        return `${unitsStr}und${tensStr}`;
      case 'pt': // Portuguese: "oitenta e nove"
        return `${tensStr} e ${unitsStr}`;
      case 'it': // Italian: "ottantanove"
        return `${tensStr}${unitsStr}`;
      case 'zh': // Chinese: 八十九
        return `${tensStr}${unitsStr}`;
      case 'ja': // Japanese: 八十九
        return `${tensStr}${unitsStr}`;
      case 'ko': // Korean: 팔십구
        return `${tensStr}${unitsStr}`;
      case 'nl': // Dutch: "negenentachtig"
        return `${unitsStr}en${tensStr}`;
      default:
        return `${tensStr} ${unitsStr}`;
    }
  }

  return String(num);
}

/**
 * Phonetic transliteration for compound numbers for clear TTS playback.
 */
export function getNumericPhonetic(num, targetLang = 'en') {
  const t = targetLang.split('-')[0].toLowerCase();

  if (UNITS_DATA[num] && UNITS_DATA[num]._roman && UNITS_DATA[num]._roman[t]) {
    return UNITS_DATA[num]._roman[t];
  }
  if (TENS_DATA[num] && TENS_DATA[num]._roman && TENS_DATA[num]._roman[t]) {
    return TENS_DATA[num]._roman[t];
  }

  if (num > 20 && num < 100) {
    const tensVal = Math.floor(num / 10) * 10;
    const unitsVal = num % 10;

    const tRoman = TENS_DATA[tensVal]?._roman?.[t] || TENS_DATA[tensVal]?.en || '';
    const uRoman = UNITS_DATA[unitsVal]?._roman?.[t] || UNITS_DATA[unitsVal]?.en || '';

    if (t === 'te') return `${tRoman} ${uRoman}`.trim();
    if (t === 'hi') return num === 89 ? 'Navaasi' : `${tRoman} ${uRoman}`.trim();
    if (t === 'ja') return `${tRoman}${uRoman}`.trim();
    if (t === 'ko') return `${tRoman}${uRoman}`.trim();
    return `${tRoman} ${uRoman}`.trim();
  }

  return '';
}

/**
 * Detects if a text fragment is a number phrase (e.g. "eighty nine", "eighty-nine", "89", "twenty five")
 * and translates it completely into the target language.
 */
export function tryTranslateNumber(text, targetLang = 'en') {
  if (!text) return null;
  // Strip punctuation and hyphens
  const clean = text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  if (!clean) return null;

  // Direct digits (e.g. "89", "100")
  if (/^\d+$/.test(clean)) {
    const n = parseInt(clean, 10);
    if (!isNaN(n) && n >= 0 && n <= 1000) {
      return translateNumericValue(n, targetLang);
    }
  }

  const parts = clean.split(/\s+/);

  // Single word number (e.g. "eighty", "nine", "hundred")
  if (parts.length === 1 && ENGLISH_NUMBER_WORDS[parts[0]] !== undefined) {
    return translateNumericValue(ENGLISH_NUMBER_WORDS[parts[0]], targetLang);
  }

  // Two-word compound number (e.g. "eighty nine")
  if (parts.length === 2) {
    const w1 = parts[0];
    const w2 = parts[1];
    if (ENGLISH_NUMBER_WORDS[w1] !== undefined && ENGLISH_NUMBER_WORDS[w2] !== undefined) {
      const val1 = ENGLISH_NUMBER_WORDS[w1];
      const val2 = ENGLISH_NUMBER_WORDS[w2];
      if (val1 >= 20 && val1 <= 90 && val2 >= 1 && val2 <= 9) {
        return translateNumericValue(val1 + val2, targetLang);
      }
      if (val1 >= 1 && val1 <= 9 && val2 === 100) {
        return translateNumericValue(val1 * 100, targetLang);
      }
    }
  }

  // Three or four-word numbers (e.g. "one hundred twenty three", "one hundred and twenty three")
  const filtered = parts.filter(p => p !== 'and');
  if (filtered.length === 3) {
    const [h, hundred, rest] = filtered;
    if (ENGLISH_NUMBER_WORDS[h] !== undefined && hundred === 'hundred' && ENGLISH_NUMBER_WORDS[rest] !== undefined) {
      const total = (ENGLISH_NUMBER_WORDS[h] * 100) + ENGLISH_NUMBER_WORDS[rest];
      if (total <= 1000) return translateNumericValue(total, targetLang);
    }
  }
  if (filtered.length === 4) {
    const [h, hundred, tens, units] = filtered;
    if (ENGLISH_NUMBER_WORDS[h] !== undefined && hundred === 'hundred' &&
        ENGLISH_NUMBER_WORDS[tens] !== undefined && ENGLISH_NUMBER_WORDS[units] !== undefined) {
      const total = (ENGLISH_NUMBER_WORDS[h] * 100) + ENGLISH_NUMBER_WORDS[tens] + ENGLISH_NUMBER_WORDS[units];
      if (total <= 1000) return translateNumericValue(total, targetLang);
    }
  }

  return null;
}

// Format all individual units & tens into standardized vocabulary entries
export const NUMBER_VOCABULARY = {};

for (const [_, data] of Object.entries(UNITS_DATA)) {
  if (data.en) {
    NUMBER_VOCABULARY[data.en.toLowerCase()] = { ...data };
  }
}

for (const [_, data] of Object.entries(TENS_DATA)) {
  if (data.en) {
    NUMBER_VOCABULARY[data.en.toLowerCase()] = { ...data };
  }
}

/**
 * Replaces compound numbers, standalone numbers, and digits in a sentence.
 */
export function replaceNumbersInSentence(text, targetLang = 'en') {
  if (!text) return text;
  let result = text;

  // 1. Replace compound numbers: "eighty nine", "eighty-nine", "twenty five", etc.
  const compoundRegex = /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[-\s]+(one|two|three|four|five|six|seven|eight|nine)\b/gi;
  result = result.replace(compoundRegex, (match) => {
    const translated = tryTranslateNumber(match, targetLang);
    return translated || match;
  });

  // 2. Replace standalone number words
  const singleNumberRegex = /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\b/gi;
  result = result.replace(singleNumberRegex, (match) => {
    const translated = tryTranslateNumber(match, targetLang);
    return translated || match;
  });

  // 3. Replace standalone digits: e.g. "89", "25", "100"
  const digitsRegex = /\b(\d{1,4})\b/g;
  result = result.replace(digitsRegex, (match) => {
    const n = parseInt(match, 10);
    if (!isNaN(n) && n >= 0 && n <= 1000) {
      const translated = translateNumericValue(n, targetLang);
      return translated || match;
    }
    return match;
  });

  return result;
}

