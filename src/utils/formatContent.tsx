import { ReactNode } from 'react';
import TrademarkCostCalculator from '../components/TrademarkCostCalculator';
import CollapsibleSection from '../components/CollapsibleSection';

export function formatBlogContent(content: string): ReactNode[] {
  let processedContent = content.replace(/\\n/g, '\n');

  const lines = processedContent.split('\n');
  const elements: ReactNode[] = [];
  let bulletPoints: string[] = [];
  let bulletStartIndex = -1;
  let skipLines = new Set<number>();
  let isFirstParagraph = true;

  const flushBulletPoints = (currentIndex: number) => {
    if (bulletPoints.length > 0) {
      elements.push(
        <ul key={`bullets-${bulletStartIndex}`} className="list-disc pl-6 mb-6 space-y-2">
          {bulletPoints.map((point, idx) => (
            <li key={`${bulletStartIndex}-${idx}`} className="leading-relaxed text-slate-700">
              {formatInlineMarkdown(point, currentIndex + idx)}
            </li>
          ))}
        </ul>
      );
      bulletPoints = [];
      bulletStartIndex = -1;
    }
  };

  const isTableLine = (line: string): boolean => {
    return line.trim().startsWith('|') && line.trim().endsWith('|');
  };

  const parseTable = (startIndex: number): { endIndex: number; table: ReactNode } | null => {
    const tableLines: string[] = [];
    let i = startIndex;

    while (i < lines.length && isTableLine(lines[i])) {
      tableLines.push(lines[i]);
      i++;
    }

    if (tableLines.length < 2) return null;

    const headerLine = tableLines[0];
    const separatorLine = tableLines[1];

    if (!separatorLine.includes('---')) return null;

    const headers = headerLine
      .split('|')
      .map(h => h.trim())
      .filter(h => h.length > 0);

    const rows = tableLines.slice(2).map(line =>
      line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0 || headers.length > 0)
    );

    const table = (
      <div key={`table-${startIndex}`} className="my-8 overflow-x-auto">
        <table className="min-w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-slate-900">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-left text-sm font-bold text-white border-r border-slate-700 last:border-r-0"
                >
                  {formatInlineMarkdown(header, startIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={rowIdx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-6 py-4 text-sm text-slate-700 border-r border-slate-200 last:border-r-0"
                  >
                    {formatInlineMarkdown(cell, startIndex + rowIdx + 2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    for (let j = startIndex; j < i; j++) {
      skipLines.add(j);
    }
    if (i < lines.length && lines[i].trim() === '') {
      skipLines.add(i);
    }

    return { endIndex: i, table };
  };

  const isStandaloneNumber = (line: string): boolean => {
    return /^\s*\d+\s*$/.test(line);
  };

  const isSubheading = (line: string): boolean => {
    const boldHeadings = [
      '**The Mistake:**',
      '**The Risk:**',
      '**The Solution:**',
      '**Why It Matters:**',
      '**Best Practice:**',
      '**Common Issues:**',
      '**Timeline:**',
      '**What This Means:**',
      '**Key Considerations:**',
      '**Important:**',
      '**Note:**',
      '**Remember:**',
      '**Pro Tip:**',
      '**Ideal for:**',
      '**Example scenarios:**',
      '**Examples:**',
      '**Costs:**',
      '**Benefits:**',
      '**What the USPTO requires:**',
      '**Legal Foundation**',
      '**Quick Answer: Total Trademark Costs**'
    ];
    return boldHeadings.some(heading => line.trim().startsWith(heading));
  };

  const isSectionTitle = (line: string, index: number): boolean => {
    const trimmed = line.trim();
    if (trimmed.length < 10 || trimmed.length > 150) return false;

    if (/^[A-Z]/.test(trimmed) &&
        !trimmed.endsWith('.') &&
        !trimmed.startsWith('**') &&
        !trimmed.startsWith('-') &&
        !trimmed.startsWith('•') &&
        !trimmed.startsWith('|') &&
        trimmed.includes(' ')) {

      const nextLine = lines[index + 1];
      if (nextLine && nextLine.trim() === '') {
        skipLines.add(index + 1);
        return true;
      }
    }
    return false;
  };

  lines.forEach((line, index) => {
    if (skipLines.has(index)) {
      return;
    }

    const trimmed = line.trim();

    if (isTableLine(trimmed)) {
      flushBulletPoints(index);
      const tableResult = parseTable(index);
      if (tableResult) {
        elements.push(tableResult.table);
      }
      return;
    }

    if (trimmed === '[INTERACTIVE_CALCULATOR]') {
      flushBulletPoints(index);
      elements.push(<TrademarkCostCalculator key={`calculator-${index}`} />);
      return;
    }

    if (trimmed.startsWith('[COLLAPSIBLE:') && trimmed.endsWith(']')) {
      flushBulletPoints(index);
      const title = trimmed.slice(13, -1);
      const contentLines: string[] = [];
      let i = index + 1;

      while (i < lines.length && lines[i].trim() !== '[/COLLAPSIBLE]') {
        contentLines.push(lines[i]);
        skipLines.add(i);
        i++;
      }
      if (i < lines.length) {
        skipLines.add(i);
      }

      if (contentLines.length > 0) {
        elements.push(
          <CollapsibleSection key={`collapsible-${index}`} title={title}>
            {formatBlogContent(contentLines.join('\n'))}
          </CollapsibleSection>
        );
      }
      return;
    }

    if (trimmed === '[/COLLAPSIBLE]') {
      return;
    }

    if (isStandaloneNumber(trimmed)) {
      flushBulletPoints(index);
      const nextLine = lines[index + 1];
      const nextTrimmed = nextLine ? nextLine.trim() : '';

      if (nextTrimmed) {
        skipLines.add(index + 1);
        const emptyAfter = lines[index + 2] && lines[index + 2].trim() === '';
        if (emptyAfter) {
          skipLines.add(index + 2);
        }

        elements.push(
          <div key={index} className="bg-gradient-to-r from-slate-50 to-slate-100 border-l-4 border-slate-600 rounded-r-lg p-6 mb-6 mt-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-slate-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                {trimmed}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">
                  {formatInlineMarkdown(nextTrimmed, index + 1)}
                </h3>
              </div>
            </div>
          </div>
        );
      }
      return;
    }

    if (isSubheading(trimmed)) {
      flushBulletPoints(index);
      const text = trimmed.replace(/\*\*/g, '');
      const colorMap: Record<string, string> = {
        'The Mistake:': 'red',
        'The Risk:': 'orange',
        'The Solution:': 'green',
        'Timeline:': 'blue',
        'Why It Matters:': 'teal',
        'Best Practice:': 'green',
        'Common Issues:': 'orange',
        'Important:': 'red',
        'Note:': 'blue',
        'Pro Tip:': 'teal',
        'Ideal for:': 'blue',
        'Benefits:': 'green',
        'Costs:': 'orange',
        'Examples:': 'slate',
        'Example scenarios:': 'slate'
      };

      let color = 'slate';
      for (const [key, val] of Object.entries(colorMap)) {
        if (text.includes(key)) {
          color = val;
          break;
        }
      }

      elements.push(
        <div key={index} className={`bg-${color}-50 border-l-4 border-${color}-500 rounded-r-lg p-4 mb-4 mt-6`}>
          <h4 className={`text-lg font-bold text-${color}-900`}>
            {text}
          </h4>
        </div>
      );
      return;
    }

    if (isSectionTitle(trimmed, index)) {
      flushBulletPoints(index);
      elements.push(
        <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-600 rounded-r-lg p-5 mb-6 mt-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            {formatInlineMarkdown(trimmed, index)}
          </h2>
        </div>
      );
      return;
    }

    if (trimmed.match(/^→\s+(.+)$/)) {
      flushBulletPoints(index);
      const text = trimmed.replace(/^→\s+/, '');
      elements.push(
        <div key={index} className="flex items-start gap-3 mb-3 ml-4">
          <span className="text-blue-600 text-xl flex-shrink-0">→</span>
          <p className="leading-relaxed text-slate-700">
            {formatInlineMarkdown(text, index)}
          </p>
        </div>
      );
      return;
    }

    if (trimmed.match(/^[✓✔☑]\s+(.+)$/)) {
      flushBulletPoints(index);
      const text = trimmed.replace(/^[✓✔☑]\s+/, '');
      elements.push(
        <div key={index} className="flex items-start gap-3 mb-3 bg-green-50 p-3 rounded-lg">
          <span className="text-green-600 text-xl flex-shrink-0">✓</span>
          <p className="leading-relaxed text-slate-700 font-medium">
            {formatInlineMarkdown(text, index)}
          </p>
        </div>
      );
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
      if (bulletStartIndex === -1) {
        bulletStartIndex = index;
      }
      const point = trimmed.replace(/^[-•*]\s+/, '');
      bulletPoints.push(point);
      return;
    }

    if (trimmed.startsWith('---') && trimmed.length > 3) {
      flushBulletPoints(index);
      elements.push(
        <hr key={index} className="my-8 border-t-2 border-slate-200" />
      );
      return;
    }

    if (trimmed.length > 0) {
      flushBulletPoints(index);
      const formattedLine = formatInlineMarkdown(trimmed, index);

      if (isFirstParagraph && trimmed.length > 50 && !trimmed.match(/^\d/) && !trimmed.startsWith('*')) {
        isFirstParagraph = false;
        elements.push(
          <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8 shadow-sm">
            <p className="text-lg leading-relaxed text-slate-800 font-medium">
              {formattedLine}
            </p>
          </div>
        );
      } else {
        elements.push(
          <p key={index} className="mb-4 leading-relaxed text-slate-700">
            {formattedLine}
          </p>
        );
      }
    } else {
      flushBulletPoints(index);
      elements.push(<div key={index} className="h-3" />);
    }
  });

  flushBulletPoints(lines.length);
  return elements;
}

function formatInlineMarkdown(text: string, lineIndex: number): ReactNode[] {
  const tokens: Array<{ type: string; content: string; start: number; end: number; url?: string }> = [];

  const patterns = [
    { regex: /\*\*(.*?)\*\*/g, type: 'bold' },
    { regex: /__([^_]+?)__/g, type: 'underline' },
    { regex: /\[([^\]]+?)\]\(([^)]+?)\)/g, type: 'link' },
    { regex: /`([^`]+?)`/g, type: 'code' },
    { regex: /\*([^*]+?)\*/g, type: 'italic' }
  ];

  patterns.forEach(({ regex, type }) => {
    let match;
    const localRegex = new RegExp(regex.source, regex.flags);
    while ((match = localRegex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const content = match[1];
      const url = type === 'link' ? match[2] : undefined;

      const overlapping = tokens.some(token =>
        (start >= token.start && start < token.end) ||
        (end > token.start && end <= token.end) ||
        (start <= token.start && end >= token.end)
      );

      if (!overlapping) {
        tokens.push({ type, content, start, end, ...(url && { url }) });
      }
    }
  });

  tokens.sort((a, b) => a.start - b.start);

  const parts: ReactNode[] = [];
  let currentIndex = 0;
  let partIndex = 0;

  tokens.forEach((token) => {
    if (token.start > currentIndex) {
      parts.push(text.substring(currentIndex, token.start));
      partIndex++;
    }

    switch (token.type) {
      case 'bold':
        parts.push(
          <strong key={`${lineIndex}-${partIndex}`} className="font-bold text-slate-900">
            {token.content}
          </strong>
        );
        break;
      case 'italic':
        parts.push(
          <em key={`${lineIndex}-${partIndex}`} className="italic">
            {token.content}
          </em>
        );
        break;
      case 'underline':
        parts.push(
          <span key={`${lineIndex}-${partIndex}`} className="underline decoration-2 font-semibold">
            {token.content}
          </span>
        );
        break;
      case 'code':
        parts.push(
          <code key={`${lineIndex}-${partIndex}`} className="bg-slate-100 px-2 py-0.5 rounded text-sm font-mono text-slate-800">
            {token.content}
          </code>
        );
        break;
      case 'link':
        parts.push(
          <a
            key={`${lineIndex}-${partIndex}`}
            href={token.url}
            className="text-amber-600 hover:text-amber-700 underline font-medium transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {token.content}
          </a>
        );
        break;
    }

    partIndex++;
    currentIndex = token.end;
  });

  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : [text];
}
