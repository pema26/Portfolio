// ============================================================================
//  src/features/fasta/fasta.js: the FASTA analyzer's functions, in JavaScript
// ============================================================================
//
//  A web page cannot run Python, so these are the SAME functions as my Python
//  program (shown on the FASTA analyzer project page), translated line by
//  line. Each function keeps its Python name, written the JavaScript way:
//  fasta_check -> fastaCheck, and so on. Nothing here is new logic.
//
//  Python -> JavaScript, the only differences you will see:
//    len(x)             ->  x.length
//    x.append(y)        ->  x.push(y)
//    x[a:b]             ->  x.slice(a, b)
//    char in seq_chars  ->  seqChars.includes(char)
//    x.upper()          ->  x.toUpperCase()
//    x.strip()          ->  x.trim()
//    x.replace(a, b)    ->  x.replaceAll(a, b)
// ============================================================================

export function fastaCheck(fasta) {
  return fasta.length > 0 && fasta[0] === '>';
}

export function greaterThanCheck(fasta) {
  const greaterThanPos = [];

  for (let index = 0; index < fasta.length; index++) {
    if (fasta[index] === '>') {
      greaterThanPos.push(index);
    }
  }

  return greaterThanPos;
}

export function fastaText(fasta) {
  const headerStore = [];
  const fastaStore = [];

  const fastaUpper = fasta.toUpperCase();
  const seqChars = ['A', 'T', 'C', 'G', 'U', 'N'];

  const check = greaterThanCheck(fasta);

  // loop through each FASTA record chunk
  for (let i = 0; i < check.length; i++) {
    const start = check[i];
    let end;

    if (i < check.length - 1) {
      end = check[i + 1];
    } else {
      end = fasta.length;
    }

    const chunk = fasta.slice(start, end);
    const chunkUpper = fastaUpper.slice(start, end);

    // the sequence starts at the first space (or new line) that is followed
    // by nine valid bases in a row
    for (let num = 0; num < chunkUpper.length - 9; num++) {
      if ((chunkUpper[num] === ' ' || chunkUpper[num] === '\n') && (
        seqChars.includes(chunkUpper[num + 1]) &&
        seqChars.includes(chunkUpper[num + 2]) &&
        seqChars.includes(chunkUpper[num + 3]) &&
        seqChars.includes(chunkUpper[num + 4]) &&
        seqChars.includes(chunkUpper[num + 5]) &&
        seqChars.includes(chunkUpper[num + 6]) &&
        seqChars.includes(chunkUpper[num + 7]) &&
        seqChars.includes(chunkUpper[num + 8]) &&
        seqChars.includes(chunkUpper[num + 9])
      )) {
        headerStore.push(chunk.slice(0, num).trim());
        fastaStore.push(chunk.slice(num + 1).replaceAll(' ', '').replaceAll('\n', ''));
        break;
      }
    }
  }

  return [fastaStore, headerStore];
}

export function fastaNumCheck(sequence) {
  for (const char of sequence) {
    if (char >= '0' && char <= '9') {
      return true;
    }
  }
  return false;
}

export function sequenceCheck(sequence) {
  const validChars = ['A', 'T', 'C', 'G', 'U', 'N'];

  for (const char of sequence) {
    if (!validChars.includes(char)) {
      return false;
    }
  }
  return true;
}

export function fastaSequenceCalc(sequence) {
  const fastaUpper = sequence.toUpperCase();

  // first calculation
  const sequenceLength = sequence.length;

  // Percentage of bases that are either G or C bases
  let gOrCCount = 0;

  for (let num = 0; num < sequenceLength; num++) {
    if (fastaUpper[num] === 'G' || fastaUpper[num] === 'C') {
      gOrCCount += 1;
    }
  }

  const gOrCPercentage = sequenceLength > 0 ? (gOrCCount / sequenceLength) * 100 : 0;

  // second calculation
  const gcPos = [];
  let gcCount = 0;

  for (let num = 0; num < sequenceLength - 1; num++) {
    if (fastaUpper.slice(num, num + 2) === 'GC') {
      gcPos.push(num);
      gcCount += 1;
    }
  }

  // third calculation
  const atgPos = [];
  let atgCount = 0;
  for (let num = 0; num < sequenceLength - 2; num++) {
    if (fastaUpper.slice(num, num + 3) === 'ATG') {
      atgPos.push(num);
      atgCount += 1;
    }
  }

  return [sequenceLength, gOrCPercentage, gcPos, gcCount, atgPos, atgCount];
}

// The "# main" part of the Python program. Python prints each line as it
// goes; here every line is collected in a list and handed back, so the page
// can show them.
export function analyzeFasta(fastaInput) {
  const lines = [];

  if (fastaCheck(fastaInput)) {
    const [fastaSeqTexts, headerTexts] = fastaText(fastaInput);

    const lengths = [];

    for (let i = 0; i < headerTexts.length; i++) {
      const header = headerTexts[i];
      const seq = fastaSeqTexts[i];

      lines.push('HEADER: ' + header);
      lines.push('SEQUENCE: ' + seq);

      if (!fastaNumCheck(seq) && sequenceCheck(seq)) {
        const calc = fastaSequenceCalc(seq);
        lengths.push(calc[0]);
        lines.push('Length: ' + calc[0]);
        lines.push('G or C percentage: ' + calc[1]);
        lines.push('GC positions: ' + calc[2].join(', ') + '  (count: ' + calc[3] + ')');
        lines.push('ATG positions: ' + calc[4].join(', ') + '  (count: ' + calc[5] + ')');
        lines.push('');
      } else {
        lines.push('FASTA sequence either contains a number or contains a character that is not relevant to sequence');
        lines.push('');
      }
    }

    if (lengths.length > 0) {
      let total = 0;
      for (const length of lengths) {
        total += length;
      }

      lines.push('SUMMARY STATS');
      lines.push('Mean length: ' + total / lengths.length);
      lines.push('Min length: ' + Math.min(...lengths));
      lines.push('Max length: ' + Math.max(...lengths));
    }
  } else {
    lines.push('Sequence input is not an appropriate Fasta sequence');
  }

  return lines;
}
