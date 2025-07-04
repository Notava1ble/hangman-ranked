# 1) Load substrings to exclude
with open("./temp/includes.txt", "r", encoding="utf-8") as f:
    includes = {s.strip().lower() for s in f if s.strip()}

# 2) Prepare input/output paths
INPUT  = "./temp/ml_clean.txt"          # your cleaned list
OUTPUT = "./temp/ml_clean_stripped.txt" # filtered-out includes

# 3) Filter
with open(INPUT, "r", encoding="utf-8") as infile, \
     open(OUTPUT, "w", encoding="utf-8") as outfile:
    
    for line in infile:
        word = line.strip()
        lw   = word.lower()
        
        # if NONE of the substrings appear in the word, we keep it
        if not any(inc in lw for inc in includes):
            outfile.write(word + "\n")

print(f"✅ Written filtered list to {OUTPUT}")
