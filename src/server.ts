import express from "express";
import rp from "request-promise";
import cheerio from "cheerio";
import Iconv from "iconv-lite";

const app = express();

app.get('/', function (req: express.Request, res: express.Response) {
  const tzO = new Date().getTimezoneOffset() * 60000; // Timezone 설정 (Seoul)
  
  const date = new Date(Date.now() - tzO).toISOString().split("T")[0]; // 현재 시간 구하기
  

  const options = { // request-promise 옵션 설정
    uri: `http://www.koreawqi.go.kr/wQDDRealTotalDataList_D.wq?item_id=M69&action_type=L&action_type_seq=1&auto_flag=&auto_site_id=S01007&search_data_type=1&search_flag2=1&river_id=R01&site_id=%27S01004%27&site_name=%B1%B8%B8%AE&search_interval=HOUR&search_date_from=${date}&search_date_to=${date}&order_type_1=MSR_DATE&order_type_2=ASC`,
    method: "GET",
    encoding: null, // null로 안 해주면 EUC-KR 오류 남.
    timeout: 1000,
    headers: { // 헤더 부분 설정
      'User-Agent': 'HT-API/1.0',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

  rp(options)
  .then((body) => {
    body = Iconv.decode(Buffer.from(body), 'EUC-KR'); // EUC-KR → UTF-8 변환
    const $ = cheerio.load(body);
    const list = $("body > div > table > tbody > tr");         
    
    if(list.length <= 3) res.json({ result: "NO_CONTENT" }); // 값 없음 {204}
          
    const $$ = cheerio.load(list[list.length - 1]); // 제일 마지막 값 (최근 측정 온도)
    const date = $$("td:nth-child(1)").text().replace(/\s/g, "").substring(0, 10); // 날짜 부분
    const time = $$("td:nth-child(1)").text().replace(/\s/g, "").substring(10, 13); // 시간 부분
    const tem = $$("td:nth-child(3)").text().trim(); // 온도 부분    

    res.json( { result: "OK", date, time, tem } ); // JSON 출력 {200}
  })    
  .catch((err) => { 
    console.log(err) // 오류 로그 출력
    res.json({ result: "REQUEST_TIMEOUT" }); // 타임 아웃 {408}
  });
});

app.listen(3000); // 서버 열기