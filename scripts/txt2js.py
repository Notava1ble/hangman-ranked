#!/usr/bin/env python3

import argparse
import json
import sys
from pathlib import Path

def txt_to_js_array(input_path: Path, output_path: Path, var_name: str = "words"):
  # Read and clean words
  with input_path.open(encoding="utf-8") as f:
    words = [line.strip() for line in f if line.strip()]
  # Serialize to JS-friendly JSON (double-quoted strings)
  array_str = json.dumps(words, ensure_ascii=False, indent=2)
  # Build JS content
  js_content = f"// Auto-generated from {input_path.name}\n"
  js_content += f"export const {var_name} = {array_str};\n"
  # Write to output
  with output_path.open("w", encoding="utf-8") as f:
    f.write(js_content)
  print(f"Wrote {len(words)} words to {output_path}")

def main():
  parser = argparse.ArgumentParser(
    description="Convert a newline-separated TXT of words into a JS array export"
  )
  parser.add_argument(
    "input", help="Path to input .txt file", type=Path
  )
  parser.add_argument(
    "output", help="Path to output .js file", type=Path
  )
  parser.add_argument(
    "--name", "-n",
    help="Variable name for the array (default: words)",
    default="words"
  )
  args = parser.parse_args()

  if not args.input.exists():
    print(f"Error: input file {args.input} does not exist.", file=sys.stderr)
    sys.exit(1)

  txt_to_js_array(args.input, args.output, args.name)

if __name__ == "__main__":
  main()
