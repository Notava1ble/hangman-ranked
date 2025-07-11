from collections import Counter
import string
from typing import List

def letter_frequencies_from_file(filepath: str, n: int) -> dict:
    with open(filepath, 'r', encoding='utf-8') as file:
        # Read all non-empty lines, strip whitespace, and limit to first n words
        words = [line.strip().lower() for line in file if line.strip()][:n]

    # Join all words and filter only alphabetic characters
    all_letters = ''.join(words)
    

    letter_frequencies_from_string(all_letters)

def letter_frequencies_from_string(letters: str) -> dict:
    filtered_letters = [char for char in letters if char in string.ascii_lowercase]
    frequencies = Counter(letters)
    return dict(sorted(frequencies.items()))    


# freq = letter_frequencies_from_file("./temp/clean-words-20k.txt", 500)
freq = letter_frequencies_from_string("auioempnraiuomnpstraiuopertsncmauieomlnpstqetruioeioumpstnklraqreuiopmtnsfpioertuasauioepmauiomnptsceqrlbaiuoterpaioeupmqrarbintodsarbieogharbideslvaepolrtsinarbielodvstqarbiedovtsluioaemlprtuipoamlertuionpsartlarbiedopuyieopsarmarbiosdwldarbifsxcarbivsarbiscvodeparbisvdarbivsdamirtdhsarbimosundeparbimnofdesutqarbimnodetcabrionmdeuioeamnarbimnoedtpzertuioamleuiosmtrarbiedpovuiopletrcsnertiosfpuarbipodeeuiostaclyarvbiepmoabripoedvtyarbipotveduioaerptsleioulstycprfparibmndetsgarbipoemuiosaprtaeiouqpmleruioatscaentrsopuiydbgheriopstyukaeruioplscfyarbipodegmarbipdeocarbintpodearbipdeosnmuarbimnosedarbimdoesharbipomnedtsarhkxsmdiskfjdgarbipmabrinsectmpodlarbimnpoarbimnparbipmndewarbimnpodearbiptcodengarhskncuarbipodmfgtemdhsoflanparbipodmnesvteiobsadtgpzeiosgnfcalytauioetmpaioplstmueaiomepuskrtaeopsrtjydaiopertyslaestuiodraiouertypaeiousptldaioeuplrdsvaiopertngsdcbmaiopertmlsndkwqwioauemlpioafdrtswaeriompsioasertmnvaertuiopsnldauiompsuisadperasuioretnlaertiolpmioautyweaiosmlfdeuaslpirueyotasopuriymaisoenftlpasoirhepljfoihdaufweajoisdufwnaoerjgwoieyfhslnapoutrnjilkepoiasnmlertgcsiapoujrwausidpojfaopsiuemapioufjler")
print(freq)