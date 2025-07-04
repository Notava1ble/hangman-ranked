# Load profanity words into a set for fast lookup
with open("./temp/profanity.txt", "r", encoding="utf-8") as f:
    profanity = set(word.strip().lower() for word in f if word.strip())

# Read from filtered_5plus.txt and write only clean words
with open("./temp/filtered_5plus.txt", "r", encoding="utf-8") as infile, \
     open("./temp/clean.txt", "w", encoding="utf-8") as outfile:
    
    for line in infile:
        word = line.strip()
        if word.lower() not in profanity:
            outfile.write(word + "\n")
