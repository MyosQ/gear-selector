
  export function format_weight(weight) {
    if (typeof weight !== 'number' || isNaN(weight)) {
      throw new Error('Invalid weight value');
    }
    if (weight < 0) {
      throw new Error('Weight cannot be negative');
    }
    if (weight === 0) {
      return '0';
    }
    if (weight >= 1){
        if (Number.isInteger(weight)) {
          return `${weight} kg`;
        }
        return `${weight.toFixed(2)} kg`;
    }
    return `${(weight * 1000)} g`;
  }