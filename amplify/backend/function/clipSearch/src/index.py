import json
import wolframalpha
from googlesearch import search
import re



templateString = "https://www.khanacademy.org/search?referer=%2F&page_search_query={}"

def getResult(question):
    app_id = '7VELAH-V9EG8GKT3Q'
    if "summarizeQ" in question:
        question = question.replace('summarizeQ ', "")
        numSentences = int(question[0])
        question = question[1:]
        return getSummary(question, numSentences)
    
    if 'googleQ' in question:
        return googleSearch(question)
    if 'learnQ' in question:
        return khanSearch(question)


    try:
        client = wolframalpha.Client(app_id)
        res = client.query(question)
        results = next(res.results)
        answer = results.text
    except Exception as e:
        return googleSearch(question)
    return answer

def googleSearch(query):
    a = list(search(query, tld="co.in", num=10, stop=10, pause=2))
    str1 = ""
    for i in a:
        str1 += i
        str1 += "\n"
    return str1

def getSummary(text, n):
    dictWeights = {}
    sentenceWeights = []
    final = ""
    cleanedText = cleanText(text)
    originalSentences = getSentences(text)
    newSentences = [cleanText(sentence) for sentence in originalSentences]
    uniqueWords = getUniqueWords(newSentences)
    for key in uniqueWords:
        dictWeights[key] = findCount(key, cleanedText)
    for sentence in newSentences:
        weight = 0
        a = len(sentence.split()) + 1
        for word in sentence.split():
            weight += dictWeights[word]
        sentenceWeights.append(weight / a)

    finalWeights = sorted(range(len(sentenceWeights)), key=lambda x: sentenceWeights[x])[-n:]
    for i in range(len(originalSentences)):
        if i in finalWeights:
            final += originalSentences[i]
            final += "."
    return final
def getSentences(text):
    return text.split(".")

def cleanText(text):
    text = re.sub(r'\[[0-9]*\]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub('[^a-zA-Z]', ' ', text )
    text = re.sub(r'\s+', ' ', text)
    text = text.lower()
    return text
def getUniqueWords(sentences):
    allWords = []
    for sentence in sentences:
        for word in sentence.split():
            allWords.append(word)
    allWordsSet = set(allWords)
    allWords = list(allWordsSet)
    return allWords
def findCount(key, text):
    count = 0
    for word in text.split():
        if key.lower() == word.lower():
            count += 1
    return count
def khanSearch(query):
    return createKhanLink(query)
def createKhanLink(query):
    query = query.replace('learn ', '')
    query = query.replace(" ", "+")
    link = templateString.format(query)
    return link

def handler(event, context):
  event2 = json.dumps(event)[11:-2]
  a = getResult(event2)
  return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
            
        },
        "body": a
    }
