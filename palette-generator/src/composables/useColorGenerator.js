// Вспомогательные функции для работы с цветами
export function hexToRgb(hex) {
  hex = hex.replace('#', '')
  
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }
  
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  return { r, g, b }
}

export function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}

export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex)
  
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min
  
  const l = (max + min) / 2
  
  if (delta === 0) {
    return { h: 0, s: 0, l: l }
  }
  
  let s = delta / (1 - Math.abs(2 * l - 1))
  
  let h = 0
  if (max === rNorm) {
    h = ((gNorm - bNorm) / delta) % 6
  } else if (max === gNorm) {
    h = (bNorm - rNorm) / delta + 2
  } else if (max === bNorm) {
    h = (rNorm - gNorm) / delta + 4
  }
  
  h = Math.round(h * 60)
  if (h < 0) h += 360
  
  return { h: h, s: s, l: l }
}

export function hslToHex(h, s, l) {
  let r, g, b
  
  if (s === 0) {
    r = g = b = Math.round(l * 255)
  } else {
    const hue = h / 60
    const chroma = (1 - Math.abs(2 * l - 1)) * s
    const x = chroma * (1 - Math.abs((hue % 2) - 1))
    const m = l - chroma / 2
    
    if (hue >= 0 && hue < 1) {
      r = chroma; g = x; b = 0
    } else if (hue >= 1 && hue < 2) {
      r = x; g = chroma; b = 0
    } else if (hue >= 2 && hue < 3) {
      r = 0; g = chroma; b = x
    } else if (hue >= 3 && hue < 4) {
      r = 0; g = x; b = chroma
    } else if (hue >= 4 && hue < 5) {
      r = x; g = 0; b = chroma
    } else {
      r = chroma; g = 0; b = x
    }
    
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)
  }
  
  return rgbToHex(r, g, b)
}

// Генерация гармоничных цветов
export function generateHarmonicColors(baseHex, type = 'complementary', count = 5) {
  const hsl = hexToHsl(baseHex)
  let hues = []
  
  switch (type) {
    case 'analogous':
      const step = 30
      for (let i = 0; i < count; i++) {
        hues.push((hsl.h + (i - Math.floor(count / 2)) * step + 360) % 360)
      }
      break;
    case 'monochromatic':
      hues = Array(count).fill(hsl.h)
      break;
    case 'triadic':
      hues = [
        hsl.h,
        (hsl.h + 120) % 360,
        (hsl.h + 240) % 360
      ]
      while (hues.length < count) {
        hues.push((hues[hues.length - 3] + 60) % 360)
      }
      break;
    case 'complementary':
      hues = [
        hsl.h,
        (hsl.h + 180) % 360
      ]
      while (hues.length < count) {
        hues.push((hues[hues.length - 2] + 30) % 360)
        hues.push((hues[hues.length - 2] + 150) % 360)
      }
      break;
    default:
      hues = Array.from({length: count}, () => Math.random() * 360)
  }
  
  hues = hues.slice(0, count)
  
  return hues.map((hue, index) => {
    if (type === 'monochromatic') {
      const s = 0.3 + (index / count) * 0.6
      const l = 0.4 + (index / count) * 0.4
      return hslToHex(hue, s, l)
    }
    
    return hslToHex(hue, 0.7, 0.5)
  })
}

// Генерация палитр по "настроению"
export function generateMoodPalette(mood = 'calm', count = 5) {
  let baseHue, hueRange, saturationRange, lightnessRange
  
  switch (mood) {
    case 'calm': // Спокойные цвета
      baseHue = 200
      hueRange = 60
      saturationRange = [0.3, 0.6]
      lightnessRange = [0.6, 0.8]
      break;
    case 'energetic': // Энергичные цвета
      baseHue = 10
      hueRange = 90
      saturationRange = [0.7, 0.9]
      lightnessRange = [0.4, 0.7]
      break;
    case 'professional': // Профессиональные/строгие цвета
      baseHue = 220
      hueRange = 40
      saturationRange = [0.2, 0.5]
      lightnessRange = [0.3, 0.6]
      break;
    default:
      baseHue = Math.random() * 360
      hueRange = 120
      saturationRange = [0.4, 0.8]
      lightnessRange = [0.3, 0.8]
  }
  
  return Array.from({length: count}, () => {
    const hue = (baseHue + (Math.random() * 2 - 1) * hueRange + 360) % 360
    const saturation = saturationRange[0] + Math.random() * (saturationRange[1] - saturationRange[0])
    const lightness = lightnessRange[0] + Math.random() * (lightnessRange[1] - lightnessRange[0])
    
    return hslToHex(hue, saturation, lightness)
  })
}

// Проверка контрастности по стандарту WCAG
export function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  
  const lum1 = getRelativeLuminance(rgb1)
  const lum2 = getRelativeLuminance(rgb2)
  
  const contrast = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
  
  return parseFloat(contrast.toFixed(2))
}

function getRelativeLuminance(rgb) {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  
  const rs = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const gs = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const bs = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Определение уровня доступности по контрасту
export function getWCAGLevel(ratio) {
  if (ratio >= 7.0) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'FAIL'
}

// Генерация случайного HEX-цвета
export function randomHex() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()
}