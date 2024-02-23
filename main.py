
from flask import Flask, render_template, request, jsonify
import requests
from datetime import datetime
from dateutil.relativedelta import relativedelta

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)


@app.route("/",methods=['GET','POST'])
def index():
   return render_template('index.html')  


@app.route('/searchStock', methods=['GET', 'POST'])
def search_stock():
    # json_data = request.get_json()
    search_query = request.args.get("search_query")   
    # search_query = json_data["search_query"]
    data = companyTab(search_query)
    return jsonify(data = data)

def companyTab(search_query):
    global tickerSymbol
    try:
        req=requests.get(f'https://finnhub.io/api/v1/stock/profile2?symbol={search_query.upper()}&token=cn1kcm1r01qvjam261qgcn1kcm1r01qvjam261r0')
        if req.status_code==200:
            data = req.json()
            if not data:
                return {'error':"Data Not Found!"}
            logo         = data['logo']
            CompanyName  = data['name']
            tickerSymbol = data['ticker']
            exchangeCode = data['exchange']
            startdate    = data['ipo']
            category     = data['finnhubIndustry']
            return {
                'logo': logo,
                'name': CompanyName,
                'ticker': tickerSymbol,
                'exchange': exchangeCode,
                'ipo': startdate,
                'finnhubIndustry': category
            }
    except Exception as e:
        return e


@app.route("/stockSummary",methods=['GET','POST'])
def stock_summary():
    search_query = request.args.get("search_query")
    data = summaryTab(search_query)
    return jsonify(data = data)

def summaryTab(search_query):
    try:
        req=requests.get(f'https://finnhub.io/api/v1/quote?symbol={search_query.upper()}&token=cn1kcm1r01qvjam261qgcn1kcm1r01qvjam261r0')
        if req.status_code ==200:
            data           = req.json()
            tradingDay            = datetime.utcfromtimestamp(data['t']).date().strftime('%d %B, %Y')
            previousClosingPrice  = data['pc']
            openingPrice          = data['o']
            highPrice             = data['h']
            lowPrice              = data['l']
            change                = data['d']
            changePercentage      = data['dp']
            return {
                'ticker': search_query.upper(),
                't': tradingDay,
                'pc': previousClosingPrice,
                'o': openingPrice,
                'h': highPrice,
                'l': lowPrice,
                'd': change,
                'dp': changePercentage,
            }    
    except Exception as e:
        return e
    
@app.route("/trends",methods=['GET','POST'])
def stock_trends():
    search_query = request.args.get("search_query")
    data = stockTrends(search_query)
    return jsonify(data = data)

def stockTrends(search_query):
    try:
        recommendreq=requests.get(f'https://finnhub.io/api/v1/stock/recommendation?symbol={search_query.upper()}&token=cn1kcm1r01qvjam261qgcn1kcm1r01qvjam261r0')
        if recommendreq.status_code == 200:
            rec = recommendreq.json()
            strongSell            = rec[0] ['strongSell']
            sell                  = rec[0] ['sell']
            hold                  = rec[0] ['hold']
            buy                   = rec[0] ['buy']
            strongBuy             = rec[0] ['strongBuy']
            return {
                'strongSell': strongSell,
                'sell': sell,
                'hold': hold,
                'buy': buy,
                'strongBuy': strongBuy
            }    
    except Exception as e:
        return e

@app.route("/chartTab",methods=['GET','POST'])
def chart_tab():
    search_query = request.args.get("search_query")
    x1y1, x2y2 = chartsTab(search_query)
    data = {'x1y1':x1y1,'x2y2':x2y2}
    return jsonify(data = data)

def chartsTab(search_query):
    try:
        current_date = datetime.now()
        from_date = (current_date - relativedelta(months=6, days=1)).strftime('%Y-%m-%d')
        current_date= current_date.strftime('%Y-%m-%d')
        req=requests.get(f'https://api.polygon.io/v2/aggs/ticker/{search_query.upper()}/range/1/day/{from_date}/{current_date}?adjusted=true&sort=asc&apiKey=6VuFDjisS_fG7LsijpChZssp69HnBRS9')
        if req.status_code==200:
            data = req.json()
            data_nested = data['results']
            result_x1y1 = []
            result_x2y2 = []
            for item in data_nested:    
                date         = item['t']
                stockPrice  = item['c']
                volume = item['v']
                result_x1y1.append([date, stockPrice])
                result_x2y2.append([date, volume])
            return result_x1y1, result_x2y2
    except Exception as e:
        return e


@app.route("/newsTab",methods=['GET','POST'])
def news_tab():
    search_query = request.args.get("search_query")   
    Image, Title, Date, OriginalPost = newsTab(search_query)
    data = {'image':Image,'headline':Title, 'datetime':Date ,'url':OriginalPost }
    return jsonify(data = data)

def newsTab(search_query):
    try:
        current_date = datetime.now()
        date_30 = (current_date - relativedelta(months=0, days=30)).strftime('%Y-%m-%d')
        current_date= current_date.strftime('%Y-%m-%d')
        req=requests.get(f'https://finnhub.io/api/v1/company-news?symbol={search_query.upper()}&from={date_30}&to={current_date}&token=cn1kcm1r01qvjam261qgcn1kcm1r01qvjam261r0')
        if req.status_code==200:
            data = req.json()
            img=[]
            title=[]
            date=[]
            post=[]
            count=0
            for item in data:
                if item['image'].strip()!="" and item['headline'].strip()!="" and item['datetime'] is not None and item['url'].strip()!="":
                    count+=1
                    Image = item['image']
                    Title = item['headline']
                    Date  = datetime.utcfromtimestamp(item['datetime'])
                    OriginalPost = item['url']
                    img.append(Image)
                    title.append(Title)
                    date.append(Date.date().strftime('%d %B, %Y'))
                    post.append(OriginalPost)
                    if count==5:
                        break
            return img, title, date, post
    except Exception as e:
        return e
    return

if __name__ == "__main__":
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host="127.0.0.1", port=8080, debug=True)

# [END gae_python3_app]
# [END gae_python38_app]
