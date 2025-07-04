import csv

with open("./temp/Dictionary.txt", "r", encoding="utf-8") as f:
    dictionary = set(word.strip().lower() for word in f if word.strip())

with open("./temp/ngram_freq_dict.csv", "r", encoding="utf-8") as infile, \
     open("./temp/filtered.txt", "w", encoding="utf-8") as outfile:
    
    reader = csv.reader(infile)
    header = next(reader)
    
    for row in reader:
        if not row: continue
        word = row[0].strip().lower()
        if word in dictionary:
            outfile.write(word + "\n")
