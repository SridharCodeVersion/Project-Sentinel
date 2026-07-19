export type RescueLanguage = "english" | "hindi" | "hinglish";

export interface RescueScript {
  label: string;
  locale: string;
  title: string;
  spokenScript: string;
  reassurance: string;
  steps: string[];
}

export const RESCUE_SCRIPTS: Record<RescueLanguage, RescueScript> = {
  english: {
    label: "ENGLISH",
    locale: "en-IN",
    title: "You are safe. Do not send any money.",
    spokenScript:
      "End the video call now. Do not transfer money or share an OTP. Police, CBI, and courts never demand a security deposit. Stay with me while we call the cybercrime helpline on 1930.",
    reassurance:
      "The caller cannot arrest you through a video call. Sentinel has isolated the threat channel.",
    steps: [
      "Disconnect the scam call and stop screen sharing",
      "Confirm that no money or OTP was sent",
      "Connect the victim to cybercrime helpline 1930",
      "Preserve the number, account details, and screenshots",
    ],
  },
  hindi: {
    label: "हिन्दी",
    locale: "hi-IN",
    title: "आप सुरक्षित हैं। कोई पैसा न भेजें।",
    spokenScript:
      "वीडियो कॉल तुरंत बंद करें। पैसे ट्रांसफर न करें और ओटीपी साझा न करें। पुलिस, सीबीआई या अदालत कभी सिक्योरिटी डिपॉज़िट नहीं मांगती। हमारे साथ 1930 साइबर हेल्पलाइन पर कॉल करें।",
    reassurance:
      "वीडियो कॉल के माध्यम से कोई आपको गिरफ्तार नहीं कर सकता। सेंटिनल ने खतरे वाले चैनल को अलग कर दिया है।",
    steps: [
      "फर्जी कॉल बंद करें और स्क्रीन शेयरिंग रोकें",
      "पुष्टि करें कि पैसा या ओटीपी साझा नहीं हुआ",
      "पीड़ित को साइबर हेल्पलाइन 1930 से जोड़ें",
      "नंबर, खाते की जानकारी और स्क्रीनशॉट सुरक्षित रखें",
    ],
  },
  hinglish: {
    label: "HINGLISH",
    locale: "hi-IN",
    title: "Aap safe hain. Koi paisa transfer mat kijiye.",
    spokenScript:
      "Video call abhi disconnect kijiye. Paise transfer ya OTP share mat kijiye. Police, CBI ya court kabhi security deposit nahi maangti. Hum aapke saath 1930 cyber helpline par call kar rahe hain.",
    reassurance:
      "Video call par koi aapko arrest nahi kar sakta. Sentinel ne threat channel isolate kar diya hai.",
    steps: [
      "Scam call aur screen sharing band karayein",
      "Confirm karein ki paisa ya OTP share nahi hua",
      "Victim ko cyber helpline 1930 se connect karein",
      "Number, account details aur screenshots preserve karein",
    ],
  },
};
