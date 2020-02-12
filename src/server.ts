import express from "express";
import rq from "request-promise";
import cheerio from "cheerio";

const app = express();

app.get('/', function (req: express.Request, res: express.Response) {
  var options = {
    uri: 'http://www.google.com',
    transform: function (body: any) {
        return cheerio.load(body);
    }
};

rp(options)
    .then(function ($) {
        // Process html like you would with jQuery...
    })
    .catch(function (err) {
        // Crawling failed or Cheerio choked...
    });
});
app.listen(3000, function () {
    console.log("ㅋㅋ");
});


//http://www.koreawqi.go.kr/wQDDRealTotalDataList_D.wq?item_id=M69&action_type=L&action_type_seq=1&search_flag=list&auto_flag=&auto_site_id=S01007&yesterday_search_date=2020-02-12&auto_search_date=2020-02-12&isParam=null&row_cnt=576&search_ct=1&user_lv=9&search_data_type=1&search_flag2=1&river_id=R01&site_id=%27S01004%27&site_name=%B1%B8%B8%AE&search_interval=HOUR&search_date_from=2020-02-12&search_date_to=2020-02-12&order_type_1=MSR_DATE&order_type_2=ASC