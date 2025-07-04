from profanity_check import predict_prob

# 1) Load your pre-filtered words
with open("./temp/clean.txt", "r", encoding="utf-8") as f:
    words = [w.strip() for w in f if w.strip()]

# 2) Get offensive probabilities for each word (0.0–1.0)
probs = predict_prob(words)

# 3) Choose a threshold: e.g. 0.75 or higher
THRESHOLD = 0.75

# 4) Split based on threshold
clean_words   = [w for w, p in zip(words, probs) if p < THRESHOLD]
removed_words = [w for w, p in zip(words, probs) if p >= THRESHOLD]

# 5) Write out the results
with open("./temp/ml_clean.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(clean_words))

with open("./temp/ml_removed.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(removed_words))

print(f"Threshold = {THRESHOLD:.2f} → removed {len(removed_words)} words, kept {len(clean_words)}.")
