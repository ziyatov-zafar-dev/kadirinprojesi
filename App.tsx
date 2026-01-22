
import React, { useState, useCallback, useEffect } from 'react';
import { MathInput } from './components/MathInput';
import { EquationGraph } from './components/EquationGraph';
import { EquationCoefficients, CalculationResult } from './types';
import { getSolutionExplanation } from './services/geminiService';

const App: React.FC = () => {
  const [coeffs, setCoeffs] = useState<EquationCoefficients>({ a: 1, b: 0, c: -4 });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [sources, setSources] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  const calculate = useCallback(() => {
    const { a, b, c } = coeffs;
    if (a === 0) {
      // Birinci dereceden denklem durumu
      const delta = NaN;
      const x1 = -c / b;
      setResult({
        delta,
        x1: isFinite(x1) ? x1 : null,
        x2: null,
        isComplex: false,
        vertex: { x: 0, y: c }
      });
      return;
    }

    const delta = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;

    if (delta > 0) {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);
      setResult({ delta, x1, x2, isComplex: false, vertex: { x: vertexX, y: vertexY } });
    } else if (delta === 0) {
      const x1 = -b / (2 * a);
      setResult({ delta, x1, x2: null, isComplex: false, vertex: { x: vertexX, y: vertexY } });
    } else {
      setResult({ delta, x1: null, x2: null, isComplex: true, vertex: { x: vertexX, y: vertexY } });
    }
  }, [coeffs]);

  const handleAISolve = async () => {
    setLoadingAI(true);
    const response = await getSolutionExplanation(coeffs.a, coeffs.b, coeffs.c);
    setExplanation(response.text);
    setSources(response.sources);
    setLoadingAI(false);
  };

  useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
          Abdulkadir Matematik Ödev
        </h1>
        <p className="text-slate-400 text-lg">
          İkinci dereceden denklemleri (ax² + bx + c = 0) profesyonelce çözün ve analiz edin.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Inputs & Results */}
        <div className="flex flex-col gap-8">
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6 border-b border-slate-800 pb-2 text-blue-400">Denklem Katsayıları</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <MathInput label="a" value={coeffs.a} onChange={(a) => setCoeffs(prev => ({ ...prev, a }))} />
              <MathInput label="b" value={coeffs.b} onChange={(b) => setCoeffs(prev => ({ ...prev, b }))} />
              <MathInput label="c" value={coeffs.c} onChange={(c) => setCoeffs(prev => ({ ...prev, c }))} />
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-center math-font text-2xl text-emerald-400">
                  {coeffs.a}x² {coeffs.b >= 0 ? '+' : ''} {coeffs.b}x {coeffs.c >= 0 ? '+' : ''} {coeffs.c} = 0
                </p>
              </div>
              
              <button 
                onClick={handleAISolve}
                disabled={loadingAI}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingAI ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                )}
                Yapay Zeka ile Açıkla
              </button>
            </div>
          </section>

          {result && (
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-semibold mb-6 border-b border-slate-800 pb-2 text-emerald-400">Çözüm Özeti</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-slate-400 math-font">Diskriminant (Δ)</span>
                  <span className="text-white font-bold math-font text-xl">{isNaN(result.delta) ? 'Lineer' : result.delta}</span>
                </div>
                
                {result.isComplex ? (
                  <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-lg text-red-400 text-center">
                    Gerçel kök bulunamadı (Delta &lt; 0). Kökler karmaşıktır.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-800 rounded-lg">
                      <p className="text-slate-400 text-sm mb-1">Birinci Kök (x₁)</p>
                      <p className="text-white font-bold math-font text-lg">{result.x1 !== null ? result.x1.toFixed(4) : '-'}</p>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg">
                      <p className="text-slate-400 text-sm mb-1">İkinci Kök (x₂)</p>
                      <p className="text-white font-bold math-font text-lg">{result.x2 !== null ? result.x2.toFixed(4) : '-'}</p>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-900/10 border border-blue-900/20 rounded-lg">
                  <p className="text-blue-400 text-sm mb-1">Parabol Tepe Noktası (T)</p>
                  <p className="text-white font-bold math-font text-lg">
                    ({result.vertex.x.toFixed(2)}, {result.vertex.y.toFixed(2)})
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Side: Graph & AI Explanation */}
        <div className="flex flex-col gap-8">
          <EquationGraph coeffs={coeffs} />

          {explanation && (
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl animate-fade-in">
              <h2 className="text-xl font-semibold mb-6 border-b border-slate-800 pb-2 text-purple-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12V12a1 1 0 00.553.894l2 1a1 1 0 00.894 0l2-1A1 1 0 0011 12v-1.88l1.69-.724a1 1 0 011.028.151l3.308 3.308a1 1 0 01-1.414 1.414l-3.308-3.308a1 1 0 01-.151-1.028l.724-1.69L11 8.715l-1.69.724a1 1 0 01-1.028-.151l-3.308-3.308a1 1 0 011.414-1.414l3.308 3.308a1 1 0 01.151 1.028l-.724 1.69L9 11.285l1.69-.724a1 1 0 011.028.151l3.308 3.308a1 1 0 01-1.414 1.414l-3.308-3.308a1 1 0 01-.151-1.028l.724-1.69L11 8.715z"></path></svg>
                Adım Adım Çözüm
              </h2>
              <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-strong:text-white prose-code:text-blue-300 whitespace-pre-wrap mb-8">
                {explanation}
              </div>

              {sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Kaynaklar ve Referanslar</h3>
                  <div className="space-y-3">
                    {sources.map((chunk: any, idx: number) => (
                      chunk.web && (
                        <a 
                          key={idx} 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 hover:border-blue-500/50 transition-all group"
                        >
                          <div className="bg-slate-700 p-2 rounded-lg group-hover:bg-blue-900/50 transition-colors">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-slate-200 truncate">{chunk.web.title || "İlgili Kaynak"}</p>
                            <p className="text-xs text-slate-500 truncate">{chunk.web.uri}</p>
                          </div>
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2024 Abdulkadir Matematik Ödev Portalı - Tüm hakları saklıdır.</p>
        <p className="mt-2 italic">Matematik evrenin dilidir.</p>
      </footer>
    </div>
  );
};

export default App;
