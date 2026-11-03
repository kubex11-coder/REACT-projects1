// Texty stránky ve dvou jazycích. Čeština je hlavní (výchozí) jazyk.
export const LANGS = ["cs", "en"]
export const DEFAULT_LANG = "cs"

export const translations = {
    cs: {
        nav: { home: "Domů", about: "O mně", portfolio: "Portfolio", contact: "Kontakt" },
        menu: { open: "Otevřít menu", close: "Zavřít menu", language: "Jazyk" },
        hero: {
            subtitle: "Tvorba webů, aplikací, videí",
            alt: "Jakub programuje v kyberpunkové pracovně",
        },
        slides: {
            webTitle: "Weby",
            videoTitle: "Video",
            webName: "Weby a aplikace",
            videoName: "Video tvorba",
            webShort: "WEBY",
            videoShort: "VIDEA",
            back: "Zpět",
            backLong: "Zpět na úvod",
            intro: "Úvod",
            dots: "Přepínání bannerů",
            hint: "Přejeď prstem",
            moreBtn: "Zjistit více",
        },
        about: {
            eyebrow: "O nás",
            title: "Tvoříme ",
            titleAccent: "digitální řešení",
            p1: "Skupina nadšenců do webdesignu a grafiky, která se v roce 2018 spojila a začala vytvářet weby a designová řešení pro menší firmy. Od té doby naše portfolio spokojených klientů rychle roste.",
            p2: "Našli jsme v tom, co děláme, vášeň. Weby, aplikace i videa stavíme tak, aby vypadaly skvěle a hlavně fungovaly.",
            cta: "Kontaktujte nás",
            stat1: "let zkušeností s IT a vývojem webů",
            stat2: "úspěšně dokončených projektů",
            stat3: "spokojených zákazníků z celého světa",
        },
    },
    en: {
        nav: { home: "Home", about: "About", portfolio: "Portfolio", contact: "Contact" },
        menu: { open: "Open menu", close: "Close menu", language: "Language" },
        hero: {
            subtitle: "Websites, apps and videos",
            alt: "Jakub coding in a cyberpunk workspace",
        },
        slides: {
            webTitle: "Web",
            videoTitle: "Video",
            webName: "Websites & apps",
            videoName: "Video production",
            webShort: "WEB",
            videoShort: "VIDEO",
            back: "Back",
            backLong: "Back to start",
            intro: "Start",
            dots: "Banner switcher",
            hint: "Swipe",
            moreBtn: "Learn more",
        },
        about: {
            eyebrow: "About us",
            title: "We create ",
            titleAccent: "digital solutions",
            p1: "A group of web design and graphics enthusiasts who joined forces in 2018 and started providing design and web solutions for smaller companies. Since then, our portfolio of satisfied clients has been growing fast.",
            p2: "We found a passion in what we do. We build websites, apps and videos so they look great and, above all, work.",
            cta: "Contact us",
            stat1: "years of experience in IT and web development",
            stat2: "successfully completed projects",
            stat3: "satisfied customers from all over the world",
        },
    },
}
