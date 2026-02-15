
import React, { useState, useEffect, useRef } from 'react';
import { ServiceType } from './types';
import { SERVICES } from './constants';
import { getIPInfo, checkServiceLimit, submitOrder } from './services/api';
import { getLocalAiResponse } from './services/localAi';
import NeobrutalistCard from './components/NeobrutalistCard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceType>(ServiceType.TIKTOK_LIKE);
  const [targetLink, setTargetLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [ipInfo, setIpInfo] = useState<{ ip: string; isVpn: boolean } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [isLimited, setIsLimited] = useState(false);

  // AI States
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'nexa', text: string }[]>([
    { role: 'nexa', text: 'Sistem Inisialisasi... NEXA-AI Online. Ada yang bisa gue bantu soal SMM?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const info = await getIPInfo();
        setIpInfo({ ip: info.ip, isVpn: !!info.security?.vpn || !!info.security?.proxy });
      } catch (err) {
        setIpInfo({ ip: 'Unknown', isVpn: false });
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (ipInfo) {
      const limitReached = checkServiceLimit(ipInfo.ip, SERVICES[activeTab].id);
      setIsLimited(limitReached);
    }
  }, [activeTab, ipInfo]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, aiIsTyping]);

  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiIsTyping) return;

    const userMsg = aiInput;
    setAiInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setAiIsTyping(true);
    const response = await getLocalAiResponse(userMsg);
    setChatHistory(prev => [...prev, { role: 'nexa', text: response }]);
    setAiIsTyping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipInfo) return;
    if (!targetLink) {
      setMessage({ type: 'error', text: 'Link wajib diisi!' });
      return;
    }
    if (ipInfo.isVpn) {
      setMessage({ type: 'warning', text: 'VPN DETECTED! Matikan VPN.' });
      return;
    }
    if (isLimited) {
      setMessage({ type: 'error', text: 'LIMIT TERCAPAI!' });
      return;
    }

    setLoading(true);
    setMessage(null);
    const result = await submitOrder(targetLink, activeTab, ipInfo.ip, ipInfo.isVpn);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTargetLink('');
      setIsLimited(true);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 pb-24">
      <div className="w-[92%] max-w-[450px] flex flex-col gap-4">
        
        {/* Top Status Bar - Changed to B&W */}
        <div className="bg-black text-white neo-border-sm p-3 flex items-center justify-between font-[900] text-[10px] uppercase tracking-[2px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ADFF2F] rounded-full animate-pulse"></span>
            <span>NEXA CORE ACTIVE</span>
          </div>
          <div className="opacity-70">VERSION_3.0</div>
        </div>

        {/* Header Logo */}
        <header className="flex flex-col items-center py-6">
          <div className="bg-white neo-border neo-shadow px-8 py-3 transform -rotate-1">
            <h1 className="text-5xl font-[900] uppercase italic tracking-tighter leading-none text-black">NEXA SMM</h1>
          </div>
        </header>

        {/* Anti-VPN Banner */}
        {ipInfo?.isVpn && (
          <div className="bg-[#FF4D4D] text-white font-[900] neo-border-sm p-4 text-center text-xs uppercase animate-pulse shadow-[4px_4px_0px_0px_#000]">
            ⚠️ VPN DETECTED! DISABLE FOR ACCESS ⚠️
          </div>
        )}

        <main className="flex flex-col gap-6">
          {/* Main Boost Panel */}
          <NeobrutalistCard title="Boost Center" className="relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest">Free Mode</div>
            <div className="flex gap-2 mb-6 mt-2">
              <button
                onClick={() => setActiveTab(ServiceType.TIKTOK_LIKE)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-[900] neo-border-sm transition-all text-[11px] uppercase
                  ${activeTab === ServiceType.TIKTOK_LIKE ? 'bg-black text-white shadow-[4px_4px_0px_0px_#ccc]' : 'bg-white hover:bg-gray-50'}`}
              >
                <i className="fa-brands fa-tiktok text-base"></i>
                TikTok
              </button>
              <button
                onClick={() => setActiveTab(ServiceType.IG_VIEW)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-[900] neo-border-sm transition-all text-[11px] uppercase
                  ${activeTab === ServiceType.IG_VIEW ? 'bg-black text-white shadow-[4px_4px_0px_0px_#ccc]' : 'bg-white hover:bg-gray-50'}`}
              >
                <i className="fa-brands fa-instagram text-base"></i>
                Instagram
              </button>
            </div>

            {isLimited ? (
              <div className="bg-black text-white neo-border-sm p-10 text-center flex flex-col gap-4 items-center">
                <div className="text-4xl animate-bounce">🔒</div>
                <p className="font-[900] text-xl uppercase italic">Limit Tercapai!</p>
                <div className="text-[10px] text-white opacity-50 font-bold uppercase tracking-[4px]">Tunggu 24 Jam Lagi</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-[11px] font-[900] mb-2 uppercase italic tracking-widest">Post URL</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={ipInfo?.isVpn}
                      value={targetLink}
                      onChange={(e) => setTargetLink(e.target.value)}
                      placeholder="https://www.tiktok.com/@user/video/..."
                      className="w-full h-[60px] px-5 text-sm font-bold bg-white neo-border-sm focus:shadow-[4px_4px_0px_0px_#000] transition-all outline-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20"><i className="fa-solid fa-link"></i></div>
                  </div>
                </div>

                <div className="bg-black text-white p-4 neo-border-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black uppercase text-white opacity-60 tracking-widest">Order Info</span>
                    <span className="text-[9px] font-black uppercase opacity-30">#AUTO_DISPATCH</span>
                  </div>
                  <p className="text-sm font-[900] italic uppercase">
                    {SERVICES[activeTab].label} — {SERVICES[activeTab].quantity} QTY
                  </p>
                </div>

                {message && (
                  <div className={`p-4 neo-border-sm font-[900] text-xs uppercase shadow-[4px_4px_0px_0px_#000] ${
                    message.type === 'success' ? 'bg-[#ADFF2F]' : 'bg-[#FF4D4D] text-white'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* Tombol Submit Utama - Tetap Hijau */}
                <button
                  type="submit"
                  disabled={loading || ipInfo?.isVpn}
                  className="group relative w-full py-5 text-2xl font-[900] uppercase neo-border neo-shadow bg-[#ADFF2F] hover:bg-white active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  <span className="relative z-10">{loading ? 'BOOSTING...' : 'GAS SEKARANG 🚀'}</span>
                  <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
              </form>
            )}
          </NeobrutalistCard>

          {/* NEXA AI TERMINAL - Strictly Black & White */}
          <div id="ai-section" className="scroll-mt-6">
            <NeobrutalistCard title="Nexa AI Terminal" className="bg-white text-black border-black flex flex-col h-[400px] shadow-[8px_8px_0px_0px_#000]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar font-mono">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3 neo-border-sm text-[11px] font-bold leading-relaxed shadow-[3px_3px_0px_0px_#000] ${
                      chat.role === 'user' 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-black border-black'
                    }`}>
                      <span className="text-[9px] block opacity-50 mb-1">[{chat.role.toUpperCase()}]</span>
                      {chat.text}
                    </div>
                  </div>
                ))}
                {aiIsTyping && (
                  <div className="flex flex-col items-start">
                    <div className="bg-white text-black p-3 neo-border-sm border-black text-[10px] font-black italic animate-pulse">
                      NEXA IS PROCESSING...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleAiChat} className="flex gap-2">
                <input 
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ketik perintah/tanya tips..."
                  className="flex-1 bg-white text-black p-3 text-xs neo-border-sm border-black font-mono font-bold outline-none placeholder-gray-400"
                />
                <button 
                  type="submit"
                  disabled={aiIsTyping}
                  className="bg-black text-white px-6 neo-border-sm border-black font-[900] text-xs uppercase hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_#ccc]"
                >
                  RUN
                </button>
              </form>
            </NeobrutalistCard>
          </div>
        </main>

        <footer className="py-8 flex flex-col items-center gap-6">
          <div className="flex gap-3 w-full">
            <a href="https://whatsapp.com/channel/0029Vb7TkCcD38CStrAMMb3N" target="_blank" className="flex-1 text-center py-4 bg-white neo-border-sm text-[10px] font-[900] uppercase hover:bg-black hover:text-white transition-all hover:neo-shadow-sm">Saluran WA</a>
            <a href="https://chat.whatsapp.com/Figeaa78x9XAa6K6Wkd3d5?mode=gi_t" target="_blank" className="flex-1 text-center py-4 bg-white neo-border-sm text-[10px] font-[900] uppercase hover:bg-black hover:text-white transition-all hover:neo-shadow-sm">Group WA</a>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-[900] opacity-40 uppercase tracking-[4px] mb-2">NEXA SMM ECOSYSTEM</p>
          </div>
        </footer>
      </div>

      {/* Floating AI Bubble - Changed to B&W */}
      <button 
        onClick={() => document.getElementById('ai-section')?.scrollIntoView({ behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-none neo-border neo-shadow flex items-center justify-center text-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all z-50 group"
      >
        <i className="fa-solid fa-robot group-hover:animate-bounce"></i>
        <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] font-black px-1 border border-black shadow-sm">AI</span>
      </button>
    </div>
  );
};

export default App;
