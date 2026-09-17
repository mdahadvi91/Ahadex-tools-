import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Globe, Wifi, MessageSquare, User, Mail, FileText, Download, Copy, RefreshCw, Sliders, ShieldCheck, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../context/ToastContext';

type QrType = 'url' | 'wifi' | 'whatsapp' | 'vcard' | 'text' | 'email';

export const QrCodeGenerator: React.FC = () => {
  const { addToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [type, setType] = useState<QrType>('url');
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  // Input states
  const [urlInput, setUrlInput] = useState<string>('https://ahadex.com');
  const [wifiSsid, setWifiSsid] = useState<string>('Home_WiFi');
  const [wifiPass, setWifiPass] = useState<string>('secret123');
  const [wifiEnc, setWifiEnc] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [phoneInput, setPhoneInput] = useState<string>('+1234567890');
  const [waMessage, setWaMessage] = useState<string>('Hello! Checking out your QR code.');
  const [vFirstName, setVFirstName] = useState<string>('Ahad');
  const [vLastName, setVLastName] = useState<string>('Chowdhury');
  const [vPhone, setVPhone] = useState<string>('+1 555-0199');
  const [vEmail, setVEmail] = useState<string>('contact@ahadex.com');
  const [vOrg, setVOrg] = useState<string>('AHADEX Inc.');
  const [textInput, setTextInput] = useState<string>('Scan this code to explore AHADEX TOOLS!');
  const [emailTo, setEmailTo] = useState<string>('support@ahadex.com');
  const [emailSub, setEmailSub] = useState<string>('Inquiry from QR Code');

  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Construct payload text
  const getPayload = (): string => {
    switch (type) {
      case 'url':
        return urlInput.startsWith('http') ? urlInput : `https://${urlInput}`;
      case 'wifi':
        return `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};;`;
      case 'whatsapp': {
        const cleanPhone = phoneInput.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      }
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vLastName};${vFirstName}\nFN:${vFirstName} ${vLastName}\nORG:${vOrg}\nTEL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSub)}`;
      case 'text':
      default:
        return textInput;
    }
  };

  // Render QR Code
  useEffect(() => {
    const renderQr = async () => {
      try {
        const payload = getPayload();
        if (!payload.trim()) return;

        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, payload, {
            width: 320,
            margin: 2,
            color: { dark: fgColor, light: bgColor },
            errorCorrectionLevel,
          });

          const dataUrl = canvasRef.current.toDataURL('image/png');
          setQrDataUrl(dataUrl);
        }
      } catch (err) {
        console.error('QR rendering error:', err);
      }
    };

    renderQr();
  }, [
    type,
    fgColor,
    bgColor,
    errorCorrectionLevel,
    urlInput,
    wifiSsid,
    wifiPass,
    wifiEnc,
    phoneInput,
    waMessage,
    vFirstName,
    vLastName,
    vPhone,
    vEmail,
    vOrg,
    textInput,
    emailTo,
    emailSub,
  ]);

  // Download PNG / SVG
  const handleDownload = (format: 'png' | 'jpeg') => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qr-code-${type}-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('QR Downloaded', `Saved QR code as ${format.toUpperCase()}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Payload Type Picker */}
          <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2 pb-2 border-b border-slate-800">
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Select QR Code Content Type</span>
            </h4>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'url', label: 'Website', icon: Globe },
                { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                { id: 'vcard', label: 'vCard', icon: User },
                { id: 'text', label: 'Text', icon: FileText },
                { id: 'email', label: 'Email', icon: Mail },
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as QrType)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      type === item.id
                        ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-md shadow-cyan-950/30'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Payload Form */}
          <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold pb-2 border-b border-slate-800">
              Payload Details
            </h4>

            {type === 'url' && (
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1.5">Target Website URL</label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400"
                />
              </div>
            )}

            {type === 'wifi' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Password</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Encryption</label>
                  <select
                    value={wifiEnc}
                    onChange={(e) => setWifiEnc(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open)</option>
                  </select>
                </div>
              </div>
            )}

            {type === 'whatsapp' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">WhatsApp Phone Number</label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Pre-filled Message</label>
                  <textarea
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    rows={2}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              </div>
            )}

            {type === 'vcard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={vFirstName}
                    onChange={(e) => setVFirstName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={vLastName}
                    onChange={(e) => setVLastName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            {type === 'text' && (
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1.5">Plain Text Payload</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            )}

            {type === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Recipient Email</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Subject Line</label>
                  <input
                    type="text"
                    value={emailSub}
                    onChange={(e) => setEmailSub(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Style Customization */}
          <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>QR Colors & Correction Level</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1.5">Foreground Color</label>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full h-9 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer p-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1.5">Background Color</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-9 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer p-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live QR Preview & Download */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="rounded-3xl glass-card border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-2xl text-center">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold pb-3 border-b border-slate-800">
              Live QR Preview
            </h4>

            <div className="relative rounded-2xl bg-slate-950 p-6 border border-slate-800 flex items-center justify-center min-h-[300px]">
              <canvas ref={canvasRef} className="rounded-xl max-w-full shadow-2xl" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleDownload('png')}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download PNG
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleDownload('jpeg')}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download JPG
              </Button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Scannable on all iOS & Android cameras</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
