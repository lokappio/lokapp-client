import { descape } from "./utils";

interface Token {
  key: string;
  value: string;
}

function match(data: string, index: number, regex: RegExp, label?: string): string {
  const subdata = data.slice(index, data.length);
  const found = subdata.match(regex);
  if (label && !found) throw new Error(`Expected ${label} at ${subdata.slice(0, 20)}...`);
  if (!found) return '';
  return found[0]
}

function ignore(data: string, index: number, newline: boolean): number {
  let curr = 0;

  while (curr !== -1) {
    const part = data.slice(index + curr, data.length);

    // Ignore whitespaces, including newlines
    if (newline) {
      if (part.match(/^\s/)) {
        curr += match(part, 0, /^\s+/).length;
        continue;
      }
    } else {
      if (part.match(/^[ \t]/)) {
        curr += match(part, 0, /^[ \t]+/).length;
        continue;
      }
    }

    // Ignore comments then multiline comments
    if (part[0] === '/') {
      if (part[1] === '/') {
        curr += match(part, 0, /^\/\/[^\n\r]*[\n\r]+/, 'single line comment').length;
        continue;
      }

      if (part[1] === '*') {
        curr += match(part, 0, /^\/\*((?!\*\/).)*\*\//, 'multi line comment').length;
        continue;
      }
    }

    break;
  }

  return curr;
}

function parseKeyVal(data: string, index: number): [Token, number] {
  let subindex = 0;

  const part = data.slice(index, data.length);

  // Parse key
  const key = match(part, subindex, /^"[^"]*"/, 'key');
  subindex += key.length;

  // Ignore whitespaces
  subindex += ignore(part, subindex, true);

  // Parse equal sign
  subindex += match(part, subindex, /^=/, 'equal sign').length;

  // Ignore whitespaces
  subindex += ignore(part, subindex, true);

  // Parse value
  const value = match(part, subindex, /^"[^"]*"/, 'value');
  subindex += value.length;

  // Ignore whitespaces
  subindex += ignore(part, subindex, true);

  // Parse semicolon
  subindex += match(part, subindex, /^;/, 'semicolon').length;

  return [
    {
      key: descape(key),
      value: descape(value),
    },
    subindex,
  ];
}


const parse = (data: string): Token[] => {
  let index = 0;
  const res: Token[] = [];

  while (index < data.length) {
    // Ignore whitespaces including newlines, comments, and multiline comments
    index = index + ignore(data, index, true);
    const c = data[index];

    // Parse key value
    if (c === '"') {
      const [token, addIndex] = parseKeyVal(data, index);
      index = index + addIndex;
      res.push(token);
    }
  }

  return res;
}

export default parse;
