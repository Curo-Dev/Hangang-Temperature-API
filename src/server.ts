import express from "express";
import rp from "request-promise";
import cheerio from "cheerio";
import Iconv from "iconv-lite";

const app = express();

app.get('/', function (req: express.Request, res: express.Response) {
  const tzO = new Date().getTimezoneOffset() * 60000;
  const date = new Date(Date.now() - tzO).toISOString().split("T")[0];    

  const options = {
    uri: `http://www.koreawqi.go.kr/wQDDRealTotalDataList_D.wq?item_id=M69&action_type=L&action_type_seq=1&auto_flag=&auto_site_id=S01007&search_data_type=1&search_flag2=1&river_id=R01&site_id=%27S01004%27&site_name=%B1%B8%B8%AE&search_interval=HOUR&search_date_from=${date}&search_date_to=${date}&order_type_1=MSR_DATE&order_type_2=ASC`,
    method: "GET",
    encoding: null,
    headers: {
      'User-Agent': 'HT-API/1.0',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

  rp(options)
  .then((body) => {
    body = Iconv.decode(Buffer.from(body), 'EUC-KR');            
    const $ = cheerio.load(body);
    const list = $("body > div > table > tbody > tr");
    
    let array: any = [];

    for(let i = 2; i < list.length; i++) {
      const $$ = cheerio.load(list[i]);
      const date = $$("td:nth-child(1)").text().replace(/\s/g, "").substring(0, 10);
      const time = $$("td:nth-child(1)").text().replace(/\s/g, "").substring(10, 13);
      const tem = $$("td:nth-child(3)").text().trim();
      console.log(`${date} (${time}) : ${tem}`);  
      // console.log(row.children[1].children[0].data);  
      //body > div > table > tbody > tr:nth-child(3) > td:nth-child(3)      
    }    
    res.send(body);
  })    
  .catch((err) => { console.log(err) });
});

app.listen(3000, function () {
  console.log("ㅋㅋ");
});