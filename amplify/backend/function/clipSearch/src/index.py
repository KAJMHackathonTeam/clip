import json
import wolframalpha
from googlesearch import search



templateString = "https://www.khanacademy.org/search?referer=%2F&page_search_query={}"

def getResult(question):
    app_id = '7VELAH-V9EG8GKT3Q'
    if 'googleQ' in question:
        return googleSearch(question)
    if 'learn' in question:
        return khanSearch(question)
    
    try:
        client = wolframalpha.Client(app_id)
        res = client.query(question)
        results = next(res.results)
        answer = results.text
    except Exception as e:
        print(e)
        return "I can't answer that one. Go check out the community forum!"
    return answer

def googleSearch(query):
    a = list(search(query, tld="co.in", num=10, stop=10, pause=2))
    return a

def khanSearch(query):
    return createKhanLink(query)
def createKhanLink(query):
    query = query.replace('learn ', '')
    query = query.replace(" ", "+")
    link = templateString.format(query)
    return link

def handler(event, context):
  a = getResult(event["query"])
  return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": a
    }
