export type ParsedResult = {
  usermap: Map<string, string[]>;
  invalidLines: string[];
};

const TIP_LINE_REGEX = /^(\S+)\s+tipped\s+(\d+)\s+tokens$/u;
const NOTICE_LINE_REGEX = /^Notice:\s+@(\S+).*tipped for →(.*)$/u;

export function trimWhitespaceAndEmotes(str: string) {
  return str
    .replace(
      /^(?:\s|[\p{Emoji_Presentation}\p{Extended_Pictographic}]|:[a-zA-Z0-9_]+:)+/gu,
      ""
    )
    .replace(
      /(?:\s|[\p{Emoji_Presentation}\p{Extended_Pictographic}]|:[a-zA-Z0-9_]+:)+$/gu,
      ""
    );
}

export function parseInput(value: string): ParsedResult {
  const values = value.trim().split(/\n/);
  const usermap = new Map<string, string[]>();
  const invalidLines: string[] = [];

  const clean = values.filter((v, i) => {
    if (!v) return false;
    if (values[i + 1]?.startsWith("Notice:")) return false;
    return true;
  });

  clean.forEach((line) => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith("Notice:")) {
      const match = NOTICE_LINE_REGEX.exec(line);
      if (!match) return invalidLines.push(line);

      const username = match[1];
      const menuItem = trimWhitespaceAndEmotes(match[2]);

      usermap.set(username, [...(usermap.get(username) || []), menuItem]);
      return;
    }

    const tipMatch = TIP_LINE_REGEX.exec(line);
    if (!tipMatch) return invalidLines.push(line);

    const username = tipMatch[1];
    const token = parseInt(tipMatch[2], 10);

    if (isNaN(token) || token < 500) return;

    const entry = `${token} tokens tipped`;
    usermap.set(username, [...(usermap.get(username) || []), entry]);
  });

  return { usermap, invalidLines };
}