import { Injectable, signal, effect, Renderer2, RendererFactory2 } from '@angular/core';

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: number;
  letterSpacing: boolean;
  highlightLinks: boolean;
  disableAnimations: boolean;
}

// ДОДАНО: Об'єкт з налаштуваннями за замовчуванням
const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 0,
  letterSpacing: false,
  highlightLinks: false,
  disableAnimations: false,
};

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private renderer: Renderer2;
  private readonly storageKey = 'accessibility-settings';

  public settings = signal<AccessibilitySettings>(this.loadSettingsFromStorage());

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    effect(() => {
      this.applySettingsToRoot(this.settings());
      this.saveSettingsToStorage(this.settings());
    });
  }

  // --- ДОДАНО: Новий публічний метод для скидання налаштувань ---
  public resetToDefaults(): void {
    // Встановлюємо в сигнал значення за замовчуванням
    this.settings.set(defaultSettings);
  }

  // Змінено: Тепер метод завантаження використовує об'єкт defaultSettings
  private loadSettingsFromStorage(): AccessibilitySettings {
    try {
      const storedSettings = localStorage.getItem(this.storageKey);
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
    } catch (e) {
      console.error('Failed to load accessibility settings from localStorage', e);
    }
    return defaultSettings; // Повертаємо об'єкт за замовчуванням
  }

  // --- Решта коду сервісу залишається без змін ---

  private applySettingsToRoot(settings: AccessibilitySettings): void {
    const root = document.documentElement;
    this.toggleClass(root, 'high-contrast', settings.highContrast);
    this.toggleClass(root, 'increased-letter-spacing', settings.letterSpacing);
    this.toggleClass(root, 'highlight-links', settings.highlightLinks);
    this.toggleClass(root, 'disable-animations', settings.disableAnimations);

    root.classList.remove('font-size-small', 'font-size-large', 'font-size-xlarge');
    if (settings.fontSize === 1) this.renderer.addClass(root, 'font-size-large');
    if (settings.fontSize === 2) this.renderer.addClass(root, 'font-size-xlarge');
    if (settings.fontSize === -1) this.renderer.addClass(root, 'font-size-small');
  }

  private saveSettingsToStorage(settings: AccessibilitySettings): void {
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }

  private toggleClass(element: HTMLElement, className: string, state: boolean): void {
    if (state) this.renderer.addClass(element, className);
    else this.renderer.removeClass(element, className);
  }

  public toggleHighContrast(): void { this.settings.update(s => ({ ...s, highContrast: !s.highContrast })); }
  public changeFontSize(step: number): void { this.settings.update(s => ({ ...s, fontSize: Math.max(-1, Math.min(2, s.fontSize + step)) })); }
  public toggleLetterSpacing(): void { this.settings.update(s => ({ ...s, letterSpacing: !s.letterSpacing })); }
  public toggleHighlightLinks(): void { this.settings.update(s => ({ ...s, highlightLinks: !s.highlightLinks })); }
  public toggleAnimations(): void { this.settings.update(s => ({ ...s, disableAnimations: !s.disableAnimations })); }
}
