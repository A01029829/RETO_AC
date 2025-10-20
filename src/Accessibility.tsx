import React, { createContext, useContext, useState, useEffect } from "react";

interface AccessibilityContextProps {
  fontSize: string;
  fontFamily: string;
  setFontSize: (size: string) => void;
  toggleDyslexicFont: () => void;
  dyslexicEnabled: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

const loadOpenDyslexicFont = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @font-face {
      font-family: 'OpenDyslexic';
      src: url('/fonts/OpenDyslexic-Regular.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
  `;
  document.head.appendChild(style);
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "16px");
  const [dyslexicEnabled, setDyslexicEnabled] = useState(
    localStorage.getItem("dyslexicEnabled") === "true"
  );

  useEffect(() => {
    loadOpenDyslexicFont();
  }, []);

  useEffect(() => {
    const fontFamily = dyslexicEnabled 
      ? "'OpenDyslexic', Arial, sans-serif" 
      : "Arial, sans-serif";
    
    const oldStyle = document.getElementById('accessibility-styles');
    if (oldStyle) {
      oldStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'accessibility-styles';
    style.innerHTML = `
      html, body, * {
        font-family: ${fontFamily} !important;
      }
      
      html {
        font-size: ${fontSize} !important;
      }
      
      .MuiTypography-root,
      .MuiButton-root,
      .MuiMenuItem-root,
      .MuiInputBase-root,
      .MuiListItemText-root,
      .RaMenuItemLink-root,
      .RaLayout-content,
      button, input, select, textarea {
        font-family: ${fontFamily} !important;
      }
    `;
    
    document.head.appendChild(style);

    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("dyslexicEnabled", String(dyslexicEnabled));
    
    console.log('Font cambiada a:', fontFamily);
  }, [fontSize, dyslexicEnabled]);

  const toggleDyslexicFont = () => setDyslexicEnabled((prev) => !prev);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        fontFamily: dyslexicEnabled ? "OpenDyslexic" : "Arial",
        setFontSize,
        toggleDyslexicFont,
        dyslexicEnabled,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within an AccessibilityProvider");
  return context;
};