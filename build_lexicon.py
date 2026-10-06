# -*- coding: utf-8 -*-
"""
Generates client/src/lib/offlineLexicon.js
"""

import json

LEXICON = {}

def add_w(en, te, hi, ta, kn, ml, mr, bn, gu, pa, es, fr, de, zh, ja, ko, pt, it, ru, ar, nl, tr, vi, th, id_, roman=None):
    entry = {
        "en": en, "te": te, "hi": hi, "ta": ta, "kn": kn, "ml": ml, "mr": mr, "bn": bn, "gu": gu, "pa": pa,
        "es": es, "fr": fr, "de": de, "zh": zh, "ja": ja, "ko": ko, "pt": pt, "it": it, "ru": ru, "ar": ar,
        "nl": nl, "tr": tr, "vi": vi, "th": th, "id": id_
    }
    if roman:
        entry["_roman"] = roman
    LEXICON[en.lower().strip()] = entry

# ── 1. Pronouns (Subject, Object, Possessive) ─────────────────────────────────
add_w("i", "నేను", "मैं", "நான்", "ನಾನು", "ഞാൻ", "मी", "আমি", "હું", "ਮੈਂ", "yo", "je", "ich", "我", "私", "나", "eu", "io", "я", "أنا", "ik", "ben", "tôi", "ฉัน", "saya")
add_w("you", "మీరు", "आप", "நீங்கள்", "ನೀವು", "നിങ്ങൾ", "तुम्ही", "আপনি", "તમે", "ਤੁਸੀਂ", "tú", "vous", "du", "你", "あなた", "당신", "você", "tu", "ты", "أنت", "jij", "sen", "bạn", "คุณ", "Anda")
add_w("he", "అతను", "वह", "அவன்", "ಅವನು", "അവൻ", "तो", "সে", "તે", "ਉਹ", "él", "il", "er", "他", "彼", "그", "ele", "lui", "он", "هو", "hij", "o", "anh ấy", "เขา", "dia")
add_w("she", "ఆమె", "वह", "அவள்", "ಅವಳು", "അവൾ", "ती", "সে", "તેણી", "ਉਹ", "ella", "elle", "sie", "她", "彼女", "그녀", "ela", "lei", "она", "هي", "zij", "o", "cô ấy", "เธอ", "dia")
add_w("it", "ఇది", "यह", "அது", "ಇದು", "ഇത്", "हे", "এটা", "તે", "ਇਹ", "eso", "il", "es", "它", "それ", "그것", "isso", "esso", "это", "هو", "het", "o", "nó", "มัน", "itu")
add_w("we", "మేము", "हम", "நாம்", "ನಾವು", "ഞങ്ങൾ", "आम्ही", "আমরা", "અમે", "ਅਸੀਂ", "nosotros", "nous", "wir", "我们", "私たち", "우리", "nós", "noi", "мы", "نحن", "wij", "biz", "chúng tôi", "เรา", "kami")
add_w("they", "వారు", "वे", "அவர்கள்", "ಅವರು", "അവർ", "ते", "তারা", "તેઓ", "ਉਹ", "ellos", "ils", "sie", "他们", "彼ら", "그들", "eles", "loro", "они", "هم", "zij", "onlar", "họ", "พวกเขา", "mereka")

add_w("my", "నా", "मेरा", "என்", "ನನ್ನ", "എന്റെ", "माझे", "আমার", "મારું", "ਮੇਰਾ", "mi", "mon", "mein", "我的", "私の", "내", "meu", "mio", "мой", "لي", "mijn", "benim", "của tôi", "ของฉัน", "saya")
add_w("your", "మీ", "आपका", "உங்கள்", "ನಿಮ್ಮ", "നിങ്ങളുടെ", "तुमचे", "আপনার", "તમારું", "ਤੁਹਾਡਾ", "tu", "votre", "dein", "你的", "あなたの", "당신의", "seu", "tuo", "ваш", "لك", "jouw", "senin", "của bạn", "ของคุณ", "Anda")
add_w("his", "అతని", "उसका", "அவரது", "ಅವನ", "അವന്റെ", "त्याचे", "তার", "તેનું", "ਉਸਦਾ", "su", "son", "sein", "他的", "彼の", "그의", "dele", "suo", "его", "له", "zijn", "onun", "của anh ấy", "ของเขา", "miliknya")
add_w("her", "ఆమె", "उसका", "அவளது", "அವಳ", "അവളുടെ", "तिचे", "তার", "તેણીનું", "ਉਸਦਾ", "su", "sa", "ihr", "她的", "彼女の", "그녀의", "dela", "suo", "её", "لها", "haar", "onun", "của cô ấy", "ของเธอ", "miliknya")
add_w("our", "మా", "हमारा", "எங்கள்", "ನಮ್ಮ", "ഞങ്ങളുടെ", "आमचे", "আমাদের", "અમારું", "ਸਾਡਾ", "nuestro", "notre", "unser", "我们的", "私たちの", "우리의", "nosso", "nostro", "наш", "لنا", "ons", "bizim", "của chúng tôi", "ของพวกเรา", "kami")
add_w("their", "వారి", "उनका", "அவர்களின்", "ಅವರ", "അവരുടെ", "त्यांचे", "তাদের", "તેમનું", "ਉਨ੍ਹਾਂ ਦਾ", "su", "leur", "ihr", "他们的", "彼らの", "그들의", "deles", "loro", "их", "لهم", "hun", "onların", "của họ", "ของพวกเขา", "mereka")

add_w("me", "నన్ను / నాకు", "मुझे", "என்னை", "ನನಗೆ", "എന്നെ", "मला", "আমাকে", "મને", "ਮੈਨੂੰ", "me", "moi", "mich", "我", "私を", "나를", "me", "me", "меня", "لي", "mij", "bana", "tôi", "ฉัน", "saya")
add_w("him", "అతనికి", "उसे", "அவரை", "ಅವನಿಗೆ", "അവനെ", "त्याला", "তাকে", "તેને", "ਉਸਨੂੰ", "él", "lui", "ihn", "他", "彼を", "그를", "ele", "lui", "его", "له", "hem", "ona", "anh ấy", "เขา", "dia")
add_w("us", "మమ్మల్ని", "हमें", "எங்களை", "ನಮ್ಮನ್ನು", "ഞങ്ങളെ", "आम्हाला", "আমাদের", "અમને", "ਸਾਨੂੰ", "nos", "nous", "uns", "我们", "私たちを", "우리를", "nos", "ci", "нас", "لنا", "ons", "bize", "chúng tôi", "พวกเรา", "kami")
add_w("them", "వారిని", "उन्हें", "அவர்களை", "ಅವರನ್ನು", "അവരെ", "त्यांना", "তাদের", "તેમને", "ਉਨ੍ਹਾਂ ਨੂੰ", "ellos", "eux", "sie", "他们", "彼らを", "그들을", "eles", "loro", "их", "لهم", "hen", "onları", "họ", "พวกเขา", "mereka")

# ── 2. Auxiliary & Modal Verbs ───────────────────────────────────────────────
add_w("am", "ఉన్నాను", "हूँ", "இருக்கிறேன்", "ಇದ್ದೇನೆ", "ആണ്", "आहे", "হই", "છું", "ਹਾਂ", "soy", "suis", "bin", "是", "です", "이다", "sou", "sono", "есмь", "أكون", "ben", "yim", "là", "อยู่", "adalah")
add_w("is", "ఉంది", "है", "உள்ளது", "ಆಗಿದೆ", "ആണ്", "आहे", "হয়", "છે", "ਹੈ", "es", "est", "ist", "是", "です", "이다", "é", "è", "есть", "يكون", "is", "dir", "là", "คือ", "adalah")
add_w("are", "ఉన్నారు", "हैं", "இருக்கிறார்கள்", "ಇದ್ದಾರೆ", "ആണ്", "आहेत", "আছেন", "છો", "ਹਨ", "están", "sont", "sind", "是", "です", "이다", "são", "sono", "являются", "هم", "zijn", "dirler", "là", "เป็น", "adalah")
add_w("was", "ఉండింది", "था", "இருந்தது", "ಇತ್ತು", "ആയിരുന്നു", "होता", "ছিল", "હતો", "ਸੀ", "era", "était", "war", "曾是", "でした", "였다", "era", "era", "был", "كان", "was", "idi", "đã là", "เคยเป็น", "dulu")
add_w("were", "ఉండేవారు", "थे", "இருந்தனர்", "ಇದ್ದರು", "ആയിരുന്നു", "होते", "ছিলেন", "હતા", "ਸਨ", "eran", "étaient", "waren", "曾是", "でした", "였다", "eram", "erano", "были", "كانوا", "waren", "idiler", "đã là", "เคยเป็น", "dulu")
add_w("be", "ఉండండి", "रहें", "இருக்கவும்", "ಇರಿ", "ആവുക", "असा", "থাকুন", "રહો", "ਹੋਵੋ", "ser", "être", "sein", "是", "ある", "되다", "ser", "essere", "быть", "يكون", "zijn", "olmak", "hãy là", "เป็น", "menjadi")
add_w("been", "ఉన్నట్లు", "रहा है", "இருந்தது", "ಆಗಿದೆ", "ആയിട്ടുണ്ട്", "झाले आहे", "হয়েছে", "રહ્યો છે", "ਰਿਹਾ ਹੈ", "sido", "été", "gewesen", "一直在", "された", "되어왔다", "sido", "stato", "был", "كان", "geweest", "olmuş", "đã từng", "ได้รับ", "telah")

add_w("do", "చేయండి", "करें", "செய்யுங்கள்", "ಮಾಡಿ", "ചെയ്യുക", "करा", "করুন", "કરો", "ਕਰੋ", "hacer", "faire", "tun", "做", "する", "하다", "fazer", "fare", "делать", "افعل", "doen", "yapmak", "làm", "ทำ", "melakukan")
add_w("does", "చేస్తుంది", "करता है", "செய்கிறது", "ಮಾಡುತ್ತದೆ", "ചെയ്യുന്നു", "करतो", "করে", "કરે છે", "ਕਰਦਾ ਹੈ", "hace", "fait", "tut", "做", "する", "한다", "faz", "fa", "делает", "يفعل", "doet", "yapar", "làm", "ทำ", "melakukan")
add_w("did", "చేశారు", "किया", "செய்தார்", "ಮಾಡಿದರು", "ചെയ്തു", "केले", "করেছিল", "કર્યું", "ਕੀਤਾ", "hizo", "a fait", "tat", "做了", "した", "했다", "fez", "ha fatto", "сделал", "فعل", "deed", "yaptı", "đã làm", "ทำแล้ว", "melakukan")

add_w("have", "కలిగి ఉంది", "पास है", "வைத்திருங்கள்", "ಹೊಂದಿದೆ", "ഉണ്ട്", "आहे", "আছে", "પાસે છે", "ਕੋਲ ਹੈ", "tener", "avoir", "haben", "有", "持っている", "가지다", "ter", "avere", "иметь", "يمتلك", "hebben", "sahip olmak", "có", "มี", "memiliki")
add_w("has", "కలిగి ఉంది", "के पास है", "வைத்துள்ளார்", "ಹೊಂದಿದೆ", "ഉണ്ട്", "आहे", "আছে", "પાસે છે", "ਕੋਲ ਹੈ", "tiene", "a", "hat", "有", "持っている", "가지고 있다", "tem", "ha", "имеет", "لديه", "heeft", "sahiptir", "có", "มี", "memiliki")
add_w("had", "కలిగి ఉండెను", "था", "வைத்திருந்தார்", "ಹೊಂದಿತ್ತು", "ഉണ്ടായിരുന്നു", "होते", "ছিল", "હતું", "ਸੀ", "tenía", "avait", "hatte", "曾有", "持っていた", "가졌었다", "tinha", "aveva", "имел", "كان لديه", "had", "sahipti", "đã có", "เคยมี", "memiliki")

add_w("can", "గలరు", "सकते हैं", "முடியும்", "ಸಾಧ್ಯ", "കഴിയും", "शकता", "পারা", "શકે", "ਸਕਦੇ", "puede", "peut", "kann", "能", "できる", "할 수 있다", "pode", "può", "может", "يمكن", "kan", "yapabilir", "có thể", "สามารถ", "bisa")
add_w("could", "చేయగలరు", "सके", "முடிந்தது", "ಸಾಧ್ಯವಿತ್ತು", "കഴിഞ്ഞു", "शकला", "পারত", "શક્યા", "ਸਕਿਆ", "podría", "pourrait", "könnte", "能够", "できた", "할 수 있었다", "poderia", "potrebbe", "мог бы", "يمكن أن", "kon", "yapabilirdi", "có thể", "สามารถ", "bisa")
add_w("will", "చేస్తాను / అవుతుంది", "करेंगे", "செய்வோம்", "ಮಾಡುತ್ತಾರೆ", "ചെയ്യും", "करेन", "করবে", "કરશે", "ਕਰੇਗਾ", "hará", "fera", "wird", "将", "する予定", "할 것이다", "fará", "farà", "будет", "سوف", "zal", "olacak", "sẽ", "จะ", "akan")
add_w("would", "చేసేవారు", "होता", "செய்வார்", "ಮಾಡುತ್ತಿದ್ದರು", "ചെയ്യുമായിരുന്നു", "असेल", "করত", "કરત", "ਕਰਦਾ", "haría", "ferait", "würde", "愿意", "だろう", "할 것이다", "faria", "farebbe", "бы", "سيكون", "zou", "olurdu", "sẽ", "จะ", "akan")
add_w("should", "చేయాలి", "चाहिए", "செய்ய வேண்டும்", "ಮಾಡಬೇಕು", "ചെയ്യണം", "पाहिजे", "উচিত", "જોઈએ", "ਚਾਹੀਦਾ ਹੈ", "debería", "devrait", "sollte", "应该", "すべき", "해야 한다", "deveria", "dovrebbe", "следует", "يجب", "zou moeten", "gerekir", "nên", "ควร", "seharusnya")
add_w("must", "ఖచ్చితంగా చేయాలి", "ज़रूर", "கண்டிப்பாக", "ಖಂಡಿತ", "തീർച്ചയായും", "करायलाच हवे", "অবশ্যই", "ચોક્કસ કરવું જોઈએ", "ਜ਼ਰੂਰ", "debe", "doit", "muss", "必须", "しなければならない", "해야만 한다", "deve", "deve", "должен", "يجب بالتأكيد", "moet", "zorunda", "phải", "ต้อง", "harus")

# ── 3. High-Frequency Verbs ──────────────────────────────────────────────────
add_w("speak", "మాట్లాడండి", "बोलें", "பேசுங்கள்", "ಮಾತನಾಡಿ", "സംസാരിക്കൂ", "बोला", "বলুন", "બોલો", "ਬੋਲੋ", "habla", "parlez", "sprechen", "说话", "話す", "말하다", "fale", "parla", "говорить", "تحدث", "spreken", "konuş", "nói", "พูด", "bicara")
add_w("listen", "వినండి", "सुनें", "கேளுங்கள்", "ಕೇಳಿ", "കേൾക്കൂ", "ऐका", "শুনুন", "સાંભળો", "ਸੁਣੋ", "escucha", "écoutez", "hören", "听", "聞く", "듣다", "ouça", "ascolta", "слушать", "استمع", "luisteren", "dinle", "nghe", "ฟัง", "dengar")
add_w("hear", "వినండి", "सुनें", "கேளுங்கள்", "ಕೇಳಿ", "കേൾക്കുക", "ऐका", "শুনুন", "સાંભળો", "ਸੁਣੋ", "oír", "entendre", "hören", "听到", "聞こえる", "듣다", "ouvir", "sentire", "слышать", "سمع", "horen", "duymak", "nghe thấy", "ได้ยิน", "mendengar")
add_w("see", "చూడండి", "देखें", "பாருங்கள்", "ನೋಡಿ", "കാണുക", "पहा", "দেখুন", "જુઓ", "ਦੇਖੋ", "ver", "voir", "sehen", "看", "見る", "보다", "ver", "vedere", "видеть", "يرى", "zien", "görmek", "nhìn thấy", "มองเห็น", "melihat")
add_w("tell", "చెప్పండి", "बताएं", "சொல்லுங்கள்", "ಹೇಳಿ", "പറയുക", "सांगा", "বলুন", "કહો", "ਦੱਸੋ", "decir", "dire", "erzählen", "告诉", "伝える", "말하다", "dizer", "dire", "сказать", "أخبر", "vertellen", "söylemek", "nói", "บอก", "memberitahu")
add_w("say", "చెప్పండి", "कहें", "கூறுங்கள்", "ಹೇಳಿ", "പറയൂ", "म्हणा", "বলুন", "કહો", "ਕਹੋ", "decir", "dire", "sagen", "说", "言う", "말하다", "dizer", "dire", "говорить", "يقول", "zeggen", "demek", "nói", "พูด", "berkata")
add_w("talk", "మాట్లాడండి", "बात करें", "பேசுங்கள்", "ಮಾತನಾಡಿ", "സംസാരിക്കുക", "बोला", "কথা বলুন", "વાત કરો", "ਗੱਲ ਕਰੋ", "hablar", "parler", "sprechen", "交谈", "話す", "대화하다", "conversar", "parlare", "разговаривать", "تحدث", "praten", "konuşmak", "trò chuyện", "พูดคุย", "berbicara")
add_w("ask", "అడగండి", "पूछें", "கேளுங்கள்", "ಕೇಳಿ", "ചോദിക്കുക", "विचारा", "জিজ্ঞাসা করুন", "પૂછો", "ਪੁੱਛੋ", "preguntar", "demander", "fragen", "询问", "尋ねる", "묻다", "perguntar", "chiedere", "спросить", "اسأل", "vragen", "sormak", "hỏi", "ถาม", "bertanya")
add_w("know", "తెలుసు", "जानते हैं", "தெரியும்", "ಗೊತ್ತು", "അറിയാം", "माहीत आहे", "জানা", "જાણો", "ਜਾਣਦੇ ਹੋ", "saber", "savoir", "wissen", "知道", "知っている", "알다", "saber", "sapere", "знать", "يعلم", "weten", "bilmek", "biết", "รู้", "tahu")
add_w("think", "ఆలోచించండి", "सोचें", "நினையுங்கள்", "ಯೋಚಿಸಿ", "ചിന്തിക്കുക", "विचार करा", "ভাবুন", "વિચારો", "ਸੋਚੋ", "pensar", "penser", "denken", "想", "考える", "생각하다", "pensar", "pensare", "думать", "فكر", "denken", "düşünmek", "nghĩ", "คิด", "berpikir")
add_w("want", "కావాలి", "चाहिए", "வேண்டும்", "ಬೇಕು", "വേണം", "हवे", "চাই", "જોઈએ", "ਚਾਹੀਦਾ", "querer", "vouloir", "wollen", "想要", "欲しい", "원하다", "querer", "volere", "хотеть", "يريد", "willen", "istemek", "muốn", "ต้องการ", "ingin")
add_w("need", "అవసరం", "ज़रूरत", "தேவை", "அಗತ್ಯವಿದೆ", "ആവശ്യമുണ്ട്", "गरज", "প্রয়োজন", "જરૂર", "ਲੋੜ", "necesitar", "avoir besoin", "brauchen", "需要", "必要", "필요하다", "precisar", "aver bisogno", "нуждаться", "يحتاج", "nodig hebben", "ihtiyacı olmak", "cần", "จำเป็น", "butuh")
add_w("like", "ఇష్టం", "पसंद", "பிடிக்கும்", "ಇಷ್ಟ", "ഇഷ്ടമാണ്", "आवडते", "পছন্দ", "ગમે છે", "ਪਸંદ", "gustar", "aimer", "mögen", "喜欢", "好き", "좋아하다", "gostar", "piacere", "нравиться", "يعجب", "leuk vinden", "beğenmek", "thích", "ชอบ", "suka")
add_w("give", "ఇవ్వండి", "दीजिए", "கொடுங்கள்", "ಕೊಡಿ", "നൽകുക", "द्या", "দিন", "આપો", "ਦਿਓ", "dar", "donner", "geben", "给", "与える", "주다", "dar", "dare", "давать", "يعطي", "geven", "vermek", "cho", "ให้", "memberi")
add_w("take", "తీసుకోండి", "लीजिए", "எடுங்கள்", "ತೆಗೆದುಕೊಳ್ಳಿ", "എടുക്കുക", "घ्या", "নিন", "લો", "ਲਵੋ", "tomar", "prendre", "nehmen", "拿", "取る", "가져가다", "pegar", "prendere", "брать", "يأخذ", "nemen", "almak", "lấy", "เอา", "mengambil")
add_w("come", "రండి", "आइए", "வாருங்கள்", "ಬನ್ನಿ", "വരൂ", "या", "আসুন", "આવો", "ਆਓ", "venir", "venir", "kommen", "来", "来る", "오다", "vir", "venire", "приходить", "تعال", "komen", "gelmek", "đến", "มา", "datang")
add_w("go", "వెళ్లండి", "जाएं", "போங்கள்", "ಹೋಗಿ", "പോകുക", "जा", "যান", "જાઓ", "ਜਾਓ", "ir", "aller", "gehen", "去", "行く", "가다", "ir", "andare", "идти", "اذهب", "gaan", "gitmek", "đi", "ไป", "pergi")
add_w("call", "కాల్ చేయండి", "कॉल करें", "அழைக்கவும்", "ಕರೆ ಮಾಡಿ", "വിളിക്കുക", "कॉल करा", "কল করুন", "કૉલ કરો", "ਕਾਲ ਕਰੋ", "llamar", "appeler", "anrufen", "打电话", "電話する", "전화하다", "ligar", "chiamare", "звонить", "اتصل", "bellen", "aramak", "gọi", "โทร", "menelepon")
add_w("help", "సహాయం చేయండి", "मदद करें", "உதவுங்கள்", "ಸಹಾಯ ಮಾಡಿ", "സഹായിക്കൂ", "मदत करा", "সাহায্য করুন", "મદદ કરો", "ਮਦਦ ਕਰੋ", "ayudar", "aider", "helfen", "帮助", "助ける", "돕다", "ajudar", "aiutare", "помогать", "ساعد", "helpen", "yardım etmek", "giúp đỡ", "ช่วยเหลือ", "membantu")
add_w("work", "పని చేయండి", "काम करें", "வேலை செய்யுங்கள்", "ಕೆಲಸ ಮಾಡಿ", "ജോലി ചെയ്യുക", "काम करा", "কাজ করুন", "કામ કરો", "ਕੰਮ ਕਰੋ", "trabajar", "travailler", "arbeiten", "工作", "働く", "일하다", "trabalhar", "lavorare", "работать", "يعمل", "werken", "çalışmak", "làm việc", "ทำงาน", "bekerja")
add_w("understand", "అర్థం చేసుకోండి", "समझें", "புரிந்து கொள்ளுங்கள்", "ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ", "മനസ്സിലാക്കുക", "समजून घ्या", "বুঝুন", "સમજો", "ਸਮਝੋ", "entender", "comprendre", "verstehen", "理解", "理解する", "이해하다", "entender", "capire", "понимать", "فهم", "begrijpen", "anlamak", "hiểu", "เข้าใจ", "mengerti")
add_w("wait", "వేచి ఉండండి", "इंतज़ार करें", "காத்திருங்கள்", "ಕಾಯಿರಿ", "കാത്തിരിക്കൂ", "थांबा", "অপেক্ষা করুন", "રાહ જુઓ", "ਉਡੀਕੋ", "esperar", "attendre", "warten", "等待", "待つ", "기다리다", "esperar", "aspettare", "ждать", "انتظر", "wachten", "beklemek", "chờ đợi", "รอ", "menunggu")
add_w("start", "ప్రారంభించండి", "शुरू करें", "தொடங்கு", "ಪ್ರಾರಂಭಿಸಿ", "ആരംഭിക്കുക", "सुरू करा", "শুরু করুন", "શરૂ કરો", "ਸ਼ੁਰੂ ਕਰੋ", "empezar", "démarrer", "starten", "开始", "開始する", "시작하다", "iniciar", "iniziare", "начать", "ابدأ", "starten", "başlamak", "bắt đầu", "เริ่ม", "mulai")
add_w("stop", "ఆపండి", "रोकें", "நிறுத்துங்கள்", "ನಿಲ್ಲಿಸಿ", "നിർത്തുക", "थांबवा", "থামান", "અટકાવો", "ਰੋਕੋ", "detener", "arrêter", "stoppen", "停止", "停止する", "멈추다", "parar", "fermare", "остановить", "توقف", "stoppen", "durmak", "dừng lại", "หยุด", "berhenti")
add_w("open", "తెరవండి", "खोलें", "திறக்கவும்", "ತೆರೆಯಿರಿ", "തുറക്കുക", "उघडा", "ખુલুন", "ખોલો", "ਖੋਲ੍ਹੋ", "abrir", "ouvrir", "öffnen", "打开", "開く", "열다", "abrir", "aprire", "открыть", "افتح", "openen", "açmak", "mở", "เปิด", "buka")
add_w("close", "మూసివేయండి", "बंद करें", "மூடவும்", "ಮುಚ್ಚಿ", "അടയ്ക്കുക", "बंद करा", "বন্ধ করুন", "બંધ કરો", "ਬੰਦ ਕਰੋ", "cerrar", "fermer", "schließen", "关闭", "閉じる", "닫다", "fechar", "chiudere", "закрыть", "أغلق", "sluiten", "kapatmak", "đóng", "ปิด", "tutup")
add_w("check", "తనిఖీ చేయండి", "जाँचें", "சரிபார்க்கவும்", "ಪರಿಶೀಲಿಸಿ", "പരിശോധിക്കുക", "तपासा", "পরীক্ষা করুন", "ચકાસો", "ਜਾਂਚੋ", "verificar", "vérifier", "prüfen", "检查", "確認する", "확인하다", "verificar", "controllare", "проверить", "تحقق", "controleren", "kontrol etmek", "kiểm tra", "ตรวจสอบ", "memeriksa")
add_w("send", "పంపండి", "भेजें", "அனுப்பவும்", "ಕಳುಹಿಸಿ", "അയക്കുക", "पाठवा", "পাঠান", "મોકલો", "ਭੇਜੋ", "enviar", "envoyer", "senden", "发送", "送る", "보내다", "enviar", "inviare", "отправить", "أرسل", "verzenden", "göndermek", "gửi", "ส่ง", "kirim")

# ── 4. Prepositions & Connectors ─────────────────────────────────────────────
add_w("with", "తో", "के साथ", "உடன்", "ಜೊತೆಗೆ", "കൂടെ", "सोबत", "সাথে", "સાથે", "ਨਾਲ", "con", "avec", "mit", "和", "と一緒に", "와 함께", "com", "con", "с", "مع", "met", "ile", "với", "กับ", "dengan")
add_w("without", "లేకుండా", "के बिना", "இல்லாமல்", "ಇಲ್ಲದೆ", "കൂടാതെ", "शिवाय", "ছাড়া", "વિના", "ਬਿਨਾਂ", "sin", "sans", "ohne", "没有", "なしで", "없이", "sem", "senza", "без", "بدون", "zonder", "olmadan", "không có", "โดยไม่มี", "tanpa")
add_w("to", "కి / కు", "को / की ओर", "க்கு", "ಗೆ", "ലേക്ക്", "कडे", "প্রতি", "તરફ", "ਨੂੰ", "a", "à", "zu", "到", "へ", "에게", "para", "a", "к", "إلى", "naar", "e", "đến", "ถึง", "ke")
add_w("from", "నుండి", "से", "இருந்து", "ಇಂದ", "നിന്ന്", "कडून", "থেকে", "થી", "ਤੋਂ", "de", "de", "von", "从", "から", "에서", "de", "da", "из", "من", "van", "den", "từ", "จาก", "dari")
add_w("for", "కోసం", "के लिए", "க்காக", "ಗಾಗಿ", "വേണ്ടി", "साठी", "জন্য", "માટે", "ਲਈ", "para", "pour", "für", "为了", "のために", "위해", "para", "per", "для", "من أجل", "voor", "için", "cho", "สำหรับ", "untuk")
add_w("in", "లో", "में", "இல்", "ನಲ್ಲಿ", "ഇൽ", "मध्ये", "মধ্যে", "માં", "ਵਿੱਚ", "en", "dans", "in", "在...里", "の中で", "안에", "em", "in", "в", "في", "in", "içinde", "trong", "ใน", "di dalam")
add_w("on", "మీద", "पर", "மீது", "ಮೇಲೆ", "മേൽ", "वर", "উপর", "પર", "ਉੱਤੇ", "en", "sur", "auf", "在...上", "の上に", "위에", "em", "su", "на", "على", "op", "üzerinde", "trên", "บน", "di atas")
add_w("at", "వద్ద", "पर", "இல்", "ಬಳಿ", "സമീപം", "येथे", "কাছে", "પાસે", "ਵਿਖੇ", "en", "à", "an", "在", "で", "에서", "em", "a", "в", "عند", "bij", "de", "tại", "ที่", "di")
add_w("and", "మరియు", "और", "மற்றும்", "ಮತ್ತು", "കൂടാതെ", "आणि", "এবং", "અને", "ਅਤੇ", "y", "et", "und", "和", "と", "그리고", "e", "e", "и", "و", "en", "ve", "và", "และ", "dan")
add_w("or", "లేదా", "या", "அல்லது", "ಅಥವಾ", "ಅಲ್ಲെങ്കിൽ", "किंवा", "বা", "અથવા", "ਜਾਂ", "o", "ou", "oder", "或者", "または", "또는", "ou", "o", "или", "أو", "of", "veya", "hoặc", "หรือ", "atau")
add_w("but", "కానీ", "लेकिन", "ஆனால்", "ಆದರೆ", "പക്ഷേ", "पण", "কিন্তু", "પરંતુ", "ਪਰ", "pero", "mais", "aber", "但是", "しかし", "하지만", "mas", "ma", "но", "لكن", "maar", "ama", "nhưng", "แต่", "tetapi")
add_w("because", "ఎందుకంటే", "क्योंकि", "ஏனெனில்", "ಏಕೆಂದರೆ", "കാരണം", "कारण", "কারণ", "કારણ કે", "ਕਿਉਂਕਿ", "porque", "parce que", "weil", "因为", "なぜなら", "왜냐하면", "porque", "perché", "потому что", "لأن", "omdat", "çünkü", "bởi vì", "เพราะว่า", "karena")

# ── 5. Question Words ────────────────────────────────────────────────────────
add_w("what", "ఏమిటి", "क्या", "என்ன", "ಏನು", "എന്ത്", "काय", "কি", "શું", "ਕੀ", "qué", "quoi", "was", "什么", "何", "무엇", "o que", "cosa", "что", "ماذا", "wat", "ne", "gì", "อะไร", "apa")
add_w("where", "ఎక్కడ", "कहाँ", "எங்கே", "ಎಲ್ಲಿ", "എവിടെ", "कुठे", "কোথায়", "ક્યાં", "ਕਿੱਥੇ", "dónde", "où", "wo", "哪里", "どこ", "어디", "onde", "dove", "где", "أين", "waar", "nerede", "ở đâu", "ที่ไหน", "di mana")
add_w("when", "ఎప్పుడు", "कब", "எப்போது", "ಯಾವಾಗ", "എപ്പോൾ", "केव्हा", "কখন", "ક્યારે", "ਕਦੋਂ", "cuándo", "quand", "wann", "什么时候", "いつ", "언제", "quando", "quando", "когда", "متى", "wanneer", "ne zaman", "khi nào", "เมื่อไร", "kapan")
add_w("why", "ఎందుకు", "क्यों", "ஏன்", "ಯಾಕೆ", "എന്തുകൊണ്ട്", "का", "কেন", "કેમ", "ਕਿਉਂ", "por qué", "pourquoi", "warum", "为什么", "なぜ", "왜", "por que", "perché", "почему", "لماذا", "waarom", "neden", "tại sao", "ทำไม", "mengapa")
add_w("how", "ఎలా", "कैसे", "எப்படி", "ಹೇಗೆ", "എങ്ങനെ", "कसे", "কীভাবে", "કેવી રીતે", "ਕਿਵੇਂ", "cómo", "comment", "wie", "怎样", "どうやって", "어떻게", "como", "come", "как", "كيف", "hoe", "nasıl", "làm sao", "อย่างไร", "bagaimana")
add_w("who", "ఎవరు", "कौन", "யார்", "ಯಾರು", "ആര്", "कोण", "কে", "કોણ", "ਕੌਣ", "quién", "qui", "wer", "谁", "誰", "누구", "quem", "chi", "кто", "من", "wie", "kim", "ai", "ใคร", "siapa")
add_w("which", "ఏది", "कौन सा", "எது", "ಯಾವುದು", "ഏത്", "कोणते", "কোনটি", "કયું", "ਕਿਹੜਾ", "cuál", "quel", "welche", "哪个", "どれ", "어느 것", "qual", "quale", "какой", "أي", "welke", "hangi", "nào", "อันไหน", "yang mana")

# ── 6. Adjectives & Adverbs ──────────────────────────────────────────────────
add_w("good", "మంచి", "अच्छा", "நல்ல", "ಒಳ್ಳೆಯ", "നല്ല", "चांगला", "ভালো", "સારું", "ਚੰਗਾ", "bueno", "bon", "gut", "好", "良い", "좋은", "bom", "buono", "хороший", "جيد", "goed", "iyi", "tốt", "ดี", "bagus")
add_w("great", "చాలా బాగుంది", "बहुत बढ़िया", "அற்புதம்", "ಅದ್ಭುತ", "വളരെ നല്ലത്", "छान", "দারুণ", "સરસ", "ਵਧੀਆ", "genial", "génial", "großartig", "太棒了", "素晴らしい", "대단한", "ótimo", "ottimo", "великолепно", "رائع", "geweldig", "harika", "tuyệt vời", "ยอดเยี่ยม", "hebat")
add_w("bad", "చెడు", "बुरा", "மோசமான", "ಕೆಟ್ಟ", "മോശം", "वाईट", "খারাপ", "ખરાબ", "ਬੁਰਾ", "malo", "mauvais", "schlecht", "坏", "悪い", "나쁜", "ruim", "cattivo", "плохой", "سيء", "slecht", "kötü", "tệ", "แย่", "buruk")
add_w("clear", "స్పష్టంగా", "स्पष्ट", "தெளிவான", "ಸ್ಪಷ್ಟ", "വ്യക്തമായ", "स्पष्ट", "স্পষ্ট", "સ્પષ્ટ", "ਸਪਸ਼ਟ", "claro", "clair", "klar", "清楚", "明確な", "분명한", "claro", "chiaro", "ясный", "واضح", "duidelijk", "net", "rõ ràng", "ชัดเจน", "jelas")
add_w("clearly", "స్పష్టంగా", "स्पष्ट रूप से", "தெளிவாக", "ಸ್ಪಷ್ಟವಾಗಿ", "വ്യക്തമായി", "स्पष्टपणे", "স্পষ্টভাবে", "સ્પષ્ટ રીતે", "ਸਪਸ਼ਟ ਤੌਰ ਤੇ", "claramente", "clairement", "deutlich", "清晰地", "はっきりと", "분명하게", "claramente", "chiaramente", "ясно", "بوضوح", "duidelijk", "netçe", "rõ ràng", "อย่างชัดเจน", "dengan jelas")
add_w("fast", "వేగంగా", "तेज़", "வேகமாக", "ವೇಗ", "വേഗത്തിൽ", "जलद", "দ্রুত", "ઝડપી", "ਤੇਜ਼", "rápido", "rapide", "schnell", "快", "速い", "빠른", "rápido", "veloce", "быстрый", "سريع", "snel", "hızlı", "nhanh", "เร็ว", "cepat")
add_w("slow", "నెమ్మదిగా", "धीमा", "மெதுவாக", "ನಿಧಾನ", "പതുക്കെ", "हळू", "ধীর", "ધીમું", "ਹੌਲੀ", "lento", "lent", "langsam", "慢", "遅い", "느린", "lento", "lento", "медленный", "بطيء", "traag", "yavaş", "chậm", "ช้า", "lambat")
add_w("slowly", "నెమ్మదిగా", "धीरे-धीरे", "மெதுவாக", "ನಿಧಾನವಾಗಿ", "പതുക്കെ", "हळूहळू", "ধীরে ধীরে", "ધીમે ધીમે", "ਹੌਲੀ ਹੌਲੀ", "lentamente", "lentement", "langsam", "慢慢地", "ゆっくりと", "천천히", "lentamente", "lentamente", "медленно", "ببطء", "langzaam", "yavaşça", "chậm rãi", "อย่างช้าๆ", "perlahan")
add_w("now", "ఇప్పుడు", "अब", "இப்போது", "ಈಗ", "ഇപ്പോൾ", "आता", "এখন", "હમણાં", "ਹੁਣ", "ahora", "maintenant", "jetzt", "现在", "今", "지금", "agora", "ora", "сейчас", "الآن", "nu", "şimdi", "bây giờ", "ตอนนี้", "sekarang")
add_w("here", "ఇక్కడ", "यहाँ", "இங்கே", "ಇಲ್ಲಿ", "ഇവിടെ", "येथे", "এখানে", "અહીં", "ਇੱਥੇ", "aquí", "ici", "hier", "这里", "ここ", "여기", "aqui", "qui", "здесь", "هنا", "hier", "burada", "ở đây", "ที่นี่", "di sini")
add_w("there", "అక్కడ", "वहाँ", "அங்கே", "ಅಲ್ಲಿ", "അവിടെ", "तेथे", "সেখানে", "ત્યાં", "ਉੱਥੇ", "allí", "là", "dort", "那里", "そこ", "거기", "lá", "lì", "там", "هناك", "daar", "orada", "ở đó", "ที่นั่น", "di sana")
add_w("today", "ఈ రోజు", "आज", "இன்று", "ಇಂದು", "ഇന്ന്", "आज", "আজ", "આજે", "ਅੱਜ", "hoy", "aujourd'hui", "heute", "今天", "今日", "오늘", "hoje", "oggi", "сегодня", "اليوم", "vandaag", "bugün", "hôm nay", "วันนี้", "hari ini")
add_w("tomorrow", "రేపు", "कल", "நாளை", "ನಾಳೆ", "ನಾಳೆ", "उद्या", "কাল", "આવતીકાલે", "ਕੱਲ੍ਹ", "mañana", "demain", "morgen", "明天", "明日", "내일", "amanhã", "domani", "завтра", "غداً", "morgen", "yarın", "ngày mai", "พรุ่งนี้", "besok")
add_w("yesterday", "నిన్న", "कल", "நேற்று", "ನಿನ್ನೆ", "ഇന്നലെ", "काल", "গতকাল", "ગઈકાલે", "ਕੱਲ੍ਹ", "ayer", "hier", "gestern", "昨天", "昨日", "어제", "ontem", "ieri", "вчера", "أمس", "gisteren", "dün", "hôm qua", "เมื่อวาน", "kemarin")

# ── 7. Essential Nouns ────────────────────────────────────────────────────────
add_w("friend", "స్నేహితుడు", "दोस्त", "நண்பர்", "ಸ್ನೇಹಿತ", "സുഹൃത്ത്", "मित्र", "বন্ধু", "મિત્ર", "ਦੋਸਤ", "amigo", "ami", "Freund", "朋友", "友達", "친구", "amigo", "amico", "друг", "صдиق", "vriend", "arkadaş", "bạn bè", "เพื่อน", "teman")
add_w("friends", "స్నేహితులు", "दोस्तों", "நண்பர்கள்", "ಸ್ನೇಹಿತರು", "സുഹൃത്തുക്കൾ", "मित्र", "বন্ধুরা", "મિત્રો", "ਦੋਸਤ", "amigos", "amis", "Freunde", "朋友们", "友達", "친구들", "amigos", "amici", "друзья", "أصدقاء", "vrienden", "arkadaşlar", "những người bạn", "เพื่อนๆ", "teman-teman")
add_w("time", "సమయం", "समय", "நேரம்", "ಸಮಯ", "സമയം", "वेळ", "সময়", "સમય", "ਸਮਾਂ", "tiempo", "temps", "Zeit", "时间", "時間", "시간", "tempo", "tempo", "время", "وقت", "tijd", "zaman", "thời gian", "เวลา", "waktu")
add_w("day", "రోజు", "दिन", "நாள்", "ದಿನ", "ദിവസം", "दिवस", "দিন", "દિવસ", "ਦਿਨ", "día", "jour", "Tag", "天", "日", "날", "dia", "giorno", "день", "يوم", "dag", "gün", "ngày", "วัน", "hari")
add_w("voice", "వాయిస్ / స్వరం", "आवाज", "குரல்", "ಧ್ವನಿ", "ശബ്ദം", "आवाज", "কণ্ঠ", "અવાજ", "ਆਵਾਜ਼", "voz", "voix", "Stimme", "声音", "声", "음성", "voz", "voce", "голос", "صوت", "stem", "ses", "giọng nói", "เสียง", "suara")
add_w("room", "గది", "कमरा", "அறை", "ಕೋಣೆ", "മുറി", "खोली", "ঘর", "રૂમ", "ਕਮਰਾ", "habitación", "chambre", "Zimmer", "房间", "部屋", "방", "quarto", "stanza", "комната", "غرفة", "kamer", "oda", "phòng", "ห้อง", "kamar")
add_w("number", "సంఖ్య", "संख्या", "எண்", "ಸಂಖ್ಯೆ", "നമ്പർ", "संख्या", "সংখ্যা", "નંબર", "ਨੰਬਰ", "número", "numéro", "Nummer", "号码", "番号", "번호", "número", "numero", "номер", "رقم", "nummer", "numara", "số", "หมายเลข", "nomor")
add_w("water", "నీరు", "पानी", "தண்ணீர்", "ನೀರು", "വെള്ളം", "पाणी", "জল", "પાણી", "ਪਾਣੀ", "agua", "eau", "Wasser", "水", "水", "물", "água", "acqua", "вода", "ماء", "water", "su", "nước", "น้ำ", "air")
add_w("food", "ఆహారం", "खाना", "உணவு", "આಹಾರ", "ഭക്ഷണം", "अन्न", "খাবার", "ખોરાક", "ਭੋਜਨ", "comida", "nourriture", "Essen", "食物", "食べ物", "음식", "comida", "cibo", "еда", "طعام", "voedsel", "yemek", "thức ăn", "อาหาร", "makanan")
add_w("money", "డబ్బు", "पैसा", "பணம்", "ಹಣ", "പണം", "पैसा", "টাকা", "પૈસા", "ਪੈਸੇ", "dinero", "argent", "Geld", "钱", "お金", "돈", "dinheiro", "denaro", "деньги", "مال", "geld", "para", "tiền", "เงิน", "uang")

# ── Irregular verb mappings table ───────────────────────────────────────────
IRREGULAR_LEMMAS = {
    "went": "go", "gone": "go", "going": "go", "goes": "go",
    "came": "come", "coming": "come", "comes": "come",
    "saw": "see", "seen": "see", "seeing": "see", "sees": "see",
    "heard": "hear", "hearing": "hear", "hears": "hear",
    "spoke": "speak", "spoken": "speak", "speaking": "speak", "speaks": "speak",
    "told": "tell", "telling": "tell", "tells": "tell",
    "said": "say", "saying": "say", "says": "say",
    "talked": "talk", "talking": "talk", "talks": "talk",
    "asked": "ask", "asking": "ask", "asks": "ask",
    "knew": "know", "known": "know", "knowing": "know", "knows": "know",
    "thought": "think", "thinking": "think", "thinks": "think",
    "wanted": "want", "wanting": "want", "wants": "want",
    "needed": "need", "needing": "need", "needs": "need",
    "liked": "like", "liking": "like", "likes": "like",
    "gave": "give", "given": "give", "giving": "give", "gives": "give",
    "took": "take", "taken": "take", "taking": "take", "takes": "take",
    "made": "make", "making": "make", "makes": "make",
    "got": "get", "gotten": "get", "getting": "get", "gets": "get",
    "found": "find", "finding": "find", "finds": "find",
    "called": "call", "calling": "call", "calls": "call",
    "helped": "help", "helping": "help", "helps": "help",
    "worked": "work", "working": "work", "works": "work",
    "waited": "wait", "waiting": "wait", "waits": "wait",
    "started": "start", "starting": "start", "starts": "start",
    "stopped": "stop", "stopping": "stop", "stops": "stop",
    "friends": "friend", "times": "time", "days": "day", "weeks": "week",
    "months": "month", "years": "year", "rooms": "room", "numbers": "number"
}

output_path = r"c:\Users\asmit\Downloads\APPP\client\src\lib\offlineLexicon.js"

js_code = """
export const COMPREHENSIVE_LEXICON = """ + json.dumps(LEXICON, ensure_ascii=False, indent=2) + """;

export const IRREGULAR_LEMMAS = """ + json.dumps(IRREGULAR_LEMMAS, ensure_ascii=False, indent=2) + """;

// Words that should be gracefully absorbed / omitted in languages without grammatical articles
export const ARTICLES = new Set(['the', 'a', 'an']);

/**
 * Returns the base root (lemma) of an English word.
 * e.g. "speaking" -> "speak", "friends" -> "friend", "went" -> "go"
 */
export function lemmatizeEnglish(word) {
  if (!word) return '';
  const clean = word.toLowerCase().trim();

  // 1. Direct irregular map
  if (IRREGULAR_LEMMAS[clean]) {
    return IRREGULAR_LEMMAS[clean];
  }

  // 2. Regular morphological suffix stripping
  if (clean.endsWith('ing') && clean.length > 4) {
    const stem = clean.slice(0, -3);
    if (stem.endsWith(stem[stem.length - 1])) {
      return stem.slice(0, -1); // e.g. "stopping" -> "stop"
    }
    return stem; // e.g. "asking" -> "ask", "speaking" -> "speak"
  }

  if (clean.endsWith('ed') && clean.length > 3) {
    return clean.slice(0, -2); // e.g. "walked" -> "walk"
  }

  if (clean.endsWith('ly') && clean.length > 4) {
    return clean.slice(0, -2); // e.g. "clearly" -> "clear"
  }

  if (clean.endsWith('es') && clean.length > 4) {
    return clean.slice(0, -2); // e.g. "boxes" -> "box"
  }

  if (clean.endsWith('s') && clean.length > 3 && !clean.endsWith('ss')) {
    return clean.slice(0, -1); // e.g. "friends" -> "friend"
  }

  return clean;
}
"""

with open(output_path, "w", encoding="utf-8") as f:
    f.write(js_code)

print(f"Lexicon successfully compiled to {output_path}")
print(f"Total Words in Lexicon: {len(LEXICON)}")
print(f"Total Irregular Lemmas: {len(IRREGULAR_LEMMAS)}")
