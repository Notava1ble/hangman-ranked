# Read filtered list and apply length filter
with open("./temp/filtered.txt", "r", encoding="utf-8") as infile, \
     open("./temp/filtered_5plus.txt", "w", encoding="utf-8") as outfile:
    
    for line in infile:
        word = line.strip()
        if len(word) >= 5:
            outfile.write(word + "\n")
