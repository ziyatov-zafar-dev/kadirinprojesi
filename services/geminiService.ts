
import { GoogleGenAI } from "@google/genai";

// API anahtarını alırken hata oluşmaması için kontrol
const API_KEY = process.env.API_KEY || "";

export interface ExplanationResponse {
  text: string;
  sources: any[];
}

export const getSolutionExplanation = async (a: number, b: number, c: number): Promise<ExplanationResponse> => {
  if (!API_KEY) {
    return {
      text: "Hata: API anahtarı bulunamadı. Lütfen yapılandırmayı kontrol edin.",
      sources: []
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `İkinci dereceden bir denklemi çözmem gerekiyor: ${a}x² + ${b}x + ${c} = 0. 
      Lütfen bu denklemi adım adım Türkçe olarak açıkla. 
      Diskriminant (Δ = b² - 4ac) formülünü kullan ve köklerin nasıl bulunduğunu göster. 
      Matematiksel bir dille ama anlaşılır bir şekilde anlat.
      Eğer bu denklem tipi hakkında internette akademik kaynaklar veya örnekler varsa bunlara da atıfta bulun.`,
      config: {
        systemInstruction: "Sen 'Abdulkadir Matematik Ödev' platformu için uzman bir matematik öğretmenisin. Adım adım, net ve eğitici açıklamalar yapmalısın. Tamamen Türkçe konuşmalısın. Google Arama aracını kullanarak bilgileri doğrula ve kaynak sağla.",
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    return {
      text: response.text || "Üzgünüm, şu an açıklama oluşturulamıyor.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Hatası:", error);
    return {
      text: "Yapay zeka açıklaması alınırken bir hata oluştu. Lütfen internet bağlantınızı ve API anahtarınızı kontrol edin.",
      sources: []
    };
  }
};
