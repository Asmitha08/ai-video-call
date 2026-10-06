# -*- coding: utf-8 -*-
"""
Expands build_dataset.py with extensive conversational, tech meeting,
and dictionary corpora across all 25 languages.
"""

def get_more_phrases():
    items = []
    
    # --- Everyday Conversation ---
    items.append(("how was your day", "Greetings & Pleasantries",
        "How was your day?", "ఈ రోజు ఎలా గడిచింది?", "आपका दिन कैसा रहा?", "இன்றைய நாள் எப்படி இருந்தது?", "ನಿಮ್ಮ ದಿನ ಹೇಗಿತ್ತು?", "ദിവസം എങ്ങനെ ഉണ്ടായിരുന്നു?", "तुमचा दिवस कसा गेला?", "আপনার দিনটি কেমন কাটল?", "તમારો દિવસ કેવો રહ્યો?", "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਰਿਹਾ?",
        "¿Cómo estuvo tu día?", "Comment s'est passée votre journée?", "Wie war Ihr Tag?", "你今天过得怎么样？", "今日はどうでしたか？", "오늘 하루 어떠셨나요?", "Como foi o seu dia?", "Com'è andata la tua giornata?", "Как прошел ваш день?", "كيف كان يومك؟",
        "Hoe was je dag?", "Gününüz nasıl geçti?", "Ngày của bạn thế nào?", "วันนี้เป็นอย่างไรบ้าง?", "Bagaimana harimu?"))

    items.append(("i do not know", "Courtesy & Social Expressions",
        "I do not know", "నాకు తెలియదు", "मुझे नहीं पता", "எனக்குத் தெரியாது", "ನನಗೆ ಗೊತ್ತಿಲ್ಲ", "എനിക്കറിയില്ല", "मला माहित नाही", "আমি জানি না", "મને ખબર નથી", "ਮੈਨੂੰ ਨਹੀਂ ਪਤਾ",
        "No lo sé", "Je ne sais pas", "Ich weiß es nicht", "我不知道", "分かりません", "잘 모르겠습니다", "Eu não sei", "Non lo so", "Я не знаю", "لا أعلم",
        "Ik weet het niet", "Bilmiyorum", "Tôi không biết", "ฉันไม่รู้", "Saya tidak tahu"))

    items.append(("i think so", "Opinions, Feelings & Feedback",
        "I think so", "నేను అలానే అనుకుంటున్నాను", "मुझे ऐसा लगता है", "நான் அப்படித்தான் நினைக்கிறேன்", "ನಾನು ಹಾಗೆ ಭಾವಿಸುತ್ತೇನೆ", "ഞാനും അങ്ങനെ കരുതുന്നു", "मला असे वाटते", "আমি তাই মনে করি", "મને એવું લાગે છે", "ਮੈਂ ਵੀ ਇਹੀ ਸੋਚਦਾ ਹਾਂ",
        "Creo que sí", "Je pense que oui", "Ich glaube schon", "我想是的", "そう思います", "그렇게 생각합니다", "Acho que sim", "Penso di sì", "Думаю, да", "أعتقد ذلك",
        "Ik denk het wel", "Sanırım öyle", "Tôi nghĩ vậy", "ฉันคิดอย่างนั้น", "Saya kira demikian"))

    items.append(("i do not think so", "Opinions, Feelings & Feedback",
        "I do not think so", "నేను అలా అనుకోవడం లేదు", "मुझे ऐसा नहीं लगता", "நான் அப்படி நினைக்கவில்லை", "ನಾನು ಹಾಗೆ ಯೋಚಿಸುವುದಿಲ್ಲ", "ഞാൻ അങ്ങനെ കരുതുന്നില്ല", "मला तसे वाटत नाही", "আমি তা মনে করি না", "મને એવું નથી લાગતું", "ਮੈਂ ਅਜਿਹਾ ਨਹੀਂ ਸੋਚਦਾ",
        "No lo creo", "Je ne pense pas", "Das glaube ich nicht", "我不这么认为", "そうは思いません", "그렇지 않다고 생각합니다", "Acho que não", "Non penso", "Я так не думаю", "لا أعتقد ذلك",
        "Ik denk het niet", "Öyle düşünmüyorum", "Tôi không nghĩ vậy", "ฉันไม่คิดอย่างนั้น", "Saya rasa tidak"))

    items.append(("are you ready", "Video Calling & Meetings",
        "Are you ready?", "మీరు సిద్ధంగా ఉన్నారా?", "क्या आप तैयार हैं?", "நீங்கள் தயாரா?", "ನೀವು ಸಿದ್ಧರಿದ್ದೀರಾ?", "നിങ്ങൾ തയ്യാറാണോ?", "तुम्ही तयार आहात का?", "আপনি কি প্রস্তুত?", "તમે તૈયાર છો?", "ਕੀ ਤੁਸੀਂ ਤਿਆਰ ਹੋ?",
        "¿Estás listo?", "Êtes-vous prêt?", "Sind Sie bereit?", "你准备好了吗？", "準備はいいですか？", "준비되셨나요?", "Você está pronto?", "Sei pronto?", "Вы готовы?", "هل أنت مستعد؟",
        "Ben je klaar?", "Hazır mısınız?", "Bạn đã sẵn sàng chưa?", "คุณพร้อมหรือยัง?", "Apakah Anda siap?"))

    items.append(("yes i am ready", "Video Calling & Meetings",
        "Yes, I am ready", "అవును, నేను సిద్ధంగా ఉన్నాను", "हाँ, मैं तैयार हूँ", "ஆம், நான் தயார்", "ಹೌದು, ನಾನು ಸಿದ್ಧನಾಗಿದ್ದೇನೆ", "അതെ, ഞാൻ തയ്യാറാണ്", "होय, मी तयार आहे", "হ্যাঁ, আমি প্রস্তুত", "હા, હું તૈયાર છું", "ਹਾਂ, ਮੈਂ ਤਿਆਰ ਹਾਂ",
        "Sí, estoy listo", "Oui, je suis prêt", "Ja, ich bin bereit", "是的，我准备好了", "はい、準備ができています", "네, 준비되었습니다", "Sim, estou pronto", "Sì, sono pronto", "Да, я готов", "نعم، أنا مستعد",
        "Ja, ik ben klaar", "Evet, hazırım", "Vâng, tôi đã sẵn sàng", "ใช่ ฉันพร้อมแล้ว", "Ya, saya siap"))

    items.append(("please wait a moment", "Video Calling & Meetings",
        "Please wait a moment", "దయచేసి ఒక నిమిషం వేచి ఉండండి", "कृपया एक क्षण प्रतीक्षा करें", "தயவுசெய்து சிறிது நேரம் காத்திருக்கவும்", "ದಯವಿಟ್ಟು ಒಂದು ಕ್ಷಣ ಕಾಯಿರಿ", "ദയവായി ഒരു നിമിഷം കാത്തിരിക്കൂ", "कृपया एक क्षण थांबा", "দয়া করে একটু অপেক্ষা করুন", "કૃપા કરીને એક ક્ષણ રાહ જુઓ", "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਪਲ ਉਡੀਕ ਕਰੋ",
        "Por favor espera un momento", "Veuillez patienter un instant", "Bitte warten Sie einen Augenblick", "请稍等片刻", "少々お待ちください", "잠시만 기다려 주세요", "Por favor, aguarde um momento", "Per favore attendi un attimo", "Пожалуйста, подождите минутку", "يرجى الانتظار لحظة",
        "Even geduld alsjeblieft", "Lütfen bir dakika bekleyin", "Vui lòng đợi một lát", "กรุณารอสักครู่", "Mohon tunggu sebentar"))

    items.append(("i will be right back", "Video Calling & Meetings",
        "I will be right back", "నేను ఇప్పుడే వస్తాను", "मैं अभी वापस आता हूँ", "நான் உடனே வருகிறேன்", "ನಾನು ಈಗಲೇ ಬರುತ್ತೇನೆ", "ഞാൻ ഇപ്പോൾ വരാം", "मी लगेच परत येतो", "আমি এখনই ফিরে আসছি", "હું હમણાં જ પાછો આવું છું", "ਮੈਂ ਹੁਣੇ ਵਾਪਸ ਆਉਂਦਾ ਹਾਂ",
        "Ya vuelvo enseguida", "Je reviens tout de suite", "Ich bin gleich zurück", "我马上回来", "すぐに戻ります", "금방 돌아오겠습니다", "Já volto", "Torno subito", "Я сейчас вернусь", "سأعود فوراً",
        "Ik ben zo terug", "Hemen döneceğim", "Tôi sẽ quay lại ngay", "เดี๋ยวฉันกลับมา", "Saya akan segera kembali"))

    items.append(("can you share your screen", "Video Calling & Meetings",
        "Can you share your screen?", "మీ స్క్రీన్ షేర్ చేయగలరా?", "क्या आप अपनी स्क्रीन साझा कर सकते हैं?", "உங்கள் திரையைப் பகிர முடியுமா?", "ನಿಮ್ಮ ಪರದೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಬಹುದೇ?", "സ്ക്രീൻ പങ്കിടാമോ?", "तुम्ही स्क्रीन शेअर करू शकता का?", "আপনার স্ক্রিন শেয়ার করতে পারেন?", "તમારી સ્ક્રીન શેર કરી શકો છો?", "ਕੀ ਤੁਸੀਂ ਆਪਣੀ ਸਕ੍ਰੀਨ ਸਾਂਝੀ ਕਰ ਸਕਦੇ ਹੋ?",
        "¿Puedes compartir tu pantalla?", "Pouvez-vous partager votre écran?", "Können Sie Ihren Bildschirm freigeben?", "你能共享屏幕吗？", "画面を共有していただけますか？", "화면을 공유해 주시겠어요?", "Você pode compartilhar sua tela?", "Puoi condividere lo schermo?", "Можете поделиться экраном?", "هل يمكنك مشاركة شاشتك؟",
        "Kun je je scherm delen?", "Ekranınızı paylaşabilir misiniz?", "Bạn có thể chia sẻ màn hình không?", "คุณสามารถแชร์หน้าจอได้ไหม?", "Bisakah Anda membagikan layar Anda?"))

    items.append(("my connection is slow", "Video Calling & Meetings",
        "My internet connection is slow", "నా ఇంటర్నెట్ వేగం తక్కువగా ఉంది", "मेरा इंटरनेट कनेक्शन धीमा है", "என் இணைய இணைப்பு மெதுவாக உள்ளது", "ನನ್ನ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ನಿಧಾನವಾಗಿದೆ", "എന്റെ ഇന്റർനെറ്റ് മന്ദഗതിയിലാണ്", "माझे इंटरनेट कनेक्शन संथ आहे", "আমার ইন্টারনেট ধীর গতির", "મારું ઇન્ટરનેટ ધીમું છે", "ਮੇਰਾ ਇੰਟਰਨੈਟ ਹੌਲੀ ਹੈ",
        "Mi conexión es lenta", "Ma connexion est lente", "Meine Verbindung ist langsam", "我的网络连接很慢", "インターネット接続が遅いです", "인터넷 연결이 느립니다", "Minha conexão está lenta", "La mia connessione è lenta", "У меня медленное соединение", "اتصالي بالإنترنت بطيء",
        "Mijn internetverbinding is traag", "İnternet bağlantım yavaş", "Kết nối của tôi bị chậm", "การเชื่อมต่อของฉันช้า", "Koneksi internet saya lambat"))

    items.append(("the audio is breaking up", "Video Calling & Meetings",
        "The audio is breaking up", "వాయిస్ సరిగ్గా వినపడటం లేదు", "आवाज़ कट रही है", "குரல் விட்டு விட்டு கேட்கிறது", "ಧ್ವನಿ ತುಂಡಾಗುತ್ತಿದೆ", "ശബ്ദം മുറിഞ്ഞുപോകുന്നു", "आवाज तुटक येत आहे", "কথা কেটে কেটে আসছে", "અવાજ કપાઈ રહ્યો છે", "ਆਵਾਜ਼ ਕਟ ਰਹੀ ਹੈ",
        "El audio se corta", "Le son est saccadé", "Der Ton bricht ab", "声音断断续续", "音声が途切れています", "소리가 끊깁니다", "O áudio está falhando", "L'audio si interrompe", "Звук прерывается", "الصوت يتقطع",
        "Het geluid hapert", "Ses kesiliyor", "Âm thanh bị giật", "เสียงขาดๆ หายๆ", "Suaranya putus-putus"))

    items.append(("let us take a break", "Video Calling & Meetings",
        "Let us take a short break", "కొద్దిసేపు విరామం తీసుకుందాం", "आइए थोड़ा ब्रेक लेते हैं", "சிறிய இடைவேளை எடுப்போம்", "ಸ್ವಲ್ಪ ವಿರಾಮ ತೆಗೆದುಕೊಳ್ಳೋಣ", "നമുക്ക് ചെറിയൊരു ഇടവേള എടുക്കാം", "चला थोडा ब्रेक घेऊया", "আসুন একটু বিরতি নিই", "ચાલો થોડો વિરામ લઈએ", "ਆਓ ਥੋੜ੍ਹਾ ਬ੍ਰੇਕ ਲਈਏ",
        "Tomemos un descanso", "Faisons une pause", "Machen wir eine kurze Pause", "我们休息一下吧", "少し休憩しましょう", "잠시 쉬어가겠습니다", "Vamos fazer uma pausa", "Facciamo una pausa", "Давайте сделаем перерыв", "فلنأخذ استراحة قصيرة",
        "Laten we een pauze nemen", "Kısa bir ara verelim", "Chúng ta hãy nghỉ giải lao", "พักกันสักครู่เถอะ", "Mari kita istirahat sebentar"))

    items.append(("i have a question", "Questions & Clarifications",
        "I have a question", "నాకు ఒక ప్రశ్న ఉంది", "मेरा एक सवाल है", "எனக்கு ஒரு கேள்வி உள்ளது", "ನನಗೊಂದು ಪ್ರಶ್ನೆ ಇದೆ", "എനിക്കൊരു ചോദ്യമുണ്ട്", "मला एक प्रश्न विचारायचा आहे", "আমার একটি প্রশ্ন আছে", "મારો એક પ્રશ્ન છે", "ਮੇਰਾ ਇੱਕ ਸਵਾਲ ਹੈ",
        "Tengo una pregunta", "J'ai une question", "Ich habe eine Frage", "我有一个问题", "質問があります", "질문이 있습니다", "Eu tenho uma pergunta", "Ho una domanda", "У меня есть вопрос", "لدي سؤال",
        "Ik heb een vraag", "Bir sorum var", "Tôi có một câu hỏi", "ฉันมีคำถาม", "Saya punya pertanyaan"))

    items.append(("what does this mean", "Questions & Clarifications",
        "What does this mean?", "దీని అర్థం ఏమిటి?", "इसका क्या मतलब है?", "இதன் பொருள் என்ன?", "ಇದರ ಅರ್ಥವೇನು?", "ഇതിന്റെ അർത്ഥമെന്താണ്?", "याचा अर्थ काय आहे?", "এর অর্থ কি?", "આનો અર્થ શું છે?", "ਇਸਦਾ ਕੀ ਅਰਥ ਹੈ?",
        "¿Qué significa esto?", "Qu'est-ce que cela signifie?", "Was bedeutet das?", "这是什么意思？", "これはどういう意味ですか？", "이것은 무슨 뜻인가요?", "O que isso significa?", "Cosa significa questo?", "Что это значит?", "ماذا يعني هذا؟",
        "Wat betekent dit?", "Bu ne anlama geliyor?", "Điều này có nghĩa là gì?", "นี่หมายความว่าอย่างไร?", "Apa artinya ini?"))

    items.append(("can you write it down", "Questions & Clarifications",
        "Can you write it down?", "దాన్ని రాసి చూపించగలరా?", "क्या आप इसे लिख सकते हैं?", "அதை எழுதி காட்ட முடியுமா?", "ಅದನ್ನು ಬರೆಯಬಹುದೇ?", "അതൊന്ന് എഴുതി തരുമോ?", "ते लिहून दाखवू शकता का?", "এটা লিখে দিতে পারেন?", "તમે તે લખી શકો છો?", "ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਲਿਖ ਸਕਦੇ ਹੋ?",
        "¿Puedes escribirlo?", "Pouvez-vous l'écrire?", "Können Sie es aufschreiben?", "你能写下来吗？", "書いてもらえますか？", "적어 주실 수 있나요?", "Você pode anotar?", "Puoi scriverlo?", "Вы можете это записать?", "هل يمكنك كتابة ذلك؟",
        "Kun je het opschrijven?", "Yazabilir misiniz?", "Bạn có thể viết ra không?", "ช่วยเขียนลงไปได้ไหม?", "Bisakah Anda menuliskannya?"))

    items.append(("where is the restroom", "Travel, Directions & Daily Life",
        "Where is the restroom?", "వాష్‌రూమ్ ఎక్కడ ఉంది?", "शौचालय कहाँ है?", "கழிப்பறை எங்கே உள்ளது?", "ಶೌಚಾಲಯ ಎಲ್ಲಿದೆ?", "വാഷ്‌റൂം എവിടെയാണ്?", "शौचालय कुठे आहे?", "টয়লেট কোথায়?", "શૌચાલય ક્યાં છે?", "ਟਾਇਲਟ ਕਿੱਥੇ ਹੈ?",
        "¿Dónde está el baño?", "Où sont les toilettes?", "Wo ist die Toilette?", "洗手间在哪里？", "トイレはどこですか？", "화장실이 어디에 있나요?", "Onde fica o banheiro?", "Dov'è il bagno?", "Где находится туалет?", "أين دورة المياه؟",
        "Waar is het toilet?", "Tuvalet nerede?", "Nhà vệ sinh ở đâu?", "ห้องน้ำอยู่ที่ไหน?", "Di mana toiletnya?"))

    items.append(("how much does it cost", "Travel, Directions & Daily Life",
        "How much does this cost?", "దీని ఖరీదు ఎంత?", "इसकी कीमत क्या है?", "இதன் விலை என்ன?", "ಇದರ ಬೆಲೆ ಎಷ್ಟು?", "ഇതിന് എത്ര വിലയാകും?", "याची किंमत किती आहे?", "এর দাম কত?", "આની કિંમત કેટલી છે?", "ਇਸਦੀ ਕੀਮਤ ਕੀ ਹੈ?",
        "¿Cuánto cuesta esto?", "Combien cela coûte-t-il?", "Wie viel kostet das?", "这个多少钱？", "いくらですか？", "얼마인가요?", "Quanto custa isso?", "Quanto costa?", "Сколько это стоит?", "كم يكلف هذا؟",
        "Hoeveel kost dit?", "Bunun fiyatı ne kadar?", "Cái này giá bao nhiêu?", "ราคาเท่าไหร่?", "Berapa harganya ini?"))

    items.append(("call for help", "Travel, Directions & Daily Life",
        "Please call for help!", "దయచేసి సహాయం కోసం పిలవండి!", "कृपया मदद के लिए बुलाएं!", "தயவுசெய்து உதவிக்கு அழைக்கவும்!", "ದಯವಿಟ್ಟು ಸಹಾಯಕ್ಕಾಗಿ ಕರೆಯಿರಿ!", "ദയവായി സഹായത്തിനായി വിളിക്കൂ!", "कृपया मदतीसाठी बोलवा!", "দয়া করে সাহায্যের জন্য ডাকুন!", "કૃપા કરીને મદદ માટે બોલાવો!", "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਲਈ ਬੁਲਾਓ!",
        "¡Por favor pide ayuda!", "Veuillez appeler à l'aide!", "Bitte rufen Sie Hilfe!", "请呼叫救援！", "助けを呼んでください！", "도움을 요청해 주세요!", "Por favor, peça ajuda!", "Per favore chiedi aiuto!", "Пожалуйста, позовите на помощь!", "يرجى طلب المساعدة!",
        "Roep alsjeblieft om hulp!", "Lütfen yardım çağırın!", "Làm ơn gọi giúp đỡ!", "กรุณาเรียกคนมาช่วย!", "Tolong panggil bantuan!"))

    items.append(("happy new year", "Courtesy & Social Expressions",
        "Happy New Year!", "నూతన సంవత్సర శుభాకాంక్షలు!", "नया साल मुबारक हो!", "புத்தாண்டு நல்வாழ்த்துகள்!", "ಹೊಸ ವರ್ಷದ ಶುಭಾಶಯಗಳು!", "പുതുവത്സരാശംസകൾ!", "नवीन वर्षाच्या हार्दिक शुभेच्छा!", "শুভ নববর্ষ!", "નવા વર્ષની શુભેચ્છાઓ!", "ਨਵਾਂ ਸਾਲ ਮੁਬਾਰਕ!",
        "¡Feliz Año Nuevo!", "Bonne Année!", "Frohes neues Jahr!", "新年快乐！", "あけましておめでとうございます！", "새해 복 많이 받으세요!", "Feliz Ano Novo!", "Felice Anno Nuovo!", "С Новым Годом!", "كل عام وأنتم بخير!",
        "Gelukkig Nieuwjaar!", "Yeni yılınız kutlu olsun!", "Chúc mừng năm mới!", "สวัสดีปีใหม่!", "Selamat Tahun Baru!"))

    items.append(("happy birthday", "Courtesy & Social Expressions",
        "Happy Birthday!", "పుట్టినరోజు శుభాకాంక్షలు!", "जन्मदिन मुबारक हो!", "பிறந்தநாள் வாழ்த்துகள்!", "ಹುಟ್ಟುಹಬ್ಬದ ಶುಭಾಶಯಗಳು!", "ജന്മദിനാശംസകൾ!", "वाढदिवसाच्या हार्दिक शुभेच्छा!", "শুভ জন্মদিন!", "જન્મદિવસની શુભેચ્છાઓ!", "ਜਨਮਦਿਨ ਮੁਬਾਰਕ!",
        "¡Feliz Cumpleaños!", "Joyeux Anniversaire!", "Alles Gute zum Geburtstag!", "生日快乐！", "お誕生日おめでとうございます！", "생일 축하합니다!", "Feliz Aniversário!", "Buon Compleanno!", "С Днем Рождения!", "عيد ميلاد سعيد!",
        "Gefeliciteerd met je verjaardag!", "Doğum günün kutlu olsun!", "Chúc mừng sinh nhật!", "สุขสันต์วันเกิด!", "Selamat ulang tahun!"))

    items.append(("please review the pull request", "Work, Code & Technology",
        "Please review the pull request", "దయచేసి పుల్ రిక్వెస్ట్‌ను సమీక్షించండి", "कृपया पुल रिक्वेस्ट की समीक्षा करें", "புல் கோரிக்கையை மதிப்பாய்வு செய்யவும்", "ದಯವಿಟ್ಟು ಪುಲ್ ವಿನಂತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ", "പുൾ അഭ്യർത്ഥന അവലോകനം ചെയ്യുക", "कृपया पुल रिक्वेस्टचे पुनरावलोकन करा", "দয়া করে পুল অনুরোধ পর্যালোচনা করুন", "કૃપા કરીને પુલ વિનંતીની સમીક્ષા કરો", "ਕਿਰਪਾ ਕਰਕੇ ਪੁੱਲ ਬੇਨਤੀ ਦੀ ਸਮੀਖਿਆ ਕਰੋ",
        "Por favor revisa la solicitud de extracción", "Veuillez examiner la demande de tirage", "Bitte überprüfen Sie den Pull Request", "请审查拉取请求", "プルリクエストを確認してください", "풀 리퀘스트를 검토해 주세요", "Por favor, revise o pull request", "Per favore, controlla la pull request", "Пожалуйста, проверьте pull request", "يرجى مراجعة طلب السحب",
        "Controleer het pull-verzoek alsjeblieft", "Lütfen pull request'i inceleyin", "Vui lòng xem xét yêu cầu kéo", "กรุณาตรวจสอบ pull request", "Silakan tinjau pull request"))

    items.append(("the build succeeded", "Work, Code & Technology",
        "The build succeeded with zero errors", "బిల్డ్ ఎటువంటి లోపాలు లేకుండా విజయవంతమైంది", "बिल्ड बिना किसी त्रुटि के सफल रहा", "பில்ட் எந்த பிழையும் இல்லாமல் வெற்றிகரமாக முடிந்தது", "ಯಾವುದೇ ದೋಷವಿಲ್ಲದೆ ಬಿಲ್ಡ್ ಯಶಸ್ವಿಯಾಗಿದೆ", "ഒരു പിശകുമില്ലാതെ ബിൽഡ് വിജയകരമായി", "कोणत्याही त्रुटीशिवाय बिल्ड यशस्वी झाले", "বিল্ড সফলভাবে সম্পন্ন হয়েছে", "બિલ્ડ કોઈપણ ભૂલ વિના સફળ થયું", "ਬਿਲਡ ਬਿਨਾਂ ਕਿਸੇ ਗਲਤੀ ਦੇ ਸਫਲ ਰਿਹਾ",
        "La compilación fue exitosa", "La compilation a réussi sans erreur", "Der Build war erfolgreich", "构建成功，零错误", "ビルドは正常に成功しました", "빌드가 오류 없이 성공했습니다", "A compilação foi bem-sucedida", "La build è riuscita senza errori", "Сборка прошла успешно без ошибок", "نجح البناء بدون أخطاء",
        "De build is succesvol voltooid", "Derleme hatasız başarılı oldu", "Bản dựng thành công không có lỗi", "การสร้างสำเร็จโดยไม่มีข้อผิดพลาด", "Build berhasil tanpa kesalahan"))

    items.append(("what is the wifi password", "Travel, Directions & Daily Life",
        "What is the Wi-Fi password?", "వైఫై పాస్‌వర్డ్ ఏమిటి?", "वाई-फ़ाई पासवर्ड क्या है?", "வைஃபை கடவுச்சொல் என்ன?", "ವೈಫೈ ಪಾಸ್‌ವರ್ಡ್ ಏನು?", "വൈഫൈ പാസ്‌വേഡ് എന്താണ്?", "वायफाय पासवर्ड काय आहे?", "ওয়াইফাই পাসওয়ার্ড কি?", "વાઇફાઇ પાસવર્ડ શું છે?", "ਵਾਈ-ਫਾਈ ਪਾਸਵਰਡ ਕੀ ਹੈ?",
        "¿Cuál es la contraseña del wifi?", "Quel est le mot de passe Wi-Fi?", "Wie lautet das WLAN-Passwort?", "Wi-Fi密码是多少？", "Wi-Fiのパスワードは何ですか？", "와이파이 비밀번호가 무엇인가요?", "Qual é a senha do Wi-Fi?", "Qual è la password del Wi-Fi?", "Какой пароль от Wi-Fi?", "ما هي كلمة سر الواي فاي؟",
        "Wat is het wifi-wachtwoord?", "Wi-Fi şifresi nedir?", "Mật khẩu Wi-Fi là gì?", "รหัสผ่าน Wi-Fi คืออะไร?", "Apa kata sandi Wi-Fi?"))

    items.append(("where can i find a taxi", "Travel, Directions & Daily Life",
        "Where can I find a taxi?", "టాక్సీ ఎక్కడ దొరుకుతుంది?", "टैक्सी कहाँ मिल सकती है?", "டாக்ஸி எங்கு கிடைக்கும்?", "ಟ್ಯಾಕ್ಸಿ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?", "ടാക്സി എവിടെ കിട്ടും?", "टॅक्सी कुठे मिळेल?", "ট্যাক্সি কোথায় পাব?", "ટેક્સી ક્યાં મળશે?", "ਟੈਕਸੀ ਕਿੱਥੇ ਮਿਲੇਗੀ?",
        "¿Dónde puedo conseguir un taxi?", "Où puis-je trouver un taxi?", "Wo finde ich ein Taxi?", "在哪里可以叫到出租车？", "タクシーはどこで乗れますか？", "택시는 어디서 탈 수 있나요?", "Onde posso pegar um táxi?", "Dove posso trovare un taxi?", "Где я могу найти такси?", "أين يمكنني أن أجد سيارة أجرة؟",
        "Waar kan ik een taxi vinden?", "Nereden taksi bulabilirim?", "Tôi có thể tìm taxi ở đâu?", "ฉันจะหารถแท็กซี่ได้ที่ไหน?", "Di mana saya bisa menemukan taksi?"))

    items.append(("i need a doctor", "Travel, Directions & Daily Life",
        "I need a doctor immediately", "నాకు వెంటనే వైద్యుడు కావాలి", "मुझे तुरंत डॉक्टर की ज़रूरत है", "எனக்கு உடனடியாக ஒரு மருத்துவர் தேவை", "ನನಗೆ ತಕ್ಷಣ ವೈದ್ಯರು ಬೇಕು", "എനിക്ക് ഉടൻ ഒരു ഡോക്ടറെ വേണം", "मला त्वरित डॉक्टरांची गरज आहे", "আমার অবিলম্বে একজন ডাক্তার দরকার", "મને તાત્કાલિક ડૉક્ટરની જરૂર છે", "ਮੈਨੂੰ ਤੁਰੰਤ ਡਾਕਟਰ ਦੀ ਲੋੜ ਹੈ",
        "Necesito un médico urgentemente", "J'ai besoin d'un médecin immédiatement", "Ich brauche sofort einen Arzt", "我需要立即看医生", "至急医者が必要です", "지금 의사가 필요합니다", "Preciso de um médico imediatamente", "Ho bisogno subito di un medico", "Мне срочно нужен врач", "أحتاج إلى طبيب فوراً",
        "Ik heb meteen een dokter nodig", "Acilen bir doktora ihtiyacım var", "Tôi cần một bác sĩ ngay lập tức", "ฉันต้องการหมอเดี๋ยวนี้", "Saya butuh dokter segera"))

    items.append(("it is a pleasure to work with you", "Opinions, Feelings & Feedback",
        "It is a pleasure to work with you", "మీతో పనిచేయడం చాలా సంతోషంగా ఉంది", "आपके साथ काम करके खुशी हुई", "உங்களுடன் பணியாற்றுவது மகிழ்ச்சி அளிக்கிறது", "ನಿಮ್ಮೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುವುದು ಸಂತೋಷದಾಯಕ", "നിങ്ങളോടൊപ്പം പ്രവർത്തിക്കുന്നത് സന്തോഷകരമാണ്", "तुमच्यासोबत काम करून आनंद झाला", "আপনার সাথে কাজ করতে পেরে ভালো লাগছে", "તમારી સાથે કામ કરવાનો આનંદ છે", "ਤੁਹਾਡੇ ਨਾਲ ਕੰਮ ਕਰਕੇ ਖੁਸ਼ੀ ਹੋਈ",
        "Es un placer trabajar contigo", "C'est un plaisir de travailler avec vous", "Es ist eine Freude, mit Ihnen zu arbeiten", "很高兴能与您共事", "ご一緒にお仕事ができて光栄です", "함께 일하게 되어 기쁩니다", "É um prazer trabalhar com você", "È un piacere lavorare con te", "Приятно работать с вами", "يسعدني العمل معك",
        "Het is een genoegen om met je te werken", "Sizinle çalışmak bir zevk", "Rất vui được làm việc với bạn", "ยินดีที่ได้ร่วมงานกับคุณ", "Senang bekerja sama dengan Anda"))

    return items

def get_more_vocab():
    items = []
    # Days of the week
    items.append(("monday", "Monday", "సోమవారం", "सोमवार", "திங்கட்கிழமை", "ಸೋಮವಾರ", "തിങ്കളാഴ്ച", "सोमवार", "সোমবার", "સોમવાર", "ਸੋਮਵਾਰ", "lunes", "lundi", "Montag", "星期一", "月曜日", "월요일", "segunda-feira", "lunedì", "понедельник", "الاثنين", "maandag", "pazartesi", "thứ hai", "วันจันทร์", "senin"))
    items.append(("tuesday", "Tuesday", "మంగళవారం", "मंगलवार", "செவ்வாய்க்கிழமை", "ಮಂಗಳವಾರ", "ചൊവ്വാഴ്ച", "मंगळवार", "মঙ্গলবার", "મંગળવાર", "ਮੰਗਲਵਾਰ", "martes", "mardi", "Dienstag", "星期二", "火曜日", "화요일", "terça-feira", "martedì", "вторник", "الثلاثاء", "dinsdag", "salı", "thứ ba", "วันอังคาร", "selasa"))
    items.append(("wednesday", "Wednesday", "బుధవారం", "बुधवार", "புதன்கிழமை", "ಬುಧವಾರ", "ಬುಧನಾഴ്ച", "बुधवार", "বুধবার", "બુધવાર", "ਬੁੱਧਵਾਰ", "miércoles", "mercredi", "Mittwoch", "星期三", "水曜日", "수요일", "quarta-feira", "mercoledì", "среда", "الأربعاء", "woensdag", "çarşamba", "thứ tư", "วันพุธ", "rabu"))
    items.append(("thursday", "Thursday", "గురువారం", "गुरुवार", "வியாழக்கிழமை", "ಗುರುವಾರ", "വ്യാഴാഴ്ച", "गुरुवार", "বৃহস্পতিবার", "ગુરુવાર", "ਵੀਰਵਾਰ", "jueves", "jeudi", "Donnerstag", "星期四", "木曜日", "목요일", "quinta-feira", "giovedì", "четверг", "الخميس", "donderdag", "perşembe", "thứ năm", "วันพฤหัสบดี", "kamis"))
    items.append(("friday", "Friday", "శుక్రవారం", "शुक्रवार", "வெள்ளிக்கிழமை", "ಶುಕ್ರವಾರ", "വെള്ളിയാഴ്ച", "शुक्रवार", "শুক্রবার", "શુક્રવાર", "ਸ਼ੁੱਕਰਵਾਰ", "viernes", "vendredi", "Freitag", "星期五", "金曜日", "금요일", "sexta-feira", "venerdì", "пятница", "الجمعة", "vrijdag", "cuma", "thứ sáu", "วันศุกร์", "jumat"))
    items.append(("saturday", "Saturday", "శనివారం", "शनिवार", "சனிக்கிழமை", "ಶನಿವಾರ", "ശനിയാഴ്ച", "शनिवार", "শনিবার", "શનિવાર", "ਸ਼ਨੀਵਾਰ", "sábado", "samedi", "Samstag", "星期六", "土曜日", "토요일", "sábado", "sabato", "суббота", "السبت", "zaterdag", "cumartesi", "thứ bảy", "วันเสาร์", "sabtu"))
    items.append(("sunday", "Sunday", "ఆదివారం", "रविवार", "ஞாயிற்றுக்கிழமை", "ಭಾನುವಾರ", "ഞಾಯറാഴ്ച", "रविवार", "রবিবার", "રવિવાર", "ਐਤਵਾਰ", "domingo", "dimanche", "Sonntag", "星期日", "日曜日", "일요일", "domingo", "domenica", "воскресенье", "الأحد", "zondag", "pazar", "chủ nhật", "วันอาทิตย์", "minggu"))

    # Time units
    items.append(("day", "day", "రోజు", "दिन", "நாள்", "ದಿನ", "ദിവസം", "दिवस", "দিন", "દિવસ", "ਦਿਨ", "día", "jour", "Tag", "天", "日", "날", "dia", "giorno", "день", "يوم", "dag", "gün", "ngày", "วัน", "hari"))
    items.append(("week", "week", "వారం", "सप्ताह", "வாரம்", "ವಾರ", "ആഴ്ച", "आठवडा", "সপ্তাহ", "અઠવાડિયું", "ਹਫ਼ਤਾ", "semana", "semaine", "Woche", "周", "週", "주", "semana", "settimana", "неделя", "أسبوع", "week", "hafta", "tuần", "สัปดาห์", "minggu"))
    items.append(("month", "month", "నెల", "महीना", "மாதம்", "ತಿಂಗಳು", "മാസം", "महिना", "মাস", "મહિનો", "મਹੀਨਾ", "mes", "mois", "Monat", "月", "月", "달", "mês", "mese", "месяц", "شهر", "maand", "ay", "tháng", "เดือน", "bulan"))
    items.append(("year", "year", "సంవత్సరం", "वर्ष", "ஆண்டு", "ವರ್ಷ", "വർഷം", "वर्ष", "বছর", "વર્ષ", "ਸਾਲ", "año", "année", "Jahr", "年", "年", "년", "ano", "anno", "год", "سنة", "jaar", "yıl", "năm", "ปี", "tahun"))
    items.append(("hour", "hour", "గంట", "घंटा", "மணி", "ಗಂಟೆ", "മണിക്കൂർ", "तास", "ঘণ্টা", "કલાક", "ਘੰਟਾ", "hora", "heure", "Stunde", "小时", "時間", "시간", "hora", "ora", "час", "ساعة", "uur", "saat", "giờ", "ชั่วโมง", "jam"))
    items.append(("minute", "minute", "నిమిషం", "मिनट", "நிமிடம்", "ನಿಮಿಷ", "മിനിറ്റ്", "मिनिट", "মিনিট", "મિનિટ", "ਮਿੰਟ", "minuto", "minute", "Minute", "分钟", "分", "분", "minuto", "minuto", "минута", "دقيقة", "minuut", "dakika", "phút", "นาที", "menit"))

    # Common objects & concepts
    items.append(("water", "water", "నీరు", "पानी", "தண்ணீர்", "ನೀರು", "വെള്ളം", "पाणी", "জল", "પાણી", "પાણી", "agua", "eau", "Wasser", "水", "水", "물", "água", "acqua", "вода", "ماء", "water", "su", "nước", "น้ำ", "air"))
    items.append(("food", "food", "ఆహారం", "खाना", "உணவு", "ಆಹಾರ", "ഭക്ഷണം", "अन्न", "খাবার", "ખોરાક", "ਭੋਜਨ", "comida", "nourriture", "Essen", "食物", "食べ物", "음식", "comida", "cibo", "еда", "طعام", "voedsel", "yemek", "thức ăn", "อาหาร", "makanan"))
    items.append(("friend", "friend", "స్నేహితుడు", "दोस्त", "நண்பர்", "ಸ್ನೇಹಿತ", "സുഹൃത്ത്", "मित्र", "বন্ধু", "મિત્ર", "ਦੋਸਤ", "amigo", "ami", "Freund", "朋友", "友達", "친구", "amigo", "amico", "друг", "صديق", "vriend", "arkadaş", "bạn bè", "เพื่อน", "teman"))
    items.append(("family", "family", "కుటుంబం", "परिवार", "குடும்பம்", "ಕುಟುಂಬ", "കുടുംബം", "कुटुंब", "পরিবার", "પરિવાર", "ਪਰਿਵਾਰ", "familia", "famille", "Familie", "家庭", "家族", "가족", "família", "famiglia", "семья", "عائلة", "familie", "aile", "gia đình", "ครอบครัว", "keluarga"))
    items.append(("home", "home", "ఇల్లు", "घर", "வீடு", "ಮನೆ", "വീട്", "घर", "বাড়ি", "ઘર", "ਘਰ", "casa", "maison", "Zuhause", "家", "家", "집", "casa", "casa", "дом", "منزل", "thuis", "ev", "nhà", "บ้าน", "rumah"))
    items.append(("office", "office", "కార్యాలయం", "कार्यालय", "அலுவலகம்", "ಕಚೇರಿ", "ഓഫീസ്", "कार्यालय", "অফিস", "ઓફિસ", "ਦਫ਼ਤਰ", "oficina", "bureau", "Büro", "办公室", "オフィス", "사무실", "escritório", "ufficio", "офис", "مكتب", "kantoor", "ofis", "văn phòng", "สำนักงาน", "kantor"))
    items.append(("money", "money", "డబ్బు", "पैसा", "பணம்", "ಹಣ", "പണം", "पैसा", "টাকা", "પૈસા", "ਪੈਸੇ", "dinero", "argent", "Geld", "钱", "お金", "돈", "dinheiro", "denaro", "деньги", "مال", "geld", "para", "tiền", "เงิน", "uang"))
    items.append(("problem", "problem", "సమస్య", "समस्या", "பிரச்சனை", "ಸಮಸ್ಯೆ", "പ്രശ്നം", "समस्या", "সমস্যা", "સમસ્યા", "ਸਮੱਸਿਆ", "problema", "problème", "Problem", "问题", "問題", "문제", "problema", "problema", "проблема", "مشكلة", "probleem", "sorun", "vấn đề", "ปัญหา", "masalah"))
    items.append(("solution", "solution", "పరిష్కారం", "समाधान", "தீர்வு", "ಪರಿಹಾರ", "പരിഹാരം", "तोडगा", "সমাধান", "ઉકેલ", "ਹੱਲ", "solución", "solution", "Lösung", "解决方案", "解決策", "해결책", "solução", "soluzione", "решение", "حل", "oplossing", "çözüm", "giải pháp", "วิธีแก้ปัญหา", "solusi"))
    items.append(("question", "question", "ప్రశ్న", "सवाल", "கேள்வி", "ಪ್ರಶ್ನೆ", "ചோദ്യം", "प्रश्न", "प्रश्न", "પ્રશ્ન", "ਸਵਾਲ", "pregunta", "question", "Frage", "问题", "質問", "질문", "pergunta", "domanda", "вопрос", "سؤال", "vraag", "soru", "câu hỏi", "คำถาม", "pertanyaan"))
    items.append(("answer", "answer", "సమాధానం", "उत्तर", "பதில்", "ಉತ್ತರ", "ഉത്തരം", "उत्तर", "উত্তর", "જવાબ", "ਜਵਾਬ", "respuesta", "réponse", "Antwort", "答案", "答え", "답변", "resposta", "risposta", "ответ", "إجابة", "antwoord", "cevap", "câu trả lời", "คำตอบ", "jawaban"))

    # Tech & Software vocabulary
    items.append(("code", "code", "కోడ్", "कोड", "குறியீடு", "ಕೋಡ್", "കോഡ്", "कोड", "কোড", "કોડ", "ਕੋਡ", "código", "code", "Code", "代码", "コード", "코드", "código", "codice", "код", "شفرة", "code", "kod", "mã", "โค้ด", "kode"))
    items.append(("data", "data", "డేటా", "डेटा", "தரவு", "ಡೇಟಾ", "ഡാറ്റ", "डेटा", "উপাত্ত", "ડેટા", "ਡਾਟਾ", "datos", "données", "Daten", "数据", "データ", "데이터", "dados", "dati", "данные", "بيانات", "gegevens", "veri", "dữ liệu", "ข้อมูล", "data"))
    items.append(("file", "file", "ఫైల్", "फ़ाइल", "கோப்பு", "ಕಡತ", "ഫയൽ", "फाइल", "ফাইল", "ફાઇલ", "ਫ਼ਾਈਲ", "archivo", "fichier", "Datei", "文件", "ファイル", "파일", "arquivo", "file", "файл", "ملف", "bestand", "dosya", "tệp", "ไฟล์", "berkas"))
    items.append(("server", "server", "సర్వర్", "सर्वर", "சேவையகம்", "ಸರ್ವರ್", "സെർവർ", "सर्व्हर", "সার্ভার", "સર્વર", "ਸਰਵਰ", "servidor", "serveur", "Server", "服务器", "サーバー", "서버", "servidor", "server", "сервер", "خادم", "server", "sunucu", "máy chủ", "เซิร์ฟเวอร์", "server"))
    items.append(("network", "network", "నెట్‌వర్క్", "नेटवर्क", "பிணையம்", "ನೆಟ್‌వర్ಕ್", "നെറ്റ്‌വർക്ക്", "नेटवर्क", "নেটওয়ার্ক", "નેટવર્ક", "ਨੈੱਟਵਰਕ", "red", "réseau", "Netzwerk", "网络", "ネットワーク", "네트워크", "rede", "rete", "сеть", "شبكة", "netwerk", "ağ", "mạng", "เครือข่าย", "jaringan"))
    items.append(("team", "team", "బృందం", "टीम", "குழு", "ತಂಡ", "ടീം", "संघ", "দল", "ટીમ", "ਟੀਮ", "equipo", "équipe", "Team", "团队", "チーム", "팀", "equipe", "squadra", "команда", "فريق", "team", "takım", "đội", "ทีม", "tim"))
    items.append(("fast", "fast", "వేగంగా", "तेज़", "வேகமாக", "ವೇಗ", "ವೇಗത്തിൽ", "जलद", "দ্রুত", "ઝડપી", "ਤੇਜ਼", "rápido", "rapide", "schnell", "快", "速い", "빠른", "rápido", "veloce", "быстрый", "سريع", "snel", "hızlı", "nhanh", "เร็ว", "cepat"))
    items.append(("slow", "slow", "నెమ్మదిగా", "धीमा", "மெதுவாக", "ನಿಧಾನ", "പതുക്കെ", "हळू", "ধীর", "ધીમું", "ਹੌਲੀ", "lento", "lent", "langsam", "慢", "遅い", "느린", "lento", "lento", "медленный", "بطيء", "traag", "yavaş", "chậm", "ช้า", "lambat"))
    items.append(("easy", "easy", "సులభం", "आसान", "எளிது", "ಸುಲಭ", "ಎളുപ്പമുള്ള", "सोपे", "সহজ", "સરળ", "ਆਸਾਨ", "fácil", "facile", "einfach", "容易", "簡単", "쉬운", "fácil", "facile", "легкий", "سهل", "makkelijk", "kolay", "dễ", "ง่าย", "mudah"))
    items.append(("hard", "hard", "కష్టం", "कठिन", "கடினம்", "ಕಠಿಣ", "കഠിനമായ", "कठीण", "કઠિન", "મુશ્કેલ", "ਔਖਾ", "difícil", "difficile", "schwierig", "难", "難しい", "어려운", "difícil", "difficile", "трудный", "صعب", "moeilijk", "zor", "khó", "ยาก", "sulit"))

    # Common Numbers 20, 100, 1000
    items.append(("twenty", "twenty", "ఇరవై", "बीस", "இருபது", "ಇಪ್ಪತ್ತು", "ഇരുపത്", "वीस", "কুড়ি", "વીસ", "ਵੀਹ", "veinte", "vingt", "zwanzig", "二十", "二十", "스물", "vinte", "venti", "двадцать", "عشرون", "twintig", "yirmi", "hai mươi", "ยี่สิบ", "dua puluh"))
    items.append(("hundred", "hundred", "వంద", "सौ", "நூறு", "ನೂರು", "നൂറ്", "शंभर", "একশত", "સો", "ਸੌ", "cien", "cent", "hundert", "百", "百", "백", "cem", "cento", "сто", "مائة", "honderd", "yüz", "một trăm", "หนึ่งร้อย", "seratus"))
    # High frequency verbs & nouns
    items.append(("have", "have", "కలిగి ఉంది", "पास है", "வைத்திருங்கள்", "ಹೊಂದಿದೆ", "ഉണ്ട്", "आहे", "আছে", "પાસે છે", "ਕੋਲ ਹੈ", "tener", "avoir", "haben", "有", "持っている", "가지다", "ter", "avere", "иметь", "يمتلك", "hebben", "sahip olmak", "có", "มี", "memiliki"))
    items.append(("want", "want", "కావాలి", "चाहिए", "வேண்டும்", "ಬೇಕು", "വേണം", "हवे", "চাই", "જોઈએ", "ਚਾਹੀਦਾ", "querer", "vouloir", "wollen", "想要", "欲しい", "원하다", "querer", "volere", "хотеть", "يريد", "willen", "istemek", "muốn", "ต้องการ", "ingin"))
    items.append(("need", "need", "అవసరం", "ज़रूरत", "தேவை", "ಅಗತ್ಯವಿದೆ", "ആവശ്യമുണ്ട്", "गरज", "প্রয়োজন", "જરૂર", "ਲੋੜ", "necesitar", "avoir besoin", "brauchen", "需要", "必要", "필요하다", "precisar", "aver bisogno", "нуждаться", "يحتاج", "nodig hebben", "ihtiyacı olmak", "cần", "จำเป็น", "butuh"))
    items.append(("like", "like", "ఇష్టం", "पसंद", "பிடிக்கும்", "ಇಷ್ಟ", "ഇഷ്ടമാണ്", "आवडते", "পছন্দ", "ગમે છે", "ਪਸੰਦ", "gustar", "aimer", "mögen", "喜欢", "好き", "좋아하다", "gostar", "piacere", "нравиться", "يعجب", "leuk vinden", "beğenmek", "thích", "ชอบ", "suka"))
    items.append(("give", "give", "ఇవ్వండి", "दीजिए", "கொடுங்கள்", "ಕೊಡಿ", "നൽകുക", "द्या", "দিন", "આપો", "ਦਿਓ", "dar", "donner", "geben", "给", "与える", "주다", "dar", "dare", "давать", "يعطي", "geven", "vermek", "cho", "ให้", "memberi"))
    items.append(("take", "take", "తీసుకోండి", "लीजिए", "எடுங்கள்", "ತೆಗೆದುಕೊಳ್ಳಿ", "എടുക്കുക", "घ्या", "নিন", "લો", "ਲਵੋ", "tomar", "prendre", "nehmen", "拿", "取る", "가져가다", "pegar", "prendere", "брать", "يأخذ", "nemen", "almak", "lấy", "เอา", "mengambil"))
    items.append(("room", "room", "గది", "कमरा", "அறை", "ಕೋಣೆ", "മുറി", "खोली", "ঘর", "રૂમ", "ਕਮਰਾ", "habitación", "chambre", "Zimmer", "房间", "部屋", "방", "quarto", "stanza", "комната", "غرفة", "kamer", "oda", "phòng", "ห้อง", "kamar"))
    items.append(("number", "number", "సంఖ్య", "संख्या", "எண்", "ಸಂಖ್ಯೆ", "നമ്പർ", "संख्या", "সংখ্যা", "નંબર", "ਨੰਬਰ", "número", "numéro", "Nummer", "号码", "番号", "번호", "número", "numero", "номер", "رقم", "nummer", "numara", "số", "หมายเลข", "nomor"))

    return items

print("Enrichment module ready.")
