import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';
import { VolunteerRegistration } from '../types';

interface VolunteerIDCardProps {
  volunteer: VolunteerRegistration;
  onClose: () => void;
}

export default function VolunteerIDCard({ volunteer, onClose }: VolunteerIDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [scale, setScale] = useState(1);

  // Responsive scaling for view only
  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        // Limit maximum display width to 640px (or smaller for mobile)
        const availableWidth = Math.min(containerRef.current.clientWidth - 40, 640); 
        setScale(availableWidth / 1619);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const qrData = `TECHCON 26 VERIFIED VOLUNTEER
Name: ${volunteer.fullName}
ID: ${volunteer.id}
Age: ${volunteer.age} | Gender: ${volunteer.gender}
Institution: ${volunteer.institution}
Phone: ${volunteer.mobileNumber}
Address: ${volunteer.address}, ${volunteer.district}`;

    QRCode.toDataURL(qrData.trim(), {
      margin: 0,
      width: 220,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'M'
    }, (err, url) => {
      if (err) console.error('QR Code Generation Error:', err);
      if (!err && url) setQrUrl(url);
    });
  }, [volunteer]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    // Temporarily remove transform for high quality 1:1 render
    const originalTransform = cardRef.current.style.transform;
    cardRef.current.style.transform = 'scale(1)';
    
    try {
      const { toPng } = await import('html-to-image');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const url = await toPng(cardRef.current, { 
        pixelRatio: 1, 
        skipFonts: false,
        width: 1619,
        height: 972,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `techcon26_volunteer_${volunteer.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Failed to download ID Card', error);
      alert(`Failed to download image: ${error?.message || error}. Please try taking a screenshot.`);
    } finally {
      if (cardRef.current) {
        cardRef.current.style.transform = originalTransform;
      }
      setIsGenerating(false);
    }
  };

  // Truncate name if it exceeds width, but ideally use CSS clamp or ellipsis
  const displayName = volunteer.fullName;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md overflow-hidden">
      
      <div 
        ref={containerRef}
        className="w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden relative"
      >
        {/* SCALED WRAPPER to prevent layout jumping/empty space */}
        <div style={{ width: 1619 * scale, height: 972 * scale, position: 'relative' }}>
          {/* ID CARD CONTAINER */}
          <div 
            className="relative origin-top-left bg-white shadow-2xl rounded-[64px] overflow-hidden shrink-0 transition-transform duration-300"
            ref={cardRef}
            style={{ 
              width: '1619px', 
              height: '972px', 
              backgroundImage: 'url(/vcard.png)',
              backgroundSize: '1619px 972px',
              backgroundRepeat: 'no-repeat',
              transform: `scale(${scale})`,
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
          {/* Volunteer ID */}
          <div 
            style={{
              position: 'absolute',
              left: '442px',
              top: '120px',
              width: '365px',
              height: '97px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Jura", sans-serif',
              fontWeight: 700,
              fontSize: '48px',
              color: '#FFFFFF'
            }}
          >
            {volunteer.id}
          </div>

          {/* Full Name positioned above photo */}
          <div
            style={{
              position: 'absolute',
              left: '442px',
              top: '280px',
              width: '950px',
              fontFamily: '"Jura", sans-serif',
              fontWeight: 800,
              fontSize: '60px',
              lineHeight: '68px',
              color: '#000000',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {displayName}
          </div>

          {/* Main Content Flex Container for Bottom Alignment */}
          <div
            style={{
              position: 'absolute',
              left: '442px',
              top: '390px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '53px'
            }}
          >
            {/* Passport Photo */}
            <div style={{ width: '280px', height: '360px', flexShrink: 0 }}>
              {volunteer.photoUrl && (
                <img 
                  src={volunteer.photoUrl}
                  alt="Volunteer"
                  crossOrigin="anonymous"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '28px'
                  }}
                />
              )}
            </div>

            {/* Details Container */}
            <div
              style={{
                width: '430px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingBottom: '0px'
              }}
            >

              {/* Age | Gender */}
              <div style={{ fontFamily: '"Nexa Book", "Montserrat", sans-serif', fontSize: '32px', color: '#000000', display: 'flex', alignItems: 'center' }}>
                {volunteer.age} yrs &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#000000' }}>|</span>&nbsp;&nbsp;&nbsp;&nbsp; {volunteer.gender}
              </div>
              
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(0,0,0,0.15)' }} />

              {/* Institution */}
              <div style={{ fontFamily: '"Nexa Book", "Montserrat", sans-serif', fontSize: '32px', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {volunteer.institution}
              </div>

              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(0,0,0,0.15)' }} />

              {/* Place */}
              <div style={{ fontFamily: '"Nexa Book", "Montserrat", sans-serif', fontSize: '32px', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {volunteer.address}
              </div>

              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(0,0,0,0.15)' }} />

              {/* District */}
              <div style={{ fontFamily: '"Nexa Book", "Montserrat", sans-serif', fontSize: '32px', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {volunteer.district}
              </div>

              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(0,0,0,0.15)' }} />

              {/* Phone Number */}
              <div style={{ fontFamily: '"Nexa Bold", "Nexa", "Montserrat", sans-serif', fontWeight: 700, fontSize: '38px', color: '#000000', marginTop: '6px' }}>
                {volunteer.mobileNumber}
              </div>
            </div>
          </div>

          {/* QR Code */}
          {qrUrl && (
            <img 
              src={qrUrl} 
              alt="QR Code" 
              style={{
                position: 'absolute',
                left: '1260px',
                top: '660px',
                width: '220px',
                height: '220px'
              }}
            />
          )}

        </div>

        </div>
        
        {/* Action Buttons */}
        <div className="absolute bottom-6 left-0 w-full flex justify-center z-50 px-4">
          <div className="flex gap-4 w-full max-w-[640px]">
            <button 
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-900 font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? 'Saving...' : <><Download size={18} /> Download ID</>}
            </button>
            
            <button 
              onClick={onClose}
              className="flex-1 bg-[#3a1c71] hover:bg-[#8e2b77] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
