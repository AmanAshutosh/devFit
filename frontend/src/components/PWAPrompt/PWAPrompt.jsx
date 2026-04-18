import React, { useEffect, useState } from "react";
import { RiAddCircleLine, RiCloseLine, RiSmartphoneLine } from "react-icons/ri";
import "./PWAPrompt.css";

const PWAPrompt = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("devfit_pwa_dismissed");
    if (dismissed) return;

    const ios = /iphone|ipad|ipod/.test(
      window.navigator.userAgent.toLowerCase(),
    );
    const standalone = window.navigator.standalone;
    setIsIOS(ios);

    if (ios && !standalone) {
      setTimeout(() => setShow(true), 3000);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShow(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setShow(false);
    }
    dismiss();
  };

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("devfit_pwa_dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="pwa-prompt">
      <div className="pwa-prompt-icon">
        <RiSmartphoneLine size={22} />
      </div>
      <div className="pwa-prompt-content">
        <div className="pwa-prompt-title">Add devFit to Home Screen</div>
        {isIOS ? (
          <div className="pwa-prompt-desc">
            Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> for
            the full app experience.
          </div>
        ) : (
          <div className="pwa-prompt-desc">
            Install devFit as an app for faster access and offline features.
          </div>
        )}
      </div>
      {!isIOS && (
        <button className="pwa-install-btn" onClick={handleInstall}>
          <RiAddCircleLine size={14} />
          Install
        </button>
      )}
      <button className="pwa-dismiss-btn" onClick={dismiss}>
        <RiCloseLine size={16} />
      </button>
    </div>
  );
};

export default PWAPrompt;
