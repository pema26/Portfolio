// ============================================================================
//  A MINI project — a small tool you wrote to solve a real annoyance.
//  Copy this file to add another, then add it to src/content/projects/index.js.
// ============================================================================

import CodeBlock from '../../components/CodeBlock';
import FastaAnalyzerDemo from '../../components/FastaAnalyzerDemo';

export const meta = {
  id: 'fasta-analyzer', // becomes the URL: /projects/fasta-analyzer
  title: 'FASTA analyzer: sequence length, GC content and motif search',
  description:
    'Scientific sequence analysis and scripting in Python: parses FASTA records and reports each sequence’s length, GC content and where a motif such as ATG occurs — written with plain Python, no libraries, with a box on this page to try it.',
  category: 'mini-unique', // big-unique | guided | mini-unique
  status: 'complete', // planned | in-progress | complete
  date: '2026-04-15', // YYYY-MM-DD — EDIT HERE: set to when you actually wrote it
  tags: ['Python', 'bioinformatics', 'string processing'],
  // githubUrl: '[[GITHUB_URL]]', // optional — uncomment and set
  devlog: [],
  featured: false, // show on the home page?
};

// The program, shown on the page. It is kept in a template literal (backticks)
// so its line breaks and indentation are preserved exactly. Inside a template
// literal a backslash must be written twice (\\n shows as \n on the page).
const fastaAnalyzerCode = `def fasta_check(fasta):
    return len(fasta) > 0 and fasta[0] == '>'

def greater_than_check(fasta):
    greater_than_pos = []

    for index, char in enumerate(fasta):
        if char == '>':
            greater_than_pos.append(index)

    return greater_than_pos

def fasta_text(fasta):
    header_store = []
    fasta_store = []

    fasta_upper = fasta.upper()
    seq_chars = ('A', 'T', 'C', 'G', 'U', 'N')

    check = greater_than_check(fasta)

    # loop through each FASTA record chunk
    for i in range(len(check)):
        start = check[i]

        if i < len(check) - 1:
            end = check[i + 1]
        else:
            end = len(fasta)

        chunk = fasta[start:end]
        chunk_upper = fasta_upper[start:end]

        # now use your style INSIDE each chunk
        for num in range(len(chunk_upper) - 9):
            if (chunk_upper[num] == ' ' or chunk_upper[num] == '\\n') and (
                chunk_upper[num+1] in seq_chars and
                chunk_upper[num+2] in seq_chars and
                chunk_upper[num+3] in seq_chars and
                chunk_upper[num+4] in seq_chars and
                chunk_upper[num+5] in seq_chars and
                chunk_upper[num+6] in seq_chars and
                chunk_upper[num+7] in seq_chars and
                chunk_upper[num+8] in seq_chars and
                chunk_upper[num+9] in seq_chars
            ):
                header_store.append(chunk[:num].strip())
                fasta_store.append(chunk[num+1:].replace(' ', '').replace('\\n', ''))
                break

    return fasta_store, header_store

def fasta_num_check(sequence):
    for char in sequence:
        if char.isnumeric():
            return True
    return False

def sequence_check(sequence):
    valid_chars = ('A', 'T', 'C', 'G', 'U', 'N')

    for char in sequence:
        if char not in valid_chars:
            return False
    return True

def fasta_sequence_calc(sequence):
    fasta_upper = sequence.upper()

    # first calculation
    sequence_length = len(sequence)

    # Percentage of bases that are either G or C bases
    G_or_C_count = 0

    for num in range(sequence_length):
        if fasta_upper[num] == 'G' or fasta_upper[num] == 'C':
            G_or_C_count += 1

    G_or_C_percentage = (G_or_C_count / sequence_length) * 100 if sequence_length > 0 else 0

    # second calculation
    GC_pos = []
    GC_count = 0

    for num in range(sequence_length - 1):
        if fasta_upper[num:num+2] == "GC":
            GC_pos.append(num)
            GC_count += 1

    # third calculation
    ATG_pos = []
    ATG_count = 0
    for num in range(sequence_length - 2):
        if fasta_upper[num:num+3] == "ATG":
            ATG_pos.append(num)
            ATG_count += 1

    return sequence_length, G_or_C_percentage, GC_pos, GC_count, ATG_pos, ATG_count


# main
fasta_input = input("Enter your FASTA sequence: ")

if fasta_check(fasta_input):
    fasta_seq_texts, header_texts = fasta_text(fasta_input)

    print("fasta text:", fasta_seq_texts, "\\n")
    print("header text:", header_texts, "\\n")

    lengths = []

    for header, seq in zip(header_texts, fasta_seq_texts):
        print("HEADER:", header)
        print("SEQUENCE:", seq)

        if not fasta_num_check(seq) and sequence_check(seq):
            calc = fasta_sequence_calc(seq)
            lengths.append(calc[0])
            print("calculations:", calc, "\\n")
        else:
            print("FASTA sequence either contains a number or contains a character that is not relevant to sequence\\n")

    if lengths:
        mean_length = sum(lengths) / len(lengths)
        min_length = min(lengths)
        max_length = max(lengths)

        print("SUMMARY STATS")
        print("Mean length:", mean_length)
        print("Min length:", min_length)
        print("Max length:", max_length)

else:
    print("Sequence input is not an appropriate Fasta sequence")`;

export default function FastaAnalyzer() {
  return (
    <>
      <h2>Try it</h2>

      <p>
        Paste one or more FASTA records below (or use the sample) and
        press <strong>Analyze</strong>. Sequences need to be in capital letters. The original
        is a Python program; a web page cannot run Python, so this box runs the same functions
        translated line by line into JavaScript. The Python itself is at the bottom of the page.
      </p>

      <FastaAnalyzerDemo />

      <h2>The idea</h2>

      <p>
        FASTA is the plain-text format biological sequences are shared in: a header line
        starting with <code>&gt;</code> that names the sequence, followed by the sequence
        itself. I work with these in the lab, so as a first project I wanted to read them with
        my own code rather than a ready-made library, and answer three basic questions about
        each sequence.
      </p>

      <h2>What it does</h2>

      <ul>
        <li>
          Splits the input into records by finding every <code>&gt;</code>, then separates each
          record’s header from its sequence.
        </li>
        <li>
          Checks that each sequence contains only valid bases (A, T, C, G, U, or N for unknown).
        </li>
        <li>
          Reports the <strong>length</strong>, the <strong>GC content</strong> (the percentage of
          bases that are G or C), and the positions of the motifs <code>GC</code> and <code>ATG</code>.
        </li>
        <li>
          Finishes with summary statistics across all the sequences: mean, shortest and longest
          length.
        </li>
      </ul>

      <p>
        Run on the two human COMT (catechol-O-methyltransferase) mRNA transcripts, it reports
        2,272 bases at 59.1% GC with 21 ATG sites for the first, and 2,297 bases at 58.1% GC
        with 22 ATG sites for the second.
      </p>

      <h2>What I learned</h2>

      <p>
        The hardest part was not the biology but finding where a header ends, because I was
        pasting the text in as one long line with no line breaks to rely on. My rule: the
        sequence starts at the first space that is followed by at least nine valid bases in a
        row. A header is ordinary English, so a run that long does not appear in it.
      </p>

      <p>
        My first version worked for one sequence and failed for two. I had written the checks to
        take a single sequence, but once the input held several records I was handing them the
        whole list, so every input was rejected. I used an AI to help me find that, and the fix
        was to loop over the records one at a time; the summary statistics were added in the
        same revision. The parsing and the calculations are my own.
      </p>

      <p>
        It also showed me what I would do differently: read from a file instead of pasted text,
        and keep the reading, the analysis and the printing in separate functions. Both are on
        my list below.
      </p>

      <h2>The code</h2>

      <CodeBlock language="python" code={fastaAnalyzerCode} />
    </>
  );
}
