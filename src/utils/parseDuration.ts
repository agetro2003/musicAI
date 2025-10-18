 
  //function to parse the duration (ej: "q" becomes "4n"
  export const parseDuration = (duration: string, dotted: boolean = false) => {
    let newDuration = duration;
    switch (duration) {
      case 'q':
        newDuration = '4n';
        break;
      case 'h':
        newDuration = '2n';
        break;
      case '8':
        newDuration = '8n';
        break;
      case'16':
        newDuration = '16n';
        break;
      case 'w':
        newDuration = '1n';
        break;
        // silent notes
      case 'hr':
        newDuration = '2n';
        break;
      case '8r':
        newDuration = '8n';
        break;
      case '16r':
        newDuration = '16n';
        break;
      case 'qr':
        newDuration = '4n';
        break;
      case 'wr':
        newDuration = '1n';
        break;
      default: 
        newDuration = duration; // Keep original if no match
    }
    if (dotted) {
      newDuration += '.'; // Add dotted if applicable
    }

    return newDuration;
  }