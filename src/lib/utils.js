
  export function format_weight(weight, decimalPlaces = 2) {
    if (typeof weight !== 'number' || isNaN(weight)) {
      throw new Error('Invalid weight value');
    }
    if (weight < 0) {
      throw new Error('Weight cannot be negative');
    }
    if (weight === 0) {
      return '0';
    }
    let unicode_nbsp = '\u00A0'; // Non-breaking space
    if (weight >= 1){
        if (Number.isInteger(weight)) {
          return `${weight}${unicode_nbsp}kg`;
        }
        return `${weight.toFixed(decimalPlaces)}${unicode_nbsp}kg`;
    }
    return `${(weight * 1000)} g`;
  }

  export function format_weight_summary(weight) {
    return format_weight(weight, 1);
  }