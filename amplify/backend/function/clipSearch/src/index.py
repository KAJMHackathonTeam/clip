import json
import wolframalpha
from googlesearch import search

def handler(event, context):
  print('received event:')
  print(event)
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps('Hello from your new Amplify Python lambda!')
  }

def getResult(question):
    app_id = '7VELAH-V9EG8GKT3Q'
    if 'googleQ' in question:
        return googleSearch(question)
    #if 'learn' in question:
        #return khanSearch(question)
    
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