import json
import wolframalpha
from googlesearch import search



templateString = "https://www.khanacademy.org/search?referer=%2F&page_search_query={}"

def getResult(question):
    app_id = 'GEUQQW-H3AXJRHRK4'
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
        return googleSearch(question)
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
  event2 = json.dumps(event)[11:-2]
  a = getResult(event2)
  return {
      "statusCode":200,
      "headers": {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Request-Method": "ANY"
      },
      "body": a
  }
