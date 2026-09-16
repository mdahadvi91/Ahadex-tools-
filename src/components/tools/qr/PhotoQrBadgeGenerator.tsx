import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { useToast } from '../../../context/ToastContext';
import { useLanguage } from '../../../context/LanguageContext';
import { Button } from '../../ui/Button';
import {
  Upload,
  Image as ImageIcon,
  Download,
  QrCode,
  Link as LinkIcon,
  Wifi,
  PhoneCall,
  Mail,
  FileText,
  User,
  MessageSquare,
  Share2,
  Move,
  Eye,
  Trash2,
  RefreshCw,
} from 'lucide-react';

export type QrContentType =
  | 'url'
  | 'social'
  | 'wifi'
  | 'whatsapp'
  | 'vcard'
  | 'email'
  | 'phone'
  | 'text';

export type BadgePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface SocialPlatform {
  id: string;
  name: string;
  baseUrl: string;
  placeholder: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: 'facebook', name: 'Facebook', baseUrl: 'https://facebook.com/', placeholder: 'username or profile ID' },
  { id: 'instagram', name: 'Instagram', baseUrl: 'https://instagram.com/', placeholder: 'username' },
  { id: 'twitter', name: 'X (Twitter)', baseUrl: 'https://x.com/', placeholder: 'username' },
  { id: 'linkedin', name: 'LinkedIn', baseUrl: 'https://linkedin.com/in/', placeholder: 'username' },
  { id: 'tiktok', name: 'TikTok', baseUrl: 'https://tiktok.com/@', placeholder: 'username' },
  { id: 'youtube', name: 'YouTube', baseUrl: 'https://youtube.com/@', placeholder: 'channel username' },
  { id: 'telegram', name: 'Telegram', baseUrl: 'https://t.me/', placeholder: 'username' },
];

export const PhotoQrBadgeGenerator: React.FC = () => {
  const { addToast } = useToast();
  const { t } = useLanguage();

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // QR Content State
  const [qrType, setQrType] = useState<QrContentType>('url');

  // Payload inputs
  const [urlInput, setUrlInput] = useState('https://ahadex.fun');
  
  // Social
  const [socialPlatform, setSocialPlatform] = useState('instagram');
  const [socialHandle, setSocialHandle] = useState('ahadex.official');

  // WiFi
  const [wifiSsid, setWifiSsid] = useState('Home_WiFi_5G');
  const [wifiPassword, setWifiPassword] = useState('securepassword123');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // WhatsApp
  const [waPhone, setWaPhone] = useState('+8801700000000');
  const [waMessage, setWaMessage] = useState('Hello! I scanned your photo QR badge.');

  // vCard
  const [vFullName, setVFullName] = useState('Alex Morgan');
  const [vOrg, setVOrg] = useState('AHADEX Innovation Labs');
  const [vPhone, setVPhone] = useState('+1-555-019-2831');
  const [vEmail, setVEmail] = useState('alex@example.com');

  // Email
  const [emailTo, setEmailTo] = useState('contact@ahadex.fun');
  const [emailSubject, setEmailSubject] = useState('Inquiry via Photo QR Badge');

  // Phone
  const [phoneNumber, setPhoneNumber] = useState('+15550192831');

  // Text
  const [textInput, setTextInput] = useState('Welcome to AHADEX TOOLS - Scan & Discover!');

  // Badge Position
  const [badgePosition, setBadgePosition] = useState<BadgePosition>('bottom-right');

  // Fixed Optimal Scannable Colors & Error Correction
  const badgeBgColor = '#FFFFFF'; // Pure white background for maximum scannability
  const badgeFgColor = '#000000'; // Pure black foreground for maximum scannability
  const errorCorrectionLevel = 'H'; // Highest error correction

  // Preview & Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [qrCanvas, setQrCanvas] = useState<HTMLCanvasElement | null>(null);

  // Build Payload string
  const getQrPayload = useCallback((): string => {
    switch (qrType) {
      case 'url':
        return urlInput.trim() || 'https://ahadex.fun';

      case 'social': {
        const platform = SOCIAL_PLATFORMS.find((p) => p.id === socialPlatform) || SOCIAL_PLATFORMS[0];
        const cleanHandle = socialHandle.trim().replace(/^@/, '');
        return `${platform.baseUrl}${cleanHandle}`;
      }

      case 'wifi': {
        const ssid = wifiSsid.trim();
        const pass = wifiPassword.trim();
        const hiddenStr = wifiHidden ? 'H:true;' : '';
        if (wifiSecurity === 'nopass') {
          return `WIFI:S:${ssid};T:nopass;${hiddenStr};`;
        }
        return `WIFI:S:${ssid};T:${wifiSecurity};P:${pass};${hiddenStr};`;
      }

      case 'whatsapp': {
        const cleanPhone = waPhone.trim().replace(/[^0-9+]/g, '');
        const encodedMsg = encodeURIComponent(waMessage.trim());
        return `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedMsg}`;
      }

      case 'vcard':
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${vFullName.trim()}`,
          `ORG:${vOrg.trim()}`,
          `TEL:${vPhone.trim()}`,
          `EMAIL:${vEmail.trim()}`,
          'END:VCARD',
        ].join('\n');

      case 'email': {
        const mailTo = emailTo.trim();
        const sub = encodeURIComponent(emailSubject.trim());
        return `mailto:${mailTo}?subject=${sub}`;
      }

      case 'phone':
        return `tel:${phoneNumber.trim()}`;

      case 'text':
        return textInput.trim() || 'AHADEX TOOLS';

      default:
        return 'https://ahadex.fun';
    }
  }, [
    qrType,
    urlInput,
    socialPlatform,
    socialHandle,
    wifiSsid,
    wifiPassword,
    wifiSecurity,
    wifiHidden,
    waPhone,
    waMessage,
    vFullName,
    vOrg,
    vPhone,
    vEmail,
    emailTo,
    emailSubject,
    phoneNumber,
    textInput,
  ]);

  // Generate QR Canvas (Pure Black & White for maximum scannability)
  useEffect(() => {
    let isMounted = true;
    const payload = getQrPayload();

    const tempCanvas = document.createElement('canvas');
    QRCode.toCanvas(
      tempCanvas,
      payload,
      {
        width: 600,
        margin: 1,
        errorCorrectionLevel: errorCorrectionLevel as any,
        color: {
          dark: badgeFgColor,
          light: badgeBgColor,
        },
      },
      (err) => {
        if (err) {
          console.error('QR code generation error:', err);
          return;
        }
        if (isMounted) {
          setQrCanvas(tempCanvas);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [getQrPayload]);

  // Handle File Upload Selection
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Invalid File Type', 'Please upload a valid JPG, PNG, or WebP image.', 'error');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      addToast('File Too Large', 'Please select an image smaller than 25MB.', 'error');
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);

    const img = new Image();
    img.onload = () => {
      setImageElement(img);
      addToast('Photo Loaded', 'Photo loaded successfully. Auto-scaled QR badge generated!', 'success');
    };
    img.onerror = () => {
      addToast('Image Load Error', 'Could not render the selected photo.', 'error');
    };
    img.src = objectUrl;
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Render composite image with auto-proportional QR badge onto canvas
  const updateComposition = useCallback(() => {
    if (!imageElement || !qrCanvas) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgW = imageElement.naturalWidth || imageElement.width || 1200;
    const imgH = imageElement.naturalHeight || imageElement.height || 1200;

    canvas.width = imgW;
    canvas.height = imgH;

    // 1. Draw base photo
    ctx.drawImage(imageElement, 0, 0, imgW, imgH);

    // 2. Calculate Automatic Proportional Sizing
    const baseDim = Math.min(imgW, imgH);
    const scaleFactor = Math.max(0.6, baseDim / 1000);
    const badgeRatio = 0.22;
    const qrSize = Math.round(baseDim * badgeRatio);
    const padding = Math.max(6, Math.round(8 * scaleFactor));
    const radius = Math.max(10, Math.round(14 * scaleFactor));
    const offset = Math.max(16, Math.round(24 * scaleFactor));

    const totalBadgeW = qrSize + padding * 2;
    const totalBadgeH = qrSize + padding * 2;

    let badgeX = 0;
    let badgeY = 0;

    switch (badgePosition) {
      case 'top-left':
        badgeX = offset;
        badgeY = offset;
        break;
      case 'top-right':
        badgeX = imgW - totalBadgeW - offset;
        badgeY = offset;
        break;
      case 'bottom-left':
        badgeX = offset;
        badgeY = imgH - totalBadgeH - offset;
        break;
      case 'bottom-right':
      default:
        badgeX = imgW - totalBadgeW - offset;
        badgeY = imgH - totalBadgeH - offset;
        break;
    }

    // 3. Draw Crisp Badge Background with Rounded Corners
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, totalBadgeW, totalBadgeH, radius);
    ctx.fillStyle = badgeBgColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = Math.round(20 * scaleFactor);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = Math.round(8 * scaleFactor);
    ctx.fill();
    ctx.restore();

    // 4. Draw Crisp Outline Border
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, totalBadgeW, totalBadgeH, radius);
    ctx.lineWidth = Math.max(1, Math.round(2 * scaleFactor));
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.stroke();
    ctx.restore();

    // 5. Draw QR Code image inside the badge
    const qrX = badgeX + padding;
    const qrY = badgeY + padding;
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // 6. Export to Preview Data URL
    const previewUrl = canvas.toDataURL('image/png', 0.95);
    setPreviewDataUrl(previewUrl);
    canvasRef.current = canvas;
  }, [imageElement, qrCanvas, badgePosition]);

  useEffect(() => {
    updateComposition();
  }, [updateComposition]);

  // Clean up Object URLs on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  // Download Output Handler
  const handleDownload = (format: 'png' | 'jpeg') => {
    if (!canvasRef.current) {
      addToast('Download Error', 'Please upload a photo first to download the QR badge.', 'error');
      return;
    }

    const canvas = canvasRef.current;
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, 0.95);

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `ahadex-qr-photo.${format === 'jpeg' ? 'jpg' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    addToast(
      'Download Success',
      `Saved photo QR badge as ahadex-qr-photo.${format === 'jpeg' ? 'jpg' : 'png'}`,
      'success'
    );
  };

  // Reset tool handler
  const handleResetAll = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageFile(null);
    setImageUrl(null);
    setImageElement(null);
    setPreviewDataUrl(null);
    setQrType('url');
    setUrlInput('https://ahadex.fun');
    setBadgePosition('bottom-right');
    addToast('Reset Complete', 'Tool parameters reset.', 'info');
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleImageFile(e.target.files[0]);
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Configuration Controls (Always visible) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Panel 1: Select QR Type with 360-Degree Rotating Neon Border */}
          <div className="relative p-[1.5px] rounded-2xl overflow-hidden group shadow-lg transition-all duration-300">
            <div className="absolute -inset-[200%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_260deg,#06b6d4_310deg,#3b82f6_360deg)] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative rounded-[14px] bg-slate-900/95 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>{t.photoQrTool.contentTypeStep}</span>
                </h4>
              </div>

              {/* Grid of 8 QR Types */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'url', label: t.photoQrTool.typeUrl, icon: LinkIcon },
                  { id: 'social', label: t.photoQrTool.typeSocial, icon: Share2 },
                  { id: 'wifi', label: t.photoQrTool.typeWifi, icon: Wifi },
                  { id: 'whatsapp', label: t.photoQrTool.typeWhatsapp, icon: MessageSquare },
                  { id: 'vcard', label: t.photoQrTool.typeVcard, icon: User },
                  { id: 'email', label: t.photoQrTool.typeEmail, icon: Mail },
                  { id: 'phone', label: t.photoQrTool.typePhone, icon: PhoneCall },
                  { id: 'text', label: t.photoQrTool.typeText, icon: FileText },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = qrType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setQrType(item.id as QrContentType)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 ring-1 ring-cyan-400/30'
                          : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-[11px] font-semibold leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payload Inputs */}
              <div className="pt-2 space-y-3">
                {qrType === 'url' && (
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      {t.photoQrTool.websiteUrlLabel}
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full h-10 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
                    />
                  </div>
                )}

                {qrType === 'social' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">
                        {t.photoQrTool.selectPlatform}
                      </label>
                      <select
                        value={socialPlatform}
                        onChange={(e) => setSocialPlatform(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        {SOCIAL_PLATFORMS.map((p) => (
                          <option key={p.id} value={p.id} className="bg-slate-900">
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">
                        {t.photoQrTool.userHandleLabel}
                      </label>
                      <input
                        type="text"
                        value={socialHandle}
                        onChange={(e) => setSocialHandle(e.target.value)}
                        placeholder="username"
                        className="w-full h-10 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {qrType === 'wifi' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          {t.photoQrTool.wifiSsidLabel}
                        </label>
                        <input
                          type="text"
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          placeholder="SSID Name"
                          className="w-full h-10 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          {t.photoQrTool.wifiSecurityLabel}
                        </label>
                        <select
                          value={wifiSecurity}
                          onChange={(e) => setWifiSecurity(e.target.value as any)}
                          className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          <option value="WPA" className="bg-slate-900">WPA/WPA2</option>
                          <option value="WEP" className="bg-slate-900">WEP</option>
                          <option value="nopass" className="bg-slate-900">None (Open)</option>
                        </select>
                      </div>
                    </div>
                    {wifiSecurity !== 'nopass' && (
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          {t.photoQrTool.wifiPasswordLabel}
                        </label>
                        <input
                          type="password"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full h-10 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                        />
                      </div>
                    )}
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded accent-cyan-400"
                      />
                      <span>{t.photoQrTool.hiddenNetwork}</span>
                    </label>
                  </div>
                )}

                {qrType === 'whatsapp' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">
                        {t.photoQrTool.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        value={waPhone}
                        onChange={(e) => setWaPhone(e.target.value)}
                        placeholder="+8801700000000"
                        className="w-full h-10 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">
                        {t.photoQrTool.waMessageLabel}
                      </label>
                      <input
                        type="text"
                        value={waMessage}
                        onChange={(e) => setWaMessage(e.target.value)}
                        placeholder="Hello!"
                        className="w-full h-10 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {qrType === 'vcard' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          {t.photoQrTool.fullNameLabel}
                        </label>
                        <input
                          type="text"
                          value={vFullName}
                          onChange={(e) => setVFullName(e.target.value)}
                          className="w-full h-9 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          {t.photoQrTool.companyLabel}
                        </label>
                        <input
                          type="text"
                          value={vOrg}
                          onChange={(e) => setVOrg(e.target.value)}
                          className="w-full h-9 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          {t.photoQrTool.phoneLabel}
                        </label>
                        <input
                          type="tel"
                          value={vPhone}
                          onChange={(e) => setVPhone(e.target.value)}
                          className="w-full h-9 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          {t.photoQrTool.emailLabel}
                        </label>
                        <input
                          type="email"
                          value={vEmail}
                          onChange={(e) => setVEmail(e.target.value)}
                          className="w-full h-9 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {qrType === 'email' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">
                        {t.photoQrTool.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">
                        {t.photoQrTool.subjectLabel}
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {qrType === 'phone' && (
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      {t.photoQrTool.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+15550192831"
                      className="w-full h-10 px-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400"
                    />
                  </div>
                )}

                {qrType === 'text' && (
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      {t.photoQrTool.textLabel}
                    </label>
                    <textarea
                      rows={3}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter text..."
                      className="w-full p-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel 2: Badge Position with 360-Degree Rotating Neon Border */}
          <div className="relative p-[1.5px] rounded-2xl overflow-hidden group shadow-lg transition-all duration-300">
            <div className="absolute -inset-[200%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_260deg,#06b6d4_310deg,#3b82f6_360deg)] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative rounded-[14px] bg-slate-900/95 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
                  <Move className="w-4 h-4 text-cyan-400" />
                  <span>{t.photoQrTool.positionStep}</span>
                </h4>
              </div>

              {/* Position Buttons: Exactly 1 single line with grid-cols-4 */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'top-left', label: t.photoQrTool.posTopLeft },
                  { id: 'top-right', label: t.photoQrTool.posTopRight },
                  { id: 'bottom-left', label: t.photoQrTool.posBottomLeft },
                  { id: 'bottom-right', label: t.photoQrTool.posBottomRight },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setBadgePosition(pos.id as BadgePosition)}
                    className={`py-2.5 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center truncate cursor-pointer ${
                      badgePosition === pos.id
                        ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 ring-1 ring-cyan-400/30'
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Photo Upload Dropzone & Live Preview Stage */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          {!imageUrl ? (
            /* Upload Dropzone with 360-Degree Rotating Neon Border */
            <div className="relative p-[1.5px] rounded-3xl overflow-hidden group shadow-xl transition-all duration-300">
              <div className="absolute -inset-[200%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_260deg,#06b6d4_310deg,#3b82f6_360deg)] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-[22px] border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 min-h-[420px] flex flex-col items-center justify-center ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-950/40 scale-[1.01] ring-4 ring-cyan-500/20'
                    : 'border-white/20 hover:border-cyan-400/50 bg-slate-900/95'
                }`}
              >
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto shadow-xl shadow-cyan-950/30">
                    <Upload className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{t.photoQrTool.uploadTitle}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t.photoQrTool.uploadDesc}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<ImageIcon className="w-4 h-4" />}
                    >
                      {t.photoQrTool.selectBtn}
                    </Button>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-2 pt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{t.photoQrTool.privacyBadge}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Live Preview Stage with 360-Degree Rotating Neon Border */
            <div className="relative p-[1.5px] rounded-3xl overflow-hidden group shadow-xl transition-all duration-300">
              <div className="absolute -inset-[200%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_260deg,#06b6d4_310deg,#3b82f6_360deg)] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative rounded-[22px] bg-slate-900/95 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>{t.photoQrTool.livePreviewTitle}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{t.common.replace}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAll}
                      className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                      title={t.common.remove}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="relative rounded-2xl bg-slate-950/80 border border-white/10 overflow-hidden min-h-[360px] flex items-center justify-center p-2 shadow-2xl">
                  {previewDataUrl ? (
                    <img
                      src={previewDataUrl}
                      alt="Photo with QR Badge Overlay"
                      className="max-h-[520px] w-auto h-auto object-contain rounded-xl shadow-lg"
                    />
                  ) : (
                    <div className="text-center p-8 space-y-3">
                      <p className="text-xs text-slate-400">Rendering preview...</p>
                    </div>
                  )}
                </div>

                {/* Download Buttons */}
                <div className="pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleDownload('png')}
                      leftIcon={<Download className="w-4 h-4" />}
                      className="w-full"
                    >
                      {t.common.downloadPng}
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => handleDownload('jpeg')}
                      leftIcon={<Download className="w-4 h-4 text-slate-300" />}
                      className="w-full"
                    >
                      {t.common.downloadJpg}
                    </Button>
                  </div>

                  <p className="text-[11px] font-mono text-slate-400 text-center pt-1">
                    {t.photoQrTool.downloadNote}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
