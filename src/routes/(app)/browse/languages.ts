// full list: https://github.com/meikidd/iso-639-1/blob/master/src/data.js
export const ISOLanguages = [
	{ code: 'all', name: 'All', nativeName: 'All' },
	{ code: 'installed', name: 'Installed', nativeName: 'Installed' },
	{ code: 'updates pending', name: 'Updates pending', nativeName: 'Updates pending' },
	{ code: 'other', name: 'other langs?', nativeName: 'Other' },
	{ code: 'localsourcelang', name: 'Local source', nativeName: 'Local source' },
	{ code: 'en', name: 'English', nativeName: 'English' },
	{ code: 'ca', name: 'Catalan; Valencian', nativeName: 'Català' },
	{ code: 'de', name: 'German', nativeName: 'Deutsch' },
	{ code: 'es', name: 'Spanish; Castilian', nativeName: 'Español' },
	{ code: 'es-419', name: 'Spanish; Castilian', nativeName: 'Español (Latinoamérica)' },
	{ code: 'fr', name: 'French', nativeName: 'Français' },
	{ code: 'id', name: 'Indonesian', nativeName: 'Indonesia' },
	{ code: 'it', name: 'Italian', nativeName: 'Italiano' },
	{ code: 'pt', name: 'Portuguese', nativeName: 'Português' },
	{ code: 'pt-pt', name: 'Portuguese', nativeName: 'Português (Portugal)' },
	{ code: 'pt-br', name: 'Portuguese; Brasil', nativeName: 'Português (Brasil)' },
	{ code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
	{ code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
	{ code: 'ru', name: 'Russian', nativeName: 'русский' },
	{ code: 'ar', name: 'Arabic', nativeName: 'العربية' },
	{ code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
	{ code: 'th', name: 'Thai', nativeName: 'ไทย' },
	{ code: 'zh', name: 'Chinese', nativeName: '中文' },
	{ code: 'zh-hans', name: 'Chinese', nativeName: '中文 (HANS)' },
	{ code: 'zh-hant', name: 'Chinese', nativeName: '中文 (HANT)' },
	{ code: 'zh-rhk', name: 'Chinese', nativeName: '中文 (RHK)' },
	{ code: 'zh-rtw', name: 'Chinese', nativeName: '中文 (RTW)' },
	{ code: 'ja', name: 'Japanese', nativeName: '日本語' },
	{ code: 'ko', name: 'Korean', nativeName: '한국어' },
	{ code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
	{ code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
	{ code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
	{ code: 'ro', name: 'Romanian', nativeName: 'Română' },
	{ code: 'bg', name: 'Bulgarian', nativeName: 'български' },
	{ code: 'cs', name: 'Czech', nativeName: 'čeština' },
	{ code: 'pl', name: 'Polish', nativeName: 'polski' },
	{ code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
	{ code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
	{ code: 'my', name: 'Burmese', nativeName: 'ဗမာစာ' },
	{ code: 'ms', name: 'Malay', nativeName: 'Malaysia' },
	{ code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
	{ code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
	{ code: 'ku', name: 'Kurdish', nativeName: 'Kurdî' },
	{ code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
	{ code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
	{ code: 'he', name: 'Hebrew', nativeName: 'עברית' },
	{ code: 'fil', name: 'Filipino', nativeName: 'Filipino' },
	{ code: 'fi', name: 'Finnish', nativeName: 'suomi' },
	{ code: 'fa', name: 'Persian', nativeName: 'فارسی' },
	{ code: 'eu', name: 'Basque', nativeName: 'euskara' },
	{ code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
	{ code: 'da', name: 'Danish', nativeName: 'dansk' },
	{ code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
	{ code: 'lt', name: 'Lithuanian', nativeName: 'lietuvių kalba' },
	{ code: 'sh', name: 'Serbo-Croatian', nativeName: 'srpskohrvatski' },
	{ code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
	{ code: 'ak', name: 'Akan', nativeName: 'Akan' },
	{ code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
	{ code: 'an', name: 'Aragonese', nativeName: 'aragonés' },
	{ code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
	{ code: 'av', name: 'Avaric', nativeName: 'авар мацӀ' },
	{ code: 'ay', name: 'Aymara', nativeName: 'aymar aru' },
	{ code: 'az', name: 'Azerbaijani', nativeName: 'azərbaycan dili' },
	{ code: 'ba', name: 'Bashkir', nativeName: 'башҡорт теле' },
	{ code: 'be', name: 'Belarusian', nativeName: 'беларуская мова' },
	{ code: 'bi', name: 'Bislama', nativeName: 'Bislama' },
	{ code: 'bm', name: 'Bambara', nativeName: 'bamanankan' },
	{ code: 'bo', name: 'Tibetan', nativeName: 'བོད་ཡིག' },
	{ code: 'br', name: 'Breton', nativeName: 'brezhoneg' },
	{ code: 'bs', name: 'Bosnian', nativeName: 'bosanski jezik' },
	{ code: 'ce', name: 'Chechen', nativeName: 'нохчийн мотт' },
	{ code: 'ch', name: 'Chamorro', nativeName: 'Chamoru' },
	{ code: 'co', name: 'Corsican', nativeName: 'corsu' },
	{ code: 'cr', name: 'Cree', nativeName: 'ᓀᐦᐃᔭᐍᐏᐣ' },
	{ code: 'cu', name: 'Old Church Slavonic', nativeName: 'ѩзыкъ словѣньскъ' },
	{ code: 'cv', name: 'Chuvash', nativeName: 'чӑваш чӗлхи' },
	{ code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
	{ code: 'dv', name: 'Divehi', nativeName: 'ދިވެހި' },
	{ code: 'dz', name: 'Dzongkha', nativeName: 'རྫོང་ཁ' },
	{ code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe' },
	{ code: 'eo', name: 'Esperanto', nativeName: 'Esperanto' },
	{ code: 'et', name: 'Estonian', nativeName: 'eesti' },
	{ code: 'ff', name: 'Fula', nativeName: 'Fulfulde' },
	{ code: 'fj', name: 'Fijian', nativeName: 'vosa Vakaviti' },
	{ code: 'fo', name: 'Faroese', nativeName: 'føroyskt' },
	{ code: 'fy', name: 'Western Frisian', nativeName: 'Frysk' },
	{ code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
	{ code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig' },
	{ code: 'gl', name: 'Galician', nativeName: 'galego' },
	{ code: 'gn', name: 'Guaraní', nativeName: "Avañe'ẽ" },
	{ code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
	{ code: 'gv', name: 'Manx', nativeName: 'Gaelg' },
	{ code: 'ha', name: 'Hausa', nativeName: 'هَوُسَ' },
	{ code: 'ho', name: 'Hiri Motu', nativeName: 'Hiri Motu' },
	{ code: 'ht', name: 'Haitian', nativeName: 'Kreyòl ayisyen' },
	{ code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
	{ code: 'hz', name: 'Herero', nativeName: 'Otjiherero' },
	{ code: 'ia', name: 'Interlingua', nativeName: 'Interlingua' },
	{ code: 'ie', name: 'Interlingue', nativeName: 'Interlingue' },
	{ code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo' },
	{ code: 'ii', name: 'Nuosu', nativeName: 'ꆈꌠ꒿ Nuosuhxop' },
	{ code: 'ik', name: 'Inupiaq', nativeName: 'Iñupiaq' },
	{ code: 'io', name: 'Ido', nativeName: 'Ido' },
	{ code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
	{ code: 'iu', name: 'Inuktitut', nativeName: 'ᐃᓄᒃᑎᑐᑦ' },
	{ code: 'jv', name: 'Javanese', nativeName: 'basa Jawa' },
	{ code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
	{ code: 'kg', name: 'Kongo', nativeName: 'Kikongo' },
	{ code: 'ki', name: 'Kikuyu', nativeName: 'Gĩkũyũ' },
	{ code: 'kj', name: 'Kwanyama', nativeName: 'Kuanyama' },
	{ code: 'kk', name: 'Kazakh', nativeName: 'қазақ тілі' },
	{ code: 'kl', name: 'Kalaallisut', nativeName: 'kalaallisut' },
	{ code: 'km', name: 'Khmer', nativeName: 'ខេមរភាសា' },
	{ code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
	{ code: 'kr', name: 'Kanuri', nativeName: 'Kanuri' },
	{ code: 'ks', name: 'Kashmiri', nativeName: 'कश्मीरी' },
	{ code: 'kv', name: 'Komi', nativeName: 'коми кыв' },
	{ code: 'kw', name: 'Cornish', nativeName: 'Kernewek' },
	{ code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
	{ code: 'la', name: 'Latin', nativeName: 'latine' },
	{ code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch' },
	{ code: 'lg', name: 'Ganda', nativeName: 'Luganda' },
	{ code: 'li', name: 'Limburgish', nativeName: 'Limburgs' },
	{ code: 'ln', name: 'Lingala', nativeName: 'Lingála' },
	{ code: 'lo', name: 'Lao', nativeName: 'ພາສາລາວ' },
	{ code: 'lu', name: 'Luba-Katanga', nativeName: 'Kiluba' },
	{ code: 'lv', name: 'Latvian', nativeName: 'latviešu valoda' },
	{ code: 'mg', name: 'Malagasy', nativeName: 'fiteny malagasy' },
	{ code: 'mh', name: 'Marshallese', nativeName: 'Kajin M̧ajeļ' },
	{ code: 'mi', name: 'Māori', nativeName: 'te reo Māori' },
	{ code: 'mk', name: 'Macedonian', nativeName: 'македонски јазик' },
	{ code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
	{ code: 'mt', name: 'Maltese', nativeName: 'Malti' },
	{ code: 'na', name: 'Nauru', nativeName: 'Dorerin Naoero' },
	{ code: 'nb', name: 'Norwegian Bokmål', nativeName: 'Norsk bokmål' },
	{ code: 'nd', name: 'Northern Ndebele', nativeName: 'isiNdebele' },
	{ code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
	{ code: 'ng', name: 'Ndonga', nativeName: 'Owambo' },
	{ code: 'nn', name: 'Norwegian Nynorsk', nativeName: 'Norsk nynorsk' },
	{ code: 'nr', name: 'Southern Ndebele', nativeName: 'isiNdebele' },
	{ code: 'nv', name: 'Navajo', nativeName: 'Diné bizaad' },
	{ code: 'ny', name: 'Chichewa', nativeName: 'chiCheŵa' },
	{ code: 'oc', name: 'Occitan', nativeName: 'occitan' },
	{ code: 'oj', name: 'Ojibwe', nativeName: 'ᐊᓂᔑᓈᐯᒧᐎᓐ' },
	{ code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo' },
	{ code: 'or', name: 'Oriya', nativeName: 'ଓଡ଼ିଆ' },
	{ code: 'os', name: 'Ossetian', nativeName: 'ирон æвзаг' },
	{ code: 'pa', name: 'Panjabi', nativeName: 'ਪੰਜਾਬੀ' },
	{ code: 'pi', name: 'Pāli', nativeName: 'पाऴि' },
	{ code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
	{ code: 'qu', name: 'Quechua', nativeName: 'Runa Simi' },
	{ code: 'rm', name: 'Romansh', nativeName: 'rumantsch grischun' },
	{ code: 'rn', name: 'Kirundi', nativeName: 'Ikirundi' },
	{ code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda' },
	{ code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
	{ code: 'sc', name: 'Sardinian', nativeName: 'sardu' },
	{ code: 'sd', name: 'Sindhi', nativeName: 'सिन्धी' },
	{ code: 'se', name: 'Northern Sami', nativeName: 'Davvisámegiella' },
	{ code: 'sg', name: 'Sango', nativeName: 'yângâ tî sängö' },
	{ code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
	{ code: 'sk', name: 'Slovak', nativeName: 'slovenčina' },
	{ code: 'sl', name: 'Slovenian', nativeName: 'slovenščina' },
	{ code: 'sm', name: 'Samoan', nativeName: "gagana fa'a Samoa" },
	{ code: 'sn', name: 'Shona', nativeName: 'chiShona' },
	{ code: 'so', name: 'Somali', nativeName: 'Soomaaliga' },
	{ code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
	{ code: 'sr', name: 'Serbian', nativeName: 'српски језик' },
	{ code: 'ss', name: 'Swati', nativeName: 'SiSwati' },
	{ code: 'st', name: 'Southern Sotho', nativeName: 'Sesotho' },
	{ code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda' },
	{ code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
	{ code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
	{ code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
	{ code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
	{ code: 'tg', name: 'Tajik', nativeName: 'тоҷикӣ' },
	{ code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' },
	{ code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe' },
	{ code: 'tl', name: 'Tagalog', nativeName: 'Wikang Tagalog' },
	{ code: 'tn', name: 'Tswana', nativeName: 'Setswana' },
	{ code: 'to', name: 'Tonga', nativeName: 'faka Tonga' },
	{ code: 'ts', name: 'Tsonga', nativeName: 'Xitsonga' },
	{ code: 'tt', name: 'Tatar', nativeName: 'татар теле' },
	{ code: 'tw', name: 'Twi', nativeName: 'Twi' },
	{ code: 'ty', name: 'Tahitian', nativeName: 'Reo Tahiti' },
	{ code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە‎' },
	{ code: 'ur', name: 'Urdu', nativeName: 'اردو' },
	{ code: 'uz', name: 'Uzbek', nativeName: 'Ўзбек' },
	{ code: 've', name: 'Venda', nativeName: 'Tshivenḓa' },
	{ code: 'vo', name: 'Volapük', nativeName: 'Volapük' },
	{ code: 'wa', name: 'Walloon', nativeName: 'walon' },
	{ code: 'wo', name: 'Wolof', nativeName: 'Wollof' },
	{ code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש' },
	{ code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
	{ code: 'za', name: 'Zhuang', nativeName: 'Saɯ cueŋƅ' }
];
